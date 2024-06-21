import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { theme } from "../../../styles/theme";

import useFetch from "../../../Hooks/useFetch";

import { fileIdList, tokenAccess } from "../../../Recoil/backState";
import { menuId, modalInfo, modalOpen, refetch, selectedFile, selectedStudentInfos } from "../../../Recoil/frontState";

import Button from "../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H2 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import { Input } from "../../../styles/assets/Input";
import P from "../../../styles/assets/P";

import StudentSearchTable from "../../Component/IBAS/Bank/StudentSearchTable";
import DragNDrop from "../DragNDrop";

const ModalUpdateBankHistory = () => {
    const setOpen = useSetRecoilState(modalOpen);

    const [historyInfo, fetchGetHistory] = useFetch();

    const modalContent = useRecoilValue(modalInfo)!;
    const accessToken = useRecoilValue(tokenAccess);
    const currentMenuId = useRecoilValue(menuId);
    const [files, setFileIdList] = useRecoilState(fileIdList);
    const setReload = useSetRecoilState(refetch);
    const [selectedInfos, setSelectedInfos] = useRecoilState(selectedStudentInfos);
    const setFileSelected = useSetRecoilState(selectedFile);

    const [updateHistory, fetchUpdateHistory] = useFetch();

    const [historyType, setHistoryType] = useState("");

    const [infos, setInfos] = useState({
        dateUsed: "",
        title: "",
        details: "",
        memberStudentIdReceived: "",
        memberNameReceived: "",
        income: "0",
        outcome: "0",
    });

    useEffect(() => {
        setFileSelected([]);
        fetchGetHistory(`/budget/history/${modalContent.content}`, "GET", "token");
    }, [accessToken]);

    useEffect(() => {
        setSelectedInfos((prev) => ({
            ...prev,
            name: historyInfo?.memberNameReceived,
            studentId: historyInfo?.memberStudentIdReceived,
        }));
        infos.dateUsed = historyInfo?.dateUsed;
        infos.title = historyInfo?.title;
        infos.details = historyInfo?.details;
        infos.income = String(historyInfo?.income);
        infos.outcome = String(historyInfo?.outcome);
        if (historyInfo?.receipts) {
            setFileSelected(historyInfo?.receipts);
        }
        setFileIdList((prev) => [
            ...prev,
            ...(historyInfo?.receipts ? historyInfo.receipts.map((receipt: any) => receipt?.id ?? []) : []),
        ]);

        if (historyInfo?.income === 0) {
            setHistoryType("outcome");
        } else if (historyInfo?.outcome === 0) {
            setHistoryType("income");
        }
        setReload(true);
    }, [historyInfo]);

    const closeModal = () => {
        setOpen(false);
    };

    const resetInfos = () => {
        setInfos({
            dateUsed: "",
            title: "",
            details: "",
            memberStudentIdReceived: "",
            memberNameReceived: "",
            income: "",
            outcome: "",
        });
    };

    const checkIsCompletedContents = () => {
        if (historyType === "income") {
            if (infos.dateUsed === "") {
                alert("사용일을 입력해주세요");
                return false;
            }
            if (infos.title === "") {
                alert("제목을 입력해주세요");
                return false;
            }
            if (infos.income !== String(parseInt(infos.income))) {
                alert("올바른 수입액을 입력해주세요");
                return false;
            }
            if (parseInt(infos.income) <= 0) {
                alert("1원 이상의 수입액을 입력해주세요");
                return false;
            }
        }

        if (historyType === "outcome") {
            if (infos.dateUsed === "") {
                alert("사용일을 입력해주세요");
                return false;
            }
            if (infos.title === "") {
                alert("제목을 입력해주세요");
                return false;
            }
            if (selectedInfos.name === "") {
                alert("회비 사용 부원을 입력해주세요");
                return false;
            }
            if (infos.outcome !== String(parseInt(infos.outcome))) {
                alert("올바른 수입액을 입력해주세요");
                return false;
            }
            if (parseInt(infos.outcome) <= 0) {
                alert("1원 이상의 지출액을 입력해주세요");
                return false;
            }
        }

        return true;
    };

    const clickUpdateEvent = () => {
        // 필요한 정보가 다 채워졌는지 확인
        if (checkIsCompletedContents() === false) {
            return;
        }

        // 데이터 전송 전 정보 채우기
        if (infos.details.length === 0) {
            infos.details = infos.title;
        }
        infos.memberStudentIdReceived = selectedInfos.studentId;
        infos.memberNameReceived = selectedInfos.name;

        // 파일 담기
        const inputData = {
            dateUsed: infos?.dateUsed?.includes("T") ? infos?.dateUsed : infos.dateUsed + "T00:00:00",
            title: infos.title,
            details: infos.details,
            memberStudentIdReceived: infos.memberStudentIdReceived,
            memberNameReceived: infos.memberNameReceived,
            income: infos.income,
            outcome: infos.outcome,
            files: files,
        };
        fetchUpdateHistory(`/budget/history/${modalContent.content}`, "POST", "token", inputData);
    };

    useEffect(() => {
        if (updateHistory) {
            alert("회계 내역이 정상적으로 수정되었습니다.");
            closeModal();
            setReload(true);
            resetInfos();
            setSelectedInfos({ name: "", major: "", studentId: "" });
            // 파일 리스트 초기화
            setFileIdList([]);
        }
    }, [updateHistory]);

    return (
        <FlexDiv
            width="35%"
            height="600px"
            $backgroundColor="wh"
            direction="column"
            $justifycontent="space-between"
            radius={2}
            overflow="auto"
        >
            <FlexDiv $position="relative" height="95%" overflow="auto">
                <FlexDiv
                    $position="sticky"
                    $top="0"
                    $left="0"
                    $justifycontent="space-between"
                    width="100%"
                    $backgroundColor="bgColor"
                    $padding="15px 20px"
                >
                    <Div>
                        <H2 fontSize="lg" color="wh">
                            회계 내역 수정
                        </H2>
                    </Div>
                    <Div height="24px" $pointer onClick={() => closeModal()}>
                        <Img src={"../images/x_white.svg"} />
                    </Div>
                </FlexDiv>

                <Div width="90%" $margin="20px 0 30px 0">
                    {historyType === "income" ? (
                        <P fontSize="sm" fontWeight={700}>
                            수입
                        </P>
                    ) : (
                        <P fontSize="sm" fontWeight={700}>
                            지출
                        </P>
                    )}
                </Div>

                <Div width="90%">
                    <P fontSize="xs" fontWeight={700}>
                        사용일
                    </P>
                </Div>
                <FlexDiv
                    width="90%"
                    $borderB={`1px solid ${theme.color.grey1}`}
                    $justifycontent="flex-start"
                    height="50px"
                >
                    <Input
                        $padding="0"
                        type="date"
                        width="100%"
                        value={infos.dateUsed?.split("T")[0]}
                        onChange={(e: any) => setInfos((prev) => ({ ...prev, dateUsed: e.target.value }))}
                    />
                </FlexDiv>
                <Div width="90%" $margin="5px 0 20px 0">
                    <P fontSize="xs">영수증에 명시된 사용일을 적어주세요.</P>
                </Div>

                <Div width="90%">
                    <P fontSize="xs" fontWeight={700}>
                        제목
                    </P>
                </Div>
                <FlexDiv
                    width="90%"
                    $borderB={`1px solid ${theme.color.grey1}`}
                    $justifycontent="flex-start"
                    height="50px"
                    $margin="0 0 20px 0"
                >
                    <Input
                        $padding="0"
                        placeholder="제목을 입력하세요"
                        width="100%"
                        value={infos.title}
                        onChange={(e: any) => setInfos((prev) => ({ ...prev, title: e.target.value }))}
                    />
                </FlexDiv>

                <Div width="90%">
                    <P fontSize="xs" fontWeight={700}>
                        내용
                    </P>
                </Div>
                <FlexDiv
                    color="bk"
                    width="90%"
                    $borderB={`1px solid ${theme.color.grey1}`}
                    $justifycontent="flex-start"
                    height="50px"
                >
                    <Input
                        $padding="0"
                        placeholder="내용을 입력하세요"
                        width="100%"
                        value={infos.details}
                        onChange={(e: any) => setInfos((prev) => ({ ...prev, details: e.target.value }))}
                    />
                </FlexDiv>
                <Div width="90%" $margin="5px 0 20px 0">
                    <P fontSize="xs">해당란을 입력하지 않을 시 제목과 내용이 같도록 처리합니다.</P>
                </Div>

                {historyType === "income" && (
                    <>
                        <Div width="90%">
                            <P fontSize="xs" fontWeight={700}>
                                수입액
                            </P>
                        </Div>
                        <FlexDiv
                            width="90%"
                            $margin="20px 0 20px 0"
                            $borderB={`1px solid ${theme.color.grey1}`}
                            $justifycontent="flex-start"
                            height="50px"
                        >
                            <Input
                                type="number"
                                $padding="0"
                                placeholder="수입액을 입력하세요"
                                width="100%"
                                value={infos.income === "0" ? "" : infos.income}
                                onChange={(e: any) => {
                                    setInfos((prev) => ({ ...prev, income: e.target.value }));
                                }}
                            />
                        </FlexDiv>
                    </>
                )}

                {historyType === "outcome" && (
                    <>
                        {/* 선택된 학생 정보 표시 */}
                        <FlexDiv width="90%">
                            <FlexDiv
                                width="100%"
                                $margin="0 0 10px 0"
                                $borderB={`1px solid ${theme.color.grey1}`}
                                $justifycontent="flex-start"
                                height="50px"
                            >
                                <FlexDiv>
                                    <P>이름:</P>
                                </FlexDiv>
                                <FlexDiv $margin="0 0 0 5px">
                                    <P>{selectedInfos.name}</P>
                                </FlexDiv>
                            </FlexDiv>
                            <FlexDiv
                                width="100%"
                                $margin="0 0 10px 0"
                                $borderB={`1px solid ${theme.color.grey1}`}
                                $justifycontent="flex-start"
                                height="50px"
                            >
                                <FlexDiv>
                                    <P>학번:</P>
                                </FlexDiv>
                                <FlexDiv $margin="0 0 0 5px">
                                    <P>{selectedInfos.studentId}</P>
                                </FlexDiv>
                            </FlexDiv>
                            {/* 학생 검색 테이블 */}
                        </FlexDiv>
                        <FlexDiv width="100%">
                            <StudentSearchTable />
                        </FlexDiv>

                        {/* 지출액 입력란 */}
                        <Div width="90%" $margin="20px 0 0 0">
                            <P fontSize="xs" fontWeight={700}>
                                지출액
                            </P>
                        </Div>
                        <FlexDiv
                            width="90%"
                            $borderB={`1px solid ${theme.color.grey1}`}
                            $justifycontent="flex-start"
                            height="50px"
                            $margin="0 0 20px 0"
                        >
                            <Input
                                type="number"
                                $padding="0"
                                placeholder="지출액을 입력하세요"
                                width="100%"
                                value={infos.outcome === "0" ? "" : infos.outcome}
                                onChange={(e: any) => setInfos((prev) => ({ ...prev, outcome: e.target.value }))}
                            />
                        </FlexDiv>
                    </>
                )}

                <FlexDiv width="90%" direction="column">
                    <FlexDiv width="100%" $justifycontent="flex-start" $margin="0 0 10px 0">
                        <FlexDiv $margin="0 10px 0 0">
                            <FlexDiv $margin="0 5px 0 0">
                                <P>*</P>
                            </FlexDiv>
                            <FlexDiv>
                                <P>증빙자료 첨부</P>
                            </FlexDiv>
                        </FlexDiv>
                        <FlexDiv>
                            <P fontSize="xs">해당란은 이미지만 첨부할 수 있습니다.</P>
                        </FlexDiv>
                    </FlexDiv>
                    <FlexDiv width="100%">
                        <DragNDrop fileFetch menuId={currentMenuId} onlyImg />
                    </FlexDiv>
                </FlexDiv>

                <FlexDiv
                    $position="relative"
                    $zIndex={10000}
                    $top="0"
                    $left="0"
                    $margin="20px 0 0 0"
                    width="90%"
                    $backgroundColor="bgColor"
                    height="50px"
                >
                    <Button width="100%" height="100%" onClick={() => clickUpdateEvent()}>
                        <P color="wh">제출</P>
                    </Button>
                </FlexDiv>
            </FlexDiv>
        </FlexDiv>
    );
};

export default ModalUpdateBankHistory;
