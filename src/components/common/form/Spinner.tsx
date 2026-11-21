import { keyframes, styled } from 'styled-components';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

// 버튼과 저장 상태 안의 16px 진행 표시. 옆의 진행 문구("저장 중…")가 뜻을 전하므로 스크린리더에서 숨긴다
const Spinner = () => <Ring aria-hidden="true" />;

export default Spinner;

const Ring = styled.span`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 2.4s;
  }
`;
