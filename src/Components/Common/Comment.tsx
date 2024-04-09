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

    useEffect(() => {
        if (commentData) {
            const content = (Object.values(commentData) as commentInterface[]).map((item) => ({
                id: item.id,
                content: item.content,
                dateUpdated: item.dateUpdated,
                writer: {
                    id: item.writer.id,
                    name: item.writer.name,
                    major: item.writer.major,
                    pictureUrl: item.writer.pictureUrl,
                },
            }));
            setComment(content);
        }
    }, [commentData]);

    useEffect(() => {
        console.log(typeof comment);
    }, [comment]);

    return (
        <>
            {comment &&
                comment.map((element: commentInterface) => (
                    <Div width="100%" $margin="30px 0" $borderT={`1px solid ${theme.color.border}`}>
                        <Div width="100%" $border="1px solid" $margin="30px 0" $padding="20px" $borderColor="grey1">
                            <FlexDiv width="100%" $justifycontent="start">
                                <FlexDiv width="50px" height="50px" radius={100} overflow="hidden" $margin="0 10px 0 0">
                                    <Img src={element?.writer.pictureUrl} $objectFit="cover" />
                                </FlexDiv>
                                <Div>
                                    <P fontWeight={700}>{element?.writer.name}</P>
                                    <FlexDiv $justifycontent="start" $margin="5px 0 ">
                                        <Div>
                                            <P fontSize="xs" color="grey4">
                                                {element?.writer.major} | {/* 19학번도 있어야 할까? */}
                                            </P>
                                        </Div>
                                        <FlexDiv width="13px" height="13px" $margin="0 5px">
                                            <Img src="/images/clock_grey.svg"></Img>
                                        </FlexDiv>
                                        <Div>
                                            <P fontSize="xs" color="grey4">
                                                {formatDateMinute({ date: String(element?.dateUpdated) || "" })}
                                            </P>
                                        </Div>
                                    </FlexDiv>
                                </Div>
                            </FlexDiv>
                            {updating === "nothing" && (
                                <Div $margin="20px 0">
                                    <P $whiteSpace="wrap" fontWeight={300} $lineHeight={1.5}>
                                        {element?.content}
                                    </P>
                                </Div>
                            )}
                            {updating === "update" && (
                                <Div $margin="20px 0" width="100%">
                                    <TextArea
                                        width="100%"
                                        $padding="20px"
                                        $borderRadius={30}
                                        height="150px"
                                        $borderColor="border"
                                        placeholder="댓글을 남겨보세요!"
                                        defaultValue={element?.content}
                                        onChange={(e: any) => setCommentInput(() => e.target.value)}
                                    />
                                </Div>
                            )}
                            <FlexDiv width="100%" $justifycontent="space-between">
                                <FlexDiv $pointer>
                                    <FlexDiv width="13px" height="13px" $margin="0 5px 0 0">
                                        <Img src="/images/comment_purple.svg"></Img>
                                    </FlexDiv>
                                    <Div>
                                        <P color="bgColor" fontSize="sm">
                                            답글쓰기
                                        </P>
                                    </Div>
                                </FlexDiv>
                                <FlexDiv>
                                    {updating === "nothing" && (
                                        <FlexDiv $margin="0 0 0 20px" $pointer onClick={() => setUpdating("update")}>
                                            <FlexDiv width="13px" height="13px" $margin="0 5px 0 0">
                                                <Img src="/images/pencil_purple.svg"></Img>
                                            </FlexDiv>
                                            <Div>
                                                <P color="bgColor" fontSize="sm">
                                                    수정
                                                </P>
                                            </Div>
                                        </FlexDiv>
                                    )}
                                    {updating === "update" && (
                                        <FlexDiv
                                            $margin="0 0 0 20px"
                                            $pointer
                                            onClick={() => updateComment(element?.id)}
                                        >
                                            <FlexDiv width="13px" height="13px" $margin="0 5px 0 0">
                                                <Img src="/images/pencil_purple.svg"></Img>
                                            </FlexDiv>
                                            <Div>
                                                <P color="bgColor" fontSize="sm">
                                                    등록
                                                </P>
                                            </Div>
                                        </FlexDiv>
                                    )}
                                    {/* 삭제는 댓글 작성자 본인, 부회장 이상의 권한을 가지고 있는 사람만 가능함. 이미 삭제한 댓글의 경우 삭제버튼이 안보이게 설정해야함 */}
                                    <FlexDiv $margin="0 0 0 20px" $pointer onClick={() => deleteComment(element?.id)}>
                                        <FlexDiv width="13px" height="13px" $margin="0 5px 0 0">
                                            <Img src="/images/trash_purple.svg"></Img>
                                        </FlexDiv>
                                        <Div>
                                            <P color="bgColor" fontSize="sm">
                                                삭제
                                            </P>
                                        </Div>
                                    </FlexDiv>
                                </FlexDiv>
                            </FlexDiv>
                        </Div>
                    </Div>
                ))}
        </>
    );
};

export default Comment;
