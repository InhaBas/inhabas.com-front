import { FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";

const Loading = () => {
    return (
        <FlexDiv width="100%" height="100vh">
            <FlexDiv width="50px">
                <Img src="/images/loading.svg" />
            </FlexDiv>
        </FlexDiv>
    );
};

export default Loading;
