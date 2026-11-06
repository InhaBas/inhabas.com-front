import { getAccessToken } from './token';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  auth?: boolean;
  body?: unknown;
}

export interface ApiErrorBody {
  status?: number;
  code?: string;
  message?: string;
}

export class ApiError extends Error {
  httpStatus: number;
  body: ApiErrorBody | null; // 본문 파싱에 실패하면 null
  auth: boolean; // 요청에 토큰을 실었는지
  path: string; // 쿼리스트링을 뺀 경로. 에러 분기에 쓴다

  constructor(httpStatus: number, body: ApiErrorBody | null, auth: boolean, path: string) {
    super(`${httpStatus} ${body?.code ?? ''} ${body?.message ?? ''}`.trim());
    this.name = 'ApiError';
    this.httpStatus = httpStatus;
    this.body = body;
    this.auth = auth;
    this.path = path;
  }
}

// 모든 요청이 거치는 fetch 래퍼. alert·navigate·refresh·토큰 쓰기 같은 부수효과는 하지 않는다.
// 빈 본문 성공(204, 201 빈 본문 등)은 null을 반환하므로 호출 쪽은 request<null>로 쓴다.
export const request = async <T>(
  path: string,
  { method = 'GET', auth = false, body }: RequestOptions = {},
): Promise<T> => {
  const isFormData = body instanceof FormData;

  const headers: Record<string, string> = {};
  if (auth) headers.Authorization = `Bearer ${getAccessToken()}`;
  // FormData면 브라우저가 boundary를 붙인 multipart Content-Type을 정한다
  if (!isFormData) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });

  if (!res.ok) {
    let errorBody: ApiErrorBody | null = null;
    try {
      errorBody = await res.json();
    } catch {
      errorBody = null;
    }
    throw new ApiError(res.status, errorBody, auth, path.split('?')[0]);
  }

  if (res.status === 204 || res.headers.get('content-length') === '0' || res.body === null) {
    // TanStack Query v5는 queryFn이 undefined를 반환하면 에러로 취급하므로 null을 쓴다
    return null as T;
  }

  return res.json() as Promise<T>;
};
