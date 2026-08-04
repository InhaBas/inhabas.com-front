import { useEffect, useRef, useState } from "react";

import styled from "styled-components";
import { media, theme } from "../../styles/theme";

import { useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { DateFunction } from "../../functions/dateFunction";
import useFetch from "../../hooks/useFetch";
import {
    boardListDataInfo,
    boardListPinnedDataInfo,
    contestListDataInfo,
    totalPageInfo,
} from "../../recoil/backState";
import { boardListInterface } from "../../types/TypeBoard";
import Button from "../../styles/assets/Button";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import { SearchInput } from "../../styles/assets/Input";
import P from "../../styles/assets/P";

const SearchBox = styled(Div)`
    width: 263px;
    height: 147px;
    border: 2px solid ${theme.color.border};
    padding: 30px 20px 10px;

    ${media.tablet} {
        width: 100%;
        height: auto;
    }

    ${media.mobile} {
        padding: 20px 16px;
    }
`;

const SearchRow = styled(FlexDiv)`
    width: 100%;
    flex-wrap: nowrap;
`;

const SearchField = styled(Div)`
    flex: 1 1 auto;
    min-width: 0;
`;

const ResponsiveSearchInput = styled(SearchInput)`
    width: 100%;
    min-width: 0;
`;

const SearchButton = styled(Button)`
    flex: 0 0 53px;
`;

const BoardSearch = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const location = useLocation();
    const url = location.pathname.split("/")[2];

    const { formatDateDay } = DateFunction();

    const setBoardList = useSetRecoilState(boardListDataInfo);
    const [boardListData, fetchBoardListData] = useFetch();
    const setTotalPage = useSetRecoilState(totalPageInfo);
    const setBoardPinnedList = useSetRecoilState(boardListPinnedDataInfo);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState(""); // 검색어
    const setContestListData = useSetRecoilState(contestListDataInfo);

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
        fetchUrl = "/contest/contest";
    } else if (url === "activity") {
        fetchUrl = "/contest/activity";
    } else {
        fetchUrl = `/board/${url}`;
    }

    // 검색어 변경 핸들러
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const searchEvent = () => {
        // 토큰 없이 fetch
        if (searchValue.trim() !== "") {
            if (["usage", "sponsor"].includes(url)) {
                fetchBoardListData(`${fetchUrl}?search=${searchValue}&page=0&size=15`, "GET");
                setIsLoading(true);
            } else if (["contest", "activity"].includes(url)) {
                fetchBoardListData(`${fetchUrl}?search=${searchValue}&page=0&size=4&orderBy=ALL`, "GET");
                setIsLoading(true);
            } else {
                fetchBoardListData(`${fetchUrl}?search=${searchValue}&page=0&size=15`, "GET", "token");
                setIsLoading(true);
            }
        }
    };

    // 엔터키 press 핸들러
    const enterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            searchEvent();
        }
    };

    useEffect(() => {
        if (["contest", "activity"].includes(url)) {
            if (boardListData) {
                setIsLoading(false);
                setContestListData(boardListData?.data);
                setTotalPage(boardListData.pageInfo.totalPages);
            }
        } else {
            if (boardListData) {
                const contents = boardListData.data.map((item: boardListInterface, idx: number) => ({
                    number: idx + 1,
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

    return (
        <>
            <SearchBox>
                <Div $borderL={`4px solid ${theme.color.bgColor}`} $padding="5px 0 5px 20px" $margin="0 0 15px 0">
                    <P fontSize="xl" fontWeight={700}>
                        게시글 검색
                    </P>
                </Div>

                <SearchRow width="100%">
                    <SearchField>
                        <ResponsiveSearchInput
                            placeholder="검색어를 입력하세요."
                            onKeyDown={enterKeyDown}
                            onChange={handleSearchChange}
                        />
                    </SearchField>
                    <SearchButton
                        $backgroundColor="bgColor"
                        width="53px"
                        height="40px"
                        $padding="10px 20px"
                        $borderRadius={3}
                        $HBackgroundColor="bgColorHo"
                        onClick={() => searchEvent()}
                    >
                        <Div width="13px">
                            <Img src="/images/search_white.svg"></Img>
                        </Div>
                    </SearchButton>
                </SearchRow>
            </SearchBox>
        </>
    );
};

export default BoardSearch;
