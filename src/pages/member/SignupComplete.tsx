import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResetRecoilState } from 'recoil';
import { styled } from 'styled-components';

import { getAccessToken } from '../../api/token';
import { CheckIcon } from '../../components/common/form/icons';
import ResultNotice from '../../components/common/form/ResultNotice';
import StepIndicator, {
  PROFESSOR_SIGNUP_STEPS,
  STUDENT_SIGNUP_STEPS,
} from '../../components/common/form/StepIndicator';
import { SignupLayout } from '../../components/member/MemberLayout';
import { useEndSession } from '../../queries/myInfo';
import { userEmail, userImage } from '../../recoil/backState';
import { majorSelected } from '../../recoil/frontState';
import { tokenInterface } from '../../types/TypeCommon';

/*
  가입 완료 안내(/signup/complete). 학생은 2단계 제출 뒤, 교수는 1단계 제출 뒤 이 화면으로 온다.
    navigate('/signup/complete', { replace: true, state: { identity: 'professor' } })
  state가 없으면 학생 단계 목록을 보여 준다. history state라 새로고침해도 유지된다.

  세션 정리는 화면에 들어올 때 한 번 한다.
  - 가입 직후 토큰 역할은 SIGNING_UP으로 남고(재발급도 클레임을 복사한다), 승인 대기(NOT_APPROVED) 권한은 비로그인과 같다.
    그래서 로그아웃해도 잃는 것이 없고, 다음 로그인에서 새 역할의 토큰을 받는다.
  - 들어올 때 정리해야 [홈으로]가 아닌 로고·뒤로 가기·주소창으로 떠나도 헤더가 "가입 중"으로 남지 않는다.
  - 새로고침하면 토큰이 이미 지워져 있다. sessionStorage 표시가 있으면 이 안내를 그대로 다시 보여 준다.
  - 직접 접근: 가입 중·승인 대기 토큰도, 표시도 없으면(비로그인이거나 다른 회원) 세션을 건드리지 않고 홈으로 보낸다.
*/

// 1단계에서 고른 신분. 1단계 폼 값과 완료 화면의 단계 목록이 함께 쓴다
export type SignupIdentity = 'student' | 'professor';

export interface SignupCompleteState {
  identity?: SignupIdentity;
}

// 이 탭에서 가입을 마치고 세션을 정리했다는 표시. 새로고침 때 안내를 다시 보여 주는 데만 쓴다
const COMPLETED_KEY = 'ibas_signup_completed';

const JUST_SIGNED_UP_ROLES = ['ROLE_SIGNING_UP', 'ROLE_NOT_APPROVED'];

const hasJustSignedUpToken = () => {
  const token = getAccessToken();
  // 'signing'은 HeaderNav가 /signUp/check false를 보고 넣는 가입 중 센티널이다
  if (token === 'signing') return true;
  if (token === 'default') return false;
  try {
    const { authorities } = jwtDecode<tokenInterface>(token);
    return authorities?.some((role) => JUST_SIGNED_UP_ROLES.includes(role)) ?? false;
  } catch {
    return false;
  }
};

const readCompletedMark = () => {
  try {
    return sessionStorage.getItem(COMPLETED_KEY) === '1';
  } catch {
    return false;
  }
};

const writeCompletedMark = () => {
  try {
    sessionStorage.setItem(COMPLETED_KEY, '1');
  } catch {
    // 저장소를 못 쓰면 새로고침 때 홈으로 갈 뿐이다
  }
};

type Entry = 'fresh' | 'revisit' | 'none';

const resolveEntry = (): Entry => {
  if (hasJustSignedUpToken()) return 'fresh';
  if (readCompletedMark()) return 'revisit';
  return 'none';
};

const SignupComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const endSession = useEndSession();
  const resetMajor = useResetRecoilState(majorSelected);
  const resetEmail = useResetRecoilState(userEmail);
  const resetImage = useResetRecoilState(userImage);

  // 세션을 지우기 전에 한 번만 판단한다. 지운 뒤 다시 렌더돼도 판단이 바뀌지 않는다
  const [entry] = useState(resolveEntry);

  const identity = (location.state as SignupCompleteState | null)?.identity;
  const steps = identity === 'professor' ? PROFESSOR_SIGNUP_STEPS : STUDENT_SIGNUP_STEPS;

  useEffect(() => {
    if (entry === 'none') {
      navigate('/', { replace: true });
      return;
    }
    if (entry === 'revisit') return;

    writeCompletedMark();
    // 로그아웃과 같은 정리에 회원가입 중 쌓인 클라이언트 상태(전공 선택, 이메일, 프로필 사진) 초기화를 더한다
    endSession();
    resetMajor();
    resetEmail();
    resetImage();
  }, [entry, navigate, endSession, resetMajor, resetEmail, resetImage]);

  if (entry === 'none') return null;

  return (
    <SignupLayout panel="result">
      <StepIndicator steps={steps} current={steps.length} />
      <Notice>
        <ResultNotice
          icon={<CheckIcon size={32} />}
          title="가입 신청이 접수됐어요"
          note="승인 전에는 동아리 소개·앨범 같은 공개 메뉴만 볼 수 있어요. 승인 메일을 받은 뒤 다시 로그인하면 모든 메뉴를 쓸 수 있어요."
        >
          운영진이 확인한 뒤 가입한 소셜 계정(Google·네이버·카카오)의 이메일로 결과를 보내 드려요.
        </ResultNotice>
      </Notice>
    </SignupLayout>
  );
};

export default SignupComplete;

const Notice = styled.div`
  margin-top: 8px;
`;
