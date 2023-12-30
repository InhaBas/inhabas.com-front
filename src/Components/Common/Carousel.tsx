import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"

import Slider from "react-slick"
import styled from "styled-components"

import { useNavigate } from "react-router-dom"
import { Div, FlexDiv } from "../../styles/assets/Div"
import Img from "../../styles/assets/Img"
import P from "../../styles/assets/P"

const StyledSlider = styled(Slider)`
    width: 100%;
    height: calc(100vh - 170px);
    margin-bottom: 10px;
`

const HorizonScrollDiv = styled(Div)`
    width: 100%;
    white-space: nowrap;
    overflow-x: scroll;
`

const NextArrow = (props: any) => {
    const { onClick } = props
    return (
        <Div
            $position="absolute"
            $right="10px"
            $top="50%"
            $zIndex={2}
            $backgroundColor="bgColor"
            $padding="10px"
            $pointer
            onClick={onClick}
        >
            <Div width="22px" height="22px">
                <Img src="/images/arrow-right_white.svg" />
            </Div>
        </Div>
    )
}

const PrevArrow = (props: any) => {
    const { onClick } = props
    return (
        <Div
            $position="absolute"
            $left="10px"
            $top="50%"
            $zIndex={2}
            $backgroundColor="bgColor"
            $padding="10px"
            $pointer
            onClick={onClick}
        >
            <Div width="22px" height="22px">
                <Img src="/images/arrow-left_white.svg" />
            </Div>
        </Div>
    )
}

const Carousel = () => {
    const settings = {
        // customPaging: function () {
        //     return (
        //         <a>
        //             <img width="100px" height="100px" src={`/images/ibas_image.jpg`} />
        //         </a>
        //     )
        // },
        // dots: true,
        // dotsClass: "slick-dots slick-thumb",
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: <PrevArrow />, // 이전 화살표 모양 설정
        nextArrow: <NextArrow />, // 다음 화살표 모양 설정
        swipeToSlide: true,
    }

    const navigate = useNavigate()
    const moveBack = () => navigate(-1)

    return (
        <Div $position="relative" width="100%" height="100vh">
            <FlexDiv width="100%" $backgroundColor="bgColor" height="50px" $justifycontent="space-between">
                <Div $margin="0 30px">
                    <P color="wh"> 1 / 3</P>
                </Div>
                <FlexDiv width="100px" $justifycontent="space-around">
                    <Div $pointer width="20px" height="20px">
                        <Img src="/images/download_white.svg" />
                    </Div>
                    <Div $pointer $margin="0 30px 0 0" onClick={moveBack}>
                        <P color="wh" fontWeight={800}>
                            X
                        </P>
                    </Div>
                </FlexDiv>
            </FlexDiv>
            <StyledSlider {...settings}>
                <Div height="calc(100vh - 170px)">
                    <Img $objectFit="contain" src="/images/data-an.png" />
                </Div>
                <Div height="calc(100vh - 170px)">
                    <Img $objectFit="contain" src="/images/data-eng.png" />
                </Div>
                <Div height="calc(100vh - 170px)">
                    <Img $objectFit="contain" src="/images/ibas_image.jpg" />
                </Div>
            </StyledSlider>
            <HorizonScrollDiv $margin="0 0 10px 0">
                <Div display="inline-block" height="100px" width="100px" $margin="0 10px 0 0">
                    <Img $objectFit="fill" src="/images/ibas_image.jpg" />
                </Div>
                <Div display="inline-block" height="100px" width="100px" $margin="0 10px 0 0">
                    <Img $objectFit="fill" src="/images/data-eng.png" />
                </Div>
                <Div display="inline-block" height="100px" width="100px" $margin="0 10px 0 0">
                    <Img $objectFit="fill" src="/images/ibas_image.jpg" />
                </Div>
            </HorizonScrollDiv>
        </Div>
    )
}

export default Carousel
