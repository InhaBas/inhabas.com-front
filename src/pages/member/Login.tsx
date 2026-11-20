import { ReactNode, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import FormBanner from '../../components/common/form/FormBanner';
import { focusRing } from '../../components/common/form/formStyles';
import {
  LoginErrorKind,
  LoginProvider,
  readRecentLogin,
  saveRecentLogin,
  toLoginErrorKind,
} from '../../functions/loginMethods';
import { media } from '../../styles/theme';

const KakaoIcon = () => (
  <svg viewBox="0 0 36 36" aria-hidden="true" focusable="false">
    <path
      fill="#000"
      d="M18 1.2C8.06 1.2 0 7.43 0 15.1c0 4.78 3.12 8.99 7.86 11.49l-2 7.3c-.17.64.56 1.16 1.13.78l8.75-5.78c.74.07 1.49.11 2.26.11 9.94 0 18-6.22 18-13.9S27.94 1.2 18 1.2z"
    />
  </svg>
);

const SOCIAL_BUTTONS: { provider: LoginProvider; label: string; icon: ReactNode }[] = [
  { provider: 'google', label: 'Google로 로그인', icon: <img src="/images/google.png" alt="" /> },
  { provider: 'naver', label: '네이버로 로그인', icon: <img src="/images/naver.png" alt="" /> },
  { provider: 'kakao', label: '카카오로 로그인', icon: <KakaoIcon /> },
];

const ERROR_MESSAGES: Record<LoginErrorKind, string> = {
  canceled: '로그인을 취소했어요.',
  failed: '로그인에 실패했어요. 다시 시도하거나 다른 소셜 계정을 확인해 주세요.',
};

const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const errorParam = searchParams.get('error');

  // 처음 받은 error 값으로 안내를 정하고, URL에서는 지운다(새로고침해도 다시 뜨지 않게)
  const [errorKind] = useState<LoginErrorKind | null>(() =>
    errorParam ? toLoginErrorKind(errorParam) : null,
  );
  const [recentProvider] = useState(readRecentLogin);

  useEffect(() => {
    if (errorParam === null) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('error');
        return next;
      },
      { replace: true },
    );
  }, [errorParam, setSearchParams]);

  const moveLogin = (provider: LoginProvider) => {
    saveRecentLogin(provider);
    window.location.assign(
      `${import.meta.env.VITE_API_URL}/login/oauth2/authorization/${provider}`,
    );
  };

  return (
    <Page>
      <Panel>
        <Content>
          <LogoLink to="/" aria-label="IBAS 홈으로">
            <img src="/images/ibas-main-logo_purple.png" alt="" />
          </LogoLink>

          <Options>
            {errorKind && (
              <FormBanner tone={errorKind === 'canceled' ? 'info' : 'error'}>
                {ERROR_MESSAGES[errorKind]}
              </FormBanner>
            )}
            <Heading>소셜 계정으로 로그인</Heading>
            <ButtonList>
              {SOCIAL_BUTTONS.map(({ provider, label, icon }) => {
                const isRecent = provider === recentProvider;
                return (
                  <SocialButton
                    key={provider}
                    type="button"
                    $provider={provider}
                    aria-label={label}
                    aria-describedby={isRecent ? 'recent-login-badge' : undefined}
                    onClick={() => moveLogin(provider)}
                  >
                    {icon}
                    {label}
                    {isRecent && <RecentBadge id="recent-login-badge">최근 사용</RecentBadge>}
                  </SocialButton>
                );
              })}
            </ButtonList>
            {!errorKind && (
              <Guide>처음이라면 쓰고 싶은 계정으로 로그인하면 가입 신청을 시작해요.</Guide>
            )}
          </Options>
        </Content>

        <Copyright>
          <p>©INHA BAS All rights reserved.</p>
          <p>Developed by 양태영, 신승연, 김채림, 윤예진, 유동현</p>
        </Copyright>
      </Panel>
      <Background aria-hidden="true" />
    </Page>
  );
};

export default Login;

const Page = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.color.wh};
  white-space: normal;
  word-break: keep-all;
`;

const Panel = styled.main`
  flex: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  width: 480px;
  min-height: 100vh;
  padding: 56px 40px 32px;
  background-color: ${({ theme }) => theme.color.wh};

  ${media.mobile} {
    width: 100%;
    padding: 32px 20px 40px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
  max-width: 400px;
  margin-top: 72px;

  ${media.mobile} {
    margin-top: 0;
  }
`;

const LogoLink = styled(Link)`
  display: block;
  align-self: center;
  width: 150px;
  height: 150px;
  border-radius: 8px;

  img {
    display: block;
    width: 100%;
    height: 100%;
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    ${focusRing}
  }

  ${media.mobile} {
    width: 120px;
    height: 120px;
  }
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-self: center;
  width: 320px;

  ${media.mobile} {
    width: 100%;
  }
`;

const Heading = styled.h1`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 0 12px;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.color.grey};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(0, 0, 0, 0.2);
  }
`;

const ButtonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PROVIDER_COLORS: Record<LoginProvider, { bg: string; text: string; border: string }> = {
  google: { bg: '#ffffff', text: '#242230', border: '#7F8193' },
  naver: { bg: '#03c75a', text: '#ffffff', border: 'transparent' },
  kakao: { bg: '#fee500', text: 'rgba(0, 0, 0, 0.85)', border: 'transparent' },
};

const SocialButton = styled.button<{ $provider: LoginProvider }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  border: 1px solid ${({ $provider }) => PROVIDER_COLORS[$provider].border};
  border-radius: 8px;
  background-color: ${({ $provider }) => PROVIDER_COLORS[$provider].bg};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  color: ${({ $provider }) => PROVIDER_COLORS[$provider].text};
  cursor: pointer;

  img,
  svg {
    position: absolute;
    top: 50%;
    left: 16px;
    width: 20px;
    height: 20px;
    transform: translateY(-50%);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    ${focusRing}
  }
`;

const RecentBadge = styled.span`
  position: absolute;
  top: -10px;
  right: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.color.bgColor};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: 700;
  line-height: 18px;
  color: ${({ theme }) => theme.color.wh};
`;

const Guide = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.xs};
  line-height: 1.6;
  text-align: center;
  color: ${({ theme }) => theme.color.grey};
`;

const Copyright = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSize.xs};
    line-height: 1.6;
    text-align: center;
    color: ${({ theme }) => theme.color.grey};
  }
`;

const Background = styled.div`
  flex: 1;
  background: #1b0b3a url('/images/member-background.jpg') center / cover no-repeat;

  ${media.mobile} {
    display: none;
  }
`;
