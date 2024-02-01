import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import useFetch from "../../../Hooks/useFetch";
import { signupAnswer, signupQuestion, tokenAccess } from "../../../Recoil/backState";
import { relogin } from "../../../Recoil/frontState";

import Button from "../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";
import { TextArea } from "../../../styles/assets/Input";
import P from "../../../styles/assets/P";

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
    }, []);

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

                putFetchData("/signUp", "PUT", undefined, inputData);
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

                postFetchData("/signUp/answers", "POST", undefined, inputData);
            }
        }
    };

    /* 
    회원가입 완료가 된 경우
    토큰에 저장되어 있는 정보가 달라지므로, 회원 가입 후에는 항상 reload 해주어야 함
     */
    useEffect(() => {
        if (putData === "noContents") {
            alert("회원가입을 축하합니다!");
            setReload(true);
            navigate("/");
        }
    }, [putData]);

    /*
    답변 저장에 성공한 경우
    */
    useEffect(() => {
        if (postData === "noContents") {
            alert("답변이 저장되었습니다.");
        }
    }, [postData]);

    return (
        <>
            <FlexDiv width="100%" height="100vh">
                <FlexDiv
                    width="56%"
                    height="85%"
                    direction="column"
                    $padding="0 45px"
                    $margin="0 auto"
                    $justifycontent="space-evenly"
                >
                    <FlexDiv width="90%" height="100%" overflow="auto">
                        <FlexDiv width="100%" height="100%">
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
                            <FlexDiv width="100%" $justifycontent="end">
                                <Button
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
                                </Button>
                                <Button
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
                                </Button>
                            </FlexDiv>
                        </FlexDiv>
                    </FlexDiv>
                </FlexDiv>
                <Div width="44%" height="100vh" overflow="hidden">
                    <Img src="/images/member-background.jpg" />
                </Div>
            </FlexDiv>
        </>
    );
};

export default SignupQuestion;
