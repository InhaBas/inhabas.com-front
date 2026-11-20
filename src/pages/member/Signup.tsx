import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, FieldErrors, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import Dropdown from '../../components/common/Dropdown';
import { formatPhoneNumber, signUpRules } from '../../functions/signUpRules';
import { signUpMutations, signUpQueries } from '../../queries/signUp';
import { tokenAccess, userEmail } from '../../recoil/backState';
import { majorSelected, modalInfo, modalOpen, relogin } from '../../recoil/frontState';
import A from '../../styles/assets/A';
import Button from '../../styles/assets/Button';
import { Div, FlexDiv } from '../../styles/assets/Div';
import Img from '../../styles/assets/Img';
import { Checkbox, Label, Radio, TextInput } from '../../styles/assets/Input';
import P from '../../styles/assets/P';
import { media } from '../../styles/theme';

const HrSect = styled.div`
  display: flex;
  flex-basis: 100%;
  align-items: center;
  color: rgba(0, 0, 0, 0.35);
  font-size: 12px;

  &::before,
  &::after {
    content: '';
    flex-grow: 1;
    background: rgba(0, 0, 0, 0.35);
    height: 1px;
    font-size: 0px;
    line-height: 0px;
    margin: 0px 16px;
  }
`;

const SignupPage = styled(FlexDiv)`
  height: auto;
  min-height: 100vh;

  ${media.mobile} {
    align-items: flex-start;
  }
`;

const SignupPanel = styled(FlexDiv)`
  height: auto;
  min-height: 80vh;

  ${media.desktop} {
    width: max(33%, 420px);
  }

  ${media.tabletOnly} {
    width: 52%;
    padding: 0 24px;
  }

  ${media.mobile} {
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 32px 20px;
  }
`;

const SignupContent = styled(FlexDiv)`
  ${media.mobile} {
    width: 100%;
  }
`;

const SignupLogo = styled(FlexDiv)`
  ${media.mobile} {
    width: 110px;
    margin-bottom: 24px;
  }
`;

const SignupFields = styled(FlexDiv)`
  ${media.mobile} {
    width: 100%;
  }
`;

const StudentFields = styled(FlexDiv)`
  ${media.mobile} {
    flex-direction: column;

    > div,
    > input {
      width: 100%;
    }
  }
`;

const MajorRow = styled(FlexDiv)`
  min-width: 0;

  p {
    white-space: normal;
  }
`;

const TermsRow = styled(FlexDiv)`
  ${media.mobile} {
    align-items: flex-start;
  }
`;

const TermsCopy = styled(FlexDiv)`
  min-width: 0;

  ${media.mobile} {
    width: calc(100% - 30px);

    a {
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
    }
  }
`;

const NextButton = styled(Button)`
  ${media.mobile} {
    margin: 32px 0 0;
  }
`;

const SignupBackground = styled(Div)`
  align-self: stretch;
  height: auto;
  min-height: 100vh;

  ${media.desktop} {
    width: calc(100% - max(33%, 420px));
  }

  ${media.tabletOnly} {
    width: 48%;
  }

  ${media.mobile} {
    display: none;
  }
`;

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

// 오류를 알릴 칸 순서. 화면 위에서 아래 순서와 같다
const FIELD_ORDER: (keyof SignupValues)[] = [
  'name',
  'phoneNumber',
  'professorId',
  'grade',
  'studentId',
  'major',
  'terms',
];

