import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import { profileInfo } from "../../recoil/backState";
import { modalInfo, modalOpen } from "../../recoil/frontState";

import { GetRoleAuthorization } from "../../functions/authFunctions";

import MyBankSupportContainer from "../../containers/myInfo/MyBankSupportContainer";
import MyBoardContainer from "../../containers/myInfo/MyBoardContainer";
import MyInfoContainer from "../../containers/myInfo/MyInfoContainer";
import MyLectureContainer from "../../containers/myInfo/MyLectureContainer";
import MyManageLectureContainer from "../../containers/myInfo/MyManageLectureContainer";

import Button from "../../styles/assets/Button";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";
import Loading from "../../components/common/Loading";
import { media } from "../../styles/theme";

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

const ProfileBar = styled(FlexDiv)`
    box-sizing: border-box;

    ${media.tablet} {
        padding: 0 24px !important;
    }

    ${media.mobile} {
        height: auto !important;
        min-height: 150px;
        padding: 56px 16px 16px !important;
        align-items: flex-start;
        flex-direction: column;
        gap: 12px;

        > div:first-child {
            width: 100%;
        }

        > div:first-child > div:first-child {
            position: static !important;
            width: 5.5em !important;
            height: 5.5em !important;
            margin-bottom: 8px;
        }

        > div:first-child > div:last-child {
            margin: 0 !important;
        }

        p {
            white-space: normal;
            overflow-wrap: anywhere;
        }
    }
`;

const ProfileActions = styled(FlexDiv)`
    flex-shrink: 0;

    ${media.mobile} {
        width: 100% !important;
        justify-content: flex-start;
        gap: 8px;
    }
`;

const MyInfoTabs = styled(FlexDiv)`
    box-sizing: border-box;

    ${media.tablet} {
        padding: 0 24px !important;
    }

    ${media.mobile} {
        padding: 0 16px !important;
        justify-content: flex-start;
        flex-wrap: nowrap;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;

        > div {
            flex: 0 0 auto;
        }
    }
`;

const MyInfoContent = styled(Div)`
    box-sizing: border-box;
    min-width: 0;

    ${media.tablet} {
        padding: 4% 24px !important;
    }

    ${media.mobile} {
        padding: 24px 16px !important;
    }
`;

const MyInfo = () => {
    const navigate = useNavigate();

    const { isAuthorizedOverSecretary } = GetRoleAuthorization();
    const setOpen = useSetRecoilState(modalOpen);
    const setModalInfo = useSetRecoilState(modalInfo);

    // 탭 정보 설정
    const myInfoTabInfo = [
        { idx: 0, url: "/images/home_white.svg", clickedUrl: "/images/home_purple.svg", info: "강의실" },
        { idx: 1, url: "/images/book_white.svg", clickedUrl: "/images/book_purple.svg", info: "개설 강의 관리" },
        { idx: 2, url: "/images/todo_white.svg", clickedUrl: "/images/todo_purple.svg", info: "작성 글 관리" },
        { idx: 3, url: "/images/money_white.svg", clickedUrl: "/images/money_purple.svg", info: "예산 신청 내역" },
        { idx: 4, url: "/images/user_white.svg", clickedUrl: "/images/user_purple.svg", info: "내정보" },
    ];

    const [clicked, setclicked] = useState(4);
    const info = useRecoilValue(profileInfo);

    const movePageEvent = (url: string) => {
        navigate(`/${url}`);
    };

    const openModal = () => {
        setOpen(true);
        setModalInfo({ type: "changeImg" });
    };

    return (
        <>
            {info == null ? (
                <FlexDiv width="100%" height="100vh">
                    <Loading />
                </FlexDiv>
            ) : (
                <>
                    <MyInfoDiv
                        $zIndex={2}
                        width="100%"
                        height="423px"
                        $backgroundColor="bklayer"
                        direction="column"
                        $justifycontent="end"
                    >
                        <ProfileBar
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
                            <ProfileActions width="230px" $justifycontent="space-between">
                                {isAuthorizedOverSecretary && (
                                    <Button
                                        $backgroundColor="grey3"
                                        width="110px"
                                        $padding="10px "
                                        $borderRadius={5}
                                        $HBackgroundColor="grey2"
                                        onClick={() => movePageEvent("staff/member")}
                                    >
                                        <FlexDiv width="100%">
                                            <FlexDiv width="15px" height="15px" $margin="0 5px 0 0 ">
                                                <Img src="/images/users_white.svg" />
                                            </FlexDiv>
                                            <Div>
                                                <P color="wh" fontSize="sm" fontWeight={300}>
                                                    회원 관리
                                                </P>
                                            </Div>
                                        </FlexDiv>
                                    </Button>
                                )}
                                <Button
                                    $backgroundColor="bgColor"
                                    width="110px"
                                    $padding="10px"
                                    $borderRadius={5}
                                    $HBackgroundColor="bgColorHo"
                                    onClick={() => openModal()}
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
                            </ProfileActions>
                        </ProfileBar>
                        <MyInfoTabs
                            $backgroundColor="bgColor"
                            height="50px"
                            width="100%"
                            $justifycontent="start"
                            $padding="0 8%"
                        >
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
                        </MyInfoTabs>
                    </MyInfoDiv>
                    <MyInfoImgDiv width="100%" height="423px" />

                    <MyInfoContent width="100%" $padding="4% 9%">
                        {clicked === 0 && <MyLectureContainer />}
                        {clicked === 1 && <MyManageLectureContainer />}
                        {clicked === 2 && <MyBoardContainer />}
                        {clicked === 3 && <MyBankSupportContainer />}
                        {clicked === 4 && <MyInfoContainer />}
                    </MyInfoContent>
                </>
            )}
        </>
    );
};

export default MyInfo;
