import { Div } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";

const SeeMoreButton = () => {
    return (
        <>
            <Div $margin="0 5px 0 0">
                <P color="grey">더보기</P>
            </Div>
            <Div $borderL="14px solid grey" $borderT="7px solid transparent" $borderB="7px solid transparent" />
        </>
    )
}

export default SeeMoreButton;