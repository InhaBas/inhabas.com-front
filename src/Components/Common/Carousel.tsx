import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { carouselInitialState, carouselOpen } from "../../Recoil/frontState";
import { carouselInterface } from "../../Types/TypeCommon";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";

const StyledSlider = styled(Slider)`
    width: 100%;
    height: calc(100vh - 200px);

    .slick-prev,
    .slick-next {
        z-index: 2;
    }

    .slick-list {
        overflow: hidden;
    }
`;

const ArrowButton = styled(Div)`
    position: absolute;
    top: 50%;
    z-index: 2;
    background-color: #4611a7;
    padding: 10px;
    cursor: pointer;
    transform: translateY(-50%);
`;

const NextArrow = (props: any) => {
    const { onClick } = props;
    return (
        <ArrowButton $right="20px" onClick={onClick}>
            <Div width="22px" height="22px">
                <Img src="/images/arrow-right_white.svg" />
            </Div>
        </ArrowButton>
    );
};

const PrevArrow = (props: any) => {
    const { onClick } = props;
    return (
        <ArrowButton $left="20px" onClick={onClick}>
            <Div width="22px" height="22px">
                <Img src="/images/arrow-left_white.svg" />
            </Div>
        </ArrowButton>
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
            const thumb = images[i];
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
        // prevArrow: <PrevArrow />,
        // nextArrow: <NextArrow />,
        swipeToSlide: true,
        initialSlide: carouselInitial,
        afterChange: (index: number) => setCurrentSlide(index),
    };

    const handleDownload = async () => {
        const response = await fetch(images[currentSlide]);
        const file = await response.blob();
        const downloadUrl = window.URL.createObjectURL(file);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `image_${currentSlide + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        setCurrentSlide(carouselInitial);
        return () => {
            setCurrentSlide(0);
        };
    }, [images, carouselInitial]);

    return (
        <Div width="100%" height="100vh" $position="absolute" $top="0" $left="0" $zIndex={9999} $backgroundColor="wh">
            <Div $position="relative" width="100%">
                <FlexDiv width="100%" $backgroundColor="bgColor" height="50px" $justifycontent="space-between">
                    <Div $margin="0 30px">
                        <P color="wh">
                            {currentSlide + 1} / {images.length}
                        </P>
                    </Div>
                    <FlexDiv width="100px" $justifycontent="space-around">
                        <Div $pointer width="20px" height="20px" onClick={handleDownload}>
                            <Img src="/images/download_white.svg" />
                        </Div>
                        <Div $pointer $margin="0 30px 0 0" onClick={moveBack}>
                            <P color="wh" fontWeight={800}>
                                X
                            </P>
                        </Div>
                    </FlexDiv>
                </FlexDiv>
                {images.length === 1 ? (
                    <FlexDiv width="100%" height="calc(100vh - 50px)">
                        <Img $objectFit="contain" src={images[0]} />
                    </FlexDiv>
                ) : (
                    <StyledSlider {...settings} ref={sliderRef}>
                        {images.map((image, index) => (
                            <Div key={index} height="calc(100vh - 200px)">
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
