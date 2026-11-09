import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import Loading from '../../components/common/Loading';
import { DateFunction } from '../../functions/dateFunction';
import { memberMutations, memberQueries } from '../../queries/member';
import { headerTitleInfo } from '../../recoil/backState';
import Button from '../../styles/assets/Button';
import { Container, Div, FlexDiv } from '../../styles/assets/Div';
import P from '../../styles/assets/P';
import { media, theme } from '../../styles/theme';

const PassBtn = styled(Button)`
  color: ${theme.color.blue};
  font-size: ${theme.fontSize.lg};
  font-weight: 700;

  &:hover {
    background-color: ${theme.color.blue};
    color: ${theme.color.wh};
  }
`;

const FailBtn = styled(Button)`
  color: ${theme.color.red};
  font-size: ${theme.fontSize.lg};
  font-weight: 700;

  &:hover {
    background-color: ${theme.color.red};
    color: ${theme.color.wh};
  }
`;

const ApplicationContent = styled(Div)`
  min-width: 0;

  p {
    white-space: normal;
    overflow-wrap: anywhere;
  }
`;

const ApplicationActions = styled(FlexDiv)`
  flex-wrap: nowrap;

  ${media.tablet} {
    width: 100% !important;
    justify-content: center;
    gap: 16px;
  }

  ${media.mobile} {
    flex-direction: column;
    gap: 8px;

    > button {
      width: 100% !important;
    }
  }
`;

