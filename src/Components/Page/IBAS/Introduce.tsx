import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";

import useFetch from "../../../Hooks/useFetch";

import { historyInfo, staffInfo } from "../../../Recoil/backState";

import { theme } from "../../../styles/theme";

import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H1 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";

import { GetRoleAuthorization } from "../../../Functions/authFunctions";
import { modalInfo, modalOpen, refetch } from "../../../Recoil/frontState";
import { historyInterface, staffInterface } from "../../../Types/IBAS/TypeIBAS";
import HeaderNav from "../../Common/HeaderNav";

const IntroduceSection = styled(Div)`
    min-height: 100vh;
`;

const IntroImg = styled(Img)`
    object-fit: fill;
    position: absolute;
`;

const IntroDiv = styled(Div)`
    animation: fadeInUp 1s;

    @keyframes fadeInUp {
        0% {
            opacity: 0;
            transform: translate3d(0, 10%, 0);
        }
        to {
            opacity: 1;
            transform: translateZ(0);
        }
    }
`;

const CareerClickP = styled(P)`
    &:hover {
        color: ${theme.color.wh};
    }
`;

const Ul = styled.ul`
    max-width: 100%;
    border-left: 4px solid #7133e2;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    background: none;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    letter-spacing: 0.5px;
    position: relative;
    line-height: 1.4em;
    font-size: 1.03em;
    padding: 50px 50px 0 50px;
    list-style: none;
    text-align: left;
    font-weight: 100;
`;

const Li = styled.li`
    position: relative;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
    font-size: ${theme.fontSize.xxl};

    &::before {
        content: "";
        position: absolute;
        left: -62px; /* padding 50px, border px 고려해야함 */
        top: 5px;
        width: 20px; /* 큰 동그라미의 지름 */
        height: 20px; /* 큰 동그라미의 지름 */
        border-radius: 50%;
        background-color: #7133e2; /* 보라색 */
    }

    &::after {
        content: "";
        position: absolute;
        left: -57px; /* 작은 동그라미의 위치를 조절합니다. */
        top: 10px;
        width: 10px; /* 작은 동그라미의 지름 */
        height: 10px; /* 작은 동그라미의 지름 */
        border-radius: 50%;
        background-color: #441f87; /* 작은 동그라미의 색상 */
    }
`;

