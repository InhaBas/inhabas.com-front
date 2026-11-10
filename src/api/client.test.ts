import { http, HttpResponse } from 'msw';

import { ApiError, request } from './client';
import { setAccessToken } from './token';
import { server } from '../test/server';

const API = 'http://api.test';

beforeEach(() => setAccessToken('default'));

describe('request', () => {
  it('성공하면 JSON 본문을 그대로 반환한다', async () => {
    server.use(http.get(`${API}/items`, () => HttpResponse.json({ id: 1, name: 'a' })));

    await expect(request('/items')).resolves.toEqual({ id: 1, name: 'a' });
  });

  it('204면 undefined가 아니라 null을 반환한다', async () => {
    server.use(http.delete(`${API}/items/1`, () => new HttpResponse(null, { status: 204 })));

    await expect(request('/items/1', { method: 'DELETE' })).resolves.toBeNull();
  });

  it('201 빈 본문도 null을 반환한다', async () => {
    server.use(
      http.post(
        `${API}/items`,
        () => new HttpResponse(null, { status: 201, headers: { 'Content-Length': '0' } }),
      ),
    );

    await expect(request('/items', { method: 'POST', body: { a: 1 } })).resolves.toBeNull();
  });

  it('Content-Length 없는 빈 본문 200/201은 JSON 파싱 오류로 던진다(현재 동작, 의심 사항)', async () => {
    server.use(http.post(`${API}/items`, () => new HttpResponse(null, { status: 201 })));

    await expect(request('/items', { method: 'POST' })).rejects.toBeInstanceOf(SyntaxError);
  });

  it('auth가 false면 Authorization 없이 JSON Content-Type만 보낸다', async () => {
    let headers: Headers | undefined;
    server.use(
      http.get(`${API}/items`, ({ request: req }) => {
        headers = req.headers;
        return HttpResponse.json({});
      }),
    );
    setAccessToken('tok');

    await request('/items');

    expect(headers?.get('authorization')).toBeNull();
    expect(headers?.get('content-type')).toBe('application/json');
  });

  it('auth가 true면 토큰 저장소의 값을 Bearer로 붙인다', async () => {
    let auth: string | null = null;
    server.use(
      http.get(`${API}/me`, ({ request: req }) => {
        auth = req.headers.get('authorization');
        return HttpResponse.json({});
      }),
    );
    setAccessToken('tok-123');

    await request('/me', { auth: true });

    expect(auth).toBe('Bearer tok-123');
  });

  it('비로그인 토큰이어도 auth: true면 Bearer default를 보낸다(현재 동작)', async () => {
    let auth: string | null = null;
    server.use(
      http.get(`${API}/me`, ({ request: req }) => {
        auth = req.headers.get('authorization');
        return HttpResponse.json({});
      }),
    );

    await request('/me', { auth: true });

    expect(auth).toBe('Bearer default');
  });

  it('body는 JSON.stringify해서 보낸다', async () => {
    let received: unknown;
    server.use(
      http.post(`${API}/items`, async ({ request: req }) => {
        received = await req.json();
        return new HttpResponse(null, { status: 201, headers: { 'Content-Length': '0' } });
      }),
    );

    await request('/items', { method: 'POST', body: { title: '제목' } });

    expect(received).toEqual({ title: '제목' });
  });

  it('FormData는 Content-Type을 직접 정하지 않고(multipart) 그대로 보낸다', async () => {
    let contentType: string | null = null;
    let title: FormDataEntryValue | null = null;
    server.use(
      http.post(`${API}/upload`, async ({ request: req }) => {
        contentType = req.headers.get('content-type');
        title = (await req.formData()).get('title');
        return new HttpResponse(null, { status: 201, headers: { 'Content-Length': '0' } });
      }),
    );
    const form = new FormData();
    form.append('title', 'hello');

    await request('/upload', { method: 'POST', auth: true, body: form });

    expect(contentType).toMatch(/^multipart\/form-data; boundary=/);
    expect(title).toBe('hello');
  });

  it('에러 본문을 ApiError로 던진다(쿼리스트링을 뺀 path, auth 포함)', async () => {
    server.use(
      http.get(`${API}/board/1`, () =>
        HttpResponse.json({ status: 404, code: 'B001', message: '없음' }, { status: 404 }),
      ),
    );

    const error = (await await request('/board/1?page=2', { auth: true }).catch(
      (e) => e,
    )) as ApiError;

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      name: 'ApiError',
      httpStatus: 404,
      body: { status: 404, code: 'B001', message: '없음' },
      auth: true,
      path: '/board/1',
      message: '404 B001 없음',
    });
  });

  it('에러 본문이 JSON이 아니면 body는 null이다', async () => {
    server.use(http.get(`${API}/x`, () => new HttpResponse('<html>', { status: 502 })));

    const error = (await await request('/x').catch((e) => e)) as ApiError;

    expect(error).toBeInstanceOf(ApiError);
    expect(error.httpStatus).toBe(502);
    expect(error.body).toBeNull();
    expect(error.auth).toBe(false);
    expect(error.message).toBe('502');
  });
});
