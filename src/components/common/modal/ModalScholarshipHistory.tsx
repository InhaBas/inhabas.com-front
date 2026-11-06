import { useMutation, useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { scholarshipMutations, scholarshipQueries } from '../../../queries/scholarship';
import { modalInfo, modalOpen } from '../../../recoil/frontState';
import Button from '../../../styles/assets/Button';
import { Div, FlexDiv } from '../../../styles/assets/Div';
import { H2 } from '../../../styles/assets/H';
import Img from '../../../styles/assets/Img';
import { DateInput, TextInput } from '../../../styles/assets/Input';
import P from '../../../styles/assets/P';

const ModalScholarshipHistory = () => {
  const setOpen = useSetRecoilState(modalOpen);

  const closeModal = () => {
    setOpen(false);
  };

  const inputRef = useRef<any[]>([]);

  const modalData = useRecoilValue(modalInfo);
  const isUpdate = modalData.type === 'scholarshipUpdate';
  const historyId = Number(modalData.content);
  // 장학회 페이지가 조회한 연혁 목록을 구독만 한다. 모달은 그 페이지에서만 열린다
  const { data: histories } = useQuery({
    ...scholarshipQueries.historyList(),
    refetchOnMount: false,
  });
  // 원래 로딩 표시가 없어 찾기 전에는 빈 입력칸을 보여 준다
  const found = isUpdate
    ? histories?.flatMap(({ data }) => data).find(({ id }) => id === historyId)
    : undefined;
  const history = found && { ...found, dateHistory: found.dateHistory.split('T')[0] };
  const createMutation = useMutation(scholarshipMutations.createHistory());
  const updateMutation = useMutation(scholarshipMutations.updateHistory());
  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSaved = () => {
    alert('연혁이 정상적으로 등록되었습니다.');
    setOpen(false);
  };

  // 연혁 등록 fetch
  const addHistory = () => {
    let check = true;

    if (check && inputRef.current[0].value === '') {
      alert('날짜를 선택해주세요');
      check = false;
    }

    if (check && inputRef.current[1].value === '') {
      alert('제목을 입력해주세요');
      check = false;
    }

    if (check) {
      let inputData = {
        title: inputRef.current[1].value,
        dateHistory: inputRef.current[0].value + 'T00:00:00',
      };
      if (modalData.type === 'scholarshipPost') {
        createMutation.mutate(inputData, { onSuccess: onSaved });
      } else if (isUpdate) {
        updateMutation.mutate({ id: historyId, body: inputData }, { onSuccess: onSaved });
      }
    }
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
          {modalData.type === 'scholarshipPost' ? (
            <H2 fontSize="lg" color="wh">
              장학회 연혁 등록하기
            </H2>
          ) : (
            <H2 fontSize="lg" color="wh">
              장학회 연혁 수정하기
            </H2>
          )}
        </Div>
        <Div height="24px" $pointer onClick={() => closeModal()}>
          <Img src={'../images/x_white.svg'} />
        </Div>
      </FlexDiv>
      <FlexDiv
        $padding="25px"
        width="100%"
        height="200px"
        direction="column"
        $justifycontent="space-between"
      >
        <Div width="100%">
          <DateInput
            ref={(el: HTMLInputElement) => (inputRef.current[0] = el)}
            width="100%"
            defaultValue={history?.dateHistory}
          />
        </Div>
        <Div width="100%">
          <TextInput
            ref={(el: HTMLInputElement) => (inputRef.current[1] = el)}
            placeholder="제목을 입력하세요"
            width="100%"
            defaultValue={history?.title}
          />
        </Div>
        <FlexDiv width="100%">
          <Button
            $backgroundColor="bgColor"
            $HBackgroundColor="bgColorHo"
            $borderRadius={3}
            width="100%"
            height="40px"
            disabled={isPending}
            onClick={() => addHistory()}
          >
            {modalData.type === 'scholarshipPost' ? (
              <P color="wh" fontWeight={400}>
                등록
              </P>
            ) : (
              <P color="wh" fontWeight={400}>
                수정
              </P>
            )}
          </Button>
        </FlexDiv>
      </FlexDiv>
    </FlexDiv>
  );
};

export default ModalScholarshipHistory;
