import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import DragNDrop from '../../components/common/DragNDrop';
import Loading from '../../components/common/Loading';
import TextEditor from '../../components/common/TextEditor';
import { clubActivityMutations, clubQueries } from '../../queries/club';
import { fileIdList } from '../../recoil/backState';
import { menuId, selectedFile } from '../../recoil/frontState';
import Button from '../../styles/assets/Button';
import { Container, Div, FlexDiv } from '../../styles/assets/Div';
import { TextInput } from '../../styles/assets/Input';
import P from '../../styles/assets/P';
import { media, theme } from '../../styles/theme';
import { fileDownloadInterface } from '../../types/TypeCommon';

const TitleTextInput = styled(TextInput)`
  border-radius: 5px;
  font-size: 25px;

  &::placeholder {
    color: ${(props) => props.theme.color.grey1};
  }

  ${media.mobile} {
    font-size: 20px;
  }
`;

const FormContent = styled(Div)`
  &,
  * {
    box-sizing: border-box;
  }
`;

const SubmitButton = styled(Button)`
  width: 400px;
  max-width: 100%;

  ${media.mobile} {
    width: 100%;
  }
`;

const ActivityCreate = () => {
  const navigate = useNavigate();
  const paramID = useParams().id;
  const inputRef = useRef<any[]>([]);

  const update = paramID ? 'update' : 'create';
  const setSelectedFile = useSetRecoilState(selectedFile);
  const [fileId, setFileList] = useRecoilState(fileIdList);
  const files = useRecoilValue(selectedFile);
  const currentMenuId = useRecoilValue(menuId);

  // 옛 화면 그대로 수정 화면은 토큰과 함께 조회한다
  const { data: detailData, isFetchedAfterMount } = useQuery({
    ...clubQueries.activityDetail({ id: paramID ?? '', auth: true }),
    enabled: update === 'update',
  });
  // 옛 화면처럼 이 화면에서 새로 받은 응답이 올 때까지 스피너를 보이고, 그 응답으로 폼을 채운다
  const detail = isFetchedAfterMount ? detailData : undefined;
  const createMutation = useMutation(clubActivityMutations.create());
  const updateMutation = useMutation(clubActivityMutations.update());
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // 기존 첨부(이미지 → 그 밖의 파일 순서). DragNDrop 미리보기와 fileIdList의 순서가 같아야 미리보기를 지울 때 맞는 id가 빠진다
  const existingFiles: fileDownloadInterface[] = detail
    ? [...detail.images, ...detail.otherFiles]
    : [];
  const existingImageFiles = existingFiles.filter((file) =>
    ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type),
  );

  const checkImageFileExists = (files: { type: string }[]) => {
    return files.some((file) =>
      ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type),
    );
  };

  const sendInput = () => {
    if (isSubmitting) return;
    if (inputRef.current[0].value === '') {
      alert('제목을 입력해주세요');
      return;
    }

    const isAnyImg = checkImageFileExists(files);
    if (update === 'create' && !isAnyImg) {
      alert('1개 이상의 이미지 파일을 포함해주세요');
      return;
    }

    if (update === 'update') {
      // Get new files that were added
      const newFiles = files.filter(
        (file) => !existingImageFiles.some((existingFile) => existingFile.name === file.name),
      );
      const isNewImageFile = checkImageFileExists(newFiles);

      // If no new image file and existing image files are empty
      if (!isNewImageFile && existingImageFiles.length === 0) {
        alert('1개 이상의 이미지 파일을 포함해주세요');
        return;
      }
    }

    if (inputRef.current[1].getInstance().getMarkdown().trim() === '') {
      alert('내용을 입력해주세요');
      return;
    }

    const inputData = {
      title: inputRef.current[0].value,
      content: inputRef.current[1].getInstance().getMarkdown(),
      files: fileId,
    };

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const mutateOptions = {
      onSuccess: () => {
        alert(
          update === 'update' ? '글이 정상적으로 수정되었습니다' : '글이 정상적으로 등록되었습니다',
        );
        navigate(`/activity`);
      },
    };
    if (update === 'update' && paramID) {
      updateMutation.mutate({ id: paramID, body: inputData }, mutateOptions);
    } else {
      createMutation.mutate(inputData, mutateOptions);
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
    <FlexDiv width="100%" $border={`1px solid ${theme.color.grey1}`}>
      {update === 'update' && !detail ? (
        <FlexDiv width="100%" height="100vh">
          <Loading />
        </FlexDiv>
      ) : (
        <Container>
          <FormContent width="100%">
            <Div $border="1px solid" $borderColor="border" radius={5} width="100%">
              <Div $borderB={`1px solid ${theme.color.border}`} $padding="20px" width="100%">
                <P fontWeight={600}>{update === 'update' ? '게시글 수정' : '게시글 작성'}</P>
              </Div>
              <Div width="100%" $padding="20px">
                <Div width="100%" $margin="0 0 30px 0">
                  <TitleTextInput
                    width="100%"
                    height="70px"
                    placeholder="제목을 입력해주세요"
                    ref={(el: never) => (inputRef.current[0] = el)}
                    defaultValue={detail?.title}
                  />
                </Div>

                <DragNDrop
                  fileFetch
                  menuId={currentMenuId}
                  initialFiles={update === 'update' ? existingFiles : undefined}
                />
              </Div>
              <Div width="100%" $padding="20px">
                <TextEditor
                  ref={(el: never) => (inputRef.current[1] = el)}
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
                onClick={sendInput}
              >
                <P color="wh">{update === 'update' ? '수정하기' : '작성하기'}</P>
              </SubmitButton>
            </FlexDiv>
          </FormContent>
        </Container>
      )}
    </FlexDiv>
  );
};

export default ActivityCreate;
