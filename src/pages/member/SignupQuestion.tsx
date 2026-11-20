import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ContextType,
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Control, FieldErrors, useForm, useWatch } from 'react-hook-form';
import { Link, UNSAFE_NavigationContext, useNavigate } from 'react-router-dom';
import { keyframes, styled } from 'styled-components';

import FormBanner from '../../components/common/form/FormBanner';
import { FormTextarea } from '../../components/common/form/FormField';
import {
  AlertIcon,
  CheckIcon,
  focusRing,
  VisuallyHidden,
} from '../../components/common/form/formStyles';
import RecruitClosedNotice from '../../components/common/form/RecruitClosedNotice';
import StepIndicator, { STUDENT_SIGNUP_STEPS } from '../../components/common/form/StepIndicator';
import { classifySignUpError } from '../../functions/signUpErrors';
import { ANSWER_MAX_LENGTH, signUpRules } from '../../functions/signUpRules';
import { signUpMutations, signUpQueries } from '../../queries/signUp';
import { media } from '../../styles/theme';
import { answersInterface, questionnariesInterface } from '../../types/ibas/TypeMember';

// 질문 id마다 답변 하나. 키는 `q${질문 id}`다
type AnswerValues = Record<string, string>;

const answerField = (questionId: number) => `q${questionId}`;

/*
  서버가 내려준 질문 목록을 거르거나 더하지 않고 그대로 답변 목록으로 만든다.
  임시저장은 빈 답변을 null로 보낸다. 서버는 빈 문자열을 길이 오류(S008)로 거절하고 null은 건너뛴다
  (inhabas.com-api@0a30cb7d AnswerServiceImpl.java:79)
*/
const toAnswerBody = (
  questions: questionnariesInterface[],
  values: AnswerValues,
  emptyAsNull = false,
): answersInterface[] =>
  questions.map((item) => {
    const content = values[answerField(item.id)] ?? '';
    return { questionId: item.id, content: emptyAsNull && content === '' ? null : content };
  });

const formatTime = (date: Date) =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

const LEAVE_MESSAGE =
  '임시저장하지 않은 답변이 있어요. 이 페이지를 떠나면 쓴 내용이 사라져요. 떠날까요?';

// 지금 화면이 덧붙인 "이탈 확인용" 기록 항목 표시
const GUARD_STATE_KEY = 'signupQuestionGuard';

type RouterNavigator = ContextType<typeof UNSAFE_NavigationContext>['navigator'];

// 라우터 navigator의 이동 함수를 confirmLeave로 감싼다. 돌려준 함수로 원래대로 되돌린다
const patchNavigator = (navigator: RouterNavigator, confirmLeave: () => boolean) => {
  const { push, replace, go } = navigator;
  navigator.push = (...args) => {
    if (confirmLeave()) push(...args);
  };
  navigator.replace = (...args) => {
    if (confirmLeave()) replace(...args);
  };
  navigator.go = (delta) => {
    if (delta === 0 || confirmLeave()) go(delta);
  };
  return () => {
    navigator.push = push;
    navigator.replace = replace;
    navigator.go = go;
  };
};

