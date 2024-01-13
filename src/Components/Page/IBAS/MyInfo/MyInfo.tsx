import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import useFetch from "../../../../Hooks/useFetch";
import { profileInfo } from "../../../../Recoil/backState";

import HeaderNav from "../../../Common/HeaderNav";
import MyBankSupportContainer from "../../../Container/MyInfo/MyBankSupportContainer";
import MyBoardContainer from "../../../Container/MyInfo/MyBoardContainer";
import MyInfoContainer from "../../../Container/MyInfo/MyInfoContainer";
import MyLectureContainer from "../../../Container/MyInfo/MyLectureContainer";
import MyManageLectureContainer from "../../../Container/MyInfo/MyManageLectureContainer";

import Button from "../../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

const MyInfoImgDiv = styled(Div)`
    background-image: url("/images/myinfo-background.jpg");
    background-size: cover;
    position: relative;
    top: -73px;
`;

const MyInfoDiv = styled(FlexDiv)`
    position: absolute;
    top: 0;
    left: 0;
`;

const MyInfo = () => {
    const navigate = useNavigate();

    const movePageEvent = (url: string) => {
        navigate(`/${url}`);
    };

    // 탭 정보 설정
    const myInfoTabInfo = [
        { idx: 0, url: "/images/home_white.svg", clickedUrl: "/images/home_purple.svg", info: "강의실" },
        { idx: 1, url: "/images/book_white.svg", clickedUrl: "/images/book_purple.svg", info: "개설 강의 관리" },
        { idx: 2, url: "/images/todo_white.svg", clickedUrl: "/images/todo_purple.svg", info: "작성 글 관리" },
        { idx: 3, url: "/images/money_white.svg", clickedUrl: "/images/money_purple.svg", info: "예산 신청 내역" },
        { idx: 4, url: "/images/user_white.svg", clickedUrl: "/images/user_purple.svg", info: "내정보" },
    ];

    const [infoData, fetchInfoData] = useFetch();
    const [clicked, setclicked] = useState(4);
    const [info, setInfo] = useRecoilState(profileInfo);

    // myInfo 정보 GET fetch
    useEffect(() => {
        fetchInfoData("/myInfo", "GET", "token");
    }, []);

    // myInfo recoil 저장
    useEffect(() => {
        if (infoData) {
            setInfo(infoData);
        }
    }, [infoData]);

    return (
        <>
            <HeaderNav />
            <MyInfoDiv
                $zIndex={2}
                width="100%"
                height="423px"
                $backgroundColor="bklayer"
                direction="column"
                $justifycontent="end"
            >
                <FlexDiv
                    $position="relative"
                    $justifycontent="space-between"
                    $backgroundColor="wh"
                    height="100px"
                    width="100%"
                    $padding="0 8%"
                >
                    <Div>
                        <FlexDiv
                            $position="absolute"
                            $top="-3em"
                            width="8em"
                            height="8em"
                            $border="4px solid"
                            $borderColor="wh"
                            radius={100}
                            overflow="hidden"
                        >
                            <Img src={info?.picture} $objectFit="cover" />
                        </FlexDiv>
                        <Div $margin="0 0 0 10em ">
                            <Div>
                                <P fontSize="xl" fontWeight={600}>
                                    {info?.name}
                                </P>
                            </Div>
                            <Div $margin="5px 0">
                                <P>
                                    {info?.major} • {info?.studentId}
                                </P>
                            </Div>
                        </Div>
                    </Div>
                    <FlexDiv width="230px" $justifycontent="space-between">
                        <Button
                            $backgroundColor="grey3"
                            width="110px"
                            $padding="10px "
                            $borderRadius={5}
                            $HBackgroundColor="grey2"
                        >
                            <FlexDiv width="100%">
                                <FlexDiv width="15px" height="15px" $margin="0 5px 0 0 ">
                                    <Img src="/images/users_white.svg" />
                                </FlexDiv>
                                <Div onClick={() => movePageEvent("staff/member")}>
                                    <P color="wh" fontSize="sm" fontWeight={300}>
                                        회원 관리
                                    </P>
                                </Div>
                            </FlexDiv>
                        </Button>
                        <Button
                            $backgroundColor="bgColor"
                            width="110px"
                            $padding="10px"
                            $borderRadius={5}
                            $HBackgroundColor="bgColorHo"
                        >
                            <FlexDiv width="100%">
                                <FlexDiv width="15px" height="15px" $margin="0 5px 0 0 ">
                                    <Img src="/images/image_white.svg" />
                                </FlexDiv>
                                <Div>
                                    <P color="wh" fontSize="sm" fontWeight={300}>
                                        사진 설정
                                    </P>
                                </Div>
                            </FlexDiv>
                        </Button>
                    </FlexDiv>
                </FlexDiv>
                <FlexDiv $backgroundColor="bgColor" height="50px" width="100%" $justifycontent="start" $padding="0 8%">
                    {myInfoTabInfo.map((item, idx) => (
                        <FlexDiv
                            key={`nav${idx}`}
                            $padding="0 15px"
                            $pointer
                            $backgroundColor={item.idx === clicked ? "wh" : "bgColor"}
                            height="50px"
                            onClick={() => setclicked(item.idx)}
                        >
                            <FlexDiv width="15px" height="15px" $margin="0 5px 0 0 ">
                                <Img src={item.idx === clicked ? item.clickedUrl : item.url} />
                            </FlexDiv>
                            <FlexDiv>
                                <P fontSize="xs" color={item.idx === clicked ? "bgColor" : "wh"}>
                                    {item.info}
                                </P>
                            </FlexDiv>
                        </FlexDiv>
                    ))}
                </FlexDiv>
            </MyInfoDiv>
            <MyInfoImgDiv width="100%" height="423px" />

            <Div width="100%" $padding="0 8%">
                {clicked === 0 && <MyLectureContainer />}
                {clicked === 1 && <MyManageLectureContainer />}
                {clicked === 2 && <MyBoardContainer />}
                {clicked === 3 && <MyBankSupportContainer />}
                {clicked === 4 && <MyInfoContainer />}
            </Div>
        </>
    );
};

export default MyInfo;
