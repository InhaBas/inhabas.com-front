import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import useFetch from "../../../Hooks/useFetch";

import { modalOpen, refetch } from "../../../Recoil/frontState";

import Button from "../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H2 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import { Select } from "../../../styles/assets/Input";
import P from "../../../styles/assets/P";

const ModalChangeType = () => {
    const setOpen = useSetRecoilState(modalOpen);

    const closeModal = () => {
        setOpen(false);
    };

    const [data, fetchData] = useFetch();
    const setReload = useSetRecoilState(refetch);
    const [typeValue, setTypeValue] = useState("");

    // select 값 선택에 따른 state 변경 이벤트
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // 선택된 값을 업데이트
        setTypeValue(e.target.value);
    };

    /* 번호 수정 fetch */
    const changeType = () => {
        const inputData = {
            type: typeValue,
        };

        if (inputData.type !== "") {
            console.log(inputData);
            fetchData("/myInfo/detail", "PUT", "token", inputData);
        }
    };

    useEffect(() => {
        if (data) {
            alert("소속이 정상적으로 수정되었습니다.");
            setReload(true);

            setOpen(false);
        }
    }, [data]);

    return (
        <FlexDiv width="44%" $backgroundColor="wh" direction="column" $justifycontent="space-between" radius={2}>
            <FlexDiv $justifycontent="space-between" width="100%" $backgroundColor="bgColor" $padding="15px 20px">
                <Div>
                    <H2 fontSize="lg" color="wh">
                        소속 수정
                    </H2>
                </Div>
                <Div height="24px" $pointer onClick={() => closeModal()}>
                    <Img src={"../images/x_white.svg"} />
                </Div>
            </FlexDiv>
            <FlexDiv $padding="25px" width="100%" height="200px" direction="column" $justifycontent="space-around">
                <Div width="100%" $margin="0 10px 0 0 ">
                    <Select
                        name="approved"
                        $borderRadius={3}
                        required
                        defaultValue="nothing"
                        onChange={handleTypeChange}
                    >
                        <option value="nothing" disabled hidden>
                            선택
                        </option>
                        <option value="GRADUATED">졸업생</option>
                        <option value="BACHELOR">대학원생</option>
                    </Select>
                </Div>
                <FlexDiv width="100%">
                    <Button
                        $backgroundColor="bgColor"
                        $HBackgroundColor="bgColorHo"
                        $borderRadius={3}
                        width="100%"
                        height="40px"
                        onClick={() => changeType()}
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

export default ModalChangeType;
