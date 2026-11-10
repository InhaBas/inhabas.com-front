import { matchQuery, QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { boardMutations, boardQueries } from './board';
import { queryClient } from './queryClient';
import { setAccessToken } from '../api/token';
import { createWrapper } from '../test/queryClient';
import { server } from '../test/server';

import type { MockInstance } from 'vitest';

const API = 'http://api.test';

beforeEach(() => setAccessToken('tok'));

describe('boardQueries', () => {
  it('queryKey는 [boards, list|detail|count, params] 구조다', () => {
    const params = { board: 'free', page: 1, size: 10, search: '' };

    expect(boardQueries.all()).toEqual(['boards']);
    expect(boardQueries.list(params).queryKey).toEqual(['boards', 'list', params]);
    expect(boardQueries.detail({ board: 'free', id: '3', auth: true }).queryKey).toEqual([
      'boards',
      'detail',
      { board: 'free', id: '3', auth: true },
    ]);
    expect(boardQueries.count({ group: 'project' }).queryKey).toEqual([
      'boards',
      'count',
      { group: 'project' },
    ]);
  });

  it('목록은 page를 0부터 세어 요청하고 게시판 종류별 경로를 고른다', async () => {
    let url = '';
    server.use(
      http.get(`${API}/project/alpha`, ({ request }) => {
        url = request.url;
        return HttpResponse.json({ data: [], totalPages: 1 });
      }),
    );

    const { result } = renderHook(
      () => useQuery(boardQueries.list({ board: 'alpha', page: 3, size: 5, search: 'a b' })),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(url).toBe(`${API}/project/alpha?page=2&size=5&search=a%20b`);
  });

  it('공개 게시판 목록은 토큰 없이, 일반 게시판은 토큰과 함께 부른다', async () => {
    const auth: Record<string, string | null> = {};
    server.use(
      http.get(`${API}/board/storage`, ({ request }) => {
        auth.opensource = request.headers.get('authorization');
        return HttpResponse.json({});
      }),
      http.get(`${API}/board/free`, ({ request }) => {
        auth.free = request.headers.get('authorization');
        return HttpResponse.json({});
      }),
    );
    const wrapper = createWrapper();

    const a = renderHook(
      () => useQuery(boardQueries.list({ board: 'opensource', page: 1, size: 10, search: '' })),
      { wrapper },
    );
    const b = renderHook(
      () => useQuery(boardQueries.list({ board: 'free', page: 1, size: 10, search: '' })),
      { wrapper },
    );
    await waitFor(() =>
      expect(a.result.current.isSuccess && b.result.current.isSuccess).toBe(true),
    );

    expect(auth).toEqual({ opensource: null, free: 'Bearer tok' });
  });
});

describe('boardMutations', () => {
  const noContent = (status: number) =>
    new HttpResponse(null, { status, headers: { 'Content-Length': '0' } });

  // 같은 게시판의 목록은 부분 일치하고, 다른 게시판 목록·상세·개수는 일치하지 않는다
  const expectOnlyFreeLists = (spy: MockInstance<QueryClient['invalidateQueries']>) => {
    expect(spy).toHaveBeenCalledTimes(1);
    const filters = spy.mock.calls[0][0]!;
    expect(filters.queryKey).toEqual(['boards', 'list', { board: 'free' }]);

    const matches = (queryKey: unknown[]) => matchQuery(filters, { queryKey } as never);
    const full = { board: 'free', page: 2, size: 10, search: '' };
    expect(matches(['boards', 'list', full])).toBe(true);
    expect(matches(['boards', 'list', { ...full, board: 'alpha' }])).toBe(false);
    expect(matches(['boards', 'detail', { board: 'free', id: '7', auth: true }])).toBe(false);
    expect(matches(['boards', 'count', { group: 'board' }])).toBe(false);
  };

  const body = { title: 't', content: 'c', files: [] };

  it('create 성공 시 그 게시판의 목록만 invalidate한다', async () => {
    server.use(http.post(`${API}/board/free`, () => noContent(201)));
    const spy = vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue();

    const { result } = renderHook(() => useMutation(boardMutations.create()), {
      wrapper: createWrapper(),
    });
    result.current.mutate({ board: 'free', body });

    await waitFor(() => expect(spy).toHaveBeenCalled());
    expectOnlyFreeLists(spy);
  });

  it('update는 POST로 보내고 상세는 invalidate하지 않는다', async () => {
    server.use(http.post(`${API}/board/free/7`, () => noContent(204)));
    const spy = vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue();

    const { result } = renderHook(() => useMutation(boardMutations.update()), {
      wrapper: createWrapper(),
    });
    result.current.mutate({ board: 'free', id: '7', body });

    await waitFor(() => expect(spy).toHaveBeenCalled());
    expectOnlyFreeLists(spy);
  });

  it('delete 성공 시 그 게시판의 목록만 invalidate한다', async () => {
    server.use(http.delete(`${API}/board/free/7`, () => noContent(204)));
    const spy = vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue();

    const { result } = renderHook(() => useMutation(boardMutations.delete()), {
      wrapper: createWrapper(),
    });
    result.current.mutate({ board: 'free', id: '7' });

    await waitFor(() => expect(spy).toHaveBeenCalled());
    expectOnlyFreeLists(spy);
  });
});
