import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { myInfoMutations, useEndSession } from '../../../queries/myInfo';
import { modalOpen } from '../../../recoil/frontState';
import Button from '../../../styles/assets/Button';
import { Div, FlexDiv } from '../../../styles/assets/Div';
import { H2 } from '../../../styles/assets/H';
import Img from '../../../styles/assets/Img';
import { Checkbox, Label } from '../../../styles/assets/Input';
import P from '../../../styles/assets/P';

const NOTICES = [
  '탈퇴하면 계정을 복구할 수 없어요.',
  '이름, 학번, 연락처 등 개인정보가 삭제돼요.',
  '작성한 글과 댓글은 삭제되지 않고 "탈퇴한 회원"으로 남아요. 지우고 싶다면 탈퇴 전에 직접 삭제해 주세요.',
  '진행 중인 예산 신청이 있다면 먼저 처리해 주세요.',
  '다시 이용하려면 회원가입과 승인을 처음부터 다시 받아야 해요.',
];

const NoticeList = styled.ul`
  margin: 0;
  padding-left: 20px;

  p {
    white-space: normal;
    overflow-wrap: anywhere;
  }

  li + li {
    margin-top: 8px;
  }
`;

const ConfirmLabel = styled(Label)`
  cursor: pointer;
`;

const ModalWithdraw = () => {
  const navigate = useNavigate();
  const setOpen = useSetRecoilState(modalOpen);
  const endSession = useEndSession();
  const [isConfirmed, setIsConfirmed] = useState(false);

  // mutate의 콜백이 아니라 여기에 둔다. 요청 중에 모달 바깥을 눌러 닫혀도 탈퇴 뒤 정리는 실행되어야 한다
  const withdrawMutation = useMutation({
    ...myInfoMutations.withdraw(),
    onSuccess: () => {
      alert('회원 탈퇴가 완료되었습니다.');
      endSession();
      setOpen(false);
      navigate('/');
    },
  });

  return (
    <FlexDiv width="44%" $backgroundColor="wh" direction="column" radius={2}>
      <FlexDiv
        $justifycontent="space-between"
        width="100%"
        $backgroundColor="bgColor"
        $padding="15px 20px"
      >
        <Div>
          <H2 fontSize="lg" color="wh">
            회원 탈퇴
          </H2>
        </Div>
        <Div height="24px" $pointer onClick={() => setOpen(false)}>
          <Img src={'../images/x_white.svg'} />
        </Div>
      </FlexDiv>
      <FlexDiv $padding="25px" width="100%" direction="column" $alignitems="stretch">
        <NoticeList>
          {NOTICES.map((notice) => (
            <li key={notice}>
              <P fontSize="sm" $lineHeight={1.4}>
                {notice}
              </P>
            </li>
          ))}
        </NoticeList>
        <FlexDiv width="100%" $justifycontent="start" $margin="24px 0">
          <Checkbox
            id="withdraw-confirm"
            checked={isConfirmed}
            onChange={(event) => setIsConfirmed(event.target.checked)}
          />
          <ConfirmLabel htmlFor="withdraw-confirm" $margin="0 0 0 8px">
            위 내용을 모두 확인했습니다.
          </ConfirmLabel>
        </FlexDiv>
        <Button
          $backgroundColor="red"
          $HBackgroundColor="TextDanger"
          $borderRadius={3}
          width="100%"
          height="40px"
          disabled={!isConfirmed || withdrawMutation.isPending}
          onClick={() => withdrawMutation.mutate()}
        >
          <P color="wh" fontWeight={600}>
            회원 탈퇴
          </P>
        </Button>
      </FlexDiv>
    </FlexDiv>
  );
};

export default ModalWithdraw;
