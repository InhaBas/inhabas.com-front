import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "../../../../styles/assets/Button";
import { DetailContainer, Div, FlexDiv } from "../../../../styles/assets/Div";
import { H2 } from "../../../../styles/assets/H";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";
import A from "../../../../styles/assets/A";
import { theme } from "../../../../styles/theme";

import Carousel from "../../../Common/Carousel";
import CommentInput from "../../../Common/CommentInput";
import CommentList from "../../../Common/CommentList";

import useFetch from "../../../../Hooks/useFetch";

import { ActivityDetailInterface } from "../../../../Types/IBAS/TypeIBAS";

import { useRecoilState, useRecoilValue } from "recoil";
import { tokenAccess } from "../../../../Recoil/backState";
import { carouselInitialState, carouselOpen } from "../../../../Recoil/frontState";

import { GetRoleAuthorization } from "../../../../Functions/authFunctions";
import { tokenInterface } from "../../../../Types/TypeCommon";

const ActivityDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const boardId = location.pathname.split("/")[3];
    const [detail, setDetail] = useState<ActivityDetailInterface | null>(null);
    const [detailData, detailDataFetch] = useFetch();
    const menuId = 2;
    const [isCarouselOpen, setIsCarouselOpen] = useRecoilState(carouselOpen);
    const [carouselInitial, setCarouselInitial] = useRecoilState(carouselInitialState);
    const [deleteData, deleteDataFetch] = useFetch();
    const access = useRecoilValue(tokenAccess);
    const { isAuthorizedOverVice, isAuthorizedOverDeactivate } = GetRoleAuthorization();

    const openWindow = (url: string) => {
        window.open(url);
    };

    let decoded;
    if (access !== "default") {
        decoded = jwtDecode(access) as tokenInterface;
    }
    const userId = decoded?.memberId;

    const handleCarousel = (idx: number) => {
        setCarouselInitial(idx);

        setIsCarouselOpen(true);
    };

    useEffect(() => {
        detailDataFetch(`/club/activity/${boardId}`, "GET");
    }, []);

    useEffect(() => {
        if (detailData) {
            setDetail(detailData);
        }
        return () => {
            setDetail(null);
            setIsCarouselOpen(false);
        };
    }, [detailData]);

    const deleteDetail = () => {
        if (window.confirm("정말 삭제 하시겠습니까?")) {
            deleteDataFetch(`/club/activity/${boardId}`, "DELETE", "token");
        }
    };

    useEffect(() => {
        if (deleteData) {
            alert("게시글이 삭제 되었습니다");
            navigate(`/activity`);
        }
        return () => setDetail(null);
    }, [deleteData]);

    return (
        <>
            {isCarouselOpen ? (
                <Carousel images={detail?.images?.map((image) => image.url) || []} />
            ) : (
                <FlexDiv width="100%">
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
                                        {detail?.dateCreated.split("T")[0]} {detail?.dateCreated.split("T")[1]}
                                    </P>
                                </Div>
                            </FlexDiv>
                            <Div>
                                <H2 fontSize="xxl" fontWeight={800}>
                                    {detail?.title}
                                </H2>
                            </Div>
                            <Div $margin="50px 0 ">
                                <P $whiteSpace="pre-wrap" $lineHeight={1.5}>
                                    {detail?.content}
                                </P>
                            </Div>

                            <FlexDiv>
                                {detail?.images?.slice(0, 3)?.map(({ url }, idx) => (
                                    <Button onClick={() => handleCarousel(idx)}>
                                        <Div width="200px" height="200px" $pointer>
                                            <Img src={url} $HFilter="brightness(80%)" />
                                        </Div>
                                    </Button>
                                ))}
                                {detail && detail.images.length > 3 ? (
                                    <Div
                                        $pointer
                                        $position="relative"
                                        $HFilter="brightness(2)"
                                        onClick={() => handleCarousel(0)}
                                    >
                                        <Div width="200px" height="200px" $backgroundColor="bklayer">
                                            <Img src={detail.images[3].url} $filter="brightness(10%)" />
                                        </Div>
                                        <FlexDiv $position="absolute" $top="0" width="200px" height="200px">
                                            <Div>
                                                <P color="wh">이미지 더보기</P>
                                            </Div>
                                        </FlexDiv>
                                    </Div>
                                ) : (
                                    ""
                                )}
                            </FlexDiv>

                            <FlexDiv width="100%" $margin="50px 0 0 0">
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


                            <FlexDiv $margin="50px 0 0 0" width="100%" $justifycontent="end">
                                {detail?.writerId === userId && (
                                    <Button
                                        display="flex"
                                        $backgroundColor="bgColor"
                                        $HBackgroundColor="bgColorHo"
                                        $margin="0 10px 0 0"
                                        $padding="12px 15px"
                                        $borderRadius={30}
                                        onClick={() => navigate(`/activity/update/${boardId}`)}
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
                                {(isAuthorizedOverVice || detail?.writerId === userId) && (
                                    <Button
                                        display="flex"
                                        $backgroundColor="red"
                                        $HBackgroundColor="red"
                                        $padding="12px 15px"
                                        $borderRadius={30}
                                        onClick={deleteDetail}
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
                        </Div>

                        <CommentList boardId={boardId} menuId={menuId} token={false} />
                        {
                            isAuthorizedOverDeactivate && (
                                <CommentInput boardId={boardId} menuId={menuId} />
                            )
                        }
                    </DetailContainer>
                </FlexDiv>
            )}
        </>
    );
};

export default ActivityDetail;
