import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';

import { BankHistoryPayload } from '../../../functions/bankHistoryFunctions';
import useFetch from '../../../hooks/useFetch';
import { modalOpen, refetch } from '../../../recoil/frontState';
import BankHistoryForm, { EMPTY_BANK_HISTORY } from '../../budget/BankHistoryForm';

const ModalPostBankHistory = () => {
  const setOpen = useSetRecoilState(modalOpen);
  const setReload = useSetRecoilState(refetch);
  const [postHistory, fetchPostHistory] = useFetch();

  const postBankHistory = (payload: BankHistoryPayload) =>
    fetchPostHistory('/budget/history', 'POST', 'token', payload);

  useEffect(() => {
    if (postHistory) {
      alert('회계 내역이 정상적으로 등록되었습니다.');
      setOpen(false);
      setReload(true);
    }
  }, [postHistory]);

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
