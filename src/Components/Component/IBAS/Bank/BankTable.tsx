import { MouseEvent, useEffect } from "react";

import { useRecoilValue, useSetRecoilState } from "recoil";

import { modalInfo, modalOpen, refetch } from "../../../../Recoil/frontState";
import { bankHistoryInfo, bankBalanceInfo } from "../../../../Recoil/backState";

import { theme } from "../../../../styles/theme";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";
import P from "../../../../styles/assets/P";

import useFetch from "../../../../Hooks/useFetch";

import { GetRoleAuthorization } from "../../../../Functions/authFunctions";
import { userRole, tokenAccess } from "../../../../Recoil/backState";

import { jwtDecode } from "jwt-decode";
import { tokenInterface } from "../../../../Types/TypeCommon";

const BankTable = () => {

    const { isSecretary } = GetRoleAuthorization();
    const role = useRecoilValue(userRole);
    const access = useRecoilValue(tokenAccess);

    let decoded;
    if (access !== "default") {
        decoded = jwtDecode(access) as tokenInterface;
    }
    const userId = decoded?.memberId;

    const setOpen = useSetRecoilState(modalOpen);
    const setModalInfo = useSetRecoilState(modalInfo);
    const setReload = useSetRecoilState(refetch);

    const [deleteHistory, fetchDeleteHistory] = useFetch();

    const clickDetailEvent = (ev: MouseEvent, name: string, selectedId: number) => {
        setOpen(true);

        setModalInfo({ type: "bankHistory", content: String(selectedId) });
    };

    const clickUpdateEvent = (ev: MouseEvent, name: string, selectedIdx: number) => {
        setOpen(true);

        setModalInfo({ type: "bankHistoryUpdate", content: String(selectedIdx) });
    };

    const clickDeleteEvent = (ev: MouseEvent, name: string, selectedId: number) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            fetchDeleteHistory(`/budget/history/${selectedId}`, 'DELETE', 'token')
        }
    };

    useEffect(() => {
        if (deleteHistory) {
            alert('내역이 정상적으로 삭제되었습니다.')
            setReload(true);
        }
    }, [deleteHistory])

    const clickPostEvent = (ev: MouseEvent, name: string, content: string) => {
        setOpen(true);

        setModalInfo({ type: "bankHistoryPost" });
    };

    const headerInfo = ["사용일", "게시일", "수정일", "내용", "수입액", "지출액", "증빙"];
    const widthList = [120, 120, 120, 350, 100, 100, 40];

    const contents = useRecoilValue(bankHistoryInfo);
    const bankBalance = useRecoilValue(bankBalanceInfo);
    console.log(contents)
    return (
        <>
            <Div width="100%" $padding="20px">
                <FlexDiv
                    width="100%"
                    height="45px"
                    $borderT={`1px solid ${theme.color.grey1}`}
                    $justifycontent="space-between"
                    $backgroundColor="wh"
                >
                    {headerInfo.map((item: string, idx: number) => (
                        <FlexDiv key={`headerInfo${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                            <P $center fontWeight={700}>
                                {item}
                            </P>
                        </FlexDiv>
                    ))}
                    {/* 권한 여부 체크 */}
                {
                    role && isSecretary && (
                        <FlexDiv $minWidth="60px" $padding="10px">
                            <P $center fontWeight={700}>
                                비고
                            </P>
                        </FlexDiv>
                    )
                }
                </FlexDiv>
                {contents?.map((element: any, idx: number) => (
                    <FlexDiv
                        key={`contentItem${idx}`}
                        width="100%"
                        height="45px"
                        $borderT={`1px solid ${theme.color.grey1}`}
                        $justifycontent="space-between"
                        $backgroundColor="wh"
                    >
                        {Object.values(element).slice(1, 7).map((item: any, idx: number) => (
                            <FlexDiv key={`itemValue${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                                <P $center fontWeight={500} >
                                    {item === "0" ? "-" : item}
                                </P>
                            </FlexDiv>
                        ))}
                        <FlexDiv width="50px">
                            <Div width="15px" onClick={ (e: MouseEvent) => clickDetailEvent(e, "ss", element?.id) } $pointer>
                                <Img src="/images/file_grey.svg" />
                            </Div>
                        </FlexDiv>
                        {/* 권한 여부 체크 */}

                        {
                            (role && isSecretary && element?.writerId === userId) ? (
                                <FlexDiv $minWidth={'60px'} $padding="10px">
                                    <FlexDiv width="15px" $margin="0 6px" onClick={ (e: MouseEvent) => clickUpdateEvent(e, "ss", element?.id) } $pointer>
                                        <Img src="/images/pencil_grey.svg"/>
                                    </FlexDiv>
                                    <FlexDiv width="15px" onClick={ (e: MouseEvent) => clickDeleteEvent(e, "ss", element?.id) } $pointer>
                                        <Img src="/images/trash_grey.svg"/>
                                    </FlexDiv>
                                </FlexDiv>
                            ) : (
                                <FlexDiv $minWidth={'62px'} $padding="10px">
                                </FlexDiv>
                            )
                        }
                    </FlexDiv>
                ))}
            </Div>

            {
                role && isSecretary && (
                    <FlexDiv width="100%" $justifycontent="flex-end" $padding="0 20px 10px 0" $margin="0 20px 0 0">
                        <FlexDiv width="20px" height="20px" radius={50} onClick={ (e: MouseEvent) => clickPostEvent(e, "ss", '') } $pointer>
                            <Img src="/images/plus_grey.svg" />
                        </FlexDiv>
                    </FlexDiv>
                )
            }

            <FlexDiv width="100%">
                <Div $padding="10px 20px" $backgroundColor="bgColor" radius={50}>
                    <P color="wh"> 잔액 : ₩ { String(bankBalance)?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') } </P>
                </Div>
            </FlexDiv>
        </>
    );
};

export default BankTable;
