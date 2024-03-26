import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";
import Button from "../../../../styles/assets/Button";

import { scholarshipDetailListInterface } from "../../../../Types/IBAS/TypeIBAS";

import { useNavigate } from "react-router-dom";

const ScholarshipDetailList: React.FC<scholarshipDetailListInterface> = ({contents, mainUrl}) => {
    const navigate = useNavigate()
    
    return (
        <>
            {
                contents?.map(({ date, content, id }) => (
                    <Div width="100%" $borderB="2px solid grey" $margin="0 0 15px 0" $padding="0 0 7px 0">
                        {/* 링크 */}
                        <Button width="100%" onClick={() => navigate(`${mainUrl}/${id}`)}>
                            <Div>
                                {/* 날짜 */}
                                <FlexDiv $backgroundColor="grey" radius={20} width="50px" height="18px" $margin="0 0 10px 0">
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