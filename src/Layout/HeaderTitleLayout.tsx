import { Route, Routes } from "react-router-dom";

import { isAuthorizedOverSecretary, isAuthorizedOverVice } from "../Functions/authFunctions";

import HeaderTitle from "../Components/Common/HeaderTitle";
import MyApplication from "../Components/Page/IBAS/MyInfo/MyApplication";
import MyManageExistUser from "../Components/Page/IBAS/MyInfo/MyManageExistUser";
import MyManageGraduateUser from "../Components/Page/IBAS/MyInfo/MyManageGraduateUser";
import MyManageNewUser from "../Components/Page/IBAS/MyInfo/MyManageNewUser";
import MyManageUser from "../Components/Page/IBAS/MyInfo/MyManageUser";
import MyStaff from "../Components/Page/IBAS/MyInfo/MyStaff";
import BoardRoute from "../Routes/BoardRoute";
import LectureRoute from "../Routes/LectureRoute";
import MainRoute from "../Routes/MainRoute";

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
                    {isAuthorizedOverSecretary && (
                        <>
                            <Route path="staff/member" element={<MyManageUser />} />
                            <Route path="staff/member/newStudents" element={<MyManageNewUser />} />
                            <Route path="staff/member/application/:id" element={<MyApplication />} />
                            <Route path="staff/member/students" element={<MyManageExistUser />} />
                            <Route path="staff/member/graduateStudents" element={<MyManageGraduateUser />} />
                        </>
                    )}

                    {isAuthorizedOverVice && (
                        <>
                            <Route path="staff/manage" element={<MyStaff />} />
                        </>
                    )}
                </Routes>
            </FlexDiv>
        </>
    );
};

export default HeaderTitlePage;
