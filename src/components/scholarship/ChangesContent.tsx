import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";
import styled from "styled-components";
import { media } from "../../styles/theme";

import useFetch from "../../hooks/useFetch";

import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { modalInfo, modalOpen, refetch } from "../../recoil/frontState";

import { scholarshipHistoryInterface } from "../../types/ibas/TypeIBAS";

import { GetRoleAuthorization } from "../../functions/authFunctions";
import { userRole } from "../../recoil/backState";

const HistoryYear = styled(FlexDiv)`
    min-width: 0;
`;

const HistoryItem = styled(FlexDiv)`
    min-width: 0;

    ${media.tablet} {
        width: calc(100% - 10px);
        height: auto;
        min-height: 28px;
        align-items: flex-start;
    }

    ${media.mobile} {
        gap: 4px;
    }
`;

const HistoryDate = styled(FlexDiv)`
    flex-shrink: 0;
`;

const HistoryTitle = styled(FlexDiv)`
    flex: 1;
    min-width: 0;
`;

const HistoryText = styled(P)`
    ${media.tablet} {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        overflow-wrap: anywhere;
        line-height: 1.5;
    }
`;

const HistoryActions = styled(FlexDiv)`
    flex-shrink: 0;

    ${media.mobile} {
        width: 100%;
        margin: 0;
        justify-content: flex-end;
    }
`;

const ChangesContent = ({ changesContent }: { changesContent: scholarshipHistoryInterface[] }) => {
    const { isAuthorizedOverVice } = GetRoleAuthorization();
    const role = useRecoilValue(userRole);

    const [deleteChange, fetchDeleteChange] = useFetch();

    const setOpen = useSetRecoilState(modalOpen);
    const setReload = useSetRecoilState(refetch);
    const setModalInfo = useSetRecoilState(modalInfo);

    const clickDeleteEvent = (id: string) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
            fetchDeleteChange(`/scholarship/history/${id}`, "DELETE", "token");
        }
    };

    const clickUpdateEvent = (id: string) => {
        setOpen(true);

        setModalInfo({ type: "scholarshipUpdate", content: id });
    };

    useEffect(() => {
        if (deleteChange) {
            alert("연혁 삭제가 완료되었습니다.");
            setReload(true);
        }
    }, [deleteChange]);

    return (
        <>
            <Div>
                {changesContent?.map(({ year, data }: scholarshipHistoryInterface) => (
                    <>
                        <HistoryYear key={year} $margin="20px 0 0 0">
                            {/* 연도 옆 원 */}
                            <Div width="15px" height="15px" radius={100} $backgroundColor="grey2"></Div>
                            <Div $margin="0 0 0 5px">
                                <P fontSize="xxl" color="wh">
                                    {year}
                                </P>
                            </Div>
                        </HistoryYear>
                        <FlexDiv direction="column" $margin="5px 0 10px 30px">
                            {data.map(({ dateHistory, title, id }: { dateHistory: any; title: any; id: any }) => (
                                <HistoryItem key={id} $margin="5px 0 5px 10px" width="100%" $justifycontent="flex-start">
                                    <HistoryDate>
                                        <P color="wh">{dateHistory?.split("T")[0]?.substring(5)}</P>
                                    </HistoryDate>
                                    <HistoryTitle $margin="5px">
                                        <HistoryText color="grey2">{title}</HistoryText>
                                    </HistoryTitle>
                                    {role && isAuthorizedOverVice && (
                                        <HistoryActions $margin="3px">
                                            <FlexDiv
                                                width="15px"
                                                $margin="0 6px"
                                                $pointer
                                                onClick={() => clickUpdateEvent(String(id))}
                                            >
                                                <Img src="/images/pencil_grey.svg" />
                                            </FlexDiv>
                                            <FlexDiv width="15px" $pointer onClick={() => clickDeleteEvent(String(id))}>
                                                <Img src="/images/trash_grey.svg" />
                                            </FlexDiv>
                                        </HistoryActions>
                                    )}
                                </HistoryItem>
                            ))}
                        </FlexDiv>
                    </>
                ))}
            </Div>
        </>
    );
};

export default ChangesContent;
