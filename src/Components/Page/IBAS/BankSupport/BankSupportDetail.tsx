import { theme } from "../../../../styles/theme";

import Button from "../../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import { H2 } from "../../../../styles/assets/H";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import HeaderTitle from "../../../Common/HeaderTitle";

const MoveBtn = styled(Button)`
    color: ${theme.color.blue};
    font-size: ${theme.fontSize.lg};
    font-weight: 700;

    &:hover {
        background-color: ${theme.color.blue};
        color: ${theme.color.wh};
    }
`;

const BankSupportDetail = () => {
    const navigate = useNavigate();

    const movePage = () => {
        navigate("/lecture/room");
    };

    return (
        <FlexDiv width="100%" $border={`1px solid ${theme.color.grey1}`}>
            <HeaderTitle />
            <Container>
                <Div width="100%" $margin="0 0 30px 0">
                    <FlexDiv
                        width="100%"
                        radius={3}
                        $backgroundColor="green"
                        $padding="15px 20px"
                        $margin=" 0 0 20px 0"
                    >
                        <Div>
                            <P color="TextGreen">승인 완료</P>
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
                                    By 윤예진 |
                                </P>
                            </Div>
                            <FlexDiv width="12px" $margin="0 5px ">
                                <Img src="/images/clock_grey.svg" />
                            </FlexDiv>
                            <Div>
                                <P color="grey4" fontSize="sm">
                                    2022-04-03 17:02
                                </P>
                            </Div>
                        </FlexDiv>
                        <Div $padding="20px">
                            <H2 fontSize="xl" $lineHeight={1.8} fontWeight={800}>
                                지출내용
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
                            <P $lineHeight={1.5}>2022-02-02</P>
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
                                지출내용은 이렇습니다
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
                            <P $lineHeight={1.5}>111222</P>
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
                            <P $lineHeight={1.5}>윤예진</P>
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
                            <P $lineHeight={1.5}>3333-3333-3333-3</P>
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
                                <P fontWeight={600}>대표이미지</P>
                            </Div>
                        </FlexDiv>
                        <Div $padding="20px">
                            <Div width="190px" height="190px">
                                <Img src="/images/board-name-img.jpg" />
                            </Div>
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
