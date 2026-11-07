import { queryOptions } from '@tanstack/react-query';

import { ApiError } from '../api/client';
import { getEvents } from '../api/event';
import { EventRange } from '../types/TypeEvent';

export const eventQueries = {
  all: () => ['events'] as const,

  // 그리드 범위 하나에 응답 하나. 범위끼리 병합하지 않는다.
  // 반환값이 null이면 백엔드에 행사 API가 아직 없다는 뜻이다(화면은 "준비 중"을 보여 준다)
  list: ({ from, to }: EventRange) =>
    queryOptions({
      queryKey: [...eventQueries.all(), 'list', { from, to }] as const,
      queryFn: async () => {
        try {
          return await getEvents({ from, to });
        } catch (error) {
          // 백엔드에 GET /events가 생기기 전, 프로덕션에서 /calendar에 직접 들어온 사람이
          // 공통 처리(alert, /notfound 이동)를 겪지 않게 404만 조용히 null로 둔다.
          // 해제 조건: 실제 API로 바꿀 때 src/api/event.ts의 목 분기와 함께 지운다.
          // 목록 API라 API가 생긴 뒤에는 정상적인 404가 없다.
          if (error instanceof ApiError && error.httpStatus === 404) return null;
          throw error;
        }
      },
    }),
};
