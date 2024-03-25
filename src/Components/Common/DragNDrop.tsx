import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import useFetch from "../../Hooks/useFetch";
import { fileIdList } from "../../Recoil/backState";
import { refetch, selectedFile } from "../../Recoil/frontState";
import { Div, FlexDiv, InputLabel } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import { Input } from "../../styles/assets/Input";
import P from "../../styles/assets/P";

interface DragNDropProps {
    single?: boolean;
    onlyImg?: boolean;
    fileFetch?: boolean;
    menuId?: number;
}

const DragNDrop: React.FC<DragNDropProps> = ({ single, onlyImg, fileFetch, menuId }) => {
    const [previews, setPreviews] = useState<{ url: string; name: string; width: string; height: string }[]>([]);
    const [hover, setHover] = useState<number | null>(null);
    const [fileSelected, setFileSelected] = useRecoilState(selectedFile);
    const [fileData, fetchFileData] = useFetch();
    const [fileId, setFileIdList] = useRecoilState(fileIdList);

    const isImageFile = (file: File): boolean => {
        const acceptedImageTypes: string[] = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
        return file && acceptedImageTypes.includes(file.type);
    };

    const isOtherFile = (file: File): boolean => {
        const acceptedTypes: string[] = [
            "application/vnd.ms-excel", // xls
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
            "application/msword", // doc
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
            "application/vnd.ms-powerpoint", // ppt
            "text/plain", // txt
            "application/pdf", // pdf
            "application/zip", // zip
            "text/csv", // csv
        ];
        return file && acceptedTypes.includes(file.type);
    };

    const isFileSizeExceeded = (file: File, maxSizeInBytes: number): boolean => {
        return file.size > maxSizeInBytes;
    };

    const handleFileChange = (files: FileList | null): void => {
        if (files) {
            const fileList = Array.from(files);

            // 파일 크기가 20MB를 초과하는지 확인
            const isOverMaxSize = fileList.some((file) => isFileSizeExceeded(file, 1024 * 1024 * 20));

            if (isOverMaxSize) {
                // 파일 크기가 20MB를 초과하는 경우 알림 띄우기
                alert("파일 크기는 최대 20MB까지 허용됩니다.");
                return; // 파일 첨부 중단
            }

            fileList.forEach((file, index) => {
                if (index === 0 || !single) {
                    const newPreview: { url: string; name: string; width: string; height: string; id: string } = {
                        url: "",
                        name: "",
                        width: "",
                        height: "",
                        id: "",
                    };

                    if (isImageFile(file)) {
                        setFileSelected(fileList);

                        const reader = new FileReader();
                        reader.onloadend = () => {
                            if (typeof reader.result === "string") {
                                newPreview.url = reader.result;
                                newPreview.name = file.name;
                                newPreview.width = "100%";
                                newPreview.height = "100%";
                                setPreviews((prevPreviews) => [...prevPreviews, newPreview]);
                            }
                        };
                        reader.readAsDataURL(file);

                        if (fileFetch) {
                            // fetch 요청을 각 파일마다 발생
                            const previewsFormData = new FormData();
                            previewsFormData.append("file", file); // 파일을 FormData에 추가
                            fetchFileData(`/file/upload/${menuId}`, "POST", "token", previewsFormData, true);
                        }
                    } else {
                        if (isOtherFile(file)) {
                            setFileSelected(fileList);

                            newPreview.url = "/images/attachment_grey.svg";
                            newPreview.name = file.name;
                            newPreview.width = "60%";
                            newPreview.height = "60%";
                            setPreviews((prevPreviews) => [...prevPreviews, newPreview]);

                            if (fileFetch) {
                                // fetch 요청을 각 파일마다 발생
                                const previewsFormData = new FormData();
                                previewsFormData.append("file", file); // 파일을 FormData에 추가
                                fetchFileData(`/file/upload/${menuId}`, "POST", "token", previewsFormData, true);
                            }
                        } else {
                            alert("업로드할 수 있는 확장자 파일이 아닙니다.");
                        }
                    }
                }
            });
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files) {
            handleFileChange(files);
        }
    };

    const handleDeletePreview = (index: number): void => {
        const updatedPreviews = previews.slice(); // 썸네일 배열 복제
        updatedPreviews.splice(index, 1); // 선택한 썸네일 삭제
        setPreviews(updatedPreviews); // 변경된 썸네일 배열로 상태 업데이트

        // 삭제된 파일의 ID 찾기
        const deletedFileId = fileId[index]; // fileIdList에서 삭제된 파일의 ID
        if (deletedFileId) {
            // fileIdList에서 삭제된 파일의 ID를 제거
            setFileIdList((prevFileIdList) => prevFileIdList.filter((fileId) => fileId !== deletedFileId));
        }

        // fileSelected에서 삭제된 파일 제거
        const updatedFileSelected = fileSelected.filter((file, idx) => idx !== index);
        setFileSelected(updatedFileSelected); // 변경된 파일 목록으로 상태 업데이트
    };

    useEffect(() => {
        if (fileData) {
            // 파일이 업로드되면 fileId를 추가
            setFileIdList((prevFileList) => [...prevFileList, fileData.id]);
        }
    }, [fileData]);

    const [reload, setReload] = useRecoilState(refetch);

    useEffect(() => {
        if (fileSelected.length !== 0 && reload === true) {
            setReload(false);
            console.log(fileSelected);
            const fileList = fileSelected;
            fileList.forEach((item) => {
                console.log(typeof item);

                const url = isImageFile(item) ? item.url : "/images/attachment_grey.svg";
                const size = isImageFile(item) ? "100%" : "60%";
                setPreviews((prevPreviews) => [
                    ...prevPreviews,

                    {
                        url: url,
                        name: item.name,
                        width: size,
                        height: size,
                        id: item.id, // 파일 객체에 ID 추가
                    },
                ]);
            });
        }
    }, [reload]);

    return (
        <>
            <Input
                id="fileAttach"
                type="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files)}
                onDrop={(e: React.DragEvent<HTMLInputElement>) => handleFileChange(e.dataTransfer.files)}
                style={{ display: "none" }}
                multiple={!single}
                accept={onlyImg ? "image/*" : undefined}
                draggable="true"
            />
            <Div
                id="dropZone"
                $border="2px dashed"
                $borderColor="border"
                width="100%"
                $padding="20px"
                onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <InputLabel htmlFor="fileAttach" width="100%" $justifycontent="space-between" $pointer>
                    <FlexDiv direction="column" width="100%">
                        <FlexDiv width="60px" height="60px" $margin="20px 0 0 0">
                            <Img src="/images/upload_grey.svg" />
                        </FlexDiv>
                        <FlexDiv $margin="0 0 20px 0">
                            <P>클릭하거나 드래그하여 파일을 업로드하세요</P>
                        </FlexDiv>
                    </FlexDiv>
                </InputLabel>
                <FlexDiv width="100%" overflow="auto" $justifycontent="start" wrap="no-wrap">
                    {previews.map((preview, index) => (
                        <Div
                            key={index}
                            $position="relative"
                            display="inline-block"
                            $border="2px solid"
                            $borderColor="grey1"
                            $margin="0 15px 0 0"
                            onMouseEnter={() => {
                                setHover(index);
                            }}
                            onMouseLeave={() => {
                                setHover(null);
                            }}
                        >
                            <FlexDiv width="96px" height="96px" $position="relative">
                                <FlexDiv width={preview.width} height={preview.height}>
                                    <Img src={preview.url} alt={`File Preview ${index}`} />
                                </FlexDiv>
                                {hover === index && (
                                    <FlexDiv
                                        $position="absolute"
                                        $top="0"
                                        $left="0"
                                        width="100%"
                                        height="100%"
                                        $backgroundColor="whlayer"
                                        $zIndex={1}
                                        $padding="10px"
                                        style={{
                                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                                        }}
                                    >
                                        <Div>
                                            <P fontSize="xs" $whiteSpace="normal" fontWeight={700}>
                                                {preview.name}
                                            </P>
                                        </Div>
                                    </FlexDiv>
                                )}
                            </FlexDiv>
                            <FlexDiv
                                radius={100}
                                $backgroundColor="red"
                                $pointer
                                $position="absolute"
                                $top="3px"
                                $right="3px"
                                $zIndex={3}
                                onClick={() => handleDeletePreview(index)}
                            >
                                <Div width="15px" height="15px">
                                    <Img src="/images/x_white.svg" alt="Delete Preview" />
                                </Div>
                            </FlexDiv>
                        </Div>
                    ))}
                </FlexDiv>
            </Div>
        </>
    );
};

export default DragNDrop;
