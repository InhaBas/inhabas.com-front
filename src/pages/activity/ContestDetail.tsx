import { jwtDecode } from "jwt-decode";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { media, theme } from "../../styles/theme";

import { tokenAccess } from "../../recoil/backState";
import { carouselInitialState, carouselOpen } from "../../recoil/frontState";

import { GetRoleAuthorization } from "../../functions/authFunctions";
import useFetch from "../../hooks/useFetch";
import { tokenInterface } from "../../types/TypeCommon";

import Carousel from "../../components/common/Carousel";
import CommentInput from "../../components/common/CommentInput";
import CommentList from "../../components/common/CommentList";

import styled from "styled-components";
import A from "../../styles/assets/A";
import Button from "../../styles/assets/Button";
import { Div, FlexDiv } from "../../styles/assets/Div";
import { H2 } from "../../styles/assets/H";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";
import Loading from "../../components/common/Loading";
import TextViewer from "../../components/common/TextViewer";

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

const ContestDetailContent = styled(Div)`
    width: 800px;
    max-width: 800px;
    margin: 50px 0 100px;
    overflow-wrap: anywhere;

    &,
    * {
        box-sizing: border-box;
    }

    ${media.tablet} {
        width: calc(100% - 48px);
        max-width: calc(100% - 48px);
    }

    ${media.mobile} {
        width: 100%;
        max-width: 100%;
        padding: 0 16px;
        margin: 24px 0 64px;
    }
`;

const DetailMeta = styled(FlexDiv)`
    justify-content: flex-start;
    row-gap: 6px;
`;

const DetailTitle = styled(H2)`
    overflow-wrap: anywhere;
`;

const DetailInfo = styled(FlexDiv)`
    justify-content: flex-start;
    row-gap: 6px;
`;

const TopicContent = styled(FlexDiv)`
    box-sizing: border-box;

    ${media.mobile} {
        padding: 24px;
    }

    p {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        overflow-wrap: anywhere;
    }
`;

const ContentImage = styled.div`
    width: 60%;
    max-width: 100%;

    img {
        height: auto;
        object-fit: contain;
    }

    ${media.mobile} {
        width: 100%;
    }
`;

const FileList = styled.div`
    width: 80%;
    padding: 0 30px;
    border: 2px solid ${({ theme }) => theme.color.border};

    a {
        min-width: 0;
        white-space: normal;
        overflow-wrap: anywhere;
    }

    ${media.mobile} {
        width: 100%;
        padding: 0 16px;
    }
`;

const FileRow = styled(FlexDiv)`
    min-width: 0;

    > :last-child {
        min-width: 0;
    }
`;

const DetailActions = styled(FlexDiv)`
    gap: 10px;

    button {
        margin: 0;
    }

    ${media.mobile} {
        justify-content: flex-start;
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
        detailDataFetch(`/contest/${url}/${boardId}`, "GET");
    }, [url]);

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
                <ContestDetailContent direction="column">
                    {/* 작성 info */}
                    <DetailMeta $margin="50px 0 30px 0">
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
                    </DetailMeta>

                    {/* 게시글 title */}
                    <Div>
                        <DetailTitle fontSize="xxl" fontWeight={800}>
                            {detail?.title}
                        </DetailTitle>
                    </Div>

                    {/* 주최기관, 개최기간 */}
                    <DetailInfo $padding="20px 0 40px 0" width="100%" $justifycontent="flex-start">
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
                    </DetailInfo>

                    {/* 주제 */}
                    <FlexDiv width="100%" $borderT={`1px solid ${theme.color.border}`} $padding="15px">
                        <Div>
                            {url === "contest" && (
                                <P fontSize="lg" fontWeight={600}>
                                    공모전 주제
                                </P>
                            )}
                            {url === "activity" && (
                                <P fontSize="lg" fontWeight={800}>
                                    대외활동 주제
                                </P>
                            )}
                        </Div>
                    </FlexDiv>
                    <TopicContent
                        width="100%"
                        $borderT={`1px solid ${theme.color.border}`}
                        $borderB={`1px solid ${theme.color.border}`}
                        $padding="50px"
                    >
                        <Div width="100%">
                            <P fontSize="lg" $whiteSpace="normal" $center>
                                {detail?.topic}
                            </P>
                        </Div>
                    </TopicContent>

                    {/* 사진들 */}
                    {detail?.images?.map((image) => (
                        <FlexDiv width="100%" $margin="50px 0">
                            <ContentImage>
                                <Img src={image.url} />
                            </ContentImage>
                        </FlexDiv>
                    ))}

                    <Div width="100%" $margin="0 0 20px 0" wrap="break-word" $whiteSpace="pre-wrap">
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
                            <FileList>
                                {detail.otherFiles.map((file, index) => (
                                    <FileRow
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
                                    </FileRow>
                                ))}
                            </FileList>
                        )}
                    </FlexDiv>

                    {/* // api에 writerId 포함되면 수정 */}

                    <DetailActions $margin="50px 0 20px 0" width="100%" $justifycontent="end">
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
                    </DetailActions>
                    <CommentList boardId={boardId} menuId={menuId} token={false} />
                    {isAuthorizedOverDeactivate && (
                        <>
                            <CommentInput boardId={boardId} menuId={menuId} />
                        </>
                    )}
                </ContestDetailContent>
            )}
        </>
    );
};

export default ContestDetail;
