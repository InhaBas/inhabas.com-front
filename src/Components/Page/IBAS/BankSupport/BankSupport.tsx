import { useNavigate } from "react-router-dom";

import A from "../../../../styles/assets/A";
import Button from "../../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";

import { useEffect, useState } from "react";
import Loading from "../../../Common/Loading";
import BankSupportTable from "../../../Component/IBAS/BankSupport/BankSupportTable";

const BankSupport = () => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    const moveCreate = () => {
        navigate("/bank/support/create");
    };

    useEffect(() => setIsLoading(false), []);

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
                <Container $alignitems="start">
                    <Div width="80%">
                        <BankSupportTable />
                        <FlexDiv width="100%" $justifycontent="end" $margin="20px 0 0 0">
                            <Button
                                display="flex"
                                $backgroundColor="bgColor"
                                $margin="0 10px 0 0"
                                $padding="12px 15px"
                                $borderRadius={30}
                                $HBackgroundColor="bgColorHo"
                                onClick={() => moveCreate()}
                            >
                                <Div width="12px" $margin="0 10px 0 0">
                                    <Img src="/images/plus_white.svg" />
                                </Div>
                                <Div $pointer>
                                    <A color="wh" fontSize="sm" href="/bank/support/create" $hoverColor="wh">
                                        신청하기
                                    </A>
                                </Div>
                            </Button>
                        </FlexDiv>
                        {/* <Pagination /> */}
                    </Div>
                </Container>
            )}
        </>
    );
};

export default BankSupport;
