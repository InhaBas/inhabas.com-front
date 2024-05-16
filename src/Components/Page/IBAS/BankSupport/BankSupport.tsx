import { useNavigate } from "react-router-dom";

import A from "../../../../styles/assets/A";
import Button from "../../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";

import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { DateFunction } from "../../../../Functions/dateFunction";
import useFetch from "../../../../Hooks/useFetch";
import { bankListDataInfo, tokenAccess, totalPageInfo } from "../../../../Recoil/backState";
import { supportListInterface } from "../../../../Types/TypeBank";
import Dropdown from "../../../Common/Dropdown";
import Loading from "../../../Common/Loading";
import Pagination from "../../../Common/Pagination";
import BankSupportTable from "../../../Component/IBAS/BankSupport/BankSupportTable";

const BankSupport = () => {
    const { formatDateDay } = DateFunction();
    const navigate = useNavigate();

    const access = useRecoilValue(tokenAccess);
    const [bankList, setBankList] = useRecoilState(bankListDataInfo);
    const [bankListData, fetchBankListData] = useFetch();
    const [statusValue, setStatusValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [totalPage, setTotalPage] = useRecoilState(totalPageInfo);

    const moveCreate = () => {
        navigate("/bank/support/create");
    };

    // select 값 선택에 따른 state 변경 이벤트
    const handleStatusChange = (value: string) => {
        // 선택된 값을 업데이트
        setStatusValue(value);
    };

    useEffect(() => {
        fetchBankListData(`/budget/applications?status=${statusValue}&page=0&size=10`, "GET", "token");
        setIsLoading(false);
    }, [access, statusValue]);

    useEffect(() => {
        if (bankListData) {
            const contents = bankListData.data.map((item: supportListInterface, idx: number) => ({
                number: bankListData.pageInfo.pageNumber * bankListData.pageInfo.pageSize + idx + 1,
                title: item.title,
                applicantName: item.applicantName,
                dateCreated: formatDateDay({ date: item.dateCreated }),
                status:
                    item.status === "PENDING"
                        ? "승인 대기"
                        : item.status === "APPROVED"
                        ? "승인 완료"
                        : item.status === "REJECTED"
                        ? "승인 거절"
                        : item.status === "COMPLETED"
                        ? "처리 완료"
                        : "error",
                id: item.id,
            }));

            setBankList(contents);
            setTotalPage(bankListData.pageInfo.totalPages);
            // setIsLoading(false);
        }
    }, [bankListData]);

    return (
        <>
            {isLoading ? (
                <FlexDiv width="100%" height="100vh">
                    <Loading />
                </FlexDiv>
            ) : (
                <Container $alignitems="start">
                    <Div width="80%">
                        <Div>
                            <Dropdown
                                label="전체보기"
                                options={["전체보기", "승인 대기", "승인 완료", "승인 거절", "처리 완료"]}
                                value={["", "PENDING", "APPROVED", "REJECTED", "COMPLETED"]}
                                onChange={handleStatusChange}
                                purple
                            />
                        </Div>
                        <BankSupportTable />
                        <FlexDiv width="100%" $justifycontent="end" $margin="20px 0 0 0">
                            <Button
                                $backgroundColor="bgColor"
                                $margin="0 10px 0 0"
                                $padding="12px 15px"
                                $borderRadius={30}
                                $HBackgroundColor="bgColorHo"
                                onClick={() => moveCreate()}
                            >
                                <FlexDiv width="100%">
                                    <Div width="12px" height="12px" $margin="0 10px 0 0">
                                        <Img src="/images/plus_white.svg" />
                                    </Div>
                                    <Div $pointer>
                                        <A color="wh" fontSize="sm" $hoverColor="wh">
                                            신청하기
                                        </A>
                                    </Div>
                                </FlexDiv>
                            </Button>
                        </FlexDiv>
                        {bankList && bankList.length !== 0 && (
                            <Pagination
                                totalPage={totalPage}
                                fetchUrl={`/budget/applications`}
                                token
                                paginationFetch={fetchBankListData}
                                search={statusValue === "" ? "" : `&status=${statusValue}`}
                            />
                        )}
                    </Div>
                </Container>
            )}
        </>
    );
};

export default BankSupport;
