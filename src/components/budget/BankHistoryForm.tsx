import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import StudentSearchTable from './StudentSearchTable';
import {
  BankHistoryMember,
  BankHistoryPayload,
  BankHistoryType,
  getTodayKST,
  toBankHistoryPayload,
  toDateOnly,
  validateBankHistory,
} from '../../functions/bankHistoryFunctions';
import { fileIdList } from '../../recoil/backState';
import { menuId, modalOpen, selectedFile } from '../../recoil/frontState';
import Button from '../../styles/assets/Button';
import { Div, FlexDiv } from '../../styles/assets/Div';
import { H2 } from '../../styles/assets/H';
import Img from '../../styles/assets/Img';
import { Input, Label, Radio } from '../../styles/assets/Input';
import P from '../../styles/assets/P';
import { theme } from '../../styles/theme';
import DragNDrop from '../common/DragNDrop';

const EMPTY_MEMBER: BankHistoryMember = { memberId: '', studentId: '', name: '' };

export interface BankHistoryFormInitialValues {
  type: BankHistoryType;
  dateUsed: string;
  title: string;
  details: string;
  amount: string;
  // 회비를 사용한 부원 (지출에만 해당)
  member: BankHistoryMember;
}

export const EMPTY_BANK_HISTORY: BankHistoryFormInitialValues = {
  type: 'income',
  dateUsed: '',
  title: '',
  details: '',
  amount: '',
  member: EMPTY_MEMBER,
};

interface BankHistoryFormProps {
  heading: string;
  initialValues: BankHistoryFormInitialValues;
  // 수정 시에는 유형(수입/지출)을 바꿀 수 없다
  typeEditable: boolean;
  onSubmit: (payload: BankHistoryPayload) => Promise<void>;
}

// 회계 내역 추가/수정 모달이 공유하는 입력 폼.
// 첨부 파일(fileIdList, selectedFile)은 DragNDrop과 공유하는 전역 상태라서,
// 초기값이 필요하면 폼을 마운트하기 전에 래퍼가 채워 둔다.
const BankHistoryForm = ({
  heading,
  initialValues,
  typeEditable,
  onSubmit,
}: BankHistoryFormProps) => {
  const setOpen = useSetRecoilState(modalOpen);
  const currentMenuId = useRecoilValue(menuId);
  const [files, setFiles] = useRecoilState(fileIdList);
  const setFileSelected = useSetRecoilState(selectedFile);

  const [historyType, setHistoryType] = useState<BankHistoryType>(initialValues.type);
  const [member, setMember] = useState<BankHistoryMember>(initialValues.member);
  const [infos, setInfos] = useState({
    dateUsed: toDateOnly(initialValues.dateUsed),
    title: initialValues.title,
    details: initialValues.details,
    amount: initialValues.amount,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  // 모달이 어떤 방식으로 닫히든 다음에 열리는 폼에 이전 첨부 파일이 남지 않도록 초기화
  useEffect(() => {
    return () => {
      setFiles([]);
      setFileSelected([]);
    };
  }, []);

  const closeModal = () => {
    setOpen(false);
  };

  // 유형을 바꾸면 공통 항목(사용일, 제목, 내용, 첨부)은 유지하고 유형별 항목만 초기화
  const changeHistoryType = (type: BankHistoryType) => {
    if (type === historyType) return;
    setHistoryType(type);
    setInfos((prev) => ({ ...prev, amount: '' }));
    if (type === 'income') {
      setMember(EMPTY_MEMBER);
    }
  };

  const clickSubmitEvent = async () => {
    if (isSubmittingRef.current) return;

    const form = {
      type: historyType,
      ...infos,
      member,
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
      await onSubmit(toBankHistoryPayload(form));
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

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
              {heading}
            </H2>
          </Div>
          <Div height="24px" $pointer onClick={() => closeModal()}>
            <Img src={'../images/x_white.svg'} />
          </Div>
        </FlexDiv>

        {/* 유형 선택 (수입/지출, 수정 시에는 변경 불가) */}
        <FlexDiv width="90%" $justifycontent="flex-start" height="50px" $margin="10px 0">
          <FlexDiv>
            <Radio
              name="bankHistoryType"
              value={'수입'}
              checked={historyType === 'income'}
              disabled={!typeEditable}
              onChange={() => changeHistoryType('income')}
            />
            <Label $margin="0 0 0 5px">수입</Label>
          </FlexDiv>
          <FlexDiv $margin="0 10px">
            <Radio
              name="bankHistoryType"
              value={'지출'}
              checked={historyType === 'outcome'}
              disabled={!typeEditable}
              onChange={() => changeHistoryType('outcome')}
            />
            <Label $margin="0 0 0 5px">지출</Label>
          </FlexDiv>
        </FlexDiv>

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
            value={infos.dateUsed}
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
              $margin="0 0 20px 0"
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
                  <P>{member.name}</P>
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
                  <P>{member.studentId}</P>
                </FlexDiv>
              </FlexDiv>
            </FlexDiv>

            {/* 학생 검색 테이블 */}
            <FlexDiv width="100%">
              <StudentSearchTable
                selectedStudentId={member.studentId}
                onSelect={({ memberId, studentId, name }) =>
                  setMember({ memberId, studentId, name })
                }
              />
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
            onClick={() => clickSubmitEvent()}
          >
            <P color="wh">제출</P>
          </Button>
        </FlexDiv>
      </FlexDiv>
    </FlexDiv>
  );
};

export default BankHistoryForm;
