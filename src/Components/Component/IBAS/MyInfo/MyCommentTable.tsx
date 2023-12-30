import { theme } from "../../../../styles/theme";

import A from "../../../../styles/assets/A";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";

import Pagination from "../../../Common/Pagination";

const MyCommentTable = () => {
    const widthList = [300, 500, 0, 200];

    const headerInfo = ["게시판 유형", "제목", "", "작성일"];
    const contents = [
        {
            type: "회장단 게시판",
            title: "AWS ec2요금",
            originalId: "1",
            writeDate: "2022-09-09",
        },
        {
            type: "회장단 게시판",
            title: "AWS ec2요금",
            originalId: "2",
            writeDate: "2022-09-09",
        },
        {
            type: "회장단 게시판",
            title: "AWS ec2요금",
            originalId: "3",
            writeDate: "2022-09-09",
        },
        {
            type: "회장단 게시판",
            title: "AWS ec2요금",
            originalId: "4",
            writeDate: "2022-09-09",
        },
        {
            type: "회장단 게시판",
            title: "AWS ec2요금",
            originalId: "5",
            writeDate: "2022-09-09",
        },
        {
            type: "회장단 게시판",
            title: "AWS ec2요금",
            originalId: "6",
            writeDate: "2022-09-09",
        },
    ];
    return (
        <>
            <Div width="100%" $borderB={`1px solid ${theme.color.grey1}`}>
                <FlexDiv
                    width="100%"
                    height="45px"
                    $borderT={`1px solid ${theme.color.grey1}`}
                    $justifycontent="space-between"
                    $backgroundColor="wh"
                >
                    {headerInfo.map((item: string, idx: number) => (
                        <FlexDiv key={`headerInfo${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                            <P fontWeight={700}>{item}</P>
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
                            <FlexDiv
                                key={`itemValue${idx}`}
                                $minWidth={`${widthList[idx]}px`}
                                $padding="10px"
                                $pointer={idx === 2 ? true : false}
                            >
                                {idx === 2 ? (
                                    <A color="bgColor" href="/bank/support/detail">
                                        원문보기 ▶
                                    </A>
                                ) : (
                                    <A>{item}</A>
                                )}
                            </FlexDiv>
                        ))}
                    </FlexDiv>
                ))}

                <Pagination />
            </Div>
        </>
    );
};

export default MyCommentTable;
