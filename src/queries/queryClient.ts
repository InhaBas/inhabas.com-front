import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { handleApiError } from './apiErrorEffects';
import { ApiError } from '../api/client';

/*
  조회 재시도. 일시적인 실패(5xx·네트워크 오류)만 1번 다시 보낸다(라이브러리 기본 지연 1초).
  - 4xx는 다시 보내도 결과가 같고, 토큰 만료(A005·A006·A007, 401)는 곧바로 실패해야 handleApiError가 refresh 흐름을 시작한다
  - 재시도하는 동안에는 에러가 아니므로 alert는 재시도까지 실패한 뒤 한 번만 뜬다(최대 약 1초 늦게)
  - 뮤테이션은 라이브러리 기본값(재시도 없음) 그대로다. 같은 요청이 두 번 반영될 수 있다
*/
const MAX_QUERY_RETRIES = 1;

function shouldRetryQuery(failureCount: number, error: unknown) {
  if (error instanceof ApiError && error.httpStatus < 500) return false;
  return failureCount < MAX_QUERY_RETRIES;
}

// refresh 흐름이 React 밖에서 invalidateQueries를 불러야 하므로 모듈 싱글턴으로 둔다.
// 아래 false·'always' 값은 옛 useFetch 동작을 보존하는 과도기 값이다. 전환 중에는 쿼리별로 바꾸지 않고,
// 푸는 작업은 전환이 끝난 뒤 UX 개선으로 따로 한다.
export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleApiError }),
  mutationCache: new MutationCache({ onError: handleApiError }),
  defaultOptions: {
    queries: {
      retry: shouldRetryQuery,
      // 해제 조건: 탭 복귀 시 재요청을 받아들이는 UX 개선 작업에서
      refetchOnWindowFocus: false,
      // 해제 조건: 재연결 시 재요청을 받아들이는 UX 개선 작업에서
      refetchOnReconnect: false,
      // 해제 조건: 오프라인 UX(요청 보류·표시)를 정할 때
      networkMode: 'always',
    },
    mutations: {
      // 해제 조건: 오프라인 UX(요청 보류·표시)를 정할 때
      networkMode: 'always',
    },
  },
});
