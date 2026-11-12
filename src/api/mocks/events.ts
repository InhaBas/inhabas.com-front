// 개발 서버 전용 행사 목데이터. src/api/event.ts가 DEV에서만 dynamic import한다.
// 01 계약(GET /events?from&to)의 의미를 그대로 구현한다. fixture는 "오늘" 기준 상대 날짜로 만든다.

import {
  DateKey,
  addDays,
  addMonths,
  diffDays,
  firstDayOfMonth,
  getTodayKST,
  isValidDateKey,
  toDateKey,
  toMonthKey,
} from '../../functions/calendar/calendarDate';
import { ClubEvent, EventRange, EventSchedule } from '../../types/TypeEvent';
import { ApiError } from '../client';

const MOCK_DELAY_MS = 300;

// ---- fixture ----

export const createEventFixtures = (today: DateKey): ClubEvent[] => {
  const day = (offset: number) => addDays(today, offset);
  const allDay = (offset: number) => `${day(offset)}T00:00:00`;
  const at = (offset: number, time: string) => `${day(offset)}T${time}:00`;

  // 이번 달 마지막 날 (월을 걸치는 기간용)
  const lastDay = addDays(firstDayOfMonth(addMonths(toMonthKey(today), 1)), -1);
  const lastDayOffset = diffDays(today, lastDay);

  let scheduleId = 100;
  const schedule = (s: Omit<EventSchedule, 'id'>): EventSchedule => ({ id: scheduleId++, ...s });

  return [
    {
      // 모집 중, 종일 신청 기간(D-4) + endAt null인 시점 일정
      id: 1,
      title: '머신러닝 입문 스터디',
      type: 'STUDY',
      place: '하이테크 312호',
      description: 'scikit-learn으로 분류·회귀 모델을 직접 만들어 보는 8주 스터디입니다.',
      thumbnail: null,
      capacity: 20,
      schedules: [
        schedule({
          title: '신청 기간',
          kind: 'RECRUITMENT',
          startAt: allDay(-3),
          endAt: allDay(4),
          allDay: true,
        }),
        schedule({
          title: '팀 빌딩',
          kind: 'GENERAL',
          startAt: at(7, '19:00'),
          endAt: null,
          allDay: false,
        }),
      ],
    },
    {
      // 모집 중, 종일 신청 기간의 마지막 날 = 오늘 (D-Day)
      id: 2,
      title: '데이터 시각화 강의',
      type: 'LECTURE',
      place: '60주년기념관 101호',
      description: 'matplotlib과 seaborn으로 데이터를 읽기 쉬운 그림으로 바꾸는 방법을 배웁니다.',
      thumbnail: null,
      capacity: null,
      schedules: [
        schedule({
          title: '신청 기간',
          kind: 'RECRUITMENT',
          startAt: allDay(-5),
          endAt: allDay(0),
          allDay: true,
        }),
        schedule({
          title: '특강',
          kind: 'GENERAL',
          startAt: allDay(7),
          endAt: allDay(7),
          allDay: true,
        }),
        schedule({
          title: '강의 기간',
          kind: 'GENERAL',
          startAt: allDay(10),
          endAt: allDay(31),
          allDay: true,
        }),
      ],
    },
    {
      // 오늘 18:00에 마감하는 시각 신청 기간. 18:00 전에는 모집 중(D-Day), 후에는 마감
      id: 3,
      title: '캐글 대회 공동 참가',
      type: 'ACADEMIC',
      place: null,
      description:
        '팀을 꾸려 진행 중인 캐글 대회에 함께 참가합니다. 주 1회 진행 상황을 공유합니다.',
      thumbnail: null,
      capacity: 12,
      schedules: [
        schedule({
          title: '신청 기간',
          kind: 'RECRUITMENT',
          startAt: at(-2, '10:00'),
          endAt: at(0, '18:00'),
          allDay: false,
        }),
        schedule({
          title: '중간 발표',
          kind: 'GENERAL',
          startAt: at(7, '12:00'),
          endAt: at(7, '13:00'),
          allDay: false,
        }),
        schedule({
          title: '최종 발표',
          kind: 'GENERAL',
          startAt: at(14, '14:00'),
          endAt: at(14, '16:00'),
          allDay: false,
        }),
      ],
    },
    {
      // 모집 전
      id: 4,
      title: '딥러닝 논문 읽기 모임',
      type: 'ACADEMIC',
      place: '하이테크 220호',
      description: '매주 한 편씩 고전 딥러닝 논문을 읽고 발제합니다.',
      thumbnail: null,
      capacity: 10,
      schedules: [
        schedule({
          title: '신청 기간',
          kind: 'RECRUITMENT',
          startAt: allDay(5),
          endAt: allDay(12),
          allDay: true,
        }),
        schedule({
          title: '첫 모임',
          kind: 'GENERAL',
          startAt: at(15, '13:00'),
          endAt: null,
          allDay: false,
        }),
      ],
    },
    {
      // 마감 + 날짜를 넘기는 시간 일정 + 자정에 끝나는 시간 일정
      id: 5,
      title: 'IBAS 서비스 알파테스터',
      type: 'TESTER',
      place: '온라인',
      description: '동아리 홈페이지 새 기능을 먼저 써 보고 피드백을 남겨 주세요.',
      thumbnail: null,
      capacity: 30,
      schedules: [
        schedule({
          title: '신청 기간',
          kind: 'RECRUITMENT',
          startAt: allDay(-14),
          endAt: allDay(-7),
          allDay: true,
        }),
        schedule({
          title: '테스트 기간',
          kind: 'GENERAL',
          startAt: at(2, '10:00'),
          endAt: at(3, '18:00'),
          allDay: false,
        }),
        schedule({
          title: '회고',
          kind: 'GENERAL',
          startAt: at(9, '22:00'),
          endAt: at(10, '00:00'),
          allDay: false,
        }),
      ],
    },
    {
      // 신청 기간 없는 행사 (모집 상태 없음)
      id: 6,
      title: '종강 총회',
      type: 'SOCIAL',
      place: '학생회관 소극장',
      description: '한 학기 활동을 돌아보고 다음 학기 임원진을 소개합니다.',
      thumbnail: null,
      capacity: null,
      schedules: [
        schedule({
          title: '총회',
          kind: 'GENERAL',
          startAt: at(7, '18:00'),
          endAt: at(7, '21:00'),
          allDay: false,
        }),
      ],
    },
    {
      // 월을 걸치는 기간 (이번 달 말일 -1 ~ 다음 달 3일)
      id: 7,
      title: '겨울 MT',
      type: 'SOCIAL',
      place: '가평',
      description: '부원끼리 친해지는 1박 2일 MT입니다. 일정은 확정되면 공지합니다.',
      thumbnail: null,
      capacity: 40,
      schedules: [
        schedule({
          title: '신청 기간',
          kind: 'RECRUITMENT',
          startAt: allDay(-1),
          endAt: allDay(6),
          allDay: true,
        }),
        schedule({
          title: 'MT',
          kind: 'GENERAL',
          startAt: allDay(lastDayOffset - 1),
          endAt: allDay(lastDayOffset + 3),
          allDay: true,
        }),
      ],
    },
    {
      // 범위 밖 행사 (두 달 전). 이번 달 그리드 응답에는 오지 않아야 한다
      id: 8,
      title: '지난 학기 SQL 스터디',
      type: 'STUDY',
      place: null,
      description: '지난 학기에 진행한 SQL 스터디입니다.',
      thumbnail: null,
      capacity: 15,
      schedules: [
        schedule({
          title: '신청 기간',
          kind: 'RECRUITMENT',
          startAt: allDay(-70),
          endAt: allDay(-63),
          allDay: true,
        }),
        schedule({
          title: '스터디 기간',
          kind: 'GENERAL',
          startAt: allDay(-60),
          endAt: allDay(-45),
          allDay: true,
        }),
      ],
    },
  ];
};

