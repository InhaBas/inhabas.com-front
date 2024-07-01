import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import styled from "styled-components";
import { theme } from "../../../../styles/theme";

import useFetch from "../../../../Hooks/useFetch";
import { applicationAnswerInfo, applicationInfo, headerTitleInfo, tokenAccess } from "../../../../Recoil/backState";

import { DateFunction } from "../../../../Functions/dateFunction";

import { applicationAnswersInterface } from "../../../../Types/IBAS/TypeMyinfo";

import Button from "../../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";
import Loading from "../../../Common/Loading";

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

const MyApplication = () => {
    const navigate = useNavigate();
    const memberId = useParams().id;

    const { formatDateMinute } = DateFunction();

    const access = useRecoilValue(tokenAccess);
    const [applicationData, fetchApplicationData] = useFetch();
    const [application, setApplication] = useRecoilState(applicationInfo);
    const [answer, setAnswer] = useRecoilState(applicationAnswerInfo);
    const setTitle = useSetRecoilState(headerTitleInfo);
    const [passFailData, fetchPassFailData] = useFetch();
    const [isLoading, setIsLoading] = useState(true);

    // pass/fail Fetch
    const passFail = (passFailValue: string) => {
        let passFailSend = {
            memberIdList: [memberId],
            state: passFailValue,
        };

        fetchPassFailData("/members/unapproved", "PUT", "token", passFailSend);
        navigate("/staff/member");
    };

    useEffect(() => {
        setIsLoading(true);
        fetchApplicationData(`/members/${memberId}/application`, "GET", "token");
    }, [access]);

    useEffect(() => {
        if (applicationData) {
            const contents = {
                name: applicationData.name,
                grade: applicationData.grade,
                studentId: applicationData.studentId,
                major: applicationData.major,
                email: applicationData.email,
                phoneNumber: applicationData.phoneNumber,
                dateJoined: formatDateMinute({ date: applicationData.dateJoined }),
            };

            setApplication(contents);

            setAnswer(applicationData.answers);

            setTitle({
                name: `${applicationData.name}님의 지원서`,
                description: "",
            });
            setIsLoading(false);
        }
        return () =>
            setTitle({
                name: "",
                description: "",
            });
    }, [access, applicationData]);

    return (
        <>
            {isLoading ? (
                <FlexDiv width="100%" height="100vh">
                    <Loading />
                </FlexDiv>
            ) : (
                <Container>
                    <Div width="100%" $margin="0 0 30px 0">
                        <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
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
                                <P $lineHeight={1.5}>{application?.name}</P>
                            </Div>
                        </Div>
                        <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
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
                                <P $lineHeight={1.5}>{application?.dateJoined}</P>
                            </Div>
                        </Div>
                        <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
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
                                <P $lineHeight={1.5}>{application?.grade}</P>
                            </Div>
                        </Div>
                        <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
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
                                <P $lineHeight={1.5}>{application?.studentId}</P>
                            </Div>
                        </Div>
                        <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
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
                                <P $lineHeight={1.5}>{application?.major}</P>
                            </Div>
                        </Div>
                        <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
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
                                <P $lineHeight={1.5}>{application?.email}</P>
                            </Div>
                        </Div>
                        <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
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
                                <P $lineHeight={1.5}>{application?.phoneNumber}</P>
                            </Div>
                        </Div>
                        {answer?.map((element: applicationAnswersInterface) => (
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
                    </Div>
                    <FlexDiv width="30%" $justifycontent="space-around">
                        <PassBtn
                            width="200px"
                            $padding="12px 24px"
                            $borderRadius={6}
                            border={`1px solid ${theme.color.blue}`}
                            onClick={() => passFail("pass")}
                        >
                            합격
                        </PassBtn>

                        <FailBtn
                            width="200px"
                            $padding="12px 24px"
                            $borderRadius={6}
                            border={`1px solid ${theme.color.red}`}
                            onClick={() => passFail("fail")}
                        >
                            불합격
                        </FailBtn>
                    </FlexDiv>
                </Container>
            )}
        </>
    );
};

export default MyApplication;
