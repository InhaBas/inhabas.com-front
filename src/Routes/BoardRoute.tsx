import { Route, Routes, useNavigate } from "react-router-dom";
import BoardCreate from "../Components/Page/Board/BoardCreate";
import BoardDetail from "../Components/Page/Board/BoardDetail";
import BoardList from "../Components/Page/Board/BoardList";
import { GetRoleAuthorization } from "../Functions/authFunctions";

const BoardRoute = () => {
    const navigate = useNavigate();
    const { isAuthorizedOverBasic, isAuthorizedOverSecretary, isAuthorizedOverDeactivate } = GetRoleAuthorization();
    if (!isAuthorizedOverBasic && !isAuthorizedOverSecretary && !isAuthorizedOverDeactivate) {
        alert("권한이 없습니다");
        setTimeout(() => {
            navigate(-1); // 이전 페이지로 돌아감
        }, 0);
    }

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

            <Route path="scholarship-sponsor" element={<BoardList />} />
            <Route path="scholarship-sponsor/detail/:id" element={<BoardDetail />} />
            <Route path="scholarship-sponsor/create" element={<BoardCreate />} />

            <Route path="scholarchip-usage" element={<BoardList />} />
            <Route path="scholarship-usage/detail/:id" element={<BoardDetail />} />
            <Route path="scholarship-usage/create" element={<BoardCreate />} />
        </Routes>
    );
};

export default BoardRoute;
