import { Div, FlexDiv } from "../../styles/assets/Div";
import P from "../../styles/assets/P";
import styled from "styled-components";

import { useNavigate } from "react-router-dom";

const MoreButton = styled(FlexDiv)`
    max-width: 100%;
`;

const MoreText = styled(P)`
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
`;

const Arrow = styled(Div)`
    flex-shrink: 0;
`;

const SeeMoreButton = ({ url }: {url: string}) => {

    const navigate = useNavigate();

    const clickBtnEvent = () => {
        navigate(url);
    }

    return (
        <>
            <MoreButton onClick={clickBtnEvent}>
                <Div $margin="0 5px 0 0">
                    <MoreText color="grey">더보기</MoreText>
                </Div>
                <Arrow $borderL="14px solid grey" $borderT="7px solid transparent" $borderB="7px solid transparent" />
            </MoreButton>
        </>
    )
}

export default SeeMoreButton;
