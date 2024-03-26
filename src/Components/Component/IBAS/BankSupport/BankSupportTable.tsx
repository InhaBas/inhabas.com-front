import { useNavigate } from "react-router-dom";

import { theme } from "../../../../styles/theme";

import { useEffect } from "react";

import { useRecoilState, useRecoilValue } from "recoil";
import { DateFunction } from "../../../../Functions/dateFunction";
import useFetch from "../../../../Hooks/useFetch";
import { bankListDataInfo, tokenAccess, totalPageInfo } from "../../../../Recoil/backState";
import { supportListInterface } from "../../../../Types/TypeBank";
import A from "../../../../styles/assets/A";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import { Select } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";

const BankSupportTable = () => {
    const navigate = useNavigate();

    const headerInfo = ["no.", "제목", "작성자", "작성일", "상태"];
    const widthList = [45, 450, 120, 120, 120];

    const { formatDateDay } = DateFunction();

    const access = useRecoilValue(tokenAccess);
    const [bankListData, fetchBankListData] = useFetch();
    const [bankList, setBankList] = useRecoilState(bankListDataInfo);
    const [totalPage, setTotalPage] = useRecoilState(totalPageInfo);

    const movePage = (idx: number) => {
        navigate(`/bank/support/detail/${idx}`);
    };

    // url 바뀔 때마다 해당 table fetch 할 수 있도록
    useEffect(() => {
        fetchBankListData(`/budget/applications?page=0&size=15`, "GET", "token");
    }, [access]);

    useEffect(() => {
        if (bankListData) {
            const contents = bankListData.data.map((item: supportListInterface, idx: number) => ({
                number: idx + 1,
                id: item.id,
                title: item.title,
                applicantName: item.applicantName,
                dateCreated: formatDateDay({ date: item.dateCreated }),
                status: item.status,
            }));

            setBankList(contents);
            setTotalPage(bankListData.pageInfo.totalPages);
            // setIsLoading(false);
        }
    }, [bankListData]);

    return (
        <>
            <Select
                name="subject"
                required
                width="100px"
                $backgroundColor="bgColor"
                $borderRadius={100}
                color="wh"
                $padding="10px"
            >
                <option hidden>전체보기</option>
                <option>승인 대기</option>
                <option>승인 완료</option>
                <option>승인 거절</option>
            </Select>
            <Div width="100%" $padding="20px 0">
                <FlexDiv
                    width="100%"
                    height="45px"
                    $borderB={`1px solid ${theme.color.tableBorder}`}
                    $justifycontent="space-between"
                    $alignitems="center"
                >
                    {headerInfo.map((item: string, idx: number) => (
                        <FlexDiv key={`headerInfo${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                            <P $center fontWeight={700}>
                                {item}
                            </P>
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
                            $pointer
                        >
                            {Object.values(element).map((item: any, idx: number) => (
                                <FlexDiv
                                    key={`itemValue${idx}`}
                                    $minWidth={`${widthList[idx]}px`}
                                    $padding="10px"
                                    $justifycontent={idx === 1 ? "start" : "center"}
                                    onClick={() => idx === 1 && movePage((element as { id: number }).id)}
                                >
                                    {idx === 4 ? (
                                        <Div>
                                            <A color="red">{item}</A>
                                        </Div>
                                    ) : (
                                        <Div>
                                            <A
                                                $center={idx === 1 ? false : true}
                                                fontWeight={idx === 1 ? 700 : idx === 0 ? 900 : 500}
                                                $hoverColor={idx === 1 ? "textColor" : idx === 0 ? "grey3" : "bk"}
                                            >
                                                {item}
                                            </A>
                                        </Div>
                                    )}
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
                            <P>게시글이 존재하지 않습니다</P>
                        </Div>
                    </FlexDiv>
                )}
            </Div>
        </>
    );
};

export default BankSupportTable;
