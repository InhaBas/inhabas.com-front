import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import useFetch from "../../hooks/useFetch";
import { signupAnswer, signupQuestion, tokenAccess } from "../../recoil/backState";
import { relogin } from "../../recoil/frontState";

import Button from "../../styles/assets/Button";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import { TextArea } from "../../styles/assets/Input";
import P from "../../styles/assets/P";
import styled from "styled-components";
import { media } from "../../styles/theme";

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

const SignupQuestion = () => {
    const navigate = useNavigate();

    const ref = useRef<any[]>([]);
    const [putData, putFetchData] = useFetch();
    const [postData, postFetchData] = useFetch();
    const [getData, getFetchData] = useFetch();
    const [data, fetchData] = useFetch();
    const [question, setQuestion] = useRecoilState(signupQuestion);
    const [answer, setAnswer] = useRecoilState(signupAnswer);
    const access = useRecoilValue(tokenAccess);
    const setReload = useSetRecoilState(relogin);

    /*
        회원가입 질문 리스트 호출
    */
    useEffect(() => {
        fetchData("/signUp/questionnaires", "GET");
        return () => {
            setQuestion([]);
        };
    }, []);

    /*
        회원가입 질문을 recoil에 저장
    */
    useEffect(() => {
        if (data) {
            setQuestion(data);
        }
    }, [data]);

    /*
        회원가입 답변 저장을 한 이력이 있는 경우 api 호출에 대한 response data 저장
    */
    useEffect(() => {
        getFetchData("/signUp/answers", "GET", "token");
        return () => {
            setAnswer(null);
        };
    }, [access]);

    /*
        저장된 회원가입 답변 내용 호출
    */
    useEffect(() => {
        if (getData) {
            setAnswer(getData);
        }
    }, [getData]);

    /*
        회원가입 답변 유효성 검사 후 PUT fetch
    */
    const sendInput = () => {
        let check = true;
        if (question !== null) {
            Object.values(question).forEach((item: any, idx: number) => {
                if (check && ref.current[idx].value === "") {
                    alert(`'${item.question}' 항목을 입력해 주세요`);
                    check = false;
                }
            });

            if (check) {
                let inputData = Object.values(question).map((item: any, idx: number) => ({
                    questionId: item.id,
                    content: ref.current[idx]?.value,
                }));

                putFetchData("/signUp", "PUT", "token", inputData);
            }
        }
    };

    /*
        회원가입 답변 POST fetch
    */
    const saveInput = () => {
        let check = true;
        if (question !== null) {
            if (check) {
                let inputData = Object.values(question).map((item: any, idx: number) => ({
                    questionId: item.id,
                    content: ref.current[idx]?.value,
                }));

                postFetchData("/signUp/answers", "POST", "token", inputData);
            }
        }
    };

    /* 
    회원가입 완료가 된 경우
    토큰에 저장되어 있는 정보가 달라지므로, 회원 가입 후에는 항상 reload 해주어야 함
     */
    useEffect(() => {
        // if (putData === "noContents") {
        if (putData) {
            alert("회원가입을 축하합니다!");
            setReload(true);
            navigate("/");
        }
    }, [putData]);

    /*
    답변 저장에 성공한 경우
    */
    useEffect(() => {
        // if (postData === "noContents") {
        if (postData) {
            alert("답변이 저장되었습니다.");
        }
    }, [postData]);

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
                                Object.values(question).map((item: any, idx: number) => {
                                    return (
                                        <Div
                                            width="100%"
                                            $margin={idx === 0 ? "0" : "30px 0 0 0"}
                                            key={`question${idx}`}
                                        >
                                            <P fontWeight={700}> {item.question}</P>
                                            <TextArea
                                                defaultValue={(answer && answer[idx]?.content) || ""}
                                                ref={(el: never) => (ref.current[idx] = el)}
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
                                    onClick={() => sendInput()}
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
