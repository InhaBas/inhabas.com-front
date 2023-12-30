import { Route, Routes } from "react-router-dom"
import BoardCreate from "../Components/Page/Board/BoardCreate"
import BoardDetail from "../Components/Page/Board/BoardDetail"
import BoardList from "../Components/Page/Board/BoardList"

const BoardRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<BoardList />} />
            <Route path="detail" element={<BoardDetail />} />
            <Route path="create" element={<BoardCreate />} />
        </Routes>
    )
}

export default BoardRoute
