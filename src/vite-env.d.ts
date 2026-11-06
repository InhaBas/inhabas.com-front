/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_GOOGLE_ID: string;
  readonly VITE_GOOGLE_PW: string;
  readonly VITE_GOOGLE_SCOPE: string;
  readonly VITE_NAVER_ID: string;
  readonly VITE_NAVER_PW: string;
  readonly VITE_KAKAO_ID: string;
  // 'false'면 개발 서버에서도 행사 목데이터 대신 실제 API를 부른다
  readonly VITE_MOCK_EVENTS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
