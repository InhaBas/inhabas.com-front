import { useMutation, useQuery } from '@tanstack/react-query';
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  useController,
  useForm,
  useWatch,
} from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { keyframes, styled } from 'styled-components';

import FormBanner from '../../components/common/form/FormBanner';
import { FieldFrame, FieldMessage, FormField } from '../../components/common/form/FormField';
import {
  CheckIcon,
  controlStyles,
  focusRing,
  InfoIcon,
  VisuallyHidden,
} from '../../components/common/form/formStyles';
import RecruitClosedNotice from '../../components/common/form/RecruitClosedNotice';
import { GradeSegment, SegmentedRadio } from '../../components/common/form/SegmentedRadio';
import StepIndicator, {
  PROFESSOR_SIGNUP_STEPS,
  STUDENT_SIGNUP_STEPS,
} from '../../components/common/form/StepIndicator';
import { classifySignUpError } from '../../functions/signUpErrors';
import { formatPhoneNumber, signUpRules } from '../../functions/signUpRules';
import { isTokenExpiredError } from '../../queries/apiErrorEffects';
import { signUpMutations, signUpQueries } from '../../queries/signUp';
import { majorSelected, modalInfo, modalOpen } from '../../recoil/frontState';
import { media } from '../../styles/theme';
import { signUpInterface } from '../../types/ibas/TypeMember';

type SignupStatus = 'student' | 'professor';

interface SignupValues {
  status: SignupStatus;
  name: string;
  phoneNumber: string;
  grade: number | null;
  studentId: string;
  professorId: string;
  major: string;
  terms: boolean;
}

const STATUS_OPTIONS = [
  { value: 'student', label: '학생' },
  { value: 'professor', label: '교수' },
] as const;

// 화면 위에서 아래 순서. 제출에 실패하면 이 순서로 첫 오류 칸에 포커스를 옮긴다
const FIELD_ORDER: (keyof SignupValues)[] = [
  'name',
  'phoneNumber',
  'grade',
  'studentId',
  'professorId',
  'major',
  'terms',
];

// 저장된 프로필로 입력칸을 채운다. 서버는 학번과 교수번호를 같은 studentId 필드로 준다
const toDefaultValues = (profile: signUpInterface | undefined): SignupValues => {
  const professor = profile?.memberType === 'PROFESSOR';
  const grade = Number(profile?.grade);
  return {
    status: professor ? 'professor' : 'student',
    name: profile?.name ?? '',
    phoneNumber: profile?.phoneNumber ?? '',
    grade: !professor && grade > 0 ? grade : null,
    studentId: professor ? '' : (profile?.studentId ?? ''),
    professorId: professor ? (profile?.studentId ?? '') : '',
    major: profile?.major ?? '',
    terms: false,
  };
};

const toProfileBody = (values: SignupValues): signUpInterface => {
  const student = values.status === 'student';
  return {
    name: values.name,
    major: values.major,
    phoneNumber: values.phoneNumber,
    studentId: student ? values.studentId : values.professorId,
    memberType: student ? 'UNDERGRADUATE' : 'PROFESSOR',
    grade: student ? values.grade : null,
  };
};

// 한글 IME 조합 중 Enter는 조합을 끝내는 키다. 폼 제출로 이어지지 않게 막는다
const preventComposingEnter = (event: KeyboardEvent<HTMLFormElement>) => {
  const composing = event.nativeEvent.isComposing || event.keyCode === 229;
  if (event.key === 'Enter' && composing) event.preventDefault();
};

