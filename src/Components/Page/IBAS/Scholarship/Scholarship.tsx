import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import useFetch from "../../../../Hooks/useFetch";

import styled from "styled-components";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";
import Button from "../../../../styles/assets/Button";
import Img from "../../../../styles/assets/Img";

import { refetch, modalOpen, modalInfo } from "../../../../Recoil/frontState";

import ChangesContent from "../../../Component/IBAS/Scholarship/ChangesContent";
import SeeMoreButton from "../../../Component/IBAS/Scholarship/SeeMoreButton";
import ScholarshipDetailList from "../../../Component/IBAS/Scholarship/ScholarshipDetailList";


const ScholarshipSection = styled(Div)`
    min-height: 100vh;
`

const Scholarship = () => {

    const [changesContentData, fetchChangesContentData] = useFetch();
    const [scholarshipUsageData, fetchScholarshipUsageData] = useFetch();
    const [scholarshipSponsorData, fetchScholarshipSponsorData] = useFetch();
    
    const [changesContent, setChangesContent] = useState([]);
    const [scholarshipUsage, setScholarshipUsage] = useState([]);
    const [scholarshipSponsor, setScholarshipSponsor] = useState<{ [key: string]: { date: string; content: string, id: string }[] }>({});

    const [sponsorYears, setSponsorYears] = useState<string[]>([]);
    const [selectedYear, setSelectedYear] = useState('');

    const [reload, setReload] = useRecoilState(refetch);
    const setOpen = useSetRecoilState(modalOpen);
    const setModalInfo = useSetRecoilState(modalInfo);
    
    const titleFontSize = '42px';
    
    const handleYearButtonClick = (year: string) => {
        setSelectedYear(year);
    };

    const clickPostEvent = (ev: MouseEvent, name: string, selectedIdx: string) => {
        setOpen(true);

        setModalInfo({ type: "scholarshipPost", content: String(selectedIdx) });
    };

    // 연혁 useEffect
    useEffect(() => {
        fetchChangesContentData(`/scholarship/histories`, "GET")
        setReload(false);
    }, [reload])

    useEffect(() => {
        if (changesContentData) {
            console.log(Object?.values(changesContentData))
            setChangesContent(Object?.values(changesContentData))
        }
    }, [changesContentData])

    // 후원내용 useEffect
    useEffect(() => {
        fetchScholarshipSponsorData(`/scholarship/SPONSOR?page=0&size=9999`, "GET")
    }, [])

    useEffect(() => {
        const parsedData: { [key: string]: { id: string; date: string; content: string }[] } = {};

        scholarshipSponsorData?.data?.forEach(({ id, dateCreated, title }: {id: number, dateCreated: string, title: string}) => {
            const createdYear = dateCreated?.substring(0, 4);

            if (parsedData?.hasOwnProperty(createdYear)) {
                parsedData[createdYear]?.push({
                    date: dateCreated?.substring(5, 10), // 'MM-DD' 형식으로 추출
                    content: title,
                    id: String(id)
                });
            } else {
                parsedData[createdYear] = [{
                    date: dateCreated?.substring(5, 10), // 'MM-DD' 형식으로 추출
                    content: title,
                    id: String(id)
                }];
            }
        })

        setScholarshipSponsor(parsedData);
        setSponsorYears(Object?.keys(parsedData)?.sort((a, b) => (Number(a) - Number(b))))
    }, [scholarshipSponsorData])

    // 사용 내역 useEffect
    useEffect(() => {
        fetchScholarshipUsageData(`/scholarship/USAGE?page=0&size=3`, "GET")
    }, [])

    useEffect(() => {
        setScholarshipUsage(scholarshipUsageData?.data);
    }, [scholarshipUsageData])


    // 후원 연도 처음 설정
    useEffect(() => {
        if (sponsorYears) {
            setSelectedYear(sponsorYears[0])  // 가장 최신 연도
        }
    }, [sponsorYears])

    return (
        <>
            <ScholarshipSection $position="relative" width="100%" $backgroundColor="bk">
                {/* 배너부분 */}
                <FlexDiv $position="flex" width="100%" height="100vh" direction="column">
                    <FlexDiv width="100%">
                        <Div width="400px" height="400px" $position="absolute" $top="230px">
                            <Img src="/images/ibas-main-logo_white.png" $filter="opacity(25%)"/>
                        </Div>
                    </FlexDiv>
                    <Div $margin="0 0 0 0">
                        <P color="wh" fontWeight={600} fontSize="xxxl">
                            최태성 장학회
                        </P>
                    </Div>
                    <Div $margin="40px 0 0 0">
                        <P color="wh" fontWeight={200} fontSize="xxl">
                            최태성 장학회로부터<br/>
                        </P>
                    </Div>
                    <Div $margin="15px 0 0 0">
                        <P color="wh" fontWeight={200} fontSize="xxl">
                            인하대학교 IBAS활동 지원을 받고 있습니다.
                        </P>
                    </Div>
                </FlexDiv>

                {/* 히스토리 부분 */}
                <FlexDiv $position="flex" width="100%" height="100vh" direction="column">
                    <Div width="70%">
                        {/* 히스토리 */}
                        <Div>
                            <Div $borderT="2px solid white" $padding="5px">
                                <P color="wh" style={{fontSize: titleFontSize}}>
                                    소개
                                </P>
                            </Div>
                        </Div>
                        <Div width="100%" $margin="20px 0 0 0">
                            <P color="wh" $whiteSpace="normal" fontSize="lg" $lineHeight={2}>
                                최태성 장학회는 인하대학교 경영학과의 교수로서 34년여간 끊임없는 헌신을 보여주신 최태성교수님과 그분의 제자들이 공동으로 설립한 장학회입니다. 장학회의 시작은 소수의 회원으로부터 시작되었지만, 지금은 약 100여명의 회원들이 이 장학회의 목표를 함께 추구하고 있습니다.
                            </P>
                        </Div>
                        <Div width="100%" $margin="20px 0 0 0">
                            <P color="wh" $whiteSpace="normal" fontSize="lg" $lineHeight={2}>
                                장학회의 지원을 받은 인하대학교 학생들은 졸업후에도 장학회의 일원으로 남아, 받은 지원을 후배 학생들에게 돌려주는 '내리사랑'의 원칙을 실천하고 있습니다.
                            </P>
                        </Div>
                        <Div width="100%">
                            <P color="wh" $whiteSpace="normal" fontSize="lg" $lineHeight={2}>
                                이러한 선순한 구조는 학생들이 받은 도움을 다음 세대에 전달하며, 장학회의 지속적인 발전을 가능하게 하고 있습니다.
                            </P>
                        </Div>
                        <Div width="100%" $margin="20px 0 0 0">
                            <P color="wh" $whiteSpace="normal" fontSize="lg" $lineHeight={2}>
                                빅데이터 동아리 'IBAS'는 동아리 창단부터 현재까지 최태성 장학회의 지원을 받고 있으며, 빅데이터 분야의 전문인력을 양성하고자 노력하고 있습니다. IBAS는 장학회의 지원을 기반으로 다양한 프로젝트를 진행하며, 실질적인 빅데이터 이해와 활용 능력을 키우는데 집중하고 있습니다. 
                            </P>
                        </Div>
                    </Div>
                </FlexDiv>

                {/* 연혁 */}
                <FlexDiv $position="flex" width="100%" height="auto" direction="column">
                    <Div width="70%">
                        <Div $borderT="2px solid white" $margin="20px 0 0 0" $padding="5px">
                            {/* <P fontSize="xxxl" color="wh"> */}
                            <P color="wh" style={{fontSize: titleFontSize}}>
                                연혁
                            </P>
                        </Div>
                        <FlexDiv $margin="5px 0 5px 0" $padding="5px" onClick={(e: any) => clickPostEvent(e, "ss", '')} $pointer>
                            <FlexDiv width="20px" height="20px">
                                <Img src="/images/plus_grey.svg" />
                            </FlexDiv>
                            <FlexDiv $margin="0 0 0 5px">
                                <P color="grey3" fontSize="md">
                                    연혁 추가
                                </P>
                            </FlexDiv>
                        </FlexDiv>
                        <Div $margin="30px 0 0 15px" $borderL="grey solid 2px">
                            <Div $position="relative" $left="-7.5px" $top="-10px">
                                <ChangesContent changesContent={changesContent} />
                            </Div>
                        </Div>
                        <Div $position="relative" width="0px" height="0px" $left="6.5px" $top="-15px" $borderT="20px solid grey" $borderL="10px solid transparent" $borderR="10px solid transparent"/>
                    </Div>
                </FlexDiv>

                {/* 후원내용 */}
                <FlexDiv width="100%" height="40vh" $margin="70px 0 0 0">
                    <FlexDiv width="70%" height="100%" $justifycontent="space-between">
                        {/* 왼쪽 컨텐츠 부분 */}
                        <FlexDiv width="48%" height="100%" direction="column" $justifycontent="space-between">
                            <FlexDiv $left="0px" width="100%" $justifycontent="flex-between" $alignitems="flex-end">
                                {/* 타이틀 부분 */}
                                <Div $borderT="2px solid white" $left="0px" $padding="5px">
                                    {/* <P fontSize="xxxl" color="wh"> */}
                                    <P color="wh" style={{fontSize: titleFontSize}}>
                                        후원내용
                                    </P>
                                </Div>
                                {/* 버튼 영역 */}
                                <FlexDiv $margin="0 0 0 20px" $justifycontent="space-between" width="240px">
                                        {/* 받아온 데이터에서 연도를 추출하여 map에 넣어줌 */}
                                        {/* 4개년이 넘는다면 4개까지만 slice */}
                                        {sponsorYears?.slice(0, Math.min(4, sponsorYears?.length))?.map((year) => (
                                            <Button
                                                key={year}
                                                id={year}
                                                onClick={() => handleYearButtonClick(year)}
                                                width="56px"
                                                height="24px"
                                                $borderRadius={20}
                                                $backgroundColor={selectedYear == year ? "bgColor" : "grey"}
                                                $HBackgroundColor={selectedYear == year ? "bgColor" : "grey"}
                                            >
                                                <P color="wh">
                                                    {year}
                                                </P>
                                            </Button>
                                        ))}
                                </FlexDiv>
                            </FlexDiv>
                            {/* 자세한 내용들 */}
                            <Div width="100%" height="65%">
                                <ScholarshipDetailList
                                    contents={scholarshipSponsor[selectedYear]}
                                    mainUrl='/board/usage/detail'
                                />
                            </Div>
                            <Div width="100%">
                                <Button>
                                    <FlexDiv $justifycontent="flex-start">
                                        <SeeMoreButton url="/board/sponsor" />
                                    </FlexDiv>
                                </Button>
                            </Div>
                        </FlexDiv>
                        {/* 오른쪽 컨텐츠 부분 */}
                        <FlexDiv width="48%" height="100%">
                            {/* 사진 컨테이너 */}
                            <Div width="100%" height="100%">
                                <Img src="/images/sponsor.png" />
                            </Div>
                        </FlexDiv>
                    </FlexDiv>
                </FlexDiv>

                {/* 장학금 사용 용도 */}
                <FlexDiv width="100%" height="40vh" $margin="50px 0 0 0">
                    <FlexDiv width="70%" height="100%" $justifycontent="space-between">
                        {/* 왼쪽 컨텐츠 부분 */}
                        <FlexDiv width="48%" height="100%">
                            {/* 사진 컨테이너 */}
                            <Div width="100%" height="100%">
                                <Img src="/images/usage.png" />
                            </Div>
                        </FlexDiv>
                        {/* 오른쪽 컨텐츠 부분 */}
                        <FlexDiv width="48%" height="100%" direction="column">
                            {/* 타이틀 부분 */}
                            <FlexDiv width="100%" $justifycontent="flex-end">
                                <FlexDiv $borderT="2px solid white" $left="0px" $padding="5px">
                                    <P color="wh" style={{fontSize: titleFontSize}}>
                                        장학금 사용 용도
                                    </P>
                                </FlexDiv>
                            </FlexDiv>
                            {/* 자세한 내용들 */}
                            <Div width="100%" height="65%">
                                <ScholarshipDetailList
                                    contents={scholarshipUsage?.map(({ dateCreated, title, id } : { dateCreated: string, title: string, id: number }) => ({
                                        date: dateCreated?.substring(5, 10),
                                        content: title,
                                        id: String(id)
                                    }))} 
                                    mainUrl='/board/usage/detail'
                                />
                            </Div>
                            <Div width="100%" $margin="20px 0 0 0">
                                <Button>
                                    <FlexDiv $justifycontent="flex-start">
                                        <SeeMoreButton url={"/board/usage"}/>
                                    </FlexDiv>
                                </Button>
                            </Div>
                        </FlexDiv>
                    </FlexDiv>
                </FlexDiv>

                {/* Thanks for 부분 */}
                {/* 임시로 비워둠 */}
                <FlexDiv width="100%" height="100vh">
                    {/* <Div width="70%">
                        <Div>
                            <Div $borderT="2px solid white" $padding="5px">
                                <P color="wh" style={{fontSize: titleFontSize}}>
                                    Thanks for
                                </P>
                            </Div>
                            <Div $margin="5px 0 0 0">
                                <P color="wh">
                                    해당 내용 첨부
                                </P>
                            </Div>
                        </Div>
                    </Div> */}
                </FlexDiv>

            </ScholarshipSection>
        </>
    );
}

export default Scholarship;