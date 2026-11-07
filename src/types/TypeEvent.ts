// 행사 캘린더 API(GET /events) 응답 타입. 백엔드에 제안한 계약 초안을 따른다.
// 날짜·시각 문자열은 `yyyy-MM-dd'T'HH:mm:ss`(KST, 오프셋 없음)이다.

// 행사 종류
export type EventType = 'STUDY' | 'LECTURE' | 'ACADEMIC' | 'SOCIAL' | 'TESTER';

// 일정 구분. RECRUITMENT 일정이 그 행사의 신청 기간이다 (행사당 최대 1개)
export type ScheduleKind = 'RECRUITMENT' | 'GENERAL';

export interface EventThumbnail {
  id: number;
  name: string;
  url: string;
  size: number;
  type: string;
}

// 일정: 행사에 속한 하나의 날짜 또는 기간
export interface EventSchedule {
  id: number;
  title: string;
  kind: ScheduleKind;
  startAt: string;
  // null이면 하루짜리 일정 또는 시점
  endAt: string | null;
  // true면 시간 부분은 00:00:00이고 endAt은 마지막 날을 포함한다
  allDay: boolean;
}

// 행사: 하나 이상의 일정을 가진 활동 단위.
// DOM 전역 Event와 헷갈리지 않도록 ClubEvent라고 부른다
export interface ClubEvent {
  id: number;
  title: string;
  type: EventType;
  place: string | null;
  description: string;
  thumbnail: EventThumbnail | null;
  // 정원. null이면 제한 없음
  capacity: number | null;
  // startAt 오름차순, 항상 1개 이상
  schedules: EventSchedule[];
}

export interface EventRange {
  // yyyy-MM-dd, 양끝 포함
  from: string;
  to: string;
}
