import { Route, Routes } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { userRole } from "../Recoil/backState";

import HeaderTitle from "../Components/Common/HeaderTitle";
import MyManageUser from "../Components/Page/IBAS/MyInfo/MyManageUser";
import BoardRoute from "../Routes/BoardRoute";
import LectureRoute from "../Routes/LectureRoute";
import MainRoute from "../Routes/MainRoute";

import MyApplication from "../Components/Page/IBAS/MyInfo/MyApplication";
import MyManageExistUser from "../Components/Page/IBAS/MyInfo/MyManageExistUser";
import MyManageGraduateUser from "../Components/Page/IBAS/MyInfo/MyManageGraduateUser";
import MyManageNewUser from "../Components/Page/IBAS/MyInfo/MyManageNewUser";
import MyStaff from "../Components/Page/IBAS/MyInfo/MyStaff";
import { FlexDiv } from "../styles/assets/Div";

const HeaderTitlePage = () => {
    const role = useRecoilValue(userRole);
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
                    <Route path="staff/member/application/:id" element={<MyApplication />} />
                    <Route path="staff/member/students" element={<MyManageExistUser />} />
                    <Route path="staff/member/graduateStudents" element={<MyManageGraduateUser />} />
                    {(role === "CHIEF" || role === "VICE_CHIEF") && <Route path="staff/manage" element={<MyStaff />} />}
                </Routes>
            </FlexDiv>
        </>
    );
};

export default HeaderTitlePage;
