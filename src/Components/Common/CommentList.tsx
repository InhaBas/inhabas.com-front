import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { theme } from "../../styles/theme";

import { jwtDecode } from "jwt-decode";
import { GetRoleAuthorization } from "../../Functions/authFunctions";
import { DateFunction } from "../../Functions/dateFunction";

import useFetch from "../../Hooks/useFetch";
import { commentInfo, tokenAccess } from "../../Recoil/backState";
import { refetch } from "../../Recoil/frontState";

import { commentListInterface, commentPropsInterface, tokenInterface } from "../../Types/TypeCommon";

import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import { TextArea } from "../../styles/assets/Input";
import P from "../../styles/assets/P";
import CommentInput from "./CommentInput";
import Loading from "./Loading";

const CommentList = (props: commentPropsInterface) => {
    const { boardId, menuId, token } = props;
    const { formatDateMinute } = DateFunction();
    const { isAuthorizedOverVice, isAuthorizedOverDeactivate } = GetRoleAuthorization();
    const [commentData, fetchCommentData] = useFetch();
    const [commentDeleteData, fetchCommentDeleteData] = useFetch();
    const [comment, setComment] = useRecoilState(commentInfo);
    const [updating, setUpdating] = useState("nothing");
    const [commentInput, setCommentInput] = useState("");
    const [putComment, fetchPutComment] = useFetch();
    const [reload, setReload] = useRecoilState(refetch);
    const [showCommentInputId, setShowCommentInputId] = useState<number | null>(null);
    const [isCommentInputVisible, setCommentInputVisible] = useState(false);
    const access = useRecoilValue(tokenAccess);
    // 수정 중인 댓글의 ID를 추적하는 상태
    const [editingCommentId, setEditingCommentId] = useState<number>();
    const [isLoading, setIsLoading] = useState<null | boolean>(null);

    let decoded;
    if (access !== "default") {
        decoded = jwtDecode(access) as tokenInterface;
    }
    const userId = decoded?.memberId;

    const handleCommentButtonClick = (id: number) => {
        // 댓글 입력 상태 토글
        if (isCommentInputVisible && showCommentInputId === id) {
            // 현재 CommentInput이 보이는 상태이고, 같은 댓글을 클릭한 경우
            // CommentInput을 감추고 상태를 초기화합니다.
            setCommentInputVisible(false);
            setShowCommentInputId(null);
        } else {
            // 댓글 입력 상태 토글
            setCommentInputVisible(true);
            setShowCommentInputId(id);
        }
    };

    const findCommentById = (id: number, comments: commentListInterface[]): commentListInterface | undefined => {
        for (let c of comments) {
            if (c.id === id) return c;
            if (c.childrenComment) {
                const found = findCommentById(id, c.childrenComment);
                if (found) return found;
            }
        }
        return undefined;
    };

    const handleEditButtonClick = (id: number) => {
        setCommentInput("");
        if (editingCommentId === id) {
            setEditingCommentId(-1);
            return;
        }
        setEditingCommentId(id);
        const editingComment = findCommentById(id, comment);
        if (editingComment) {
            setCommentInput(editingComment.content);
        }
    };

    // 수정 상태인지 확인하는 함수
    const isEditing = (id: number) => editingCommentId === id;

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
        setIsLoading(true);
        setCommentInput("");
    };

    const deleteComment = (id: number) => {
        if (window.confirm("댓글을 정말로 삭제하시겠습니까?")) {
            fetchCommentDeleteData(`/comment/${id}`, "DELETE", "token");
            setIsLoading(true);
        }
    };

    useEffect(() => {
        if (token === false) {
            fetchCommentData(`/board/${menuId}/${boardId}/comments`, "GET");
        } else {
            fetchCommentData(`/board/${menuId}/${boardId}/comments`, "GET", "token");
        }
        setUpdating("nothing");
        setEditingCommentId(-1);
        return setComment([]);
    }, [commentDeleteData, putComment]);

    useEffect(() => {
        if (reload) {
            if (token === false) {
                fetchCommentData(`/board/${menuId}/${boardId}/comments`, "GET");
            } else {
                fetchCommentData(`/board/${menuId}/${boardId}/comments`, "GET", "token");
            }
            setUpdating("nothing");
            setReload(false);
        }
    }, [reload]);

    // 댓글 데이터를 트리 구조로 변환하는 함수
    const convertToCommentTree = (
        comments: (commentListInterface | any)[],
        parentAuthor: string = "",
        parentComment: string = ""
    ): commentListInterface[] => {
        const commentTree: commentListInterface[] = [];

        Object.values(comments).forEach((comment: commentListInterface) => {
            const updatedComment: commentListInterface = {
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

    const renderCommentsRecursively = (comments: commentListInterface[], depth: number) => {
        return comments.map((comment: commentListInterface) => (
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
                                    {isAuthorizedOverDeactivate && !comment.isDeleted && (
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
                                                {userId === comment.writer.id && (
                                                    <FlexDiv>
                                                        {updating === "nothing" && !isEditing(comment.id) ? (
                                                            <FlexDiv
                                                                $margin="0 0 0 15px"
                                                                $pointer
                                                                onClick={() => handleEditButtonClick(comment?.id)}
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
                                                        ) : (
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
                                                    </FlexDiv>
                                                )}
                                                {(userId === comment.writer.id || isAuthorizedOverVice) && (
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
                                                )}
                                            </FlexDiv>
                                        </FlexDiv>
                                    )}
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

                    {isLoading && editingCommentId === comment.id ? (
                        <FlexDiv width="100%" height="100px">
                            <Loading />
                        </FlexDiv>
                    ) : isEditing(comment.id) ? (
                        <Div $margin="15px 0" width="100%">
                            <TextArea
                                width="100%"
                                $padding="20px"
                                $borderRadius={30}
                                fontSize="sm"
                                height="150px"
                                $borderColor="border"
                                placeholder="댓글을 남겨보세요!"
                                defaultValue={commentInput}
                                onChange={(e: any) => setCommentInput(e.target.value)}
                            />
                        </Div>
                    ) : (
                        <Div>
                            <P $whiteSpace="wrap" fontSize="sm" fontWeight={300} $lineHeight={1.5}>
                                {comment?.content}
                            </P>
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

    useEffect(() => {
        setIsLoading(false);
    }, [comment]);

    return <>{comment && renderCommentsRecursively(Object.values(comment), 0)}</>;
};

export default CommentList;
