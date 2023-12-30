import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useRecoilState, useRecoilValue } from "recoil";
import useFetch from "../../../Hooks/useFetch";
import { signupAnswer, signupQuestion } from "../../../Recoil/backState";
import { relogin, tokenAccess } from "../../../Recoil/frontState";
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
    const [reload, setReload] = useRecoilState(relogin);

    useEffect(() => {
        fetchData("/signUp/questionnaires", "GET");
        return () => {
            setQuestion([]);
        };
    }, []);

    useEffect(() => {
        if (data) {
            setQuestion(data);
        }
    }, [data]);

    useEffect(() => {
        getFetchData("/signUp/answers", "GET", "token");
        return () => {
            setAnswer(null);
        };
    }, [access]);

    useEffect(() => {
        if (getData) {
            setAnswer(getData);
        }
    }, [getData]);

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

                console.log(inputData);

                putFetchData("/signUp", "PUT", undefined, inputData);
            }
        }
    };
    const saveInput = () => {
        let check = true;
        if (question !== null) {
            if (check) {
                let inputData = Object.values(question).map((item: any, idx: number) => ({
                    questionId: item.id,
                    content: ref.current[idx]?.value,
                }));

                console.log(inputData);

                postFetchData("/signUp/answers", "POST", undefined, inputData);
            }
        }
    };
    useEffect(() => {
        if (putData === "noContents") {
            setReload(true);
            navigate("/");
        }
    }, [putData]);

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
