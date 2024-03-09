import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { selectedFile } from "../../Recoil/frontState";
import { Div, FlexDiv, InputLabel } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import { Input } from "../../styles/assets/Input";
import P from "../../styles/assets/P";

interface DragNDropProps {
    single?: boolean;
    onlyImg?: boolean;
}

const DragNDrop: React.FC<DragNDropProps> = ({ single = false, onlyImg = false }) => {
    const [previews, setPreviews] = useState<{ url: string; name: string; width: string; height: string }[]>([]);
    const [hover, setHover] = useState<number | null>(null);
    const setSelectedFile = useSetRecoilState(selectedFile);

    const isImageFile = (file: File): boolean => {
        const acceptedImageTypes: string[] = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
        return file && acceptedImageTypes.includes(file.type);
    };

    const handleFileChange = (files: FileList | null): void => {
        if (files) {
            const fileList = Array.from(files);
            setSelectedFile(fileList);
            const newPreviews: { url: string; name: string; width: string; height: string }[] = [];
            fileList.forEach((file, index) => {
                if (index === 0 || !single) {
                    if (isImageFile(file)) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            if (typeof reader.result === "string") {
                                newPreviews.push({
                                    url: reader.result,
                                    name: file.name,
                                    width: "100%",
                                    height: "100%",
                                });
                                setPreviews(newPreviews);
                            }
                        };
                        reader.readAsDataURL(file);
                    } else {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            if (typeof reader.result === "string") {
                                newPreviews.push({
                                    url: "/images/attachment_grey.svg",
                                    name: file.name,
                                    width: "60%",
                                    height: "60%",
                                });
                                setPreviews(newPreviews);
                            }
                        };
                        reader.readAsDataURL(file);
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
        const updatedPreviews = previews.slice(); // 배열 복제
        updatedPreviews.splice(index, 1); // 배열에서 요소 삭제
        setPreviews(updatedPreviews); // 업데이트된 배열로 상태 업데이트
    };

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
