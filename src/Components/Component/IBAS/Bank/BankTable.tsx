import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import { theme } from "../../../../styles/theme";

import { MouseEvent } from "react";

import { modalInfo, modalOpen } from "../../../../Recoil/frontState";

import { Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

const BankTable = () => {
    const navigate = useNavigate();

    const setOpen = useSetRecoilState(modalOpen);
    const setModalInfo = useSetRecoilState(modalInfo);

    const clickEvent = (ev: MouseEvent, name: string) => {
        setOpen(true);
        console.log("gg");

        setModalInfo("bank");
    };

    const headerInfo = ["사용일", "게시일", "수정일", "내용", "수입액", "지출액", "증빙"];
    const widthList = [150, 150, 150, 400, 120, 120, 90];

    const contents = [
        {
            사용일: "2023-01-02",
            게시일: "2023-01-03",
            수정일: "2023-01-04",
            내용: "2023-01-05",
            수입액: "0",
            지출액: "60,000",
        },
        {
            사용일: "2023-01-02",
            게시일: "2023-01-03",
            수정일: "2023-01-04",
            내용: "2023-01-05",
            수입액: "0",
            지출액: "60,000",
        },
        {
            사용일: "2023-01-02",
            게시일: "2023-01-03",
            수정일: "2023-01-04",
            내용: "2023-01-05",
            수입액: "0",
            지출액: "60,000",
        },
        {
            사용일: "2023-01-02",
            게시일: "2023-01-03",
            수정일: "2023-01-04",
            내용: "2023-01-05",
            수입액: "0",
            지출액: "60,000",
        },
        {
            사용일: "2023-01-02",
            게시일: "2023-01-03",
            수정일: "2023-01-04",
            내용: "2023-01-05",
            수입액: "0",
            지출액: "60,000",
        },
        {
            사용일: "2023-01-02",
            게시일: "2023-01-03",
            수정일: "2023-01-04",
            내용: "2023-01-05",
            수입액: "0",
            지출액: "60,000",
        },
        {
            사용일: "2023-01-02",
            게시일: "2023-01-03",
            수정일: "2023-01-04",
            내용: "2023-01-05",
            수입액: "0",
            지출액: "60,000",
        },
    ];

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
                </FlexDiv>
                {contents.map((element: object, idx: number) => (
                    <FlexDiv
                        key={`contentItem${idx}`}
                        width="100%"
                        height="45px"
                        $borderT={`1px solid ${theme.color.grey1}`}
                        $justifycontent="space-between"
                        $backgroundColor="wh"
                    >
                        {Object.values(element).map((item: any, idx: number) => (
                            <FlexDiv key={`itemValue${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                                <P $center fontWeight={500}>
                                    {item === "0" ? "-" : item}
                                </P>
                            </FlexDiv>
                        ))}
                        <FlexDiv width="90px">
                            <Div width="15px" onClick={(e: MouseEvent) => clickEvent(e, "ss")} $pointer>
                                <Img src="/images/file.svg" />
                            </Div>
                        </FlexDiv>
                    </FlexDiv>
                ))}
            </Div>
            <FlexDiv width="100%">
                <Div $padding="10px 20px" $backgroundColor="bgColor" radius={50}>
                    <P color="wh"> 잔액 : ₩ 10,000 </P>
                </Div>
            </FlexDiv>
        </>
    );
};

export default BankTable;
