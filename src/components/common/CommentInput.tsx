import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { styled } from 'styled-components';

import { commentMutations } from '../../queries/comment';
import Button from '../../styles/assets/Button';
import { Div, FlexDiv } from '../../styles/assets/Div';
import Img from '../../styles/assets/Img';
import { TextArea } from '../../styles/assets/Input';
import P from '../../styles/assets/P';
import { media, theme } from '../../styles/theme';
import { commentPropsInterface } from '../../types/TypeCommon';

const CommentRelativeDiv = styled(Div)`
  position: relative;
  min-width: 0;
`;

const CommentAbsoluteDiv = styled(Div)`
  position: absolute;
  right: 20px;
  top: 20px;

  ${media.mobile} {
    right: 14px;
    top: 14px;
    margin: 0;
  }
`;

const CommentTextArea = styled(TextArea)`
  max-width: 100%;
  padding-right: 50px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;

  ${media.mobile} {
    padding: 16px 42px 16px 16px;
    border-radius: 20px;
  }
`;

const CommentSubmitButton = styled(Button)`
  max-width: 100%;
`;

const CommentInput = (props: commentPropsInterface) => {
  const { boardId, menuId, parentId } = props;
  const [commentInput, setCommentInput] = useState('');
  const createMutation = useMutation(commentMutations.create());

  const checkCommentInput = () => {
    if (commentInput === '') {
      alert('댓글을 입력해주세요');
      return false;
    }

    return true;
  };

  const clickPostEvent = () => {
    if (createMutation.isPending) return;
    if (checkCommentInput() === false) {
      return;
    }
    const inputData = {
      parentCommentId: parentId !== undefined ? parentId : null,
      content: commentInput,
    };

    // 댓글 목록 재조회는 뮤테이션의 무효화가 맡는다
    createMutation.mutate(
      { menuId, boardId, body: inputData },
      { onSuccess: () => setCommentInput('') },
    );
  };

  return (
    <>
      <Div width="100%" $padding="30px 0 0 0" $borderT={`1px solid ${theme.color.border}`}>
        <CommentRelativeDiv width="100%">
          <CommentTextArea
            width="100%"
            $padding="20px"
            $borderRadius={30}
            height="150px"
            $borderColor="border"
            placeholder="댓글을 남겨보세요!"
            value={commentInput}
            onChange={(e: any) => setCommentInput(() => e.target.value)}
          ></CommentTextArea>

          <CommentAbsoluteDiv width="14px" $margin="0 10px 0 0">
            <Img src="/images/pencil_purple.svg" />
          </CommentAbsoluteDiv>
        </CommentRelativeDiv>
      </Div>
      <FlexDiv $justifycontent="end" width="100%" $margin="30px 0 0 0">
        <CommentSubmitButton
          $backgroundColor="bgColor"
          $borderRadius={50}
          $padding="15px 40px"
          $HBackgroundColor="bgColorHo"
          disabled={createMutation.isPending}
          onClick={() => clickPostEvent()}
        >
          <P color="wh" fontSize="sm" $letterSpacing="1px">
            댓글등록
          </P>
        </CommentSubmitButton>
      </FlexDiv>
    </>
  );
};

export default CommentInput;
