// 날짜별 표시 항목 계산. 칸 렌더(칩·점)와 나눠 두어 표시 방식을 바꿀 때 렌더만 고치면 된다.
// 기간 일정은 시작일과 마감일에만 표시하고 사이 날짜에는 표시하지 않는다.

import { DateKey, toDateKey } from './calendarDate';
import { ClubEvent, EventSchedule } from '../../types/TypeEvent';

export type DayMarkType = 'start' | 'end' | 'single';

export interface DayMark {
  event: ClubEvent;
  schedule: EventSchedule;
  mark: DayMarkType;
}

export type DayMarks = Record<DateKey, DayMark[]>;

export const DAY_MARK_LABEL: Record<DayMarkType, string | null> = {
  start: '시작',
  end: '마감',
  single: null,
};

// 그 표시가 가리키는 시각 (마감 표시면 endAt)
const markTime = ({ schedule, mark }: DayMark) =>
  mark === 'end' && schedule.endAt ? schedule.endAt : schedule.startAt;

// 종일 일정 먼저, 나머지는 시각 오름차순. 응답 순서에 기대지 않도록 id로 끝까지 정렬한다
const compareMarks = (a: DayMark, b: DayMark) => {
  if (a.schedule.allDay !== b.schedule.allDay) return a.schedule.allDay ? -1 : 1;
  const time = markTime(a).localeCompare(markTime(b));
  if (time !== 0) return time;
  if (a.event.id !== b.event.id) return a.event.id - b.event.id;
  return a.schedule.id - b.schedule.id;
};

export const getDayMarks = (events: ClubEvent[]): DayMarks => {
  const marks: DayMarks = {};
  const push = (date: DateKey, mark: DayMark) => {
    (marks[date] ??= []).push(mark);
  };

  events.forEach((event) => {
    event.schedules.forEach((schedule) => {
      const start = toDateKey(schedule.startAt);
      const end = schedule.endAt ? toDateKey(schedule.endAt) : null;
      if (!end || end === start) {
        push(start, { event, schedule, mark: 'single' });
        return;
      }
      push(start, { event, schedule, mark: 'start' });
      push(end, { event, schedule, mark: 'end' });
    });
  });

  Object.values(marks).forEach((list) => list.sort(compareMarks));
  return marks;
};