/*
  저장하지 않은 답변이 있을 때(blocking) 떠나기 전에 확인한다.
  - 새로고침·탭 닫기: beforeunload
  - 앱 안의 이동(Link, navigate): BrowserRouter라 useBlocker를 쓸 수 없어 navigator의 push·replace·go를 감싼다
  - 뒤로 가기: 같은 주소의 기록 항목을 하나 더 쌓아 두고, 그 항목에서 빠져나오면 확인한 뒤 한 번 더 뒤로 간다.
    막을 필요가 없으면 확인 없이 바로 한 번 더 뒤로 간다
  돌려준 allowLeave를 부르면 그 뒤로는 막지 않는다(제출 성공 직후의 이동)
*/
const useLeaveGuard = (blocking: boolean) => {
  const { navigator } = useContext(UNSAFE_NavigationContext);
  const blockingRef = useRef(blocking);
  const allowedRef = useRef(false);

  useEffect(() => {
    blockingRef.current = blocking;
  }, [blocking]);

  useEffect(() => {
    const shouldBlock = () => blockingRef.current && !allowedRef.current;
    const confirmLeave = () => !shouldBlock() || window.confirm(LEAVE_MESSAGE);

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!shouldBlock()) return;
      event.preventDefault();
      event.returnValue = '';
    };

    const restoreNavigator = patchNavigator(navigator, confirmLeave);

    const pathname = window.location.pathname;
    const armGuard = () =>
      window.history.pushState(
        { ...window.history.state, [GUARD_STATE_KEY]: true },
        '',
        window.location.href,
      );
    if (!window.history.state?.[GUARD_STATE_KEY]) armGuard();

    let leaving = false;
    const onPopState = () => {
      if (leaving || window.history.state?.[GUARD_STATE_KEY]) return;
      if (window.location.pathname !== pathname) return;
      if (confirmLeave()) {
        leaving = true;
        window.history.back();
      } else {
        armGuard();
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('popstate', onPopState);
    return () => {
      restoreNavigator();
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('popstate', onPopState);
    };
  }, [navigator]);

  return useCallback(() => {
    allowedRef.current = true;
  }, []);
};

// 한글 IME 조합 중 Enter는 조합을 끝내는 키다. textarea 밖에서 제출 등으로 이어지지 않게 막는다
const preventComposingEnter = (event: KeyboardEvent<HTMLFormElement>) => {
  const composing = event.nativeEvent.isComposing || event.keyCode === 229;
  if (event.key === 'Enter' && composing && !(event.target instanceof HTMLTextAreaElement)) {
    event.preventDefault();
  }
};

// 질문 하나의 글자 수. 그 칸만 다시 그린다
const AnswerCount = ({ control, name }: { control: Control<AnswerValues>; name: string }) => {
  const length = (useWatch({ control, name }) ?? '').length;
  const over = length > ANSWER_MAX_LENGTH;
  return (
    <Count $over={over}>
      {length} / {ANSWER_MAX_LENGTH}
      <VisuallyHidden>자{over ? ', 글자 수 초과' : ''}</VisuallyHidden>
    </Count>
  );
};

type SaveState = { kind: 'idle' } | { kind: 'saved'; at: Date } | { kind: 'failed' };

interface QuestionFormProps {
  questions: questionnariesInterface[];
  savedAnswers: answersInterface[];
  onClosed: () => void;
}

