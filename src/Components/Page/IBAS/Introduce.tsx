import styled from "styled-components"

import { theme } from "../../../styles/theme"

import { Div, FlexDiv } from "../../../styles/assets/Div"
import { H1 } from "../../../styles/assets/H"
import Img from "../../../styles/assets/Img"
import P from "../../../styles/assets/P"

import { useEffect, useState } from "react"
import HeaderNav from "../../Common/HeaderNav"

const IntroduceSection = styled(Div)`
    min-height: 100vh;
`

const IntroImg = styled(Img)`
    object-fit: fill;
    position: absolute;
`

const IntroDiv = styled(Div)`
    animation: fadeInUp 1s;

    @keyframes fadeInUp {
        0% {
            opacity: 0;
            transform: translate3d(0, 10%, 0);
        }
        to {
            opacity: 1;
            transform: translateZ(0);
        }
    }
`
const CareerClickP = styled(P)`
    &:hover {
        color: ${theme.color.wh};
    }
`
const Ul = styled.ul`
    max-width: 100%;
    border-left: 4px solid #7133e2;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    background: none;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    letter-spacing: 0.5px;
    position: relative;
    line-height: 1.4em;
    font-size: 1.03em;
    padding: 50px;
    list-style: none;
    text-align: left;
    font-weight: 100;
`

const Li = styled.li`
    border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
    margin-bottom: 25px;
    position: relative;
    font-size: ${theme.fontSize.xxl};
`

