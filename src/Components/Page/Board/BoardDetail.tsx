import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";

import { theme } from "../../../styles/theme";

import { boardDetailData, tokenAccess } from "../../../Recoil/backState";
import { carouselInitialState, carouselOpen } from "../../../Recoil/frontState";

import { tokenInterface } from "../../../Types/TypeCommon";

import useFetch from "../../../Hooks/useFetch";

import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "@toast-ui/editor/dist/toastui-editor.css";

import { GetRoleAuthorization } from "../../../Functions/authFunctions";
import { DateFunction } from "../../../Functions/dateFunction";

import A from "../../../styles/assets/A";
import Button from "../../../styles/assets/Button";
import { DetailContainer, Div, FlexDiv } from "../../../styles/assets/Div";
import { H2 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";

import Carousel from "../../Common/Carousel";
import Comment from "../../Common/Comment";
import CommentInput from "../../Common/CommentInput";
import Loading from "../../Common/Loading";
import TextViewer from "../../Common/TextViewer";

const HorizonScrollDiv = styled(Div)`
    white-space: nowrap;
    overflow-x: scroll;

    &::-webkit-scrollbar {
        display: block;
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${theme.color.grey1}; /* 스크롤바 썸의 색상을 지정하세요 */
        border-radius: 4px; /* 스크롤바 썸의 모서리를 지정하세요 */
    }

    /* 스크롤바 호버 스타일 추가 */
    &::-webkit-scrollbar-thumb:hover {
        background-color: ${props => props.theme.color.grey}; /* 스크롤바 썸의 호버 색상을 지정하세요 */
    }
`;

const BoardDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const url = location.pathname.split("/")[2];
    const boardId = location.pathname.split("/")[4];
    const { isAuthorizedOverVice } = GetRoleAuthorization();

    const { formatDateMinute } = DateFunction();

    const [detail, setDetail] = useRecoilState(boardDetailData);
    const [detailData, detailDataFetch] = useFetch();
    const [deleteData, deleteDataFetch] = useFetch();
    const [isLoading, setIsLoading] = useState(true);
    const access = useRecoilValue(tokenAccess);
    const [isCarouselOpen, setIsCarouselOpen] = useRecoilState(carouselOpen);
    const [carouselInitial, setCarouselInitial] = useRecoilState(carouselInitialState);

    const pathNameInfo = location.pathname.substring(1).split("/");

    let decoded;
    if (access !== "default") {
        decoded = jwtDecode(access) as tokenInterface;
    }
    const userId = decoded?.memberId;

    let fetchUrl: string;
    if (url === "alpha") {
        fetchUrl = "/project/alpha";
    } else if (url === "beta") {
        fetchUrl = "/project/beta";
    } else if (url === "sponsor") {
        fetchUrl = "/scholarship/sponsor";
    } else if (url === "usage") {
        fetchUrl = "/scholarship/usage";
    } else if (url === "opensource") {
        fetchUrl = "/board/storage";
    } else {
        fetchUrl = `/board/${url}`;
    }

    let menuId: number;

    const titleInfo = (pathName1: string, pathName2: string) => {
        // case 분기 -> pathNameInfo[1] 번째 비교해서 또 분기
        switch (pathName1) {
            case "introduce":
                menuId = 1;
                break;
            case "activity":
                menuId = 2;
                break;
            case "honor":
                menuId = 3;
                break;
            case "board":
                // pathName2에 따라 분기
                switch (pathName2) {
                    case "notice":
                        menuId = 4;
                        break;
                    case "free":
                        menuId = 5;
                        break;
                    case "question":
                        menuId = 6;
                        break;
                    case "suggest":
                        menuId = 7;
                        break;
                    case "opensource":
                        menuId = 8;
                        break;
                    case "executive":
                        menuId = 9;
                        break;
                    case "alpha":
                        menuId = 16;
                        break;
                    case "beta":
                        menuId = 17;
                        break;
                    case "sponsor":
                        menuId = 21;
                        break;
                    case "usage":
                        menuId = 22;
                        break;
                    default: // 혹은 다른 값으로 설정
                        // pathName1이 위의 case에 일치하지 않는 경우에 대한 처리
                        menuId = 0;
                        break;
                }
                break;
            case "lecture":
                menuId = 10;
                break;
            case "study":
                menuId = 11;
                break;
            case "hobby":
                menuId = 12;
                break;
            case "lecture-application":
                menuId = 13;
                break;
            case "bank":
                menuId = 15;
                if (pathName2 === "support") {
                    menuId = 14;
                }
                break;

            case "contest":
                switch (pathName2) {
                    case "":
                        menuId = 18;
                        break;
                    case "activity":
                        menuId = 19;
                        break;
                }
        }
        return menuId;
    };

    const openWindow = (url: string) => {
        window.open(url);
    };

    // Carousel을 렌더링할지 여부를 결정하는 함수
    const handleCarousel = (idx: number) => {
        setCarouselInitial(idx);

        setIsCarouselOpen(true);
    };

    useEffect(() => console.log(carouselInitial), [carouselInitial]);

    const deleteDetail = () => {
        if (window.confirm("정말 삭제 하시겠습니까?")) {
            setIsLoading(true);
            deleteDataFetch(`${fetchUrl}/${boardId}`, "DELETE", "token");
        }
    };

    useEffect(() => {
        setIsLoading(true);
        if (["opensource", "usage", "sponsor"].includes(url)) {
            detailDataFetch(`${fetchUrl}/${boardId}`, "GET");
        } else {
            detailDataFetch(`${fetchUrl}/${boardId}`, "GET", "token");
        }
    }, [access, url]);

    useEffect(() => {
        if (detailData) {
            setDetail(detailData);
            setIsLoading(false);
        }
        return () => {
            setDetail(null);
            setIsCarouselOpen(false);
        };
    }, [detailData]);

    useEffect(() => {
        if (deleteData) {
            alert("게시글이 삭제 되었습니다");
            setIsLoading(false);
            navigate(`/board/${url}`);
        }
        return () => setDetail(null);
    }, [deleteData]);

    return (
        <>
            {isLoading ? (
                <FlexDiv width="100%" height="100vh">
                    <Loading />
                </FlexDiv>
            ) : isCarouselOpen ? (
                <Carousel images={detail?.images?.map((image) => image.url) || []} />
            ) : (
                <FlexDiv width="100%" $minHeight="100vh">
                    <DetailContainer $alignitems="start">
                        <Div width="100%" $margin="0 0 30px 0">
                            <FlexDiv $margin="50px 0 30px 0">
                                <FlexDiv width="12px" $margin="0 5px 0 0">
                                    <Img src="/images/user_grey.svg" />
                                </FlexDiv>
                                <Div>
                                    <P color="grey4" fontSize="sm">
                                        By {detail?.writerName} |
                                    </P>
                                </Div>
                                <FlexDiv width="12px" $margin="0 5px ">
                                    <Img src="/images/clock_grey.svg" />
                                </FlexDiv>
                                <Div>
                                    <P color="grey4" fontSize="sm">
                                        {formatDateMinute({ date: detail?.dateCreated || "" })}
                                    </P>
                                </Div>
                            </FlexDiv>
                            <Div>
                                <H2 fontSize="xxl" fontWeight={800}>
                                    {detail?.title}
                                </H2>
                            </Div>
                            <Div width="100%" $margin="50px 0">
                                {detail?.content && <TextViewer contents={detail?.content} />}
                            </Div>

                            {detail && detail.images && detail.images.length > 0 && (
                                <HorizonScrollDiv $margin="30px 0" width="100%">
                                    {detail.images.map((image, index) => (
                                        <Div
                                            key={`image${index}`}
                                            display="inline-block"
                                            height="100px"
                                            width="100px"
                                            $margin="0 10px 0 0"
                                            $pointer
                                            onClick={() => handleCarousel(index)}
                                        >
                                            <Img $objectFit="fill" $HFilter="opacity(50%);" src={image.url} />
                                        </Div>
                                    ))}
                                </HorizonScrollDiv>
                            )}

                            <FlexDiv width="100%">
                                {detail && detail.otherFiles && detail.otherFiles.length > 0 && (
                                    <FlexDiv width="80%" $padding="0 30px" $border="2px solid" $borderColor="border">
                                        {detail.otherFiles.map((image, index) => (
                                            <FlexDiv
                                                width="100%"
                                                $justifycontent="start"
                                                key={`otherFiles${index}`}
                                                $borderB={
                                                    detail.otherFiles && index === detail.otherFiles.length - 1
                                                        ? "0"
                                                        : `1px solid ${theme.color.border}`
                                                }
                                                $padding="20px 0"
                                            >
                                                <FlexDiv>
                                                    <Div width="16px" height="16px" $margin="0 10px 0 0">
                                                        <Img src="/images/download_grey.svg" />
                                                    </Div>
                                                </FlexDiv>
                                                <FlexDiv $pointer>
                                                    <Div onClick={() => openWindow(image.url)}>
                                                        <A
                                                            color="textColor"
                                                            fontSize="sm"
                                                            fontWeight={700}
                                                            $hoverColor="bgColorHo"
                                                        >
                                                            {image.name}
                                                        </A>
                                                    </Div>
                                                </FlexDiv>
                                            </FlexDiv>
                                        ))}
                                    </FlexDiv>
                                )}
                            </FlexDiv>
                            {detail?.writerId === userId}
                            {(detail?.writerId === userId || isAuthorizedOverVice) && (
                                <FlexDiv $margin="50px 0 0 0" width="100%" $justifycontent="end">
                                    <Button
                                        display="flex"
                                        $backgroundColor="bgColor"
                                        $margin="0 10px 0 0"
                                        $padding="12px 15px"
                                        $borderRadius={30}
                                        $HBackgroundColor="bgColorHo"
                                        onClick={() => navigate(`/board/${url}/update/${boardId}`)}
                                    >
                                        <Div width="12px" $margin="0 10px 0 0">
                                            <Img src="/images/pencil_white.svg" />
                                        </Div>
                                        <Div $pointer>
                                            <P color="wh" fontSize="sm">
                                                게시글 수정
                                            </P>
                                        </Div>
                                    </Button>
                                    <Button
                                        display="flex"
                                        $backgroundColor="red"
                                        $padding="12px 15px"
                                        $borderRadius={30}
                                        $HBackgroundColor="red"
                                        onClick={() => deleteDetail()}
                                    >
                                        <Div width="12px" $margin="0 10px 0 0">
                                            <Img src="/images/trash_white.svg" />
                                        </Div>
                                        <Div $pointer>
                                            <P color="wh" fontSize="sm">
                                                게시글 삭제
                                            </P>
                                        </Div>
                                    </Button>
                                </FlexDiv>
                            )}
                        </Div>
                        <Comment boardId={boardId} menuId={titleInfo(pathNameInfo[0], pathNameInfo[1])} />
                        <CommentInput boardId={boardId} menuId={titleInfo(pathNameInfo[0], pathNameInfo[1])} />
                    </DetailContainer>
                </FlexDiv>
            )}
        </>
    );
};

export default BoardDetail;
