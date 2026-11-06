import { request } from './client';
import {
  saveSupportInterface,
  supportDetailInterface,
  supportListInterface,
  supportStatusInterface,
} from '../types/TypeBank';
import { pagedResponseInterface } from '../types/TypeCommon';

// 예산 지원 신청(/budget/application*). 회계 내역(/budget/history*)은 다른 파일에 둔다

// 빈 문자열이면 전체. 백엔드는 빈 status를 null(전체)로 받는다
export type SupportStatusFilter = '' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface BankSupportListParams {
  status: SupportStatusFilter;
  page: number; // 1부터 센다
  size: number;
}

export const getBankSupportList = ({ status, page, size }: BankSupportListParams) =>
  request<pagedResponseInterface<supportListInterface>>(
    `/budget/applications?status=${status}&page=${page - 1}&size=${size}`,
    { auth: true },
  );

export const getBankSupport = (id: string) =>
  request<supportDetailInterface>(`/budget/application/${id}`, { auth: true });

// 201 빈 본문. Location 헤더는 CORS 때문에 읽을 수 없다
export const createBankSupport = (body: saveSupportInterface) =>
  request<null>('/budget/application', { method: 'POST', auth: true, body });

// 수정도 POST다. 204
export const updateBankSupport = (id: string, body: saveSupportInterface) =>
  request<null>(`/budget/application/${id}`, { method: 'POST', auth: true, body });

// 204
export const deleteBankSupport = (id: string) =>
  request<null>(`/budget/application/${id}`, { method: 'DELETE', auth: true });

// 승인·거절·지급 완료. 총무만 부른다. 204
export const updateBankSupportStatus = (id: string, body: supportStatusInterface) =>
  request<null>(`/budget/application/${id}/status`, { method: 'PUT', auth: true, body });
