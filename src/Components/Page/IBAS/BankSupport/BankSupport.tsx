import { useNavigate } from "react-router-dom";

import A from "../../../../styles/assets/A";
import Button from "../../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import Img from "../../../../styles/assets/Img";

import BankSupportTable from "../../../Component/IBAS/BankSupport/BankSupportTable";

const BankSupport = () => {
    const navigate = useNavigate();

    const moveCreate = () => {
        navigate("/bank/support/create");
    };

    return (
        <FlexDiv width="100%">
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
        </FlexDiv>
    );
};

export default BankSupport;
