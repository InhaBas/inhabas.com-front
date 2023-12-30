import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import styled from "styled-components";

import Slider from "react-slick";

import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H1 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";
import HeaderNav from "../../Common/HeaderNav";
import HonorSlide from "../../Common/HonorSlide";

const HonorImg = styled(Img)`
    object-fit: fill;
    position: absolute;
`;
const StyledSlider = styled(Slider)`
    width: 90%;
    height: 500px;
`;

const Honor = () => {
    const settings = {
        className: "center",
        centerMode: true,
        centerPadding: "60px",
        slidesToShow: 3,
        slidesToScroll: 1,
        speed: 800,
        cssEase: "linear",
    };

    return (
        <>
            <HeaderNav />
            <Div $position="relative" width="100%" height="100vh">
                <Div width="100%" height="100vh">
                    <HonorImg src="/images/board-name-img.jpg" $filter=" brightness(30%)" />
                    <FlexDiv $zIndex={2} $position="absolute" width="100%" $top="5%">
                        <Div overflow="auto">
                            <FlexDiv width="100%" direction="column">
                                <Div>
                                    <H1 fontSize="xxxl" color="wh">
                                        명예의 전당
                                    </H1>
                                </Div>
                                <Div
                                    height="3px"
                                    width="100px"
                                    $margin="30px"
                                    $position="relative"
                                    $backgroundColor="wh"
                                ></Div>
                                <Div>
                                    <P color="wh" $center fontSize="lg" $lineHeight={1.5} fontWeight={300}>
                                        졸업생 분들 중 정보공개에 동의하신 선배님들입니다. <br />
                                        IBAS의 성장을 위해 함께해주셔서 감사합니다.
                                    </P>
                                </Div>
                            </FlexDiv>
                            <FlexDiv width="100%" $margin="30px 0 0 0 ">
                                <StyledSlider {...settings}>
                                    <HonorSlide num={1} />
                                    <HonorSlide num={2} />
                                    <HonorSlide num={3} />
                                    <HonorSlide num={4} />
                                    {/* <HonorSlide num={5} />
                                    <HonorSlide num={6} />
                                    <HonorSlide num={7} />
                                    <HonorSlide num={8} />
                                    <HonorSlide num={9} />
                                    <HonorSlide num={10} />
                                    <HonorSlide num={11} />
                                    <HonorSlide num={12} /> */}
                                </StyledSlider>
                            </FlexDiv>
                        </Div>
                    </FlexDiv>
                </Div>
            </Div>
        </>
    );
};

export default Honor;
