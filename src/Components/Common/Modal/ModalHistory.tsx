import { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import useFetch from "../../../Hooks/useFetch";

import { modalInfo, modalOpen, refetch } from "../../../Recoil/frontState";

import { oneHistoryInfo } from "../../../Recoil/backState";
import Button from "../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H2 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import { DateInput, TextArea, TextInput } from "../../../styles/assets/Input";
import P from "../../../styles/assets/P";

const ModalHistory = () => {
    const setOpen = useSetRecoilState(modalOpen);

    const closeModal = () => {
        setOpen(false);
    };

    const [data, fetchData] = useFetch();
    const inputRef = useRef<any[]>([]);
    const modalData = useRecoilValue(modalInfo);
    const [historyInfoData, fetchHistoryInfoData] = useFetch();
    const [history, setHistory] = useRecoilState(oneHistoryInfo);
    const setReload = useSetRecoilState(refetch);

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
                content: inputRef.current[2].value,
                dateHistory: inputRef.current[0].value + "T00:00:00",
            };
            if (modalData.type === "historyPost") {
                fetchData("/club/history", "POST", "token", inputData);
            } else if (modalData.type === "historyPut") {
                fetchData(`/club/history/${history?.id}`, "PUT", "token", inputData);
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
        if (modalData.type === "historyPut") {
            fetchHistoryInfoData(`/club/history/${modalData.content}`, "GET");
        }
    }, []);

    // 단일 연혁 data가 있다면
    useEffect(() => {
        if (historyInfoData) {
            const content = {
                id: historyInfoData.id,
                title: historyInfoData.title,
                content: historyInfoData.content,
                dateHistory: historyInfoData.dateHistory.split("T")[0],
            };

            setHistory(content);
        }
        return () => {
            setHistory(null);
        };
    }, [historyInfoData]);

    return (
        <FlexDiv width="44%" $backgroundColor="wh" direction="column" $justifycontent="space-between" radius={2}>
            <FlexDiv $justifycontent="space-between" width="100%" $backgroundColor="bgColor" $padding="15px 20px">
                <Div>
                    {modalData.type === "historyPost" ? (
                        <H2 fontSize="lg" color="wh">
                            동아리 연혁 등록하기
                        </H2>
                    ) : (
                        <H2 fontSize="lg" color="wh">
                            동아리 연혁 수정하기
                        </H2>
                    )}
                </Div>
                <Div height="24px" $pointer onClick={() => closeModal()}>
                    <Img src={"../images/x_white.svg"} />
                </Div>
            </FlexDiv>
            <FlexDiv $padding="25px" width="100%" height="350px" direction="column" $justifycontent="space-between">
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
                <Div width="100%">
                    <TextArea
                        ref={(el: HTMLTextAreaElement) => (inputRef.current[2] = el)}
                        placeholder="설명을 입력하세요"
                        width="100%"
                        height="150px"
                        defaultValue={history?.content}
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
                        {modalData.type === "historyPost" ? (
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

export default ModalHistory;
