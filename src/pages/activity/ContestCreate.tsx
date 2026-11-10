import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { ContestType } from '../../api/contest';
import DragNDrop from '../../components/common/DragNDrop';
import Loading from '../../components/common/Loading';
import TextEditor from '../../components/common/TextEditor';
import { DateFunction } from '../../functions/dateFunction';
import { useFormSnapshot } from '../../hooks/useFormSnapshot';
import { contestMutations, contestQueries } from '../../queries/contest';
import { fileIdList } from '../../recoil/backState';
import { menuId, selectedFile } from '../../recoil/frontState';
import Button from '../../styles/assets/Button';
import { Container, Div, FlexDiv } from '../../styles/assets/Div';
import Img from '../../styles/assets/Img';
import { DateInput, Label, Radio, TextInput } from '../../styles/assets/Input';
import P from '../../styles/assets/P';
import { media, theme } from '../../styles/theme';
import { saveContestInterface } from '../../types/TypeBoard';
import { fileDownloadInterface } from '../../types/TypeCommon';

const FormContent = styled(Div)`
  &,
  * {
    box-sizing: border-box;
  }
`;

const PolicyNotice = styled(FlexDiv)`
  box-sizing: border-box;
  flex-wrap: nowrap;

  > :last-child {
    min-width: 0;
  }

  p {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    line-height: 1.5;
  }

  ${media.mobile} {
    align-items: flex-start;
    padding: 14px 16px;
  }
`;

const FileUploadTitle = styled(FlexDiv)`
  ${media.mobile} {
    align-items: flex-start;
    flex-wrap: nowrap;

    > :last-child {
      flex: 1;
      min-width: 0;
    }

    p {
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
      line-height: 1.5;
    }
  }
`;

const RadioGroup = styled(FlexDiv)`
  gap: 24px;
  height: auto;

  > div {
    margin: 0;
  }

  ${media.mobile} {
    align-items: flex-start;
    gap: 14px 24px;
  }
`;

const SubmitButton = styled(Button)`
  width: 400px;
  max-width: 100%;

  ${media.mobile} {
    width: 100%;
  }
`;

const ContestCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // 라우트가 /board/contest/... 와 /board/activity/... 둘뿐이다
  const url = location.pathname.split('/')[2] as ContestType;
  const paramID = useParams().id;

  const inputRef = useRef<any[]>([]);
  const [fileId, setFileList] = useRecoilState(fileIdList);
  const update = paramID ? 'update' : 'create';
  const [files, setSelectedFile] = useRecoilState(selectedFile);
  const currentMenuId = useRecoilValue(menuId);
  // 고르기 전에는 수정 화면이면 불러온 종류를 쓴다(옛 화면은 불러온 값을 이 state에 복사했다)
  const [pickedContestType, setContestType] = useState<number | null>(null);
  const { formatDateT, formatDateDay } = DateFunction();

  const today = formatDateT();

  // 옛 화면 그대로 수정 화면은 토큰과 함께 조회한다
  const { data: detailData, isFetchedAfterMount } = useQuery({
    ...contestQueries.detail({ contestType: url, id: paramID ?? '', auth: true }),
    enabled: update === 'update',
  });
  // 옛 화면처럼 이 화면에서 새로 받은 응답이 올 때까지 스피너를 보이고, 그 응답으로 폼을 채운다.
  // 그 뒤에 다시 받은 응답으로는 편집 중인 폼을 덮어쓰지 않는다
  const detail = useFormSnapshot(isFetchedAfterMount ? detailData : undefined);
  const contestType = pickedContestType ?? detail?.contestFieldId ?? null;
  const createMutation = useMutation(contestMutations.create());
  const updateMutation = useMutation(contestMutations.update());
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // 기존 첨부(이미지 → 그 밖의 파일 순서). DragNDrop 미리보기와 fileIdList의 순서가 같아야 미리보기를 지울 때 맞는 id가 빠진다
  const existingFiles: fileDownloadInterface[] = detail
    ? [...detail.images, ...detail.otherFiles]
    : [];

  const sendInput = () => {
    if (isSubmitting) return;
    let check = true;

    if (check && inputRef.current[0].value === '') {
      alert('공모전 이름을 입력해주세요.');
      check = false;
    }
    if (check && inputRef.current[1].value === '') {
      alert('공모전 주제를 입력해주세요.');
      check = false;
    }
    if (check && inputRef.current[2].value === '') {
      alert('주최기관을 입력해주세요.');
      check = false;
    }
    if (check && inputRef.current[3].value === '') {
      alert('공모전 시작일을 입력해주세요.');
      check = false;
    }
    if (check && inputRef.current[4].value === '') {
      alert('공모전 마감일을 입력해주세요.');
      check = false;
    }

    if (check && inputRef.current[4].value < today) {
      alert(`공모전 마감일은 ${formatDateDay({ date: today })} 이후의 날짜만 등록가능합니다.`);
      check = false;
    }

    let isAnyImg = false;
    for (let i = 0; i < files.length; i++) {
      if (['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(files[i].type)) {
        isAnyImg = true;
      }
    }

    if (check && !isAnyImg) {
      alert('이미지를 1개 이상 업로드해주세요.');
      check = false;
    }

    if (check && inputRef.current[5].getInstance().getMarkdown() === '') {
      alert('내용을 입력해주세요');
      check = false;
    }

    if (check) {
      const inputData: saveContestInterface = {
        contestFieldId: contestType === 1 ? '1' : contestType === 2 ? '2' : null,
        title: inputRef.current[0].value,
        topic: inputRef.current[1].value,
        association: inputRef.current[2].value,
        dateContestStart: inputRef.current[3].value + 'T00:00:00',
        dateContestEnd: inputRef.current[4].value + 'T23:59:59',
        content: inputRef.current[5].getInstance().getMarkdown(),
        files: fileId,
      };
      const mutateOptions = {
        onSuccess: () => {
          alert('글이 정상적으로 등록되었습니다');
          navigate(`/board/${url}`);
        },
      };
      if (update === 'create') {
        createMutation.mutate({ contestType: url, body: inputData }, mutateOptions);
      } else if (paramID) {
        updateMutation.mutate({ contestType: url, id: paramID, body: inputData }, mutateOptions);
      }
    }
  };

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

  return (
    <FlexDiv width="100%">
      {update === 'update' && !detail ? (
        <FlexDiv width="100%" height="100vh">
          <Loading />
        </FlexDiv>
      ) : (
        <Container $alignitems="start">
          <FormContent width="100%" $margin="0 0 30px 0">
            <PolicyNotice
              $padding="15px 20px"
              width="100%"
              $justifycontent="start"
              radius={5}
              $border="1px solid"
              $borderColor="bgColor"
            >
              <Div width="25px" height="25px" $margin="0 10px 0 0">
                <Img src="/images/triangle-warning_purple.svg"></Img>
              </Div>
              <Div>
                <P color="bgColor" fontSize="sm" fontWeight={700}>
                  웹사이트 운영 정책을 위반하는 게시글은 예고 없이 삭제 될 수 있습니다.
                </P>
              </Div>
            </PolicyNotice>

            <Div width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
              <FlexDiv
                width=" 100%"
                $padding="20px"
                $justifycontent="space-between"
                $borderB={`1px solid ${theme.color.border}`}
              >
                <Div>
                  <P fontWeight={600}>공모전 제목</P>
                </Div>
              </FlexDiv>
              <Div width="100%" $padding="20px">
                <Div width="100%">
                  <TextInput
                    width="100%"
                    height="60px"
                    placeholder="공모전 이름을 입력하세요."
                    fontSize="xl"
                    $borderRadius={5}
                    ref={(el: never) => (inputRef.current[0] = el)}
                    defaultValue={detail?.title}
                  ></TextInput>
                </Div>
              </Div>
            </Div>

            <Div width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
              <FlexDiv
                width=" 100%"
                $padding="20px"
                $justifycontent="space-between"
                $borderB={`1px solid ${theme.color.border}`}
              >
                <Div>
                  <P fontWeight={600}>공모전 종류</P>
                </Div>
              </FlexDiv>
              <Div width="100%" $padding="20px">
                <Div width="100%">
                  <RadioGroup width="90%" $justifycontent="flex-start">
                    <FlexDiv>
                      <Radio
                        name="setHistoryType"
                        value={'빅데이터'}
                        onClick={() => {
                          setContestType(1);
                        }}
                        defaultChecked={detail?.contestFieldId === 1}
                      />
                      <Label $margin="0 0 0 5px">빅데이터</Label>
                    </FlexDiv>
                    <FlexDiv>
                      <Radio
                        name="setHistoryType"
                        value={'IT'}
                        onClick={() => {
                          setContestType(2);
                        }}
                        defaultChecked={detail?.contestFieldId === 2}
                      />
                      <Label $margin="0 0 0 5px">IT</Label>
                    </FlexDiv>
                    {/* null 해결 후 추가 */}

                    {/* <FlexDiv>
                                            <Radio
                                                name="setHistoryType"
                                                value={"기타"}
                                                onClick={() => {
                                                    setContestType(null);
                                                }}
                                                defaultChecked={detail?.contestFieldId === null}
                                            />
                                            <Label $margin="0 0 0 5px">기타</Label>
                                        </FlexDiv> */}
                  </RadioGroup>
                </Div>
              </Div>
            </Div>

            <Div width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
              <FlexDiv
                width=" 100%"
                $padding="20px"
                $justifycontent="space-between"
                $borderB={`1px solid ${theme.color.border}`}
              >
                <Div>
                  <P fontWeight={600}>공모전 주제</P>
                </Div>
              </FlexDiv>
              <Div width="100%" $padding="20px">
                <Div width="100%">
                  <TextInput
                    width="100%"
                    height="60px"
                    placeholder="공모전 주제를 적어주세요."
                    fontSize="xl"
                    $borderRadius={5}
                    ref={(el: never) => (inputRef.current[1] = el)}
                    defaultValue={detail?.topic}
                  ></TextInput>
                </Div>
              </Div>
            </Div>

            <Div width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
              <FlexDiv
                width=" 100%"
                $padding="20px"
                $justifycontent="space-between"
                $borderB={`1px solid ${theme.color.border}`}
              >
                <Div>
                  <P fontWeight={600}>공모전 주최기관</P>
                </Div>
              </FlexDiv>
              <Div width="100%" $padding="20px">
                <Div width="100%">
                  <TextInput
                    width="100%"
                    height="60px"
                    placeholder="주최기관을 입력하세요."
                    fontSize="xl"
                    $borderRadius={5}
                    ref={(el: never) => (inputRef.current[2] = el)}
                    defaultValue={detail?.association}
                  ></TextInput>
                </Div>
              </Div>
            </Div>

            <Div width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
              <FlexDiv
                width=" 100%"
                $padding="20px"
                $justifycontent="space-between"
                $borderB={`1px solid ${theme.color.border}`}
              >
                <Div>
                  <P fontWeight={600}>공모전 모집 시작일</P>
                </Div>
              </FlexDiv>
              <Div width="100%" $padding="20px">
                <Div width="100%">
                  <DateInput
                    width="100%"
                    height="60px"
                    fontSize="xl"
                    $borderRadius={5}
                    ref={(el: never) => (inputRef.current[3] = el)}
                    defaultValue={detail?.dateContestStart?.split('T')[0]}
                  />
                </Div>
              </Div>
            </Div>

            <Div width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
              <FlexDiv
                width=" 100%"
                $padding="20px"
                $justifycontent="space-between"
                $borderB={`1px solid ${theme.color.border}`}
              >
                <Div>
                  <P fontWeight={600}>공모전 모집 마감일</P>
                </Div>
              </FlexDiv>
              <Div width="100%" $padding="20px">
                <Div width="100%">
                  <DateInput
                    width="100%"
                    height="60px"
                    fontSize="xl"
                    $borderRadius={5}
                    ref={(el: never) => (inputRef.current[4] = el)}
                    defaultValue={detail?.dateContestEnd?.split('T')[0]}
                  />
                </Div>
              </Div>
            </Div>

            <Div width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
              <FileUploadTitle
                width="100%"
                $padding="20px"
                $justifycontent="flex-start"
                $borderB={`1px solid ${theme.color.border}`}
              >
                <Div>
                  <P fontWeight={600}>공모전 포스터 및 첨부파일</P>
                </Div>
                <Div $margin="0 0 0 5px">
                  <P fontSize="xs" color="red" fontWeight={500}>
                    ※ 첨부파일에 사진 파일이 없을 시 정상적으로 게시글이 등록되지 않습니다.
                  </P>
                </Div>
              </FileUploadTitle>
              <Div width="100%" $padding="20px">
                <DragNDrop
                  fileFetch
                  menuId={currentMenuId}
                  initialFiles={update === 'update' ? existingFiles : undefined}
                />
              </Div>
            </Div>

            <Div width="100%" $border="1px solid" $borderColor="border" $margin="20px 0" radius={6}>
              <FlexDiv
                width="100%"
                $padding="20px"
                $justifycontent="flex-start"
                $borderB={`1px solid ${theme.color.border}`}
              >
                <Div>
                  <P fontWeight={600}>공모전 상세 설명</P>
                </Div>
              </FlexDiv>
              <Div width="100%" $padding="20px">
                <TextEditor
                  ref={(el: never) => (inputRef.current[5] = el)}
                  initialContent={detail?.content}
                />
              </Div>
            </Div>

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
          </FormContent>
        </Container>
      )}
    </FlexDiv>
  );
};

export default ContestCreate;
