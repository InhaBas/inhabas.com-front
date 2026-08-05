import { useNavigate } from "react-router-dom";

import styled from "styled-components";

import { media, theme } from "../../styles/theme";

import { useRecoilState } from "recoil";
import { bankListDataInfo } from "../../recoil/backState";
import A from "../../styles/assets/A";
import { Div, FlexDiv } from "../../styles/assets/Div";
import P from "../../styles/assets/P";

const TableScrollArea = styled.div`
    width: 100%;
    box-sizing: border-box;
    padding: 20px 0;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
`;

const Table = styled.div`
    width: max-content;
    min-width: 905px;
`;

const TableRow = styled(FlexDiv)`
    flex-wrap: nowrap;

    ${media.tablet} {
        height: auto;
        min-height: 45px;
        align-items: stretch;
    }
`;

const TableCell = styled(FlexDiv)`
    flex-shrink: 0;
`;

const TableLink = styled(A)`
    ${media.tablet} {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        overflow-wrap: anywhere;
    }
`;

const StatusText = styled(P)`
    ${media.tablet} {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        overflow-wrap: anywhere;
    }
`;

const BankSupportTable = () => {
    const navigate = useNavigate();

    const headerInfo = ["no.", "제목", "작성자", "작성일", "상태"];
    const widthList = [45, 500, 120, 120, 120];

    const [bankList, setBankList] = useRecoilState(bankListDataInfo);

    const movePage = (idx: number) => {
        navigate(`/bank/support/detail/${idx}`);
    };

    return (
        <>
            <TableScrollArea>
                <Table>
                <TableRow
                    width="100%"
                    height="45px"
                    $borderB={`1px solid ${theme.color.tableBorder}`}
                    $justifycontent="space-between"
                    $alignitems="center"
                >
                    {headerInfo.map((item: string, idx: number) => (
                        <TableCell key={`headerInfo${idx}`} width={`${widthList[idx]}px`} $padding="10px">
                            <P $center fontWeight={700}>
                                {item}
                            </P>
                        </TableCell>
                    ))}
                </TableRow>
                {bankList.length !== 0 ? (
                    bankList.map((element: object, idx: number) => (
                        <TableRow
                            key={`contentItem${idx}`}
                            width="100%"
                            height="45px"
                            $borderT={`1px solid ${theme.color.grey1}`}
                            $justifycontent="space-between"
                            $backgroundColor="wh"
                        >
                            {Object.values(element)
                                .slice(0, 5)
                                .map((item: any, idx: number) => (
                                    <TableCell
                                        key={`itemValue${idx}`}
                                        width={`${widthList[idx]}px`}
                                        $padding="10px"
                                        $justifycontent={idx === 1 ? "start" : "center"}
                                        onClick={() => idx === 1 && movePage((element as { id: number }).id)}
                                        $pointer={idx === 1 ? true : false}
                                    >
                                        {idx === 4 ? (
                                            <Div width="70%">
                                                <StatusText
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
                                                >
                                                    {item}
                                                </StatusText>
                                            </Div>
                                        ) : (
                                            <Div>
                                                <TableLink
                                                    $center={idx === 1 ? false : true}
                                                    fontWeight={idx === 1 ? 700 : idx === 0 ? 900 : 500}
                                                    $hoverColor={idx === 1 ? "textColor" : idx === 0 ? "grey3" : "bk"}
                                                    color={idx === 0 ? "grey3" : "bk"}
                                                >
                                                    {item}
                                                </TableLink>
                                            </Div>
                                        )}
                                    </TableCell>
                                ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow
                        width="100%"
                        height="45px"
                        $borderT={`1px solid ${theme.color.grey1}`}
                        $padding="0 18px"
                        $backgroundColor="wh"
                    >
                        <Div>
                            <P>게시글이 존재하지 않습니다</P>
                        </Div>
                    </TableRow>
                )}
                </Table>
            </TableScrollArea>
        </>
    );
};

export default BankSupportTable;
