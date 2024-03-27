import { Div, FlexDiv } from "../../../../styles/assets/Div"
import P from "../../../../styles/assets/P"
import Img from "../../../../styles/assets/Img"

import useFetch from "../../../../Hooks/useFetch"

import { useSetRecoilState, useRecoilValue } from "recoil"
import { refetch, modalOpen, modalInfo } from "../../../../Recoil/frontState"
import { useEffect } from "react"

import { scholarshipHistoryInterface } from "../../../../Types/IBAS/TypeIBAS"

import { GetRoleAuthorization } from "../../../../Functions/authFunctions"
import { userRole } from "../../../../Recoil/backState"

const ChangesContent = ({changesContent} : {changesContent: scholarshipHistoryInterface[]}) => {   

    const { isAuthorizedOverSecretary } = GetRoleAuthorization();
    const role = useRecoilValue(userRole);

    const [deleteChange, fetchDeleteChange] = useFetch();
    
    const setOpen = useSetRecoilState(modalOpen);
    const setReload = useSetRecoilState(refetch);
    const setModalInfo = useSetRecoilState(modalInfo);

    const clickDeleteEvent = (id: string) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            fetchDeleteChange(`/scholarship/history/${id}`, 'DELETE', 'token');
        }
    };

    const clickUpdateEvent = (id: string) => {
        setOpen(true);

        setModalInfo({ type: "scholarshipUpdate", content: id } )
    }

    useEffect(() => {
        if (deleteChange) {
            alert('연혁 삭제가 완료되었습니다.');
            setReload(true);
        }
    }, [deleteChange]);

    return (
        <>
            <Div>
                {changesContent?.map(({ year, data }: scholarshipHistoryInterface) => (
                    <>
                        <FlexDiv key={year} $margin="20px 0 0 0">
                            {/* 연도 옆 원 */}
                            <Div width="15px" height="15px" radius={100} $backgroundColor="grey2"></Div>
                            <Div $margin="0 0 0 5px">
                                <P fontSize="xxl" color="wh">{year}</P>
                            </Div>
                        </FlexDiv>
                        <FlexDiv direction="column" $margin="5px 0 10px 30px">
                            {data.map(({ dateHistory, title, id }: { dateHistory:any, title:any, id:any }) => (
                                <FlexDiv key={id} $margin="5px 0 5px 10px" width="100%" $justifycontent="flex-start">
                                    <FlexDiv>
                                        <P color="wh">{dateHistory?.split('T')[0]?.substring(5)}</P>
                                    </FlexDiv>
                                    <FlexDiv $margin="5px">
                                        <P color="grey3">{title}</P>
                                    </FlexDiv>
                                    {
                                        role && isAuthorizedOverSecretary && (
                                            <FlexDiv $margin="3px">
                                                <FlexDiv width="15px" $margin="0 6px" $pointer onClick={() => clickUpdateEvent(String(id))}>
                                                    <Img src="/images/pencil_grey.svg" />
                                                </FlexDiv>
                                                <FlexDiv width="15px" $pointer onClick={() => clickDeleteEvent(String(id))}>
                                                    <Img src="/images/trash_grey.svg" />
                                                </FlexDiv>
                                            </FlexDiv>
                                        )
                                    }
                                </FlexDiv>
                            ))}
                        </FlexDiv>
                    </>
                ))}
            </Div>
        </>
    );
};

export default ChangesContent;

