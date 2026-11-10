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
// 아래 false·'always' 값은 옛 useFetch 동작을 보존하는 남은 과도기 값이다. 각 값 옆에 해제 조건을 적는다.
export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleApiError }),
  mutationCache: new MutationCache({ onError: handleApiError }),
  defaultOptions: {
    queries: {
      retry: shouldRetryQuery,
      /*
        해제 조건: 에러 UX가 alert에서 벗어날 때(토스트·같은 에러 묶기), 그리고 백그라운드 재요청 실패가
        navigate(-1·/notfound)하지 않도록 handleApiError가 나뉠 때. 지금 풀면 서버 장애 중 탭을 오갈 때마다
        활성 쿼리 수만큼 alert가 뜨고, 수정 화면에서 탭에 돌아왔을 때 상세가 404·403이면 쓰던 글을 두고 화면을 떠난다
      */
      refetchOnWindowFocus: false,
      // 해제 조건: refetchOnWindowFocus와 같다. 재연결 직후 활성 쿼리가 한꺼번에 실패하면 alert가 겹친다
      refetchOnReconnect: false,
      /*
        해제 조건: 오프라인 UX를 정할 때. 'online'이면 오프라인에서 조회는 pending·paused로 멈춰 스피너만 돌고,
        뮤테이션은 멈췄다가 재연결 때 보내져 사용자가 떠난 뒤 글이 올라갈 수 있다. 멈춤 표시와 재전송 정책이 먼저다
      */
      networkMode: 'always',
    },
    mutations: {
      // 해제 조건: queries.networkMode와 같다
      networkMode: 'always',
    },
  },
});
