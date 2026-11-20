import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { signUpRules } from '../../functions/signUpRules';
import { signUpMutations, signUpQueries } from '../../queries/signUp';
import { relogin } from '../../recoil/frontState';
import Button from '../../styles/assets/Button';
import { Div, FlexDiv } from '../../styles/assets/Div';
import Img from '../../styles/assets/Img';
import { TextArea } from '../../styles/assets/Input';
import P from '../../styles/assets/P';
import { media } from '../../styles/theme';
import { answersInterface, questionnariesInterface } from '../../types/ibas/TypeMember';

const QuestionPage = styled(FlexDiv)`
  ${media.mobile} {
    height: auto;
    min-height: 100vh;
    align-items: flex-start;
  }
`;

const QuestionPanel = styled(FlexDiv)`
  ${media.tabletOnly} {
    width: 60%;
    padding: 0 32px;
  }

  ${media.mobile} {
    width: 100%;
    height: auto;
    min-height: 100vh;
    margin: 0;
    padding: 32px 20px;
  }
`;

const QuestionScroll = styled(FlexDiv)`
  ${media.mobile} {
    width: 100%;
    height: auto;
    overflow: visible;
  }
`;

const QuestionList = styled(FlexDiv)`
  ${media.mobile} {
    height: auto;
    align-content: flex-start;

    p {
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
    }

    textarea {
      max-width: 100%;
    }
  }
`;

const QuestionTitle = styled(P).attrs({ $whiteSpace: 'normal' })`
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  line-height: 1.5;
`;

const QuestionActions = styled(FlexDiv)`
  ${media.mobile} {
    gap: 12px;
    margin-top: 32px;
  }
`;

const QuestionButton = styled(Button)`
  min-width: 110px;

  ${media.desktop} {
    width: auto;
    min-width: 110px;
  }

  ${media.tablet} {
    width: auto;
    min-width: 110px;
  }

  ${media.mobile} {
    flex: 1;
    min-width: 0;
    margin: 0;
  }
`;

const QuestionBackground = styled(Div)`
  ${media.tabletOnly} {
    width: 40%;
  }

  ${media.mobile} {
    display: none;
  }
`;

// 질문 id마다 답변 하나. 키는 `q${질문 id}`다
type AnswerValues = Record<string, string>;

const answerField = (questionId: number) => `q${questionId}`;

// 서버가 내려준 질문 목록을 거르거나 더하지 않고 그대로 답변 목록으로 만든다
const toAnswerBody = (
  questions: questionnariesInterface[],
  values: AnswerValues,
): answersInterface[] =>
  questions.map((item) => ({
    questionId: item.id,
    content: values[answerField(item.id)] ?? '',
  }));

const SignupQuestion = () => {
  const navigate = useNavigate();

  const completeMutation = useMutation(signUpMutations.complete());
  const saveMutation = useMutation(signUpMutations.saveAnswers());
  const setReload = useSetRecoilState(relogin);

  const { register, handleSubmit, getValues, reset } = useForm<AnswerValues>({
    mode: 'onTouched',
  });

  /*
        회원가입 질문 리스트 호출
    */
  const { data: question } = useQuery(signUpQueries.questionnaires());

  /*
        회원가입 답변 저장을 한 이력이 있는 경우 저장된 답변 내용 호출.
        새로고침으로 토큰이 재발급되면 공통 refresh 흐름이 이 조회를 다시 가져온다
    */
  const { data: answer } = useQuery(signUpQueries.answers());

  // 저장된 답변을 질문 id로 맞춰 채운다
  useEffect(() => {
    if (!question) return;
    reset(
      Object.fromEntries(
        question.map((item) => [
          answerField(item.id),
          answer?.find((saved) => saved.questionId === item.id)?.content ?? '',
        ]),
      ),
    );
  }, [question, answer, reset]);

  /*
        회원가입 답변 유효성 검사 후 PUT fetch
    */
  const sendInput = (values: AnswerValues) => {
    if (!question) return;

    /*
      회원가입 완료가 된 경우
      토큰에 저장되어 있는 정보가 달라지므로, 회원 가입 후에는 항상 reload 해주어야 함
    */
    completeMutation.mutate(toAnswerBody(question, values), {
      onSuccess: () => {
        alert('회원가입을 축하합니다!');
        setReload(true);
        navigate('/');
      },
    });
  };

  // 화면 변경 전까지는 첫 오류를 alert로 알린다
  const alertFirstError = (errors: FieldErrors<AnswerValues>) => {
    const first = question?.find((item) => errors[answerField(item.id)]);
    if (first) alert(`'${first.question}' 항목: ${errors[answerField(first.id)]?.message}`);
  };

  /*
        회원가입 답변 POST fetch
    */
  const saveInput = () => {
    if (!question) return;

    saveMutation.mutate(toAnswerBody(question, getValues()), {
      onSuccess: () => {
        alert('답변이 저장되었습니다.');
      },
    });
  };

  return (
    <>
      <QuestionPage width="100%" height="100vh">
        <QuestionPanel
          width="56%"
          height="85%"
          direction="column"
          $padding="0 45px"
          $margin="0 auto"
          $justifycontent="space-evenly"
        >
          <QuestionScroll width="90%" height="100%" overflow="auto">
            <QuestionList width="100%" height="100%">
              {question &&
                question.map((item, idx) => {
                  return (
                    <Div
                      width="100%"
                      $margin={idx === 0 ? '0' : '30px 0 0 0'}
                      key={item.id}
                    >
                      <QuestionTitle fontWeight={700}>{item.question}</QuestionTitle>
                      <TextArea
                        {...register(answerField(item.id), signUpRules.answer)}
                        height="150px"
                        width="100%"
                        $margin="10px 0 0 0"
                      />
                    </Div>
                  );
                })}
              <QuestionActions width="100%" $justifycontent="end">
                <QuestionButton
                  display="flex"
                  $backgroundColor="grey3"
                  $margin="50px 30px "
                  $padding="12px 15px"
                  $borderRadius={2}
                  $HBackgroundColor="grey"
                  width="15%"
                  disabled={saveMutation.isPending}
                  onClick={() => saveInput()}
                >
                  <P color="wh">임시저장</P>
                </QuestionButton>
                <QuestionButton
                  display="flex"
                  $backgroundColor="bgColor"
                  $margin="50px 0"
                  $padding="12px 15px"
                  $borderRadius={2}
                  $HBackgroundColor="bgColorHo"
                  width="15%"
                  disabled={completeMutation.isPending}
                  onClick={handleSubmit(sendInput, alertFirstError)}
                >
                  <P color="wh">제출</P>
                </QuestionButton>
              </QuestionActions>
            </QuestionList>
          </QuestionScroll>
        </QuestionPanel>
        <QuestionBackground width="44%" height="100vh" overflow="hidden">
          <Img src="/images/member-background.jpg" />
        </QuestionBackground>
      </QuestionPage>
    </>
  );
};

export default SignupQuestion;
