import { request } from './client';
import {
  contestDetailInterface,
  contestListInterface,
  saveContestInterface,
} from '../types/TypeBoard';
import { pagedResponseInterface } from '../types/TypeCommon';

export type ContestType = 'contest' | 'activity';
export type ContestOrderBy = 'ALL' | 'DUE_DATE';

export interface ContestListParams {
  contestType: ContestType;
  page: number; // 1부터 센다
  size: number;
  search: string; // 제출한 검색어. 빈 문자열이면 검색하지 않는다
  orderBy: ContestOrderBy;
}

// 토큰 없이 부른다(옛 BoardList와 같다)
export const getContestList = ({ contestType, page, size, search, orderBy }: ContestListParams) =>
  request<pagedResponseInterface<contestListInterface>>(
    `/contest/${contestType}?page=${page - 1}&size=${size}&orderBy=${orderBy}${
      search ? `&search=${encodeURIComponent(search)}` : ''
    }`,
  );

export interface ContestDetailParams {
  contestType: ContestType;
  id: string;
  // 상세 화면은 토큰 없이, 수정 화면은 토큰과 함께 부른다(옛 화면과 같다)
  auth: boolean;
}

export const getContest = ({ contestType, id, auth }: ContestDetailParams) =>
  request<contestDetailInterface>(`/contest/${contestType}/${id}`, { auth });

// 201 빈 본문. Location 헤더는 CORS 때문에 읽을 수 없다
export const createContest = (contestType: ContestType, body: saveContestInterface) =>
  request<null>(`/contest/${contestType}`, { method: 'POST', auth: true, body });

// 수정도 POST다. 204
export const updateContest = (contestType: ContestType, id: string, body: saveContestInterface) =>
  request<null>(`/contest/${contestType}/${id}`, { method: 'POST', auth: true, body });

// 204
export const deleteContest = (contestType: ContestType, id: string) =>
  request<null>(`/contest/${contestType}/${id}`, { method: 'DELETE', auth: true });
