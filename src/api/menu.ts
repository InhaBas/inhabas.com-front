import { request } from './client';
import { menuInterface } from '../types/TypeCommon';

export const getMenu = (id: number) => request<menuInterface>(`/menu/${id}`);
