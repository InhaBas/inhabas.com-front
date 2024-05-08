import { honorDataInterface } from "../../Types/IBAS/TypeIBAS";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";

interface HonorSlideProps {
    honors: honorDataInterface;
    small?: boolean;
}

const HonorSlide: React.FC<HonorSlideProps> = ({ honors, small }) => {
    return (
        <Div
            radius={10}
            $backgroundColor="wh"
            width="350px"
            height="400px"
            $padding="30px"
            $margin={small ? "0 20px" : "0 10%"}
        >
            <FlexDiv direction="column" $margin="0 0 20px 0" width="100%">
                <FlexDiv
                    width="8em"
                    height="8em"
                    $border="4px solid"
                    $borderColor="bgColor"
                    radius={100}
                    $padding="3px"
                >
                    <FlexDiv width="100%" height="100%" radius={100} overflow="hidden">
                        <Img src={honors.picture} $objectFit="cover" />
                    </FlexDiv>
                </FlexDiv>
                <FlexDiv direction="column" $justifycontent="space-around" $margin="10px 0 0 0" height="50px">
                    <FlexDiv $justifycontent="start">
                        <P fontSize="sm" color="textColor" fontWeight={700}>
                            {honors.major} {honors.studentId.substr(2, 2)}학번
                        </P>
                    </FlexDiv>
                    <FlexDiv>
                        <P fontSize="lg" fontWeight={700}>
                            {honors.name}
                        </P>
                    </FlexDiv>
                </FlexDiv>
            </FlexDiv>

            <Div width="100%" height="40%" overflow="auto">
                <FlexDiv $justifycontent="start" $margin="0 0 5px 0">
                    <FlexDiv width="15px">
                        <Img src="/images/envelope.svg" />
                    </FlexDiv>
                    <FlexDiv $margin="0 0 0 10px">
                        <P fontSize="sm">{honors.email}</P>
                    </FlexDiv>
                </FlexDiv>

                <FlexDiv $justifycontent="start">
                    <FlexDiv width="15px">
                        <Img src="/images/phone.svg" />
                    </FlexDiv>
                    <FlexDiv $margin="0 0 0 10px">
                        <P fontSize="sm">{honors.phoneNumber}</P>
                    </FlexDiv>
                </FlexDiv>
                <Div $margin="20px 0 0 0 " width="100%">
                    <P fontSize="sm" $whiteSpace="normal" $lineHeight={1.3}>
                        {honors.intro}
                    </P>
                </Div>
            </Div>
        </Div>
    );
};

export default HonorSlide;
