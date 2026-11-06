import { request } from './client';
import {
  ActivityDetailInterface,
  ActivityInterface,
  historyInterface,
  saveActivityInterface,
  saveHistoryInterface,
} from '../types/ibas/TypeIBAS';
import { pagedResponseInterface } from '../types/TypeCommon';

export const getClubHistoryList = () => request<historyInterface[]>('/club/histories');

export const getClubHistory = (id: number) => request<historyInterface>(`/club/history/${id}`);

// 201 빈 본문. Location 헤더는 CORS 때문에 읽을 수 없다
export const createClubHistory = (body: saveHistoryInterface) =>
  request<null>('/club/history', { method: 'POST', auth: true, body });

export const updateClubHistory = (id: number, body: saveHistoryInterface) =>
  request<null>(`/club/history/${id}`, { method: 'PUT', auth: true, body });

export const deleteClubHistory = (id: number) =>
  request<null>(`/club/history/${id}`, { method: 'DELETE', auth: true });

export interface ClubActivityListParams {
  page: number; // 1부터 센다
  size: number;
}

/*
  토큰과 함께 부른다. 옛 화면은 1페이지만 토큰과 함께, 2페이지부터는 Pagination이 토큰 없이 불렀다.
  백엔드는 이 GET에서 토큰을 보지 않는다(WebSecurityConfig의 JWT 필터 skip 경로)
*/
export const getClubActivityList = ({ page, size }: ClubActivityListParams) =>
  request<pagedResponseInterface<ActivityInterface>>(
    `/club/activities?page=${page - 1}&size=${size}`,
    { auth: true },
  );

export interface ClubActivityDetailParams {
  id: string;
  // 상세 화면은 토큰 없이, 수정 화면은 토큰과 함께 부른다(옛 화면과 같다)
  auth: boolean;
}

export const getClubActivity = ({ id, auth }: ClubActivityDetailParams) =>
  request<ActivityDetailInterface>(`/club/activity/${id}`, { auth });

// 201 빈 본문. Location 헤더는 CORS 때문에 읽을 수 없다
export const createClubActivity = (body: saveActivityInterface) =>
  request<null>('/club/activity', { method: 'POST', auth: true, body });

// 수정도 POST다. 204
export const updateClubActivity = (id: string, body: saveActivityInterface) =>
  request<null>(`/club/activity/${id}`, { method: 'POST', auth: true, body });

// 204
export const deleteClubActivity = (id: string) =>
  request<null>(`/club/activity/${id}`, { method: 'DELETE', auth: true });
