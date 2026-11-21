import { styled } from 'styled-components';

import { VisuallyHidden } from './formStyles';
import { CheckIcon } from './icons';

/*
  가입 진행 표시. 신분마다 단계 목록이 다르다.
    <StepIndicator steps={STUDENT_SIGNUP_STEPS} current={2} />
  현재 단계에는 aria-current="step"과 "(N단계 중 M단계, 현재 단계)"를, 지난 단계에는 "(완료)"를
  스크린리더용 글자로 붙인다.
*/

export const STUDENT_SIGNUP_STEPS = ['기본 정보', '지원 질문', '완료'] as const;
export const PROFESSOR_SIGNUP_STEPS = ['기본 정보', '완료'] as const;

type StepState = 'done' | 'current' | 'todo';

interface StepIndicatorProps {
  steps: readonly string[];
  /** 현재 단계 번호. 1부터 센다 */
  current: number;
  /** nav의 이름. 기본값 "가입 진행 단계" */
  label?: string;
}

const StepIndicator = ({ steps, current, label = '가입 진행 단계' }: StepIndicatorProps) => (
  <nav aria-label={label}>
    <List>
      {steps.map((step, index) => {
        const number = index + 1;
        const state: StepState =
          number < current ? 'done' : number === current ? 'current' : 'todo';
        return (
          <Step key={step} $state={state} aria-current={state === 'current' ? 'step' : undefined}>
            <Dot $state={state} aria-hidden="true">
              {state === 'done' ? <CheckIcon size={16} /> : number}
            </Dot>
            {step}
            {state === 'current' && (
              <VisuallyHidden>{`(${steps.length}단계 중 ${number}단계, 현재 단계)`}</VisuallyHidden>
            )}
            {state === 'done' && <VisuallyHidden>(완료)</VisuallyHidden>}
          </Step>
        );
      })}
    </List>
  </nav>
);

export default StepIndicator;

const List = styled.ol`
  display: flex;
  align-items: flex-start;
  margin: 0;
  padding: 0;
  list-style: none;
  white-space: normal;
`;

const Step = styled.li<{ $state: StepState }>`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: ${({ $state }) => ($state === 'current' ? 700 : 400)};
  color: ${({ theme, $state }) => ($state === 'current' ? theme.color.bk : theme.color.grey)};
  text-align: center;

  /* 앞 단계 원과 이어지는 선. 완료·현재 단계까지 브랜드 색이다 */
  &::before {
    content: '';
    position: absolute;
    top: 14px;
    right: 50%;
    width: 100%;
    height: 2px;
    background-color: ${({ theme, $state }) =>
      $state === 'todo' ? theme.color.grey1 : theme.color.bgColor};
  }

  &:first-child::before {
    display: none;
  }
`;

const Dot = styled.span<{ $state: StepState }>`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 2px solid
    ${({ theme, $state }) => ($state === 'todo' ? theme.color.grey3 : theme.color.bgColor)};
  border-radius: 50%;
  background-color: ${({ theme, $state }) =>
    $state === 'todo' ? theme.color.wh : theme.color.bgColor};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  color: ${({ theme, $state }) => ($state === 'todo' ? theme.color.grey : theme.color.wh)};
`;
