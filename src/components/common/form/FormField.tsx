import { forwardRef, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { styled } from 'styled-components';

import { controlStyles } from './formStyles';
import { AlertIcon } from './icons';

/*
  폼 칸: 항상 보이는 라벨 + 입력 + 고정 높이 메시지 영역(도움말 또는 오류).
  - 메시지 영역은 비어 있어도 높이를 차지해서 오류가 생겨도 아래 칸이 밀리지 않는다.
  - 오류가 있으면 도움말 대신 오류를 보여주고, 입력에 aria-invalid와 aria-describedby를 단다.
  - FormField·FormTextarea는 ref를 입력 요소로 넘기므로 RHF register를 그대로 펼쳐 쓴다.
      <FormField id="name" label="이름" error={errors.name?.message} {...register('name', signUpRules.name)} />
  - 직접 입력하지 않는 칸(전공 버튼 등)은 FieldFrame에 렌더 함수로 넘긴다.
*/

export interface FieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
}

interface FieldBaseProps {
  /** 입력 요소의 id. 라벨은 `${id}-label`, 메시지는 `${id}-hint`·`${id}-error`, aside는 `${id}-aside` id를 쓴다 */
  id: string;
  label: ReactNode;
  /** 오류가 없을 때 메시지 영역에 보이는 도움말 */
  hint?: ReactNode;
  /** 오류 문구. 있으면 오류 상태가 된다 */
  error?: string;
}

interface FieldFrameProps extends FieldBaseProps {
  /** 메시지 영역 오른쪽에 붙는 내용(글자 수 등). 메시지 다음 순서로 입력의 설명에 연결된다 */
  aside?: ReactNode;
  children: (control: FieldControlProps) => ReactNode;
}

export const FieldFrame = ({ id, label, hint, error, aside, children }: FieldFrameProps) => {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const messageId = error ? errorId : hint ? hintId : undefined;
  const asideId = aside ? `${id}-aside` : undefined;
  const describedBy = [messageId, asideId].filter(Boolean).join(' ') || undefined;

  return (
    <Field>
      <Label id={`${id}-label`} htmlFor={id}>
        {label}
      </Label>
      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })}
      <MessageRow>
        <FieldMessage id={messageId} error={error} hint={hint} />
        {aside && <Aside id={asideId}>{aside}</Aside>}
      </MessageRow>
    </Field>
  );
};

// 고정 높이 메시지 한 줄. 학년 세그먼트처럼 라벨 구조가 다른 칸도 이 영역을 같이 쓴다
export const FieldMessage = ({
  id,
  error,
  hint,
}: {
  id?: string;
  error?: string;
  hint?: ReactNode;
}) => {
  if (error) {
    return (
      <Message id={id} $error>
        <AlertIcon size={16} />
        <span>{error}</span>
      </Message>
    );
  }
  return <Message id={hint ? id : undefined}>{hint}</Message>;
};

type FormFieldProps = FieldBaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'children'>;

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { id, label, hint, error, type = 'text', ...inputProps },
  ref,
) {
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error}>
      {(control) => (
        <Input ref={ref} type={type} {...inputProps} {...control} $invalid={Boolean(error)} />
      )}
    </FieldFrame>
  );
});

type FormTextareaProps = FieldBaseProps &
  Pick<FieldFrameProps, 'aside'> &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'children'>;

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  function FormTextarea({ id, label, hint, error, aside, ...textareaProps }, ref) {
    return (
      <FieldFrame id={id} label={label} hint={hint} error={error} aside={aside}>
        {(control) => (
          <Textarea ref={ref} {...textareaProps} {...control} $invalid={Boolean(error)} />
        )}
      </FieldFrame>
    );
  },
);

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  /* 앱 바깥 Div가 white-space: nowrap이라 문구가 넘치지 않게 되돌린다 */
  white-space: normal;
  word-break: keep-all;
`;

export const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: 700;
  color: ${({ theme }) => theme.color.bk};
`;

const MessageRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const Aside = styled.div`
  flex: none;
`;

const Message = styled.div<{ $error?: boolean }>`
  display: flex;
  gap: 6px;
  align-items: flex-start;
  min-height: 20px;
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 20px;
  color: ${({ theme, $error }) => ($error ? theme.color.error : theme.color.grey)};

  svg {
    flex: none;
    margin-top: 2px;
  }
`;

const Input = styled.input<{ $invalid?: boolean }>`
  ${controlStyles}
  height: 48px;
  padding: 0 14px;
`;

const Textarea = styled.textarea<{ $invalid?: boolean }>`
  ${controlStyles}
  height: 168px;
  padding: 12px 14px;
  line-height: 1.6;
  resize: vertical;
`;
