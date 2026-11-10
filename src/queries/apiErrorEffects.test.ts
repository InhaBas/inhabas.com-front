import { http, HttpResponse } from 'msw';

import {
  handleApiError,
  isTokenExpiredError,
  refreshAccessTokenOnce,
  registerNavigate,
} from './apiErrorEffects';
import { queryClient } from './queryClient';
import { ApiError } from '../api/client';
import { getAccessToken, getFailRefreshing, setAccessToken, setFailRefreshing } from '../api/token';
import { server } from '../test/server';

const API = 'http://api.test';

const apiError = (status: number, code: string, auth = true, path = '/some') =>
  new ApiError(status, { status, code, message: `msg-${code}` }, auth, path);

const navigate = vi.fn();

beforeEach(() => {
  navigate.mockReset();
  registerNavigate(navigate);
  setAccessToken('default');
  setFailRefreshing(false);
  vi.spyOn(window, 'alert').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => registerNavigate(null));

describe('isTokenExpiredError', () => {
  it.each(['A005', 'A006', 'A007'])('auth 요청의 %s는 토큰 만료다', (code) => {
    expect(isTokenExpiredError(apiError(401, code))).toBe(true);
  });

  it('auth: false 요청이나 다른 코드, ApiError가 아닌 값은 아니다', () => {
    expect(isTokenExpiredError(apiError(401, 'A005', false))).toBe(false);
    expect(isTokenExpiredError(apiError(401, 'A001'))).toBe(false);
    expect(isTokenExpiredError(new Error('A005'))).toBe(false);
    expect(isTokenExpiredError(new ApiError(401, null, true, '/x'))).toBe(false);
  });
});

describe('handleApiError', () => {
  it('ApiError가 아니면 console.error만 한다', () => {
    const err = new Error('boom');

    handleApiError(err);

    expect(console.error).toHaveBeenCalledWith(err);
    expect(window.alert).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('본문이 null이면 아무것도 하지 않는다', () => {
    handleApiError(new ApiError(500, null, true, '/x'));

    expect(window.alert).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('일반 에러는 코드와 메시지가 든 alert만 띄운다', () => {
    handleApiError(apiError(400, 'C001'));

    expect(window.alert).toHaveBeenCalledWith('웹 팀에 문의해주세요. \nC001 : msg-C001');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('auth 401은 alert 후 navigate(-1)', () => {
    handleApiError(apiError(401, 'A001'));

    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it('auth: false 401은 이동하지 않는다', () => {
    handleApiError(apiError(401, 'A001', false));

    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(navigate).not.toHaveBeenCalled();
  });

  it('auth 403은 navigate(-1)', () => {
    handleApiError(apiError(403, 'A002', true, '/board/1'));

    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it('/signUp의 auth 403은 홈(/)으로 이동한다', () => {
    handleApiError(apiError(403, 'A002', true, '/signUp'));

    expect(navigate).toHaveBeenCalledWith('/');
  });

  it('auth: false 403은 이동하지 않는다', () => {
    handleApiError(apiError(403, 'A002', false));

    expect(navigate).not.toHaveBeenCalled();
  });

  it('404는 auth와 관계없이 /notfound로 이동한다', () => {
    handleApiError(apiError(404, 'B001', false));

    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith('/notfound');
  });

  it('navigate가 등록되기 전이면 이동만 건너뛴다', () => {
    registerNavigate(null);

    expect(() => handleApiError(apiError(404, 'B001'))).not.toThrow();
    expect(window.alert).toHaveBeenCalledTimes(1);
  });

  it('body.status가 아니라 body 안의 status로 분기한다(httpStatus는 보지 않는다)', () => {
    handleApiError(new ApiError(200, { status: 404, code: 'X', message: 'm' }, true, '/x'));

    expect(navigate).toHaveBeenCalledWith('/notfound');
  });

  describe('토큰 만료(A005/A006/A007)', () => {
    let refreshCalls: number;

    beforeEach(() => {
      refreshCalls = 0;
      server.use(
        http.post(`${API}/token/refresh`, async () => {
          refreshCalls += 1;
          await new Promise((r) => setTimeout(r, 10));
          return HttpResponse.json({ accessToken: 'new-token' });
        }),
      );
    });

    it('alert·이동 없이 refresh를 시작한다', async () => {
      handleApiError(apiError(401, 'A005'));
      await vi.waitFor(() => expect(getAccessToken()).toBe('new-token'));

      expect(window.alert).not.toHaveBeenCalled();
      expect(navigate).not.toHaveBeenCalled();
      expect(refreshCalls).toBe(1);
    });

    it('동시에 여러 번 들어와도 refresh는 1회만 보낸다(single-flight)', async () => {
      handleApiError(apiError(401, 'A005'));
      handleApiError(apiError(401, 'A006'));
      handleApiError(apiError(401, 'A007'));
      await vi.waitFor(() => expect(getAccessToken()).toBe('new-token'));

      expect(refreshCalls).toBe(1);
    });

    it('끝난 뒤의 새 만료는 다시 refresh한다', async () => {
      await refreshAccessTokenOnce();
      await refreshAccessTokenOnce();

      expect(refreshCalls).toBe(2);
    });
  });
});

describe('refreshAccessTokenOnce', () => {
  it('성공하면 새 토큰을 저장하고 failRefreshing은 건드리지 않는다', async () => {
    server.use(http.post(`${API}/token/refresh`, () => HttpResponse.json({ accessToken: 'abc' })));

    await refreshAccessTokenOnce();

    expect(getAccessToken()).toBe('abc');
    expect(getFailRefreshing()).toBe(false);
  });

  it('성공하면 만료 에러가 난 활성 쿼리만 invalidate한다', async () => {
    server.use(http.post(`${API}/token/refresh`, () => HttpResponse.json({ accessToken: 'abc' })));
    const spy = vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue();

    await refreshAccessTokenOnce();

    expect(spy).toHaveBeenCalledTimes(1);
    const filters = spy.mock.calls[0][0] as {
      type: string;
      predicate: (q: { state: { status: string; error: unknown } }) => boolean;
    };
    expect(filters.type).toBe('active');
    const q = (status: string, error: unknown) => ({ state: { status, error } });
    expect(filters.predicate(q('error', apiError(401, 'A005')))).toBe(true);
    expect(filters.predicate(q('error', apiError(400, 'C001')))).toBe(false);
    expect(filters.predicate(q('success', null))).toBe(false);
  });

  it('refresh가 non-2xx면 토큰을 default로 되돌리고 failRefreshing을 켠다', async () => {
    server.use(
      http.post(`${API}/token/refresh`, () =>
        HttpResponse.json({ status: 401, code: 'A004', message: 'x' }, { status: 401 }),
      ),
    );
    setAccessToken('old');
    const spy = vi.spyOn(queryClient, 'invalidateQueries').mockResolvedValue();

    await refreshAccessTokenOnce();

    expect(getAccessToken()).toBe('default');
    expect(getFailRefreshing()).toBe(true);
    expect(spy).not.toHaveBeenCalled();
  });

  it('refresh가 네트워크 오류여도 같은 실패 처리를 한다', async () => {
    server.use(http.post(`${API}/token/refresh`, () => HttpResponse.error()));
    setAccessToken('old');

    await refreshAccessTokenOnce();

    expect(getAccessToken()).toBe('default');
    expect(getFailRefreshing()).toBe(true);
  });

  it('refresh 요청 본문에 ibas_refresh 쿠키를 싣고 토큰 헤더는 싣지 않는다', async () => {
    document.cookie = 'ibas_refresh=cookie-value';
    let body: unknown;
    let auth: string | null = 'unset';
    server.use(
      http.post(`${API}/token/refresh`, async ({ request: req }) => {
        body = await req.json();
        auth = req.headers.get('authorization');
        return HttpResponse.json({ accessToken: 't' });
      }),
    );

    await refreshAccessTokenOnce();

    expect(body).toEqual({ refreshToken: 'cookie-value' });
    expect(auth).toBeNull();
    document.cookie = 'ibas_refresh=; max-age=0';
  });
});
