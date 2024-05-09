import { Suspense, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";

import useFetch from "../../../Hooks/useFetch";

import { boardListDataInfo, boardListPinnedDataInfo, tokenAccess, totalPageInfo, contestListDataInfo } from "../../../Recoil/backState";

import { boardListInterface } from "../../../Types/TypeBoard";

import { DateFunction } from "../../../Functions/dateFunction";

import A from "../../../styles/assets/A";
import Button from "../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";

import { GetRoleAuthorization } from "../../../Functions/authFunctions";
import Loading from "../../Common/Loading";
import NavigateTable from "../../Common/NavigateTable";
import Pagination from "../../Common/Pagination";
import BoardNavigate from "../../Component/Board/BoardNavigate";
import BoardSearch from "../../Component/Board/BoardSearch";
import Contest from "../IBAS/Contest/Contest";
import { contestOrder } from "../../../Recoil/frontState";

const StickyDiv = styled(Div)`
    position: sticky;
    top: 50px;
`;

const BoardList = () => {
    const headerInfo = ["no.", "", "제목", "작성자", "작성일"];
    const widthList = [45, 0, 450, 120, 120];

    const { formatDateDay } = DateFunction();

    const location = useLocation();
    const navigate = useNavigate();
    const url = location.pathname.split("/")[2];
    const access = useRecoilValue(tokenAccess);
    const [boardList, setBoardList] = useRecoilState(boardListDataInfo);
    const [boardPinnedList, setBoardPinnedList] = useRecoilState(boardListPinnedDataInfo);
    const [boardListData, fetchBoardListData] = useFetch();
    const [totalPage, setTotalPage] = useRecoilState(totalPageInfo);
    const [contestListData, setContestListData] = useRecoilState(contestListDataInfo);
    const contestOrderBy = useRecoilValue(contestOrder)
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthorizedOverSecretary, isAuthorizedOverDeactivate, isSecretary, isAuthorizedOverBasic } =
        GetRoleAuthorization();

    let fetchUrl: string;
    if (url === "alpha") {
        fetchUrl = "/project/alpha";
    } else if (url === "beta") {
        fetchUrl = "/project/beta";
    } else if (url === "sponsor") {
        fetchUrl = "/scholarship/sponsor";
    } else if (url === "usage") {
        fetchUrl = "/scholarship/usage";
    } else if (url === "opensource") {
        fetchUrl = "/board/storage";
    } else if (url === "contest") {
        fetchUrl = "/contest/contest?size=4";
    } else if (url === "activity") {
        fetchUrl = "/contest/activity?size=4";
    } else {
        fetchUrl = `/board/${url}`;
    }

    const checkWritingAuthorization = () => {
        // 회장단
        if (["notice", "sponsor", "usage"].includes(url) && isAuthorizedOverSecretary) {
            return true;
            // 비활동 회원
        } else if (["free", "question", "suggest", "support"].includes(url) && isAuthorizedOverDeactivate) {
            return true;
            // 활동 회원
        } else if (["opensource", "contest", "activity"].includes(url) && isAuthorizedOverBasic) {
            return true;
            // 총무
        } else if (["executive"].includes(url) && isSecretary) {
            return true;
            // url이 잘못된 경우
        }
        return false;
    };

    // url 바뀔 때마다 해당 table fetch 할 수 있도록
    useEffect(() => {
        setIsLoading(true);
        if (["opensource", "usage", "sponsor"].includes(url)) {
            fetchBoardListData(`${fetchUrl}`, "GET");
        } else if (["contest", "activity"].includes(url)) {
            fetchBoardListData(`${fetchUrl}${contestOrderBy}`, "GET");
        } else {
            fetchBoardListData(`${fetchUrl}`, "GET", "token");
        }
    }, [url, access, contestOrderBy])

    useEffect(() => {
        if (["contest", "activity"].includes(url)) {
            if (boardListData) {
                setIsLoading(false);
                setContestListData(boardListData?.data)
                setTotalPage(boardListData.pageInfo.totalPages)
            }
        } else {
            if (boardListData) {
                const contents = boardListData.data.map((item: boardListInterface, idx: number) => ({
                    number: boardListData.pageInfo.pageNumber * boardListData.pageInfo.pageSize + idx + 1,
                    id: item.id,
                    title: item.title,
                    writerName: item.writerName,
                    dateCreated: formatDateDay({ date: item.dateCreated }),
                    isPinned: item.isPinned,
                }));
                const pinnedContents = boardListData.pinnedData?.map((item: boardListInterface, idx: number) => ({
                    id: item.id,
                    title: item.title,
                    writerName: item.writerName,
                    dateCreated: formatDateDay({ date: item.dateCreated }),
                    isPinned: item.isPinned,
                }));
                setBoardPinnedList(pinnedContents);
                setBoardList(contents);
                setTotalPage(boardListData.pageInfo.totalPages);
                setIsLoading(false);
            }
        }
    }, [boardListData]);

    useEffect(() => {
        setBoardList([])
        setContestListData([])
    }, [url])

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <Container $alignitems="start">
                    <StickyDiv $padding="0 15px">
                        <Div $margin="0 0 30px 0">
                            <BoardSearch />
                        </Div>
                        {url !== "sponsor" && url !== "usage" && (
                            <Div>
                                <BoardNavigate />
                            </Div>
                        )}
                    </StickyDiv>
                    <Div $padding="0 15px">
                        <Suspense fallback={<Img src="/images/loading.svg" />}>
                            { ["contest", "activity"].includes(url) ? (<Contest />) :
                                <NavigateTable
                                    width={widthList}
                                    header={headerInfo}
                                    contents={boardList}
                                    pinnedContents={boardPinnedList}
                                    url="detail"
                                />
                            }
                        </Suspense>
                        {checkWritingAuthorization() && (
                            <FlexDiv width="100%" $justifycontent="end" $margin="20px 0 0 0">
                                <Button
                                    display="flex"
                                    $backgroundColor="bgColor"
                                    $margin="0 10px 0 0"
                                    $padding="12px 15px"
                                    $borderRadius={30}
                                    $HBackgroundColor="bgColorHo"
                                    onClick={() => {console.log('클릭');navigate(`/board/${url}/create`);}}
                                >
                                    <FlexDiv height="15px">
                                        <Div width="12px" height="12px" $margin="0 10px 0 0">
                                            <Img src="/images/plus_white.svg" />
                                        </Div>
                                    </FlexDiv>
                                    <Div $pointer height="15px">
                                        <A color="wh" fontSize="sm" $hoverColor="wh">
                                            게시글 작성
                                        </A>
                                    </Div>
                                </Button>
                            </FlexDiv>
                        )}
                        {/* 게시판 */}
                        {boardList && boardList.length !== 0 && (
                            <Pagination
                                totalPage={totalPage}
                                fetchUrl={`${fetchUrl}`}
                                token
                                paginationFetch={fetchBoardListData}
                            />
                        )}
                        {/* 공모전 */}
                        {contestListData && contestListData.length !== 0 && (
                            <Pagination
                                totalPage={totalPage}
                                fetchUrl={`${fetchUrl}`}
                                paginationFetch={fetchBoardListData}
                            />
                        )}
                    </Div>
                </Container>
            )}
        </>
    );
};

export default BoardList;
