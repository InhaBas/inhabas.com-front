import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import styled from "styled-components";

import useFetch from "../../../Hooks/useFetch";
import { signupInfo, tokenAccess, userEmail } from "../../../Recoil/backState";
import { majorSelected, modalInfo, modalOpen, relogin } from "../../../Recoil/frontState";

import A from "../../../styles/assets/A";
import Button from "../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";
import { Checkbox, Label, Radio, TextInput } from "../../../styles/assets/Input";
import P from "../../../styles/assets/P";
import Dropdown from "../../Common/Dropdown";

const HrSect = styled.div`
    display: flex;
    flex-basis: 100%;
    align-items: center;
    color: rgba(0, 0, 0, 0.35);
    font-size: 12px;

    &::before,
    &::after {
        content: "";
        flex-grow: 1;
        background: rgba(0, 0, 0, 0.35);
        height: 1px;
        font-size: 0px;
        line-height: 0px;
        margin: 0px 16px;
    }
`;

const Signup = () => {
    const navigate = useNavigate();
    const setOpen = useSetRecoilState(modalOpen);
    const setModalInfo = useSetRecoilState(modalInfo);
    const [selectedMajor, setSelecteMajor] = useRecoilState(majorSelected);

    const searchMajor = () => {
        setOpen(true);

        setModalInfo({ type: "major" });
    };

    const movePage = () => {
        navigate("/");
    };

    /*
    phone 입력 처리. 
    11자만 입력 가능하게 처리함. 
    000-0000-0000 형식. 
    */
    const autoHyphen = (target: HTMLInputElement) => {
        let value = target.value.replace(/[^0-9]/g, "");

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        target.value = value.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/, "$1-$2-$3").replace(/(\-{1,2})$/, "");
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
            var base64Url = token.split(".")[1];
            if (!base64Url) {
                return null;
            }

            var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            var jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map(function (c) {
                        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                    })
                    .join("")
            );

            return JSON.parse(jsonPayload);
        } catch (error) {
            // 토큰 파싱 오류 처리
            console.error("Error parsing JWT:", error);
            return null;
        }
    };

    const ref = useRef<any[]>([]);

    const [status, setStatus] = useState("student");
    const [gradeValue, setGradeValue] = useState("");
    const [postData, postFetchData] = useFetch();
    const [proPostData, proPostFetchData] = useFetch();
    const [getData, getFetchData] = useFetch();
    const [email, setEmail] = useRecoilState(userEmail);
    const [info, setInfo] = useRecoilState(signupInfo);
    const setReload = useSetRecoilState(relogin);
    const access = useRecoilValue(tokenAccess);

    // select 값 선택에 따른 state 변경 이벤트
    const handleGradeChange = (value: string) => {
        // 선택된 값을 업데이트
        setGradeValue(value);
    };

    /*
    보낼 데이터 유효성 검사
    check가 true일 때만 fetch 한다
    학생일 경우, 교수일 경우 다른 fetch hook를 사용하니 유의할 것

    */
    const sendInput = () => {
        let check = true;

        if (check && ref.current[2].value === "") {
            alert("이름을 입력해주세요");
            check = false;
        }

        if (check && ref.current[3].value === "") {
            alert("핸드폰번호를 입력해주세요");
            check = false;
        }

        console.log((check && ref.current[3].value.length < 13) || ref.current[3].value.slice(0, 3) !== "010");

        if ((check && ref.current[3].value.length < 13) || ref.current[3].value.slice(0, 3) !== "010") {
            alert("핸드폰번호를 정확하게 입력해주세요");
            check = false;
        }
        if (check) {
            if (status === "professor" && ref.current[4].value === "") {
                alert("교수번호를 입력해주세요");
                check = false;
            } else if (status === "student" && ref.current[6].value === "") {
                alert("학번을 입력해주세요");
            } else if (status === "student" && gradeValue === "") {
                alert("학년을 선택해주세요");
            }
        }
        if (check && selectedMajor.major === "") {
            alert("전공을 선택해주세요");
            check = false;
        }
        if (check && !ref.current[7].checked) {
            alert("약관의 내용에 동의하셔야 회원가입이 가능합니다");
            check = false;
        }
        if (check) {
            let inputData = {
                name: ref.current[2].value,
                major: selectedMajor.major,
                phoneNumber: ref.current[3].value,
                studentId: status === "student" ? ref.current[6].value : ref.current[4].value,
                memberType: status === "student" ? "UNDERGRADUATE" : "PROFESSOR",
                grade: status === "student" ? parseInt(gradeValue) : null,
            };

            if (status === "student") {
                postFetchData("/signUp", "POST", "token", inputData);
            }

            if (status === "professor") {
                proPostFetchData("/signUp", "POST", "token", inputData);
            }
            console.log(proPostData);
        }
    };

    /*
        회원가입 한 이력이 있어 저장된 개인 정보를 호출하는 api
        새로고침 시 access 토큰이 재발급되므로, 토큰이 변화할 때마다 불러와야 함
    */
    useEffect(() => {
        getFetchData("/signUp", "GET", "token");
        return () => {
            setInfo(null);
        };
    }, [access]);

    /*
        토큰에 있는 정보 중 email을 recoil에 저장
        새로고침 시 access 토큰이 재발급되므로, 토큰이 변화할 때마다 불러와야 함
    */
    useEffect(() => {
        const tokenData = parseJwt(access);
        if (tokenData && tokenData.email) {
            setEmail(tokenData.email);
        }
    }, [access]);

    /*
        회원가입 한 이력이 있는 경우 api 호출에 대한 response data 저장
        정보를 input value에 저장시켜둠
    */
    useEffect(() => {
        if (getData) {
            setInfo(getData);
        }
    }, [getData]);

    /*
        회원가입 한 이력이 있는 경우 중 major도 저장되었을 때 
        major를 selectedMajor에 저장시킴
        이 때 college와 major 형태를 유지시킬 것
        signUp api를 보낼 때 major의 값만 보내면 되므로, colleage의 값은 신경쓰지 않아도 됨
    */
    useEffect(() => {
        if (info?.major) {
            setSelecteMajor({ college: "default", major: info.major });
        }
    }, [info]);

    /* 학생용 signUp api 가 잘 POST 된 경우 */
    useEffect(() => {
        if (postData === "noContents") {
            navigate("/signup/question");
        }
    }, [postData]);

    /* 교수용 signUp api 가 잘 POST 된 경우 */
    useEffect(() => {
        if (proPostData === "noContents") {
            setReload(true);
            navigate("/");
        }
    }, [proPostData]);

    return (
        <>
            <FlexDiv width="100%" height="100vh">
                <FlexDiv
                    width="33%"
                    height="80%"
                    direction="column"
                    $padding="0 45px"
                    $margin="0 auto"
                    $justifycontent="space-evenly"
                >
                    <FlexDiv width="90%">
                        <FlexDiv width="150px" $margin="0 0 30px 0" $pointer onClick={() => movePage()}>
                            <Img src="/images/ibas-main-logo_purple.png" />
                        </FlexDiv>

                        <FlexDiv width="100%">
                            <HrSect>기본 정보</HrSect>
                        </FlexDiv>
                        <FlexDiv width="90%" $margin="10px 0 " $justifycontent="start">
                            <FlexDiv>
                                <Radio
                                    name="setStatus"
                                    value="학생"
                                    ref={(el: never) => (ref.current[0] = el)}
                                    onClick={() => setStatus("student")}
                                    defaultChecked
                                />
                                <Label $margin="0 0 0 5px">학생</Label>
                            </FlexDiv>
                            <FlexDiv $margin="0 0 0 10px">
                                <Radio
                                    name="setStatus"
                                    value="교수님"
                                    ref={(el: never) => (ref.current[1] = el)}
                                    onClick={() => setStatus("professor")}
                                />
                                <Label $margin="0 0 0 5px">교수님</Label>
                            </FlexDiv>
                        </FlexDiv>
                        <FlexDiv width="100%">
                            <TextInput
                                defaultValue={info?.name || ""}
                                placeholder="이름"
                                width="90%"
                                $borderRadius={100}
                                $margin="10px 0 0 0"
                                ref={(el: never) => (ref.current[2] = el)}
                            />
                            <Div $backgroundColor="grey1" width="90%" radius={100} $margin="10px 0 0 0" $padding="10px">
                                <P>{email}</P>
                            </Div>
                            <TextInput
                                placeholder="핸드폰번호"
                                width="90%"
                                $borderRadius={100}
                                $margin="10px 0 0 0"
                                defaultValue={info?.phoneNumber || ""}
                                ref={(el: never) => (ref.current[3] = el)}
                                onChange={() => autoHyphen(ref.current[3])}
                            />
                            {status === "professor" ? (
                                <FlexDiv $justifycontent="space-between" width="90%">
                                    <TextInput
                                        placeholder="교수번호"
                                        defaultValue={info?.studentId || ""}
                                        width="100%"
                                        $borderRadius={100}
                                        $margin="10px 0 0 0"
                                        ref={(el: never) => (ref.current[4] = el)}
                                    />
                                </FlexDiv>
                            ) : (
                                <FlexDiv $justifycontent="space-between" width="90%">
                                    <Div width="30%" $margin="10px 0 0 0">
                                        <Dropdown
                                            label="학년"
                                            options={["1학년", "2학년", "3학년", "4학년"]}
                                            value={["1", "2", "3", "4"]}
                                            onChange={handleGradeChange}
                                            borderRadius={100}
                                        />
                                    </Div>
                                    <TextInput
                                        defaultValue={info?.studentId || ""}
                                        placeholder="학번(12112233)"
                                        width="68%"
                                        $borderRadius={100}
                                        $margin="10px 0 0 0"
                                        ref={(el: never) => (ref.current[6] = el)}
                                    />
                                </FlexDiv>
                            )}

                            <FlexDiv
                                width="90%"
                                $margin="10px 0 0 0"
                                $justifycontent="space-between"
                                $pointer
                                onClick={() => searchMajor()}
                            >
                                <Div width="90%" radius={100} $border="1px solid" $borderColor="grey1" $padding="10px">
                                    {selectedMajor.major === "" ? (
                                        <P>전공을 검색하려면 클릭하세요</P>
                                    ) : (
                                        <P>{selectedMajor.major}</P>
                                    )}
                                </Div>
                                <FlexDiv width="20px" $justifycontent="end">
                                    <Img src="/images/search.svg" />
                                </FlexDiv>
                            </FlexDiv>

                            <FlexDiv $justifycontent="start" width="90%" $margin="10px 0 0 0">
                                <Div $margin="0 10px 0 0">
                                    <Checkbox ref={(el: never) => (ref.current[7] = el)} />
                                </Div>
                                <FlexDiv width="80%" $justifycontent="start">
                                    <Div>
                                        <A fontSize="xs">본인은</A>
                                    </Div>
                                    <Div>
                                        <A
                                            fontWeight={700}
                                            href="/rule"
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
                                            href="/rule"
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
                                            href="/rule"
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
                                </FlexDiv>

                                <Button
                                    display="flex"
                                    $backgroundColor="bgColor"
                                    $margin="50px 0"
                                    $padding="12px 15px"
                                    $borderRadius={2}
                                    $HBackgroundColor="bgColorHo"
                                    width="100%"
                                    onClick={() => sendInput()}
                                >
                                    <P color="wh">다음</P>
                                </Button>
                            </FlexDiv>
                        </FlexDiv>
                    </FlexDiv>
                </FlexDiv>
                <Div width="67%" height="100vh" overflow="hidden">
                    <Img src="/images/member-background.jpg" />
                </Div>
            </FlexDiv>
        </>
    );
};

export default Signup;
