import { useMutation } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { commentMutations, commentQueries } from './comment';
import { queryClient } from './queryClient';
import { setAccessToken } from '../api/token';
import { createWrapper } from '../test/queryClient';
import { server } from '../test/server';

const API = 'http://api.test';

beforeEach(() => setAccessToken('tok'));

describe('commentQueries', () => {
  it('queryKey는 [comments, list, params] 구조다', () => {
    const params = { menuId: 1, boardId: '5', auth: true };

    expect(commentQueries.all()).toEqual(['comments']);
    expect(commentQueries.lists()).toEqual(['comments', 'list']);
    expect(commentQueries.list(params).queryKey).toEqual(['comments', 'list', params]);
  });
});

describe('commentMutations', () => {
  const target = { menuId: 1, boardId: '5' };

  it('create는 대댓글 정보를 본문으로 보내고 그 게시글 댓글 목록을 invalidate한다', async () => {
    let body: unknown;
    server.use(
      http.post(`${API}/board/1/5/comment`, async ({ request }) => {
        body = await request.json();
        return new HttpResponse(null, { status: 201, headers: { 'Content-Length': '0' } });
      }),
    );
    const spy = vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue();

    const { result } = renderHook(() => useMutation(commentMutations.create()), {
      wrapper: createWrapper(),
    });
    result.current.mutate({ ...target, body: { parentCommentId: null, content: '안녕' } });

    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));
    expect(body).toEqual({ parentCommentId: null, content: '안녕' });
    // auth는 키에 넣지 않아 auth 값과 관계없이 부분 일치한다
    expect(spy).toHaveBeenCalledWith({ queryKey: ['comments', 'list', target] });
  });

  it('update·delete도 같은 대상을 invalidate한다', async () => {
    server.use(
      http.put(`${API}/comment/9`, () => new HttpResponse(null, { status: 204 })),
      http.delete(`${API}/comment/9`, () => new HttpResponse(null, { status: 204 })),
    );
    const spy = vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue();
    const wrapper = createWrapper();

    const update = renderHook(() => useMutation(commentMutations.update()), { wrapper });
    update.result.current.mutate({ ...target, id: 9, content: 'x' });
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));

    const del = renderHook(() => useMutation(commentMutations.delete()), { wrapper });
    del.result.current.mutate({ ...target, id: 9 });
    await waitFor(() => expect(spy).toHaveBeenCalledTimes(2));

    expect(spy).toHaveBeenNthCalledWith(1, { queryKey: ['comments', 'list', target] });
    expect(spy).toHaveBeenNthCalledWith(2, { queryKey: ['comments', 'list', target] });
  });

  it('실패하면 invalidate하지 않는다', async () => {
    server.use(
      http.put(`${API}/comment/9`, () =>
        HttpResponse.json({ status: 400, code: 'C001', message: 'x' }, { status: 400 }),
      ),
    );
    const spy = vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue();

    const { result } = renderHook(() => useMutation(commentMutations.update()), {
      wrapper: createWrapper(),
    });
    result.current.mutate({ ...target, id: 9, content: 'x' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(spy).not.toHaveBeenCalled();
  });
});
