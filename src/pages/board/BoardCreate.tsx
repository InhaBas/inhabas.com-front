import { useMutation, useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { saveBoardInterface } from '../../api/board';
import DragNDrop from '../../components/common/DragNDrop';
import Dropdown from '../../components/common/Dropdown';
import Loading from '../../components/common/Loading';
import TextEditor from '../../components/common/TextEditor';
import { boardMutations, boardQueries } from '../../queries/board';
import { fileIdList, tokenAccess } from '../../recoil/backState';
import { menuId, selectedFile } from '../../recoil/frontState';
import Button from '../../styles/assets/Button';
import { Container, Div, FlexDiv } from '../../styles/assets/Div';
import Img from '../../styles/assets/Img';
import { DateInput, TextInput } from '../../styles/assets/Input';
import P from '../../styles/assets/P';
import { media, theme } from '../../styles/theme';
import { tokenInterface } from '../../types/TypeCommon';

const PolicyNotice = styled(FlexDiv)`
  padding: 15px 20px;
  width: 100%;
  justify-content: flex-start;
  flex-wrap: nowrap;
  border: 1px solid ${theme.color.bgColor};
  border-radius: 5px;

  ${media.mobile} {
    align-items: flex-start;
    padding: 14px 16px;
  }
`;

const PolicyIcon = styled(Div)`
  flex: 0 0 25px;
`;

const PolicyText = styled(P).attrs({ $whiteSpace: 'normal' })`
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  overflow-wrap: anywhere;
  line-height: 1.5;
`;

const FormCard = styled(Div)`
  min-width: 0;
`;

const FormHeader = styled(FlexDiv)`
  width: 100%;
  padding: 20px;
  justify-content: space-between;
  border-bottom: 1px solid ${theme.color.border};

  ${media.mobile} {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
`;

const FormSection = styled(Div)`
  width: 100%;
  min-width: 0;
  padding: 20px;

  ${media.mobile} {
    padding: 12px;
  }
`;

const ResponsiveTextInput = styled(TextInput)`
  max-width: 100%;

  ${media.mobile} {
    height: 52px;
    font-size: ${theme.fontSize.lg};
  }
`;

const ResponsiveDateInput = styled(DateInput)`
  max-width: 100%;
  box-sizing: border-box;

  ${media.mobile} {
    height: 52px;
    font-size: ${theme.fontSize.lg};
  }
`;

const SubmitButton = styled(Button)`
  width: 400px;
  max-width: 100%;

  ${media.mobile} {
    width: 100%;
  }
`;

const BoardCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const url = location.pathname.split('/')[2];
  const paramID = useParams().id;

  const inputRef = useRef<any[]>([]);
  const [pinValue, setPinValue] = useState('');
  const files = useRecoilValue(selectedFile);
  const update = paramID ? 'update' : 'create';
  const setSelectedFile = useSetRecoilState(selectedFile);
  const currentMenuId = useRecoilValue(menuId);
  const [fileId, setFileList] = useRecoilState(fileIdList);

  // 수정 화면은 옛 화면 그대로 게시판 종류와 관계없이 토큰과 함께 조회한다
  const { data: detailData, isFetchedAfterMount } = useQuery({
    ...boardQueries.detail({ board: url, id: paramID ?? '', auth: true }),
    enabled: update === 'update',
  });
  /*
    상세 화면에서 넘어오면 같은 키의 캐시가 남아 있어 마운트하자마자 데이터가 보인다.
    옛 화면처럼 이 화면에서 새로 받은 응답이 올 때까지 스피너를 보이고, 그 응답으로 폼을 채운다
  */
  const detail = isFetchedAfterMount ? detailData : undefined;
  const createMutation = useMutation(boardMutations.create());
  const updateMutation = useMutation(boardMutations.update());
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const access = useRecoilValue(tokenAccess);
  let decoded: tokenInterface | undefined;
  if (access !== 'default') {
    decoded = jwtDecode(access) as tokenInterface;
  }
  const userId = decoded?.memberId;

  // select 값 선택에 따른 state 변경 이벤트
  const handlePinChange = (value: string) => {
    // 선택된 값을 업데이트
    setPinValue(value);
  };

  const sendInput = () => {
    if (isSubmitting) return;
    let check = true;

    if (check && inputRef.current[0].value === '') {
      alert('제목을 입력해주세요');
      check = false;
    }
    if (check && (url === 'sponsor' || url === 'usage') && inputRef.current[2].value === '') {
      alert('날짜를 입력해주세요');
      check = false;
    }

    if (check && inputRef.current[1].getInstance().getMarkdown().trim() === '') {
      alert('내용을 입력해주세요');
      check = false;
    }

    if (check) {
      const inputData: saveBoardInterface = {
        title: inputRef.current[0].value,
        content: inputRef.current[1].getInstance().getMarkdown(),
        files: fileId,
        ...(url !== 'sponsor' &&
          url !== 'usage' && { pinOption: pinValue !== '' ? pinValue : '0' }),
        ...((url === 'sponsor' || url === 'usage') && {
          dateHistory: inputRef.current[2].value + 'T00:00:00',
        }),
      };

      const formdata = new FormData();

      for (let i = 0; i < files.length; i++) {
        formdata.append('files', files[i]);
      }

      const mutateOptions = {
        onSuccess: () => {
          alert('글이 정상적으로 등록되었습니다');
          navigate(`/board/${url}`);
        },
      };
      if (update === 'create') {
        createMutation.mutate({ board: url, body: inputData }, mutateOptions);
      } else if (paramID) {
        updateMutation.mutate({ board: url, id: paramID, body: inputData }, mutateOptions);
      }
    }
  };

  // 기존 첨부(이미지 → 그 밖의 파일 순서). DragNDrop 미리보기와 fileIdList의 순서가 같아야 미리보기를 지울 때 맞는 id가 빠진다
  const existingFiles = detail ? [...(detail.images ?? []), ...(detail.otherFiles ?? [])] : [];

  // 폼 초기값: 불러온 기존 첨부를 편집할 파일 목록으로 복사한다
  useEffect(() => {
    if (detail) {
      setSelectedFile(existingFiles);
      setFileList(existingFiles.map((file) => file.id));
    }
  }, [detail]);

  // DragNDrop fileList 초기화
  useEffect(() => {
    return () => setFileList([]);
  }, []);

  useEffect(() => {
    if (update === 'update' && detail) {
      if (detail.writerId !== userId) {
        alert('본인이 작성한 글만 수정 가능합니다.');
        navigate(-1);
      }
    }
  }, [detail]);

  return (
    <FlexDiv width="100%">
      {update === 'update' && !detail ? (
        <FlexDiv width="100%" height="100vh">
          <Loading />
        </FlexDiv>
      ) : (
        <Container $alignitems="start">
          <Div width="100%" $margin="0 0 30px 0">
            <PolicyNotice>
              <PolicyIcon width="25px" height="25px" $margin="0 10px 0 0">
                <Img src="/images/triangle-warning_purple.svg"></Img>
              </PolicyIcon>
              <Div width="100%">
                <PolicyText color="bgColor" fontSize="sm" fontWeight={700}>
                  웹사이트 운영 정책을 위반하는 게시글은 예고 없이 삭제 될 수 있습니다.
                </PolicyText>
              </Div>
            </PolicyNotice>

            <FormCard
              width="100%"
              $border="1px solid"
              $borderColor="border"
              $margin="20px 0"
              radius={6}
            >
              <FormHeader>
                <Div>
                  <P fontWeight={600}>게시글 작성</P>
                </Div>
                {(url === 'notice' || url === 'executive') && (
                  <Div>
                    <Dropdown
                      label="상단고정여부"
                      options={['고정안함', '2주고정', '영구고정']}
                      value={['0', '1', '2']}
                      onChange={handlePinChange}
                    />
                  </Div>
                )}
              </FormHeader>
              <FormSection>
                <Div width="100%">
                  <ResponsiveTextInput
                    width="100%"
                    height="60px"
                    placeholder="제목을 입력해주세요"
                    fontSize="xl"
                    $borderRadius={5}
                    ref={(el: never) => (inputRef.current[0] = el)}
                    defaultValue={detail?.title}
                  ></ResponsiveTextInput>
                </Div>
              </FormSection>

              {(url === 'sponsor' || url === 'usage') && (
                <FormSection>
                  <Div width="100%">
                    <ResponsiveDateInput
                      width="100%"
                      height="60px"
                      fontSize="xl"
                      $borderRadius={5}
                      placeholder="후원 날짜를 입력해주세요"
                      ref={(el: never) => (inputRef.current[2] = el)}
                      defaultValue={detail?.dateHistory?.split('T')[0]}
                    />
                  </Div>
                </FormSection>
              )}

              <FormSection>
                <DragNDrop
                  fileFetch
                  menuId={currentMenuId}
                  initialFiles={update === 'update' ? existingFiles : undefined}
                />
              </FormSection>
              <FormSection>
                <TextEditor
                  ref={(el: never) => (inputRef.current[1] = el)}
                  initialContent={detail?.content}
                />
              </FormSection>
            </FormCard>

            <FlexDiv width="100%" $margin="30px 0 0 0">
              <SubmitButton
                $backgroundColor="bgColor"
                $HBackgroundColor="bgColorHo"
                $borderRadius={2}
                $padding="15px 30px"
                disabled={isSubmitting}
                onClick={() => sendInput()}
              >
                {update === 'create' ? <P color="wh">작성하기</P> : <P color="wh">수정하기</P>}
              </SubmitButton>
            </FlexDiv>
          </Div>
        </Container>
      )}
    </FlexDiv>
  );
};

export default BoardCreate;
