import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { theme } from "../../../styles/theme";

import useFetch from "../../../Hooks/useFetch";

import { tokenAccess } from "../../../Recoil/backState";
import { carouselInitialState, carouselOpen, modalInfo, modalOpen } from "../../../Recoil/frontState";

import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H2 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";
import Carousel from "../Carousel";

const ModalBankHistoryDetail = () => {
    const setOpen = useSetRecoilState(modalOpen);
    const modalInfos = useRecoilValue(modalInfo);
    const accessToken = useRecoilValue(tokenAccess);
    const [isCarouselOpen, setIsCarouselOpen] = useRecoilState(carouselOpen);
    const [carouselInitial, setCarouselInitial] = useRecoilState(carouselInitialState);

    const [data, fetchData] = useFetch();

    const closeModal = () => {
        setOpen(false);
    };
    // Carousel을 렌더링할지 여부를 결정하는 함수
    const handleCarousel = (idx: number) => {
        setCarouselInitial(idx);
        setIsCarouselOpen(true);
    };

    useEffect(() => {
        if (modalInfos?.content) {
            fetchData(`/budget/history/${modalInfos.content}`, "GET", "token");
        }
        return () => {
            setIsCarouselOpen(false);
        };
    }, [accessToken, modalInfos]);

    return !data ? (
        <FlexDiv width="600px" height="100%">
            <FlexDiv width="10%">
                <Img src="/images/loading.svg" />
            </FlexDiv>
        </FlexDiv>
    ) : isCarouselOpen ? (
        // <FlexDiv width="100%" height="100vh">
        <Carousel images={data?.receipts?.map((image: any) => image.url) || []} />
    ) : (
        // </FlexDiv>
        <FlexDiv
            width="35%"
            $backgroundColor="wh"
            direction="column"
            $justifycontent="space-between"
            radius={2}
            $maxHeight="600px"
            overflow="auto"
        >
            <FlexDiv width="100%" $position="relative" overflow="auto">
                <FlexDiv
                    $position="sticky"
                    $top="0"
                    $left="0"
                    $justifycontent="space-between"
                    width="100%"
                    $backgroundColor="bgColor"
                    $padding="15px 20px"
                >
                    <Div>
                        <H2 fontSize="lg" color="wh">
                            증빙자료
                        </H2>
                    </Div>
                    <Div height="24px" $pointer onClick={closeModal}>
                        <Img src={"../images/x_white.svg"} />
                    </Div>
                </FlexDiv>

                <FlexDiv width="90%" $margin="20px 0 ">
                    <FlexDiv
                        width="100%"
                        $borderB={`1px solid ${theme.color.grey1}`}
                        $justifycontent="flex-start"
                        height="50px"
                    >
                        <FlexDiv width="20px" height="20px" $margin="0 12px 0 0">
                            <Img src="/images/check-calendar_black.svg" />
                        </FlexDiv>
                        <FlexDiv>
                            <P fontSize="sm">{data?.dateCreated.split("T")[0]}</P>
                        </FlexDiv>
                    </FlexDiv>

                    <FlexDiv
                        width="100%"
                        $borderB={`1px solid ${theme.color.grey1}`}
                        $justifycontent="flex-start"
                        height="50px"
                    >
                        <FlexDiv width="20px" height="16px" $margin="0 12px 0 0">
                            <Img src="/images/user-border_black.svg" />
                        </FlexDiv>
                        <FlexDiv $margin="0 12px 0 0">
                            <P fontSize="sm">{data?.memberNameInCharge}</P>
                        </FlexDiv>
                        <FlexDiv>
                            <P fontSize="sm" fontWeight={300} color="blue">
                                회계 처리자
                            </P>
                        </FlexDiv>
                    </FlexDiv>

                    <FlexDiv
                        width="100%"
                        $borderB={`1px solid ${theme.color.grey1}`}
                        $justifycontent="flex-start"
                        height="50px"
                    >
                        <FlexDiv width="20px" height="16px" $margin="0 12px 0 0">
                            <Img src="/images/user-filled_black.svg" />
                        </FlexDiv>
                        <FlexDiv $margin="0 12px 0 0">
                            <P fontSize="sm">{data?.memberNameReceived}</P>
                        </FlexDiv>
                        <FlexDiv>
                            <P fontSize="sm" fontWeight={300} color="grey2">
                                지급 대상
                            </P>
                        </FlexDiv>
                    </FlexDiv>

                    <FlexDiv
                        width="100%"
                        $borderB={`1px solid ${theme.color.grey1}`}
                        $justifycontent="flex-start"
                        height="50px"
                    >
                        <FlexDiv width="20px" height="18px" $margin="0 12px 0 0">
                            <Img src="/images/list_black.svg" />
                        </FlexDiv>
                        <FlexDiv>
                            <P fontSize="sm">{data?.details}</P>
                        </FlexDiv>
                    </FlexDiv>

                    <FlexDiv width="100%" height="60%" $padding="10px" $margin="20px 0">
                        {data?.receipts.map((elem: any, index: number) => (
                            <Div width="70%" $margin="20px 0" key={elem} $pointer onClick={() => handleCarousel(index)}>
                                <Img src={elem.url} />
                            </Div>
                        ))}
                    </FlexDiv>
                </FlexDiv>
            </FlexDiv>
        </FlexDiv>
    );
};

export default ModalBankHistoryDetail;
