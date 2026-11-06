import { request } from './client';
import { honorDataInterface, staffInterface } from '../types/ibas/TypeIBAS';
import { chiefInterface } from '../types/TypeCommon';

export const getExecutiveList = () => request<staffInterface[]>('/members/executive');

export const getHallOfFameList = () =>
  request<honorDataInterface[]>('/members/hof', { auth: true });

export const getChiefContact = () => request<chiefInterface>('/member/chief');
