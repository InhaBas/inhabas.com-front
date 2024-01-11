import { useRef } from "react";
import { useSetRecoilState } from "recoil";

import useFetch from "../../../Hooks/useFetch";

import { modalOpen } from "../../../Recoil/frontState";

import Button from "../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H2 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import { TextInput } from "../../../styles/assets/Input";
import P from "../../../styles/assets/P";

const ModalChangeName = () => {
    const setOpen = useSetRecoilState(modalOpen);

    const closeModal = () => {
        setOpen(false);
    };

    const [data, fetchData] = useFetch();
    const inputRef = useRef<HTMLInputElement>(null);

    // 이름 수정 fetch
    const changeName = () => {
        const inputData = inputRef.current?.value;
        if (inputData !== "") {
            fetchData("/myInfo/name", "PUT", "token", inputData);
        }
        setOpen(false);
    };

    return (
        <FlexDiv width="44%" $backgroundColor="wh" direction="column" $justifycontent="space-between" radius={2}>
            <FlexDiv $justifycontent="space-between" width="100%" $backgroundColor="bgColor" $padding="15px 20px">
                <Div>
                    <H2 fontSize="lg" color="wh">
                        이름수정
                    </H2>
                </Div>
                <Div height="24px" $pointer onClick={() => closeModal()}>
                    <Img src={"../images/x_white.svg"} />
                </Div>
            </FlexDiv>
            <FlexDiv $padding="25px" width="100%" height="200px" direction="column" $justifycontent="space-between">
                <FlexDiv width="100%" $justifycontent="start">
                    <FlexDiv width="10px" $margin="0 5px 0 0">
                        <Img src="../images/check_grey.svg" />
                    </FlexDiv>
                    <Div>
                        <P fontSize="xs" color="grey4" fontWeight={700}>
                            이름은 회장의 승인을 통하여 수정할 수 있습니다.
                        </P>
                    </Div>
                </FlexDiv>
                <Div width="100%">
                    <TextInput ref={inputRef} placeholder="수정하고 싶은 이름을 적어주세요" width="100%" />
                </Div>
                <FlexDiv width="100%">
                    <Button
                        $backgroundColor="bgColor"
                        $HBackgroundColor="bgColorHo"
                        $borderRadius={3}
                        width="100%"
                        height="40px"
                        onClick={() => changeName()}
                    >
                        <P color="wh" fontWeight={400}>
                            수정 신청
                        </P>
                    </Button>
                </FlexDiv>
            </FlexDiv>
        </FlexDiv>
    );
};

export default ModalChangeName;
