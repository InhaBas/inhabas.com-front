import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import Slider from "react-slick";

import styled from "styled-components";

import { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { carouselInitialState, carouselOpen } from "../../Recoil/frontState";
import { carouselInterface } from "../../Types/TypeCommon";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";

const StyledSlider = styled(Slider)`
    width: 100%;
    height: calc(100vh - 200px);
`;

const NextArrow = (props: any) => {
    const { onClick } = props;
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
    );
};

const PrevArrow = (props: any) => {
    const { onClick } = props;
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
    );
};

const Carousel: React.FC<carouselInterface> = ({ images }) => {
    const sliderRef = useRef<any>(null);
    const setIsCarouselOpen = useSetRecoilState(carouselOpen);
    const carouselInitial = useRecoilValue(carouselInitialState);
    const [currentSlide, setCurrentSlide] = useState(carouselInitial);
    const moveBack = () => setIsCarouselOpen(false);

    const settings = {
        customPaging: (i: number) => {
            const thumb = images[i]; // images 배열에서 썸네일 이미지 경로를 가져옵니다.
            return (
                <Div display="inline-block" height="100px" width="100px" $margin="0 10px 0 0" $pointer>
                    <Img $objectFit="fill" src={thumb} />
                </Div>
            );
        },
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: <PrevArrow />, // 이전 화살표 모양 설정
        nextArrow: <NextArrow />, // 다음 화살표 모양 설정
        swipeToSlide: true,
        initialSlide: carouselInitial,
        afterChange: (index: number) => setCurrentSlide(index),
    };

    // 이미지 다운로드 함수
    const handleDownload = async () => {
        const response = await fetch(images[currentSlide]);
        const file = await response.blob();
        const downloadUrl = window.URL.createObjectURL(file);

        const link = document.createElement("a");
        // link.href = images[currentSlide];
        link.href = downloadUrl;
        link.download = `image_${currentSlide + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        if (sliderRef.current) {
            const slider = sliderRef.current;
            if (slider.innerSlider) {
                const currentSlide = slider.innerSlider.list.querySelector(".slick-current");
                if (currentSlide) {
                    currentSlide.classList.remove("slick-current");
                    currentSlide.classList.add("slick-center");
                }
            }
        }
    }, [images]);

    return (
        <Div width="100%" $position="absolute" $top="0" $left="0" $zIndex={9999} $backgroundColor="wh">
            <Div $position="relative" width="100%">
                <FlexDiv width="100%" $backgroundColor="bgColor" height="50px" $justifycontent="space-between">
                    <Div $margin="0 30px">
                        <P color="wh">
                            {currentSlide + 1} / {images.length}
                        </P>
                    </Div>
                    <FlexDiv width="100px" $justifycontent="space-around">
                        <Div $pointer width="20px" height="20px" onClick={() => handleDownload()}>
                            <Img src="/images/download_white.svg" />
                        </Div>
                        <Div $pointer $margin="0 30px 0 0" onClick={moveBack}>
                            <P color="wh" fontWeight={800}>
                                X
                            </P>
                        </Div>
                    </FlexDiv>
                </FlexDiv>
                {/* 이미지가 하나인 경우 슬라이더 대신 단일 이미지를 렌더링합니다. */}
                {images.length === 1 ? (
                    <FlexDiv width="100%" height="calc(100vh - 50px)">
                        <Img $objectFit="contain" src={images[0]} />
                    </FlexDiv>
                ) : (
                    // 초기값 설정 x
                    <StyledSlider {...settings} ref={sliderRef}>
                        {images.map((image: string, index: number) => (
                            <Div
                                key={`image${index}`}
                                height="calc(100vh - 200px)"
                                style={{ display: index === currentSlide ? "block" : "none" }}
                            >
                                <Img $objectFit="contain" src={image} />
                            </Div>
                        ))}
                    </StyledSlider>
                )}
            </Div>
        </Div>
    );
};

export default Carousel;
