import { request } from './client';
import {
  answersInterface,
  majorInterface,
  questionnariesInterface,
  signUpCheckInterface,
  signUpInterface,
} from '../types/ibas/TypeMember';

// 비로그인 사용자도 'default' 토큰을 싣는다. 새로고침 때 A005를 받아 refresh로 로그인을 복원하는 경로다
export const getSignUpCheck = () => request<signUpCheckInterface>('/signUp/check', { auth: true });

export const getMajorList = () => request<majorInterface[]>('/signUp/majorInfo');

// 임시저장한 개인정보. 저장한 이력이 없으면 필드가 모두 null이다
export const getSignUpProfile = () => request<signUpInterface>('/signUp', { auth: true });

// 개인정보 저장(204). 학생은 이어서 질문 화면으로, 교수는 이것으로 가입이 끝난다
export const createSignUpProfile = (body: signUpInterface) =>
  request<null>('/signUp', { method: 'POST', auth: true, body });

export const getSignUpQuestionnaires = () =>
  request<questionnariesInterface[]>('/signUp/questionnaires');

export const getSignUpAnswers = () =>
  request<answersInterface[]>('/signUp/answers', { auth: true });

// 답변 임시저장(200 빈 본문)
export const createSignUpAnswers = (body: answersInterface[]) =>
  request<null>('/signUp/answers', { method: 'POST', auth: true, body });

// 답변을 보내며 가입을 마친다(204)
export const completeSignUp = (body: answersInterface[]) =>
  request<null>('/signUp', { method: 'PUT', auth: true, body });
