import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { DateFunction } from "../../Functions/dateFunction";
import useFetch from "../../Hooks/useFetch";
import { commentInfo } from "../../Recoil/backState";
import { refetch } from "../../Recoil/frontState";
import { commentInterface, commentPropsInterface } from "../../Types/TypeCommon";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import { TextArea } from "../../styles/assets/Input";
import P from "../../styles/assets/P";
import { theme } from "../../styles/theme";
import CommentInput from "./CommentInput";

const Comment = (props: commentPropsInterface) => {
    const { boardId, menuId } = props;
    const { formatDateMinute } = DateFunction();
    const [commentData, fetchCommentData] = useFetch();
    const [commentDeleteData, fetchCommentDeleteData] = useFetch();
    const [comment, setComment] = useRecoilState(commentInfo);
    const [updating, setUpdating] = useState("nothing");
    const [commentInput, setCommentInput] = useState("");
    const [putComment, fetchPutComment] = useFetch();
    const [reload, setReload] = useRecoilState(refetch);
    const [showCommentInputId, setShowCommentInputId] = useState<number | null>(null);
    const [isCommentInputVisible, setCommentInputVisible] = useState(false);

    const handleCommentButtonClick = (id: number) => {
        // 댓글 입력 상태 토글
        setCommentInputVisible(!isCommentInputVisible);
        setShowCommentInputId(id);
    };

    const deleteComment = (id: number) => {
        if (window.confirm("댓글을 정말로 삭제하시겠습니까?")) {
            fetchCommentDeleteData(`/comment/${id}`, "DELETE", "token");
        }
    };

    const checkCommentInput = () => {
        if (commentInput === "") {
            alert("댓글을 입력해주세요");
            return false;
        }

        return true;
    };

    const updateComment = (id: number) => {
        if (checkCommentInput() === false) {
            return;
        }
        const inputData = {
            content: commentInput,
        };

        fetchPutComment(`/comment/${id}`, "PUT", "token", inputData);
    };

    useEffect(() => {
        fetchCommentData(`/board/${menuId}/${boardId}/comments`, "GET", "token");
        setUpdating("nothing");
    }, [commentDeleteData, putComment]);

    useEffect(() => {
        if (reload) {
            fetchCommentData(`/board/${menuId}/${boardId}/comments`, "GET", "token");
            setUpdating("nothing");
            setReload(false);
        }
    }, [reload]);

    // 댓글 데이터를 트리 구조로 변환하는 함수
    const convertToCommentTree = (
        comments: (commentInterface | any)[],
        parentAuthor: string = "",
        parentComment: string = ""
    ): commentInterface[] => {
        const commentTree: commentInterface[] = [];

        Object.values(comments).forEach((comment: commentInterface) => {
            const updatedComment: commentInterface = {
                ...comment,
                parentAuthor: parentAuthor,
                parentComment: parentComment,
            };

            if (comment.childrenComment && comment.childrenComment.length > 0) {
                const convertedChildren = convertToCommentTree(
                    comment.childrenComment,
                    comment.writer.name || "",
                    comment.content || ""
                );
                updatedComment.childrenComment = convertedChildren;
            }
            commentTree.push(updatedComment);
        });

        return commentTree;
    };

    // 대댓글에 대한 댓글 렌더링 부분 재귀적으로 수정
    const renderCommentsRecursively = (comments: commentInterface[], depth: number) => {
        return comments.map((comment: commentInterface) => (
            <Div
                width="100%"
                $margin="15px 0"
                $borderT={!depth ? `1px solid ${theme.color.border}` : "none"}
                key={`${comment.id}_${depth}_${comment.writer.id}`}
            >
                <Div width="100%" $border="1px solid" $margin="15px 0" $padding="20px" $borderColor="grey1">
                    <Div width="100%">
                        <FlexDiv width="100%" $padding="0 0 20px 0">
                            <FlexDiv width="100%" $justifycontent="space-between">
                                <FlexDiv>
                                    <FlexDiv
                                        width="30px"
                                        height="30px"
                                        radius={100}
                                        overflow="hidden"
                                        $margin="0 5px 0 0"
                                    >
                                        <Img src={comment?.writer.pictureUrl} $objectFit="cover" />
                                    </FlexDiv>
                                    <FlexDiv height="30px">
                                        <FlexDiv>
                                            <Div>
                                                <P fontSize="sm" fontWeight={700}>
                                                    {comment?.writer.name}
                                                </P>
                                            </Div>
                                            <Div>
                                                <FlexDiv>
                                                    <Div>
                                                        <P fontSize="xs" color="grey4">
                                                            ({comment?.writer.major}) |
                                                        </P>
                                                    </Div>
                                                    <FlexDiv width="13px" height="13px" $margin="0 5px">
                                                        <Img src="/images/clock_grey.svg"></Img>
                                                    </FlexDiv>
                                                    <Div>
                                                        <P fontSize="xs" color="grey4">
                                                            {formatDateMinute({
                                                                date: String(comment?.dateUpdated) || "",
                                                            })}
                                                        </P>
                                                    </Div>
                                                </FlexDiv>
                                            </Div>
                                        </FlexDiv>
                                    </FlexDiv>
                                </FlexDiv>
                                <Div>
                                    <FlexDiv width="100%" $justifycontent="space-between">
                                        <FlexDiv $pointer onClick={() => handleCommentButtonClick(comment?.id)}>
                                            <FlexDiv width="13px" height="13px" $margin="0 5px 0 0">
                                                <Img src="/images/comment_purple.svg"></Img>
                                            </FlexDiv>
                                            <Div>
                                                <P color="bgColor" fontSize="xs">
                                                    답글쓰기
                                                </P>
                                            </Div>
                                        </FlexDiv>
                                        <FlexDiv>
                                            {updating === "nothing" && (
                                                <FlexDiv
                                                    $margin="0 0 0 15px"
                                                    $pointer
                                                    onClick={() => setUpdating("update")}
                                                >
                                                    <FlexDiv width="13px" height="13px" $margin="0 5px 0 0">
                                                        <Img src="/images/pencil_purple.svg"></Img>
                                                    </FlexDiv>
                                                    <Div>
                                                        <P color="bgColor" fontSize="xs">
                                                            수정
                                                        </P>
                                                    </Div>
                                                </FlexDiv>
                                            )}
                                            {updating === "update" && (
                                                <FlexDiv
                                                    $margin="0 0 0 15px"
                                                    $pointer
                                                    onClick={() => updateComment(comment?.id)}
                                                >
                                                    <FlexDiv width="13px" height="13px" $margin="0 5px 0 0">
                                                        <Img src="/images/pencil_purple.svg"></Img>
                                                    </FlexDiv>
                                                    <Div>
                                                        <P color="bgColor" fontSize="xs">
                                                            등록
                                                        </P>
                                                    </Div>
                                                </FlexDiv>
                                            )}
                                            <FlexDiv
                                                $margin="0 0 0 15px"
                                                $pointer
                                                onClick={() => deleteComment(comment?.id)}
                                            >
                                                <FlexDiv width="13px" height="13px" $margin="0 5px 0 0">
                                                    <Img src="/images/trash_purple.svg"></Img>
                                                </FlexDiv>
                                                <Div>
                                                    <P color="bgColor" fontSize="xs">
                                                        삭제
                                                    </P>
                                                </Div>
                                            </FlexDiv>
                                        </FlexDiv>
                                    </FlexDiv>
                                </Div>
                            </FlexDiv>
                        </FlexDiv>
                    </Div>
                    {depth !== 0 && (
                        <FlexDiv width="100%" $justifycontent="start">
                            <Div $margin="0 10px 0 0">
                                <P fontSize="sm" fontWeight={300} $lineHeight={1.5} color="blue">
                                    @{comment?.parentAuthor}
                                </P>
                            </Div>
                            <Div width="90%" overflow="hidden" $whiteSpace="nowrap">
                                <P fontSize="sm" fontWeight={300} $lineHeight={1.5} color="grey2">
                                    {comment?.parentComment}
                                </P>
                            </Div>
                        </FlexDiv>
                    )}
                    {updating === "nothing" && (
                        <Div>
                            <P $whiteSpace="wrap" fontSize="sm" fontWeight={300} $lineHeight={1.5}>
                                {comment?.content}
                            </P>
                        </Div>
                    )}
                    {updating === "update" && (
                        <Div $margin="15px 0" width="100%">
                            <TextArea
                                width="100%"
                                $padding="20px"
                                $borderRadius={30}
                                fontSize="sm"
                                height="150px"
                                $borderColor="border"
                                placeholder="댓글을 남겨보세요!"
                                defaultValue={comment?.content}
                                onChange={(e: any) => setCommentInput(() => e.target.value)}
                            />
                        </Div>
                    )}
                    {showCommentInputId === comment?.id && isCommentInputVisible && (
                        <Div width="100%" $padding="20px 0 0 0">
                            <CommentInput boardId={props.boardId} menuId={props.menuId} parentId={comment?.id} />
                        </Div>
                    )}
                </Div>
                {/* 대댓글 렌더링 */}
                {comment.childrenComment && (
                    <Div width="100%" $padding="0 0 0 20px">
                        {/* <Div width="100%" $padding={depth >= 4 ? "0" : "0 0 0 20px"}> */}
                        {renderCommentsRecursively(comment.childrenComment, depth + 1)}
                    </Div>
                )}
            </Div>
        ));
    };

    useEffect(() => {
        if (commentData) {
            const convertedComments = convertToCommentTree(commentData);
            setComment(convertedComments);
        }
    }, [commentData]);

    useEffect(() => console.log(comment), [comment]);

    return <>{comment && renderCommentsRecursively(Object.values(comment), 0)}</>;
};

export default Comment;
