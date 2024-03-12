import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

import { theme } from "../../../styles/theme";

import useFetch from "../../../Hooks/useFetch";

import { scheduleInfo } from "../../../Recoil/backState";

import Button from "../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";
import { DateTime, NumberInput } from "../../../styles/assets/Input";
import P from "../../../styles/assets/P";

const MyStaffScheduleInfo = () => {
    let fontStyle: React.CSSProperties = {};
    fontStyle.fontStyle = "italic";

    const ref = useRef<any[]>([]);
    const [scheduleInfoData, fetchScheduleInfoData] = useFetch();
    const [putScheduleInfoData, fetchPutScheduleInfoData] = useFetch();

    const [schedule, setSchedule] = useRecoilState(scheduleInfo);

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

    return (
        <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
            <FlexDiv width=" 100%" $padding="20px" $justifycontent="start" $borderB={`1px solid ${theme.color.border}`}>
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
                                ※ 면접 시작 일정과 면접 종료 일정이 모두 없으면, 면접을 하지 않는 것으로 설정됩니다.
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
    );
};

export default MyStaffScheduleInfo;
