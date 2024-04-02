import { useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

import useFetch from "../../../Hooks/useFetch";

import { modalOpen, selectedFile } from "../../../Recoil/frontState";

import Button from "../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H2 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";
import DragNDrop from "../DragNDrop";

const ModalChangeImg = () => {
    const setOpen = useSetRecoilState(modalOpen);
    const [files, setFiles] = useRecoilState(selectedFile);

    const closeModal = () => {
        setOpen(false);
    };

    const [data, fetchData] = useFetch();
    const inputRef = useRef<HTMLInputElement>(null);

    // 이름 수정 fetch
    const changeImg = () => {
        let inputFormData = new FormData();
        inputFormData.append("picture", files[0]);

        if (inputFormData) {
            fetchData("/myInfo/picture", "POST", "token", inputFormData, true);
        }
    };

    useEffect(() => {
        if (data) {
            alert("프로필 사진이 정상적으로 수정되었습니다.");
            setOpen(false);
        }
        return () => {
            setFiles([]);
        };
    }, [data]);

    return (
        <FlexDiv width="30%" $backgroundColor="wh" direction="column" $justifycontent="space-between" radius={2}>
            <FlexDiv $justifycontent="space-between" width="100%" $backgroundColor="bgColor" $padding="15px 20px">
                <Div>
                    <H2 fontSize="lg" color="wh">
                        프로필 사진 수정
                    </H2>
                </Div>
                <Div height="24px" $pointer onClick={() => closeModal()}>
                    <Img src={"../images/x_white.svg"} />
                </Div>
            </FlexDiv>
            <FlexDiv $padding="25px" width="100%" direction="column" $justifycontent="space-between">
                <Div width="100%">
                    <DragNDrop onlyImg single />
                </Div>
                <FlexDiv width="100%">
                    <Div $margin="20px 0">
                        <P fontSize="xs" color="red">
                            첨부된 파일 없이 수정 버튼을 누를 경우 기본 프로필 사진으로 설정됩니다.
                        </P>
                    </Div>
                </FlexDiv>
                <FlexDiv width="100%">
                    <Button
                        $backgroundColor="bgColor"
                        $HBackgroundColor="bgColorHo"
                        $borderRadius={3}
                        width="100%"
                        height="40px"
                        onClick={() => changeImg()}
                    >
                        <P color="wh" fontWeight={400}>
                            수정
                        </P>
                    </Button>
                </FlexDiv>
            </FlexDiv>
        </FlexDiv>
    );
};

export default ModalChangeImg;
