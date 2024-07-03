import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import styled from "styled-components";
import { theme } from "../../../../styles/theme";

import useFetch from "../../../../Hooks/useFetch";

import { bankDetailDataInfo, tokenAccess } from "../../../../Recoil/backState";

import { jwtDecode } from "jwt-decode";
import { GetRoleAuthorization } from "../../../../Functions/authFunctions";
import { carouselInitialState, carouselOpen, modalInfo, modalOpen, refetch } from "../../../../Recoil/frontState";
import { tokenInterface } from "../../../../Types/TypeCommon";
import Button from "../../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import { H2 } from "../../../../styles/assets/H";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";
import Carousel from "../../../Common/Carousel";
import Loading from "../../../Common/Loading";

const ScrollFlexDiv = styled(FlexDiv)`
    display: flex;
    align-items: center;
    justify-content: flex-start; /* 항목이 왼쪽으로 정렬되도록 합니다 */
    flex-direction: row;
    flex-wrap: nowrap; /* 항목이 가로로 나열되도록 설정합니다 */
    overflow-x: auto; /* 가로 스크롤 활성화 */
    overflow-y: hidden; /* 세로 스크롤 비활성화 */
    white-space: nowrap; /* 자식 요소들이 한 줄로 나열되도록 설정합니다 */

    /* 스크롤바 스타일링 */
    &::-webkit-scrollbar {
        height: 8px; /* 스크롤바의 높이 설정 */
    }

    &::-webkit-scrollbar-thumb {
        background-color: ${theme.color.grey1};
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background-color: ${(props) => props.theme.color.grey};
    }

    /* 스크롤바 트랙의 스타일을 추가할 수도 있습니다 */
    &::-webkit-scrollbar-track {
        background: ${theme.color.grey2}; /* 스크롤바 트랙의 배경색 설정 */
    }
`;

const BankSupportDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const applicationId = location.pathname.split("/")[4];
    const access = useRecoilValue(tokenAccess);

    const [isLoading, setIsLoading] = useState(true);
    const [detailData, detailDataFetch] = useFetch();
    const [deleteData, deleteDataFetch] = useFetch();
    const [statusData, fetchSetStatusData] = useFetch();
    const [hovered, setHovered] = useState(false);
    const [hovered2, setHovered2] = useState(false);
    const [detail, setDetail] = useRecoilState(bankDetailDataInfo);
    const [statusInfo, setStatusInfo] = useState("");
    const setOpen = useSetRecoilState(modalOpen);
    const setModalInfo = useSetRecoilState(modalInfo);
    const [reload, setReload] = useRecoilState(refetch);
    const [isCarouselOpen, setIsCarouselOpen] = useRecoilState(carouselOpen);
    const [carouselInitial, setCarouselInitial] = useRecoilState(carouselInitialState);

    const { isSecretary } = GetRoleAuthorization();

    let decoded;
    if (access !== "default") {
        decoded = jwtDecode(access) as tokenInterface;
    }
    const userId = decoded?.memberId;

    const movePage = () => {
        navigate(`/bank/support/update/${applicationId}`);
    };

    // Carousel을 렌더링할지 여부를 결정하는 함수
    const handleCarousel = (idx: number) => {
        setCarouselInitial(idx);

        setIsCarouselOpen(true);
    };

    const deleteDetail = () => {
        if (window.confirm("정말 철회 하시겠습니까?")) {
            setIsLoading(true);
            deleteDataFetch(`/budget/application/${applicationId}`, "DELETE", "token");
        }
    };

    const makeStatusApproved = () => {
        const statusData = { status: "APPROVED" };
        setIsLoading(true);
        fetchSetStatusData(`/budget/application/${applicationId}/status`, "PUT", "token", statusData);
        setStatusInfo("승인 완료");
        setReload(true);
    };

    const makeStatusCompeleted = () => {
        const statusData = { status: "COMPLETED" };
        setIsLoading(true);
        fetchSetStatusData(`/budget/application/${applicationId}/status`, "PUT", "token", statusData);
        setStatusInfo("지급 완료");
        setReload(true);
    };

    const openModal = () => {
        setOpen(true);
        setModalInfo({ type: "bankSupportStatus" });
    };

    useEffect(() => {
        setIsLoading(true);
        detailDataFetch(`/budget/application/${applicationId}`, "GET", "token");
        setReload(false);
    }, [access, reload]);

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
            navigate(`/bank/support`);
        }
        return () => setDetail(null);
    }, [deleteData]);

    useEffect(() => {
        if (statusData) {
            alert(`'${statusInfo}' 처리 되었습니다. `);
            setStatusInfo("");
            setIsLoading(false);
        }
    }, [statusData]);

    return (
        <>
            {isLoading ? (
                <FlexDiv width="100%" height="100vh">
                    <Loading />
                </FlexDiv>
            ) : isCarouselOpen ? (
                <Carousel images={detail?.receipts?.map((image) => image.url) || []} />
            ) : (
                <FlexDiv width="100%" $border={`1px solid ${theme.color.grey1}`}>
                    <Container>
                        <Div width="100%" $margin="0 0 30px 0">
                            <FlexDiv
                                width="100%"
                                radius={3}
                                $backgroundColor={
                                    detail?.status === "COMPLETED"
                                        ? "primary"
                                        : detail?.status === "APPROVED"
                                        ? "green"
                                        : detail?.status === "REJECTED"
                                        ? "danger"
                                        : "grey1"
                                }
                                $padding="15px 20px"
                                $margin=" 0 0 20px 0"
                            >
                                <Div>
                                    <P
                                        color={
                                            detail?.status === "COMPLETED"
                                                ? "TextPrimary"
                                                : detail?.status === "APPROVED"
                                                ? "TextGreen"
                                                : detail?.status === "REJECTED"
                                                ? "TextDanger"
                                                : "bk"
                                        }
                                    >
                                        {detail?.status === "COMPLETED"
                                            ? "지급 완료"
                                            : detail?.status === "APPROVED"
                                            ? "승인 완료"
                                            : detail?.status === "REJECTED"
                                            ? `승인 거절 (사유: ${detail.rejectReason})`
                                            : "승인 대기"}
                                    </P>
                                </Div>
                            </FlexDiv>
                            <Div
                                width="100%"
                                $border="1px solid"
                                $borderColor="border"
                                $margin=" 0 0 20px 0"
                                radius={6}
                            >
                                <FlexDiv
                                    width=" 100%"
                                    $padding="20px"
                                    $justifycontent="start"
                                    $borderB={`1px solid ${theme.color.border}`}
                                >
                                    <FlexDiv width="12px" $margin="0 5px 0 0">
                                        <Img src="/images/user_grey.svg" />
                                    </FlexDiv>
                                    <Div>
                                        <P color="grey4" fontSize="sm">
                                            By {detail?.applicantName} |
                                        </P>
                                    </Div>
                                    <FlexDiv width="12px" $margin="0 5px ">
                                        <Img src="/images/clock_grey.svg" />
                                    </FlexDiv>
                                    <Div>
                                        <P color="grey4" fontSize="sm">
                                            {detail?.dateCreated.split("T")[0]}
                                        </P>
                                    </Div>
                                </FlexDiv>
                                <Div $padding="20px">
                                    <H2 fontSize="xl" $lineHeight={1.8} fontWeight={800}>
                                        {detail?.title}
                                    </H2>
                                </Div>
                            </Div>
                            <Div
                                width="100%"
                                $border="1px solid"
                                $borderColor="border"
                                $margin=" 0 0 20px 0"
                                radius={6}
                            >
                                <FlexDiv
                                    width=" 100%"
                                    $padding="20px"
                                    $justifycontent="start"
                                    $borderB={`1px solid ${theme.color.border}`}
                                >
                                    <Div>
                                        <P fontWeight={600}>지출날짜</P>
                                    </Div>
                                </FlexDiv>
                                <Div $padding="20px">
                                    <P $lineHeight={1.5}>{detail?.dateUsed.split("T")[0]}</P>
                                </Div>
                            </Div>

                            <Div
                                width="100%"
                                $border="1px solid"
                                $borderColor="border"
                                $margin=" 0 0 20px 0"
                                radius={6}
                            >
                                <FlexDiv
                                    width=" 100%"
                                    $padding="20px"
                                    $justifycontent="start"
                                    $borderB={`1px solid ${theme.color.border}`}
                                >
                                    <Div>
                                        <P fontWeight={600}>지출내용</P>
                                    </Div>
                                </FlexDiv>
                                <Div $padding="20px">
                                    <P $whiteSpace="pre-wrap" $lineHeight={1.5}>
                                        {detail?.details}
                                    </P>
                                </Div>
                            </Div>

                            <Div
                                width="100%"
                                $border="1px solid"
                                $borderColor="border"
                                $margin=" 0 0 20px 0"
                                radius={6}
                            >
                                <FlexDiv
                                    width=" 100%"
                                    $padding="20px"
                                    $justifycontent="start"
                                    $borderB={`1px solid ${theme.color.border}`}
                                >
                                    <Div>
                                        <P fontWeight={600}>지출금액</P>
                                    </Div>
                                </FlexDiv>
                                <Div $padding="20px">
                                    <P $lineHeight={1.5}>{detail?.outcome}</P>
                                </Div>
                            </Div>

                            <Div
                                width="100%"
                                $border="1px solid"
                                $borderColor="border"
                                $margin=" 0 0 20px 0"
                                radius={6}
                            >
                                <FlexDiv
                                    width=" 100%"
                                    $padding="20px"
                                    $justifycontent="start"
                                    $borderB={`1px solid ${theme.color.border}`}
                                >
                                    <Div>
                                        <P fontWeight={600}>사용인</P>
                                    </Div>
                                </FlexDiv>
                                <Div $padding="20px">
                                    <P $lineHeight={1.5}>{detail?.applicantName}</P>
                                </Div>
                            </Div>
                            <Div
                                width="100%"
                                $border="1px solid"
                                $borderColor="border"
                                $margin=" 0 0 20px 0"
                                radius={6}
                            >
                                <FlexDiv
                                    width=" 100%"
                                    $padding="20px"
                                    $justifycontent="start"
                                    $borderB={`1px solid ${theme.color.border}`}
                                >
                                    <Div>
                                        <P fontWeight={600}>입금받을 계좌</P>
                                    </Div>
                                </FlexDiv>
                                <Div $padding="20px">
                                    <P $lineHeight={1.5}>{detail?.account}</P>
                                </Div>
                            </Div>

                            <Div
                                width="100%"
                                $border="1px solid"
                                $borderColor="border"
                                $margin=" 0 0 20px 0"
                                radius={6}
                            >
                                <FlexDiv
                                    width=" 100%"
                                    $padding="20px"
                                    $justifycontent="start"
                                    $borderB={`1px solid ${theme.color.border}`}
                                >
                                    <Div>
                                        <P fontWeight={600}>증빙자료</P>
                                    </Div>
                                </FlexDiv>
                                <ScrollFlexDiv width="100%" $padding="20px">
                                    {detail?.receipts.map((image, idx) => (
                                        <Div
                                            key={`supportImage${idx}`}
                                            $pointer
                                            $margin="0 30px 0 0"
                                            onClick={() => handleCarousel(idx)}
                                        >
                                            <Div width="190px" height="190px">
                                                <Img src={image.url} alt={`supportImage${idx}`} />
                                            </Div>
                                        </Div>
                                    ))}
                                </ScrollFlexDiv>
                            </Div>
                        </Div>
                        {detail?.applicantId === userId && (
                            <FlexDiv width="100%" $justifycontent="end">
                                <Button
                                    display="flex"
                                    $backgroundColor="bgColor"
                                    $margin="0 10px 0 0"
                                    $padding="12px 15px"
                                    $borderRadius={30}
                                    $HBackgroundColor="bgColorHo"
                                    onClick={() => movePage()}
                                >
                                    <Div width="12px" $margin="0 10px 0 0">
                                        <Img src="/images/pencil_white.svg" />
                                    </Div>
                                    <Div $pointer>
                                        <P color="wh" fontSize="sm">
                                            지원신청 수정
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
                                            지원신청 철회
                                        </P>
                                    </Div>
                                </Button>
                            </FlexDiv>
                        )}
                        {isSecretary && detail?.status === "PENDING" && (
                            <FlexDiv width="100%">
                                <Button
                                    width="300px"
                                    $HBackgroundColor="success"
                                    $padding="15px 20px"
                                    $margin="0 20px 0 0"
                                    $borderRadius={4}
                                    border={`1px solid ${theme.color.success}`}
                                    onMouseEnter={() => setHovered(true)}
                                    onMouseLeave={() => setHovered(false)}
                                    onClick={() => makeStatusApproved()}
                                >
                                    <FlexDiv width="100%">
                                        <Div>
                                            <P color={hovered ? "wh" : "success"} fontWeight={700}>
                                                승인 완료
                                            </P>
                                        </Div>
                                    </FlexDiv>
                                </Button>
                                <Button
                                    width="300px"
                                    $HBackgroundColor="red"
                                    $padding="15px 20px"
                                    $borderRadius={4}
                                    border={`1px solid ${theme.color.red}`}
                                    onMouseEnter={() => setHovered2(true)}
                                    onMouseLeave={() => setHovered2(false)}
                                    onClick={() => openModal()}
                                >
                                    <FlexDiv width="100%">
                                        <Div>
                                            <P color={hovered2 ? "wh" : "red"} fontWeight={700}>
                                                승인 거절
                                            </P>
                                        </Div>
                                    </FlexDiv>
                                </Button>
                            </FlexDiv>
                        )}
                        {isSecretary && detail?.status === "APPROVED" && (
                            <FlexDiv width="100%">
                                <Button
                                    width="300px"
                                    $HBackgroundColor="blue"
                                    $padding="15px 20px"
                                    $margin="0 20px 0 0"
                                    $borderRadius={4}
                                    border={`1px solid ${theme.color.blue}`}
                                    onMouseEnter={() => setHovered(true)}
                                    onMouseLeave={() => setHovered(false)}
                                    onClick={() => makeStatusCompeleted()}
                                >
                                    <FlexDiv width="100%">
                                        <Div>
                                            <P color={hovered ? "wh" : "blue"} fontWeight={700}>
                                                지급 완료
                                            </P>
                                        </Div>
                                    </FlexDiv>
                                </Button>
                            </FlexDiv>
                        )}
                    </Container>
                </FlexDiv>
            )}
        </>
    );
};

export default BankSupportDetail;
