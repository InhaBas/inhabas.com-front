import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";
import Button from "../../../../styles/assets/Button";

import { scholarshipDetailListInterface } from "../../../../Types/IBAS/TypeIBAS";

const ScholarshipDetailList: React.FC<scholarshipDetailListInterface> = ({contents}) => {
    return (
        <>
            {
                contents.map(({ date, content }) => (
                    <Div width="100%" $borderB="2px solid grey" $margin="0 0 10px 0" $padding="0 0 10px 0">
                        {/* 링크 */}
                        <Button width="100%">
                            <Div>
                                {/* 날짜 */}
                                <FlexDiv $backgroundColor="grey" radius={20} width="50px" height="17px" $margin="0 0 10px 0">
                                    <P color="wh" fontSize="xs">
                                        {date}
                                    </P>
                                </FlexDiv>
                            </Div>
                            <Div>
                                {/* 내용 */}
                                <P color="wh">
                                    {content}
                                </P>
                            </Div>
                        </Button>
                    </Div>
                ))
            }
        </>
    )
}

export default ScholarshipDetailList;