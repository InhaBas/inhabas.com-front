import { request } from './client';
import { honorDataInterface, staffInterface } from '../types/ibas/TypeIBAS';
import { notGraduatedMemberInterface } from '../types/ibas/TypeMember';
import { chiefInterface, pagedResponseInterface } from '../types/TypeCommon';

export const getExecutiveList = () => request<staffInterface[]>('/members/executive');

export const getHallOfFameList = () =>
  request<honorDataInterface[]>('/members/hof', { auth: true });

export const getChiefContact = () => request<chiefInterface>('/member/chief');

export interface NotGraduatedMemberListParams {
  page: number; // 1부터 센다
  size: number;
}

export const getNotGraduatedMemberList = ({ page, size }: NotGraduatedMemberListParams) =>
  request<pagedResponseInterface<notGraduatedMemberInterface>>(
    `/members/notGraduated?page=${page - 1}&size=${size}`,
    { auth: true },
  );
