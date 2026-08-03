import { Div, FlexDiv } from "../styles/assets/Div"
import P from "../styles/assets/P"
import Img from "../styles/assets/Img";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { media } from "../styles/theme";

const NotFoundPage = styled(Div)`
    padding: 0 16px 32px;

    ${media.mobile} {
        height: auto;
        min-height: 100vh;
    }
`;

const NotFoundLogo = styled(FlexDiv)`
    ${media.tablet} {
        width: 120px;
        height: 120px;
        margin-top: 80px;
    }

    ${media.mobile} {
        width: 96px;
        height: 96px;
        margin-top: 56px;
    }
`;

const ErrorCode = styled(P)`
    ${media.tablet} {
        font-size: 42px;
    }

    ${media.mobile} {
        font-size: 36px;
    }
`;

const ErrorTitle = styled(P)`
    white-space: normal;
    overflow: visible;
    text-align: center;
    text-overflow: clip;

    ${media.tablet} {
        font-size: 40px;
    }

    ${media.mobile} {
        font-size: 28px;
    }
`;

const ErrorDescription = styled(P)`
    white-space: normal;
    overflow: visible;
    text-align: center;
    text-overflow: clip;

    ${media.mobile} {
        font-size: 16px;
    }
`;

const NotFound = () => {

    const navigate = useNavigate();

    const clickButton = () => {
        navigate('/');
    }

    return (
        <>
            <NotFoundPage width="100%" height="100vh" $backgroundColor="bgColorHo" direction="column">
                <FlexDiv width="100%">
                    <NotFoundLogo width="150px" height="150px" $margin="100px 0 0 0" $pointer onClick={clickButton}>
                        <Img src="/images/member_logo_white.png" />
                    </NotFoundLogo>
                </FlexDiv>
                <FlexDiv width="100%" $margin="50px 0 0 0">
                    <Div>
                        <ErrorCode color="wh" fontSize="xxxl">404</ErrorCode>
                    </Div>
                </FlexDiv>
                <FlexDiv width="100%">
                    <Div>
                        <ErrorTitle color="wh" fontSize="xxxl">페이지를 찾을 수 없습니다.</ErrorTitle>
                    </Div>
                </FlexDiv>
                <FlexDiv width="100%" $margin="50px 0 0 0">
                    <Div>
                        <ErrorDescription color="wh" fontSize="xl">잘못된 페이지 경로로 접근하셨습니다.</ErrorDescription>
                    </Div>
                </FlexDiv>
                <FlexDiv width="100%" $margin="20px 0 0 0">
                    <Div $border="1px solid" $borderColor="wh" $pointer $padding="10px" onClick={clickButton}>
                        <P color="wh" fontSize="md">
                            홈으로 돌아가기
                        </P>
                    </Div>
                </FlexDiv>
            </NotFoundPage>
        </>
    )
}

export default NotFound
