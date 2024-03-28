import { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES, useEffect, useState } from "react";

import { useRecoilState } from "recoil";
import { selectedStudentInfos } from "../../../../Recoil/frontState";

import styled from "styled-components";
import { theme } from "../../../../styles/theme";
import { FlexDiv, Div } from "../../../../styles/assets/Div";
import A from "../../../../styles/assets/A";
import { TextInput } from "../../../../styles/assets/Input";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

import useFetch from "../../../../Hooks/useFetch";

export interface searchedMemberInterface {
    name: string;
    memberId: number;
    studentId: string;
    phoneNumber: string;
    memberType: string;
    generation: number;
    major: string;
    role: string;
}

const TableHover = styled(FlexDiv)`
    &:hover {
        background-color: ${theme.color.tableHo};
    }
`;

// 컴포넌트 재사용 시 placeholder 변수로 받아서 사용
const StudentSearchTable = () => {
    // 상태 변수 선언 및 초기화
    const [searchTerm, setSearchTerm] = useState(""); // 검색어를 관리하는 상태 변수
    const [selectedStudent, setSelectedStudent] = useRecoilState(selectedStudentInfos); // 선택된 학생 정보를 관리하는 Recoil 상태 변수

    const [studentInfoList, fetchStudentInfoList] = useFetch();
    const [studentInfos, setNotGraduatedStudents] = useState([]);

    useEffect(() => {
        fetchStudentInfoList(`/members/notGraduated?page=${0}&size=${9999}`, 'GET', 'token')
    }, [])

    useEffect(() => {
        console.log(studentInfoList?.data)
        setNotGraduatedStudents(studentInfoList?.data)
    }, [studentInfoList])

    // 학생 선택 시 실행되는 함수
    const chooseStudent = (studentInfo: any,) => {
        console.log(studentInfo)
        setSelectedStudent(studentInfo); // 선택된 학생 정보 업데이트
    };

    const filteredResults = studentInfos?.filter((item: any) => item?.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // 학생 정보 테이블의 헤더
    const headerInfo = ['학과', '이름', '학번'];
    // 각 열의 최소 너비
    const widthList = [150, 120, 120];

    return (
        <>
            <FlexDiv width="90%">
                {/* 검색 입력란 */}
                <FlexDiv width="100%">
                    <TextInput
                        placeholder="회비를 사용한 부원을 검색 후 아래에서 클릭해주세요"
                        width="100%"
                        value={searchTerm}
                        onChange={(e:any) => setSearchTerm(e.target.value)}
                    />
                </FlexDiv>
                {studentInfos?.length === 0 ? (
                    <FlexDiv width="100%" height="100%">
                        <FlexDiv width="10%">
                            <Img src="/images/loading.svg" />
                        </FlexDiv>
                    </FlexDiv>
                ) : (
                    <>
                        <FlexDiv
                            width="100%"
                            height="45px"
                            $borderB={`1px solid ${theme.color.tableBorder}`}
                            $justifycontent="space-between"
                        >
                            {/* 테이블 헤더 */}
                            {headerInfo.map((item, idx) => (
                                // <FlexDiv key={`headerInfo${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                                <FlexDiv key={`headerInfo${idx}`} width={`${widthList[idx]}px`}>
                                    <P $center fontWeight={700}>
                                        {item}
                                    </P>
                                </FlexDiv>
                            ))}
                        </FlexDiv>
                        <Div width="100%" height="135px" overflow="auto">
                            {/* 검색 결과 테이블 내용 */}
                            {filteredResults?.map((element: searchedMemberInterface, idx:number) => (
                                <TableHover
                                    key={`contentItem${idx}`}
                                    width="100%"
                                    height="45px"
                                    $borderT={`1px solid ${theme.color.grey1}`}
                                    $justifycontent="space-between"
                                    $backgroundColor={"tableHo"}
                                    $pointer
                                    onClick={() => chooseStudent(element)}
                                >
                                    {/* 테이블 셀 */}
                                    <FlexDiv key={`itemValue0${idx}`} width={`${widthList[0]}px`} $padding="10px" height="100%">
                                        <A $center>{element?.major}</A>
                                    </FlexDiv>
                                    <FlexDiv key={`itemValue1${idx}`} width={`${widthList[1]}px`} $padding="10px" height="100%">
                                        <A $center>{element?.name}</A>
                                    </FlexDiv>
                                    <FlexDiv key={`itemValue2${idx}`} width={`${widthList[2]}px`} $padding="10px" height="100%">
                                        <A $center>{element?.studentId}</A>
                                    </FlexDiv>
                                </TableHover>
                            ))}
                        </Div>
                    </>
                )}
            </FlexDiv>
        </>
    );
};

export default StudentSearchTable;