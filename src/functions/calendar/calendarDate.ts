// 행사 캘린더 전용 날짜 모듈.
// 입력과 출력은 `YYYY-MM-DD`(날짜 키)·`YYYY-MM`(월 키) 문자열이고, 내부 계산은 Date.UTC로 해서
// 브라우저 시간대와 무관하다. "지금"이 필요한 함수는 Date를 인자로 받는다.
// 이 모듈은 캘린더 안에서만 쓴다. dateFunction.tsx·getTodayKST()와 합치는 일은 나중에 한다.

export type DateKey = string;
export type MonthKey = string;

const DAY_MS = 24 * 60 * 60 * 1000;
const KST = 'Asia/Seoul';

// 주는 일요일에 시작하고, 그리드는 항상 6주다
export const GRID_DAYS = 42;

const pad = (n: number) => String(n).padStart(2, '0');

const toUTC = (date: DateKey) => {
  const [y, m, d] = date.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

const fromUTC = (ms: number): DateKey => {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
};

// ---- 검증 ----

export const isValidDateKey = (value: string | null): value is DateKey =>
  value !== null && /^\d{4}-\d{2}-\d{2}$/.test(value) && fromUTC(toUTC(value)) === value;

export const isValidMonthKey = (value: string | null): value is MonthKey =>
  value !== null && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);

// ---- 연산 ----

export const toMonthKey = (date: DateKey): MonthKey => date.slice(0, 7);

export const firstDayOfMonth = (month: MonthKey): DateKey => `${month}-01`;

export const addDays = (date: DateKey, days: number): DateKey =>
  fromUTC(toUTC(date) + days * DAY_MS);

export const addMonths = (month: MonthKey, months: number): MonthKey => {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + months, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
};

// 0 = 일요일
export const dayOfWeek = (date: DateKey) => new Date(toUTC(date)).getUTCDay();

export const startOfWeek = (date: DateKey): DateKey => addDays(date, -dayOfWeek(date));

// to − from 일수
export const diffDays = (from: DateKey, to: DateKey) =>
  Math.round((toUTC(to) - toUTC(from)) / DAY_MS);

// ---- 그리드 ----

// 그 달의 1일이 든 주의 일요일부터 42칸
export const getGridDays = (month: MonthKey): DateKey[] => {
  const first = startOfWeek(firstDayOfMonth(month));
  return Array.from({ length: GRID_DAYS }, (_, i) => addDays(first, i));
};

// API 조회 범위는 그리드의 첫 칸과 마지막 칸이다
export const getGridRange = (month: MonthKey) => {
  const from = startOfWeek(firstDayOfMonth(month));
  return { from, to: addDays(from, GRID_DAYS - 1) };
};

// ---- 지금·오늘 (KST) ----

export const getTodayKST = (now: Date): DateKey =>
  new Intl.DateTimeFormat('en-CA', { timeZone: KST }).format(now);

// 지금을 API와 같은 형식(`YYYY-MM-DDTHH:mm:ss`, KST)으로. 문자열끼리 비교하려고 쓴다
export const getNowKST = (now: Date): string => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: KST,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '00';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}:${get('second')}`;
};

// API 날짜·시각 문자열의 앞 10자를 날짜 키로 쓴다. new Date로 파싱하지 않는다
export const toDateKey = (dateTime: string): DateKey => dateTime.slice(0, 10);

// ---- 한국어 표기 ----

const format = (date: DateKey, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('ko-KR', { timeZone: 'UTC', ...options }).format(new Date(toUTC(date)));

// 2026년 11월
export const formatMonth = (month: MonthKey) =>
  format(firstDayOfMonth(month), { year: 'numeric', month: 'long' });

// 11월 6일 금요일
export const formatDateWithWeekday = (date: DateKey) =>
  format(date, { month: 'long', day: 'numeric', weekday: 'long' });

// 11/6
export const formatShortDate = (date: DateKey) => {
  const [, m, d] = date.split('-').map(Number);
  return `${m}/${d}`;
};

// 일정 시각 `HH:mm`
export const formatTime = (dateTime: string) => dateTime.slice(11, 16);

export const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
