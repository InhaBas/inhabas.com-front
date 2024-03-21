import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { styled } from "styled-components";

import { theme } from "../../styles/theme";

import useFetch from "../../Hooks/useFetch";
import {
    headerNavInfo,
    headerTitleInfo,
    profileInfo,
    signupCheck,
    tokenAccess,
    userRole,
} from "../../Recoil/backState";

import { menuInterface } from "../../Types/TypeCommon";

import { GetRoleAuthorization } from "../../Functions/authFunctions";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";

const FixedDiv = styled(FlexDiv)`
    position: fixed;
    top: 0;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
`;

interface Group {
    groupName: string;
    id: number;
    menuList: menuInterface[];
}

const HeaderNav = () => {
    const navigate = useNavigate();
    const { isAuthorizedOverSecretary } = GetRoleAuthorization();

    const [data, fetchData] = useFetch();
    const [infoData, fetchInfoData] = useFetch();
    const [signingUserData, fetchSigningUserData] = useFetch();
    const [check, setCheck] = useRecoilState(signupCheck);
    const [activeGroup, setActiveGroup] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [nav, setNav] = useRecoilState(headerNavInfo);
    const [title, setTitle] = useRecoilState(headerTitleInfo);
    const [info, setInfo] = useRecoilState(profileInfo);
    const setRole = useSetRecoilState(userRole);
    const [access, setAccess] = useRecoilState(tokenAccess);
    const [scrollPosition, setScrollPosition] = useState(0);

    const menuUrl = [
        ["introduce", "activity", "honor"],
        ["board/notice", "board/free", "board/question", "board/suggest", "board/opensource", "board/executive"],
        ["lecture", "lecture", "lecture", "lecture"],
        ["bank/support", "bank"],
        ["board/alpha", "board/beta"],
        ["contest"],
    ];

    const movePage = (url: string) => {
        navigate(`/${url}`);
    };

    const menuClickEvent = (url: string, givenName: string, givenDescription: string) => {
        setTitle({ ...title, name: givenName, description: givenDescription });

        navigate(`/${url}`);
    };

    const logoutClickEvent = () => {
        if (window.confirm("정말 로그아웃 하시겠습니까?")) {
            setAccess("default");
            setRole("");
            document.cookie = "ibas_refresh" + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
            navigate("/");
        }
    };

    // Scroll 위치를 감지
    const updateScroll = () => {
        setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    };

    useEffect(() => {
        fetchData("/menus", "GET");
    }, []);

    // signup이 안된 경우 profile은 null 로, accessToken은 default로 초기화해주어야 함.
    // 의존성을 access로 하면 check가 false일 때 실행되는 코드 때문에 무한호출 됨.
    // access가 signing이 아니면서 access가 바뀔 때는 항상 실행해야함
    useEffect(() => {
        if (access !== "signing") {
            fetchSigningUserData("/signUp/check", "GET", "token");
        }
    }, [access]);

    useEffect(() => {
        if (signingUserData) {
            setCheck(signingUserData.check);
        }
    }, [signingUserData]);

    useEffect(() => {
        if (check === true) {
            fetchInfoData("/myInfo", "GET", "token");
        } else if (check === false) {
            setInfo(null);
            // check 가 false라면 회원가입 진행중인 사람이라는 의미
            setAccess("signing");
        }
    }, [check]);

    useEffect(() => {
        if (data && Object.keys(data).length !== 0) {
            const newData = JSON.parse(JSON.stringify(data));
            delete newData.change;

            (Object.values(newData) as Group[]).forEach((group: Group, groupIdx: number) => {
                if (group.menuList) {
                    group.menuList = group.menuList.map((menu: menuInterface, idx: number) => ({
                        ...menu,
                        url: (menuUrl[groupIdx] && menuUrl[groupIdx][idx]) || "defaultUrl",
                    }));
                }
            });
            setNav(newData);
        }
    }, [data]);

    useEffect(() => {
        if (infoData) {
            setInfo(infoData);
            // 로그인 한 사람의 role을 저장시켜주기 위함
            setRole(infoData.role);
        }
    }, [infoData]);

    useEffect(() => {
        window.addEventListener("scroll", updateScroll);
        return () => {
            window.removeEventListener("scroll", updateScroll);
        };
    }, []);

    return (
        <>
            <FixedDiv
                $zIndex={3}
                width="100%"
                height="73px"
                $backgroundColor={scrollPosition < 100 ? "none" : "wh"}
                $borderB={`0.1px solid ${theme.color.whlayer}`}
            >
                <FlexDiv width="1170px" $maxWidth="1170px" $justifycontent="space-between">
                    <Div width="200px" height="75px" $pointer onClick={() => movePage("")}>
                        {scrollPosition < 100 ? (
                            <Img src="/images/logo_white.png" />
                        ) : (
                            <Img src="/images/logo_purple.png" />
                        )}
                    </Div>
                    <FlexDiv>
                        <FlexDiv>
                            <FlexDiv>
                                {nav &&
                                    Object.values(nav).map((item: any, idx: number) => {
                                        return (
                                            <Div $position="relative" key={idx}>
                                                <FlexDiv
                                                    $pointer
                                                    $margin="15px"
                                                    onMouseEnter={() => setActiveGroup(item.groupName)}
                                                >
                                                    <Div $margin="0 5px" $top="22px">
                                                        <P
                                                            fontSize="sm"
                                                            fontWeight={800}
                                                            $letterSpacing="2px"
                                                            color={scrollPosition < 100 ? "wh" : "textColor"}
                                                        >
                                                            {item.groupName}
                                                        </P>
                                                    </Div>
                                                    <FlexDiv width="10px">
                                                        {scrollPosition < 100 ? (
                                                            <Img src="/images/chevron-down_white.svg" />
                                                        ) : (
                                                            <Img src="/images/chevron-down_purple.svg" />
                                                        )}
                                                    </FlexDiv>
                                                </FlexDiv>
                                                {activeGroup === item.groupName && (
                                                    <Div
                                                        $position="absolute"
                                                        $margin="0 5px"
                                                        $backgroundColor="wh"
                                                        radius={3}
                                                        width="220px"
                                                        $padding="10px 0"
                                                        onMouseLeave={() => setActiveGroup(null)}
                                                        onClick={() => setActiveGroup(null)}
                                                    >
                                                        {item.menuList &&
                                                            Object.values(item.menuList).map(
                                                                (element: any, idx: number) => {
                                                                    if (
                                                                        element.url === "board/executive" &&
                                                                        isAuthorizedOverSecretary
                                                                    ) {
                                                                        return (
                                                                            <Div
                                                                                key={`menu${idx}`}
                                                                                $padding="8px 20px"
                                                                                width="100%"
                                                                                $pointer
                                                                                onMouseEnter={() =>
                                                                                    setActiveMenu(element.name)
                                                                                }
                                                                                $backgroundColor={
                                                                                    activeMenu === element.name
                                                                                        ? "bgColor"
                                                                                        : "wh"
                                                                                }
                                                                                onClick={() =>
                                                                                    menuClickEvent(
                                                                                        element.url,
                                                                                        element.name,
                                                                                        element.description
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Div>
                                                                                    <P
                                                                                        fontSize="sm"
                                                                                        $letterSpacing="2px"
                                                                                        color={
                                                                                            activeMenu === element.name
                                                                                                ? "wh"
                                                                                                : "bk"
                                                                                        }
                                                                                    >
                                                                                        {element.name}
                                                                                    </P>
                                                                                </Div>
                                                                            </Div>
                                                                        );
                                                                    } else if (element.url !== "board/executive") {
                                                                        return (
                                                                            <Div
                                                                                $padding="8px 20px"
                                                                                width="100%"
                                                                                $pointer
                                                                                key={`menu${idx}`}
                                                                                onMouseEnter={() =>
                                                                                    setActiveMenu(element.name)
                                                                                }
                                                                                $backgroundColor={
                                                                                    activeMenu === element.name
                                                                                        ? "bgColor"
                                                                                        : "wh"
                                                                                }
                                                                                onClick={() =>
                                                                                    menuClickEvent(
                                                                                        element.url,
                                                                                        element.name,
                                                                                        element.description
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Div>
                                                                                    <P
                                                                                        fontSize="sm"
                                                                                        $letterSpacing="2px"
                                                                                        color={
                                                                                            activeMenu === element.name
                                                                                                ? "wh"
                                                                                                : "bk"
                                                                                        }
                                                                                    >
                                                                                        {element.name}
                                                                                    </P>
                                                                                </Div>
                                                                            </Div>
                                                                        );
                                                                    }
                                                                    return null; // element.url === "board/executive" && !isAuthorizedOverSecretary 인 경우
                                                                }
                                                            )}
                                                    </Div>
                                                )}
                                            </Div>
                                        );
                                    })}
                            </FlexDiv>
                            {access === "default" || access === "signing" ? (
                                <FlexDiv $pointer $margin="15px" onClick={() => movePage("login")}>
                                    <Div $margin="0 5px">
                                        <P
                                            fontSize="sm"
                                            fontWeight={800}
                                            $letterSpacing="1px"
                                            color={scrollPosition < 100 ? "wh" : "textColor"}
                                        >
                                            LOG IN
                                        </P>
                                    </Div>
                                    <FlexDiv width="15px">
                                        <Img src="/images/login_white.svg" />
                                    </FlexDiv>
                                </FlexDiv>
                            ) : (
                                <FlexDiv $pointer $margin="15px" onClick={() => logoutClickEvent()}>
                                    <Div $margin="0 5px">
                                        <P
                                            fontSize="sm"
                                            fontWeight={800}
                                            $letterSpacing="1px"
                                            color={scrollPosition < 100 ? "wh" : "textColor"}
                                        >
                                            LOG OUT
                                        </P>
                                    </Div>
                                    <FlexDiv width="15px">
                                        <Img src="/images/logout_white.svg" />
                                    </FlexDiv>
                                </FlexDiv>
                            )}
                        </FlexDiv>
                        {access !== "default" && access !== "signing" && (
                            <FlexDiv $margin="15px 9px" onClick={() => movePage("myInfo")}>
                                <FlexDiv
                                    width="35px"
                                    height="35px"
                                    $border="2px solid"
                                    $borderColor="red"
                                    radius={100}
                                    overflow="hidden"
                                >
                                    <Img
                                        src={info?.picture}
                                        $objectFit="cover"
                                        alt="현재 브라우저에서 지원하지 않는 형태 입니다. "
                                    ></Img>
                                </FlexDiv>
                                <Div $margin="0 10px" $pointer>
                                    <P
                                        fontSize="sm"
                                        fontWeight={600}
                                        $letterSpacing="1.5px"
                                        color={scrollPosition < 100 ? "wh" : "textColor"}
                                    >
                                        {info?.name}
                                    </P>
                                </Div>
                                <FlexDiv $pointer width="15px">
                                    {scrollPosition < 100 ? (
                                        <Img src="/images/bell_white.svg" />
                                    ) : (
                                        <Img src="/images/bell_purple.svg" />
                                    )}
                                </FlexDiv>
                            </FlexDiv>
                        )}
                    </FlexDiv>
                </FlexDiv>
            </FixedDiv>
        </>
    );
};

export default HeaderNav;
