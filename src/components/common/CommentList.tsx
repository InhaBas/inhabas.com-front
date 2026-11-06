import { useMutation, useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import CommentInput from './CommentInput';
import { GetRoleAuthorization } from '../../functions/authFunctions';
import { DateFunction } from '../../functions/dateFunction';
import { commentMutations, commentQueries } from '../../queries/comment';
import { tokenAccess } from '../../recoil/backState';
import { Div, FlexDiv } from '../../styles/assets/Div';
import Img from '../../styles/assets/Img';
import { TextArea } from '../../styles/assets/Input';
import P from '../../styles/assets/P';
import { media, theme } from '../../styles/theme';
import {
  commentListInterface,
  commentPropsInterface,
  tokenInterface,
} from '../../types/TypeCommon';

const CommentCard = styled(Div)`
  min-width: 0;

  ${media.mobile} {
    padding: 14px;
  }
`;

const CommentHeader = styled(FlexDiv)`
  min-width: 0;
`;

const CommentHeaderLayout = styled(FlexDiv)`
  min-width: 0;
  flex-wrap: nowrap;

  ${media.mobile} {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }
`;

const AuthorBlock = styled(FlexDiv)`
  min-width: 0;
  flex-wrap: nowrap;
  align-items: flex-start;
`;

const AuthorMeta = styled(FlexDiv)`
  min-width: 0;

  ${media.mobile} {
    height: auto;
    justify-content: flex-start;
  }
`;

const AuthorInfo = styled(FlexDiv)`
  min-width: 0;
  justify-content: flex-start;
  row-gap: 4px;
`;

const WriterDetails = styled(FlexDiv)`
  min-width: 0;
  justify-content: flex-start;
  row-gap: 4px;
`;

const WrapText = styled(P).attrs({ $whiteSpace: 'normal' })`
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  overflow-wrap: anywhere;
`;

const ActionContainer = styled(Div)`
  min-width: 0;

  ${media.mobile} {
    width: 100%;
  }
`;

const ActionBar = styled(FlexDiv)`
  gap: 8px 0;

  ${media.mobile} {
    justify-content: flex-start;
  }
`;

const ParentPreview = styled(FlexDiv)`
  min-width: 0;
  flex-wrap: nowrap;
  align-items: flex-start;
`;

const ParentAuthor = styled(Div)`
  flex: 0 1 auto;
  min-width: 0;
  max-width: 40%;
`;

const ParentComment = styled(Div)`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
`;

const EditingTextArea = styled(TextArea)`
  max-width: 100%;
  white-space: pre-wrap;
  overflow-wrap: anywhere;

  ${media.mobile} {
    padding: 16px;
    border-radius: 20px;
  }
`;

const CommentContent = styled(P).attrs({ $whiteSpace: 'pre-wrap' })`
  white-space: pre-wrap;
  overflow: visible;
  text-overflow: clip;
  overflow-wrap: anywhere;
  word-break: break-word;
`;

const Replies = styled(Div)<{ $depth: number }>`
  width: 100%;
  min-width: 0;
  padding-left: ${(props) => (props.$depth <= 4 ? '20px' : '0')};

  ${media.tablet} {
    padding-left: ${(props) => (props.$depth <= 3 ? '12px' : '0')};
  }

  ${media.mobile} {
    padding-left: ${(props) => (props.$depth <= 2 ? '8px' : '0')};
  }
`;

const CommentList = (props: commentPropsInterface) => {
  const { boardId, menuId, token } = props;
  const { formatDateMinute } = DateFunction();
  const { isAuthorizedOverVice, isAuthorizedOverDeactivate } = GetRoleAuthorization();
  // 공개 게시판(token === false)은 토큰 없이 조회한다
  const { data: commentData } = useQuery(
    commentQueries.list({ menuId, boardId, auth: token !== false }),
  );
  const updateMutation = useMutation(commentMutations.update());
  const deleteMutation = useMutation(commentMutations.delete());
  const [commentInput, setCommentInput] = useState('');
  const [showCommentInputId, setShowCommentInputId] = useState<number | null>(null);
  const [isCommentInputVisible, setCommentInputVisible] = useState(false);
  const access = useRecoilValue(tokenAccess);
  // 수정 중인 댓글의 ID를 추적하는 상태
  const [editingCommentId, setEditingCommentId] = useState<number>();

  let decoded: tokenInterface | undefined;
  if (access !== 'default') {
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

  const findCommentById = (
    id: number,
    comments: commentListInterface[],
  ): commentListInterface | undefined => {
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
    setCommentInput('');
    if (editingCommentId === id) {
      setEditingCommentId(-1);
      return;
    }
    setEditingCommentId(id);
    const editingComment = commentData && findCommentById(id, commentData);
    if (editingComment) {
      setCommentInput(editingComment.content);
    }
  };

  // 수정 상태인지 확인하는 함수
  const isEditing = (id: number) => editingCommentId === id;

  const checkCommentInput = () => {
    if (commentInput === '') {
      alert('댓글을 입력해주세요');
      return false;
    }

    return true;
  };

  // 수정·삭제 중에는 댓글 내용을 그대로 두고 트리거(등록·삭제)만 막는다
  const isMutating = updateMutation.isPending || deleteMutation.isPending;

  const updateComment = (id: number) => {
    if (isMutating) return;
    if (checkCommentInput() === false) {
      return;
    }

    updateMutation.mutate(
      { id, content: commentInput, menuId, boardId },
      {
        onSuccess: () => {
          setCommentInput('');
          setEditingCommentId(-1);
        },
      },
    );
  };

  const deleteComment = (id: number) => {
    if (isMutating) return;
    if (window.confirm('댓글을 정말로 삭제하시겠습니까?')) {
      deleteMutation.mutate(
        { id, menuId, boardId },
        {
          onSuccess: () => {
            setEditingCommentId(-1);
          },
        },
      );
    }
  };

  // 댓글 데이터를 트리 구조로 변환하는 함수
  const convertToCommentTree = (
    comments: (commentListInterface | any)[],
    parentAuthor: string = '',
    parentComment: string = '',
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
          comment.writer.name || '',
          comment.content || '',
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
        $borderT={!depth ? `1px solid ${theme.color.border}` : 'none'}
        key={`${comment.id}_${depth}_${comment.writer.id}`}
      >
        <CommentCard
          width="100%"
          $border="1px solid"
          $margin="15px 0"
          $padding="20px"
          $borderColor="grey1"
        >
          <Div width="100%">
            <CommentHeader width="100%" $padding="0 0 20px 0">
              <CommentHeaderLayout width="100%" $justifycontent="space-between">
                <AuthorBlock>
                  <FlexDiv
                    width="30px"
                    height="30px"
                    radius={100}
                    overflow="hidden"
                    $margin="0 5px 0 0"
                  >
                    <Img src={comment?.writer.pictureUrl} $objectFit="cover" />
                  </FlexDiv>
                  <AuthorMeta height="30px">
                    <AuthorInfo>
                      <Div>
                        <WrapText fontSize="sm" fontWeight={700}>
                          {comment?.writer.name}
                        </WrapText>
                      </Div>
                      <Div>
                        <WriterDetails>
                          <Div>
                            <WrapText fontSize="xs" color="grey4">
                              ({comment?.writer.major}) |
                            </WrapText>
                          </Div>
                          <FlexDiv width="13px" height="13px" $margin="0 5px">
                            <Img src="/images/clock_grey.svg"></Img>
                          </FlexDiv>
                          <Div>
                            <WrapText fontSize="xs" color="grey4">
                              {formatDateMinute({
                                date: String(comment?.dateUpdated) || '',
                              })}
                            </WrapText>
                          </Div>
                        </WriterDetails>
                      </Div>
                    </AuthorInfo>
                  </AuthorMeta>
                </AuthorBlock>
                <ActionContainer>
                  {isAuthorizedOverDeactivate && !comment.isDeleted && (
                    <ActionBar width="100%" $justifycontent="space-between">
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
                            {!isEditing(comment.id) ? (
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
                                $pointer={!isMutating}
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
                            $pointer={!isMutating}
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
                    </ActionBar>
                  )}
                </ActionContainer>
              </CommentHeaderLayout>
            </CommentHeader>
          </Div>
          {depth !== 0 && (
            <ParentPreview width="100%" $justifycontent="start">
              <ParentAuthor $margin="0 10px 0 0">
                <WrapText fontSize="sm" fontWeight={300} $lineHeight={1.5} color="blue">
                  @{comment?.parentAuthor}
                </WrapText>
              </ParentAuthor>
              <ParentComment>
                <P fontSize="sm" fontWeight={300} $lineHeight={1.5} color="grey2">
                  {comment?.parentComment}
                </P>
              </ParentComment>
            </ParentPreview>
          )}

          {isEditing(comment.id) ? (
            <Div $margin="15px 0" width="100%">
              <EditingTextArea
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
              <CommentContent fontSize="sm" fontWeight={300} $lineHeight={1.5}>
                {comment?.content}
              </CommentContent>
            </Div>
          )}

          {showCommentInputId === comment?.id && isCommentInputVisible && (
            <Div width="100%" $padding="20px 0 0 0">
              <CommentInput boardId={props.boardId} menuId={props.menuId} parentId={comment?.id} />
            </Div>
          )}
        </CommentCard>
        {/* 대댓글 렌더링 */}
        {comment.childrenComment && (
          <Replies $depth={depth + 1}>
            {renderCommentsRecursively(comment.childrenComment, depth + 1)}
          </Replies>
        )}
      </Div>
    ));
  };

  // 옛 화면처럼 첫 조회 중에는 아무것도 그리지 않는다
  return <>{commentData && renderCommentsRecursively(convertToCommentTree(commentData), 0)}</>;
};

export default CommentList;
