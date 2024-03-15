import { Suspense, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";

import useFetch from "../../../Hooks/useFetch";

import { boardListDataInfo, tokenAccess, totalPageInfo } from "../../../Recoil/backState";

import { boardListInterface } from "../../../Types/TypeBoard";

import { DateFunction } from "../../../Functions/dateFunction";

import A from "../../../styles/assets/A";
import Button from "../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";

import NavigateTable from "../../Common/NavigateTable";
import Pagination from "../../Common/Pagination";
import BoardNavigate from "../../Component/Board/BoardNavigate";
import BoardSearch from "../../Component/Board/BoardSearch";

const StickyDiv = styled(Div)`
    position: sticky;
    top: 50px;
`;

const BoardList = () => {
    const headerInfo = ["no.", "제목", "작성자", "작성일"];
    const widthList = [45, 450, 120, 120];

    const { formatDateDay } = DateFunction();

    const location = useLocation();
    const url = location.pathname.split("/")[2];

    const access = useRecoilValue(tokenAccess);
    const [boardList, setBoardList] = useRecoilState(boardListDataInfo);
    const [boardListData, fetchBoardListData] = useFetch();
    const [totalPage, setTotalPage] = useRecoilState(totalPageInfo);

    // url 바뀔 때마다 해당 table fetch 할 수 있도록
    useEffect(() => {
        if (url === "opensource") {
            fetchBoardListData("/board/storage?page=0&size=15", "GET", "token");
        } else if (url === "alpha" || url === "beta") {
            console.log("sss");
        } else {
            fetchBoardListData(`/board/${url}?page=0&size=15`, "GET", "token");
        }
    }, [url, access]);

    useEffect(() => {
        if (boardListData) {
            const contents = boardListData.data.map((item: boardListInterface, idx: number) => ({
                id: idx + 1,
                title: item.title,
                writerName: item.writerName,
                dateCreated: formatDateDay({ date: item.dateCreated }),
                isPinned: item.isPinned,
            }));
            setBoardList(contents);
            setTotalPage(boardListData.pageInfo.totalPages);
        }
    }, [boardListData]);

    useEffect(() => setBoardList([]), [url]);

    return (
        <Container $alignitems="start">
            <StickyDiv $padding="0 15px">
                <Div $margin="0 0 30px 0">
                    <BoardSearch />
                </Div>

                <Div>
                    <BoardNavigate />
                </Div>
            </StickyDiv>
            <Div $padding="0 15px">
                <Suspense fallback={<Img src="/images/loading.svg" />}>
                    <NavigateTable header={headerInfo} width={widthList} contents={boardList} url="detail" />
                </Suspense>
                <FlexDiv width="100%" $justifycontent="end" $margin="20px 0 0 0">
                    <Button
                        display="flex"
                        $backgroundColor="bgColor"
                        $margin="0 10px 0 0"
                        $padding="12px 15px"
                        $borderRadius={30}
                        $HBackgroundColor="bgColorHo"
                    >
                        <FlexDiv height="15px">
                            <Div width="12px" height="12px" $margin="0 10px 0 0">
                                <Img src="/images/plus_white.svg" />
                            </Div>
                        </FlexDiv>
                        <Div $pointer height="15px">
                            <A color="wh" fontSize="sm" href={`/board/${url}/create`} $hoverColor="wh">
                                게시글 작성
                            </A>
                        </Div>
                    </Button>
                </FlexDiv>
                {boardList && boardList.length !== 0 && (
                    <Pagination
                        totalPage={totalPage}
                        fetchUrl={`/board/${url}?`}
                        token
                        paginationFetch={fetchBoardListData}
                    />
                )}
            </Div>
        </Container>
    );
};

export default BoardList;
