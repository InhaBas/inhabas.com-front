import { theme } from "../../../styles/theme";

import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import useFetch from "../../../Hooks/useFetch";
import { profileInfo } from "../../../Recoil/backState";
import { modalInfo, modalOpen, refetch } from "../../../Recoil/frontState";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";

const MyInfoContainer = () => {
    const widthList = [150, 500, 150];

    const [info, setInfo] = useRecoilState(profileInfo);
    const [auth, setAuth] = useState("");
    const setOpen = useSetRecoilState(modalOpen);
    const setMoalInfo = useSetRecoilState(modalInfo);

    const changeInfo = (info: string) => {
        setOpen(true);
        setMoalInfo(`change${info}`);
    };

    useEffect(() => {
        if (info?.type === "PROFESSOR") {
            setAuth("교수");
        } else if (info?.type === "BACHELOR") {
            setAuth("졸업생");
        } else if (info?.role === "CHIEF") {
            setAuth("회장");
        } else if (info?.role === "VICE_CHIEF") {
            setAuth("부회장");
        } else if (info?.role === "EXECUTIVES") {
            setAuth("운영진");
        } else if (info?.role === "SECRETARY") {
            setAuth("총무");
        } else if (info?.role === "BASIC") {
            setAuth("활동 회원");
        } else if (info?.role === "DEACTIVATED") {
            setAuth("비활동 회원");
        } else if (info?.role === "NOT_APPROVED") {
            setAuth("미승인 회원");
        }
    }, [info]);

    const [reload, setReload] = useRecoilState(refetch);

    const [infoData, fetchInfoData] = useFetch();

    useEffect(() => {
        fetchInfoData("/myInfo", "GET", "token");
    }, [reload === true]);

    useEffect(() => {
        if (infoData) {
            setInfo(infoData);
        }
        setReload(false);
    }, [infoData]);

    return (
        <>
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
                            <P fontWeight={600}>내정보 상세보기</P>
                        </Div>
                    </FlexDiv>
                </FlexDiv>
                <Div width="100%" $padding="50px">
                    <Div width="100%" $borderB={`1px solid ${theme.color.grey1}`}>
                        <FlexDiv
                            width="100%"
                            height="45px"
                            $borderT={`1px solid ${theme.color.grey1}`}
                            $justifycontent="space-between"
                            $backgroundColor="wh"
                        >
                            <FlexDiv>
                                <FlexDiv $minWidth={`${widthList[0]}px`} $padding="10px 40px">
                                    <P fontWeight={900}>이름</P>
                                </FlexDiv>
                                <FlexDiv $minWidth={`${widthList[1]}px`} $padding="10px 40px">
                                    <P>{info?.name}</P>
                                </FlexDiv>
                            </FlexDiv>
                            <FlexDiv $minWidth={`${widthList[2]}px`} $padding="10px 40px">
                                <FlexDiv width="15px" onClick={() => changeInfo("Name")} $pointer>
                                    <Img src="/images/pencil_purple.svg" />
                                </FlexDiv>
                            </FlexDiv>
                        </FlexDiv>

                        <FlexDiv
                            width="100%"
                            height="45px"
                            $borderT={`1px solid ${theme.color.grey1}`}
                            $justifycontent="start"
                            $backgroundColor="wh"
                        >
                            <FlexDiv $minWidth={`${widthList[0]}px`} $padding="10px 40px">
                                <P fontWeight={900}>학번</P>
                            </FlexDiv>
                            <FlexDiv $minWidth={`${widthList[1]}px`} $padding="10px 40px">
                                <P>{info?.studentId}</P>
                            </FlexDiv>
                        </FlexDiv>
                        <FlexDiv
                            width="100%"
                            height="45px"
                            $borderT={`1px solid ${theme.color.grey1}`}
                            $justifycontent="space-between"
                            $backgroundColor="wh"
                        >
                            <FlexDiv>
                                <FlexDiv $minWidth={`${widthList[0]}px`} $padding="10px 40px">
                                    <P fontWeight={900}>학과</P>
                                </FlexDiv>
                                <FlexDiv $minWidth={`${widthList[1]}px`} $padding="10px 40px">
                                    <P>{info?.major}</P>
                                </FlexDiv>
                            </FlexDiv>
                            <FlexDiv $minWidth={`${widthList[2]}px`} $padding="10px 40px">
                                <FlexDiv width="15px" onClick={() => changeInfo("Major")} $pointer>
                                    <Img src="/images/pencil_purple.svg" />
                                </FlexDiv>
                            </FlexDiv>
                        </FlexDiv>
                        <FlexDiv
                            width="100%"
                            height="45px"
                            $borderT={`1px solid ${theme.color.grey1}`}
                            $justifycontent="start"
                            $backgroundColor="wh"
                        >
                            <FlexDiv $minWidth={`${widthList[0]}px`} $padding="10px 40px">
                                <P fontWeight={900}>이메일</P>
                            </FlexDiv>
                            <FlexDiv $minWidth={`${widthList[1]}px`} $padding="10px 40px">
                                <P>{info?.email}</P>
                            </FlexDiv>
                        </FlexDiv>
                        <FlexDiv
                            width="100%"
                            height="45px"
                            $borderT={`1px solid ${theme.color.grey1}`}
                            $justifycontent="space-between"
                            $backgroundColor="wh"
                        >
                            <FlexDiv>
                                <FlexDiv $minWidth={`${widthList[0]}px`} $padding="10px 40px">
                                    <P fontWeight={900}>전화번호</P>
                                </FlexDiv>
                                <FlexDiv $minWidth={`${widthList[1]}px`} $padding="10px 40px">
                                    <P>{info?.phoneNumber}</P>
                                </FlexDiv>
                            </FlexDiv>
                            <FlexDiv $minWidth={`${widthList[2]}px`} $padding="10px 40px">
                                <FlexDiv width="15px" onClick={() => changeInfo("Number")} $pointer>
                                    <Img src="/images/pencil_purple.svg" />
                                </FlexDiv>
                            </FlexDiv>
                        </FlexDiv>
                        <FlexDiv
                            width="100%"
                            height="45px"
                            $borderT={`1px solid ${theme.color.grey1}`}
                            $justifycontent="space-between"
                            $backgroundColor="wh"
                        >
                            <FlexDiv>
                                <FlexDiv $minWidth={`${widthList[0]}px`} $padding="10px 40px">
                                    <P fontWeight={900}>권한</P>
                                </FlexDiv>
                                <FlexDiv $minWidth={`${widthList[1]}px`} $padding="10px 40px">
                                    <P>{auth}</P>
                                </FlexDiv>
                            </FlexDiv>
                            <FlexDiv $minWidth={`${widthList[2]}px`} $padding="10px 40px" $pointer>
                                <P color="grey2">졸업 하셨나요?</P>
                            </FlexDiv>
                        </FlexDiv>
                        <FlexDiv
                            width="100%"
                            height="45px"
                            $borderT={`1px solid ${theme.color.grey1}`}
                            $justifycontent="space-between"
                            $backgroundColor="wh"
                        >
                            <FlexDiv>
                                <FlexDiv $minWidth={`${widthList[0]}px`} $padding="10px 40px">
                                    <P fontWeight={900}>자기소개</P>
                                </FlexDiv>
                                <FlexDiv $minWidth={`${widthList[1]}px`} $padding="10px 40px">
                                    {info?.introduce?.length === 0 ? (
                                        <P color="grey2">아직 자기 소개를 작성하지 않았습니다.</P>
                                    ) : (
                                        <P>{info?.introduce}</P>
                                    )}
                                </FlexDiv>
                            </FlexDiv>
                            <FlexDiv $minWidth={`${widthList[2]}px`} $padding="10px 40px">
                                <FlexDiv width="15px" onClick={() => changeInfo("Intro")} $pointer>
                                    <Img src="/images/pencil_purple.svg" />
                                </FlexDiv>
                            </FlexDiv>
                        </FlexDiv>
                    </Div>

                    {info?.role === "CHIEF" ||
                    info?.role === "VICE_CHIEF" ||
                    info?.role === "EXECUTIVES" ||
                    info?.role === "SECRETARY" ? (
                        <FlexDiv width="100%" $margin="30px 0 0 0">
                            <FlexDiv width="20px" height="20px" $margin="0 10px 0 0">
                                <Img src="/images/check_grey.svg" />
                            </FlexDiv>
                            <FlexDiv>
                                <P color="grey3" fontSize="sm">
                                    회장단의 경우 권한이 이양되기 전까지 회원탈퇴를 할 수 없습니다. 회장에게 권한 이양을
                                    요청하세요
                                </P>
                            </FlexDiv>
                        </FlexDiv>
                    ) : null}
                </Div>
            </Div>
        </>
    );
};

export default MyInfoContainer;
