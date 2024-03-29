import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import { theme } from "../../../styles/theme";

import useFetch from "../../../Hooks/useFetch";

import { bankListDataInfo, tokenAccess, totalPageInfo } from "../../../Recoil/backState";

import { DateFunction } from "../../../Functions/dateFunction";
import { MySupportInterface } from "../../../Types/IBAS/TypeMyinfo";

import { Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";
import P from "../../../styles/assets/P";
import Pagination from "../../Common/Pagination";

const MyBankSupportContainer = () => {
    const { formatDateDay } = DateFunction();
    const navigate = useNavigate();

    const widthList = [100, 400, 100, 150, 150, 150];
    const headerInfo = ["진행상황", "신청명", "    ", "작성일", "검토일", "입금일"];

    const access = useRecoilValue(tokenAccess);
    const [bankList, setBankList] = useRecoilState(bankListDataInfo);
    const [bankListData, fetchBankListData] = useFetch();
    const [statusValue, setStatusValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [totalPage, setTotalPage] = useRecoilState(totalPageInfo);

    const movePage = (idx: number) => {
        navigate(`/bank/support/detail/${idx}`);
    };

    useEffect(() => {
        fetchBankListData(`/myInfo/supports?status=${statusValue}&page=0&size=15`, "GET", "token");
        setIsLoading(false);
    }, [access, statusValue]);

    useEffect(() => {
        if (bankListData) {
            const contents = bankListData.data.map((item: MySupportInterface, idx: number) => ({
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
                title: item.title,
                id: item.id,
                dateCreated: formatDateDay({ date: item.dateCreated }),
                dateChecked: item.dateChecked === null ? "-" : formatDateDay({ date: item.dateChecked || "" }),
                dateDeposited: item.dateDeposited === null ? "-" : formatDateDay({ date: item.dateDeposited || "" }),
            }));

            setBankList(contents);
            setTotalPage(bankListData.pageInfo.totalPages);
            // setIsLoading(false);
        }
    }, [bankListData]);

    return (
        <>
            <Div width="100%" $border="1px solid" $borderColor="border" $margin=" 0 0 20px 0" radius={6}>
                <FlexDiv
                    width=" 100%"
                    $padding="20px"
                    $justifycontent="start"
                    $borderB={`1px solid ${theme.color.border}`}
                >
                    <FlexDiv>
                        <FlexDiv width="20px" height="15px" $margin="0 10px 0 0">
                            <Img src="/images/money_purple.svg" />
                        </FlexDiv>
                        <Div>
                            <P fontWeight={600}>예산신청 내역</P>
                        </Div>
                    </FlexDiv>
                </FlexDiv>

                <Div width="100%" $padding="50px">
                    <Div width="100%" $borderB={`1px solid ${theme.color.grey1}`}>
                        <FlexDiv
                            width="100%"
                            height="45px"
                            $borderT={`1px solid ${theme.color.grey1}`}
                            $justifycontent="space-between"
                            $backgroundColor="wh"
                        >
                            {headerInfo.map((item: string, idx: number) => (
                                <FlexDiv key={`headerInfo${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                                    <Div>
                                        <P fontWeight={700}>{item}</P>
                                    </Div>
                                </FlexDiv>
                            ))}
                        </FlexDiv>
                        {bankList.length !== 0 ? (
                            bankList.map((element: object, idx: number) => (
                                <FlexDiv
                                    key={`contentItem${idx}`}
                                    width="100%"
                                    height="45px"
                                    $borderT={`1px solid ${theme.color.grey1}`}
                                    $justifycontent="space-between"
                                    $backgroundColor="wh"
                                >
                                    {Object.values(element).map((item: any, idx: number) => (
                                        <FlexDiv
                                            key={`itemValue${idx}`}
                                            $minWidth={`${widthList[idx]}px`}
                                            $padding="10px"
                                            $pointer={idx === 2 ? true : false}
                                            $justifycontent={idx === 1 ? "start" : "center"}
                                        >
                                            <Div onClick={() => idx === 2 && movePage((element as { id: number }).id)}>
                                                {idx === 2 ? (
                                                    <P color="bgColor">원문보기 ▶</P>
                                                ) : (
                                                    <P
                                                        color={
                                                            item === "승인 대기"
                                                                ? "bk"
                                                                : item === "승인 완료"
                                                                ? "success"
                                                                : item === "승인 거절"
                                                                ? "red"
                                                                : item === "처리 완료"
                                                                ? "blue"
                                                                : "bk"
                                                        }
                                                        style={{
                                                            fontStyle: item === "승인 대기" ? "italic" : "normal",
                                                        }}
                                                    >
                                                        {item}
                                                    </P>
                                                )}
                                            </Div>
                                        </FlexDiv>
                                    ))}
                                </FlexDiv>
                            ))
                        ) : (
                            <FlexDiv
                                width="100%"
                                height="45px"
                                $borderT={`1px solid ${theme.color.grey1}`}
                                $padding="0 18px"
                                $backgroundColor="wh"
                            >
                                <Div>
                                    <P>내가 작성한 게시글이 존재하지 않습니다</P>
                                </Div>
                            </FlexDiv>
                        )}
                    </Div>
                    {bankList && bankList.length !== 0 && (
                        <Pagination
                            totalPage={totalPage}
                            fetchUrl={`/budget/applications?status=${statusValue}`}
                            size={7}
                            token
                            paginationFetch={fetchBankListData}
                        />
                    )}
                </Div>
            </Div>
        </>
    );
};

export default MyBankSupportContainer;