const Introduce = () => {
    const pageData = [
        {
            image: "career.png",
            explain: `
                다양한 분야의 지식을 기반으로 다방면의 데이터를 끌어모아 비즈니스 인사이트를 도출하는 역할을 합니다. <br/>
                이를 위해 머신러닝 모델링 보다는 SQL을 활용해 데이터를 추출&분석 후<br/>
                Tableau등을 통해 시각화 하고 분석보고서를 만드는 작업을 합니다.<br/> `,
        },
        {
            image: "data-an.png",
            explain: `
                다양한 분야의 지식을 기반으로 다방면의 데이터를 끌어모아 비즈니스 인사이트를 도출하는 역할을 합니다. 
                이를 위해 머신러닝 모델링 보다는 SQL을 활용해 데이터를 추출&분석 후
                Tableau등을 통해 시각화 하고 분석보고서를 만드는 작업을 합니다. `,
        },
        {
            image: "data-eng.png",
            explain: `
                데이터 분석을 효과적으로 수행하기 위해서는 방대한 데이터를 안전하고 효과적으로 저장하며 
                필요시 빠르게 불러낼 수 있는 시스템을 구축해야합니다. 이를 위해 프로그래밍을 이용해
                시스템을 구축하는 역할을 하며 특성상 진로를 Developer로 택한 이들이 많습니다. `,
        },
        {
            image: "data-sc.png",
            explain: `
                머신러닝,파이썬,통계 등의 다양한 방법을 활용해 대량의 데이터에서 인사이트를 뽑아낼 수 있는 사람을 의미합니다. 
                비즈니스에 여러 알고리즘을 적용,특정 업무에 맞는 모델링을 구현합니다.
                새로운 분석 모델이나 머신러닝 모델을 수정 혹은 개발하는 역할을 합니다.`,
        },
    ];

    const { isAuthorizedOverExecutives } = GetRoleAuthorization();
    const setOpen = useSetRecoilState(modalOpen);
    const setModalInfo = useSetRecoilState(modalInfo);
    const [page, setPage] = useState(0);
    const [historyInfoData, setHistoryInfoData] = useFetch();
    const [history, setHistory] = useRecoilState(historyInfo);
    const [deleteHistoryData, fetchDeleteHistoryData] = useFetch();
    const [staffInfoData, setStaffInfoData] = useFetch();
    const [staff, setStaff] = useRecoilState(staffInfo);
    const [reload, setReload] = useRecoilState(refetch);

    const careerEvent = (clicked: number) => {
        setPage(clicked);
    };

    // type의 첫 문자는 대문자여야 함
    const openModal = (type: string, id?: number) => {
        setOpen(true);
        setModalInfo({ type: `history${type}`, content: `${id}` });
    };

    const deleteHistory = (id: number) => {
        if (window.confirm("정말 삭제 하시겠습니까?")) {
            fetchDeleteHistoryData(`/club/history/${id}`, "DELETE", "token");
        }
    };

    // 역할에 대한 레이블 변환
    // 예: 비활동회원, 활동회원, ...
    const convertRoleLabel = (role: string) => {
        let roleLabel = "";
        switch (role) {
            case "CHIEF":
                roleLabel = "회장";
                break;
            case "VICE_CHIEF":
                roleLabel = "부회장";
                break;
            case "EXECUTIVES":
                roleLabel = "운영팀";
                break;
            case "SECRETARY":
                roleLabel = "총무";
                break;
            case "BASIC":
                roleLabel = "활동회원";
                break;
            case "DEACTIVATED":
                roleLabel = "비활동회원";
                break;
            default:
                roleLabel = "알 수 없음";
        }
        return roleLabel;
    };

    useEffect(() => {
        setPage(0);
    }, []);

    // 연혁 get fetch ( 처음 페이지 렌더링 시 )
    useEffect(() => {
        setHistoryInfoData("/club/histories", "GET");
    }, []);

    // 연혁 get fetch ( 추가, 수정, 삭제 시 )
    useEffect(() => {
        if (reload || deleteHistoryData) {
            setHistoryInfoData("/club/histories", "GET");
            setReload(false);
        }
    }, [reload, deleteHistoryData]);

    useEffect(() => {
        if (historyInfoData) {
            let prevYear = ""; // 이전 연도를 기록하기 위한 변수
            const historyInfoArray: [string, historyInterface][] = Object.entries(historyInfoData);
            const content = historyInfoArray.map(([key, value]) => {
                // 현재 아이템의 연도 추출
                const currentYear = value.dateHistory.split("-")[0];
                // 이전 연도와 현재 아이템의 연도가 다를 경우에만 연도를 할당
                const year = prevYear !== currentYear ? currentYear : "";
                // 이전 연도 업데이트
                prevYear = currentYear;

                return {
                    id: value.id,
                    title: value.title,
                    content: value.content,
                    dateHistory: value.dateHistory.split("T")[0],
                    year: year, // 현재 아이템의 연도 할당
                };
            });

            setHistory(content);
        }
    }, [historyInfoData]);

    // 운영진 fetch
    useEffect(() => {
        setStaffInfoData("/members/executive", "GET");
    }, []);

    // 운영진 data set
    useEffect(() => {
        if (staffInfoData) {
            // 객체를 배열로 변환
            const staffInfoArray: [string, staffInterface][] = Object.entries(staffInfoData);

            // 배열을 가공하여 contents 배열 생성
            const contents = staffInfoArray.map(([key, value]) => ({
                name: value.name,
                studentId: value.studentId.substring(2, 4),
                major: value.major,
                role: convertRoleLabel(value.role),
                picture: value.picture,
            }));

            setStaff(contents);
        }
    }, [staffInfoData]);

    return (
        <>
            <HeaderNav />
            <IntroduceSection width="100%" height="100vh">
                <Div $position="relative" width="100%" height="100vh">
                    <IntroImg src="/images/introduce.png" />
                    <IntroDiv $zIndex={2} $position="absolute" $top="35%" $left="5%">
                        <Div width="100%" $margin="0 0 80px 0">
                            <H1 fontWeight={800} fontSize="extraBig" color="wh">
                                Big Data
                            </H1>
                        </Div>
                        <Div width="600px">
                            <P color="wh" $whiteSpace="wrap" $lineHeight={2} fontSize="xl">
                                빅데이터란 디지털 환경에서 생성되는 데이터로
                                <br />그 규모가 방대하고, 생성 주기도 짧고, 형태도 수치 데이터뿐 아니라 <br /> 문자와
                                영상 데이터를 포함하는 대규모 데이터를 말합니다.
                                <br /> 빅데이터는 과거에 비해 데이터가 폭증하였고 <br /> 데이터의 종류도 다양해져
                                사람들의 행동은 물론이고 <br /> 위치정보와 SNS를 통해 생각과 의견까지 분석하고 예측할 수
                                있습니다.
                            </P>
                        </Div>
                    </IntroDiv>
                </Div>
            </IntroduceSection>
            <IntroduceSection width="100%" height="100vh">
                <Div $position="relative" width="100%" height="100vh">
                    <IntroImg src={`/images/${pageData[page].image}`} $filter="brightness(25%)" />

                    {page === 0 && (
                        <Div $zIndex={2} $position="absolute" $top="60%" $left="5%">
                            <Div width="100%">
                                <P color="grey" fontSize="extraBig1" fontWeight={800}>
                                    Big Data
                                </P>
                                <P fontWeight={800} fontSize="extraBig" color="wh">
                                    Career
                                </P>
                            </Div>
                        </Div>
                    )}
                    {page !== 0 && (
                        <Div $zIndex={2} $position="absolute" $top="60%">
                            <Div width="100%">
                                <P fontWeight={600} color="wh" $whiteSpace="pre-wrap" fontSize="xl" $lineHeight={2}>
                                    {pageData[page].explain}
                                </P>
                            </Div>
                        </Div>
                    )}

                    <Div $zIndex={2} $position="absolute" $top="10%" $left="60%">
                        <Div width="100%">
                            <FlexDiv width="100%" $justifycontent="end">
                                <Div $pointer onClick={() => careerEvent(1)}>
                                    <CareerClickP
                                        fontWeight={800}
                                        fontSize="extraBig1"
                                        color={page === 1 ? "wh" : "grey"}
                                    >
                                        Data Analyst
                                    </CareerClickP>
                                </Div>
                            </FlexDiv>
                            <FlexDiv width="100%" $margin="30px 0" $justifycontent="end">
                                <Div $pointer onClick={() => careerEvent(2)}>
                                    <CareerClickP
                                        fontWeight={800}
                                        fontSize="extraBig1"
                                        color={page === 2 ? "wh" : "grey"}
                                    >
                                        Data Engineer
                                    </CareerClickP>
                                </Div>
                            </FlexDiv>
                            <FlexDiv width="100%" $justifycontent="end">
                                <Div $pointer onClick={() => careerEvent(3)}>
                                    <CareerClickP
                                        fontWeight={800}
                                        fontSize="extraBig1"
                                        color={page === 3 ? "wh" : "grey"}
                                    >
                                        Data Scientist
                                    </CareerClickP>
                                </Div>
                            </FlexDiv>
                        </Div>
                    </Div>
                </Div>
            </IntroduceSection>
            <IntroduceSection width="100%" height="100vh">
                <Div $position="relative" width="100%" height="100vh">
                    <IntroImg src="/images/history.jpg" />
                    <Div $zIndex={2} $position="absolute" $top="5%" $left="5%">
                        <Div width="100%">
                            <P color="wh" $letterSpacing="5px" fontSize="extraBig" fontWeight={800}>
                                HISTORY
                            </P>
                        </Div>
                        {isAuthorizedOverExecutives && (
                            <Div
                                $margin="10px"
                                $padding="3px"
                                $pointer
                                $borderB={`1.5px solid ${theme.color.wh}`}
                                onClick={() => openModal("Post")}
                            >
                                <P color="wh" fontSize="lg">
                                    동아리 연혁 추가하기
                                </P>
                            </Div>
                        )}
                    </Div>
                    <Div
                        width="80%"
                        height="70vh"
                        $zIndex={2}
                        $position="absolute"
                        $top="30%"
                        $left="10%"
                        overflow="auto"
                    >
                        {history &&
                            history.length !== 0 &&
                            Object.values(history).map((element: historyInterface) => (
                                <FlexDiv width="100%" $alignitems="start">
                                    <Div $padding="50px" width="200px">
                                        <P color="grey1" fontSize="xxl">
                                            {element.year}
                                        </P>
                                    </Div>
                                    <Div width="80%">
                                        <Ul>
                                            <Li>
                                                <FlexDiv>
                                                    <P color="wh" fontSize="xxl">
                                                        {element.title}
                                                    </P>
                                                </FlexDiv>
                                                <Div
                                                    $padding="20px 0"
                                                    $margin={element.content === null ? "0 0 50px 0" : "0"}
                                                >
                                                    <P color="wh">{element.dateHistory}</P>
                                                </Div>
                                                <Div $margin="0 0 50px 0">
                                                    <P color="wh" fontSize="xl" fontWeight={400}>
                                                        {element.content}
                                                    </P>
                                                </Div>
                                                {isAuthorizedOverExecutives && (
                                                    <>
                                                        <FlexDiv
                                                            width="100%"
                                                            $justifycontent="end"
                                                            $margin="0 0 10px 0"
                                                        >
                                                            <Div
                                                                width="15px"
                                                                $pointer
                                                                onClick={() => openModal("Put", element.id)}
                                                            >
                                                                <Img src="/images/pencil_white.svg" />
                                                            </Div>
                                                        </FlexDiv>
                                                        <FlexDiv
                                                            width="100%"
                                                            $justifycontent="end"
                                                            $margin="0 0 10px 0"
                                                        >
                                                            <Div
                                                                width="15px"
                                                                $pointer
                                                                onClick={() => deleteHistory(element.id)}
                                                            >
                                                                <Img src="/images/trash_white.svg" />
                                                            </Div>
                                                        </FlexDiv>
                                                    </>
                                                )}
                                            </Li>
                                        </Ul>
                                    </Div>
                                </FlexDiv>
                            ))}
                    </Div>
                </Div>
            </IntroduceSection>
            <FlexDiv width="100%" height="100vh" $backgroundColor="bk">
                <Div $position="relative" width="40%" height="100vh">
                    <IntroImg src="/images/ibas_image.jpg" $filter="brightness(0.5)" />
                </Div>
                <Div width="60%" $padding="60px 30px" height="100vh">
                    <Div>
                        <P color="wh" fontSize="extraBig1" fontWeight={800} $letterSpacing="5px">
                            IBAS
                        </P>
                    </Div>
                    <Div $margin="15px 0 0 0">
                        <P color="grey" fontWeight={800} $letterSpacing="5px">
                            Inha Bigdata Analyst Society
                        </P>
                    </Div>
                    <Div $margin="30px 0 0 0" width="100%">
                        <P color="wh" $letterSpacing="3px" $lineHeight={2} $whiteSpace="normal">
                            안녕하세요 인하대학교 빅데이터 학술동아리 IBAS입니다. 반갑습니다.
                            <br />
                            IBAS는 4차산업 혁명 시대의 흐름에 맞추어 필요한 빅데이터 역량을 갖춘 인재를 육성해 나가자는
                            취지에서 만들어진 동아리입니다. 주로 데이터 직무(산업)에 관심있는 학생들이 모여 빅데이터
                            분석에 필요한 지식을 습득, 활용해 나가며 빅데이터 역량을 갖추고 사회에 나갈 수 있도록
                            학습하는 빅데이터 학술동아리 입니다.
                        </P>
                    </Div>
                    <Div $margin="40px 0">
                        <P color="wh" fontSize="xxxl" fontWeight={800} $letterSpacing="5px">
                            운영진
                        </P>
                    </Div>
                    <FlexDiv width="100%" height="30vh" $justifycontent="start" $alignitems="start" overflow="auto">
                        <FlexDiv $margin="0 20px 50px 0" $justifycontent="space-between" $alignitems="start">
                            {staff &&
                                staff.length !== 0 &&
                                staff.map((element: staffInterface) => (
                                    <Div $margin="0 0 15px 0">
                                        <FlexDiv width="130px">
                                            <FlexDiv
                                                width="100px"
                                                height="100px"
                                                radius={100}
                                                overflow="hidden"
                                                $border="3px solid"
                                                $borderColor="wh"
                                            >
                                                <Img
                                                    src={element.picture}
                                                    alt="현재 브라우저에서 지원하지 않는 형식입니다. "
                                                />
                                            </FlexDiv>
                                        </FlexDiv>
                                        <FlexDiv width="130px" $margin="15px 0">
                                            <Div $margin="0 3px 0 0">
                                                <P color="wh" fontWeight={700}>
                                                    {element.name}
                                                </P>
                                            </Div>

                                            <Div>
                                                <P color="wh" fontSize="xs">
                                                    ({element.role})
                                                </P>
                                            </Div>
                                        </FlexDiv>
                                        <FlexDiv width="130px">
                                            <Div>
                                                <P color="wh" fontSize="xs">
                                                    {element.major}
                                                </P>
                                            </Div>
                                            &nbsp;
                                            <Div>
                                                <P color="wh" fontSize="xs">
                                                    {element.studentId}학번
                                                </P>
                                            </Div>
                                        </FlexDiv>
                                    </Div>
                                ))}
                        </FlexDiv>
                    </FlexDiv>
                </Div>
            </FlexDiv>
        </>
    );
};

export default Introduce;
