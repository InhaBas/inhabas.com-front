import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import BoardCreate from "../Components/Page/Board/BoardCreate";
import BoardDetail from "../Components/Page/Board/BoardDetail";
import BoardList from "../Components/Page/Board/BoardList";
import { GetRoleAuthorization } from "../Functions/authFunctions";
import { userRole } from "../Recoil/backState";
import { failRefreshing } from "../Recoil/frontState";
import ContestDetail from "../Components/Page/IBAS/Contest/ContestDetail";
import ContestCreate from "../Components/Page/IBAS/Contest/ContestCreate";

const BoardRoute = () => {
    const navigate = useNavigate();
    const { isAuthorizedOverBasic, isAuthorizedOverSecretary, isAuthorizedOverDeactivate } = GetRoleAuthorization();
    const role = useRecoilValue(userRole);
    const isNotLogin = useRecoilValue(failRefreshing);

    useEffect(() => {
        if (role !== "") {
            if (!isNotLogin && !isAuthorizedOverBasic && !isAuthorizedOverSecretary && !isAuthorizedOverDeactivate) {
                alert("권한이 없습니다");
                setTimeout(() => {
                    navigate(-1); // 이전 페이지로 돌아감
                }, 0);
            }
        }
    }, [role]);

    return (
        <Routes>
            {isAuthorizedOverDeactivate && (
                <>
                    <Route path="notice" element={<BoardList />} />
                    <Route path="notice/detail/:id" element={<BoardDetail />} />

                    <Route path="free" element={<BoardList />} />
                    <Route path="free/detail/:id" element={<BoardDetail />} />
                    <Route path="free/create" element={<BoardCreate />} />
                    <Route path="free/update/:id" element={<BoardCreate />} />

                    <Route path="question" element={<BoardList />} />
                    <Route path="question/detail/:id" element={<BoardDetail />} />
                    <Route path="question/create" element={<BoardCreate />} />
                    <Route path="question/update/:id" element={<BoardCreate />} />

                    <Route path="suggest" element={<BoardList />} />
                    <Route path="suggest/detail/:id" element={<BoardDetail />} />
                    <Route path="suggest/create" element={<BoardCreate />} />
                    <Route path="suggest/update/:id" element={<BoardCreate />} />

                    <Route path="alpha" element={<BoardList />} />
                    <Route path="alpha/detail/:id" element={<BoardDetail />} />

                    <Route path="beta" element={<BoardList />} />
                    <Route path="beta/detail/:id" element={<BoardDetail />} />

                    <Route path="opensource/create" element={<BoardCreate />} />
                    <Route path="opensource/update/:id" element={<BoardCreate />} />
                </>
            )}

            {isAuthorizedOverBasic && (
                <>
                    <Route path="alpha/create" element={<BoardCreate />} />
                    <Route path="alpha/update/:id" element={<BoardCreate />} />

                    <Route path="beta/create" element={<BoardCreate />} />
                    <Route path="beta/update/:id" element={<BoardCreate />} />
                </>
            )}

            {isAuthorizedOverSecretary && (
                <>
                    <Route path="notice/create" element={<BoardCreate />} />
                    <Route path="notice/update/:id" element={<BoardCreate />} />

                    <Route path="executive" element={<BoardList />} />
                    <Route path="executive/detail/:id" element={<BoardDetail />} />
                    <Route path="executive/create" element={<BoardCreate />} />
                    <Route path="executive/update/:id" element={<BoardCreate />} />
                </>
            )}

            <Route path="opensource" element={<BoardList />} />
            <Route path="opensource/detail/:id" element={<BoardDetail />} />

            <Route path="sponsor" element={<BoardList />} />
            <Route path="sponsor/detail/:id" element={<BoardDetail />} />
            <Route path="sponsor/create" element={<BoardCreate />} />
            <Route path="sponsor/update/:id" element={<BoardCreate />} />

            <Route path="usage" element={<BoardList />} />
            <Route path="usage/detail/:id" element={<BoardDetail />} />
            <Route path="usage/create" element={<BoardCreate />} />
            <Route path="usage/update/:id" element={<BoardCreate />} />
            
            <Route path="contest" element={<BoardList />} />
            <Route path="contest/detail/:id" element={<ContestDetail />} />
            <Route path="contest/create" element={<ContestCreate />} />
            <Route path="contest/update/:id" element={<ContestCreate />} />
            
            <Route path="activity" element={<BoardList />} />
            <Route path="activity/detail/:id" element={<ContestDetail />} />
            <Route path="activity/create" element={<ContestCreate />} />
            <Route path="activity/update/:id" element={<ContestCreate />} />
        </Routes>
    );
};

export default BoardRoute;
