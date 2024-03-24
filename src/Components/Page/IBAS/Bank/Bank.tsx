import { Div, FlexDiv } from "../../../../styles/assets/Div";
import { H2 } from "../../../../styles/assets/H";
import { Select } from "../../../../styles/assets/Input";

import BankTable from "../../../Component/IBAS/Bank/BankTable";
import Pagination from "../../../Common/Pagination";

import useFetch from "../../../../Hooks/useFetch";

import { bankHistoryInfo, totalPageInfo, bankBalanceInfo, bankYearsInfo } from "../../../../Recoil/backState";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";

import { modalInfo } from "../../../../Recoil/frontState";

export interface bankHistoryInterface {
    id?: number;
    dateUsed: string;
    dateCreated: string;
    dateUpdated: string;
    title: string;
    income: string;
    outcome: string;
    memberStudentIdReceived: string;
    memberNameReceived: string;
    memberStudentIdInCharge: string;
    memberNameInCharge: string;
}

const Bank = () => {

    const [nowModalInfo, setNowModalInfo] = useRecoilState(modalInfo);
    
    const [bankHistoryData, fetchBankHistoryData] = useFetch();
    const [bankHistory, setBankHistory] = useRecoilState(bankHistoryInfo);
    const [bankBalance, setBankBalance] = useRecoilState(bankBalanceInfo);
    const [totalPage, setTotalPage] = useRecoilState(totalPageInfo);

    const [bankYearsData, fetchBankYearsData] = useFetch();
    const [bankYears, setBankYears] = useRecoilState(bankYearsInfo);

    const [selectedYear, setSelectedYear] = useState('');

    const handleSelectedYear = (e: any) => {
        setSelectedYear(e.target.value);
    }

    // 연도 데이터 패치
    useEffect(() => {
        fetchBankYearsData('/budget/histories/years', 'GET');
    }, [])

    // 연도 데이터 패치 후 bankYears에 매핑
    useEffect(() => {
        if (bankYearsData) {
            setBankYears(bankYearsData)
        }
    }, [bankYearsData])

    // bankYears에 연도 데이터 매핑 후, 전체 히스토리 패치
    useEffect(() => {
        if (bankYears && bankYears[0]) {
            fetchBankHistoryData(`/budget/histories?year=${selectedYear}&page=${'0'}&size=${'15'}`, "GET", "token")
        }
    }, [bankYears, selectedYear])

    useEffect(() => {
        if (bankHistoryData) {
            const contents = bankHistoryData?.page?.data?.map((data : any) => ({
                id: data?.id,
                사용일: data?.dateUsed?.split('T')[0].substr(2),
                게시일: data?.dateCreated?.split('T')[0].substr(2),
                수정일: data?.dateUpdated?.split('T')[0].substr(2),
                내용: data?.title,
                수입액: String(data?.income)?.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                지출액: String(data?.outcome)?.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            }))
            setBankHistory(contents);
        }

        setTotalPage(bankHistoryData?.page?.pageInfo?.totalPages);
        setBankBalance(bankHistoryData?.balance)
    }, [bankHistoryData])

    return (
        <FlexDiv width="100%">
            <FlexDiv $padding="80px">
                <FlexDiv width="80%">
                    <FlexDiv
                        $border="3px solid"
                        $borderColor="border"
                        width="98%"
                        $justifycontent="space-between"
                        $padding="20px"
                        $margin="0 0 50px 0"
                        >
                        <Div>
                            <H2 fontSize="xl" fontWeight={700}>
                                전체 회계 내역
                            </H2>
                        </Div>
                        <Div>
                            <Select
                                name="subject"
                                required
                                width="100px"
                                $backgroundColor="bgColor"
                                $borderRadius={100}
                                color="wh"
                                $padding="10px"
                                onChange={handleSelectedYear}
                                value={selectedYear}
                                >
                                <option hidden>전체보기</option>
                                {Object.values(bankYears).sort((a, b) => b-a).map((bankYear => (
                                    <option value={String(bankYear)}>{bankYear}</option>
                                )))}
                            </Select>
                        </Div>
                    </FlexDiv>
                    <BankTable />

                    {/* <Pagination /> */}
                    {bankHistory && bankHistory.length !== 0 && (
                        <Pagination
                            totalPage={totalPage}
                            fetchUrl={`/budget/histories`}
                            token
                            paginationFetch={fetchBankHistoryData}
                            size={15}
                            search={`&year=${selectedYear}`}
                        />
                    )}
                </FlexDiv>
            </FlexDiv>
        </FlexDiv>
    );
};

export default Bank;