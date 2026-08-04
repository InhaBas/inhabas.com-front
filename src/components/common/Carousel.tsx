import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { carouselInitialState, carouselOpen } from "../../recoil/frontState";
import { carouselInterface } from "../../types/TypeCommon";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";
import { media, theme } from "../../styles/theme";

const CarouselOverlay = styled(Div)`
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100vh;
    height: 100dvh;
    overflow: hidden;
`;

const CarouselFrame = styled(Div)`
    width: 100%;
    height: 100%;
    min-width: 0;
`;

const TopBar = styled(FlexDiv)`
    width: 100%;
    height: 50px;
    flex-wrap: nowrap;
`;

const SlideCount = styled(Div)`
    min-width: 0;
    margin: 0 30px;

    ${media.mobile} {
        margin: 0 16px;
    }
`;

const TopActions = styled(FlexDiv)`
    flex: 0 0 100px;
    width: 100px;
    flex-wrap: nowrap;

    ${media.mobile} {
        flex-basis: 88px;
        width: 88px;
    }
`;

const CloseButton = styled(Div)`
    margin-right: 30px;

    ${media.mobile} {
        margin-right: 16px;
    }
`;

const SingleImageArea = styled(FlexDiv)`
    width: 100%;
    height: calc(100vh - 50px);
    height: calc(100dvh - 50px);
    min-height: 0;
`;

const Slide = styled(Div)`
    height: calc(100vh - 200px);
    height: calc(100dvh - 200px);

    ${media.mobile} {
        height: calc(100vh - 150px);
        height: calc(100dvh - 150px);
    }
`;

const Thumbnail = styled(Div)`
    width: 100px;
    height: 100px;
    display: inline-block;
    margin-right: 10px;

    ${media.mobile} {
        width: 72px;
        height: 72px;
    }
`;

const StyledSlider = styled(Slider)`
    width: 100%;
    height: calc(100vh - 200px);
    height: calc(100dvh - 200px);
    min-width: 0;

    ${media.mobile} {
        height: calc(100vh - 150px);
        height: calc(100dvh - 150px);
    }

    .slick-prev,
    .slick-next {
        z-index: 2;
    }

    .slick-list {
        overflow: hidden;
    }

    .slick-dots {
        max-width: 100%;
        justify-content: flex-start;
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        overscroll-behavior-inline: contain;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        scrollbar-color: ${theme.color.grey2} ${theme.color.border};
    }

    .slick-dots::-webkit-scrollbar {
        display: block;
        height: 8px;
    }

    .slick-dots::-webkit-scrollbar-thumb {
        background: ${theme.color.grey2};
        border-radius: 4px;
    }

    ${media.mobile} {
        .slick-dots li {
            width: 72px;
            height: 72px;
        }
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
                <Thumbnail $pointer>
                    <Img $objectFit="fill" src={thumb} />
                </Thumbnail>
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
        <CarouselOverlay $zIndex={9999} $backgroundColor="wh">
            <CarouselFrame $position="relative">
                <TopBar $backgroundColor="bgColor" $justifycontent="space-between">
                    <SlideCount>
                        <P color="wh">
                            {currentSlide + 1} / {images.length}
                        </P>
                    </SlideCount>
                    <TopActions $justifycontent="space-around">
                        <Div $pointer width="20px" height="20px" onClick={handleDownload}>
                            <Img src="/images/download_white.svg" />
                        </Div>
                        <CloseButton $pointer onClick={moveBack}>
                            <P color="wh" fontWeight={800}>
                                X
                            </P>
                        </CloseButton>
                    </TopActions>
                </TopBar>
                {images.length === 1 ? (
                    <SingleImageArea>
                        <Img $objectFit="contain" src={images[0]} />
                    </SingleImageArea>
                ) : (
                    <StyledSlider {...settings} ref={sliderRef}>
                        {images.map((image, index) => (
                            <Slide key={index}>
                                <Img $objectFit="contain" src={image} />
                            </Slide>
                        ))}
                    </StyledSlider>
                )}
            </CarouselFrame>
        </CarouselOverlay>
    );
};

export default Carousel;
