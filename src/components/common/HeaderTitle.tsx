import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import styled from "styled-components";

import { headerNavInfo, headerTitleInfo, tokenAccess } from "../../recoil/backState";
import { menuInfo } from "../../recoil/frontState";

import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

import { Div, FlexDiv } from "../../styles/assets/Div";
import { H1 } from "../../styles/assets/H";
import P from "../../styles/assets/P";
import { media } from "../../styles/theme";

const HeaderImgDiv = styled(Div)`
    background-image: url("/images/board-name-img.jpg");
    background-size: cover;
    position: relative;
    height: 423px;

    ${media.tablet} {
        height: 320px;
    }

    ${media.mobile} {
        height: 240px;
    }
`;

const HeaderHDiv = styled(FlexDiv)`
    position: absolute;
    top: 0;
    left: 0;
    height: 423px;

    ${media.tablet} {
        height: 320px;
    }

    ${media.mobile} {
        height: 240px;
    }
`;

const TitleContent = styled.div`
    width: 100%;
    max-width: 1170px;
    padding: 0 24px;
    text-align: center;
    white-space: normal;

    & > div {
        width: 100%;
        white-space: normal;
    }

    ${media.mobile} {
        padding: 0 16px;
    }
`;

const TitleName = styled(H1)`
    white-space: normal;
    overflow-wrap: anywhere;

    ${media.tablet} {
        font-size: 36px;
    }

    ${media.mobile} {
        font-size: 28px;
        line-height: 1.25;
    }
`;

const TitleDescription = styled(P)`
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    overflow-wrap: anywhere;

    ${media.tablet} {
        font-size: 16px;
        line-height: 1.5;
    }

    ${media.mobile} {
        font-size: 14px;
    }
`;

const HeaderTitle = () => {
    const [titleData, fetchTitleData] = useFetch();
    const menuId = useRecoilValue(menuInfo);
    const location = useLocation();
    const pathNameInfo = location.pathname.substring(1).split("/");
    const [title, setTitle] = useRecoilState(headerTitleInfo);
    const nav = useRecoilValue(headerNavInfo);
    const accessToken = useRecoilValue(tokenAccess);
    const navigate = useNavigate();

    let titleId = 0;

    const titleInfo = (pathName1: string, pathName2: string) => {
        // case 분기 -> pathNameInfo[1] 번째 비교해서 또 분기
        switch (pathName1) {
            case "introduce":
                titleId = 1;
                break;
            case "activity":
                titleId = 2;
                break;
            case "honor":
                titleId = 3;
                break;
            case "board":
                // pathName2에 따라 분기
                switch (pathName2) {
                    case "notice":
                        titleId = 4;
                        break;
                    case "free":
                        titleId = 5;
                        break;
                    case "question":
                        titleId = 6;
                        break;
                    case "suggest":
                        titleId = 7;
                        break;
                    case "opensource":
                        titleId = 8;
                        break;
                    case "executive":
                        titleId = 9;
                        break;
                    case "alpha":
                        titleId = 16;
                        break;
                    case "beta":
                        titleId = 17;
                        break;
                    case "sponsor":
                        titleId = 21;
                        break;
                    case "usage":
                        titleId = 22;
                        break;
                    case "contest":
                        titleId = 18;
                        break;
                    case "activity":
                        titleId = 19;
                        break;
                    default: // 혹은 다른 값으로 설정
                        // pathName1이 위의 case에 일치하지 않는 경우에 대한 처리
                        titleId = 0;
                        break;
                }
                break;
            case "lecture":
                titleId = 10;
                break;
            case "study":
                titleId = 11;
                break;
            case "hobby":
                titleId = 12;
                break;
            case "lecture-application":
                titleId = 13;
                break;
            case "bank":
                titleId = 15;
                if (pathName2 === "support") {
                    titleId = 14;
                }
                break;
        }
        return titleId;
    };

    useEffect(() => {
        const id = titleInfo(pathNameInfo[0], pathNameInfo[1]);
        if ((title.name === null || title.name === "") && pathNameInfo[0] !== "staff") {
            fetchTitleData(`/menu/${id}`, "GET");
        }
    }, []);

    useEffect(() => {
        const id = titleInfo(pathNameInfo[0], pathNameInfo[1]);
        // 이전 titleId와 새로운 titleId가 다를 때에만 fetchTitleData 호출

        if (pathNameInfo[0] !== "staff") {
            fetchTitleData(`/menu/${id}`, "GET");
        }
    }, [pathNameInfo[0], pathNameInfo[1]]); // pathNameInfo와 titleId가 변경될 때마다 useEffect가 실행되도록 함

    useEffect(() => {
        if (titleData) {
            setTitle(titleData);
        }
        return () => setTitle({ name: "", description: "" });
    }, [titleData]);

    return (
        <>
            <HeaderHDiv $zIndex={2} width="100%" $backgroundColor="bklayer" direction="column">
                {title && (
                    <TitleContent>
                        <Div $margin="0 0 20px 0">
                            <TitleName color="wh" fontWeight={700} fontSize="xxxl">
                                {title.name}
                            </TitleName>
                        </Div>
                        <Div>
                            <TitleDescription color="grey3" fontWeight={300} fontSize="lg">
                                {title.description}
                            </TitleDescription>
                        </Div>
                    </TitleContent>
                )}
            </HeaderHDiv>
            <HeaderImgDiv width="100%" />
        </>
    );
};

export default HeaderTitle;
