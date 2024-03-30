import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { theme } from "../../../../styles/theme";

import useFetch from "../../../../Hooks/useFetch";

import { boardListDataInfo, boardListPinnedDataInfo, tokenAccess, totalPageInfo } from "../../../../Recoil/backState";

import { DateFunction } from "../../../../Functions/dateFunction";
import { MyBoardInterface } from "../../../../Types/IBAS/TypeMyinfo";

import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";
import Pagination from "../../../Common/Pagination";

const MyBoardTable = () => {
    const widthList = [200, 600, 200];
    const headerInfo = ["게시판 유형", "제목", "작성일"];

    const { formatDateDay } = DateFunction();
    const navigate = useNavigate();

    const access = useRecoilValue(tokenAccess);
    const [boardList, setBoardList] = useRecoilState(boardListDataInfo);
    const [boardPinnedList, setBoardPinnedList] = useRecoilState(boardListPinnedDataInfo);
    const [boardListData, fetchBoardListData] = useFetch();
    const [totalPage, setTotalPage] = useRecoilState(totalPageInfo);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBoardListData(`/myInfo/boards?page=0&size=7`, "GET", "token");
    }, [access]);

    useEffect(() => {
        if (boardListData) {
            const contents = boardListData.data.map((item: MyBoardInterface, idx: number) => ({
                type: item.menuName,
                title: item.title,
                dateCreated: formatDateDay({ date: item.dateCreated }),

                id: item.id,
                menuType: item.menuType === "STORAGE" ? "opensource" : item.menuType.toLowerCase(),
            }));

            setBoardList(contents);
            setTotalPage(boardListData.pageInfo.totalPages);
            setIsLoading(false);
        }
    }, [boardListData]);
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
                {boardList.length !== 0 ? (
                    boardList.map((element: object, idx: number) => (
                        <FlexDiv
                            key={`contentItem${idx}`}
                            width="100%"
                            height="45px"
                            $borderT={`1px solid ${theme.color.grey1}`}
                            $justifycontent="space-between"
                            $backgroundColor="wh"
                        >
                            {Object.values(element)
                                .slice(0, 3)
                                .map((item: any, idx: number) => (
                                    <FlexDiv
                                        $pointer={idx === 1 ? true : false}
                                        key={`itemValue${idx}`}
                                        $minWidth={`${widthList[idx]}px`}
                                        $padding="10px"
                                    >
                                        {idx === 1 ? (
                                            <P
                                                color="bgColor"
                                                fontWeight={700}
                                                onClick={() =>
                                                    navigate(
                                                        `/board/${(element as { menuType: string }).menuType}/detail/${
                                                            (element as { id: number }).id
                                                        }`
                                                    )
                                                }
                                            >
                                                {item}
                                            </P>
                                        ) : (
                                            <P>{item}</P>
                                        )}
                                    </FlexDiv>
                                ))}
                        </FlexDiv>
                    ))
                ) : (
                    <FlexDiv
                        width="100%"
                        height="45px"
                        $borderT={`1px solid ${theme.color.grey1}`}
                        $padding="0 18px"
                        $backgroundColor="wh"
                    >
                        <Div>
                            <P>게시글이 존재하지 않습니다</P>
                        </Div>
                    </FlexDiv>
                )}
            </Div>
            {boardList && boardList.length !== 0 && (
                <Pagination
                    totalPage={totalPage}
                    fetchUrl={`/myInfo/boards`}
                    token
                    paginationFetch={fetchBoardListData}
                    size={7}
                />
            )}
        </>
    );
};

export default MyBoardTable;
