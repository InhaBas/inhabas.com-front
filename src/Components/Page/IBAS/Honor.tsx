import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import styled from "styled-components";

import Slider from "react-slick";

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import useFetch from "../../../Hooks/useFetch";
import { honorDataInfo } from "../../../Recoil/backState";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H1 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";
import HeaderNav from "../../Common/HeaderNav";
import HonorSlide from "../../Common/HonorSlide";
import Loading from "../../Common/Loading";

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
        // className: "center",
        centerMode: true,
        // centerPadding: "60px",
        slidesToShow: 3,
        slidesToScroll: 1,
        draggable: true,
        infinite: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                },
            },
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                },
            },
        ],
    };

    const [honorData, fetchHonorData] = useFetch();
    const [honor, setHonor] = useRecoilState(honorDataInfo);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchHonorData("/members/hof", "GET", "token");
        setIsLoading(true);
    }, []);

    useEffect(() => {
        if (honorData) {
            setHonor(honorData);
            setIsLoading(false);
        }
    }, [honorData]);

    return (
        <>
            <HeaderNav />
            <Div $position="relative" width="100%" height="100vh">
                <Div width="100%" height="100vh">
                    <HonorImg src="/images/board-name-img.jpg" $filter=" brightness(30%)" />
                    <FlexDiv $zIndex={2} $position="absolute" width="100%" $top="15%">
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
                            <FlexDiv width="100%" $margin="80px 0 0 0">
                                <>
                                    {isLoading ? (
                                        <FlexDiv width="100%" height="50vh">
                                            <Loading />
                                        </FlexDiv>
                                    ) : honor && Object.values(honor).length == 0 ? (
                                        <FlexDiv width="100%" height="50vh">
                                            <Div>
                                                <P color="wh" fontSize="xl">
                                                    아직 정보 공개에 동의하신 선배님이 없습니다.
                                                </P>
                                            </Div>
                                        </FlexDiv>
                                    ) : honor && Object.values(honor).length <= 3 ? (
                                        Object.values(honor).map((cont, index) => (
                                            <HonorSlide key={index} honors={cont} small={true} />
                                        ))
                                    ) : (
                                        <StyledSlider {...settings}>
                                            {honor &&
                                                Object.values(honor).map((cont, index) => (
                                                    <HonorSlide key={index} honors={cont} />
                                                ))}
                                        </StyledSlider>
                                    )}
                                </>
                            </FlexDiv>
                        </Div>
                    </FlexDiv>
                </Div>
            </Div>
        </>
    );
};

export default Honor;