const QuestionForm = ({ questions, savedAnswers, onClosed }: QuestionFormProps) => {
  const navigate = useNavigate();
  const completeMutation = useMutation(signUpMutations.complete());
  const saveMutation = useMutation(signUpMutations.saveAnswers());
  const [saveState, setSaveState] = useState<SaveState>({ kind: 'idle' });
  const bannerRef = useRef<HTMLDivElement>(null);

  // 전에 임시저장한 답변을 질문 id로 맞춰 채운다
  const {
    control,
    register,
    handleSubmit,
    getValues,
    reset,
    setFocus,
    trigger,
    formState: { errors, isDirty },
  } = useForm<AnswerValues>({
    mode: 'onTouched',
    shouldFocusError: false,
    defaultValues: Object.fromEntries(
      questions.map((item) => [
        answerField(item.id),
        savedAnswers.find((saved) => saved.questionId === item.id)?.content ?? '',
      ]),
    ),
  });

  const errorKind = completeMutation.isError ? classifySignUpError(completeMutation.error) : null;

  useEffect(() => {
    if (errorKind === 'closed') onClosed();
    else if (errorKind) bannerRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [errorKind, onClosed]);

  const allowLeave = useLeaveGuard(isDirty);

  // 등록 순서가 아니라 화면 순서(질문 순서)로 첫 오류 칸에 포커스를 옮긴다
  const focusFirstError = (fieldErrors: FieldErrors<AnswerValues>) => {
    const first = questions.find((item) => fieldErrors[answerField(item.id)]);
    if (first) setFocus(answerField(first.id));
  };

  const submit = (values: AnswerValues) => {
    completeMutation.mutate(toAnswerBody(questions, values), {
      onSuccess: () => {
        allowLeave();
        navigate('/signup/complete', { replace: true });
      },
    });
  };
  const onSubmit = handleSubmit(submit, focusFirstError);

  const save = async () => {
    // 1000자를 넘는 답변은 서버가 거절하므로 보내지 않고 그 칸에 오류를 보여준다
    const overNames = questions
      .map((item) => answerField(item.id))
      .filter((name) => (getValues(name) ?? '').length > ANSWER_MAX_LENGTH);
    if (overNames.length > 0) {
      await trigger(overNames);
      setFocus(overNames[0]);
      return;
    }

    const values = getValues();
    saveMutation.mutate(toAnswerBody(questions, values, true), {
      onSuccess: () => {
        setSaveState({ kind: 'saved', at: new Date() });
        // 저장한 값을 새 기준으로 삼는다. 저장 중에 더 쓴 내용은 그대로 두고 다시 "저장 안 됨"으로 본다
        reset(values, {
          keepValues: true,
          keepErrors: true,
          keepTouched: true,
          keepIsSubmitted: true,
        });
      },
      onError: () => setSaveState({ kind: 'failed' }),
    });
  };

  const busy = saveMutation.isPending || completeMutation.isPending;

  return (
    <Form noValidate onSubmit={onSubmit} onKeyDown={preventComposingEnter}>
      {errorKind && errorKind !== 'closed' && (
        <div ref={bannerRef}>
          {errorKind === 'invalid' ? (
            <FormBanner>입력값을 확인해 주세요. 계속 안 되면 웹 팀에 문의해 주세요</FormBanner>
          ) : (
            <FormBanner action={{ label: '다시 시도', onClick: () => onSubmit() }}>
              가입 신청을 보내지 못했어요. 잠시 뒤 다시 시도해 주세요
            </FormBanner>
          )}
        </div>
      )}

      {questions.map((item) => {
        const name = answerField(item.id);
        return (
          <FormTextarea
            key={item.id}
            id={name}
            label={<QuestionLabel>{item.question}</QuestionLabel>}
            placeholder="여기에 답변을 써 주세요"
            error={errors[name]?.message}
            aside={<AnswerCount control={control} name={name} />}
            {...register(name, signUpRules.answer)}
          />
        );
      })}

      <ActionBar>
        <SaveStatus role="status" $failed={saveState.kind === 'failed' && !saveMutation.isPending}>
          {saveMutation.isPending ? (
            <>
              <Spinner aria-hidden="true" />
              <span>저장 중…</span>
            </>
          ) : saveState.kind === 'failed' ? (
            <>
              <AlertIcon size={16} />
              <span>임시저장에 실패했어요. 답변을 따로 복사해 두고 다시 저장해 주세요.</span>
            </>
          ) : isDirty ? (
            <span>저장 안 됨</span>
          ) : saveState.kind === 'saved' ? (
            <>
              <CheckIcon size={16} />
              <span>임시저장됨 · {formatTime(saveState.at)}</span>
            </>
          ) : null}
        </SaveStatus>
        <Buttons>
          <SecondaryButton
            type="button"
            onClick={save}
            disabled={busy}
            aria-busy={saveMutation.isPending || undefined}
          >
            임시저장
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            disabled={busy}
            aria-busy={completeMutation.isPending || undefined}
          >
            {completeMutation.isPending ? (
              <>
                <Spinner aria-hidden="true" />
                제출 중…
              </>
            ) : (
              '가입 신청 완료'
            )}
          </PrimaryButton>
        </Buttons>
      </ActionBar>
    </Form>
  );
};

const SignupQuestion = () => {
  const questionsQuery = useQuery(signUpQueries.questionnaires());
  const answersQuery = useQuery(signUpQueries.answers());
  const [closed, setClosed] = useState(false);
  const markClosed = useCallback(() => setClosed(true), []);

  const loadError = questionsQuery.error ?? answersQuery.error;
  const loadErrorKind = loadError ? classifySignUpError(loadError) : null;

  const retryLoad = () => {
    if (questionsQuery.isError) questionsQuery.refetch();
    if (answersQuery.isError) answersQuery.refetch();
  };

  let content;
  if (closed || loadErrorKind === 'closed') {
    content = <RecruitClosedNotice />;
  } else if (loadErrorKind) {
    content = (
      <FormBanner action={{ label: '다시 시도', onClick: retryLoad }}>
        지원 질문을 불러오지 못했어요. 잠시 뒤 다시 시도해 주세요
      </FormBanner>
    );
  } else if (questionsQuery.data && answersQuery.data) {
    content = (
      <QuestionForm
        questions={questionsQuery.data}
        savedAnswers={answersQuery.data}
        onClosed={markClosed}
      />
    );
  } else {
    content = <Loading role="status">지원 질문을 불러오는 중이에요</Loading>;
  }

  const showForm = !closed && loadErrorKind !== 'closed';

  return (
    <Page>
      <Panel>
        <Column>
          <LogoLink to="/" aria-label="IBAS 홈으로">
            <img src="/images/ibas-main-logo_purple.png" alt="" />
          </LogoLink>
          {showForm && (
            <>
              <Steps>
                <StepIndicator steps={STUDENT_SIGNUP_STEPS} current={2} />
              </Steps>
              <Lead>
                모든 질문에 답한 뒤 가입 신청을 완료해 주세요. 쓰는 중에는 임시저장으로 저장해 둘 수
                있어요.
              </Lead>
            </>
          )}
          {content}
        </Column>
      </Panel>
      <Background aria-hidden="true" />
    </Page>
  );
};

export default SignupQuestion;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Page = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.color.wh};
  /* 앱 바깥 Div가 white-space: nowrap이라 문구가 넘치지 않게 되돌린다 */
  white-space: normal;
  word-break: keep-all;
