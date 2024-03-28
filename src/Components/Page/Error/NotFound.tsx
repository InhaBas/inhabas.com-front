import { Div, FlexDiv } from "../../../styles/assets/Div"
import P from "../../../styles/assets/P"
import Img from "../../../styles/assets/Img";

import { useNavigate } from "react-router-dom";

const NotFound = () => {

    const navigate = useNavigate();

    const clickButton = () => {
        navigate('/');
    }

    return (
        <>
            <Div width="100%" height="100vh" $backgroundColor="bgColorHo" direction="column">
                <FlexDiv width="100%">
                    <FlexDiv width="150px" height="150px" $margin="100px 0 0 0" $pointer onClick={clickButton}>
                        <Img src="/images/member_logo_white.png" />
                    </FlexDiv>
                </FlexDiv>
                <FlexDiv width="100%" $margin="50px 0 0 0">
                    <Div>
                        <P color="wh" fontSize="xxxl">404</P>
                    </Div>
                </FlexDiv>
                <FlexDiv width="100%">
                    <Div>
                        <P color="wh" fontSize="xxxl">페이지를 찾을 수 없습니다.</P>
                    </Div>
                </FlexDiv>
                <FlexDiv width="100%" $margin="50px 0 0 0">
                    <Div>
                        <P color="wh" fontSize="xl">잘못된 페이지 경로로 접근하셨습니다.</P>
                    </Div>
                </FlexDiv>
                <FlexDiv width="100%" $margin="20px 0 0 0">
                    <Div $border="1px solid" $borderColor="wh" $pointer $padding="10px" onClick={clickButton}>
                        <P color="wh" fontSize="md">
                            홈으로 돌아가기
                        </P>
                    </Div>
                </FlexDiv>
            </Div>
        </>
    )
}

export default NotFound
