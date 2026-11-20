/*
  소셜 로그인 수단과 이 브라우저에서 최근에 쓴 수단 기록.
  - 기록은 provider 이름(google·naver·kakao)만 남긴다. 계정 정보는 남기지 않는다.
  - 저장소를 쓸 수 없는 환경(사생활 보호 모드, 차단된 저장소)에서는 기록 없이 동작한다.
*/
export const LOGIN_PROVIDERS = ['google', 'naver', 'kakao'] as const;
export type LoginProvider = (typeof LOGIN_PROVIDERS)[number];

const RECENT_LOGIN_KEY = 'ibas_recent_login';

const isLoginProvider = (value: unknown): value is LoginProvider =>
  LOGIN_PROVIDERS.includes(value as LoginProvider);

export function readRecentLogin(): LoginProvider | null {
  try {
    const value = window.localStorage.getItem(RECENT_LOGIN_KEY);
    return isLoginProvider(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveRecentLogin(provider: LoginProvider) {
  try {
    window.localStorage.setItem(RECENT_LOGIN_KEY, provider);
  } catch {
    // 기록하지 못해도 로그인은 계속한다
  }
}

/*
  OAuth 실패 안내 종류. 백엔드 Oauth2AuthenticationFailureHandler는 실패하면
  defaultRedirectUri(/login/process) 뒤에 ?error=<OAuth2 오류 코드 또는 예외 메시지>를 붙여 보낸다.
  동의 취소는 Google·Naver·Kakao 모두 access_denied로 온다. 서버 원문은 화면에 쓰지 않는다.
*/
export type LoginErrorKind = 'canceled' | 'failed';

// 로그인 처리 경로가 서버의 error 값을 종류로 바꾼다
export const toLoginErrorKind = (error: string): LoginErrorKind =>
  error === 'access_denied' ? 'canceled' : 'failed';

// 로그인 화면이 /login?error=<종류>를 읽는다. 모르는 값은 실패로 본다
export const parseLoginErrorKind = (value: string): LoginErrorKind =>
  value === 'canceled' ? 'canceled' : 'failed';
