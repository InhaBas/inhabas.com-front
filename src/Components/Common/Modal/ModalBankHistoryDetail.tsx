import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { theme } from "../../../styles/theme";

import useFetch from "../../../Hooks/useFetch";

import { modalInfo, modalOpen } from "../../../Recoil/frontState";
import { tokenAccess } from "../../../Recoil/backState";

import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H2 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";

const ModalBankHistoryDetail = () => {
    const setOpen = useSetRecoilState(modalOpen);
    const modalInfos = useRecoilValue(modalInfo);
    const accessToken = useRecoilValue(tokenAccess);

    const [data, fetchData] = useFetch();

    const closeModal = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (modalInfos?.content) {
            fetchData(`/budget/history/${modalInfos.content}`, "GET", "token");
        }
    }, [accessToken, modalInfos]);

    return (
        !data ? (
            <FlexDiv width="600px" height="100%">
                <FlexDiv width="10%">
                    <Img src="/images/loading.svg" />
                </FlexDiv>
            </FlexDiv>
        ) : (
            <FlexDiv
                width="35%"
                height="600px"
                $backgroundColor="wh"
                direction="column"
                $justifycontent="space-between"
                radius={2}
                overflow="auto"
            >
                <FlexDiv height="95%" overflow="auto">
                    <FlexDiv $justifycontent="space-between" width="100%" $backgroundColor="bgColor" $padding="15px 20px">
                        <Div>
                            <H2 fontSize="lg" color="wh">
                                증빙자료
                            </H2>
                        </Div>
                        <Div height="24px" $pointer onClick={closeModal}>
                            <Img src={"../images/x_white.svg"} />
                        </Div>
                    </FlexDiv>
    
                    <FlexDiv width="90%" $borderB={`1px solid ${theme.color.grey1}`} $justifycontent="flex-start" height="75px">
                        <FlexDiv width="24px" height="24px" $margin="0 24px 0 0">
                            <Img src="/images/check-calendar_black.svg"/>
                        </FlexDiv>
                        <FlexDiv>
                            <P fontSize="md" fontWeight={700}>{data?.dateCreated.split('T')[0]}</P>
                        </FlexDiv>
                    </FlexDiv>
    
                    <FlexDiv width="90%" $borderB={`1px solid ${theme.color.grey1}`} $justifycontent="flex-start" height="75px">
                        <FlexDiv width="24px" height="24px" $margin="0 24px 0 0">
                            <Img src="/images/user-border_black.svg"/>
                        </FlexDiv>
                        <FlexDiv $margin="0 12px 0 0">
                            <P fontSize="md" fontWeight={700}>{data?.memberNameInCharge}</P>
                        </FlexDiv>
                        <FlexDiv>
                            <P fontSize="md" fontWeight={300} color="blue">회계 처리자</P>
                        </FlexDiv>
                    </FlexDiv>
    
                    <FlexDiv width="90%" $borderB={`1px solid ${theme.color.grey1}`} $justifycontent="flex-start" height="75px">
                        <FlexDiv width="24px" height="24px" $margin="0 24px 0 0">
                            <Img src="/images/user-filled_black.svg"/>
                        </FlexDiv>
                        <FlexDiv $margin="0 12px 0 0">
                            <P fontSize="md" fontWeight={700}>{data?.memberNameReceived}</P>
                        </FlexDiv>
                        <FlexDiv>
                            <P fontSize="md" fontWeight={300} color="grey2">지급 대상</P>
                        </FlexDiv>
                    </FlexDiv>
    
                    <FlexDiv width="90%" $borderB={`1px solid ${theme.color.grey1}`} $justifycontent="flex-start" height="75px">
                        <FlexDiv width="24px" height="24px" $margin="0 24px 0 0">
                            <Img src="/images/list_black.svg"/>
                        </FlexDiv>
                        <FlexDiv>
                            <P fontSize="md" fontWeight={700}>{data?.details}</P>
                        </FlexDiv>
                    </FlexDiv>
    
                    <FlexDiv width="100%" height="60%" $padding="10px">
                        {data?.receipts.map(({ url } : { url: string }) => (
                            <Div width="70%" key={url}>
                                <Img src={url} />
                            </Div>
                        ))}
                    </FlexDiv>
                </FlexDiv>
            </FlexDiv>
        )
    );
};

export default ModalBankHistoryDetail;