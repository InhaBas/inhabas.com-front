import { useNavigate } from "react-router-dom";

import { theme } from "../../../../styles/theme";

import { MouseEvent } from "react";

import { styled } from "styled-components";
import A from "../../../../styles/assets/A";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import { Select } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";

const BankSupportTableHover = styled(FlexDiv)`
    &:hover {
        background-color: ${theme.color.tableHo};
    }
`;

const BankSupportTable = () => {
    const navigate = useNavigate();

    const clickEvent = (ev: MouseEvent, name: string) => {
        navigate("/bank/support/detail");
    };

    const headerInfo = ["no.", "제목", "작성자", "작성일", "상태"];
    const widthList = [45, 450, 120, 120, 120];

    const contents = [
        {
            id: 0,
            title: "string",
            writer_name: "string",
            created: "2023-07-19",
            state: "승인 대기",
        },
        {
            id: 1,
            title: "string",
            writer_name: "string",
            created: "2023-07-20",
            state: "승인 대기",
        },
        {
            id: 2,
            title: "string",
            writer_name: "string",
            created: "2023-07-21",
            state: "승인 완료",
        },
        {
            id: 3,
            title: "string",
            writer_name: "string",
            created: "2023-07-22",
            state: "승인 거절",
        },
    ];

    return (
        <>
            <Select
                name="subject"
                required
                width="100px"
                $backgroundColor="bgColor"
                $borderRadius={100}
                color="wh"
                $padding="10px"
            >
                <option hidden>전체보기</option>
                <option>승인 대기</option>
                <option>승인 완료</option>
                <option>승인 거절</option>
            </Select>
            <Div width="100%" $padding="20px">
                <FlexDiv
                    width="100%"
                    height="45px"
                    $borderB={`1px solid ${theme.color.tableBorder}`}
                    $justifycontent="space-between"
                    $alignitems="center"
                >
                    {headerInfo.map((item: string, idx: number) => (
                        <FlexDiv key={`headerInfo${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                            <P $center={idx === 1 ? false : true} fontWeight={700}>
                                {item}
                            </P>
                        </FlexDiv>
                    ))}
                </FlexDiv>
                {contents.map((element: object, idx: number) => (
                    <BankSupportTableHover
                        key={`contentItem${idx}`}
                        width="100%"
                        height="45px"
                        $borderT={`1px solid ${theme.color.grey1}`}
                        $justifycontent="space-between"
                        onClick={(e: MouseEvent) => clickEvent(e, "ss")}
                        $backgroundColor="wh"
                        $pointer
                    >
                        {Object.values(element).map((item: any, idx: number) => (
                            <FlexDiv key={`itemValue${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                                {idx === 4 ? (
                                    <Div>
                                        <A color="red" $hoverColor="red">
                                            {item}
                                        </A>
                                    </Div>
                                ) : (
                                    <Div>
                                        <A $center={idx === 1 ? false : true} fontWeight={idx === 0 ? 900 : 500}>
                                            {item}
                                        </A>
                                    </Div>
                                )}
                            </FlexDiv>
                        ))}
                    </BankSupportTableHover>
                ))}
            </Div>
        </>
    );
};

export default BankSupportTable;
