import styled from "styled-components";

import A from "../../../styles/assets/A";
import Button from "../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../styles/assets/Div";
import Img from "../../../styles/assets/Img";

import NavigateTable from "../../Common/NavigateTable";
import Pagination from "../../Common/Pagination";
import BoardNavigate from "../../Component/Board/BoardNavigate";
import BoardSearch from "../../Component/Board/BoardSearch";

const StickyDiv = styled(Div)`
    position: sticky;
    top: 50px;
`;

const BoardList = () => {
    const headerInfo = ["no.", "제목", "작성자", "작성일"];
    const widthList = [45, 450, 120, 120];

    const contents = [
        {
            id: 0,
            title: "string",
            writer_name: "string",
            created: "2023-07-19",
        },
        {
            id: 1,
            title: "string",
            writer_name: "string",
            created: "2023-07-20",
        },
        {
            id: 2,
            title: "string",
            writer_name: "string",
            created: "2023-07-21",
        },
        {
            id: 3,
            title: "string",
            writer_name: "string",
            created: "2023-07-22",
        },
    ];

    return (
        <Container $alignitems="start" $justifycontent="space-evenly">
            <StickyDiv>
                <Div $margin="0 0 30px 0">
                    <BoardSearch />
                </Div>

                <Div>
                    <BoardNavigate />
                </Div>
            </StickyDiv>
            <Div>
                <NavigateTable header={headerInfo} width={widthList} contents={contents} url="/board/detail" />
                <FlexDiv width="100%" $justifycontent="end" $margin="20px 0 0 0">
                    <Button
                        display="flex"
                        $backgroundColor="bgColor"
                        $margin="0 10px 0 0"
                        $padding="12px 15px"
                        $borderRadius={30}
                    >
                        <Div width="12px" $margin="0 10px 0 0">
                            <Img src="/images/plus_white.svg" />
                        </Div>
                        <Div $pointer>
                            <A color="wh" fontSize="sm" href="/board/create" $hoverColor="wh">
                                게시글 작성
                            </A>
                        </Div>
                    </Button>
                </FlexDiv>
                <Pagination />
            </Div>
        </Container>
    );
};

export default BoardList;
