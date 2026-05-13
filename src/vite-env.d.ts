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
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
