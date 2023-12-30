import { useEffect } from "react"
import { useRecoilState } from "recoil"

import { theme } from "../../../styles/theme"

import { boardListInfo } from "../../../Recoil/backState"

import { useNavigate } from "react-router-dom"
import { Div, FlexDiv } from "../../../styles/assets/Div"
import P from "../../../styles/assets/P"

const BoardNavigate = () => {
    const navigate = useNavigate()
    const tempMenu = [
        {
            id: 0,
            group_name: "전체 게시글",
            total: 32,
            url: "total",
        },
        {
            id: 1,
            group_name: "공지사항",
            total: 22,
            url: "announce",
        },
        {
            id: 2,
            group_name: "자유게시판",
            total: 5,
            url: "free",
        },
        {
            id: 3,
            group_name: "질문게시판",
            total: 2,
            url: "question",
        },
        {
            id: 4,
            group_name: "공모전게시판",
            total: 26,
            url: "contest",
        },
        {
            id: 5,
            group_name: "활동게시판",
            total: 37,
            url: "activity",
        },
    ]

    const movePageEvent = (url: string) => {
        navigate(`/${url}`)
    }

    const [menu, setMenu] = useRecoilState<any>(boardListInfo)

    useEffect(() => {
        setMenu(tempMenu)
        // return () => {
        //     setMenu({})
        // }
    }, [])

    return (
        <>
            <Div width="263px" $border={`2px solid`} $borderColor="border" $padding="30px 20px 10px">
                <Div $borderL={`4px solid ${theme.color.bgColor}`} $padding="5px 0 5px 20px" $margin="0 0 15px 0">
                    <P fontSize="xl" fontWeight={700}>
                        게시판
                    </P>
                </Div>

                <Div width="100%">
                    {menu?.map((item: any, idx: number) => {
                        return (
                            <Div key={idx} width="100%">
                                <FlexDiv
                                    width="100%"
                                    $padding="15px 0"
                                    $justifycontent="space-between"
                                    $borderT={idx !== 0 ? `1px dashed ${theme.color.border}` : "none"}
                                    onClick={() => movePageEvent(item.url)}
                                    $pointer
                                >
                                    <Div>
                                        <P color="grey" fontSize="sm" fontWeight={400}>
                                            {item.group_name}
                                        </P>
                                    </Div>
                                    <Div>
                                        <P color="grey" fontSize="sm" fontWeight={400}>
                                            ({item.total - 1}+)
                                        </P>
                                    </Div>
                                </FlexDiv>
                            </Div>
                        )
                    })}
                    {/* <Button onClick={tmpEvent}>ddd</Button> */}
                </Div>
            </Div>
        </>
    )
}

export default BoardNavigate
