import { request } from './client';
import { fileDownloadInterface } from '../types/TypeCommon';

// FormData의 'file' 필드 하나. multipart로 보낸다
export const uploadFile = (menuId: number, body: FormData) =>
  request<fileDownloadInterface>(`/file/upload/${menuId}`, { method: 'POST', auth: true, body });
