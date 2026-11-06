import { request } from './client';
import { contestListInterface } from '../types/TypeBoard';
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
