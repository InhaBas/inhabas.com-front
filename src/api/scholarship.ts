import { request } from './client';
import {
  saveScholarshipHistoryInterface,
  scholarshipBoardInterface,
  scholarshipHistoryInterface,
} from '../types/ibas/TypeIBAS';
import { pagedResponseInterface } from '../types/TypeCommon';

export type ScholarshipBoardType = 'SPONSOR' | 'USAGE';

export interface ScholarshipBoardListParams {
  boardType: ScholarshipBoardType;
  page: number; // 1부터 센다
  size: number;
}

// 토큰 없이 부른다. 백엔드 핸들러가 회원 정보를 받지 않아 토큰 유무와 관계없이 응답이 같다
export const getScholarshipHistoryList = () =>
  request<scholarshipHistoryInterface[]>('/scholarship/histories');

// 201 빈 본문. Location 헤더는 CORS 때문에 읽을 수 없다
export const createScholarshipHistory = (body: saveScholarshipHistoryInterface) =>
  request<null>('/scholarship/history', { method: 'POST', auth: true, body });

export const updateScholarshipHistory = (id: number, body: saveScholarshipHistoryInterface) =>
  request<null>(`/scholarship/history/${id}`, { method: 'PUT', auth: true, body });

export const deleteScholarshipHistory = (id: number) =>
  request<null>(`/scholarship/history/${id}`, { method: 'DELETE', auth: true });

export const getScholarshipBoardList = ({ boardType, page, size }: ScholarshipBoardListParams) =>
  request<pagedResponseInterface<scholarshipBoardInterface>>(
    `/scholarship/${boardType}?page=${page - 1}&size=${size}`,
  );