/*
  전공 칸. 직접 입력하지 않고 버튼으로 전공 검색 모달(ModalMajor)을 연다.
  - 모달은 고른 값을 majorSelected(recoil)에 쓴다. 열 때 지금 값을 넘기고, 닫힐 때 폼 값으로 가져온다
  - 모달이 닫히면 이 칸을 벗어난 것으로 보고 검사한다. 버튼의 blur는 모달이 열릴 때도 나므로 쓰지 않는다
  - 닫히면 모달이 연 요소(이 버튼)로 포커스를 돌려준다
*/
const MajorField = ({ control }: { control: Control<SignupValues> }) => {
  const { field, fieldState } = useController({
    name: 'major',
    control,
    rules: signUpRules.major,
  });
  const setOpen = useSetRecoilState(modalOpen);
  const setModalInfo = useSetRecoilState(modalInfo);
  const [selected, setSelected] = useRecoilState(majorSelected);
  const open = useRecoilValue(modalOpen);
  const openedHere = useRef(false);
  const { onChange, onBlur } = field;

  useEffect(() => {
    if (open || !openedHere.current) return;
    openedHere.current = false;
    if (selected.major !== '') onChange(selected.major);
    onBlur();
  }, [open, selected.major, onChange, onBlur]);

  const openModal = () => {
    setSelected({ college: '', major: field.value });
    openedHere.current = true;
    setModalInfo({ type: 'major' });
    setOpen(true);
  };

  return (
    <FieldFrame
      id="major"
      label="전공"
      hint="버튼을 눌러 학과 이름으로 검색해 주세요"
      error={fieldState.error?.message}
    >
      {({ id, ...control }) => (
        <MajorButton
          ref={field.ref}
          id={id}
          type="button"
          aria-haspopup="dialog"
          aria-labelledby={`${id}-label ${id}-value`}
          {...control}
          $invalid={Boolean(fieldState.error)}
          onClick={openModal}
        >
          <MajorValue id={`${id}-value`} $empty={field.value === ''}>
            {field.value === '' ? '눌러서 전공 검색' : field.value}
          </MajorValue>
          <SearchIcon />
        </MajorButton>
      )}
    </FieldFrame>
  );
};

interface SignupFormProps {
  profile: signUpInterface | undefined;
  onClosed: () => void;
}