const Introduce = () => {
    const pageData = [
        {
            image: "career.png",
            explain: `
                다양한 분야의 지식을 기반으로 다방면의 데이터를 끌어모아 비즈니스 인사이트를 도출하는 역할을 합니다. <br/>
                이를 위해 머신러닝 모델링 보다는 SQL을 활용해 데이터를 추출&분석 후<br/>
                Tableau등을 통해 시각화 하고 분석보고서를 만드는 작업을 합니다.<br/> `,
        },
        {
            image: "data-an.png",
            explain: `
                다양한 분야의 지식을 기반으로 다방면의 데이터를 끌어모아 비즈니스 인사이트를 도출하는 역할을 합니다. 
                이를 위해 머신러닝 모델링 보다는 SQL을 활용해 데이터를 추출&분석 후
                Tableau등을 통해 시각화 하고 분석보고서를 만드는 작업을 합니다. `,
        },
        {
            image: "data-eng.png",
            explain: `
                데이터 분석을 효과적으로 수행하기 위해서는 방대한 데이터를 안전하고 효과적으로 저장하며 
                필요시 빠르게 불러낼 수 있는 시스템을 구축해야합니다. 이를 위해 프로그래밍을 이용해
                시스템을 구축하는 역할을 하며 특성상 진로를 Developer로 택한 이들이 많습니다. `,
        },
        {
            image: "data-sc.png",
            explain: `
                머신러닝,파이썬,통계 등의 다양한 방법을 활용해 대량의 데이터에서 인사이트를 뽑아낼 수 있는 사람을 의미합니다. 
                비즈니스에 여러 알고리즘을 적용,특정 업무에 맞는 모델링을 구현합니다.
                새로운 분석 모델이나 머신러닝 모델을 수정 혹은 개발하는 역할을 합니다.`,
        },
    ]

    const [page, setPage] = useState(0)

    const careerEvent = (clicked: number) => {
        setPage(clicked)
    }

    useEffect(() => {
        setPage(0)
        console.log(page)
    }, [])

    return (
        <>
            <HeaderNav />
            <IntroduceSection width="100%" height="100vh">
                <Div $position="relative" width="100%" height="100vh">
                    <IntroImg src="/images/introduce.png" />
                    <IntroDiv $zIndex={2} $position="absolute" $top="35%" $left="5%">
                        <Div width="100%" $margin="0 0 80px 0">
                            <H1 fontWeight={800} fontSize="extraBig" color="wh">
                                Big Data
                            </H1>
                        </Div>
                        <Div width="600px">
                            <P color="wh" $whiteSpace="wrap" $lineHeight={2} fontSize="xl">
                                빅데이터란 디지털 환경에서 생성되는 데이터로
                                <br />그 규모가 방대하고, 생성 주기도 짧고, 형태도 수치 데이터뿐 아니라 <br /> 문자와
                                영상 데이터를 포함하는 대규모 데이터를 말합니다.
                                <br /> 빅데이터는 과거에 비해 데이터가 폭증하였고 <br /> 데이터의 종류도 다양해져
                                사람들의 행동은 물론이고 <br /> 위치정보와 SNS를 통해 생각과 의견까지 분석하고 예측할 수
                                있습니다.
                            </P>
                        </Div>
                    </IntroDiv>
                </Div>
            </IntroduceSection>
            <IntroduceSection width="100%" height="100vh">
                <Div $position="relative" width="100%" height="100vh">
                    <IntroImg src={`/images/${pageData[page].image}`} $filter="brightness(25%)" />

                    {page === 0 && (
                        <Div $zIndex={2} $position="absolute" $top="60%" $left="5%">
                            <Div width="100%">
                                <P color="grey" fontSize="extraBig1" fontWeight={800}>
                                    Big Data
                                </P>
                                <P fontWeight={800} fontSize="extraBig" color="wh">
                                    Career
                                </P>
                            </Div>
                        </Div>
                    )}
                    {page !== 0 && (
                        <Div $zIndex={2} $position="absolute" $top="60%">
                            <Div width="100%">
                                <P fontWeight={600} color="wh" $whiteSpace="pre-wrap" fontSize="xl" $lineHeight={2}>
                                    {pageData[page].explain}
                                </P>
                            </Div>
                        </Div>
                    )}

                    <Div $zIndex={2} $position="absolute" $top="10%" $left="60%">
                        <Div width="100%">
                            <FlexDiv width="100%" $justifycontent="end">
                                <Div $pointer onClick={() => careerEvent(1)}>
                                    <CareerClickP
                                        fontWeight={800}
                                        fontSize="extraBig1"
                                        color={page === 1 ? "wh" : "grey"}
                                    >
                                        Data Analyst
                                    </CareerClickP>
                                </Div>
                            </FlexDiv>
                            <FlexDiv width="100%" $margin="30px 0" $justifycontent="end">
                                <Div $pointer onClick={() => careerEvent(2)}>
                                    <CareerClickP
                                        fontWeight={800}
                                        fontSize="extraBig1"
                                        color={page === 2 ? "wh" : "grey"}
                                    >
                                        Data Engineer
                                    </CareerClickP>
                                </Div>
                            </FlexDiv>
                            <FlexDiv width="100%" $justifycontent="end">
                                <Div $pointer onClick={() => careerEvent(3)}>
                                    <CareerClickP
                                        fontWeight={800}
                                        fontSize="extraBig1"
                                        color={page === 3 ? "wh" : "grey"}
                                    >
                                        Data Scientist
                                    </CareerClickP>
                                </Div>
                            </FlexDiv>
                        </Div>
                    </Div>
                </Div>
            </IntroduceSection>
            <IntroduceSection width="100%" height="100vh">
                <Div $position="relative" width="100%" height="100vh">
                    <IntroImg src="/images/history.jpg" />
                    <Div $zIndex={2} $position="absolute" $top="5%" $left="5%">
                        <Div width="100%">
                            <P color="wh" $letterSpacing="5px" fontSize="extraBig" fontWeight={800}>
                                HISTORY
                            </P>
                        </Div>
                        <Div $margin="10px" $padding="3px" $pointer $borderB={`1.5px solid ${theme.color.wh}`}>
                            <P color="wh" fontSize="lg">
                                동아리 연혁 추가하기
                            </P>
                        </Div>
                    </Div>
                    <Div width="80%" $zIndex={2} $position="absolute" $top="40%" $left="10%">
                        <FlexDiv width="100%" $alignitems="start">
                            <Div $padding="50px">
                                <P color="grey1" fontSize="xxl">
                                    2020
                                </P>
                            </Div>
                            <Div width="80%">
                                <Ul>
                                    <Li>
                                        1기 회원모집 시작
                                        <Div $padding="20px 0">
                                            <P color="wh">2020.10.10</P>
                                        </Div>
                                        <Div>
                                            <P color="wh" fontSize="xl" fontWeight={300}>
                                                통계학, 선형대수 특강 진행 - 김형기 교수님
                                            </P>
                                        </Div>
                                        <FlexDiv width="100%" $justifycontent="end" $margin="0 0 10px 0">
                                            <Div width="15px" $pointer>
                                                <Img src="/images/pencil_white.svg" />
                                            </Div>
                                        </FlexDiv>
                                        <FlexDiv width="100%" $justifycontent="end">
                                            <Div width="15px" $pointer>
                                                <Img src="/images/trash_white.svg" />
                                            </Div>
                                        </FlexDiv>
                                    </Li>
                                </Ul>
                            </Div>
                        </FlexDiv>
                        <FlexDiv></FlexDiv>
                    </Div>
                </Div>
            </IntroduceSection>
            <FlexDiv width="100%" height="100vh" $backgroundColor="bk">
                <Div $position="relative" width="40%" height="100vh">
                    <IntroImg src="/images/ibas_image.jpg" $filter="brightness(0.5)" />
                </Div>
                <Div width="60%" $padding="60px 30px" height="100vh">
                    <Div>
                        <P color="wh" fontSize="extraBig1" fontWeight={800} $letterSpacing="5px">
                            IBAS
                        </P>
                    </Div>
                    <Div $margin="15px 0 0 0">
                        <P color="grey" fontWeight={800} $letterSpacing="5px">
                            Inha Bigdata Analyst Society
                        </P>
                    </Div>
                    <Div $margin="30px 0 0 0">
                        <P color="wh" $letterSpacing="3px" $lineHeight={2} $whiteSpace="no-wrap">
                            안녕하세요 인하대학교 빅데이터 학술동아리 IBAS입니다. 반갑습니다.
                            <br />
                            IBAS는 4차산업 혁명 시대의 흐름에 맞추어 필요한 빅데이터 역량을 갖춘 인재를 육성해 나가자는
                            취지에서 만들어진 동아리입니다. 주로 데이터 직무(산업)에 관심있는 학생들이 모여 빅데이터
                            분석에 필요한 지식을 습득, 활용해 나가며 빅데이터 역량을 갖추고 사회에 나갈 수 있도록
                            학습하는 빅데이터 학술동아리 입니다.
                        </P>
                    </Div>
                    <Div $margin="40px 0">
                        <P color="wh" fontSize="xxxl" fontWeight={800} $letterSpacing="5px">
                            운영진
                        </P>
                    </Div>
                    <FlexDiv $justifycontent="start" width="100%" height="30vh" overflow="auto">
                        <Div $margin="0 20px 50px 0">
                            <FlexDiv width="100%">
                                <Div
                                    width="100px"
                                    height="100px"
                                    radius={100}
                                    overflow="hidden"
                                    $border="3px solid"
                                    $borderColor="wh"
                                >
                                    <Img src="/images/career.png" alt="현재 브라우저에서 지원하지 않는 형식입니다. " />
                                </Div>
                            </FlexDiv>
                            <FlexDiv width="100%" $margin="15px 0">
                                <Div>
                                    <P color="wh" fontWeight={700}>
                                        김채연
                                    </P>
                                </Div>

                                <Div>
                                    <P color="wh" fontSize="xs">
                                        (회장)
                                    </P>
                                </Div>
                            </FlexDiv>
                            <FlexDiv width="100%">
                                <Div>
                                    <P color="wh" fontSize="xs">
                                        문화컨텐츠문화경영학과
                                    </P>
                                </Div>
                                &nbsp;
                                <Div>
                                    <P color="wh" fontSize="xs">
                                        21학번
                                    </P>
                                </Div>
                            </FlexDiv>
                        </Div>
                    </FlexDiv>
                </Div>
            </FlexDiv>
        </>
    )
}

export default Introduce
