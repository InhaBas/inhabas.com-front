import React from "react"

import { theme } from "../../../styles/theme"

import { Div, FlexDiv } from "../../../styles/assets/Div"
import P from "../../../styles/assets/P"
import { SearchInput } from "../../../styles/assets/Input"
import Button from "../../../styles/assets/Button"
import Img from "../../../styles/assets/Img"

const BoardSearch = () => {
    return (
        <>
            <Div width="263px" height="147px" $border={`2px solid`} $borderColor="border" $padding="30px 20px 10px">
                <Div $borderL={`4px solid ${theme.color.bgColor}`} $padding="5px 0 5px 20px" $margin="0 0 15px 0">
                    <P fontSize="xl" fontWeight={700}>
                        게시글 검색
                    </P>
                </Div>

                <FlexDiv wrap="nowrap">
                    <Div>
                        <SearchInput placeholder="검색어를 입력하세요." />
                    </Div>
                    <Button
                        $backgroundColor="bgColor"
                        width="53px"
                        height="40px"
                        $padding="10px 20px"
                        $borderRadius={3}
                    >
                        <Div width="13px">
                            <Img src="/images/search_white.svg"></Img>
                        </Div>
                    </Button>
                </FlexDiv>
            </Div>
        </>
    )
}

export default BoardSearch
