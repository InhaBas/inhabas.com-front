import { request } from './client';
import { RefreshTokenResponse } from '../types/TypeAuth';

const getCookie = (name: string) => {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

// refresh 쿠키(ibas_refresh)로 새 access 토큰을 받는다.
// 토큰 저장·실패 처리는 src/queries/apiErrorEffects.ts의 refresh 흐름이 맡는다
export const refreshAccessToken = () =>
  request<RefreshTokenResponse>('/token/refresh', {
    method: 'POST',
    body: { refreshToken: getCookie('ibas_refresh') },
  });
