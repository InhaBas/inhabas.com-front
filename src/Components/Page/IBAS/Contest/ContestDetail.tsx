import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { theme } from "../../../../styles/theme";

import { tokenAccess } from "../../../../Recoil/backState";
import { carouselInitialState, carouselOpen } from "../../../../Recoil/frontState";

import { GetRoleAuthorization } from "../../../../Functions/authFunctions";
import useFetch from "../../../../Hooks/useFetch";
import { tokenInterface } from "../../../../Types/TypeCommon";

import Carousel from "../../../Common/Carousel";
import CommentInput from "../../../Common/CommentInput";
import CommentList from "../../../Common/CommentList";

import styled from "styled-components";
import A from "../../../../styles/assets/A";
import Button from "../../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import { H2 } from "../../../../styles/assets/H";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";
import Loading from "../../../Common/Loading";

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
        background-color: ${(props) => props.theme.color.grey}; /* 스크롤바 썸의 호버 색상을 지정하세요 */
    }
`;

interface ContestDetailType {
    id: number;
    contestFieldId: number;
    title: string;
    content: string;
    writerName: string;
    writerId: number;
    association: string;
    topic: string;
    thumbnail: {
        id: string;
        name: string;
        url: string;
        size: number;
        type: string;
    };
    images: {
        id: string;
        name: string;
        url: string;
        size: number;
        type: string;
    }[];
    otherFiles: any[]; // 이 부분은 다른 파일의 구조를 알 수 없으므로 any로 지정했습니다.
    dateContestStart: string;
    dateContestEnd: string;
    dateCreated: string;
    dateUpdated: string;
}

const ContestDetail = () => {
    const location = useLocation();
    const url = location.pathname.split("/")[2];
    const boardId = location.pathname.split("/")[4];
    const [detailData, detailDataFetch] = useFetch();
    const [detail, setDetail] = useState<ContestDetailType | null>(null);
    const menuId = url === "contest" ? 18 : 19;
    const access = useRecoilValue(tokenAccess);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const [isCarouselOpen, setIsCarouselOpen] = useRecoilState(carouselOpen);
    const [carouselInitial, setCarouselInitial] = useRecoilState(carouselInitialState);

    const [deleteData, deleteDataFetch] = useFetch();

    const { isAuthorizedOverVice, isAuthorizedOverDeactivate } = GetRoleAuthorization();

    let decoded;
    if (access !== "default") {
        decoded = jwtDecode(access) as tokenInterface;
    }

    const userId = decoded?.memberId;

    const deleteDetail = () => {
        if (window.confirm("정말 삭제 하시겠습니까?")) {
            deleteDataFetch(`/contest/${url}/${boardId}`, "DELETE", "token");
            setIsLoading(true);
        }
    };

    const handleCarousel = (idx: number) => {
        setCarouselInitial(idx);
        setIsCarouselOpen(true);
    };

    const onClickFileLink = useCallback((srcUrl: string, name: string) => {
        fetch(srcUrl, { method: "GET" })
            .then((res) => res.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = name;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    window.URL.revokeObjectURL(url);
                }, 1000);
                a.remove();
            })
            .catch((err) => {
                console.error("err", err);
            });
    }, []);

    useEffect(() => {
        setIsLoading(true);
        console.log(22);
        detailDataFetch(`/contest/${url}/${boardId}`, "GET");
    }, [url]);

    useEffect(() => {
        if (detailData) {
            setDetail(detailData);
            console.log(33);
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
                <Div width="800px" $margin="50px 0 100px 0" direction="column">
                    {/* 작성 info */}
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
                            <Img src="/images/calendar_grey.svg" />
                        </FlexDiv>
                        <FlexDiv>
                            <P color="grey4" fontSize="sm">
                                {detail?.dateCreated.split("T")[0]} {detail?.dateCreated.split("T")[1]}
                            </P>
                        </FlexDiv>
                    </FlexDiv>

                    {/* 게시글 title */}
                    <Div>
                        <H2 fontSize="xxl" fontWeight={800}>
                            {detail?.title}
                        </H2>
                    </Div>

                    {/* 주최기관, 개최기간 */}
                    <FlexDiv $padding="20px 0 40px 0" width="100%" $justifycontent="flex-start">
                        <FlexDiv $margin="0 5px 0 0" width="12px">
                            <Img src="/images/building_grey.svg" />
                        </FlexDiv>
                        <FlexDiv $margin="0 5px 0 0">
                            <P color="grey4" fontSize="sm">
                                {" "}
                                {detail?.association} |
                            </P>
                        </FlexDiv>
                        <FlexDiv $margin="0 5px 0 0" width="12px">
                            <Img src="/images/calendar_grey.svg" />
                        </FlexDiv>
                        <FlexDiv>
                            <P color="grey4" fontSize="sm">
                                {detail?.dateContestStart.split("T")[0]} ~ {detail?.dateContestEnd.split("T")[0]}
                            </P>
                        </FlexDiv>
                    </FlexDiv>

                    {/* 주제 */}
                    <FlexDiv width="100%" $borderT={`2px solid ${theme.color.border}`} $padding="20px">
                        <Div>
                            {url === "contest" && (
                                <P fontSize="xl" fontWeight={800}>
                                    공모전 주제
                                </P>
                            )}
                            {url === "activity" && (
                                <P fontSize="xl" fontWeight={800}>
                                    대외활동 주제
                                </P>
                            )}
                        </Div>
                    </FlexDiv>
                    <FlexDiv
                        width="100%"
                        $borderT={`2px solid ${theme.color.border}`}
                        $borderB={`2px solid ${theme.color.border}`}
                        $padding="50px"
                    >
                        <Div>
                            <P fontSize="xl">{detail?.topic}</P>
                        </Div>
                    </FlexDiv>

                    {/* 사진들 */}
                    {detail?.images?.map((image) => (
                        <FlexDiv width="100%" $margin="50px 0">
                            <Div width="60%">
                                <Img src={image.url} />
                            </Div>
                        </FlexDiv>
                    ))}

                    <Div $margin="0 0 20px 0">
                        <P>{detail?.content}</P>
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
                                {detail.otherFiles.map((file, index) => (
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
                                            <Div onClick={() => onClickFileLink(file.url, file.name)}>
                                                <A
                                                    color="textColor"
                                                    fontSize="sm"
                                                    fontWeight={700}
                                                    $hoverColor="bgColorHo"
                                                >
                                                    {file.name}
                                                </A>
                                            </Div>
                                        </FlexDiv>
                                    </FlexDiv>
                                ))}
                            </FlexDiv>
                        )}
                    </FlexDiv>

                    {/* // api에 writerId 포함되면 수정 */}

                    <FlexDiv $margin="50px 0 20px 0" width="100%" $justifycontent="end">
                        {detail?.writerId === userId && (
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
                        )}
                        {(detail?.writerId === userId || isAuthorizedOverVice) && (
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
                        )}
                    </FlexDiv>
                    <CommentList boardId={boardId} menuId={menuId} token={false} />
                    {isAuthorizedOverDeactivate && (
                        <>
                            <CommentInput boardId={boardId} menuId={menuId} />
                        </>
                    )}
                </Div>
            )}
        </>
    );
};

export default ContestDetail;
