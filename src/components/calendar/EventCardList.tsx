import styled from 'styled-components';

import { RECRUITMENT_LIGHT } from './CalendarGrid';
import { formatShortDate, formatTime, toDateKey } from '../../functions/calendar/calendarDate';
import { DAY_MARK_LABEL, DayMark } from '../../functions/calendar/dayMarks';
import {
  EVENT_TYPE_LABEL,
  RECRUIT_STATUS_LABEL,
  RecruitStatus,
  formatDday,
  getDday,
  getRecruitStatus,
  getRecruitmentSchedule,
} from '../../functions/calendar/recruitStatus';
import { EventSchedule } from '../../types/TypeEvent';

// 디자인 전 임시 색 (06 프로토타입)
const BADGE_COLORS: Record<RecruitStatus, { bg: string; fg: string }> = {
  BEFORE: { bg: '#e8eefc', fg: '#2b4fa8' },
  RECRUITING: { bg: '#d4edda', fg: '#155724' },
  CLOSED: { bg: '#eeeeee', fg: '#a5a4a8' },
};

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Card = styled.li`
  min-width: 0;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.color.wh};
`;

const CardHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
`;

const Title = styled.strong`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.color.bk};
  overflow-wrap: anywhere;
`;

const Sub = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.color.grey2};
`;

const Badge = styled.span<{ $status: RecruitStatus }>`
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  background: ${({ $status }) => BADGE_COLORS[$status].bg};
  color: ${({ $status }) => BADGE_COLORS[$status].fg};
`;

const Dday = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.red};
`;

const ScheduleLine = styled.p`
  margin: 6px 0 0;
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.color.grey};
  overflow-wrap: anywhere;
`;

const MarkTag = styled.b<{ $recruitment: boolean }>`
  margin-right: 4px;
  padding: 0 4px;
  border-radius: 3px;
  font-weight: 700;
  background: ${({ $recruitment }) => ($recruitment ? RECRUITMENT_LIGHT : 'transparent')};
  color: ${({ theme }) => theme.color.bgColor};
`;

const Description = styled.p`
  margin: 4px 0 0;
  overflow: hidden;
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.color.grey2};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// 종일 · 11/1 ~ 11/7 · 19:00 · 14:00 ~ 16:00 · 11/2 10:00 ~ 11/3 18:00
export const formatScheduleTime = ({ startAt, endAt, allDay }: EventSchedule) => {
  const startDate = toDateKey(startAt);
  const endDate = endAt ? toDateKey(endAt) : null;
  if (allDay) {
    return endDate && endDate !== startDate
      ? `${formatShortDate(startDate)} ~ ${formatShortDate(endDate)}`
      : '종일';
  }
  if (!endAt || !endDate) return formatTime(startAt);
  if (endDate === startDate) return `${formatTime(startAt)} ~ ${formatTime(endAt)}`;
  return `${formatShortDate(startDate)} ${formatTime(startAt)} ~ ${formatShortDate(endDate)} ${formatTime(endAt)}`;
};

interface EventCardListProps {
  marks: DayMark[];
  nowKST: string;
}

const EventCardList = ({ marks, nowKST }: EventCardListProps) => (
  <List>
    {marks.map(({ event, schedule, mark }) => {
      const status = getRecruitStatus(event, nowKST);
      const dday = getDday(event, nowKST);
      const recruitment = getRecruitmentSchedule(event);
      const tag = DAY_MARK_LABEL[mark];
      const details = [
        formatScheduleTime(schedule),
        event.place,
        event.capacity !== null ? `정원 ${event.capacity}명` : null,
      ].filter(Boolean);

      return (
        <Card key={`${schedule.id}-${mark}`}>
          <CardHead>
            <Title>{event.title}</Title>
            <Sub>{EVENT_TYPE_LABEL[event.type]}</Sub>
            {status && <Badge $status={status}>{RECRUIT_STATUS_LABEL[status]}</Badge>}
            {dday !== null && <Dday>{formatDday(dday)}</Dday>}
            {/* 모집 전에는 시작일만 보인다. 문구는 디자인 때 정한다 */}
            {status === 'BEFORE' && recruitment && (
              <Sub>{formatShortDate(toDateKey(recruitment.startAt))} 오픈</Sub>
            )}
          </CardHead>
          <ScheduleLine>
            {tag && <MarkTag $recruitment={schedule.kind === 'RECRUITMENT'}>{tag}</MarkTag>}
            {schedule.title} · {details.join(' · ')}
          </ScheduleLine>
          <Description title={event.description}>{event.description}</Description>
        </Card>
      );
    })}
  </List>
);

export default EventCardList;