`;

const Panel = styled.main`
  flex: none;
  width: 680px;
  padding: 48px 40px 64px;
  background-color: ${({ theme }) => theme.color.wh};

  ${media.tabletOnly} {
    width: 64%;
    padding: 40px 32px 56px;
  }

  ${media.mobile} {
    width: 100%;
    padding: 32px 20px 40px;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 600px;
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

const LogoLink = styled(Link)`
  align-self: center;
  border-radius: 8px;

  img {
    display: block;
    width: 88px;
    height: 88px;

    ${media.mobile} {
      width: 72px;
      height: 72px;
    }
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    ${focusRing}
  }
`;

const Steps = styled.div`
  align-self: center;
  width: 400px;
  max-width: 100%;
`;

const Lead = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.6;
  color: ${({ theme }) => theme.color.grey};
`;

const Loading = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.md};
  color: ${({ theme }) => theme.color.grey};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const QuestionLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSize.md};
  line-height: 1.5;
`;

const Count = styled.span<{ $over: boolean }>`
  flex: none;
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 20px;
  font-weight: ${({ $over }) => ($over ? 700 : 400)};
  color: ${({ theme, $over }) => ($over ? theme.color.error : theme.color.grey)};
  font-variant-numeric: tabular-nums;
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;

  ${media.mobile} {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SaveStatus = styled.p<{ $failed: boolean }>`
  display: flex;
  flex: 1;
  gap: 6px;
  align-items: flex-start;
  margin: 0;
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 20px;
  color: ${({ theme, $failed }) => ($failed ? theme.color.error : theme.color.grey)};

  svg,
  span[aria-hidden] {
    flex: none;
    margin-top: 2px;
  }

  &:empty {
    display: none;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 12px;

  ${media.mobile} {
    /* 모바일은 주 버튼이 위로 온다 */
    flex-direction: column-reverse;
  }
`;

const BaseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 0 24px;
  border-radius: 8px;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:focus-visible {
    ${focusRing}
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.75;
  }

  ${media.mobile} {
    width: 100%;
  }
`;

const PrimaryButton = styled(BaseButton)`
  border: 0;
  background-color: ${({ theme }) => theme.color.bgColor};
  color: ${({ theme }) => theme.color.wh};

  &:hover:enabled {
    background-color: ${({ theme }) => theme.color.bgColorHo};
  }
`;

const SecondaryButton = styled(BaseButton)`
  border: 1px solid ${({ theme }) => theme.color.bgColor};
  background-color: ${({ theme }) => theme.color.wh};
  color: ${({ theme }) => theme.color.bgColor};

  &:hover:enabled {
    background-color: ${({ theme }) => theme.color.border};
  }
`;

const Spinner = styled.span`
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
