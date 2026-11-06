import { request } from './client';
import { majorInterface, signUpCheckInterface } from '../types/ibas/TypeMember';

// 비로그인 사용자도 'default' 토큰을 싣는다. 새로고침 때 A005를 받아 refresh로 로그인을 복원하는 경로다
export const getSignUpCheck = () => request<signUpCheckInterface>('/signUp/check', { auth: true });

export const getMajorList = () => request<majorInterface[]>('/signUp/majorInfo');
