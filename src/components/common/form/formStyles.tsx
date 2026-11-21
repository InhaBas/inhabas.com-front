import { css, styled } from 'styled-components';

/*
  로그인·회원가입 폼 컴포넌트가 함께 쓰는 스타일. 아이콘은 icons.tsx에 있다.
  값은 시안 승인본(2026-11-20)의 "구현 값"을 따른다.
*/

// 모든 입력·버튼·링크·세그먼트에 같은 포커스 링을 쓴다
export const focusRing = css`
  outline: 3px solid ${({ theme }) => theme.color.bgColorHo};
  outline-offset: 2px;
`;

// 화면에는 숨기고 스크린리더에만 읽힌다
export const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
`;

// 입력과 textarea가 공유하는 모양. 오류면 테두리를 2px error로 바꾼다
export const controlStyles = css<{ $invalid?: boolean }>`
  width: 100%;
  border: ${({ theme, $invalid }) =>
    $invalid ? `2px solid ${theme.color.error}` : `1px solid ${theme.color.grey3}`};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.wh};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.color.bk};

  &::placeholder {
    color: ${({ theme }) => theme.color.grey3};
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    ${focusRing}
  }

  &[readonly] {
    background-color: ${({ theme }) => theme.color.border};
    border-color: ${({ theme }) => theme.color.border};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.color.border};
    color: ${({ theme }) => theme.color.grey};
    cursor: not-allowed;
  }
`;
