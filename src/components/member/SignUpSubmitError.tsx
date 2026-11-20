import { ReactNode, useEffect, useRef } from 'react';

import { classifySignUpError } from '../../functions/signUpErrors';
import FormBanner from '../common/form/FormBanner';

/*
  회원가입 폼 제출(뮤테이션) 오류 표시. 오류 종류는 classifySignUpError로 나눈다.
  - closed(S001): 배너 없이 onClosed를 불러 화면이 모집 기간 아님 안내로 바뀌게 한다
  - invalid(G003): 입력값 확인 배너
  - unknown: children(무엇을 못 했는지)과 [다시 시도] 배너
  배너가 새로 뜨면 화면 가운데로 스크롤한다.
    <SignUpSubmitError error={mutation.error} onClosed={markClosed} onRetry={() => onSubmit()}>
      기본 정보를 저장하지 못했어요. 잠시 뒤 다시 시도해 주세요
    </SignUpSubmitError>
*/
interface SignUpSubmitErrorProps {
  error: unknown;
  onClosed: () => void;
  onRetry: () => void;
  children: ReactNode;
}

const SignUpSubmitError = ({ error, onClosed, onRetry, children }: SignUpSubmitErrorProps) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const errorKind = error ? classifySignUpError(error) : null;

  useEffect(() => {
    if (errorKind === 'closed') onClosed();
    else if (errorKind) bannerRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [errorKind, onClosed]);

  if (!errorKind || errorKind === 'closed') return null;

  return (
    <div ref={bannerRef}>
      {errorKind === 'invalid' ? (
        <FormBanner>입력값을 확인해 주세요. 계속 안 되면 웹 팀에 문의해 주세요</FormBanner>
      ) : (
        <FormBanner action={{ label: '다시 시도', onClick: onRetry }}>{children}</FormBanner>
      )}
    </div>
  );
};

export default SignUpSubmitError;
