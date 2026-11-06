import { request } from './client';
import {
  profileInterface,
  updateMyInfoDetailInterface,
  updateMyInfoIntroInterface,
} from '../types/ibas/TypeMyinfo';

export const getMyInfo = () => request<profileInterface>('/myInfo', { auth: true });

// 아래 변경은 모두 204
export const updateMyInfoDetail = (body: updateMyInfoDetailInterface) =>
  request<null>('/myInfo/detail', { method: 'PUT', auth: true, body });

export const updateMyInfoIntro = (body: updateMyInfoIntroInterface) =>
  request<null>('/myInfo/intro', { method: 'PUT', auth: true, body });

// FormData의 'picture' 필드. multipart로 보낸다
export const updateMyInfoPicture = (body: FormData) =>
  request<null>('/myInfo/picture', { method: 'POST', auth: true, body });

// 회장 승인 뒤에 바뀌는 이름 수정 요청이다.
// 본문은 옛 화면 그대로 입력값 문자열 하나를 JSON으로 보낸다(객체로 감싸지 않는다)
export const requestMyInfoNameChange = (name: string | undefined) =>
  request<null>('/myInfo/name', { method: 'PUT', auth: true, body: name });
