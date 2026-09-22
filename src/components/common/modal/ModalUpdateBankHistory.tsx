import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import {
  BankHistoryType,
  getTodayKST,
  toBankHistoryPayload,
  toDateOnly,
  validateBankHistory,
} from '../../../functions/bankHistoryFunctions';
import useFetch from '../../../hooks/useFetch';
import { fileIdList, tokenAccess } from '../../../recoil/backState';
import {
  menuId,
  modalInfo,
  modalOpen,
  refetch,
  selectedFile,
  selectedStudentInfos,
} from '../../../recoil/frontState';
import Button from '../../../styles/assets/Button';
import { Div, FlexDiv } from '../../../styles/assets/Div';
import { H2 } from '../../../styles/assets/H';
import Img from '../../../styles/assets/Img';
import { Input } from '../../../styles/assets/Input';
import P from '../../../styles/assets/P';
import { theme } from '../../../styles/theme';
import StudentSearchTable from '../../budget/StudentSearchTable';
import DragNDrop from '../DragNDrop';

const EMPTY_STUDENT = { name: '', major: '', studentId: '', memberId: '' };

const ModalUpdateBankHistory = () => {
  const setOpen = useSetRecoilState(modalOpen);

  const [historyInfo, fetchGetHistory] = useFetch();

  const modalContent = useRecoilValue(modalInfo)!;
  const accessToken = useRecoilValue(tokenAccess);
  const currentMenuId = useRecoilValue(menuId);
  const [files, setFileIdList] = useRecoilState(fileIdList);
  const setReload = useSetRecoilState(refetch);
  const [selectedInfos, setSelectedInfos] = useRecoilState(selectedStudentInfos);
  const setFileSelected = useSetRecoilState(selectedFile);

  const [updateHistory, fetchUpdateHistory] = useFetch();
  const [historyType, setHistoryType] = useState<BankHistoryType | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const [infos, setInfos] = useState({
    dateUsed: '',
    title: '',
    details: '',
    amount: '',
  });

  useEffect(() => {
    setFileSelected([]);
    fetchGetHistory(`/budget/history/${modalContent.content}`, 'GET', 'token');
  }, [accessToken]);

  // 모달이 어떤 방식으로 닫히든 다음에 열리는 폼에 이전 부원/첨부 파일이 남지 않도록 초기화
  useEffect(() => {
    return () => {
      setSelectedInfos(EMPTY_STUDENT);
      setFileIdList([]);
      setFileSelected([]);
    };
  }, []);

  useEffect(() => {
    if (historyInfo) {
      const type: BankHistoryType = historyInfo.income === 0 ? 'outcome' : 'income';

      setSelectedInfos((prev) => ({
        ...prev,
        memberId: historyInfo.memberIdReceived ?? '',
        name: historyInfo.memberNameReceived ?? '',
        studentId: historyInfo.memberStudentIdReceived ?? '',
      }));
      setInfos({
        dateUsed: historyInfo.dateUsed ?? '',
        title: historyInfo.title ?? '',
        details: historyInfo.details ?? '',
        amount: String(type === 'income' ? historyInfo.income : historyInfo.outcome),
      });
      const receipts = historyInfo.receipts ?? [];
      setFileSelected(receipts);
      // 다시 불러와도 파일 ID가 중복으로 쌓이지 않도록 덮어쓴다
      setFileIdList(receipts.map((receipt: any) => receipt.id));
      setHistoryType(type);
      setReload(true);
    }
  }, [historyInfo]);

  const closeModal = () => {
    setOpen(false);
  };

  const clickUpdateEvent = async () => {
    if (isSubmittingRef.current || historyType === '') return;

    const form = {
      type: historyType,
      ...infos,
      member: selectedInfos,
      files,
    };

    // 필요한 정보가 다 채워졌는지 확인
    const errorMessage = validateBankHistory(form);
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    try {
      await fetchUpdateHistory(
        `/budget/history/${modalContent.content}`,
        'POST',
        'token',
        toBankHistoryPayload(form),
      );
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (updateHistory) {
      alert('회계 내역이 정상적으로 수정되었습니다.');
      closeModal();
      setReload(true);
    }
  }, [updateHistory]);

  return (
    <FlexDiv
      width="35%"
      height="600px"
      $backgroundColor="wh"
      direction="column"
      $justifycontent="space-between"
      radius={2}
      overflow="auto"
    >
      <FlexDiv $position="relative" height="95%" overflow="auto">
        {/* 헤더 (제목, 닫기 버튼) */}
        <FlexDiv
          $position="sticky"
          $top="0"
          $left="0"
          $justifycontent="space-between"
          width="100%"
          $backgroundColor="bgColor"
          $padding="15px 20px"
        >
          <Div>
            <H2 fontSize="lg" color="wh">
              회계 내역 수정
            </H2>
          </Div>
          <Div height="24px" $pointer onClick={() => closeModal()}>
            <Img src={'../images/x_white.svg'} />
          </Div>
        </FlexDiv>

        {/* 유형 표시 (수입/지출, 수정 불가) */}
        <Div width="90%" $margin="20px 0 30px 0">
          {historyType === 'income' ? (
            <P fontSize="sm" fontWeight={700}>
              수입
            </P>
          ) : (
            <P fontSize="sm" fontWeight={700}>
              지출
            </P>
          )}
        </Div>

        {/* 사용일 입력란 */}
        <Div width="90%">
          <P fontSize="xs" fontWeight={700}>
            사용일
          </P>
        </Div>
        <FlexDiv
          width="90%"
          $borderB={`1px solid ${theme.color.grey1}`}
          $justifycontent="flex-start"
          height="50px"
        >
          <Input
            $padding="0"
            type="date"
            width="100%"
            max={getTodayKST()}
            value={toDateOnly(infos.dateUsed)}
            onChange={(e: any) => setInfos((prev) => ({ ...prev, dateUsed: e.target.value }))}
          />
        </FlexDiv>
        <Div width="90%" $margin="5px 0 20px 0">
          <P fontSize="xs">영수증에 명시된 사용일을 적어주세요.</P>
        </Div>

        {/* 제목 입력란 */}
        <Div width="90%">
          <P fontSize="xs" fontWeight={700}>
            제목
          </P>
        </Div>
        <FlexDiv
          width="90%"
          $borderB={`1px solid ${theme.color.grey1}`}
          $justifycontent="flex-start"
          height="50px"
          $margin="0 0 20px 0"
        >
          <Input
            $padding="0"
            placeholder="제목을 입력하세요"
            width="100%"
            value={infos.title}
            onChange={(e: any) => setInfos((prev) => ({ ...prev, title: e.target.value }))}
          />
        </FlexDiv>

        {/* 내용 입력란 */}
        <Div width="90%">
          <P fontSize="xs" fontWeight={700}>
            내용
          </P>
        </Div>
        <FlexDiv
          color="bk"
          width="90%"
          $borderB={`1px solid ${theme.color.grey1}`}
          $justifycontent="flex-start"
          height="50px"
        >
          <Input
            $padding="0"
            placeholder="내용을 입력하세요"
            width="100%"
            value={infos.details}
            onChange={(e: any) => setInfos((prev) => ({ ...prev, details: e.target.value }))}
          />
        </FlexDiv>
        <Div width="90%" $margin="5px 0 20px 0">
          <P fontSize="xs">해당란을 입력하지 않을 시 제목과 내용이 같도록 처리합니다.</P>
        </Div>

        {historyType === 'income' && (
          <>
            {/* 수입액 입력란 */}
            <Div width="90%">
              <P fontSize="xs" fontWeight={700}>
                수입액
              </P>
            </Div>
            <FlexDiv
              width="90%"
              $margin="20px 0 20px 0"
              $borderB={`1px solid ${theme.color.grey1}`}
              $justifycontent="flex-start"
              height="50px"
            >
              <Input
                type="number"
                $padding="0"
                placeholder="수입액을 입력하세요"
                width="100%"
                min={1}
                step={1}
                value={infos.amount}
                onChange={(e: any) => setInfos((prev) => ({ ...prev, amount: e.target.value }))}
              />
            </FlexDiv>
          </>
        )}

        {historyType === 'outcome' && (
          <>
            {/* 선택된 학생 정보 표시 */}
            <FlexDiv width="90%">
              <FlexDiv
                width="100%"
                $margin="0 0 5px 0"
                $borderB={`1px solid ${theme.color.grey1}`}
                $justifycontent="flex-start"
                height="50px"
              >
                <FlexDiv>
                  <P>이름:</P>
                </FlexDiv>
                <FlexDiv $margin="0 0 0 5px">
                  <P>{selectedInfos.name}</P>
                </FlexDiv>
              </FlexDiv>
              <FlexDiv
                width="100%"
                $margin="0 0 10px 0"
                $borderB={`1px solid ${theme.color.grey1}`}
                $justifycontent="flex-start"
                height="50px"
              >
                <FlexDiv>
                  <P>학번:</P>
                </FlexDiv>
                <FlexDiv $margin="0 0 0 5px">
                  <P>{selectedInfos.studentId}</P>
                </FlexDiv>
              </FlexDiv>
            </FlexDiv>

            {/* 학생 검색 테이블 */}
            <FlexDiv width="100%">
              <StudentSearchTable />
            </FlexDiv>

            {/* 지출액 입력란 */}
            <Div width="90%" $margin="20px 0 0 0">
              <P fontSize="xs" fontWeight={700}>
                지출액
              </P>
            </Div>
            <FlexDiv
              width="90%"
              $borderB={`1px solid ${theme.color.grey1}`}
              $justifycontent="flex-start"
              height="50px"
              $margin="0 0 20px 0"
            >
              <Input
                type="number"
                $padding="0"
                placeholder="지출액을 입력하세요"
                width="100%"
                min={1}
                step={1}
                value={infos.amount}
                onChange={(e: any) => setInfos((prev) => ({ ...prev, amount: e.target.value }))}
              />
            </FlexDiv>
          </>
        )}

        {/* 증빙자료 첨부 */}
        <FlexDiv width="90%" direction="column">
          <FlexDiv width="100%" $justifycontent="flex-start" $margin="0 0 10px 0">
            <FlexDiv $margin="0 10px 0 0">
              <FlexDiv $margin="0 5px 0 0">
                <P>*</P>
              </FlexDiv>
              <FlexDiv>
                <P>증빙자료 첨부</P>
              </FlexDiv>
            </FlexDiv>
            <FlexDiv>
              <P fontSize="xs">해당란은 이미지만 첨부할 수 있습니다.</P>
            </FlexDiv>
          </FlexDiv>
          <FlexDiv width="100%">
            <DragNDrop fileFetch menuId={currentMenuId} onlyImg />
          </FlexDiv>
        </FlexDiv>

        {/* 제출 버튼 */}
        <FlexDiv
          $position="relative"
          $zIndex={10000}
          $top="0"
          $left="0"
          $margin="20px 0 0 0"
          width="90%"
          $backgroundColor="bgColor"
          height="50px"
        >
          <Button
            width="100%"
            height="100%"
            disabled={isSubmitting}
            onClick={() => clickUpdateEvent()}
          >
            <P color="wh">제출</P>
          </Button>
        </FlexDiv>
      </FlexDiv>
    </FlexDiv>
  );
};

export default ModalUpdateBankHistory;
