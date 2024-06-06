import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { Div, FlexDiv } from "../../../../styles/assets/Div";
import { H2 } from "../../../../styles/assets/H";

import Dropdown from "../../../Common/Dropdown";
import Pagination from "../../../Common/Pagination";
import BankTable from "../../../Component/IBAS/Bank/BankTable";

import useFetch from "../../../../Hooks/useFetch";

import {
    bankBalanceInfo,
    bankHistoryInfo,
    bankYearsInfo,
    tokenAccess,
    totalPageInfo,
} from "../../../../Recoil/backState";
import { refetch } from "../../../../Recoil/frontState";
import Loading from "../../../Common/Loading";

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
    const [bankHistoryData, fetchBankHistoryData] = useFetch();
    const [bankHistory, setBankHistory] = useRecoilState(bankHistoryInfo);
    const [bankBalance, setBankBalance] = useRecoilState(bankBalanceInfo);
    const [totalPage, setTotalPage] = useRecoilState(totalPageInfo);
    const accessToken = useRecoilValue(tokenAccess);
    const [reload, setReload] = useRecoilState(refetch);
    const [isLoading, setIsLoading] = useState(true);

    const [bankYearsData, fetchBankYearsData] = useFetch();
    const [bankYears, setBankYears] = useRecoilState(bankYearsInfo);

    const [selectedYear, setSelectedYear] = useState("");

    const handleSelectedYear = (value: string) => {
        setSelectedYear(value);
    };

    // 연도 데이터 패치
    useEffect(() => {
        setIsLoading(true);
        fetchBankYearsData("/budget/histories/years", "GET");
    }, [accessToken]);

    // 연도 데이터 패치 후 bankYears에 매핑
    useEffect(() => {
        if (bankYearsData) {
            setBankYears(bankYearsData);
        }
    }, [bankYearsData]);

    // bankYears에 연도 데이터 매핑 후, 전체 히스토리 패치
    useEffect(() => {
        if (bankYears && bankYears[0]) {
            fetchBankHistoryData(`/budget/histories?year=${selectedYear}&page=${"0"}&size=${"15"}`, "GET", "token");
        }
        setReload(false);
    }, [bankYears, selectedYear, accessToken, reload]);

    useEffect(() => {
        if (bankHistoryData) {
            const contents = bankHistoryData?.page?.data?.map((data: any) => ({
                id: data?.id,
                사용일: data?.dateUsed?.split("T")[0],
                게시일: data?.dateCreated?.split("T")[0],
                수정일: data?.dateUpdated?.split("T")[0],
                내용: data?.title,
                수입액: String(data?.income)?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                지출액: String(data?.outcome)?.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            }));
            setBankHistory(contents);
            setIsLoading(false);
        }

        setTotalPage(bankHistoryData?.page?.pageInfo?.totalPages);
        setBankBalance(bankHistoryData?.balance);

        return () => {
            setBankHistory([]);
            setTotalPage(0);
            setBankBalance(0);
        };
    }, [bankHistoryData]);

    return (
        <FlexDiv width="100%">
            {isLoading ? (
                <FlexDiv width="100%" height="100vh">
                    <Loading />
                </FlexDiv>
            ) : (
                <FlexDiv $padding="80px">
                    <FlexDiv width="90vw">
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
                                <Dropdown
                                    label="전체보기"
                                    options={[
                                        "전체보기",
                                        ...Object.values(bankYears)
                                            .sort((a, b) => b - a)
                                            .map((bankYear) => String(bankYear)),
                                    ]}
                                    value={[
                                        "",
                                        ...Object?.values(bankYears)
                                            ?.sort((a, b) => b - a)
                                            ?.map((bankYear) => String(bankYear)),
                                    ]}
                                    onChange={handleSelectedYear}
                                    purple
                                />
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
            )}
        </FlexDiv>
    );
};

export default Bank;
