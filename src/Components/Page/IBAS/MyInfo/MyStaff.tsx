import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

import { headerTitleInfo } from "../../../../Recoil/backState";

import { Container, FlexDiv } from "../../../../styles/assets/Div";
import MyStaffRuleContainer from "../../../Container/MyInfo/MyStaffRuleContainter";
import MyStaffScheduleInfo from "../../../Container/MyInfo/MyStaffScheduleInfo";

const MyStaff = () => {
    const setTitle = useSetRecoilState(headerTitleInfo);

    useEffect(() => {
        setTitle({
            name: "관리자 페이지",
            description: "홈페이지 설정을 수정할 수 있습니다.",
        });

        return () =>
            setTitle({
                name: "",
                description: "",
            });
    }, []);

    return (
        <FlexDiv width="100%">
            <Container>
                <MyStaffScheduleInfo />
                <MyStaffRuleContainer />
            </Container>
        </FlexDiv>
    );
};

export default MyStaff;
