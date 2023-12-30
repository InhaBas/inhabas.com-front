import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";

interface HonorType {
    num: Number;
}

const HonorSlide = ({ num }: HonorType) => {
    return (
        <Div $margin="30px" radius={10} $backgroundColor="wh" width="350px" height="400px" $padding="30px">
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
                        <Img src="/images/data-an.png" $objectFit="cover" />
                    </FlexDiv>
                </FlexDiv>
                <FlexDiv direction="column" $justifycontent="space-around" $margin="10px 0 0 0" height="50px">
                    <FlexDiv $justifycontent="start">
                        <P fontSize="sm" color="textColor" fontWeight={700}>
                            글로벌금융학과 {num.toString()}학번
                        </P>
                    </FlexDiv>
                    <FlexDiv>
                        <P fontSize="lg" fontWeight={700}>
                            윤예진
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
                        <P fontSize="sm">yyj11kr@naver.com</P>
                    </FlexDiv>
                </FlexDiv>

                <FlexDiv $justifycontent="start">
                    <FlexDiv width="15px">
                        <Img src="/images/phone.svg" />
                    </FlexDiv>
                    <FlexDiv $margin="0 0 0 10px">
                        <P fontSize="sm">010-8888-8888</P>
                    </FlexDiv>
                </FlexDiv>
                <Div $margin="20px 0 0 0 " width="100%">
                    <P fontSize="sm" $whiteSpace="normal" $lineHeight={1.3}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vehicula risus mauris, sed
                        pulvinar quam pretium con dimentum. Cras convallis nibh eget velit dapibus pharetra. Vestibulum
                        condimentum ip sum pellentesque, gravida ipsum nec, pharetra velit. Duis placerat pharetra
                        tellus in tristique. Mauris et feugiat lorem. Morbi vitae lobortis nunc. Phasellus volutpat
                        venenatis consectetur. Sed in faucibus justo. Suspendisse sollicitudin eget lorem sit amet
                        fermentum.
                    </P>
                </Div>
            </Div>
        </Div>
    );
};

export default HonorSlide;
