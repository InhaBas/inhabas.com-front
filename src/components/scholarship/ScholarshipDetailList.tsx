import { Div, FlexDiv } from "../../styles/assets/Div";
import P from "../../styles/assets/P";
import Button from "../../styles/assets/Button";
import styled from "styled-components";
import { media } from "../../styles/theme";

import { scholarshipDetailListInterface } from "../../types/ibas/TypeIBAS";

import { useNavigate } from "react-router-dom";

const DetailItem = styled(Div)`
    box-sizing: border-box;
    max-width: 100%;
`;

const DetailButton = styled(Button)`
    max-width: 100%;

    ${media.tablet} {
        text-align: left;
    }
`;

const DetailContent = styled(P)`
    ${media.tablet} {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        overflow-wrap: anywhere;
        line-height: 1.5;
    }
`;

const ScholarshipDetailList: React.FC<scholarshipDetailListInterface> = ({contents, mainUrl}) => {
    const navigate = useNavigate()
    
    return (
        <>
            {
                contents?.slice(0, 3)?.map(({ date, content, id }) => (
                    <DetailItem width="100%" $borderB="2px solid grey" $margin="0 0 15px 0" $padding="0 0 7px 0">
                        {/* 링크 */}
                        <DetailButton width="100%" onClick={() => navigate(`${mainUrl}/${id}`)}>
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
                                <DetailContent color="wh">
                                    {content}
                                </DetailContent>
                            </Div>
                        </DetailButton>
                    </DetailItem>
                ))
            }
        </>
    )
}

export default ScholarshipDetailList;
