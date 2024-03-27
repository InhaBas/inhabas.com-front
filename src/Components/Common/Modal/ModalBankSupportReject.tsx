import { useRecoilState, useSetRecoilState } from "recoil";

import { bankSupportRejectReasonInfo, modalOpen, refetch } from "../../../Recoil/frontState";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useFetch from "../../../Hooks/useFetch";
import Button from "../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../styles/assets/Div";
import { H2 } from "../../../styles/assets/H";
import Img from "../../../styles/assets/Img";
import { TextInput } from "../../../styles/assets/Input";
import P from "../../../styles/assets/P";

const ModalBankSupportReject = () => {
    const location = useLocation();
    const setOpen = useSetRecoilState(modalOpen);

    const closeModal = () => {
        setOpen(false);
    };

    const [infos, setInfos] = useRecoilState(bankSupportRejectReasonInfo);
    const [statusData, fetchSetStatusData] = useFetch();
    const applicationId = location.pathname.split("/")[4];
    const [statusInfo, setStatusInfo] = useState("");
    const setReload = useSetRecoilState(refetch);

    const makeStatusRejected = () => {
        const statusData = { status: "REJECTED", rejectReason: infos };
        // setIsLoading(true);
        fetchSetStatusData(`/budget/application/${applicationId}/status`, "PUT", "token", statusData);
        setStatusInfo("승인 거절");
    };

    useEffect(() => {
        if (statusData) {
            alert(`'${statusInfo}' 처리 되었습니다. `);
            setStatusInfo("");
            setOpen(false);
            setReload(true);
        }
    }, [statusData]);
    return (
        <FlexDiv width="44%" $backgroundColor="wh" direction="column" $justifycontent="space-between" radius={2}>
            <FlexDiv $justifycontent="space-between" width="100%" $backgroundColor="bgColor" $padding="15px 20px">
                <Div>
                    <H2 fontSize="lg" color="wh">
                        거절 사유 등록하기
                    </H2>
                </Div>
                <Div height="24px" $pointer onClick={() => closeModal()}>
                    <Img src={"/images/x_white.svg"} />
                </Div>
            </FlexDiv>
            <FlexDiv $padding="25px" width="100%" direction="column" $justifycontent="space-between">
                <Div width="100%" $margin="0 0 20px 0">
                    <TextInput
                        onChange={(e: any) => setInfos(e.target.value)}
                        placeholder="거절 사유를 입력하세요"
                        width="100%"
                    />
                </Div>

                <FlexDiv width="100%">
                    <Button
                        $backgroundColor="bgColor"
                        $HBackgroundColor="bgColorHo"
                        $borderRadius={3}
                        width="100%"
                        height="40px"
                        onClick={() => makeStatusRejected()}
                    >
                        <P color="wh" fontWeight={400}>
                            등록
                        </P>
                    </Button>
                </FlexDiv>
            </FlexDiv>
        </FlexDiv>
    );
};

export default ModalBankSupportReject;
