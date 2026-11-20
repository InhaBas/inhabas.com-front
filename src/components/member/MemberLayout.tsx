import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { css, styled } from 'styled-components';

import { media } from '../../styles/theme';
import { focusRing } from '../common/form/formStyles';

/*
  로그인·회원가입 화면의 틀. 헤더 없이 왼쪽 흰 패널과 오른쪽 배경 이미지로 나뉜다(모바일은 패널만).
  - 회원가입 화면(1단계·2단계·완료)은 SignupLayout 하나로 그린다.
  - 로그인은 패널 구성(아래 저작권 문구)과 배경이 달라 MemberPage·HomeLogoLink만 함께 쓴다.
*/

// 앱 바깥 Div가 white-space: nowrap이라 문구가 넘치지 않게 되돌린다
export const MemberPage = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.color.wh};
  white-space: normal;
  word-break: keep-all;
`;

const LOGO_SIZES = {
  // 로그인
  large: { desktop: '150px', mobile: '120px' },
  // 회원가입
  medium: { desktop: '88px', mobile: '72px' },
} as const;

type LogoSize = keyof typeof LOGO_SIZES;

export const HomeLogoLink = ({ size = 'medium' }: { size?: LogoSize }) => (
  <LogoLink to="/" aria-label="IBAS 홈으로" $size={size}>
    <img src="/images/ibas-main-logo_purple.png" alt="" />
  </LogoLink>
);

/*
  회원가입 화면별 패널 크기.
  - form: 1단계. questions: 2단계(긴 답변 칸이라 넓다). result: 완료 안내
  - result는 태블릿 구간 규칙이 없다(데스크톱 폭 그대로)
*/
const SIGNUP_PANELS = {
  form: { width: '480px', tabletWidth: '52%', columnWidth: '400px', gap: '24px' },
  questions: { width: '680px', tabletWidth: '64%', columnWidth: '600px', gap: '24px' },
  result: { width: '480px', tabletWidth: null, columnWidth: '400px', gap: '32px' },
} as const;

type SignupPanel = keyof typeof SIGNUP_PANELS;

interface SignupLayoutProps {
  panel: SignupPanel;
  children: ReactNode;
}

// 로고 아래에 children을 세로로 쌓는다
export const SignupLayout = ({ panel, children }: SignupLayoutProps) => (
  <MemberPage>
    <Panel $panel={panel}>
      <Column $panel={panel}>
        <HomeLogoLink />
        {children}
      </Column>
    </Panel>
    <Background aria-hidden="true" />
  </MemberPage>
);

// 단계 표시(StepIndicator) 자리. 넓은 패널에서도 400px을 넘지 않고 가운데에 둔다
export const SignupSteps = styled.div`
  align-self: center;
  width: 400px;
  max-width: 100%;
`;

const LogoLink = styled(Link)<{ $size: LogoSize }>`
  align-self: center;
  border-radius: 8px;

  img {
    display: block;
    width: ${({ $size }) => LOGO_SIZES[$size].desktop};
    height: ${({ $size }) => LOGO_SIZES[$size].desktop};

    ${media.mobile} {
      width: ${({ $size }) => LOGO_SIZES[$size].mobile};
      height: ${({ $size }) => LOGO_SIZES[$size].mobile};
    }
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    ${focusRing}
  }
`;

const Panel = styled.main<{ $panel: SignupPanel }>`
  flex: none;
  width: ${({ $panel }) => SIGNUP_PANELS[$panel].width};
  padding: 48px 40px 64px;
  background-color: ${({ theme }) => theme.color.wh};

  ${({ $panel }) => {
    const { tabletWidth } = SIGNUP_PANELS[$panel];
    return (
      tabletWidth &&
      css`
        ${media.tabletOnly} {
          width: ${tabletWidth};
          padding: 40px 32px 56px;
        }
      `
    );
  }}

  ${media.mobile} {
    width: 100%;
    padding: 32px 20px 40px;
  }
`;

const Column = styled.div<{ $panel: SignupPanel }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $panel }) => SIGNUP_PANELS[$panel].gap};
  max-width: ${({ $panel }) => SIGNUP_PANELS[$panel].columnWidth};
  margin: 0 auto;
`;

const Background = styled.div`
  position: sticky;
  top: 0;
  flex: 1;
  height: 100vh;
  background: url('/images/member-background.jpg') center / cover no-repeat;

  ${media.mobile} {
    display: none;
  }
`;