const SignupForm = ({ profile, onClosed }: SignupFormProps) => {
  const navigate = useNavigate();
  const createMutation = useMutation(signUpMutations.createProfile());
  const bannerRef = useRef<HTMLDivElement>(null);

  const {
    control,
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<SignupValues>({
    mode: 'onTouched',
    // RHF는 등록 순서로 포커스를 옮기므로 화면 순서로 직접 옮긴다
    shouldFocusError: false,
    defaultValues: toDefaultValues(profile),
  });
  // 신분에 따라 보이는 칸만 렌더링한다. 숨겨진 칸은 마운트가 풀려 검사하지 않는다(값은 남는다)
  const status = useWatch({ control, name: 'status' });
  const student = status === 'student';

  const errorKind = createMutation.isError ? classifySignUpError(createMutation.error) : null;

  useEffect(() => {
    if (errorKind === 'closed') onClosed();
    else if (errorKind) bannerRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [errorKind, onClosed]);

  const focusFirstError = (fieldErrors: FieldErrors<SignupValues>) => {
    const first = FIELD_ORDER.find((name) => fieldErrors[name]);
    if (first) setFocus(first);
  };

  const submit = (values: SignupValues) => {
    createMutation.mutate(toProfileBody(values), {
      onSuccess: () => {
        // 학생은 지원 질문으로, 교수는 이 저장으로 가입이 끝난다
        if (values.status === 'student') navigate('/signup/question');
        else navigate('/signup/complete', { replace: true });
      },
    });
  };
  const onSubmit = handleSubmit(submit, focusFirstError);

  // 입력하는 대로 010-0000-0000 형식으로 하이픈을 붙인다. RHF가 값을 읽기 전에 바꾼다
  const phoneField = register('phoneNumber', signUpRules.phoneNumber);

  return (
    <>
      <Steps>
        <StepIndicator
          steps={student ? STUDENT_SIGNUP_STEPS : PROFESSOR_SIGNUP_STEPS}
          current={1}
        />
      </Steps>
      <Note>
        <InfoIcon size={18} />
        <span>이미 다른 소셜 계정으로 가입 신청했다면 그 계정으로 다시 로그인해 주세요.</span>
      </Note>

      {errorKind && errorKind !== 'closed' && (
        <div ref={bannerRef}>
          {errorKind === 'invalid' ? (
            <FormBanner>입력값을 확인해 주세요. 계속 안 되면 웹 팀에 문의해 주세요</FormBanner>
          ) : (
            <FormBanner action={{ label: '다시 시도', onClick: () => onSubmit() }}>
              기본 정보를 저장하지 못했어요. 잠시 뒤 다시 시도해 주세요
            </FormBanner>
          )}
        </div>
      )}

      <Form noValidate onSubmit={onSubmit} onKeyDown={preventComposingEnter}>
        <Section>
          <SectionTitle>신분</SectionTitle>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <SegmentedRadio
                id="status"
                name={field.name}
                label="신분"
                hideLabel
                options={STATUS_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </Section>

        <Section>
          <SectionTitle>기본 정보</SectionTitle>
          <FormField
            id="name"
            label="이름"
            placeholder="홍길동"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name', signUpRules.name)}
          />
          <FormField
            id="phoneNumber"
            label="전화번호"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="010-1234-5678"
            error={errors.phoneNumber?.message}
            {...phoneField}
            onChange={(event) => {
              event.target.value = formatPhoneNumber(event.target.value);
              return phoneField.onChange(event);
            }}
          />
        </Section>

        <Section>
          <SectionTitle>학적 정보</SectionTitle>
          {student ? (
            <>
              <Controller
                name="grade"
                control={control}
                rules={signUpRules.grade}
                render={({ field, fieldState }) => (
                  <GradeSegment
                    ref={field.ref}
                    id="grade"
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                  />
                )}
              />
              <FormField
                id="studentId"
                label="학번"
                inputMode="numeric"
                placeholder="12112233"
                error={errors.studentId?.message}
                {...register('studentId', signUpRules.studentId)}
              />
            </>
          ) : (
            <FormField
              id="professorId"
              label="교수번호"
              inputMode="numeric"
              placeholder="20231234"
              hint="숫자만 입력해 주세요"
              error={errors.professorId?.message}
              {...register('professorId', signUpRules.professorId)}
            />
          )}
          <MajorField control={control} />
        </Section>

        <Section>
          <SectionTitle>약관 동의</SectionTitle>
          <div>
            <Terms $invalid={Boolean(errors.terms)}>
              <input
                type="checkbox"
                aria-invalid={errors.terms ? true : undefined}
                aria-describedby={errors.terms ? 'terms-error' : undefined}
                {...register('terms', signUpRules.terms)}
              />
              <Box aria-hidden="true">
                <CheckIcon size={14} />
              </Box>
              <span>
                본인은{' '}
                <TermsLink to="/rule/1" target="_blank" rel="noopener noreferrer">
                  제 3자 개인정보 동의 약관
                </TermsLink>
                ,{' '}
                <TermsLink to="/rule/3" target="_blank" rel="noopener noreferrer">
                  웹사이트 이용 약관
                </TermsLink>
                ,{' '}
                <TermsLink to="/rule/2" target="_blank" rel="noopener noreferrer">
                  동아리 회칙
                </TermsLink>
                에 동의합니다.
                <VisuallyHidden> (링크는 새 탭에서 열려요)</VisuallyHidden>
              </span>
            </Terms>
            <FieldMessage id="terms-error" error={errors.terms?.message} />
          </div>
        </Section>

        <SubmitButton
          type="submit"
          disabled={createMutation.isPending}
          aria-busy={createMutation.isPending || undefined}
        >
          {createMutation.isPending ? (
            <>
              <Spinner aria-hidden="true" />
              저장 중…
            </>
          ) : student ? (
            '다음: 지원 질문'
          ) : (
            '가입 완료'
          )}
        </SubmitButton>
      </Form>
    </>
  );
};

const Signup = () => {
  /*
    회원가입 한 이력이 있으면 저장된 기본 정보를 미리 채운다.
    저장 이력이 없으면 모든 값이 null로 온다. 토큰 만료로 실패하면 공통 refresh 흐름이 다시 가져온다
  */
  const profileQuery = useQuery(signUpQueries.profile());
  const [closed, setClosed] = useState(false);
  const markClosed = useCallback(() => setClosed(true), []);

  const loadError = profileQuery.error;
  const loadErrorKind =
    loadError && !isTokenExpiredError(loadError) ? classifySignUpError(loadError) : null;

  let content;
  if (closed || loadErrorKind === 'closed') {
    content = <RecruitClosedNotice />;
  } else if (profileQuery.data || loadErrorKind) {
    // 미리 채우기에 실패해도(모집 기간 아님 제외) 빈 폼으로 가입할 수 있게 한다
    content = <SignupForm profile={profileQuery.data} onClosed={markClosed} />;
  } else {
    content = <Loading role="status">가입 정보를 불러오는 중이에요</Loading>;
  }

  return (
    <Page>
      <Panel>
        <Column>
          <LogoLink to="/" aria-label="IBAS 홈으로">
            <img src="/images/ibas-main-logo_purple.png" alt="" />
          </LogoLink>
          {content}
        </Column>
      </Panel>
      <Background aria-hidden="true" />
    </Page>
  );
};

export default Signup;

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

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
  width: 480px;
  padding: 48px 40px 64px;
  background-color: ${({ theme }) => theme.color.wh};

  ${media.tabletOnly} {
    width: 52%;
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
  max-width: 400px;
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
  width: 100%;
`;

const Note = styled.p`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin: 0;
  padding: 12px 14px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.border};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.5;
  color: ${({ theme }) => theme.color.bk};

  svg {
    flex: none;
    margin-top: 1px;
    color: ${({ theme }) => theme.color.bgColor};
  }
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

// 같은 구획 안 칸 사이 8px(메시지 영역 포함)
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 가운데 글자 + 양옆 가는 선(기존 HrSect 모양)
const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 0 8px;
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

const MajorButton = styled.button<{ $invalid?: boolean }>`
  ${controlStyles}
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 48px;
  padding: 0 14px;
  text-align: left;
  cursor: pointer;

  svg {
    flex: none;
    color: ${({ theme }) => theme.color.grey};
  }

  &:hover {
    border-color: ${({ theme, $invalid }) => ($invalid ? theme.color.error : theme.color.bgColor)};
  }
`;

const MajorValue = styled.span<{ $empty: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ theme, $empty }) => ($empty ? theme.color.grey3 : theme.color.bk)};
`;

const Terms = styled.label<{ $invalid: boolean }>`
  position: relative;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 24px;
  color: ${({ theme }) => theme.color.bk};
  cursor: pointer;

  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    margin: 0;
    opacity: 0;
  }

  span[aria-hidden] {
    border: 2px solid ${({ theme, $invalid }) => ($invalid ? theme.color.error : theme.color.grey3)};
  }

  input:checked + span[aria-hidden] {
    border-color: ${({ theme }) => theme.color.bgColor};
    background-color: ${({ theme }) => theme.color.bgColor};
    color: ${({ theme }) => theme.color.wh};
  }

  input:focus-visible + span[aria-hidden] {
    ${focusRing}
  }
`;

const Box = styled.span`
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.color.wh};
  /* 체크 표시는 선택됐을 때만 보인다 */
  color: transparent;
`;

const TermsLink = styled(Link)`
  font-weight: 700;
  color: ${({ theme }) => theme.color.bgColor};
  text-decoration: underline;
  text-underline-offset: 3px;
  border-radius: 2px;

  &:hover {
    color: ${({ theme }) => theme.color.bgColorHo};
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    ${focusRing}
  }
`;

const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 48px;
  border: 0;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.bgColor};
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: 700;
  color: ${({ theme }) => theme.color.wh};
  cursor: pointer;

  &:hover:enabled {
    background-color: ${({ theme }) => theme.color.bgColorHo};
  }

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
