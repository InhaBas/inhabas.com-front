import { Div, FlexDiv } from "../../../../styles/assets/Div";
import { H2 } from "../../../../styles/assets/H";
import { Select } from "../../../../styles/assets/Input";

import Pagination from "../../../Common/Pagination";
import BankTable from "../../../Component/IBAS/Bank/BankTable";

const Bank = () => {
    return (
        <FlexDiv width="100%">
            <FlexDiv width="80%">
                <FlexDiv
                    $border="3px solid"
                    $borderColor="border"
                    width="98%"
                    $justifycontent="space-between"
                    $padding="20px"
                    $margin="0 0 50px 0"
                >
                    <Div>
                        <H2 fontSize="xl" fontWeight={700}>
                            전체 회계 내역
                        </H2>
                    </Div>
                    <Div>
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
                            <option>2022</option>
                            <option>2023</option>
                        </Select>
                    </Div>
                </FlexDiv>
                <BankTable />

                <Pagination />
            </FlexDiv>
        </FlexDiv>
    );
};

export default Bank;
