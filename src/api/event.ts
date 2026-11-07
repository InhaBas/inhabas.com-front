import { request } from './client';
import { ClubEvent, EventRange } from '../types/TypeEvent';

// 범위 [from, to]에 일정이 하나라도 걸친 행사를 일정 전부와 함께 받는다. 비로그인 조회.
// 백엔드 API가 나오기 전이라 개발 서버에서는 목을 쓴다. 실제 API로 바꾸는 절차:
// 1. .env.local에 VITE_MOCK_EVENTS=false를 넣고 실제 응답으로 확인한다.
// 2. 확인되면 이 분기와 src/api/mocks/events.ts를 지운다(src/queries/event.ts의 404 catch도 함께).
export const getEvents = async ({ from, to }: EventRange): Promise<ClubEvent[]> => {
  if (import.meta.env.DEV && import.meta.env.VITE_MOCK_EVENTS !== 'false') {
    const { getMockEvents } = await import('./mocks/events');
    return getMockEvents({ from, to });
  }
  return request<ClubEvent[]>(`/events?from=${from}&to=${to}`);
};
