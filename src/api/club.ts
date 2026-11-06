import { request } from './client';
import { historyInterface, saveHistoryInterface } from '../types/ibas/TypeIBAS';

export const getClubHistoryList = () => request<historyInterface[]>('/club/histories');

export const getClubHistory = (id: number) => request<historyInterface>(`/club/history/${id}`);

// 201 빈 본문. Location 헤더는 CORS 때문에 읽을 수 없다
export const createClubHistory = (body: saveHistoryInterface) =>
  request<null>('/club/history', { method: 'POST', auth: true, body });

export const updateClubHistory = (id: number, body: saveHistoryInterface) =>
  request<null>(`/club/history/${id}`, { method: 'PUT', auth: true, body });

export const deleteClubHistory = (id: number) =>
  request<null>(`/club/history/${id}`, { method: 'DELETE', auth: true });
