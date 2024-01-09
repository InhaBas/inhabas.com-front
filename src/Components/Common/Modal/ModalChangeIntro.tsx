import { useRef } from "react";
import { useSetRecoilState } from "recoil";

import useFetch from "../../../Hooks/useFetch";

import { modalOpen, refetch } from "../../../Recoil/frontState";

import Button from "../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H2 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import { Checkbox, TextArea } from "../../../styles/assets/Input";
import P from "../../../styles/assets/P";

const ModalChangeIntro = () => {
    const setOpen = useSetRecoilState(modalOpen);

    const closeModal = () => {
        setOpen(false);
    };

    const [data, fetchData] = useFetch();
    const setReload = useSetRecoilState(refetch);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const checkRef = useRef<HTMLInputElement>(null);
    const changeIntro = () => {
        const inputData = {
            introduce: inputRef.current?.value,
            isHOF: checkRef.current?.checked,
        };
        fetchData("/myInfo/intro", "PUT", "token", inputData);
        setReload(true);
        setOpen(false);
    };

    return (
        <FlexDiv width="44%" $backgroundColor="wh" direction="column" $justifycontent="space-between" radius={2}>
            <FlexDiv $justifycontent="space-between" width="100%" $backgroundColor="bgColor" $padding="15px 20px">
                <Div>
                    <H2 fontSize="lg" color="wh">
                        자기소개
                    </H2>
                </Div>
                <Div height="24px" $pointer onClick={() => closeModal()}>
                    <Img src={"../images/x_white.svg"} />
                </Div>
            </FlexDiv>
            <FlexDiv $padding="25px" width="100%" height="300px" direction="column" $justifycontent="space-between">
                <FlexDiv width="100%" $justifycontent="start">
                    <FlexDiv width="10px" $margin="0 5px 0 0">
                        <Img src="../images/check_grey.svg" />
                    </FlexDiv>
                    <Div>
                        <P fontSize="xs" color="grey4" fontWeight={700}>
                            자기소개 공개에 동의하시면 졸업 후 졸업생 명예의 전당에 정보가 공개됩니다.
                        </P>
                    </Div>
                </FlexDiv>
                <FlexDiv width="100%" $justifycontent="start">
                    <FlexDiv $margin="0 5px 0 0">
                        <Checkbox ref={checkRef} />
                    </FlexDiv>
                    <Div>
                        <P fontSize="xs" color="grey4" fontWeight={700}>
                            자기소개 공개에 동의합니다.
                        </P>
                    </Div>
                </FlexDiv>
                <Div width="100%">
                    <TextArea ref={inputRef} placeholder="간단한 본인 소개를 적어주세요" width="100%" height="100px" />
                </Div>
                <FlexDiv width="100%">
                    <Button
                        $backgroundColor="bgColor"
                        $HBackgroundColor="bgColorHo"
                        $borderRadius={3}
                        width="100%"
                        height="40px"
                        onClick={() => changeIntro()}
                    >
                        <P color="wh" fontWeight={400}>
                            등록
                        </P>
                    </Button>
                </FlexDiv>
            </FlexDiv>
        </FlexDiv>
    );
};

export default ModalChangeIntro;
