import styled, { css } from 'styled-components';

import {
  DateKey,
  MonthKey,
  WEEKDAY_LABELS,
  dayOfWeek,
  formatDateWithWeekday,
  toMonthKey,
} from '../../functions/calendar/calendarDate';
import { DAY_MARK_LABEL, DayMark, DayMarks } from '../../functions/calendar/dayMarks';
import { media } from '../../styles/theme';

// 칸에 보이는 일정 최대 개수. 넘치면 +N
const MAX_MARKS = 3;

// 디자인 전 임시 색 (06 프로토타입). 신청 기간은 보라, 나머지 일정은 회색
export const RECRUITMENT_LIGHT = '#efe8fb';
const GENERAL_LIGHT = '#f0f0f3';
const SELECTED_BG = RECRUITMENT_LIGHT;
const HOVER_BG = '#faf9fd';
const SATURDAY = '#3b6fd8';

const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
`;

const Weekday = styled.div<{ $dow: number }>`
  padding: 4px 0;
  font-size: ${({ theme }) => theme.fontSize.xs};
  text-align: center;
  color: ${({ theme, $dow }) =>
    $dow === 0 ? theme.color.red : $dow === 6 ? SATURDAY : theme.color.grey2};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  border-top: 1px solid ${({ theme }) => theme.color.border};
  border-left: 1px solid ${({ theme }) => theme.color.border};
`;

const Cell = styled.button<{ $selected: boolean; $outside: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-sizing: border-box;
  min-width: 0;
  height: 104px;
  margin: 0;
  padding: 4px;
  overflow: hidden;
  border: none;
  border-right: 1px solid ${({ theme }) => theme.color.border};
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ $selected, theme }) => ($selected ? SELECTED_BG : theme.color.wh)};
  font: inherit;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${({ $selected }) => ($selected ? SELECTED_BG : HOVER_BG)};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.bgColorHo};
    outline-offset: -2px;
  }

  ${({ $outside }) =>
    $outside &&
    css`
      & > *:last-child {
        opacity: 0.45;
      }
    `}

  ${media.mobile} {
    height: 56px;
    padding: 2px;
    align-items: center;
  }
`;

const DayNumber = styled.span<{ $today: boolean; $dow: number; $outside: boolean }>`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ $today }) => ($today ? 700 : 500)};
  color: ${({ theme, $today, $dow, $outside }) => {
    if ($today) return theme.color.wh;
    if ($outside) return theme.color.grey1;
    if ($dow === 0) return theme.color.red;
    if ($dow === 6) return SATURDAY;
    return theme.color.grey;
  }};
  background: ${({ theme, $today }) => ($today ? theme.color.bgColor : 'transparent')};
`;

const Marks = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  min-width: 0;

  ${media.mobile} {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 2px;
  }
`;

// 데스크톱은 행사명 칩, 모바일은 점
const Mark = styled.span<{ $recruitment: boolean }>`
  display: block;
  min-width: 0;
  padding: 1px 5px;
  border-radius: 4px;
  overflow: hidden;
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  background: ${({ $recruitment }) => ($recruitment ? RECRUITMENT_LIGHT : GENERAL_LIGHT)};
  color: ${({ theme, $recruitment }) => ($recruitment ? theme.color.bgColor : theme.color.grey)};

  ${media.mobile} {
    flex: none;
    width: 5px;
    height: 5px;
    padding: 0;
    border-radius: 50%;
    font-size: 0;
    line-height: 0;
    background: ${({ theme, $recruitment }) =>
      $recruitment ? theme.color.bgColor : theme.color.grey2};
  }
`;

const MarkTag = styled.b`
  margin-right: 3px;
  font-weight: 700;
`;

const More = styled.span`
  padding-left: 4px;
  font-size: 11px;
  color: ${({ theme }) => theme.color.grey2};

  ${media.mobile} {
    padding: 0;
    font-size: 9px;
    line-height: 9px;
  }
`;

interface DayCellProps {
  date: DateKey;
  month: MonthKey;
  today: DateKey;
  selected: boolean;
  marks: DayMark[];
  onSelect: (date: DateKey) => void;
}

const DayCell = ({ date, month, today, selected, marks, onSelect }: DayCellProps) => {
  const dow = dayOfWeek(date);
  const outside = toMonthKey(date) !== month;
  const isToday = date === today;
  const shown = marks.slice(0, MAX_MARKS);
  const rest = marks.length - shown.length;

  return (
    <Cell
      type="button"
      aria-label={`${formatDateWithWeekday(date)}, 일정 ${marks.length}개`}
      aria-selected={selected}
      aria-current={isToday ? 'date' : undefined}
      $selected={selected}
      $outside={outside}
      onClick={() => onSelect(date)}
    >
      <DayNumber $today={isToday} $dow={dow} $outside={outside}>
        {Number(date.slice(8))}
      </DayNumber>
      <Marks>
        {shown.map(({ event, schedule, mark }) => (
          <Mark
            key={`${schedule.id}-${mark}`}
            $recruitment={schedule.kind === 'RECRUITMENT'}
            title={event.title}
          >
            {DAY_MARK_LABEL[mark] && <MarkTag>{DAY_MARK_LABEL[mark]}</MarkTag>}
            {event.title}
          </Mark>
        ))}
        {rest > 0 && <More>+{rest}</More>}
      </Marks>
    </Cell>
  );
};

interface CalendarGridProps {
  month: MonthKey;
  days: DateKey[];
  today: DateKey;
  selectedDate: DateKey | null;
  dayMarks: DayMarks;
  onSelect: (date: DateKey) => void;
}

const CalendarGrid = ({
  month,
  days,
  today,
  selectedDate,
  dayMarks,
  onSelect,
}: CalendarGridProps) => (
  <div>
    <Weekdays aria-hidden>
      {WEEKDAY_LABELS.map((label, dow) => (
        <Weekday key={label} $dow={dow}>
          {label}
        </Weekday>
      ))}
    </Weekdays>
    <Grid>
      {days.map((date) => (
        <DayCell
          key={date}
          date={date}
          month={month}
          today={today}
          selected={date === selectedDate}
          marks={dayMarks[date] ?? []}
          onSelect={onSelect}
        />
      ))}
    </Grid>
  </div>
);

export default CalendarGrid;
