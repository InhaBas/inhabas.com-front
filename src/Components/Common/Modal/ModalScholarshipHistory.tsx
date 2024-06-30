import { useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import useFetch from "../../../Hooks/useFetch";

import { modalInfo, modalOpen, refetch } from "../../../Recoil/frontState";

import Button from "../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H2 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import { DateInput, TextInput } from "../../../styles/assets/Input";
import P from "../../../styles/assets/P";
import { useState } from "react";

const ModalScholarshipHistory = () => {
    const setOpen = useSetRecoilState(modalOpen);

    const closeModal = () => {
        setOpen(false);
    };

    const inputRef = useRef<any[]>([]);
    
    const [data, fetchData] = useFetch();
    const [historyInfoData, fetchHistoryInfoData] = useFetch();
    
    const [history, setHistory] = useState({ id: '', dateHistory: '', title: '' });
    
    const setReload = useSetRecoilState(refetch);
    const modalData = useRecoilValue(modalInfo);
    
    // 연혁 등록 fetch
    const addHistory = () => {
        let check = true;

        if (check && inputRef.current[0].value === "") {
            alert("날짜를 선택해주세요");
            check = false;
        }

        if (check && inputRef.current[1].value === "") {
            alert("제목을 입력해주세요");
            check = false;
        }

        if (check) {
            let inputData = {
                title: inputRef.current[1].value,
                dateHistory: inputRef.current[0].value + "T00:00:00",
            };
            if (modalData.type === "scholarshipPost") {
                fetchData("/scholarship/history", "POST", "token", inputData);
            } else if (modalData.type === "scholarshipUpdate") {
                fetchData(`/scholarship/history/${history?.id}`, "PUT", "token", inputData);
            }
        }
    };

    // 연혁 등록 data가 있다면
    useEffect(() => {
        if (data) {
            alert("연혁이 정상적으로 등록되었습니다.");
            setOpen(false);
            setReload(true);
        }
    }, [data]);

    // 단일 연혁 가져오기
    useEffect(() => {
        fetchHistoryInfoData(`/scholarship/histories`, 'GET', 'token');
    }, []);

    // 단일 연혁 data가 있다면
    useEffect(() => {
        if (historyInfoData) {
            for (const data of Object.values(historyInfoData as Record<string, any>)) {
                for (const infos of data.data) {
                    if (infos.id == modalData?.content) {
                        setHistory({
                            id: infos.id,
                            title: infos.title,
                            dateHistory: infos.dateHistory.split("T")[0],
                        })
                        break;
                    }
                }
            }
        }
    }, [historyInfoData]);

    return (
        <FlexDiv width="44%" $backgroundColor="wh" direction="column" $justifycontent="space-between" radius={2}>
            <FlexDiv $justifycontent="space-between" width="100%" $backgroundColor="bgColor" $padding="15px 20px">
                <Div>
                    {modalData.type === "scholarshipPost" ? (
                        <H2 fontSize="lg" color="wh">
                            장학회 연혁 등록하기
                        </H2>
                    ) : (
                        <H2 fontSize="lg" color="wh">
                            장학회 연혁 수정하기
                        </H2>
                    )}
                </Div>
                <Div height="24px" $pointer onClick={() => closeModal()}>
                    <Img src={"../images/x_white.svg"} />
                </Div>
            </FlexDiv>
            <FlexDiv $padding="25px" width="100%" height="200px" direction="column" $justifycontent="space-between">
                <Div width="100%">
                    <DateInput
                        ref={(el: HTMLInputElement) => (inputRef.current[0] = el)}
                        width="100%"
                        defaultValue={history?.dateHistory}
                    />
                </Div>
                <Div width="100%">
                    <TextInput
                        ref={(el: HTMLInputElement) => (inputRef.current[1] = el)}
                        placeholder="제목을 입력하세요"
                        width="100%"
                        defaultValue={history?.title}
                    />
                </Div>
                <FlexDiv width="100%">
                    <Button
                        $backgroundColor="bgColor"
                        $HBackgroundColor="bgColorHo"
                        $borderRadius={3}
                        width="100%"
                        height="40px"
                        onClick={() => addHistory()}
                    >
                        {modalData.type === "scholarshipPost" ? (
                            <P color="wh" fontWeight={400}>
                                등록
                            </P>
                        ) : (
                            <P color="wh" fontWeight={400}>
                                수정
                            </P>
                        )}
                    </Button>
                </FlexDiv>
            </FlexDiv>
        </FlexDiv>
    );
};

export default ModalScholarshipHistory;
