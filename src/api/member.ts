import { request } from './client';
import { honorDataInterface, staffInterface } from '../types/ibas/TypeIBAS';
import {
  notGraduatedMemberInterface,
  updateMembersRoleInterface,
  updateMembersTypeInterface,
  updateUnapprovedMembersInterface,
} from '../types/ibas/TypeMember';
import { newUserInterface } from '../types/ibas/TypeMyinfo';
import { chiefInterface, pagedResponseInterface } from '../types/TypeCommon';

export const getExecutiveList = () => request<staffInterface[]>('/members/executive');

export const getHallOfFameList = () =>
  request<honorDataInterface[]>('/members/hof', { auth: true });

export const getChiefContact = () => request<chiefInterface>('/member/chief');

export interface MemberListParams {
  page: number; // 1부터 센다
  size: number;
  search?: string; // 이름이나 학번. 비어 있으면 보내지 않는다
}

const memberListQuery = ({ page, size, search }: MemberListParams) =>
  `?page=${page - 1}&size=${size}${search ? `&search=${encodeURIComponent(search)}` : ''}`;

export const getNotGraduatedMemberList = (params: MemberListParams) =>
  request<pagedResponseInterface<notGraduatedMemberInterface>>(
    `/members/notGraduated${memberListQuery(params)}`,
    { auth: true },
  );

// 응답 한 줄의 모양은 /members/notGraduated와 같다(ApprovedMemberManagementDto)
export const getGraduatedMemberList = (params: MemberListParams) =>
  request<pagedResponseInterface<notGraduatedMemberInterface>>(
    `/members/graduated${memberListQuery(params)}`,
    { auth: true },
  );

export const getUnapprovedMemberList = (params: MemberListParams) =>
  request<pagedResponseInterface<newUserInterface>>(
    `/members/unapproved${memberListQuery(params)}`,
    { auth: true },
  );

// 아래 변경은 모두 204
export const updateUnapprovedMembers = (body: updateUnapprovedMembersInterface) =>
  request<null>('/members/unapproved', { method: 'PUT', auth: true, body });

export const updateApprovedMembersRole = (body: updateMembersRoleInterface) =>
  request<null>('/members/approved/role', { method: 'PUT', auth: true, body });

export const updateApprovedMembersType = (body: updateMembersTypeInterface) =>
  request<null>('/members/approved/type', { method: 'PUT', auth: true, body });
