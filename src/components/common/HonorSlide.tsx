import { honorDataInterface } from "../../types/ibas/TypeIBAS";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";
import styled from "styled-components";
import { media } from "../../styles/theme";

interface HonorSlideProps {
    honors: honorDataInterface;
    small?: boolean;
}

const Card = styled(Div)<{ $small?: boolean }>`
    flex: 0 1 350px;

    ${media.tablet} {
        width: calc(100% - 32px);
        max-width: 350px;
        margin: ${({ $small }) => ($small ? "16px" : "0 auto")};
        padding: 26px;
    }

    ${media.mobile} {
        width: calc(100vw - 48px);
        height: auto;
        min-height: 390px;
        margin: ${({ $small }) => ($small ? "12px auto" : "0 auto")};
        padding: 24px 20px;
    }
`;

const ProfileImage = styled(FlexDiv)`
    ${media.mobile} {
        width: 7em;
        height: 7em;
    }
`;

const CardBody = styled(Div)`
    ${media.mobile} {
        height: auto;
        max-height: 170px;
    }
`;

const ContactRow = styled(FlexDiv)`
    min-width: 0;
`;

const ContactIcon = styled(FlexDiv)`
    flex: 0 0 15px;
`;

const ContactText = styled(FlexDiv)`
    min-width: 0;

    p {
        white-space: normal;
        overflow: visible;
        text-overflow: clip;
        overflow-wrap: anywhere;
    }
`;

const HonorSlide: React.FC<HonorSlideProps> = ({ honors, small }) => {
    return (
        <Card
            $small={small}
            radius={10}
            $backgroundColor="wh"
            width="350px"
            height="400px"
            $padding="30px"
            $margin={small ? "0 20px" : "0 10%"}
        >
            <FlexDiv direction="column" $margin="0 0 20px 0" width="100%">
                <ProfileImage
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
                </ProfileImage>
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

            <CardBody width="100%" height="40%" overflow="auto">
                <ContactRow $justifycontent="start" $margin="0 0 5px 0" wrap="nowrap">
                    <ContactIcon width="15px">
                        <Img src="/images/envelope.svg" />
                    </ContactIcon>
                    <ContactText $margin="0 0 0 10px">
                        <P fontSize="sm">{honors.email}</P>
                    </ContactText>
                </ContactRow>

                <ContactRow $justifycontent="start" wrap="nowrap">
                    <ContactIcon width="15px">
                        <Img src="/images/phone.svg" />
                    </ContactIcon>
                    <ContactText $margin="0 0 0 10px">
                        <P fontSize="sm">{honors.phoneNumber}</P>
                    </ContactText>
                </ContactRow>
                <Div $margin="20px 0 0 0 " width="100%">
                    <P fontSize="sm" $whiteSpace="normal" $lineHeight={1.3}>
                        {honors.intro}
                    </P>
                </Div>
            </CardBody>
        </Card>
    );
};

export default HonorSlide;
