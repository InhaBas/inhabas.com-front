import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { theme } from "../../../styles/theme";

import useFetch from "../../../Hooks/useFetch";

import { fileIdList } from "../../../Recoil/backState";

import { modalOpen, selectedStudentInfos } from "../../../Recoil/frontState";
import { menuId, refetch } from "../../../Recoil/frontState";

import Button from "../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H2 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";

import { Radio, Label, Input } from "../../../styles/assets/Input";

import StudentSearchTable from "../../Component/IBAS/Bank/StudentSearchTable";
import DragNDrop from "../DragNDrop";

const ModalPostBankHistory = () => {
    const setOpen = useSetRecoilState(modalOpen);
    
    const closeModal = () => {
        setOpen(false);
    };
    
    const [selectedInfos, setSelectedInfos] = useRecoilState(selectedStudentInfos);
    const currentMenuId = useRecoilValue(menuId);
    const [files, setFiles] = useRecoilState(fileIdList);
    const setReload = useSetRecoilState(refetch);

    const [infos, setInfos] = useState({
        "dateUsed": "",
        "title": "",
        "details": "",
        "memberStudentIdReceived": "",
        "memberNameReceived": "",
        "income": '0',
        "outcome": '0'
    })
    const [historyType, setHistoryType] = useState('income');    
    const [postHistory, fetchPostHistory] = useFetch();

    const resetInfos = () => {
        setInfos({
        "dateUsed": "",
        "title": "",
        "details": "",
        "memberStudentIdReceived": "",
        "memberNameReceived": "",
        "income": '',
        "outcome": ''
        })
    }

    const checkIsCompletedContents = () => {
        if (historyType === 'income') {
            if (infos.dateUsed === '') { alert('사용일을 입력해주세요'); return false}
            if (infos.title === '') { alert('제목을 입력해주세요'); return false}
            if (infos.income !== String(parseInt(infos.income))) { console.log(typeof infos.income); alert('올바른 수입액을 입력해주세요'); return false}
            if (parseInt(infos.income) <= 0) { alert('1원 이상의 수입액을 입력해주세요'); return false}
        }
        
        if (historyType === 'outcome') {
            if (infos.dateUsed === '') { alert('사용일을 입력해주세요'); return false}
            if (infos.title === '') { alert('제목을 입력해주세요'); return false}
            if (selectedInfos.name === '') { alert('회비 사용 부원을 입력해주세요'); return false}
            if (infos.outcome !== String(parseInt(infos.outcome))) { alert('올바른 수입액을 입력해주세요'); return false}
            if (parseInt(infos.outcome) <= 0) { alert('1원 이상의 지출액을 입력해주세요'); return false}
        }

        return true;
    }

    const clickPostEvent = () => {
        // 필요한 정보가 다 채워졌는지 확인
        if (checkIsCompletedContents() === false) {
            return;
        }
        
        // 데이터 전송 전 정보 채우기
        if (infos.details.length === 0) {
            infos.details = infos.title
        } 
        infos.memberStudentIdReceived = selectedInfos.studentId;
        infos.memberNameReceived = selectedInfos.name;

        // 파일 담기
        const inputData = {
            dateUsed: infos.dateUsed += 'T00:00:00',
            title: infos.title,
            details: infos.details,
            memberStudentIdReceived: infos.memberStudentIdReceived,
            memberNameReceived: infos.memberNameReceived,
            income: Number(infos.income),
            outcome: Number(infos.outcome),
            files: files
        }
        console.log(inputData)
        fetchPostHistory('/budget/history', 'POST', "token", inputData)
    };

    useEffect(() => {
        console.log(postHistory)
        if (postHistory) {
            alert('회계 내역이 정상적으로 등록되었습니다.');
            closeModal();
            setReload(true);
            resetInfos();
            // 선택 학생 초기화
            setSelectedInfos({ name: "", major: '', studentId: '' })
            // 파일 리스트 초기화
            setFiles([])
        }
    }, [postHistory])

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
                <FlexDiv $position="sticky" $top="0" $left="0" $justifycontent="space-between" width="100%" $backgroundColor="bgColor" $padding="15px 20px">
                    <Div>
                        <H2 fontSize="lg" color="wh">
                            회계 내역 추가
                        </H2>
                    </Div>
                    <Div height="24px" $pointer onClick={() => closeModal()}>
                        <Img src={"../images/x_white.svg"} />
                    </Div>
                </FlexDiv>

                <FlexDiv width="90%" $justifycontent="flex-start" height="50px">
                    <FlexDiv>
                        <Radio
                            name="setHistoryType"
                            value={"입금"}
                            onClick={() => {
                                setHistoryType("income")
                                resetInfos()
                            }}
                            defaultChecked
                        />
                        <Label $margin="0 0 0 5px">입금</Label>
                    </FlexDiv>
                    <FlexDiv $margin="0 10px">
                        <Radio
                            name="setHistoryType"
                            value={"출금"}
                            onClick={() => {
                                setHistoryType("outcome")
                                resetInfos()
                            }}
                        />
                        <Label $margin="0 0 0 5px">출금</Label>
                    </FlexDiv>
                </FlexDiv>

                <FlexDiv width="90%" $borderB={`1px solid ${theme.color.grey1}`} $justifycontent="flex-start" height="50px">
                    <Input $padding="0" type="date" width="100%" value={infos.dateUsed} onChange={(e:any) => setInfos(prev => ({ ...prev, dateUsed: e.target.value }))} />
                </FlexDiv>

                <Div width="90%" $margin="5px 0 20px 0">
                    <P fontSize="xs">영수증에 명시된 사용일을 적어주세요.</P>
                </Div>

                <FlexDiv width="90%" $margin="0 0 20px 0" $borderB={`1px solid ${theme.color.grey1}`} $justifycontent="flex-start" height="50px">
                    <Input $padding="0" placeholder="제목을 입력하세요" width="100%" value={infos.title} onChange={(e:any) => setInfos(prev => ({ ...prev, title: e.target.value }))} />
                </FlexDiv>

                <FlexDiv color="bk" width="90%" $borderB={`1px solid ${theme.color.grey1}`} $justifycontent="flex-start" height="50px">
                    <Input $padding="0" placeholder="내용을 입력하세요" width="100%" value={infos.details} onChange={(e:any) => setInfos(prev => ({ ...prev, details: e.target.value }))} />
                </FlexDiv>

                <Div width="90%" $margin="5px 0 0px 0">
                    <P fontSize="xs">해당란을 입력하지 않을 시 제목과 내용이 같도록 처리합니다.</P>
                </Div>

                {historyType === 'income' && (
                    <>
                        <FlexDiv width="90%" $margin="20px 0 20px 0" $borderB={`1px solid ${theme.color.grey1}`} $justifycontent="flex-start" height="50px">
                            <Input type="number" $padding="0" placeholder="수입액을 입력하세요" width="100%" value={infos.income === '0' ? '' : infos.income} onChange={(e:any) => {setInfos(prev => ({ ...prev, income: e.target.value })); console.log(infos.income)}} />
                        </FlexDiv>
                    </>
                )}

                {historyType === 'outcome' && (
                    <>
                        {/* 선택된 학생 정보 표시 */}
                        <FlexDiv $padding="25px" width="100%">
                            <FlexDiv width="100%" $margin="0 0 5px 0" $borderB={`1px solid ${theme.color.grey1}`} $justifycontent="flex-start" height="50px">
                                <FlexDiv>
                                    <P>이름:</P>
                                </FlexDiv>
                                <FlexDiv $margin="0 0 0 5px">
                                    <P>{selectedInfos.name}</P>
                                </FlexDiv>
                            </FlexDiv>
                            <FlexDiv width="100%" $margin="0 0 10px 0" $borderB={`1px solid ${theme.color.grey1}`} $justifycontent="flex-start" height="50px">
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
                        <FlexDiv width="90%" $borderB={`1px solid ${theme.color.grey1}`} $justifycontent="flex-start" height="50px" $margin="20px 0 20px 0">
                            <Input
                                type="number"
                                $padding="0"
                                placeholder="지출액을 입력하세요"
                                width="100%"
                                value={infos.outcome === '0' ? '' : infos.outcome}
                                onChange={(e:any) => setInfos(prev => ({ ...prev, outcome: e.target.value }))}
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
                        <DragNDrop fileFetch menuId={currentMenuId} onlyImg  />
                    </FlexDiv>
                </FlexDiv>

                <FlexDiv $position="relative" $zIndex={10000} $top="0" $left="0" $margin="20px 0 0 0" width="90%" $backgroundColor="bgColor" height="50px">
                    <Button width="100%" height="100%" onClick={() => clickPostEvent()}>
                        <P color="wh">제출</P>
                    </Button>
                </FlexDiv>
            </FlexDiv>
        </FlexDiv>
    );
};

export default ModalPostBankHistory;