import { useEffect, useState } from "react";

import { theme } from "../../../../styles/theme";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";
import A from "../../../../styles/assets/A";
import useFetch from "../../../../Hooks/useFetch";

import Pagination from "../../../Common/Pagination";
import Loading from "../../../Common/Loading";

import { useRecoilState } from "recoil";
import { myCommentsInfo } from "../../../../Recoil/backState";

import { myCommentInterface } from "../../../../Types/TypeCommon";

const MyCommentTable = () => {
    const headerInfo = ["게시판 유형", "댓글 내용", "작성일"];
    const widthList = [15, 65, 15];

    const [commentList, setCommentList] = useRecoilState(myCommentsInfo);
    const [commentListData, fetchCommentListData] = useFetch();
    const [totalPage, setTotalPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCommentListData('/myInfo/comments?page=0&size=7', 'GET', 'token')
        setIsLoading(true);
    }, [])

    useEffect(() => {
        if (commentListData) {
            const contents = commentListData.data.map((item: myCommentInterface, idx: number) => ({
                id: item.id,
                menuId: item.menuId,
                menuType: item.menuType,
                menuName: item.menuName,
                content: item.content,
                dateCreated: item.dateCreated.split('T')[0],
                isDeleted: item.isDeleted,
            }))
            console.log(commentListData)
            setCommentList(contents);
            setTotalPage(commentListData.pageInfo.totalPages);
            setIsLoading(false);

        }
    }, [commentListData])

    return (
        <>
            {isLoading ? (
                <FlexDiv width="100%" height="30vh">
                    <Loading />
                </FlexDiv>
            ) : (
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
                                <FlexDiv
                                    key={`headerInfo${idx}`}
                                    $minWidth={`${widthList[idx]}%`}
                                    $padding="10px"
                                    $justifycontent={idx === 1 ? "start" : "center"}
                                >
                                    <Div>
                                        <P fontWeight={700}>{item}</P>
                                    </Div>
                                </FlexDiv>
                            ))}
                        </FlexDiv>
                        {commentList.length === 0 ? (
                            <FlexDiv
                            width="100%"
                            height="45px"
                            $borderT={`1px solid ${theme.color.grey1}`}
                            $padding="0 18px"
                            $backgroundColor="wh"
                            >
                                <Div>
                                    <P>내가 작성한 댓글이 존재하지 않습니다</P>
                                </Div>
                            </FlexDiv>
                        ) : (
                            commentList.map((element: object, idx: number) => (
                                <FlexDiv
                                    key={`contentItem${idx}`}
                                    width="100%"
                                    height="45px"
                                    $borderT={`1px solid ${theme.color.grey1}`}
                                    $justifycontent="space-between"
                                    $backgroundColor="wh"
                                >
                                    {Object.values(element).slice(3,6).map((item: any, idx: number) => (
                                        <FlexDiv
                                        key={`itemValue${idx}`}
                                        width={`${widthList[idx]}%`}
                                        $padding="10px"
                                        $justifycontent={idx === 1 ? "space-between" : "center"}
                                        >
                                            {idx === 1 ? (
                                                <FlexDiv width="100%" $justifycontent= "space-between">
                                                    <Div width="90%">
                                                        <P fontWeight={700}>
                                                        {(element as { isDeleted: boolean }).isDeleted ? `${item} (삭제)` : item}
                                                        </P>
                                                    </Div>
                                                    <Div width="10%">
                                                        <A color="bgColor" href={`/board/${(element as { menuType: string }).menuType.toLowerCase()}/detail/${(element as { id: number }).id}`}>
                                                            원문보기 ▶
                                                        </A>
                                                    </Div>
                                                </FlexDiv>
                                            ) : (
                                                <Div>
                                                    <P>{item}</P>
                                                </Div>
                                            )}
                                        </FlexDiv>
                                    ))}
                                </FlexDiv>
                            ))
                        )}

                        {/* <Pagination /> */}
                        {commentList && commentList.length !== 0 && (
                            <Pagination
                                totalPage={totalPage}
                                fetchUrl={`/myInfo/comments`}
                                token
                                paginationFetch={fetchCommentListData}
                                size={7}
                            />
                        )}
                    </Div>
                </>
            )}
        </>
    );
};

export default MyCommentTable;
