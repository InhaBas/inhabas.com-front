import { Div, FlexDiv } from "../../../../styles/assets/Div"
import P from "../../../../styles/assets/P"

import { changesInterface } from "../../../../Types/IBAS/TypeScholarship"

// 년도와 날짜 별 콘텐츠
const ChangesContent: React.FC<changesInterface> = ({year, contents}) => {
    return (
        <>
            <Div>
                <FlexDiv>
                    {/* 연도 옆 원 */}
                    <Div width="15px" height="15px" radius={100} $backgroundColor="grey2"></Div>
                    <Div $margin="0 0 0 5px">
                        <P fontSize="xxl" color="wh">{year}</P>
                    </Div>
                </FlexDiv>
                <FlexDiv direction="column" $margin="5px 0 10px 30px">
                    {
                        contents.map(({date, content}) => (
                            <>
                                <FlexDiv $margin="5px 0 0 10px">
                                    <Div>
                                        <P color="wh">{date}</P>
                                    </Div>
                                    <Div $margin="3px">
                                        <P color="grey3">{content}</P>
                                    </Div>
                                </FlexDiv>
                            </>
                        ))
                    }
                </FlexDiv>
            </Div>
        </>
    )
}

export default ChangesContent;