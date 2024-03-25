import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";

import { theme } from "../../../styles/theme";

import { boardDetailData, tokenAccess } from "../../../Recoil/backState";

import useFetch from "../../../Hooks/useFetch";

import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "@toast-ui/editor/dist/toastui-editor.css";

import { DateFunction } from "../../../Functions/dateFunction";
import { tokenInterface } from "../../../Types/TypeCommon";
import A from "../../../styles/assets/A";
import Button from "../../../styles/assets/Button";
import { DetailContainer, Div, FlexDiv } from "../../../styles/assets/Div";
import { H2 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";
import Loading from "../../Common/Loading";
import TextViewer from "../../Common/TextViewer";

const HorizonScrollDiv = styled(Div)`
    white-space: nowrap;
    overflow-x: scroll;
`;

const BoardDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const url = location.pathname.split("/")[2];
    const boardId = location.pathname.split("/")[4];

    const { formatDateMinute } = DateFunction();

    const [detail, setDetail] = useRecoilState(boardDetailData);
    const [detailData, detailDataFetch] = useFetch();
    const [deleteData, deleteDataFetch] = useFetch();
    const [isLoading, setIsLoading] = useState(true);
    const access = useRecoilValue(tokenAccess);

    const decoded = jwtDecode(access) as tokenInterface;
    const userId = decoded.memberId;

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

    const openWindow = (url: string) => {
        window.open(url);
    };

    const deleteDetail = () => {
        if (window.confirm("정말 삭제 하시겠습니까?")) {
            setIsLoading(true);
            deleteDataFetch(`${fetchUrl}/${boardId}`, "DELETE", "token");
        }
    };

    useEffect(() => {
        setIsLoading(true);
        detailDataFetch(`${fetchUrl}/${boardId}`, "GET", "token");
    }, [access, url]);

    useEffect(() => {
        if (detailData) {
            setDetail(detailData);
            setIsLoading(false);
        }
        return () => setDetail(null);
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
                <Loading />
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
                                <HorizonScrollDiv $margin="30px 0">
                                    {detail.images.map((image, index) => (
                                        <Div
                                            key={`image${index}`}
                                            display="inline-block"
                                            height="100px"
                                            width="100px"
                                            $margin="0 10px 0 0"
                                            $pointer
                                            onClick={() => openWindow(image.url)}
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
                            {detail?.writerId === userId && (
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
                    </DetailContainer>
                </FlexDiv>
            )}
        </>
    );
};

export default BoardDetail;
