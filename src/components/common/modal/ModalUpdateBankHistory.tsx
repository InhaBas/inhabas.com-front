import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { BankHistoryPayload, BankHistoryType } from '../../../functions/bankHistoryFunctions';
import useFetch from '../../../hooks/useFetch';
import { fileIdList, tokenAccess } from '../../../recoil/backState';
import {
  modalInfo,
  modalOpen,
  refetch,
  selectedFile,
  selectedStudentInfos,
} from '../../../recoil/frontState';
import BankHistoryForm, { BankHistoryFormInitialValues } from '../../budget/BankHistoryForm';

const ModalUpdateBankHistory = () => {
  const setOpen = useSetRecoilState(modalOpen);
  const modalContent = useRecoilValue(modalInfo)!;
  const accessToken = useRecoilValue(tokenAccess);
  const setReload = useSetRecoilState(refetch);
  const setSelectedInfos = useSetRecoilState(selectedStudentInfos);
  const setFileIdList = useSetRecoilState(fileIdList);
  const setFileSelected = useSetRecoilState(selectedFile);

  const [historyInfo, fetchGetHistory] = useFetch();
  const [updateHistory, fetchUpdateHistory] = useFetch();
  // 기존 내역을 불러오기 전까지는 폼을 렌더링하지 않는다
  const [initialValues, setInitialValues] = useState<BankHistoryFormInitialValues | null>(null);

  useEffect(() => {
    setFileSelected([]);
    fetchGetHistory(`/budget/history/${modalContent.content}`, 'GET', 'token');
  }, [accessToken]);

  useEffect(() => {
    if (historyInfo) {
      const type: BankHistoryType = historyInfo.income === 0 ? 'outcome' : 'income';

      // 부원과 첨부 파일은 폼 하위 컴포넌트가 공유하는 전역 상태라서 폼 마운트 전에 채워 둔다
      setSelectedInfos((prev) => ({
        ...prev,
        memberId: historyInfo.memberIdReceived ?? '',
        name: historyInfo.memberNameReceived ?? '',
        studentId: historyInfo.memberStudentIdReceived ?? '',
      }));
      const receipts = historyInfo.receipts ?? [];
      setFileSelected(receipts);
      // 다시 불러와도 파일 ID가 중복으로 쌓이지 않도록 덮어쓴다
      setFileIdList(receipts.map((receipt: any) => receipt.id));
      setReload(true);

      setInitialValues({
        type,
        dateUsed: historyInfo.dateUsed ?? '',
        title: historyInfo.title ?? '',
        details: historyInfo.details ?? '',
        amount: String(type === 'income' ? historyInfo.income : historyInfo.outcome),
      });
    }
  }, [historyInfo]);

  const updateBankHistory = (payload: BankHistoryPayload) =>
    fetchUpdateHistory(`/budget/history/${modalContent.content}`, 'POST', 'token', payload);

  useEffect(() => {
    if (updateHistory) {
      alert('회계 내역이 정상적으로 수정되었습니다.');
      setOpen(false);
      setReload(true);
    }
  }, [updateHistory]);

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
