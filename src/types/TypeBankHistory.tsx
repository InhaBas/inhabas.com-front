import { fileDownloadInterface, pagedResponseInterface } from './TypeCommon';

// 백엔드 BudgetHistoryDto (회계 내역 목록의 한 줄). 날짜는 yyyy-MM-dd'T'HH:mm:ss
export interface bankHistoryInterface {
  id: number;
  dateUsed: string;
  dateCreated: string;
  dateUpdated: string;
  title: string;
  income: number;
  outcome: number;
  memberStudentIdReceived: string;
  memberNameReceived: string;
  memberIdInCharge: number;
  memberStudentIdInCharge: string;
  memberNameInCharge: string;
}

// 백엔드 BudgetHistoryListResponse. balance는 연도와 관계없는 현재 잔액이다
export interface bankHistoryListResponseInterface {
  page: pagedResponseInterface<bankHistoryInterface>;
  balance: number;
}

// 백엔드 BudgetHistoryDetailDto
export interface bankHistoryDetailInterface {
  id: number;
  dateUsed: string;
  dateCreated: string;
  dateUpdated: string;
  title: string;
  details: string;
  income: number;
  outcome: number;
  account: string;
  memberIdReceived: number;
  memberStudentIdReceived: string;
  memberNameReceived: string;
  memberStudentIdInCharge: string;
  memberNameInCharge: string;
  receipts: fileDownloadInterface[];
}
