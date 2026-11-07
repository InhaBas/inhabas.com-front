// 캘린더 URL 쿼리(`month=YYYY-MM`, `date=YYYY-MM-DD`, `status=recruiting`) 해석.
// 형식이 잘못된 값은 조용히 무시하고 기본값을 쓴다. URL을 고쳐 쓰지 않는다.

import { DateKey, MonthKey, isValidDateKey, isValidMonthKey, toMonthKey } from './calendarDate';

export interface CalendarView {
  month: MonthKey;
  // 선택한 날짜. null이면 선택 없음
  date: DateKey | null;
  // `모집중` 필터
  recruitingOnly: boolean;
}

export const parseCalendarParams = (params: URLSearchParams, today: DateKey): CalendarView => {
  const rawMonth = params.get('month');
  const rawDate = params.get('date');
  const month = isValidMonthKey(rawMonth) ? rawMonth : null;
  const date = isValidDateKey(rawDate) ? rawDate : null;
  const recruitingOnly = params.get('status') === 'recruiting';

  // month가 있으면 그 달. date가 다른 달이면 버린다
  if (month)
    return { month, date: date && toMonthKey(date) === month ? date : null, recruitingOnly };
  // date만 있으면 그 날짜가 속한 달
  if (date) return { month: toMonthKey(date), date, recruitingOnly };
  // 둘 다 없으면 이번 달 + 오늘 선택
  return { month: toMonthKey(today), date: today, recruitingOnly };
};

export const toCalendarParams = ({ month, date, recruitingOnly }: CalendarView) => {
  const params = new URLSearchParams({ month });
  if (date) params.set('date', date);
  if (recruitingOnly) params.set('status', 'recruiting');
  return params;
};
