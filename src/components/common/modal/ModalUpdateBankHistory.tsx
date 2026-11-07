import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { BankHistoryPayload, BankHistoryType } from '../../../functions/bankHistoryFunctions';
import { bankHistoryMutations, bankHistoryQueries } from '../../../queries/bankHistory';
import { fileIdList } from '../../../recoil/backState';
import { modalInfo, modalOpen } from '../../../recoil/frontState';
import BankHistoryForm, { BankHistoryFormInitialValues } from '../../budget/BankHistoryForm';

const ModalUpdateBankHistory = () => {
  const setOpen = useSetRecoilState(modalOpen);
  const modalContent = useRecoilValue(modalInfo)!;
  const setFileIdList = useSetRecoilState(fileIdList);

  const historyId = modalContent.content ?? '';

  const { data: historyInfo } = useQuery(bankHistoryQueries.detail({ id: historyId }));
  const updateMutation = useMutation(bankHistoryMutations.update());
  // 기존 내역을 불러오기 전까지는 폼을 렌더링하지 않는다
  const [initialValues, setInitialValues] = useState<BankHistoryFormInitialValues | null>(null);

  useEffect(() => {
    if (historyInfo) {
      const type: BankHistoryType = historyInfo.income === 0 ? 'outcome' : 'income';

      // 제출할 파일 ID는 DragNDrop과 공유하는 전역 상태라서 폼 마운트 전에 채워 둔다
      const receipts = historyInfo.receipts ?? [];
      // 다시 불러와도 파일 ID가 중복으로 쌓이지 않도록 덮어쓴다
      setFileIdList(receipts.map((receipt) => receipt.id));

      setInitialValues({
        type,
        dateUsed: historyInfo.dateUsed ?? '',
        title: historyInfo.title ?? '',
        details: historyInfo.details ?? '',
        amount: String(type === 'income' ? historyInfo.income : historyInfo.outcome),
        member: {
          memberId: historyInfo.memberIdReceived ?? '',
          studentId: historyInfo.memberStudentIdReceived ?? '',
          name: historyInfo.memberNameReceived ?? '',
        },
        receipts,
      });
    }
  }, [historyInfo]);

  // BankHistoryForm은 onSubmit의 Promise가 끝날 때까지 제출 버튼을 막는다.
  // 실패하면 에러 alert는 handleApiError가 띄우므로 여기서는 거절을 삼킨다
  const updateBankHistory = (payload: BankHistoryPayload) =>
    updateMutation.mutateAsync({ id: historyId, body: payload }).then(
      () => {
        alert('회계 내역이 정상적으로 수정되었습니다.');
        setOpen(false);
      },
      () => {},
    );

  if (!initialValues) return null;

  return (
    <BankHistoryForm
      heading="회계 내역 수정"
      initialValues={initialValues}
      typeEditable={false}
      onSubmit={updateBankHistory}
    />
  );
};

export default ModalUpdateBankHistory;
