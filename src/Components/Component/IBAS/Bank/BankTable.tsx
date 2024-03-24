import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { theme } from "../../../../styles/theme";

import { MouseEvent, useState } from "react";

import { modalInfo, modalOpen } from "../../../../Recoil/frontState";

import { Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

import { bankHistoryInfo, bankBalanceInfo } from "../../../../Recoil/backState";

import Modal from "../../../Common/Modal/ModalHistory";
import useFetch from "../../../../Hooks/useFetch";

const BankTable = () => {
    const navigate = useNavigate();

    const setOpen = useSetRecoilState(modalOpen);
    const setModalInfo = useSetRecoilState(modalInfo);

    const [_delete, fetchDeleteHistory] = useFetch();

    const clickDetailEvent = (ev: MouseEvent, name: string, selectedId: number) => {
        setOpen(true);
        console.log("gg");

        setModalInfo({ type: "bankHistory", content: String(selectedId) });
    };

    const clickUpdateEvent = (ev: MouseEvent, name: string, selectedIdx: number) => {
        setOpen(true);
        console.log("gg");
        console.log(selectedIdx)

        setModalInfo({ type: "bankHistoryUpdate", content: String(selectedIdx) });
    };

    const clickDeleteEvent = (ev: MouseEvent, name: string, selectedId: number) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            fetchDeleteHistory(`/budget/history/${selectedId}`, 'DELETE', 'token')
        }
    };

    const clickPostEvent = (ev: MouseEvent, name: string, content: string) => {
        setOpen(true);
        console.log("gg");

        setModalInfo({ type: "bankHistoryPost" });
    };

    const headerInfo = ["사용일", "게시일", "수정일", "내용", "수입액", "지출액", "증빙"];
    const widthList = [90, 90, 90, 350, 100, 100, 40];

    const contents = useRecoilValue(bankHistoryInfo);
    const bankBalance = useRecoilValue(bankBalanceInfo);

    return (
        <>
            <Div width="100%" $padding="20px">
                <FlexDiv
                    width="100%"
                    height="45px"
                    $borderT={`1px solid ${theme.color.grey1}`}
                    $justifycontent="space-between"
                    $backgroundColor="wh"
                >
                    {headerInfo.map((item: string, idx: number) => (
                        <FlexDiv key={`headerInfo${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                            <P $center fontWeight={700}>
                                {item}
                            </P>
                        </FlexDiv>
                    ))}
                    {/* 권한 여부 체크 */}
                    <FlexDiv $minWidth="60px" $padding="10px">
                        <P $center fontWeight={700}>
                            비고
                        </P>
                    </FlexDiv>
                </FlexDiv>
                {contents?.map((element: any, idx: number) => (
                    <FlexDiv
                        key={`contentItem${idx}`}
                        width="100%"
                        height="45px"
                        $borderT={`1px solid ${theme.color.grey1}`}
                        $justifycontent="space-between"
                        $backgroundColor="wh"
                    >
                        {Object.values(element).slice(1).map((item: any, idx: number) => (
                            <FlexDiv key={`itemValue${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                                <P $center fontWeight={500}>
                                    {item === "0" ? "-" : item}
                                </P>
                            </FlexDiv>
                        ))}
                        <FlexDiv width="50px">
                            <Div width="15px" onClick={ (e: MouseEvent) => clickDetailEvent(e, "ss", element?.id) } $pointer>
                                <Img src="/images/file_grey.svg" />
                            </Div>
                        </FlexDiv>
                        {/* 권한 여부 체크 */}
                        <FlexDiv $minWidth={'60px'} $padding="10px">
                            <FlexDiv width="15px" $margin="0 6px" onClick={ (e: MouseEvent) => clickUpdateEvent(e, "ss", element?.id) } $pointer>
                                <Img src="/images/pencil_grey.svg"/>
                            </FlexDiv>
                            <FlexDiv width="15px" onClick={ (e: MouseEvent) => clickDeleteEvent(e, "ss", element?.id) } $pointer>
                                <Img src="/images/trash_grey.svg"/>
                            </FlexDiv>
                        </FlexDiv>
                    </FlexDiv>
                ))}
            </Div>
            <FlexDiv width="100%" $justifycontent="flex-end" $padding="0 20px 10px 0" $margin="0 20px 0 0">
                <FlexDiv width="20px" height="20px" radius={50} onClick={ (e: MouseEvent) => clickPostEvent(e, "ss", '') } $pointer>
                    <Img src="/images/plus_grey.svg" />
                </FlexDiv>
            </FlexDiv>
            <FlexDiv width="100%">
                <Div $padding="10px 20px" $backgroundColor="bgColor" radius={50}>
                    <P color="wh"> 잔액 : ₩ { String(bankBalance)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') } </P>
                </Div>
            </FlexDiv>
        </>
    );
};

export default BankTable;
