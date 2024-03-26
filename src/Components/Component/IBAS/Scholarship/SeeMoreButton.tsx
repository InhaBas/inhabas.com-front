import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";

import { useNavigate } from "react-router-dom";

const SeeMoreButton = ({ url }: {url: string}) => {

    const navigate = useNavigate();

    const clickBtnEvent = () => {
        navigate(url);
    }

    return (
        <>
            <FlexDiv onClick={clickBtnEvent}>
                <Div $margin="0 5px 0 0">
                    <P color="grey">더보기</P>
                </Div>
                <Div $borderL="14px solid grey" $borderT="7px solid transparent" $borderB="7px solid transparent" />
            </FlexDiv>
        </>
    )
}

export default SeeMoreButton;