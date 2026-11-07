import { request } from './client';
import { BankHistoryPayload } from '../functions/bankHistoryFunctions';
import {
  bankHistoryDetailInterface,
  bankHistoryListResponseInterface,
} from '../types/TypeBankHistory';

/*
  회계 내역(/budget/history, /budget/histories). 예산 신청(/budget/application)은 다른 파일에 둔다
*/

// 회계 내역이 있는 연도 목록. 옛 화면대로 토큰 없이 부른다
export const getBankHistoryYears = () => request<number[]>('/budget/histories/years');

export interface BankHistoryListParams {
  year: string; // 빈 문자열이면 전체 기간(백엔드는 year= 빈 값을 null로 받는다)
  page: number; // 1부터 센다
  size: number;
}

export const getBankHistoryList = ({ year, page, size }: BankHistoryListParams) =>
  request<bankHistoryListResponseInterface>(
    `/budget/histories?year=${year}&page=${page - 1}&size=${size}`,
    { auth: true },
  );

export const getBankHistory = (id: string) =>
  request<bankHistoryDetailInterface>(`/budget/history/${id}`, { auth: true });

// 201 빈 본문
export const createBankHistory = (body: BankHistoryPayload) =>
  request<null>('/budget/history', { method: 'POST', auth: true, body });

// 수정은 PUT이 아니라 POST다. 204
export const updateBankHistory = (id: string, body: BankHistoryPayload) =>
  request<null>(`/budget/history/${id}`, { method: 'POST', auth: true, body });

// 204
export const deleteBankHistory = (id: number) =>
  request<null>(`/budget/history/${id}`, { method: 'DELETE', auth: true });
