import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import DragNDrop from '../../components/common/DragNDrop';
import { getTodayKST, toDateOnly } from '../../functions/bankHistoryFunctions';
import { useFormSnapshot } from '../../hooks/useFormSnapshot';
import { bankSupportMutations, bankSupportQueries } from '../../queries/bankSupport';
import { fileIdList } from '../../recoil/backState';
import { menuId, selectedFile } from '../../recoil/frontState';
import Button from '../../styles/assets/Button';
import { Container, Div, FlexDiv } from '../../styles/assets/Div';
import { DateInput, TextInput } from '../../styles/assets/Input';
import P from '../../styles/assets/P';
import { media } from '../../styles/theme';
import { theme } from '../../styles/theme';
import { saveSupportInterface } from '../../types/TypeBank';

const SupportFormPage = styled(FlexDiv)`
  min-width: 0;

  &,
  & *,
  & *::before,
  & *::after {
    box-sizing: border-box;
  }
`;

const FormHint = styled(P)`
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  overflow-wrap: anywhere;
`;

const SubmitButton = styled(Button)`
  max-width: 100%;

  ${media.mobile} {
    width: 100%;
  }
`;

const BankSupportCreate = () => {
  const navigate = useNavigate();
  const paramID = useParams().id;
  const currentMenuId = useRecoilValue(menuId);
  const update = paramID ? 'update' : 'create';
  const [files, setFiles] = useRecoilState(fileIdList);
  const setSelectedFile = useSetRecoilState(selectedFile);

  const {
    data: detailData,
    isFetchedAfterMount,
    isSuccess,
  } = useQuery({
    ...bankSupportQueries.detail({ id: paramID ?? '' }),
    enabled: update === 'update',
  });
  /*
    상세 화면에서 넘어오면 같은 키의 캐시가 남아 있어 마운트하자마자 데이터가 보인다.
    옛 화면처럼 이 화면에서 새로 받은 응답으로 폼을 채운다. 이 화면의 조회가 실패하면 남은 캐시로 채우지 않는다.
    그 뒤에 다시 받은 응답(또는 재요청 실패)으로는 편집 중인 폼을 덮어쓰거나 스피너로 되돌리지 않는다
  */
  const detail = useFormSnapshot(isFetchedAfterMount && isSuccess ? detailData : undefined);
  const createMutation = useMutation(bankSupportMutations.create());
  const updateMutation = useMutation(bankSupportMutations.update());
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const [infos, setInfos] = useState({
    title: '',
    details: '',
    dateUsed: '',
    outcome: 0,
    account: '',
  });

  // 폼 초기값: 불러온 신청 내용과 기존 증빙자료를 편집할 값으로 복사한다
  useEffect(() => {
    if (detail) {
      setInfos((prev) => ({
        ...prev,
        title: detail.title,
        details: detail.details,
        dateUsed: detail.dateUsed,
        outcome: detail.outcome,
        account: detail.account,
      }));
      setSelectedFile(detail.receipts);
      setFiles(detail.receipts.map((item) => item.id));
    }
  }, [detail]);

  // DragNDrop fileList 초기화
  useEffect(() => {
    return () => setFiles([]);
  }, []);

  const checkIsCompletedContents = () => {
    if (infos.title === '') {
      alert('제목을 입력해주세요');
      return false;
    }

    if (infos.dateUsed === '') {
      alert('지출일을 입력해주세요');
      return false;
    }

    // YYYY-MM-DD 문자열은 사전순 비교가 곧 날짜 비교다
    if (toDateOnly(infos.dateUsed) > getTodayKST()) {
      alert('미래 날짜는 지출일로 입력할 수 없습니다');
      return false;
    }

    if (infos.details === '') {
      alert('지출내역을 입력해주세요');
      return false;
    }

    if (infos.outcome === 0) {
      alert('올바른 지출액을 입력해주세요');
      return false;
    }

    if (infos.account === '') {
      alert('입금받을 계좌를 입력해주세요');
      return false;
    }

    if (files.length === 0) {
      alert('증빙자료를 첨부해주세요');
      return false;
    }

    return true;
  };

  const clickPostEvent = () => {
    if (isSubmitting) return;
    // 필요한 정보가 다 채워졌는지 확인
    if (checkIsCompletedContents() === false) {
      return;
    }

    // 파일 담기
    const inputData: saveSupportInterface = {
      dateUsed: infos.dateUsed.includes('T') ? infos.dateUsed : `${infos.dateUsed}T00:00:00`,
      title: infos.title,
      details: infos.details,
      outcome: Number(infos.outcome),
      account: infos.account,
      files: files,
    };
    const mutateOptions = {
      onSuccess: () => {
        alert('예산 지원 신청이 정상적으로 등록되었습니다.');
        setFiles([]);
        navigate(`/bank/support`);
      },
    };
    if (update === 'create') {
      createMutation.mutate(inputData, mutateOptions);
    } else if (paramID) {
      updateMutation.mutate({ id: paramID, body: inputData }, mutateOptions);
    }
    console.log(inputData);
  };

  return (
    <SupportFormPage width="100%">
      <Container $alignitems="start">
        <Div width="100%" $margin="0 0 30px 0">
          <Div
            $border="1px solid"
            $borderColor="border"
            radius={5}
            width="100%"
            $margin="30px 0 0 0"
          >
            <Div $borderB={`1px solid ${theme.color.border}`} $padding="20px" width="100%">
              <P fontWeight={600}>게시글 제목</P>
            </Div>
            <Div width="100%" $padding="20px">
              <Div width="100%">
                <TextInput
                  width="100%"
                  height="60px"
                  placeholder="제목을 입력해주세요"
                  fontSize="xl"
                  $borderRadius={5}
                  value={infos.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInfos((prev) => ({ ...prev, title: e.target.value }))
                  }
                ></TextInput>
              </Div>
            </Div>
          </Div>
          <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 20px 0" radius={6}>
            <FlexDiv
              width=" 100%"
              $padding="20px"
              $justifycontent="start"
              $borderB={`1px solid ${theme.color.border}`}
            >
              <Div>
                <P fontWeight={600}>지출일</P>
              </Div>
            </FlexDiv>
            <Div width="100%" $padding="20px 20px 0 20px">
              <DateInput
                width="100%"
                max={getTodayKST()}
                value={toDateOnly(infos.dateUsed)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInfos((prev) => ({ ...prev, dateUsed: e.target.value }))
                }
              />
            </Div>
            <Div $padding="5px 20px">
              <FormHint fontSize="xs" color="TextDanger">
                지출일은 현재보다 이전이어야 합니다.
              </FormHint>
            </Div>
          </Div>
          <Div
            width="100%"
            $border="1px solid"
            $borderColor="border"
            $margin=" 0 0 20px 0"
            radius={6}
          >
            <FlexDiv
              width=" 100%"
              $padding="20px"
              $justifycontent="start"
              $borderB={`1px solid ${theme.color.border}`}
            >
              <Div>
                <P fontWeight={600}>지출 내역</P>
              </Div>
            </FlexDiv>
            <Div width="100%" $padding="20px">
              <TextInput
                width="100%"
                placeholder="지출 목적 및 사용 내역을 입력하세요"
                value={infos.details}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInfos((prev) => ({ ...prev, details: e.target.value }))
                }
              />
            </Div>
          </Div>
          <Div
            width="100%"
            $border="1px solid"
            $borderColor="border"
            $margin=" 0 0 20px 0"
            radius={6}
          >
            <FlexDiv
              width=" 100%"
              $padding="20px"
              $justifycontent="start"
              $borderB={`1px solid ${theme.color.border}`}
            >
              <Div>
                <P fontWeight={600}>지출 금액</P>
              </Div>
            </FlexDiv>
            <Div width="100%" $padding="20px">
              <TextInput
                width="100%"
                placeholder="정확한 지출액을 입력하세요"
                value={infos.outcome}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInfos((prev) => ({ ...prev, outcome: Number(e.target.value) }))
                }
              />
            </Div>
          </Div>
          <Div
            width="100%"
            $border="1px solid"
            $borderColor="border"
            $margin=" 0 0 20px 0"
            radius={6}
          >
            <FlexDiv
              width=" 100%"
              $padding="20px"
              $justifycontent="start"
              $borderB={`1px solid ${theme.color.border}`}
            >
              <Div>
                <P fontWeight={600}>입금받을 계좌</P>
              </Div>
            </FlexDiv>
            <Div width="100%" $padding="20px">
              <TextInput
                width="100%"
                placeholder="은행명, 계좌번호, 예금주를 입력해주세요"
                value={infos.account}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInfos((prev) => ({ ...prev, account: e.target.value }))
                }
              />
            </Div>
          </Div>

          <Div
            width="100%"
            $border="1px solid"
            $borderColor="border"
            $margin=" 0 0 20px 0"
            radius={6}
          >
            <FlexDiv
              width=" 100%"
              $padding="20px"
              $justifycontent="start"
              $borderB={`1px solid ${theme.color.border}`}
            >
              <Div>
                <P fontWeight={600}>증빙자료(영수증) 업로드</P>
              </Div>
            </FlexDiv>
            <Div width="100%" $padding="20px">
              <Div width="100%" $padding="20px">
                {/* 수정 화면은 기존 증빙자료를 불러오면 다시 마운트해 미리보기를 그린다. 옛 화면처럼 불러오는 동안에도 폼을 보여 준다 */}
                <DragNDrop
                  key={detail ? 'loaded' : 'empty'}
                  fileFetch
                  menuId={currentMenuId}
                  onlyImg
                  initialFiles={update === 'update' ? (detail?.receipts ?? []) : undefined}
                />
              </Div>
            </Div>
          </Div>

          <FlexDiv width="100%" $margin="30px 0 0 0">
            <SubmitButton
              $backgroundColor="bgColor"
              $HBackgroundColor="bgColorHo"
              $borderRadius={2}
              $padding="15px 30px"
              width="400px"
              disabled={isSubmitting}
              onClick={() => clickPostEvent()}
            >
              {update === 'create' ? <P color="wh">작성하기</P> : <P color="wh">수정하기</P>}
            </SubmitButton>
          </FlexDiv>
        </Div>
      </Container>
    </SupportFormPage>
  );
};

export default BankSupportCreate;
