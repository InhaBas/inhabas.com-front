import { useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import { theme } from "../../../../styles/theme";

import { headerTitleInfo, scheduleInfo, totalPolicy } from "../../../../Recoil/backState";

import useFetch from "../../../../Hooks/useFetch";

import { policyInterface } from "../../../../Types/TypeCommon";
import Button from "../../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import { DateTime, NumberInput, TextInput } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";
import TextEditor from "../../../Common/TextEditor";

const MyStaff = () => {
    let fontStyle: React.CSSProperties = {};
    fontStyle.fontStyle = "italic";

    const ref = useRef<any[]>([]);
    const setTitle = useSetRecoilState(headerTitleInfo);
    const [scheduleInfoData, fetchScheduleInfoData] = useFetch();
    const [putScheduleInfoData, fetchPutScheduleInfoData] = useFetch();

    const [policyData1, policyFetchData1] = useFetch();
    const [policyData2, policyFetchData2] = useFetch();
    const [policyData3, policyFetchData3] = useFetch();
    const [policy, setPolicy] = useRecoilState(totalPolicy);
    const [putPolicyData, fetchPutPolicyData] = useFetch();
    const [schedule, setSchedule] = useRecoilState(scheduleInfo);

    const editorRef = useRef<any[]>([]);
    const editorTitleRef = useRef<any[]>([]);

    useEffect(() => {
        setTitle({
            name: "관리자 페이지",
            description: "홈페이지 설정을 수정할 수 있습니다.",
        });

        return () =>
            setTitle({
                name: "",
                description: "",
            });
    }, []);

    const changeSchedule = () => {
        let check = true;

        if (check && ref.current[0].value === "") {
            alert("기수를 입력해주세요");
            check = false;
        }

        if (check && ref.current[0].value <= 0) {
            alert("기수를 올바르게 입력해주세요");
            check = false;
        }

        if (check && ref.current[1].value === "") {
            alert("입부 신청 시작일을 입력해주세요");
            check = false;
        }

        if (check && ref.current[2].value === "") {
            alert("입부 신청 마감일을 입력해주세요");
            check = false;
        }

        if (check && ref.current[2].value <= ref.current[1].value) {
            alert("입부 신청 마감일이 입부 신청 등록일보다 앞설 수 없습니다");
            check = false;
        }

        if (check && ref.current[3].value === "") {
            alert("면접 시작일을 입력해주세요");
            check = false;
        }

        if (check && ref.current[4].value === "") {
            alert("면접 마감일을 입력해주세요");
            check = false;
        }

        if (check && ref.current[4].value <= ref.current[3].value) {
            alert("면접 마감일이 면접 시작일보다 앞설 수 없습니다");
            check = false;
        }

        if (check && ref.current[5].value === "") {
            alert("합격 여부 발표일을 입력해주세요");
            check = false;
        }

        if (check && ref.current[5].value <= ref.current[4].value) {
            alert("결과 발표일이 면접 마감일보다 앞설 수 없습니다");
            check = false;
        }

        if (check) {
            let inputData = {
                generation: ref.current[0].value,
                signupStartDate: ref.current[1].value + ":00",
                signupEndDate: ref.current[2].value + ":00",
                interviewStartDate: ref.current[3].value + ":00",
                interviewEndDate: ref.current[4].value + ":00",
                resultAnnounceDate: ref.current[5].value + ":00",
            };

            console.log(inputData);
            fetchPutScheduleInfoData("/signUp/schedule", "PUT", "token", inputData);
        }
    };

    const changeRule = (idx: number) => {
        let inputData = {
            // title: editorTitleRef.current[idx - 1]?.value,
            content: editorRef.current[idx - 1].getInstance().getMarkdown(),
        };

        console.log(inputData);
        fetchPutPolicyData(`/policy/${idx}`, "PUT", "token", inputData);
    };

    // 회원가입 일정
    useEffect(() => {
        fetchScheduleInfoData("/signUp/schedule", "GET");
    }, []);

    useEffect(() => {
        if (scheduleInfoData) {
            setSchedule(scheduleInfoData);
        }
    }, [scheduleInfoData]);

    useEffect(() => {
        if (putScheduleInfoData) {
            alert("정상적으로 적용되었습니다.");
        }
    }, [putScheduleInfoData]);

    // 정책 api 불러오기
    // api 바뀌면 다시 조정
    useEffect(() => {
        policyFetchData1("/policy/1", "GET");
    }, []);
    useEffect(() => {
        policyFetchData2("/policy/2", "GET");
    }, []);
    useEffect(() => {
        policyFetchData3("/policy/3", "GET");
    }, []);

    useEffect(() => {
        setPolicy([policyData1, policyData2, policyData3]);
    }, [policyData1, policyData2, policyData3]);

    useEffect(() => {
        if (policy && policy.length > 0) {
            policy.forEach((item: policyInterface, idx: number) => {
                if (editorRef.current[idx]) {
                    editorRef.current[idx].getInstance().setMarkdown(item?.content);
                }
            });
        }
    }, [policy]);

    useEffect(() => {
        if (putPolicyData) {
            alert("정상적으로 적용되었습니다.");
        }
    }, [putScheduleInfoData]);

    useEffect(() => {
        policyFetchData1("/policy/1", "GET");
    }, [putScheduleInfoData]);
    useEffect(() => {
        policyFetchData2("/policy/2", "GET");
    }, [putScheduleInfoData]);
    useEffect(() => {
        policyFetchData3("/policy/3", "GET");
    }, [putScheduleInfoData]);

    return (
        <FlexDiv width="100%">
            <Container>
                <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                    <FlexDiv
                        width=" 100%"
                        $padding="20px"
                        $justifycontent="start"
                        $borderB={`1px solid ${theme.color.border}`}
                    >
                        <FlexDiv>
                            <FlexDiv width="20px" height="15px" $margin="0 10px 0 0">
                                <Img src="/images/user_purple.svg" />
                            </FlexDiv>
                            <Div>
                                <P fontWeight={600}>가입 관련 설정</P>
                            </Div>
                        </FlexDiv>
                    </FlexDiv>
                    <Div width="100%" $padding="50px">
                        <Div width="100%" $borderB={`1px solid ${theme.color.border}`} $margin="0 0 30px 0">
                            <FlexDiv $justifycontent="start" width="100%" $margin="0 0 10px 0">
                                <Div>
                                    <P fontWeight={700}>기수 설정</P>
                                </Div>
                                <Div>
                                    <P style={{ ...fontStyle }} color="grey2">
                                        ( 가장 최근에 입부 마감된 기수: {schedule?.generation}기 )
                                    </P>
                                </Div>
                            </FlexDiv>
                            <Div width="100%" $margin="0 0 10px 0">
                                <NumberInput
                                    width="100%"
                                    defaultValue={schedule?.generation}
                                    ref={(el: never) => (ref.current[0] = el)}
                                />
                            </Div>
                            <Div $margin="0 0 30px 0">
                                <P style={{ ...fontStyle }} color="red" fontSize="sm">
                                    ※ 새로운 부원이 가입하면 해당 기수로 설정됩니다.
                                </P>
                            </Div>
                        </Div>

                        <Div width="100%" $borderB={`1px solid ${theme.color.border}`} $margin="0 0 30px 0">
                            <FlexDiv $justifycontent="start" width="100%" $margin="0 0 10px 0">
                                <Div>
                                    <P fontWeight={700}>입부 신청 시작</P>
                                </Div>
                            </FlexDiv>
                            <Div width="100%" $margin="0 0 30px 0">
                                <DateTime
                                    width="100%"
                                    defaultValue={schedule?.signupStartDate}
                                    ref={(el: never) => (ref.current[1] = el)}
                                />
                            </Div>
                        </Div>

                        <Div width="100%" $borderB={`1px solid ${theme.color.border}`} $margin="0 0 30px 0">
                            <FlexDiv $justifycontent="start" width="100%" $margin="0 0 10px 0">
                                <Div>
                                    <P fontWeight={700}>입부 신청 마감</P>
                                </Div>
                            </FlexDiv>
                            <Div width="100%" $margin="0 0 30px 0">
                                <DateTime
                                    width="100%"
                                    defaultValue={schedule?.signupEndDate}
                                    ref={(el: never) => (ref.current[2] = el)}
                                />
                            </Div>
                        </Div>

                        <Div width="100%" $borderB={`1px solid ${theme.color.border}`} $margin="0 0 30px 0">
                            <FlexDiv $justifycontent="start" width="100%" $margin="0 0 10px 0">
                                <Div>
                                    <P style={{ ...fontStyle }} color="red" fontSize="sm">
                                        ※ 면접 시작 일정과 면접 종료 일정이 모두 없으면, 면접을 하지 않는 것으로
                                        설정됩니다.
                                    </P>
                                </Div>
                            </FlexDiv>
                            <FlexDiv $justifycontent="start" width="100%" $margin="0 0 10px 0">
                                <Div>
                                    <P fontWeight={700}>면접 시작</P>
                                </Div>
                            </FlexDiv>
                            <Div width="100%" $margin="0 0 30px 0">
                                <DateTime
                                    width="100%"
                                    defaultValue={schedule?.interviewStartDate}
                                    ref={(el: never) => (ref.current[3] = el)}
                                />
                            </Div>
                        </Div>

                        <Div width="100%" $borderB={`1px solid ${theme.color.border}`} $margin="0 0 30px 0">
                            <FlexDiv $justifycontent="start" width="100%" $margin="0 0 10px 0">
                                <Div>
                                    <P fontWeight={700}>면접 종료</P>
                                </Div>
                            </FlexDiv>
                            <Div width="100%" $margin="0 0 30px 0">
                                <DateTime
                                    width="100%"
                                    defaultValue={schedule?.interviewEndDate}
                                    ref={(el: never) => (ref.current[4] = el)}
                                />
                            </Div>
                        </Div>

                        <Div width="100%" $margin="0 0 30px 0">
                            <FlexDiv $justifycontent="start" width="100%" $margin="0 0 10px 0">
                                <Div>
                                    <P fontWeight={700}>합격 여부 발표</P>
                                </Div>
                            </FlexDiv>
                            <Div width="100%" $margin="0 0 30px 0">
                                <DateTime
                                    width="100%"
                                    defaultValue={schedule?.resultAnnounceDate}
                                    ref={(el: never) => (ref.current[5] = el)}
                                />
                            </Div>
                        </Div>

                        <FlexDiv width="100%">
                            <Button
                                $backgroundColor="bgColor"
                                $HBackgroundColor="bgColorHo"
                                $padding="10px 15px"
                                $borderRadius={3}
                                onClick={() => changeSchedule()}
                            >
                                <FlexDiv>
                                    <FlexDiv $margin="0 10px 0 0">
                                        <Img src="/images/check_white.svg" />
                                    </FlexDiv>
                                    <FlexDiv>
                                        <P color="wh" fontSize="sm">
                                            적용하기
                                        </P>
                                    </FlexDiv>
                                </FlexDiv>
                            </Button>
                        </FlexDiv>
                    </Div>
                </Div>

                {policy &&
                    policy.map((item: policyInterface, idx: number) => (
                        <Div
                            width="100%"
                            $border="1px solid"
                            $borderColor="border"
                            $margin=" 0 0 20px 0"
                            radius={6}
                            key={`policy${idx}`}
                        >
                            <FlexDiv
                                width=" 100%"
                                $padding="20px"
                                $justifycontent="start"
                                $borderB={`1px solid ${theme.color.border}`}
                            >
                                <FlexDiv>
                                    <FlexDiv width="20px" height="15px" $margin="0 10px 0 0">
                                        <Img src="/images/user_purple.svg" />
                                    </FlexDiv>
                                    <Div>
                                        <P fontWeight={600}>{item?.title} 설정</P>
                                    </Div>
                                </FlexDiv>
                            </FlexDiv>
                            <Div width="100%" $padding="50px">
                                <TextInput
                                    defaultValue={item?.title}
                                    placeholder="정책 제목을 입력해주세요"
                                    width="100%"
                                    height="55px"
                                    $margin="0 0 30px 0"
                                    fontSize="lg"
                                    ref={(el: never) => (editorTitleRef.current[idx] = el)}
                                />
                                <TextEditor key={`editor${idx}`} ref={(editor) => (editorRef.current[idx] = editor)} />

                                <FlexDiv width="100%">
                                    <Button
                                        $backgroundColor="bgColor"
                                        $HBackgroundColor="bgColorHo"
                                        $padding="10px 15px"
                                        $borderRadius={3}
                                        $margin="30px 0 0 0"
                                        onClick={() => changeRule(idx + 1)}
                                    >
                                        <FlexDiv>
                                            <FlexDiv $margin="0 10px 0 0">
                                                <Img src="/images/check_white.svg" />
                                            </FlexDiv>
                                            <FlexDiv>
                                                <P color="wh" fontSize="sm">
                                                    적용하기
                                                </P>
                                            </FlexDiv>
                                        </FlexDiv>
                                    </Button>
                                </FlexDiv>
                            </Div>
                        </Div>
                    ))}
            </Container>
        </FlexDiv>
    );
};

export default MyStaff;
