import { NavigateFunction } from 'react-router-dom';

import { queryClient } from './queryClient';
import { refreshAccessToken } from '../api/auth';
import { ApiError } from '../api/client';
import { setAccessToken, setFailRefreshing } from '../api/token';

// queryClient.ts와 서로 import한다. 어느 쪽이 먼저 로드돼도 쓸 수 있도록
// 이 파일의 export는 호이스팅되는 function 선언으로 둔다.

const TOKEN_EXPIRED_CODES = ['A005', 'A006', 'A007'];

const isTokenExpiredError = (error: unknown) =>
  error instanceof ApiError && error.auth && TOKEN_EXPIRED_CODES.includes(error.body?.code ?? '');

// ---- 라우터 밖에서 navigate ----

let navigate: NavigateFunction | null = null;

// NavigationBridge가 등록한다. 등록 전이면 이동을 건너뛴다
export function registerNavigate(fn: NavigateFunction | null) {
  navigate = fn;
}

// ---- refresh 흐름 ----

let refreshing: Promise<void> | null = null;

// 동시에 들어온 A005/A006이 진행 중인 refresh 하나를 함께 기다린다(single-flight)
function refreshAccessTokenOnce(): Promise<void> {
  if (!refreshing) {
    refreshing = runRefresh().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

async function runRefresh() {
  try {
    const { accessToken } = await refreshAccessToken();
    setAccessToken(accessToken);
  } catch (error) {
    // non-2xx, 본문 파싱 실패, 네트워크 오류 모두 비로그인으로 되돌린다.
    // 로그인 유도는 App.tsx의 failRefreshing effect가 맡는다
    console.error('Error refreshing access token:', error);
    setFailRefreshing(true);
    setAccessToken('default');
    return;
  }

  // 토큰 만료로 실패한 활성 쿼리만 다시 가져온다. 이미 성공한 쿼리와 실패한 뮤테이션은 다시 보내지 않는다
  queryClient.invalidateQueries({
    type: 'active',
    predicate: (query) => query.state.status === 'error' && isTokenExpiredError(query.state.error),
  });
}

// ---- 공통 에러 처리 ----

// QueryCache·MutationCache의 onError에 연결한다. 옛 useFetch의 alert·navigate 분기를 그대로 옮겼다
export function handleApiError(error: unknown) {
  if (!(error instanceof ApiError)) {
    console.error(error);
    return;
  }

  const { body, auth, path } = error;
  if (body === null) return;

  if (isTokenExpiredError(error)) {
    refreshAccessTokenOnce();
    return;
  }

  alert(`웹 팀에 문의해주세요. \n${body.code} : ${body.message}`);

  if (auth && body.status === 401) {
    navigate?.(-1);
  }

  if (auth && body.status === 403) {
    if (path === '/signUp') {
      navigate?.('/');
    } else {
      navigate?.(-1);
    }
  }

  if (body.status === 404) {
    navigate?.('/notfound');
  }
}
