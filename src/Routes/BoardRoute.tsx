import { Route, Routes } from "react-router-dom";
import BoardCreate from "../Components/Page/Board/BoardCreate";
import BoardDetail from "../Components/Page/Board/BoardDetail";
import BoardList from "../Components/Page/Board/BoardList";

const BoardRoute = () => {
    return (
        <Routes>
            <Route path="notice" element={<BoardList />} />
            <Route path="notice/detail/:id" element={<BoardDetail />} />
            <Route path="notice/create" element={<BoardCreate />} />

            <Route path="free" element={<BoardList />} />
            <Route path="free/detail/:id" element={<BoardDetail />} />
            <Route path="free/create" element={<BoardCreate />} />

            <Route path="question" element={<BoardList />} />
            <Route path="question/detail/:id" element={<BoardDetail />} />
            <Route path="question/create" element={<BoardCreate />} />

            <Route path="suggest" element={<BoardList />} />
            <Route path="suggest/detail/:id" element={<BoardDetail />} />
            <Route path="suggest/create" element={<BoardCreate />} />

            <Route path="opensource" element={<BoardList />} />
            <Route path="opensource/detail/:id" element={<BoardDetail />} />
            <Route path="opensource/create" element={<BoardCreate />} />

            <Route path="executives" element={<BoardList />} />
            <Route path="executives/detail/:id" element={<BoardDetail />} />
            <Route path="executives/create" element={<BoardCreate />} />

            <Route path="alpha" element={<BoardList />} />
            <Route path="alpha/detail/:id" element={<BoardDetail />} />
            <Route path="alpha/create" element={<BoardCreate />} />

            <Route path="beta" element={<BoardList />} />
            <Route path="beta/detail/:id" element={<BoardDetail />} />
            <Route path="beta/create" element={<BoardCreate />} />
        </Routes>
    );
};

export default BoardRoute;
