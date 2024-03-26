import { useNavigate } from "react-router-dom";

import { theme } from "../../../../styles/theme";

import { useRecoilState } from "recoil";
import { bankListDataInfo } from "../../../../Recoil/backState";
import { refetch } from "../../../../Recoil/frontState";
import A from "../../../../styles/assets/A";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";

const BankSupportTable = () => {
    const navigate = useNavigate();

    const headerInfo = ["no.", "제목", "작성자", "작성일", "상태"];
    const widthList = [45, 500, 120, 120, 120];

    const [bankList, setBankList] = useRecoilState(bankListDataInfo);

    const [reload, setReload] = useRecoilState(refetch);

    const movePage = (idx: number) => {
        navigate(`/bank/support/detail/${idx}`);
    };

    return (
        <>
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
                        >
                            {Object.values(element).map((item: any, idx: number) => (
                                <FlexDiv
                                    key={`itemValue${idx}`}
                                    $minWidth={`${widthList[idx]}px`}
                                    $padding="10px"
                                    $justifycontent={idx === 1 ? "start" : "center"}
                                    onClick={() => idx === 1 && movePage((element as { id: number }).id)}
                                    $pointer={idx === 1 ? true : false}
                                >
                                    {idx === 4 ? (
                                        <Div width="70%">
                                            <P
                                                color={
                                                    item === "승인 대기"
                                                        ? "bk"
                                                        : item === "승인 완료"
                                                        ? "green"
                                                        : item === "승인 거절"
                                                        ? "red"
                                                        : item === "처리 완료"
                                                        ? "blue"
                                                        : "bk"
                                                }
                                                style={{ fontStyle: item === "승인 대기" ? "italic" : "normal" }}
                                            >
                                                {item}
                                            </P>
                                        </Div>
                                    ) : (
                                        <Div>
                                            <A
                                                $center={idx === 1 ? false : true}
                                                fontWeight={idx === 1 ? 700 : idx === 0 ? 900 : 500}
                                                $hoverColor={idx === 1 ? "textColor" : idx === 0 ? "grey3" : "bk"}
                                                color={idx === 0 ? "grey3" : "bk"}
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
