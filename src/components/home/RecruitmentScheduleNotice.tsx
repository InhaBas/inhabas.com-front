import { useEffect, useState } from "react";
import styled from "styled-components";

import { scheduleInterface } from "../../types/ibas/TypeMyinfo";
import { media, theme } from "../../styles/theme";

type RecruitmentSchedule = Pick<scheduleInterface, "signupStartDate" | "signupEndDate">;

const NoticeBackground = styled.div`
    position: fixed;
    inset: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background-color: rgba(0, 0, 0, 0.5);

    ${media.mobile} {
        padding: 16px;
    }
`;

const Notice = styled.aside`
    width: min(440px, 100%);
    padding: 20px;
    border: 1px solid ${theme.color.bgColor};
    border-radius: 8px;
    background-color: ${theme.color.wh};
    box-shadow: 0 12px 30px rgba(36, 34, 48, 0.2);

    ${media.mobile} {
        padding: 16px;
    }
`;

const NoticeHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
`;

const NoticeTitle = styled.h2`
    margin: 0;
    color: ${theme.color.textColor};
    font-size: ${theme.fontSize.lg};
    font-weight: 700;
`;

const NoticeDescription = styled.p`
    margin: 14px 0 6px;
    color: ${theme.color.bk};
    font-size: ${theme.fontSize.md};
    font-weight: 500;
    line-height: 1.5;
`;

const NoticePeriod = styled.p`
    margin: 0;
    color: ${theme.color.grey};
    font-size: ${theme.fontSize.sm};
    line-height: 1.5;
    overflow-wrap: anywhere;
`;

const NoticeActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 20px;

    ${media.mobile} {
        flex-direction: column;
    }
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
    min-height: 40px;
    padding: 10px 14px;
    border: 1px solid ${({ $primary }) => ($primary ? theme.color.bgColor : theme.color.grey2)};
    border-radius: 4px;
    background-color: ${({ $primary }) => ($primary ? theme.color.bgColor : theme.color.wh)};
    color: ${({ $primary }) => ($primary ? theme.color.wh : theme.color.grey)};
    font-size: ${theme.fontSize.sm};
    font-weight: 600;
    cursor: pointer;

    &:hover {
        background-color: ${({ $primary }) => ($primary ? theme.color.bgColorHo : theme.color.border)};
    }

    &:focus-visible {
        outline: 2px solid ${theme.color.bgColor};
        outline-offset: 2px;
    }
`;

const RECRUITMENT_NOTICE_DISMISS_UNTIL_KEY = "ibas-recruitment-notice-dismiss-until";

const isRecruitmentSchedule = (data: unknown): data is RecruitmentSchedule => {
    if (!data || typeof data !== "object") {
        return false;
    }

    const schedule = data as RecruitmentSchedule;
    return typeof schedule.signupStartDate === "string" && typeof schedule.signupEndDate === "string";
};

const isRecruitmentPeriod = (schedule: RecruitmentSchedule, now = new Date()) => {
    const signupStartDate = new Date(schedule.signupStartDate);
    const signupEndDate = new Date(schedule.signupEndDate);

    if (Number.isNaN(signupStartDate.getTime()) || Number.isNaN(signupEndDate.getTime())) {
        return false;
    }

    return signupStartDate <= now && now <= signupEndDate;
};

const formatDate = (date: string) => {
    const value = new Date(date);

    if (Number.isNaN(value.getTime())) {
        return "";
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    const hours = String(value.getHours()).padStart(2, "0");
    const minutes = String(value.getMinutes()).padStart(2, "0");

    return `${year}.${month}.${day} ${hours}:${minutes}`;
};

const isDismissedForToday = (now: Date) => {
    try {
        const dismissUntil = localStorage.getItem(RECRUITMENT_NOTICE_DISMISS_UNTIL_KEY);
        return dismissUntil !== null && now.getTime() < new Date(dismissUntil).getTime();
    } catch {
        return false;
    }
};

const dismissUntilTomorrow = (now: Date) => {
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);

    try {
        localStorage.setItem(RECRUITMENT_NOTICE_DISMISS_UNTIL_KEY, tomorrow.toISOString());
    } catch {
        // 브라우저 저장소를 사용할 수 없어도 현재 방문에서는 모달을 닫는다.
    }
};

const RecruitmentScheduleNotice = () => {
    const [schedule, setSchedule] = useState<RecruitmentSchedule | null>(null);
    const [isClosed, setIsClosed] = useState(false);
    const [currentTime, setCurrentTime] = useState(() => new Date());

    useEffect(() => {
        let isMounted = true;

        const fetchSchedule = async () => {
            if (isDismissedForToday(currentTime)) {
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/signUp/schedule`);

                if (!response.ok) {
                    return;
                }

                const data: unknown = await response.json();
                if (isMounted && isRecruitmentSchedule(data) && isRecruitmentPeriod(data)) {
                    setSchedule(data);
                }
            } catch {
                // 일정 조회에 실패하면 메인 화면에는 별도 안내를 표시하지 않는다.
            }
        };

        fetchSchedule();

        return () => {
            isMounted = false;
        };
    }, [currentTime]);

    useEffect(() => {
        if (!schedule) {
            return;
        }

        const signupEndDate = new Date(schedule.signupEndDate);
        const remainingTime = signupEndDate.getTime() - currentTime.getTime() + 1;
        const timeout = window.setTimeout(
            () => setCurrentTime(new Date()),
            Math.min(Math.max(remainingTime, 1), 2_147_483_647)
        );

        return () => window.clearTimeout(timeout);
    }, [schedule, currentTime]);

    if (!schedule || isClosed || !isRecruitmentPeriod(schedule, currentTime)) {
        return null;
    }

    return (
        <NoticeBackground>
            <Notice role="dialog" aria-modal="true" aria-labelledby="recruitment-notice-title">
                <NoticeHeader>
                    <NoticeTitle id="recruitment-notice-title">신입부원 모집 중</NoticeTitle>
                </NoticeHeader>
                <NoticeDescription>IBAS 신입부원을 모집하고 있습니다.</NoticeDescription>
                <NoticePeriod>
                    모집 기간: {formatDate(schedule.signupStartDate)} ~ {formatDate(schedule.signupEndDate)}
                </NoticePeriod>
                <NoticeActions>
                    <ActionButton type="button" onClick={() => setIsClosed(true)}>
                        닫기
                    </ActionButton>
                    <ActionButton
                        type="button"
                        $primary
                        onClick={() => {
                            dismissUntilTomorrow(currentTime);
                            setIsClosed(true);
                        }}
                    >
                        오늘 하루 다시 보지 않기
                    </ActionButton>
                </NoticeActions>
            </Notice>
        </NoticeBackground>
    );
};

export default RecruitmentScheduleNotice;
