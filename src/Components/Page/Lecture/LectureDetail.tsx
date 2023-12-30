import { theme } from "../../../styles/theme"

import Button from "../../../styles/assets/Button"
import { Container, Div, FlexDiv } from "../../../styles/assets/Div"
import { H2 } from "../../../styles/assets/H"
import Img from "../../../styles/assets/Img"
import P from "../../../styles/assets/P"

import { useNavigate } from "react-router-dom"
import { styled } from "styled-components"
import HeaderTitle from "../../Common/HeaderTitle"

const MoveBtn = styled(Button)`
    color: ${theme.color.blue};
    font-size: ${theme.fontSize.lg};
    font-weight: 700;

    &:hover {
        background-color: ${theme.color.blue};
        color: ${theme.color.wh};
    }
`

const LectureDetail = () => {
    const navigate = useNavigate()

    const movePage = () => {
        navigate("/lecture/room")
    }

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
                            <P color="TextGreen">승인완료</P>
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
                                R을 이용한 간단한 데이터 분석
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
                                <P fontWeight={600}>강의 소개</P>
                            </Div>
                        </FlexDiv>
                        <Div $padding="20px">
                            <P $lineHeight={1.5}>
                                R studio의 기능과 문법, tidyverse의 패키지를 배우고 iris, titanic, gapminder 등과 같은
                                데이터를 활용한 간단한 분석까지를 목표로 합니다.
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
                                <P fontWeight={600}>강의 설명</P>
                            </Div>
                        </FlexDiv>
                        <Div $padding="20px">
                            <P $whiteSpace="pre-wrap" $lineHeight={1.5}>
                                R studio의 기능과 문법, tidyverse의 패키지를 배우고 iris, titanic, gapminder 등과 같은
                                데이터를 활용한 간단한 분석까지를 목표로 합니다. 매 주 금요일 오후 4~6시에 진행할
                                예정이며, 강의 녹화본을 따로 올려드리겠습니다.
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
                                <P fontWeight={600}>강의 요일</P>
                            </Div>
                        </FlexDiv>
                        <Div $padding="20px">
                            <P $lineHeight={1.5}>금</P>
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
                                <P fontWeight={600}>신청 현황</P>
                            </Div>
                        </FlexDiv>
                        <Div $padding="20px">
                            <P $lineHeight={1.5}>7 / 30</P>
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
                                <P fontWeight={600}>강의 방식</P>
                            </Div>
                        </FlexDiv>
                        <Div $padding="20px">
                            <P $lineHeight={1.5}>ZOOM</P>
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
                                <P fontWeight={600}>참고 링크</P>
                            </Div>
                        </FlexDiv>
                        <Div $padding="20px">
                            <P $lineHeight={1.5}>https://zoom.us/j/7672419454?pwd=enBkMkpwZDVDbm1DamxtbmtrRVh2QT09</P>
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
                                <P fontWeight={600}>대표자 이름</P>
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
                                <P fontWeight={600}>대표자 전화번호</P>
                            </Div>
                        </FlexDiv>
                        <Div $padding="20px">
                            <P $lineHeight={1.5}>010-3398-8604</P>
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
                                <P fontWeight={600}>대표자 이메일</P>
                            </Div>
                        </FlexDiv>
                        <Div $padding="20px">
                            <P $lineHeight={1.5}>yyyyyyyyy@naver.com</P>
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
                                <P fontWeight={600}>강의 신청 마감일</P>
                            </Div>
                        </FlexDiv>
                        <Div $padding="20px">
                            <P $lineHeight={1.5}>2022-03-23</P>
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
                    >
                        <Div width="12px" $margin="0 10px 0 0">
                            <Img src="/images/pencil_white.svg" />
                        </Div>
                        <Div $pointer>
                            <P color="wh" fontSize="sm">
                                강의 수정
                            </P>
                        </Div>
                    </Button>
                    <Button display="flex" $backgroundColor="red" $padding="12px 15px" $borderRadius={30}>
                        <Div width="12px" $margin="0 10px 0 0">
                            <Img src="/images/trash_white.svg" />
                        </Div>
                        <Div $pointer>
                            <P color="wh" fontSize="sm">
                                강의 삭제
                            </P>
                        </Div>
                    </Button>
                </FlexDiv>
                <FlexDiv width="100%">
                    <MoveBtn
                        onClick={() => movePage()}
                        $padding="12px 24px"
                        $borderRadius={6}
                        border={`1px solid ${theme.color.blue}`}
                    >
                        강의실로 이동하기
                    </MoveBtn>
                </FlexDiv>
            </Container>
        </FlexDiv>
    )
}

export default LectureDetail
