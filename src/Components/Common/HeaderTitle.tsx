import styled from "styled-components";
import { Div, FlexDiv } from "../../styles/assets/Div";
import { H1 } from "../../styles/assets/H";
import P from "../../styles/assets/P";
import HeaderNav from "./HeaderNav";

const HeaderImgDiv = styled(Div)`
    background-image: url("/images/board-name-img.jpg");
    background-size: cover;
    position: relative;
    top: -73px;
`;

const HeaderHDiv = styled(FlexDiv)`
    position: absolute;
    top: 0;
    left: 0;
`;

const HeaderTitle = () => {
    return (
        <>
            <HeaderNav />
            <HeaderHDiv $zIndex={2} width="100%" height="423px" $backgroundColor="bklayer" direction="column">
                <Div $margin="0 0 20px 0">
                    <H1 color="wh" fontWeight={700} fontSize="xxxl">
                        공지사항
                    </H1>
                </Div>
                <Div>
                    <P color="wh" fontWeight={300} fontSize="lg">
                        부원이 알아야 할 내용을 공지합니다.
                    </P>
                </Div>
            </HeaderHDiv>
            <HeaderImgDiv width="100%" height="423px" />
        </>
    );
};

export default HeaderTitle;
