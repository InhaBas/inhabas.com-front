import { useState } from "react";

import { useRecoilState } from "recoil";
import { selectedStudentInfos } from "../../../../Recoil/frontState";

import styled from "styled-components";
import { theme } from "../../../../styles/theme";
import { FlexDiv, Div } from "../../../../styles/assets/Div";
import A from "../../../../styles/assets/A";
import { TextInput } from "../../../../styles/assets/Input";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

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

    // 학생 정보 배열
    const studentInfos = [
        { name: '가가가', major: '디자인테크놀로지학과', studentId: '11111111' },
        { name: '나나나', major: 'BBBBB', studentId: '11111111' },
        { name: '다다다', major: 'CCCCC', studentId: '11111111' },
        { name: '라라라', major: 'DDDDD', studentId: '11111111' },
        { name: '마마마', major: 'EEEEE', studentId: '11111111' },
        { name: '바바바', major: 'FFFFF', studentId: '11111111' },
        { name: '바바바', major: 'FFFFF', studentId: '11111111' },
        { name: '바바바', major: 'FFFFF', studentId: '11111111' },
    ];

    // 필터링된 결과
    const filteredResults = studentInfos.filter((item) => item.name.toLowerCase().includes(searchTerm?.toLowerCase()));

    // 학생 선택 시 실행되는 함수
    const chooseStudent = (studentInfo:any,) => {
        setSelectedStudent(studentInfo); // 선택된 학생 정보 업데이트
    };

    // 학생 정보 테이블의 헤더
    const headerInfo = ['학과', '이름', '학번'];
    // 각 열의 최소 너비
    const widthList = [100, 100, 100];

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
                {studentInfos.length === 0 ? (
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
                                <FlexDiv key={`headerInfo${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                                    <P $center fontWeight={700}>
                                        {item}
                                    </P>
                                </FlexDiv>
                            ))}
                        </FlexDiv>
                        <Div width="100%" height="135px" overflow="auto">
                            {/* 검색 결과 테이블 내용 */}
                            {filteredResults.map((element, idx) => (
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
                                    {Object.values(element).map((value, index) => (
                                        <FlexDiv key={`itemValue${idx}${index}`} $minWidth={`${widthList[index]}px`} $padding="10px">
                                            <A $center>{value}</A>
                                        </FlexDiv>
                                    ))}
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