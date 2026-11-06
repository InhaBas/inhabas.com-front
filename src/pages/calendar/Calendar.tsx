import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import CalendarGrid from '../../components/calendar/CalendarGrid';
import EventCardList from '../../components/calendar/EventCardList';
import Loading from '../../components/common/Loading';
import { NAV_MENU_GROUPS } from '../../constants/navMenu';
import {
  DateKey,
  addMonths,
  formatDateWithWeekday,
  formatMonth,
  getGridDays,
  getGridRange,
  getNowKST,
  getTodayKST,
  toMonthKey,
} from '../../functions/calendar/calendarDate';
import {
  CalendarView,
  parseCalendarParams,
  toCalendarParams,
} from '../../functions/calendar/calendarParams';
import { getDayMarks } from '../../functions/calendar/dayMarks';
import { filterRecruiting } from '../../functions/calendar/recruitStatus';
import { eventQueries } from '../../queries/event';
import { Div } from '../../styles/assets/Div';
import { H1, H2 } from '../../styles/assets/H';
import P from '../../styles/assets/P';
import { media } from '../../styles/theme';

const CALENDAR_MENU = NAV_MENU_GROUPS.flatMap((group) => group.menuList).find(
  (menu) => menu.url === 'calendar',
);

// HeaderTitle과 같은 모양의 제목 배너. 캘린더 메뉴가 백엔드 /menu에 없어서 페이지가 직접 그린다
const Banner = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 423px;
  background-image: url('/images/board-name-img.jpg');
  background-size: cover;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.color.bklayer};
  }

  ${media.tablet} {
    height: 320px;
  }

  ${media.mobile} {
    height: 240px;
  }
`;

const BannerContent = styled.div`
  position: relative;
  width: 100%;
  max-width: 1170px;
  padding: 0 24px;
  text-align: center;

  ${media.mobile} {
    padding: 0 16px;
  }
`;

const BannerTitle = styled(H1)`
  margin-bottom: 20px;

  ${media.tablet} {
    font-size: 36px;
  }

  ${media.mobile} {
    margin-bottom: 12px;
    font-size: 28px;
  }
`;

const BannerDescription = styled(P)`
  white-space: normal;

  ${media.tablet} {
    font-size: 16px;
  }

  ${media.mobile} {
    font-size: 14px;
  }
`;

const Content = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 1170px;
  margin: 0 auto;
  padding: 48px 24px 80px;

  ${media.mobile} {
    padding: 24px 16px 56px;
  }
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const MonthLabel = styled(H2)`
  width: auto;
  min-width: 132px;
  margin-right: 6px;

  ${media.mobile} {
    min-width: 108px;
    font-size: ${({ theme }) => theme.fontSize.md};
  }
`;

const ToolButton = styled.button<{ $active?: boolean }>`
  padding: 4px 12px;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.color.bgColor : theme.color.grey1)};
  border-radius: 6px;
  background: ${({ theme, $active }) => ($active ? theme.color.bgColor : theme.color.wh)};
  color: ${({ theme, $active }) => ($active ? theme.color.wh : theme.color.bk)};
  font-size: ${({ theme }) => theme.fontSize.sm};
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.bgColorHo};
    outline-offset: 2px;
  }
`;

const Filter = styled.div`
  display: flex;
  gap: 6px;
`;

const Preview = styled.section`
  margin-top: 24px;
`;

const PreviewTitle = styled(H2)`
  margin-bottom: 12px;
`;

const Calendar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 모집 상태는 렌더할 때의 현재 시각으로 판정한다 (실시간 타이머 없음)
  const now = new Date();
  const today = getTodayKST(now);
  const nowKST = getNowKST(now);

  const view = parseCalendarParams(searchParams, today);
  const days = getGridDays(view.month);
  const { data } = useQuery(eventQueries.list(getGridRange(view.month)));

  const events = data ? (view.recruitingOnly ? filterRecruiting(data, nowKST) : data) : [];
  const dayMarks = getDayMarks(events);
  const selectedMarks = view.date ? (dayMarks[view.date] ?? []) : [];

  // 월 이동만 history에 쌓고, 날짜 선택과 필터 변경은 replace
  const go = (next: CalendarView, push: boolean) =>
    setSearchParams(toCalendarParams(next), { replace: !push });

  const moveMonth = (offset: number) =>
    go({ ...view, month: addMonths(view.month, offset), date: null }, true);

  const goToday = () => go({ ...view, month: toMonthKey(today), date: today }, true);

  // 앞뒤 달 칸을 누르면 그 달로 옮기고 그 날짜를 선택한다
  const selectDate = (date: DateKey) => {
    const month = toMonthKey(date);
    go({ ...view, month, date }, month !== view.month);
  };

  const setRecruitingOnly = (recruitingOnly: boolean) => go({ ...view, recruitingOnly }, false);

  const renderPreview = () => {
    // 백엔드에 행사 API가 아직 없다 (404). 다른 안내보다 먼저 보인다
    if (data === null) return <P color="grey3">행사 일정을 준비하고 있어요</P>;
    if (!view.date) return <P color="grey3">날짜를 선택하면 그날의 일정을 볼 수 있어요.</P>;
    if (!data) return <Loading />;
    if (selectedMarks.length === 0) {
      return (
        <P color="grey3">
          {view.recruitingOnly
            ? '이 날에는 모집 중인 행사가 없습니다.'
            : '이 날에는 일정이 없습니다.'}
        </P>
      );
    }
    return <EventCardList marks={selectedMarks} nowKST={nowKST} />;
  };

  return (
    <Div width="100%">
      <Banner>
        <BannerContent>
          <BannerTitle color="wh" fontWeight={700} fontSize="xxxl">
            {CALENDAR_MENU?.name ?? '행사 캘린더'}
          </BannerTitle>
          <BannerDescription color="grey3" fontWeight={300} fontSize="lg" $center>
            {CALENDAR_MENU?.description}
          </BannerDescription>
        </BannerContent>
      </Banner>

      <Content>
        <Toolbar>
          <MonthNav>
            <MonthLabel fontSize="xl" fontWeight={700} aria-live="polite">
              {formatMonth(view.month)}
            </MonthLabel>
            <ToolButton type="button" aria-label="이전 달" onClick={() => moveMonth(-1)}>
              ‹
            </ToolButton>
            <ToolButton type="button" onClick={goToday}>
              오늘
            </ToolButton>
            <ToolButton type="button" aria-label="다음 달" onClick={() => moveMonth(1)}>
              ›
            </ToolButton>
          </MonthNav>
          <Filter role="group" aria-label="모집 상태 필터">
            <ToolButton
              type="button"
              aria-pressed={!view.recruitingOnly}
              $active={!view.recruitingOnly}
              onClick={() => setRecruitingOnly(false)}
            >
              전체
            </ToolButton>
            <ToolButton
              type="button"
              aria-pressed={view.recruitingOnly}
              $active={view.recruitingOnly}
              onClick={() => setRecruitingOnly(true)}
            >
              모집중
            </ToolButton>
          </Filter>
        </Toolbar>

        <CalendarGrid
          month={view.month}
          days={days}
          today={today}
          selectedDate={view.date}
          dayMarks={dayMarks}
          onSelect={selectDate}
        />

        <Preview aria-live="polite">
          {view.date && data !== null && (
            <PreviewTitle fontSize="lg" fontWeight={700}>
              {formatDateWithWeekday(view.date)}
              {data && ` · ${selectedMarks.length}개`}
            </PreviewTitle>
          )}
          {renderPreview()}
        </Preview>
      </Content>
    </Div>
  );
};

export default Calendar;
