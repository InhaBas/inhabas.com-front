import { useEffect, useRef } from "react";

import { theme } from "../../../styles/theme";

import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { DateFunction } from "../../../Functions/dateFunction";
import useFetch from "../../../Hooks/useFetch";
import { boardListDataInfo, totalPageInfo } from "../../../Recoil/backState";
import { boardListInterface } from "../../../Types/TypeBoard";
import Button from "../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";
import { SearchInput } from "../../../styles/assets/Input";
import P from "../../../styles/assets/P";

const BoardSearch = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    const location = useLocation();
    const url = location.pathname.split("/")[2];

    const { formatDateDay } = DateFunction();

    const [boardList, setBoardList] = useRecoilState(boardListDataInfo);
    const [boardListData, fetchBoardListData] = useFetch();
    const [totalPage, setTotalPage] = useRecoilState(totalPageInfo);

    const searchEvent = () => {
        if (inputRef.current !== null && inputRef.current.value !== null) {
            if (url === "opensource") {
                fetchBoardListData("/board/storagesearch=${inputRef.current}&page=0&size=15", "GET", "token");
            } else if (url === "alpha" || url === "beta") {
                console.log("sss");
            } else {
                fetchBoardListData(`/board/${url}?search=${inputRef.current.value}&page=0&size=15`, "GET", "token");
            }
        }
    };

    useEffect(() => {
        if (boardListData) {
            const contents = boardListData.data.map((item: boardListInterface, idx: number) => ({
                id: idx + 1,
                title: item.title,
                dateCreated: formatDateDay({ date: item.dateCreated }),
                writerName: item.writerName,
                isPinned: item.isPinned,
            }));
            setBoardList(contents);
            setTotalPage(boardListData.pageInfo.totalPages);
        }
    }, [boardListData]);

    return (
        <>
            <Div width="263px" height="147px" $border={`2px solid`} $borderColor="border" $padding="30px 20px 10px">
                <Div $borderL={`4px solid ${theme.color.bgColor}`} $padding="5px 0 5px 20px" $margin="0 0 15px 0">
                    <P fontSize="xl" fontWeight={700}>
                        게시글 검색
                    </P>
                </Div>

                <FlexDiv wrap="nowrap">
                    <Div>
                        <SearchInput placeholder="검색어를 입력하세요." ref={inputRef} />
                    </Div>
                    <Button
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
                    </Button>
                </FlexDiv>
            </Div>
        </>
    );
};

export default BoardSearch;
