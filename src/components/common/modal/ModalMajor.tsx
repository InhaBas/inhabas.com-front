import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";

import { media, theme } from "../../../styles/theme";

import useFetch from "../../../hooks/useFetch";

import { majorInfo } from "../../../recoil/backState";
import { majorSelected, modalInfo, modalOpen, refetch } from "../../../recoil/frontState";

import Button from "../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H2 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import { TextInput } from "../../../styles/assets/Input";
import P from "../../../styles/assets/P";

const MajorTableRow = styled.div<{ $selected?: boolean; $pointer?: boolean }>`
    display: grid;
    grid-template-columns: 150px minmax(270px, 1fr) 160px;
    align-items: center;
    width: 100%;
    min-width: 580px;
    min-height: 45px;
    background-color: ${({ $selected }) => ($selected ? theme.color.tableHo : theme.color.wh)};
    border-top: 1px solid ${theme.color.grey1};
    cursor: ${({ $pointer }) => ($pointer ? "pointer" : "default")};

    &:hover {
        background-color: ${theme.color.tableHo};
    }
`;

const MajorTableHeader = styled(MajorTableRow)`
    border-top: 0;
    border-bottom: 1px solid ${theme.color.tableBorder};
`;

const MajorTableCell = styled.div`
    min-width: 0;
    padding: 10px;
`;

const MajorTableText = styled(P)`
    white-space: nowrap;
`;

const MajorTableScroll = styled.div`
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;

    ${media.mobile} {
        margin: 0 -4px;
        width: calc(100% + 8px);
    }
`;

const MajorTable = styled(Div)`
    min-width: 580px;
`;

const MajorList = styled(Div)`
    height: 170px !important;
`;

interface MajorItem {
    id?: number;
    college: string;
    major: string;
}

const ModalMajor = () => {
    const setOpen = useSetRecoilState(modalOpen);

    const closeModal = () => {
        setOpen(false);
    };

    const headerInfo = ["학교명", "학과명", "단과대학"];

    const modalType = useRecoilValue(modalInfo);
    const [data, fetchData] = useFetch();
    const [changeData, fetchChangeData] = useFetch();
    const [major, setMajor] = useRecoilState<MajorItem[]>(majorInfo);
    const [selectedTable, setSelectedTable] = useRecoilState(majorSelected);
    const setReload = useSetRecoilState(refetch);

    /* 
    selectedTable을 이용해서 사용자가 선택한 전공을 모달 밖에서도 볼 수 있게 만듦 
    selectedTable을 body에 담아 POST api 보냄
    */
    const chooseMajor = (item: { college: string; major: string }) => {
        setSelectedTable((prev) => ({ ...prev, ...item }));
    };

    // [myInfo] 학과 변경 fetch
    const changeMajor = () => {
        const inputData = {
            major: selectedTable.major,
        };
        if (inputData.major !== "") {
            fetchChangeData("/myInfo/detail", "PUT", "token", inputData);
        }
    };

    useEffect(() => {
        if (changeData) {
            alert("전공 정상적으로 수정되었습니다.");
            setReload(true);

            setOpen(false);
        }
    }, [changeData]);

    /*
        전공 정보 받기 위한 api
    */
    useEffect(() => {
        fetchData("/signUp/majorInfo", "GET");
        return () => {
            setMajor([]);
        };
    }, []);

    // 전공 정보 fetch data handling
    useEffect(() => {
        const handleData = () => {
            if (data) {
                let newData = { ...data };
                delete newData.change;

                const tmpContents: MajorItem[] = [];
                (Object.values(newData) as MajorItem[]).map((element: MajorItem) => {
                    tmpContents.push({
                        college: element.college,
                        major: element.major,
                    });
                });
                setMajor(tmpContents);
            }
        };

        handleData();
    }, [data]);

    const [searchTerm, setSearchTerm] = useState("");

    // 검색어와 일치하는 결과 필터링
    const filteredResults = major.filter((item) => item.major.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <FlexDiv
            width="44%"
            height="450px"
            $backgroundColor="wh"
            direction="column"
            $justifycontent="space-between"
            radius={2}
        >
            <FlexDiv $justifycontent="space-between" width="100%" $backgroundColor="bgColor" $padding="15px 20px">
                <Div>
                    <H2 fontSize="lg" color="wh">
                        전공검색
                    </H2>
                </Div>
                <Div height="24px" $pointer onClick={() => closeModal()}>
                    <Img src={"../images/x_white.svg"}></Img>
                </Div>
            </FlexDiv>

            <Div $padding="25px" width="100%" height="88%">
                <Div width="100%">
                    <TextInput
                        placeholder="전공을 검색하세요"
                        width="100%"
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />
                </Div>
                {major.length === 0 ? (
                    <FlexDiv width="100%" height="100%">
                        <FlexDiv width="10%">
                            <Img src="/images/loading.svg" />
                        </FlexDiv>
                    </FlexDiv>
                ) : (
                    <>
                        <MajorTableScroll>
                            <MajorTable width="100%">
                                <MajorTableHeader>
                                    {headerInfo.map((item: string) => (
                                        <MajorTableCell key={item}>
                                            <MajorTableText $center fontWeight={700}>
                                                {item}
                                            </MajorTableText>
                                        </MajorTableCell>
                                    ))}
                                </MajorTableHeader>
                                <MajorList width="100%" height="60%" overflow="auto">
                                    {filteredResults.map((element: { college: string; major: string }, idx: number) => (
                                        <MajorTableRow
                                            key={`contentItem${idx}`}
                                            $selected={selectedTable.major === element.major}
                                            $pointer
                                            onClick={() => chooseMajor(element)}
                                        >
                                            <MajorTableCell>
                                                <MajorTableText $center>인하대학교</MajorTableText>
                                            </MajorTableCell>
                                            <MajorTableCell>
                                                <MajorTableText $center>{element.major}</MajorTableText>
                                            </MajorTableCell>
                                            <MajorTableCell>
                                                <MajorTableText $center>{element.college}</MajorTableText>
                                            </MajorTableCell>
                                        </MajorTableRow>
                                    ))}
                                </MajorList>
                            </MajorTable>
                        </MajorTableScroll>
                    </>
                )}

                {modalType.type === "major" ? (
                    <FlexDiv width="100%">
                        <Button
                            $backgroundColor="bgColor"
                            $HBackgroundColor="bgColorHo"
                            $borderRadius={60}
                            width="150px"
                            height="40px"
                            $margin="15px 0 0 0"
                            onClick={() => closeModal()}
                        >
                            <P color="wh" fontWeight={400}>
                                확인
                            </P>
                        </Button>
                    </FlexDiv>
                ) : (
                    <FlexDiv width="100%">
                        <Button
                            $backgroundColor="bgColor"
                            $HBackgroundColor="bgColorHo"
                            $borderRadius={60}
                            width="150px"
                            height="40px"
                            $margin="15px 0 0 0"
                            onClick={() => changeMajor()}
                        >
                            <P color="wh" fontWeight={400}>
                                수정
                            </P>
                        </Button>
                    </FlexDiv>
                )}
            </Div>
        </FlexDiv>
    );
};

export default ModalMajor;