const MyApplication = () => {
  const navigate = useNavigate();
  const memberId = useParams().id as string;

  const { formatDateMinute } = DateFunction();

  const { data: application } = useQuery(memberQueries.application({ id: memberId }));
  const setTitle = useSetRecoilState(headerTitleInfo);
  const passFailMutation = useMutation(memberMutations.updateUnapproved());

  // pass/fail Fetch
  const passFail = (passFailValue: string) => {
    let passFailSend = {
      memberIdList: [Number(memberId)],
      state: passFailValue,
    };

    passFailMutation.mutate(passFailSend, {
      onSuccess: () => {
        navigate('/staff/member');
      },
    });
  };

  useEffect(() => {
    if (application) {
      setTitle({
        name: `${application.name}님의 지원서`,
        description: '',
      });
    }
    return () =>
      setTitle({
        name: '',
        description: '',
      });
  }, [application]);

  return (
    <>
      {!application ? (
        <FlexDiv width="100%" height="100vh">
          <Loading />
        </FlexDiv>
      ) : (
        <Container>
          <ApplicationContent width="100%" $margin="0 0 30px 0">
            <Div
              width="100%"
              $border="1px solid"
              $borderColor="border"
              $margin=" 0 0 20px 0"
              radius={6}
            >
              <FlexDiv
                width=" 100%"
                $padding="20px"
                $justifycontent="start"
                $borderB={`1px solid ${theme.color.border}`}
              >
                <Div>
                  <P fontWeight={600}>지원자 이름</P>
                </Div>
              </FlexDiv>
              <Div $padding="20px">
                <P $lineHeight={1.5}>{application.name}</P>
              </Div>
            </Div>
            <Div
              width="100%"
              $border="1px solid"
              $borderColor="border"
              $margin=" 0 0 20px 0"
              radius={6}
            >
              <FlexDiv
                width=" 100%"
                $padding="20px"
                $justifycontent="start"
                $borderB={`1px solid ${theme.color.border}`}
              >
                <Div>
                  <P fontWeight={600}>지원일</P>
                </Div>
              </FlexDiv>
              <Div $padding="20px">
                <P $lineHeight={1.5}>{formatDateMinute({ date: application.dateJoined })}</P>
              </Div>
            </Div>
            <Div
              width="100%"
              $border="1px solid"
              $borderColor="border"
              $margin=" 0 0 20px 0"
              radius={6}
            >
              <FlexDiv
                width=" 100%"
                $padding="20px"
                $justifycontent="start"
                $borderB={`1px solid ${theme.color.border}`}
              >
                <Div>
                  <P fontWeight={600}>지원자 학년</P>
                </Div>
              </FlexDiv>
              <Div $padding="20px">
                <P $lineHeight={1.5}>{application.grade}</P>
              </Div>
            </Div>
            <Div
              width="100%"
              $border="1px solid"
              $borderColor="border"
              $margin=" 0 0 20px 0"
              radius={6}
            >
              <FlexDiv
                width=" 100%"
                $padding="20px"
                $justifycontent="start"
                $borderB={`1px solid ${theme.color.border}`}
              >
                <Div>
                  <P fontWeight={600}>지원자 학번</P>
                </Div>
              </FlexDiv>
              <Div $padding="20px">
                <P $lineHeight={1.5}>{application.studentId}</P>
              </Div>
            </Div>
            <Div
              width="100%"
              $border="1px solid"
              $borderColor="border"
              $margin=" 0 0 20px 0"
              radius={6}
            >
              <FlexDiv
                width=" 100%"
                $padding="20px"
                $justifycontent="start"
                $borderB={`1px solid ${theme.color.border}`}
              >
                <Div>
                  <P fontWeight={600}>지원자 전공</P>
                </Div>
              </FlexDiv>
              <Div $padding="20px">
                <P $lineHeight={1.5}>{application.major}</P>
              </Div>
            </Div>
            <Div
              width="100%"
              $border="1px solid"
              $borderColor="border"
              $margin=" 0 0 20px 0"
              radius={6}
            >
              <FlexDiv
                width=" 100%"
                $padding="20px"
                $justifycontent="start"
                $borderB={`1px solid ${theme.color.border}`}
              >
                <Div>
                  <P fontWeight={600}>지원자 이메일</P>
                </Div>
              </FlexDiv>
              <Div $padding="20px">
                <P $lineHeight={1.5}>{application.email}</P>
              </Div>
            </Div>
            <Div
              width="100%"
              $border="1px solid"
              $borderColor="border"
              $margin=" 0 0 20px 0"
              radius={6}
            >
              <FlexDiv
                width=" 100%"
                $padding="20px"
                $justifycontent="start"
                $borderB={`1px solid ${theme.color.border}`}
              >
                <Div>
                  <P fontWeight={600}>지원자 휴대폰 번호</P>
                </Div>
              </FlexDiv>
              <Div $padding="20px">
                <P $lineHeight={1.5}>{application.phoneNumber}</P>
              </Div>
            </Div>
            {application.answers.map((element) => (
              <Div
                key={element.questionId}
                width="100%"
                $border="1px solid"
                $borderColor="border"
                $margin=" 0 0 20px 0"
                radius={6}
              >
                <FlexDiv
                  width=" 100%"
                  $padding="20px"
                  $justifycontent="start"
                  $borderB={`1px solid ${theme.color.border}`}
                >
                  <Div>
                    <P fontWeight={600}>{element.question}</P>
                  </Div>
                </FlexDiv>
                <Div $padding="20px">
                  <P $whiteSpace="pre-wrap" $lineHeight={1.5}>
                    {element.answer}
                  </P>
                </Div>
              </Div>
            ))}
          </ApplicationContent>
          <ApplicationActions width="30%" $justifycontent="space-around">
            <PassBtn
              width="200px"
              $padding="12px 24px"
              $borderRadius={6}
              border={`1px solid ${theme.color.blue}`}
              disabled={passFailMutation.isPending}
              onClick={() => passFail('pass')}
            >
              합격
            </PassBtn>

            <FailBtn
              width="200px"
              $padding="12px 24px"
              $borderRadius={6}
              border={`1px solid ${theme.color.red}`}
              disabled={passFailMutation.isPending}
              onClick={() => passFail('fail')}
            >
              불합격
            </FailBtn>
          </ApplicationActions>
        </Container>
      )}
    </>
  );
};

export default MyApplication;
