import { useEffect, useState } from "react";
import useFetch from "../../Hooks/useFetch";
import { paginationPropsInterface } from "../../Types/TypeCommon";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";
import { theme } from "../../styles/theme";

const Pagination = (props: paginationPropsInterface) => {
    const { totalPage, fetchUrl, search, size, token, paginationFetch } = props;

    const [currentPage, setCurrentPage] = useState(1);
    const [pageChange, setPageChange] = useState(false);
    const [leftHovered, setLeftHovered] = useState(false);
    const [rightHovered, setRightHovered] = useState(false);
    const [allLeftHovered, setAllLeftHovered] = useState(false);
    const [allRightHovered, setAllRightHovered] = useState(false);

    const makePageNum = () => {
        const startPage = Math.max(1, currentPage - 2); // 현재 페이지를 중앙에 위치시키기 위한 조정

        let pageNumList = [];
        for (let i = startPage; i < startPage + 5 && i <= totalPage; i++) {
            pageNumList.push(
                <FlexDiv
                    onClick={() => {
                        setCurrentPage(i);
                        setPageChange(true);
                    }}
                    key={`page${i}`}
                    display="flex"
                    width="45px"
                    height="45px"
                    $padding="5px"
                    $margin="5px"
                    $pointer
                    $backgroundColor={i !== currentPage ? "wh" : "bgColor"}
                    $border={`2px solid ${theme.color.bk}`}
                    radius={50}
                >
                    <Div>
                        <P color={i !== currentPage ? "textColor" : "wh"} fontWeight={700}>
                            {i}
                        </P>
                    </Div>
                </FlexDiv>
            );
        }

        return pageNumList;
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [totalPage]);

    useEffect(() => {
        let paginationFetchUrl = fetchUrl;
        if (!paginationFetchUrl.includes('?')) {
            paginationFetchUrl += `?page=${currentPage - 1}`;
        } else {
            paginationFetchUrl += `&page=${currentPage - 1}`;
        }
        if (size !== undefined) {
            paginationFetchUrl += `&size=${size}`;
        } else {
            paginationFetchUrl += "&size=10";
        }
        if (search !== undefined) {
            paginationFetchUrl += search;
        }

        if (pageChange === true) {
            if (token) {
                paginationFetch(paginationFetchUrl, "GET", "token");
            } else {
                paginationFetch(paginationFetchUrl, "GET");
            }

            setPageChange(false);
        }
    }, [pageChange]);

    return (
        <FlexDiv width="100%" $padding="20px 0">
            {totalPage !== 1 && (
                <>
                    <Div
                        onMouseEnter={() => setAllLeftHovered(true)}
                        onMouseLeave={() => setAllLeftHovered(false)}
                        onClick={() => {
                            if (currentPage !== 1) {
                                setCurrentPage(1);
                                setPageChange(true);
                            }
                        }}
                        $pointer
                        $margin="0 8px"
                    >
                        <FlexDiv
                            width="45px"
                            height="45px"
                            $padding="5px"
                            $margin="5px"
                            radius={50}
                            $backgroundColor={allLeftHovered ? "bgColor" : "wh"}
                            $pointer
                        >
                            <FlexDiv width="13px">
                                {allLeftHovered ? (
                                    <Img src="/images/angles-left_white.svg" />
                                ) : (
                                    <Img src="/images/angles-left_purple.svg" />
                                )}
                            </FlexDiv>
                        </FlexDiv>
                    </Div>

                    <Div
                        onMouseEnter={() => setLeftHovered(true)}
                        onMouseLeave={() => setLeftHovered(false)}
                        onClick={() => {
                            if (currentPage !== 1) {
                                setCurrentPage(currentPage - 1);
                                setPageChange(true);
                            }
                        }}
                        $pointer
                        $margin="0 8px"
                    >
                        <FlexDiv
                            width="45px"
                            height="45px"
                            $padding="5px"
                            $margin="5px"
                            radius={50}
                            $backgroundColor={leftHovered ? "bgColor" : "wh"}
                            $pointer
                        >
                            <FlexDiv width="10px">
                                {leftHovered ? (
                                    <Img src="/images/arrow-left_white.svg" />
                                ) : (
                                    <Img src="/images/arrow-left_purple.svg" />
                                )}
                            </FlexDiv>
                        </FlexDiv>
                    </Div>
                </>
            )}

            {makePageNum()}

            {totalPage !== 1 && (
                <>
                    <Div
                        onMouseEnter={() => setRightHovered(true)}
                        onMouseLeave={() => setRightHovered(false)}
                        onClick={() => {
                            if (currentPage !== totalPage) {
                                setCurrentPage(currentPage + 1);
                                setPageChange(true);
                            }
                        }}
                        $pointer
                        $margin="0 8px"
                    >
                        <FlexDiv
                            width="45px"
                            height="45px"
                            $padding="5px"
                            $margin="5px"
                            radius={50}
                            $backgroundColor={rightHovered ? "bgColor" : "wh"}
                            $pointer
                        >
                            <FlexDiv width="10px">
                                {rightHovered ? (
                                    <Img src="/images/arrow-right_white.svg" />
                                ) : (
                                    <Img src="/images/arrow-right_purple.svg" />
                                )}
                            </FlexDiv>
                        </FlexDiv>
                    </Div>

                    <Div
                        onMouseEnter={() => setAllRightHovered(true)}
                        onMouseLeave={() => setAllRightHovered(false)}
                        onClick={() => {
                            setCurrentPage(totalPage);
                            setPageChange(true);
                        }}
                        $pointer
                        $margin="0 8px"
                    >
                        <FlexDiv
                            width="45px"
                            height="45px"
                            $padding="5px"
                            $margin="5px"
                            radius={50}
                            $backgroundColor={allRightHovered ? "bgColor" : "wh"}
                            $pointer
                        >
                            <FlexDiv width="13px">
                                {allRightHovered ? (
                                    <Img src="/images/angles-right_white.svg" />
                                ) : (
                                    <Img src="/images/angles-right_purple.svg" />
                                )}
                            </FlexDiv>
                        </FlexDiv>
                    </Div>
                </>
            )}
        </FlexDiv>
    );
};

export default Pagination;