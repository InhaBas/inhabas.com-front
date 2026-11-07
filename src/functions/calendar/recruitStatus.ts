// 모집 상태·D-day 판정. 서버는 원자료만 주고 프론트가 신청 기간과 현재 시각(KST)으로 계산한다.
// "지금"은 getNowKST()의 `YYYY-MM-DDTHH:mm:ss` 문자열로 받는다. 같은 형식의 문자열끼리 비교하므로
// 브라우저 시간대와 무관하다.

import { DateKey, diffDays, toDateKey } from './calendarDate';
import { ClubEvent, EventSchedule, EventType } from '../../types/TypeEvent';

export type RecruitStatus = 'BEFORE' | 'RECRUITING' | 'CLOSED';

export const RECRUIT_STATUS_LABEL: Record<RecruitStatus, string> = {
  BEFORE: '모집 전',
  RECRUITING: '모집 중',
  CLOSED: '마감',
};

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  STUDY: '스터디',
  LECTURE: '강의',
  ACADEMIC: '학술 행사',
  SOCIAL: '친목 행사',
  TESTER: '알파/베타테스터',
};

// 신청 기간: kind=RECRUITMENT 일정 (행사당 최대 1개)
export const getRecruitmentSchedule = (event: ClubEvent): EventSchedule | null =>
  event.schedules.find((schedule) => schedule.kind === 'RECRUITMENT') ?? null;

// 신청 기간의 양끝 시각. 종일이면 시작일 00:00:00 ~ 마감일 23:59:59.
// endAt이 null이면 계약 위반이므로 모집 상태 없음으로 본다
const getRecruitmentBounds = (schedule: EventSchedule) => {
  if (!schedule.endAt) return null;
  if (schedule.allDay) {
    return {
      start: `${toDateKey(schedule.startAt)}T00:00:00`,
      end: `${toDateKey(schedule.endAt)}T23:59:59`,
    };
  }
  return { start: schedule.startAt.slice(0, 19), end: schedule.endAt.slice(0, 19) };
};

// 신청 기간이 없으면 null (모집 상태 없음)
export const getRecruitStatus = (event: ClubEvent, nowKST: string): RecruitStatus | null => {
  const schedule = getRecruitmentSchedule(event);
  const bounds = schedule && getRecruitmentBounds(schedule);
  if (!bounds) return null;
  if (nowKST < bounds.start) return 'BEFORE';
  if (nowKST > bounds.end) return 'CLOSED';
  return 'RECRUITING';
};

// 모집 중일 때만 마감일까지 남은 날 수. 날짜끼리 세며 마감일 당일은 0이다
export const getDday = (event: ClubEvent, nowKST: string): number | null => {
  if (getRecruitStatus(event, nowKST) !== 'RECRUITING') return null;
  const endAt = getRecruitmentSchedule(event)?.endAt;
  if (!endAt) return null;
  const today: DateKey = toDateKey(nowKST);
  return diffDays(today, toDateKey(endAt));
};

export const formatDday = (dday: number) => (dday === 0 ? 'D-Day' : `D-${dday}`);

// `모집중` 필터는 행사 단위로 거른다. 남은 행사의 일정은 전부 그대로 둔다
export const filterRecruiting = (events: ClubEvent[], nowKST: string) =>
  events.filter((event) => getRecruitStatus(event, nowKST) === 'RECRUITING');
