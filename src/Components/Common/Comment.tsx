import { Div, FlexDiv } from "../../styles/assets/Div"
import Img from "../../styles/assets/Img"
import P from "../../styles/assets/P"
import { theme } from "../../styles/theme"

const Comment = () => {
    return (
        <>
            <Div width="100%" $margin="30px 0" $borderT={`1px solid ${theme.color.border}`}>
                <Div width="100%" $border="1px solid" $margin="30px 0" $padding="20px" $borderColor="grey1">
                    <FlexDiv width="100%" $justifycontent="start">
                        <FlexDiv
                            width="50px"
                            height="50px"
                            $border="3px solid"
                            $borderColor="grey2"
                            radius={100}
                            overflow="hidden"
                            $margin="0 10px 0 0"
                        >
                            <Img src="/images/profile-default.png" $objectFit="cover"></Img>
                        </FlexDiv>
                        <Div>
                            <P fontWeight={700}>윤예진</P>
                            <FlexDiv $justifycontent="start" $margin="5px 0 ">
                                <Div>
                                    <P fontSize="xs" color="grey2">
                                        글로벌금융학과 19학번 |{" "}
                                    </P>
                                </Div>
                                <FlexDiv width="13px" height="13px" $margin="0 5px">
                                    <Img src="/images/clock_grey.svg"></Img>
                                </FlexDiv>
                                <Div>
                                    <P fontSize="xs" color="grey2">
                                        2022-11-09 23:54
                                    </P>
                                </Div>
                            </FlexDiv>
                        </Div>
                    </FlexDiv>
                    <Div $margin="20px 0">
                        <P $whiteSpace="wrap" fontWeight={300} $lineHeight={1.5}>
                            freestar Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sem elit,
                            pellentesque quis tincidunt vitae, imperdiet quis magna. Sed pretium, ipsum eu mattis
                        </P>
                    </Div>
                    <FlexDiv width="100%" $justifycontent="space-between">
                        <FlexDiv>
                            <FlexDiv>
                                <FlexDiv width="13px" height="13px" $margin="0 5px 0 0">
                                    <Img src="/images/comment_purple.svg"></Img>
                                </FlexDiv>
                                <Div>
                                    <P color="bgColor" fontSize="sm">
                                        답글쓰기
                                    </P>
                                </Div>
                            </FlexDiv>
                        </FlexDiv>
                        <FlexDiv>
                            <FlexDiv $margin="0 0 0 20px">
                                <FlexDiv width="13px" height="13px" $margin="0 5px 0 0">
                                    <Img src="/images/pencil_purple.svg"></Img>
                                </FlexDiv>
                                <Div>
                                    <P color="bgColor" fontSize="sm">
                                        수정
                                    </P>
                                </Div>
                            </FlexDiv>
                            <FlexDiv $margin="0 0 0 20px">
                                <FlexDiv width="13px" height="13px" $margin="0 5px 0 0">
                                    <Img src="/images/trash_purple.svg"></Img>
                                </FlexDiv>
                                <Div>
                                    <P color="bgColor" fontSize="sm">
                                        삭제
                                    </P>
                                </Div>
                            </FlexDiv>
                        </FlexDiv>
                    </FlexDiv>
                </Div>
            </Div>
        </>
    )
}

export default Comment