// ---- 범위 필터 (01 계약) ----

// 일정 하나라도 [from, to]와 겹치는 행사를, 일정 전부와 함께 돌려준다.
// endAt이 null인 일정은 startAt의 날짜로 판정한다
export const filterEventsByRange = (events: ClubEvent[], { from, to }: EventRange): ClubEvent[] =>
  events
    .filter((event) =>
      event.schedules.some((schedule) => {
        const start = toDateKey(schedule.startAt);
        const end = schedule.endAt ? toDateKey(schedule.endAt) : start;
        return start <= to && end >= from;
      }),
    )
    .map((event) => ({
      ...event,
      schedules: [...event.schedules].sort((a, b) => a.startAt.localeCompare(b.startAt)),
    }));

// 화면이 행사 배열 순서에 기대지 않도록 일부러 섞는다
const shuffle = <T>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const getMockEvents = async (range: EventRange): Promise<ClubEvent[]> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  if (!isValidDateKey(range.from) || !isValidDateKey(range.to) || range.from > range.to) {
    throw new ApiError(
      400,
      { status: 400, code: 'G003', message: '입력값이 올바르지 않습니다.' },
      false,
      '/events',
    );
  }

  const fixtures = createEventFixtures(getTodayKST(new Date()));
  return shuffle(filterEventsByRange(fixtures, range));
};
