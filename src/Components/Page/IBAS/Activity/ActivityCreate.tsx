import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import styled from "styled-components";
import { theme } from "../../../../styles/theme";

import useFetch from "../../../../Hooks/useFetch";

import { fileIdList } from "../../../../Recoil/backState";
import { menuId, refetch, selectedFile } from "../../../../Recoil/frontState";

import { ActivityDetailInterface } from "../../../../Types/IBAS/TypeIBAS";

import Button from "../../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import { TextInput } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";
import DragNDrop from "../../../Common/DragNDrop";
import Loading from "../../../Common/Loading";
import TextEditor from "../../../Common/TextEditor";

const TitleTextInput = styled(TextInput)`
    border-radius: 5px;
    font-size: 25px;

    &::placeholder {
        color: ${(props) => props.theme.color.grey1};
    }
`;

const ActivityCreate = () => {
    const navigate = useNavigate();
    const paramID = useParams().id;
    const inputRef = useRef<any[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [postData, postFetchData] = useFetch();
    const [getData, getFetchData] = useFetch();
    const setSelectedFile = useSetRecoilState(selectedFile);
    const [fileId, setFileList] = useRecoilState(fileIdList);
    const [files, setFiles] = useRecoilState(selectedFile);
    const [detail, setDetail] = useState<ActivityDetailInterface | null>(null);
    const currentMenuId = useRecoilValue(menuId);
    const setReload = useSetRecoilState(refetch);

    const [update, setUpdate] = useState("create");
    const [existingImageFiles, setExistingImageFiles] = useState<File[]>([]);

    const checkImageFileExists = (files: File[]) => {
        return files.some((file) => ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type));
    };

    const sendInput = () => {
        if (inputRef.current[0].value === "") {
            alert("제목을 입력해주세요");
            return;
        }

        const isAnyImg = checkImageFileExists(files);
        if (update === "create" && !isAnyImg) {
            alert("1개 이상의 이미지 파일을 포함해주세요");
            return;
        }

        if (update === "update") {
            // Get new files that were added
            const newFiles = files.filter(
                (file) => !existingImageFiles.some((existingFile) => existingFile.name === file.name)
            );
            const isNewImageFile = checkImageFileExists(newFiles);

            // If no new image file and existing image files are empty
            if (!isNewImageFile && existingImageFiles.length === 0) {
                alert("1개 이상의 이미지 파일을 포함해주세요");
                return;
            }
        }

        if (inputRef.current[1].getInstance().getMarkdown().trim() === "") {
            alert("내용을 입력해주세요");
            return;
        }

        const inputData = {
            title: inputRef.current[0].value,
            content: inputRef.current[1].getInstance().getMarkdown(),
            files: fileId,
        };

        const formData = new FormData();
        files.forEach((file) => formData.append("files", file));

        if (update === "update") {
            postFetchData(`/club/activity/${paramID}`, "POST", "token", inputData);
        } else {
            postFetchData(`/club/activity`, "POST", "token", inputData);
        }
    };

    useEffect(() => {
        if (paramID) {
            setUpdate("update");
        } else {
            setIsLoading(false);
        }
    }, [paramID]);

    useEffect(() => {
        if (update === "update") {
            getFetchData(`/club/activity/${paramID}`, "GET", "token");
        }
    }, [update, paramID]);

    useEffect(() => {
        if (postData) {
            alert(update === "update" ? "글이 정상적으로 수정되었습니다" : "글이 정상적으로 등록되었습니다");
            navigate(`/activity`);
        }
    }, [postData, update, navigate]);

    useEffect(() => {
        if (getData) {
            setDetail(getData);
            setIsLoading(false);

            const allFiles = [
                ...getData.images.map((item: any) => item),
                ...getData.otherFiles.map((item: any) => item),
            ];
            const imageFiles = allFiles.filter((file: File) =>
                ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(file.type)
            );
            setExistingImageFiles(imageFiles);

            setSelectedFile(allFiles);
            const fileIds = [
                ...getData.images.map((item: any) => item?.id),
                ...getData.otherFiles.map((item: any) => item?.id),
            ];
            setFileList(fileIds);
            setReload(true);
        }
        return () => {
            setDetail(null);
            setFileList([]);
        };
    }, [getData, setSelectedFile, setFileList, setReload]);

    return (
        <FlexDiv width="100%" $border={`1px solid ${theme.color.grey1}`}>
            {isLoading ? (
                <FlexDiv width="100%" height="100vh">
                    <Loading />
                </FlexDiv>
            ) : (
                <Container>
                    <Div width="100%">
                        <Div $border="1px solid" $borderColor="border" radius={5} width="100%">
                            <Div $borderB={`1px solid ${theme.color.border}`} $padding="20px" width="100%">
                                <P fontWeight={600}>{update === "update" ? "게시글 수정" : "게시글 작성"}</P>
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

                                <DragNDrop fileFetch menuId={currentMenuId} />
                            </Div>
                            <Div width="100%" $padding="20px">
                                <TextEditor
                                    ref={(el: never) => (inputRef.current[1] = el)}
                                    initialContent={detail?.content}
                                />
                            </Div>
                        </Div>

                        <FlexDiv width="100%" $margin="30px 0 0 0">
                            <Button
                                $backgroundColor="bgColor"
                                $HBackgroundColor="bgColorHo"
                                $borderRadius={2}
                                $padding="15px 30px"
                                width="400px"
                                onClick={sendInput}
                            >
                                <P color="wh">{update === "update" ? "수정하기" : "작성하기"}</P>
                            </Button>
                        </FlexDiv>
                    </Div>
                </Container>
            )}
        </FlexDiv>
    );
};

export default ActivityCreate;
