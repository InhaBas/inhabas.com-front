import { useMutation } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { BankHistoryPayload } from '../../../functions/bankHistoryFunctions';
import { bankHistoryMutations } from '../../../queries/bankHistory';
import { modalOpen } from '../../../recoil/frontState';
import BankHistoryForm, { EMPTY_BANK_HISTORY } from '../../budget/BankHistoryForm';

const ModalPostBankHistory = () => {
  const setOpen = useSetRecoilState(modalOpen);
  const createMutation = useMutation(bankHistoryMutations.create());

  // BankHistoryForm은 onSubmit의 Promise가 끝날 때까지 제출 버튼을 막는다.
  // 실패하면 에러 alert는 handleApiError가 띄우므로 여기서는 거절을 삼킨다
  const postBankHistory = (payload: BankHistoryPayload) =>
    createMutation.mutateAsync(payload).then(
      () => {
        alert('회계 내역이 정상적으로 등록되었습니다.');
        setOpen(false);
      },
      () => {},
    );

  return (
    <BankHistoryForm
      heading="회계 내역 추가"
      initialValues={EMPTY_BANK_HISTORY}
      typeEditable
      onSubmit={postBankHistory}
    />
  );
};

export default ModalPostBankHistory;
