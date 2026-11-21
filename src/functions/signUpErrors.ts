import { ApiError } from '../api/client';

/*
  회원가입 요청 오류의 종류. 공통 처리기는 회원가입 요청에 alert·이동을 하지 않으므로(apiErrorEffects.ts)
  화면은 이 결과만 보고 표시를 정한다.
    const errorKind = createMutation.isError ? classifySignUpError(createMutation.error) : null;
  - closed:  403 S001. 가입 기간이 아니다 → 모집 기간 아님 안내와 [홈으로]
  - invalid: 400 G003. 서버가 칸을 특정하지 않은 입력 오류 → 폼 위 일반 오류, 입력값 유지
  - unknown: 그 밖(500·네트워크 오류·다른 코드) → 폼 위 일반 실패와 다시 시도 안내
*/
export type SignUpErrorKind = 'closed' | 'invalid' | 'unknown';

export function classifySignUpError(error: unknown): SignUpErrorKind {
  if (!(error instanceof ApiError)) return 'unknown';

  switch (error.body?.code) {
    case 'S001':
      return 'closed';
    case 'G003':
      return 'invalid';
    default:
      return 'unknown';
  }
}
