import { ReactNode } from 'react';
import { styled } from 'styled-components';

import { focusRing } from './formStyles';
import { AlertIcon, InfoIcon } from './icons';

/*
  폼 위 배너. 특정 칸에 묶을 수 없는 결과를 알린다.
  - tone="error"(기본): role="alert". 로그인 실패, 입력값 오류(G003), 알 수 없는 실패
  - tone="info": role="status". 로그인 취소처럼 오류가 아닌 안내
  - action을 넘기면 오른쪽에 "다시 시도" 같은 글자 버튼이 붙는다.
    <FormBanner action={{ label: '다시 시도', onClick: retry }}>저장하지 못했어요 …</FormBanner>
  배너는 조건부로 렌더링한다. 나타날 때 스크린리더가 읽는다.
*/

type BannerTone = 'error' | 'info';

interface FormBannerProps {
  tone?: BannerTone;
  children: ReactNode;
  action?: { label: string; onClick: () => void };
}

const FormBanner = ({ tone = 'error', children, action }: FormBannerProps) => (
  <Banner role={tone === 'error' ? 'alert' : 'status'} $tone={tone}>
    {tone === 'error' ? <AlertIcon size={18} /> : <InfoIcon size={18} />}
    <Text>{children}</Text>
    {action && (
      <Action type="button" onClick={action.onClick}>
        {action.label}
      </Action>
    )}
  </Banner>
);

export default FormBanner;

const Banner = styled.div<{ $tone: BannerTone }>`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: 8px;
  background-color: ${({ theme, $tone }) =>
    $tone === 'error' ? theme.color.danger : theme.color.border};
  font-size: 15px;
  line-height: 1.5;
  white-space: normal;
  word-break: keep-all;
  color: ${({ theme, $tone }) => ($tone === 'error' ? theme.color.TextDanger : theme.color.bk)};

  svg {
    flex: none;
    margin-top: 2px;
    color: ${({ theme, $tone }) => ($tone === 'error' ? 'inherit' : theme.color.bgColor)};
  }
`;

const Text = styled.p`
  flex: 1;
  margin: 0;
`;

const Action = styled.button`
  flex: none;
  min-height: 24px;
  margin-left: auto;
  padding: 0 0 0 8px;
  border: 0;
  background: none;
  font: inherit;
  font-weight: 700;
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    ${focusRing}
  }
`;
