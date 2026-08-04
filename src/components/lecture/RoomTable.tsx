import { useNavigate } from "react-router-dom";

import { theme } from "../../styles/theme";

import { MouseEvent } from "react";

import { styled } from "styled-components";
import A from "../../styles/assets/A";
import { Div, FlexDiv } from "../../styles/assets/Div";
import P from "../../styles/assets/P";

const BoardTableHover = styled(FlexDiv)`
    &:hover {
        background-color: ${theme.color.tableHo};
    }
`;

const TableScroll = styled.div`
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;

    &::-webkit-scrollbar {
        display: block;
        height: 8px;
    }
`;

const Table = styled.div`
    width: 735px;
    min-width: 735px;
`;

const TableCell = styled(FlexDiv)`
    min-width: ${({ $minWidth }) => $minWidth};
    overflow-wrap: anywhere;

    a,
    p {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
    }
`;

const RoomTable = () => {
    const navigate = useNavigate();

    const clickEvent = (ev: MouseEvent, name: string) => {
        navigate("/lecture/room/detail");
    };

    const headerInfo = ["no.", "제목", "작성자", "작성일"];
    const widthList = [45, 450, 120, 120];

    const contents = [
        {
            id: 0,
            title: "string",
            writer_name: "string",
            created: "2023-07-19",
        },
        {
            id: 1,
            title: "string",
            writer_name: "string",
            created: "2023-07-20",
        },
        {
            id: 2,
            title: "string",
            writer_name: "string",
            created: "2023-07-21",
        },
        {
            id: 3,
            title: "string",
            writer_name: "string",
            created: "2023-07-22",
        },
    ];

    return (
        <Div width="100%" $padding="20px">
            <TableScroll>
            <Table>
            <FlexDiv
                width="100%"
                height="45px"
                $borderB={`1px solid ${theme.color.tableBorder}`}
                $justifycontent="space-between"
                $alignitems="center"
            >
                {headerInfo.map((item: string, idx: number) => (
                    <TableCell key={`headerInfo${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                        <P $center={idx === 1 ? false : true} fontWeight={700}>
                            {item}
                        </P>
                    </TableCell>
                ))}
            </FlexDiv>
            {contents.map((element: object, idx: number) => (
                <BoardTableHover
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
                        <TableCell key={`itemValue${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                            <A $center={idx === 1 ? false : true} fontWeight={idx === 0 ? 900 : 500}>
                                {item}
                            </A>
                        </TableCell>
                    ))}
                </BoardTableHover>
            ))}
            </Table>
            </TableScroll>
        </Div>
    );
};

export default RoomTable;