const Signup = () => {
  const navigate = useNavigate();
  const setOpen = useSetRecoilState(modalOpen);
  const setModalInfo = useSetRecoilState(modalInfo);
  const selectedMajor = useRecoilValue(majorSelected);
  const setSelecteMajor = useSetRecoilState(majorSelected);

  const searchMajor = () => {
    setOpen(true);

    setModalInfo({ type: 'major' });
  };

  const movePage = () => {
    navigate('/');
  };

  /*
    JWT 분석 함수. 
    토큰을 통해 로그인 한 이메일 가져오기 위해 만듦
    */
  const parseJwt = (token: string | undefined) => {
    // 여기서 token이 undefined가 아닌지 확인
    if (!token) {
      return null;
    }

    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        return null;
      }

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(''),
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      // 토큰 파싱 오류 처리
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  const createMutation = useMutation(signUpMutations.createProfile());
  const [email, setEmail] = useRecoilState(userEmail);
  /*
        회원가입 한 이력이 있어 저장된 개인 정보를 호출하는 api
        정보를 입력칸에 미리 채운다.
        새로고침으로 토큰이 재발급되면 공통 refresh 흐름이 이 조회를 다시 가져온다
    */
  const { data: info } = useQuery(signUpQueries.profile());
  const setReload = useSetRecoilState(relogin);
  const access = useRecoilValue(tokenAccess);

  const { control, register, handleSubmit, reset, setValue } = useForm<SignupValues>({
    mode: 'onTouched',
    shouldFocusError: false,
    defaultValues: {
      status: 'student',
      name: '',
      phoneNumber: '',
      grade: null,
      studentId: '',
      professorId: '',
      major: '',
      terms: false,
    },
  });
  // 신분에 따라 보이는 칸만 렌더링해서 등록한다. 숨겨진 칸은 등록이 풀려 검사하지 않는다
  const status = useWatch({ control, name: 'status' });
  const major = useWatch({ control, name: 'major' });

  // 전공은 직접 입력하는 칸이 없어 모달이 고른 값을 setValue로 넣는다
  useEffect(() => {
    register('major', signUpRules.major);
  }, [register]);

  // 학년·전공처럼 칸 하나에 묶이지 않는 값도 화면 순서대로 첫 오류 하나만 알린다
  const alertFirstError = (errors: FieldErrors<SignupValues>) => {
    const first = FIELD_ORDER.find((name) => errors[name]);
    if (first) alert(errors[first]?.message);
  };

  /*
    검증은 signUpRules로 RHF가 한다. 통과한 값만 보낸다
    학생일 경우, 교수일 경우 성공 뒤 이동이 다르니 유의할 것
    */
  const sendInput = (values: SignupValues) => {
    const inputData = {
      name: values.name,
      major: values.major,
      phoneNumber: values.phoneNumber,
      studentId: values.status === 'student' ? values.studentId : values.professorId,
      memberType: values.status === 'student' ? 'UNDERGRADUATE' : 'PROFESSOR',
      grade: values.status === 'student' ? values.grade : null,
    };

    /* 학생용 signUp api 가 잘 POST 된 경우 질문 화면으로 이동 */
    if (values.status === 'student') {
      createMutation.mutate(inputData, {
        onSuccess: () => {
          navigate('/signup/question');
        },
      });
    }

    /* 교수용 signUp api 가 잘 POST 된 경우 가입 완료. 홈에서 reload 한다 */
    if (values.status === 'professor') {
      createMutation.mutate(inputData, {
        onSuccess: () => {
          setReload(true);
          navigate('/');
        },
      });
    }
  };

  /*
        토큰에 있는 정보 중 email을 recoil에 저장
        새로고침 시 access 토큰이 재발급되므로, 토큰이 변화할 때마다 불러와야 함
    */
  useEffect(() => {
    const tokenData = parseJwt(access);
    if (tokenData && tokenData.email) {
      setEmail(tokenData.email);
    }
  }, [access, setEmail]);

  /*
        회원가입 한 이력이 있으면 저장된 값으로 입력칸을 채운다.
        major는 모달이 고른 값(selectedMajor)과 맞춰 둔다.
        이 때 college와 major 형태를 유지시킬 것
        signUp api를 보낼 때 major의 값만 보내면 되므로, colleage의 값은 신경쓰지 않아도 됨
    */
  useEffect(() => {
    if (!info) return;
    const professor = info.memberType === 'PROFESSOR';
    reset((prev) => ({
      ...prev,
      status: professor ? 'professor' : 'student',
      name: info.name ?? '',
      phoneNumber: info.phoneNumber ?? '',
      studentId: professor ? '' : (info.studentId ?? ''),
      professorId: professor ? (info.studentId ?? '') : '',
      grade: professor ? null : Number(info.grade) || null,
      major: info.major ?? '',
    }));
    if (info.major) {
      setSelecteMajor({ college: 'default', major: info.major });
    }
  }, [info, reset, setSelecteMajor]);

  // 전공 모달이 고른 값을 폼 값으로 옮긴다
  useEffect(() => {
    setValue('major', selectedMajor.major, { shouldDirty: true });
  }, [selectedMajor.major, setValue]);

  return (
    <>
      <SignupPage width="100%" height="100vh">
        <SignupPanel
          width="33%"
          height="80%"
          direction="column"
          $padding="0 45px"
          $margin="0 auto"
          $justifycontent="space-evenly"
        >
          <SignupContent width="90%">
            <SignupLogo width="150px" $margin="0 0 30px 0" $pointer onClick={() => movePage()}>
              <Img src="/images/ibas-main-logo_purple.png" />
            </SignupLogo>

            <FlexDiv width="100%">
              <HrSect>기본 정보</HrSect>
            </FlexDiv>
            <FlexDiv width="90%" $margin="10px 0 " $justifycontent="start">
              <FlexDiv>
                <Radio value="student" {...register('status')} />
                <Label $margin="0 0 0 5px">학생</Label>
              </FlexDiv>
              <FlexDiv $margin="0 0 0 10px">
                <Radio value="professor" {...register('status')} />
                <Label $margin="0 0 0 5px">교수님</Label>
              </FlexDiv>
            </FlexDiv>
            <SignupFields width="100%">
              <TextInput
                placeholder="이름"
                width="90%"
                $borderRadius={100}
                $margin="10px 0 0 0"
                {...register('name', signUpRules.name)}
              />
              <Div
                $backgroundColor="grey1"
                width="90%"
                radius={100}
                $margin="10px 0 0 0"
                $padding="10px"
              >
                <P>{email}</P>
              </Div>
              <TextInput
                placeholder="핸드폰번호"
                width="90%"
                $borderRadius={100}
                $margin="10px 0 0 0"
                {...register('phoneNumber', {
                  ...signUpRules.phoneNumber,
                  // 입력하는 대로 010-0000-0000 형식으로 하이픈을 붙인다
                  onChange: (e) => setValue('phoneNumber', formatPhoneNumber(e.target.value)),
                })}
              />
              {status === 'professor' ? (
                <StudentFields $justifycontent="space-between" width="90%">
                  <TextInput
                    placeholder="교수번호"
                    width="100%"
                    $borderRadius={100}
                    $margin="10px 0 0 0"
                    {...register('professorId', signUpRules.professorId)}
                  />
                </StudentFields>
              ) : (
                <StudentFields $justifycontent="space-between" width="90%">
                  <Div width="30%" $margin="10px 0 0 0">
                    <Controller
                      name="grade"
                      control={control}
                      rules={signUpRules.grade}
                      render={({ field }) => (
                        <Dropdown
                          label="학년"
                          options={['1학년', '2학년', '3학년', '4학년']}
                          value={['1', '2', '3', '4']}
                          onChange={(value) => field.onChange(Number(value))}
                          borderRadius={100}
                        />
                      )}
                    />
                  </Div>
                  <TextInput
                    placeholder="학번(12112233)"
                    width="68%"
                    $borderRadius={100}
                    $margin="10px 0 0 0"
                    {...register('studentId', signUpRules.studentId)}
                  />
                </StudentFields>
              )}

              <MajorRow
                width="90%"
                $margin="10px 0 0 0"
                $justifycontent="space-between"
                $pointer
                onClick={() => searchMajor()}
              >
                <Div
                  width="90%"
                  radius={100}
                  $border="1px solid"
                  $borderColor="grey1"
                  $padding="10px"
                >
                  {major === '' ? <P>전공을 검색하려면 클릭하세요</P> : <P>{major}</P>}
                </Div>
                <FlexDiv width="20px" $justifycontent="end">
                  <Img src="/images/search.svg" />
                </FlexDiv>
              </MajorRow>

              <TermsRow $justifycontent="start" width="90%" $margin="10px 0 0 0">
                <Div $margin="0 10px 0 0">
                  <Checkbox {...register('terms', signUpRules.terms)} />
                </Div>
                <TermsCopy width="80%" $justifycontent="start">
                  <Div>
                    <A fontSize="xs">본인은</A>
                  </Div>
                  <Div>
                    <A
                      fontWeight={700}
                      href="/rule/1"
                      target="_blank"
                      rel="noopener noreferrer"
                      fontSize="xs"
                      color="textColor"
                      $hoverColor="bgColorHo"
                    >
                      제 3자 개인정보 동의 약관
                    </A>
                  </Div>
                  <Div>
                    <A fontSize="xs">과</A>
                  </Div>
                  <Div>
                    <A
                      fontWeight={700}
                      href="/rule/3"
                      target="_blank"
                      rel="noopener noreferrer"
                      fontSize="xs"
                      color="textColor"
                      $hoverColor="bgColorHo"
                    >
                      웹사이트 이용 약관
                    </A>
                  </Div>
                  <Div>
                    <A fontSize="xs">,</A>
                  </Div>
                  <Div>
                    <A
                      fontWeight={700}
                      href="/rule/2"
                      target="_blank"
                      rel="noopener noreferrer"
                      fontSize="xs"
                      color="textColor"
                      $hoverColor="bgColorHo"
                    >
                      동아리 회칙
                    </A>
                  </Div>
                  <Div>
                    <A fontSize="xs">에 동의합니다. </A>
                  </Div>
                </TermsCopy>

                <NextButton
                  display="flex"
                  $backgroundColor="bgColor"
                  $margin="50px 0"
                  $padding="12px 15px"
                  $borderRadius={2}
                  $HBackgroundColor="bgColorHo"
                  width="100%"
                  disabled={createMutation.isPending}
                  onClick={handleSubmit(sendInput, alertFirstError)}
                >
                  <P color="wh">다음</P>
                </NextButton>
              </TermsRow>
            </SignupFields>
          </SignupContent>
        </SignupPanel>
        <SignupBackground width="67%" height="100vh" overflow="hidden">
          <Img src="/images/member-background.jpg" />
        </SignupBackground>
      </SignupPage>
    </>
  );
};

export default Signup;
