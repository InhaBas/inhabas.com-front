import { request } from './client';
import { policyInterface } from '../types/TypeCommon';

// 비로그인도 볼 수 있는 약관·회칙. 없는 id면 404
export const getPolicy = (id: string) => request<policyInterface>(`/policy/${id}`);

// 수정(204). 제목은 바꿀 수 없다
export const updatePolicy = (id: string, body: Pick<policyInterface, 'content'>) =>
  request<null>(`/policy/${id}`, { method: 'PUT', auth: true, body });
