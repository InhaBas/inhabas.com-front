import { forwardRef, ReactElement, ReactNode, Ref, useImperativeHandle, useRef } from 'react';
import { styled } from 'styled-components';

import { FieldMessage, Label } from './FormField';
import { focusRing, VisuallyHidden } from './formStyles';
import { GRADE_OPTIONS } from '../../../functions/signUpRules';

/*
  세그먼트 버튼 모양의 radio 그룹(신분, 학년 등).
  - 같은 name의 실제 radio라서 Tab은 그룹에 한 번 들어가고, 방향키로 선택을 옮긴다.
  - 값이 숫자여도 그대로 돌려준다(DOM 문자열 값으로 바꾸지 않는다).
  - RHF에는 Controller로 연결한다. field.ref를 넘기면 제출 실패 시 이 그룹으로 포커스가 온다.
      <Controller name="grade" control={control} rules={signUpRules.grade}
        render={({ field, fieldState }) => (
          <GradeSegment {...field} id="grade" error={fieldState.error?.message} />
        )} />
*/

export interface SegmentOption<T extends string | number> {
  value: T;
  label: ReactNode;
}

export interface SegmentFocusHandle {
  focus: () => void;
}

export interface SegmentedRadioProps<T extends string | number> {
  /** 그룹 id. 라벨은 `${id}-label`, 메시지는 `${id}-hint`·`${id}-error` id를 쓴다 */
  id: string;
  /** radio name. Controller의 field.name을 그대로 넘긴다 */
  name: string;
  label: ReactNode;
  /** 라벨을 화면에서 숨기고 스크린리더에만 읽힌다(구획 제목이 라벨 역할을 할 때) */
  hideLabel?: boolean;
  options: readonly SegmentOption<T>[];
  value: T | null | undefined;
  onChange: (value: T) => void;
  onBlur?: () => void;
  hint?: ReactNode;
  error?: string;
  disabled?: boolean;
}

function SegmentedRadioInner<T extends string | number>(
  {
    id,
    name,
    label,
    hideLabel = false,
    options,
    value,
    onChange,
    onBlur,
    hint,
    error,
    disabled,
  }: SegmentedRadioProps<T>,
  ref: Ref<SegmentFocusHandle>,
) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      const inputs = inputRefs.current;
      (inputs.find((input) => input?.checked) ?? inputs[0])?.focus();
    },
  }));

  const labelId = `${id}-label`;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const invalid = Boolean(error);

  return (
    <Field>
      {hideLabel ? (
        <VisuallyHidden id={labelId}>{label}</VisuallyHidden>
      ) : (
        <Label as="span" id={labelId}>
          {label}
        </Label>
      )}
      <Group
        id={id}
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        $invalid={invalid}
      >
        {options.map((option, index) => {
          const checked = option.value === value;
          return (
            <Cell key={String(option.value)} $checked={checked} $disabled={disabled}>
              <input
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="radio"
                name={name}
                value={String(option.value)}
                checked={checked}
                disabled={disabled}
                aria-invalid={invalid || undefined}
                onChange={() => onChange(option.value)}
                onBlur={onBlur}
              />
              {option.label}
            </Cell>
          );
        })}
      </Group>
      <FieldMessage id={describedBy} error={error} hint={hint} />
    </Field>
  );
}

// forwardRef는 제네릭을 잃으므로 타입을 다시 붙인다
export const SegmentedRadio = forwardRef(SegmentedRadioInner) as <T extends string | number>(
  props: SegmentedRadioProps<T> & { ref?: Ref<SegmentFocusHandle> },
) => ReactElement;

type GradeSegmentProps = Omit<SegmentedRadioProps<number>, 'options' | 'label'> & {
  label?: ReactNode;
};

const GRADE_SEGMENT_OPTIONS = GRADE_OPTIONS.map((grade) => ({
  value: grade as number,
  label: `${grade}학년`,
}));

// 학년 1~4 세그먼트. 값은 숫자 학년이다
export const GradeSegment = forwardRef<SegmentFocusHandle, GradeSegmentProps>(function GradeSegment(
  { label = '학년', ...props },
  ref,
) {
  return <SegmentedRadio ref={ref} label={label} options={GRADE_SEGMENT_OPTIONS} {...props} />;
});

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  white-space: normal;
  word-break: keep-all;
`;

const Group = styled.div<{ $invalid: boolean }>`
  display: flex;
  border: ${({ theme, $invalid }) =>
    $invalid ? `2px solid ${theme.color.error}` : `1px solid ${theme.color.grey3}`};
  border-radius: 8px;
`;

const Cell = styled.label<{ $checked: boolean; $disabled?: boolean }>`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 46px;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ $checked }) => ($checked ? 700 : 400)};
  color: ${({ theme, $checked }) => ($checked ? theme.color.wh : theme.color.bk)};
  background-color: ${({ theme, $checked }) => ($checked ? theme.color.bgColor : theme.color.wh)};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};

  & + & {
    border-left: 1px solid ${({ theme }) => theme.color.grey3};
  }

  /* 그룹 테두리 안쪽 모서리에 맞춘다. overflow: hidden을 쓰면 포커스 링이 잘린다 */
  &:first-child {
    border-radius: 6px 0 0 6px;
  }

  &:last-child {
    border-radius: 0 6px 6px 0;
  }

  &:hover {
    background-color: ${({ theme, $checked, $disabled }) =>
      $checked ? theme.color.bgColor : $disabled ? theme.color.wh : theme.color.border};
  }

  &:has(input:focus-visible) {
    ${focusRing}
    z-index: 1;
  }

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: 0;
    opacity: 0;
  }
`;
