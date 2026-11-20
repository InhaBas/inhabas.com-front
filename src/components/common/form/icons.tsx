/*
  로그인·회원가입 폼 컴포넌트가 함께 쓰는 아이콘. 모두 장식이라 스크린리더에서 숨긴다.
  색은 currentColor를 따른다.
*/

const iconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  focusable: false,
} as const;

// 원 안의 느낌표. 칸 오류(16px)와 오류 배너(18px)에 쓴다
export const AlertIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} strokeWidth={2.4} {...iconProps}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 7v6" />
    <path d="M12 17h.01" />
  </svg>
);

// 원 안의 i. 안내 배너에 쓴다
export const InfoIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} strokeWidth={2.2} {...iconProps}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 11v6" />
    <path d="M12 7h.01" />
  </svg>
);

export const CheckIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} strokeWidth={3} {...iconProps}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const CalendarIcon = ({ size = 30 }: { size?: number }) => (
  <svg width={size} height={size} strokeWidth={2.2} {...iconProps}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4" />
    <path d="M8 3v4" />
    <path d="M3 10h18" />
  </svg>
);
