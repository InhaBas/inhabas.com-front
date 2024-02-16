import { useEffect, useRef } from "react";
import { useSetRecoilState } from "recoil";

import useFetch from "../../../Hooks/useFetch";

import { modalOpen, refetch } from "../../../Recoil/frontState";

import Button from "../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H2 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import { TextInput } from "../../../styles/assets/Input";
import P from "../../../styles/assets/P";

const ModalChangeNumber = () => {
    /* 전화번호 출력 형식 설정 */
    const autoHyphen = (target: HTMLInputElement | null) => {
        if (!target) {
            return;
        }

        let value = target.value.replace(/[^0-9]/g, "");

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        target.value = value.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/, "$1-$2-$3").replace(/(\-{1,2})$/, "");
    };

    const setOpen = useSetRecoilState(modalOpen);

    const closeModal = () => {
        setOpen(false);
    };

    const [data, fetchData] = useFetch();
    const setReload = useSetRecoilState(refetch);
    const inputRef = useRef<HTMLInputElement>(null);

    /* 번호 수정 fetch */
    const changeNumber = () => {
        const inputData = {
            phoneNumber: inputRef.current?.value,
        };

        if (!inputRef.current) {
            setReload(false);
            setOpen(false);
            return;
        }

        /* 전화번호 유효성 검사 */
        if (inputRef.current?.value.length < 13 || inputRef.current?.value.slice(0, 3) !== "010") {
            alert("핸드폰번호를 정확하게 입력해주세요");
        } else if (inputRef.current?.value.length >= 13 || inputRef.current?.value.slice(0, 3) === "010") {
            fetchData("/myInfo/detail", "PUT", "token", inputData);
        }
    };

    useEffect(() => {
        if (data) {
            alert("전화번호가 정상적으로 수정되었습니다.");
            setReload(true);

            setOpen(false);
        }
    }, [data]);

    return (
        <FlexDiv width="44%" $backgroundColor="wh" direction="column" $justifycontent="space-between" radius={2}>
            <FlexDiv $justifycontent="space-between" width="100%" $backgroundColor="bgColor" $padding="15px 20px">
                <Div>
                    <H2 fontSize="lg" color="wh">
                        전화번호수정
                    </H2>
                </Div>
                <Div height="24px" $pointer onClick={() => closeModal()}>
                    <Img src={"../images/x_white.svg"} />
                </Div>
            </FlexDiv>
            <FlexDiv $padding="25px" width="100%" height="200px" direction="column" $justifycontent="space-around">
                <Div width="100%">
                    <TextInput
                        ref={inputRef}
                        placeholder="수정하고 싶은 전화번호를 적어주세요"
                        width="100%"
                        onChange={() => autoHyphen(inputRef.current)}
                    />
                </Div>
                <FlexDiv width="100%">
                    <Button
                        $backgroundColor="bgColor"
                        $HBackgroundColor="bgColorHo"
                        $borderRadius={3}
                        width="100%"
                        height="40px"
                        onClick={() => changeNumber()}
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

export default ModalChangeNumber;
