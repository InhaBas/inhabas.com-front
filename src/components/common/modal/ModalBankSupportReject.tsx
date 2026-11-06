import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { bankSupportMutations } from '../../../queries/bankSupport';
import { bankSupportRejectReasonInfo, modalOpen } from '../../../recoil/frontState';
import Button from '../../../styles/assets/Button';
import { Div, FlexDiv } from '../../../styles/assets/Div';
import { H2 } from '../../../styles/assets/H';
import Img from '../../../styles/assets/Img';
import { TextInput } from '../../../styles/assets/Input';
import P from '../../../styles/assets/P';

const ModalBankSupportReject = () => {
  const location = useLocation();
  const setOpen = useSetRecoilState(modalOpen);

  const closeModal = () => {
    setOpen(false);
  };

  const [infos, setInfos] = useRecoilState(bankSupportRejectReasonInfo);
  const statusMutation = useMutation(bankSupportMutations.updateStatus());
  const applicationId = location.pathname.split('/')[4];

  // 성공하면 상세(BankSupportDetail)가 뮤테이션 팩토리의 무효화로 다시 조회된다
  const makeStatusRejected = () => {
    if (statusMutation.isPending) return;
    statusMutation.mutate(
      { id: applicationId, body: { status: 'REJECTED', rejectReason: infos } },
      {
        onSuccess: () => {
          alert(`'승인 거절' 처리 되었습니다. `);
          setOpen(false);
        },
      },
    );
  };

  return (
    <FlexDiv
      width="44%"
      $backgroundColor="wh"
      direction="column"
      $justifycontent="space-between"
      radius={2}
    >
      <FlexDiv
        $justifycontent="space-between"
        width="100%"
        $backgroundColor="bgColor"
        $padding="15px 20px"
      >
        <Div>
          <H2 fontSize="lg" color="wh">
            거절 사유 등록하기
          </H2>
        </Div>
        <Div height="24px" $pointer onClick={() => closeModal()}>
          <Img src={'/images/x_white.svg'} />
        </Div>
      </FlexDiv>
      <FlexDiv $padding="25px" width="100%" direction="column" $justifycontent="space-between">
        <Div width="100%" $margin="0 0 20px 0">
          <TextInput
            onChange={(e: any) => setInfos(e.target.value)}
            placeholder="거절 사유를 입력하세요"
            width="100%"
          />
        </Div>

        <FlexDiv width="100%">
          <Button
            $backgroundColor="bgColor"
            $HBackgroundColor="bgColorHo"
            $borderRadius={3}
            width="100%"
            height="40px"
            disabled={statusMutation.isPending}
            onClick={() => makeStatusRejected()}
          >
            <P color="wh" fontWeight={400}>
              등록
            </P>
          </Button>
        </FlexDiv>
      </FlexDiv>
    </FlexDiv>
  );
};

export default ModalBankSupportReject;
