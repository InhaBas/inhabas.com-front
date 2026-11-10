import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { handleApiError } from './apiErrorEffects';

// refresh 흐름이 React 밖에서 invalidateQueries를 불러야 하므로 모듈 싱글턴으로 둔다.
// 아래 값은 옛 useFetch 동작을 보존하는 과도기 값이다. 전환 중에는 쿼리별로 바꾸지 않고,
// 푸는 작업은 전환이 끝난 뒤 UX 개선으로 따로 한다.
export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleApiError }),
  mutationCache: new MutationCache({ onError: handleApiError }),
  defaultOptions: {
    queries: {
      // 해제 조건: 에러 alert가 재시도만큼 늦게 뜨는 것을 받아들이는 UX 개선 작업에서
      retry: false,
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
