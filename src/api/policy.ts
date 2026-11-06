import { request } from './client';
import { policyInterface } from '../types/TypeCommon';

// 비로그인도 볼 수 있는 약관·회칙. 없는 id면 404
export const getPolicy = (id: string) => request<policyInterface>(`/policy/${id}`);
