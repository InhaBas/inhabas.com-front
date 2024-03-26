import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { theme } from "../../../../styles/theme";

import useFetch from "../../../../Hooks/useFetch";

import { bankDetailDataInfo, tokenAccess } from "../../../../Recoil/backState";

import Button from "../../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import { H2 } from "../../../../styles/assets/H";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

const BankSupportDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const applicationId = location.pathname.split("/")[4];
    const access = useRecoilValue(tokenAccess);

    const [isLoading, setIsLoading] = useState(true);
    const [detailData, detailDataFetch] = useFetch();
    const [deleteData, deleteDataFetch] = useFetch();
    const [detail, setDetail] = useRecoilState(bankDetailDataInfo);

    const deleteDetail = () => {
        if (window.confirm("정말 철회 하시겠습니까?")) {
            setIsLoading(true);
            deleteDataFetch(`/budget/application/${applicationId}`, "DELETE", "token");
        }
    };

    useEffect(() => {
        setIsLoading(true);
        detailDataFetch(`/budget/application/${applicationId}`, "GET", "token");
    }, [access]);

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

    return (
        <FlexDiv width="100%" $border={`1px solid ${theme.color.grey1}`}>
            <Container>
                <Div width="100%" $margin="0 0 30px 0">
                    <FlexDiv
                        width="100%"
                        radius={3}
                        $backgroundColor={
                            detail?.status === "COMPLETED"
                                ? "grey1"
                                : detail?.status === "APPROVED"
                                ? "green"
                                : detail?.status === "REJECTED"
                                ? "red"
                                : "grey1"
                        }
                        $padding="15px 20px"
                        $margin=" 0 0 20px 0"
                    >
                        <Div>
                            <P
                                color={
                                    detail?.status === "COMPLETED"
                                        ? "bk"
                                        : detail?.status === "APPROVED"
                                        ? "TextGreen"
                                        : detail?.status === "REJECTED"
                                        ? "bk"
                                        : "bk"
                                }
                            >
                                {detail?.status === "COMPLETED"
                                    ? "처리 완료"
                                    : detail?.status === "APPROVED"
                                    ? "승인 완료"
                                    : detail?.status === "REJECTED"
                                    ? `승인 거절 (사유: ${detail.rejectReason})`
                                    : "승인 대기"}
                            </P>
                        </Div>
                    </FlexDiv>
                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
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
                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
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

                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
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

                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
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

                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
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
                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
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

                    <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
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
                        <Div $padding="20px">
                            {detail?.receipts.map((image, idx) => (
                                <Div
                                    key={`supportImage${idx}`}
                                    width="190px"
                                    height="190px"
                                    $pointer
                                    onClick={() => window.open(image.url)}
                                >
                                    <Img src={image.url} $HFilter="brightness(50%)" />
                                </Div>
                            ))}
                        </Div>
                    </Div>
                </Div>
                <FlexDiv width="100%" $justifycontent="end">
                    <Button
                        display="flex"
                        $backgroundColor="bgColor"
                        $margin="0 10px 0 0"
                        $padding="12px 15px"
                        $borderRadius={30}
                        $HBackgroundColor="bgColorHo"
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
            </Container>
        </FlexDiv>
    );
};

export default BankSupportDetail;
