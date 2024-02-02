import { Route, Routes } from "react-router-dom";
import HeaderTitle from "../Components/Common/HeaderTitle";
import MyManageUser from "../Components/Page/IBAS/MyInfo/MyManageUser";
import BoardRoute from "../Routes/BoardRoute";
import LectureRoute from "../Routes/LectureRoute";
import MainRoute from "../Routes/MainRoute";

import MyManageNewUser from "../Components/Page/IBAS/MyInfo/MyManageNewUser";
import { FlexDiv } from "../styles/assets/Div";

const HeaderTitlePage = () => {
    return (
        <>
            <HeaderTitle />
            <FlexDiv width="100%">
                <Routes>
                    <Route path="/*" element={<MainRoute />} />
                    <Route path="/board/*" element={<BoardRoute />} />
                    <Route path="/lecture/*" element={<LectureRoute />} />

                    <Route path="staff/member" element={<MyManageUser />} />
                    <Route path="staff/member/newStudents" element={<MyManageNewUser />} />
                </Routes>
            </FlexDiv>
        </>
    );
};

export default HeaderTitlePage;
