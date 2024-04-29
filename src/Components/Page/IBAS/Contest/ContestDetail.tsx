import { Div, FlexDiv } from "../../../../styles/assets/Div";
import P from "../../../../styles/assets/P";
import Img from "../../../../styles/assets/Img";
import { H2 } from "../../../../styles/assets/H";
import Button from "../../../../styles/assets/Button";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../../../Hooks/useFetch";
import Comment from "../../../Common/Comment";
import CommentInput from "../../../Common/CommentInput";
import { jwtDecode } from "jwt-decode";
import { useRecoilValue } from "recoil";
import { tokenAccess } from "../../../../Recoil/backState";
import { tokenInterface } from "../../../../Types/TypeCommon";
import { GetRoleAuthorization } from "../../../../Functions/authFunctions";


interface ContestDetailType {
    id: number;
    contestFieldId: number;
    title: string;
    content: string;
    writerName: string;
    association: string;
    topic: string;
    thumbnail: {
        id: string;
        name: string;
        url: string;
        size: number;
        type: string;
    };
    images: {
        id: string;
        name: string;
        url: string;
        size: number;
        type: string;
    }[];
    otherFiles: any[]; // 이 부분은 다른 파일의 구조를 알 수 없으므로 any로 지정했습니다.
    dateContestStart: string;
    dateContestEnd: string;
    dateCreated: string;
    dateUpdated: string;
}

const ContestDetail = () => {
    const location = useLocation();
    const url = location.pathname.split("/")[2];
    const boardId = location.pathname.split("/")[4];
    const [detailData, detailDataFetch] = useFetch();
    const [detail, setDetail] = useState<ContestDetailType|null>(null);
    const menuId = url === 'contest' ? 18 : 19;
    const access = useRecoilValue(tokenAccess);
    const navigate = useNavigate();

    const [deleteData, deleteDataFetch] = useFetch();

    const { isAuthorizedOverVice } = GetRoleAuthorization();

    let decoded;
    if (access !== "default") {
        decoded = jwtDecode(access) as tokenInterface;
    }

    const userId = decoded?.memberId;

    const deleteDetail = () => {
        if (window.confirm("정말 삭제 하시겠습니까?")) {
            deleteDataFetch(`/contest/${url}/${boardId}`, "DELETE", "token");
        }
    };

    useEffect(() => {
        detailDataFetch(`/contest/${url}/${boardId}`, 'GET')
    }, [url])

    useEffect(() => {
        setDetail(detailData);
    }, [detailData])

    useEffect(() => {
        if (deleteData) {
            alert("게시글이 삭제 되었습니다");
            navigate(`/board/${url}`);
        }
        return () => setDetail(null);
    }, [deleteData]);

    return (
        <>
            {/* 컨테이너 */}
            <Div width="73%" $margin="50px 0 100px 0" direction="column">
                {/* 작성 info */}
                <FlexDiv $margin="50px 0 30px 0">
                    <FlexDiv width="12px" $margin="0 5px 0 0">
                        <Img src="/images/user_grey.svg" />
                    </FlexDiv>
                    <Div>
                        <P color="grey4" fontSize="sm">
                            By {detail?.writerName} |
                        </P>
                    </Div>
                    <FlexDiv width="12px" $margin="0 5px ">
                        <Img src="/images/calendar_grey.svg" />
                    </FlexDiv>
                    <FlexDiv>
                        <P color="grey4" fontSize="sm">
                            {detail?.dateCreated.split('T')[0]} {detail?.dateCreated.split('T')[1]}
                        </P>
                    </FlexDiv>
                </FlexDiv>

                {/* 게시글 title */}
                <Div>
                    <H2 fontSize="xxl" fontWeight={800}>
                        {detail?.title}
                    </H2>
                </Div>

                {/* 주최기관, 개최기간 */}
                <FlexDiv $padding="30px 0" width="100%" $justifycontent="flex-start">
                    <Div $margin="0 5px 0 0" width="12px">
                        <Img src="/images/building_grey.svg" />
                    </Div>
                    <Div $margin="0 5px 0 0">
                        <P color="grey4" fontSize="sm"> {detail?.association} |</P>
                    </Div>
                    <Div $margin="0 5px 0 0" width="12px">
                        <Img src="/images/calendar_grey.svg" />
                    </Div>
                    <Div>
                        <P color="grey4" fontSize="sm">{detail?.dateContestStart.split('T')[0]} ~ {detail?.dateContestEnd.split('T')[0]}</P>
                    </Div>
                </FlexDiv>
                
                {/* 주제 */}
                <FlexDiv width="100%" $border="2px solid" $borderColor="border" $padding="20px">
                    <Div>
                        {url === 'contest' && (<P fontSize="xl" fontWeight={800}>공모전 주제</P>)}
                        {url === 'activity' && (<P fontSize="xl" fontWeight={800}>대외활동 주제</P>)}
                    </Div>
                </FlexDiv>
                <FlexDiv width="100%" $border="2px solid" $borderColor="border" $padding="50px">
                    <Div>
                        <P fontSize="xl">{detail?.topic}</P>
                    </Div>
                </FlexDiv>

                {/* 사진들 */}
                {detail?.images?.map((image) => (
                    <FlexDiv width="100%" $margin="50px 0">
                        <Div width="60%">
                            <Img src={image.url} />
                        </Div>
                    </FlexDiv>
                ))}

                <Div>
                    <P>{detail?.content}</P>
                </Div>

                {(
                // api에 writerId 포함되면 수정
                // {(detail?.writerId === userId || isAuthorizedOverVice) && (
                    <FlexDiv $margin="50px 0 0 0" width="100%" $justifycontent="end">
                        <Button
                            display="flex"
                            $backgroundColor="bgColor"
                            $margin="0 10px 0 0"
                            $padding="12px 15px"
                            $borderRadius={30}
                            $HBackgroundColor="bgColorHo"
                            onClick={() => navigate(`/board/${url}/update/${boardId}`)}
                        >
                            <Div width="12px" $margin="0 10px 0 0">
                                <Img src="/images/pencil_white.svg" />
                            </Div>
                            <Div $pointer>
                                <P color="wh" fontSize="sm">
                                    게시글 수정
                                </P>
                            </Div>
                        </Button>
                        <Button
                            display="flex"
                            $backgroundColor="red"
                            $padding="12px 15px"
                            $borderRadius={30}
                            $HBackgroundColor="red"
                            onClick={() => deleteDetail()}
                        >
                            <Div width="12px" $margin="0 10px 0 0">
                                <Img src="/images/trash_white.svg" />
                            </Div>
                            <Div $pointer>
                                <P color="wh" fontSize="sm">
                                    게시글 삭제
                                </P>
                            </Div>
                        </Button>
                    </FlexDiv>
                )}
                <Comment boardId={boardId} menuId={menuId} />
                <CommentInput boardId={boardId} menuId={menuId} />
            </Div>
        </>
    )

}

export default ContestDetail;