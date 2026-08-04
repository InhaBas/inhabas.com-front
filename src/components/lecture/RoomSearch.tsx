import { media, theme } from "../../styles/theme"
import styled from "styled-components"

import Button from "../../styles/assets/Button"
import { Div, FlexDiv } from "../../styles/assets/Div"
import Img from "../../styles/assets/Img"
import { SearchInput } from "../../styles/assets/Input"
import P from "../../styles/assets/P"

const SearchBox = styled.div`
    width: 263px;
    height: 147px;
    max-width: 100%;
    padding: 30px 20px 10px;
    border: 2px solid ${({ theme }) => theme.color.border};
    box-sizing: border-box;

    ${media.tablet} {
        width: 100%;
    }
`;

const SearchRow = styled.div`
    display: flex;
    gap: 0;
    min-width: 0;

    > :first-child {
        flex: 1;
        min-width: 0;
    }
`;

const RoomSearchInput = styled(SearchInput)`
    width: 100%;
`;

const BoardSearch = () => {
    return (
        <>
            <SearchBox>
                <Div $borderL={`4px solid ${theme.color.bgColor}`} $padding="5px 0 5px 20px" $margin="0 0 15px 0">
                    <P fontSize="xl" fontWeight={700}>
                        강의실 내 검색
                    </P>
                </Div>

                <SearchRow>
                    <Div>
                        <RoomSearchInput placeholder="검색어를 입력하세요." />
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
                </SearchRow>
            </SearchBox>
        </>
    )
}

export default BoardSearch
