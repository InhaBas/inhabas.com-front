import { Route, Routes } from "react-router-dom"
import LectureCreate from "../Components/Page/Lecture/LectureCreate"
import LectureDetail from "../Components/Page/Lecture/LectureDetail"
import LectureList from "../Components/Page/Lecture/LectureList"
import RoomAnnounce from "../Components/Page/Lecture/Room/RoomAnnounce"
import RoomCreate from "../Components/Page/Lecture/Room/RoomCreate"
import RoomDetail from "../Components/Page/Lecture/Room/RoomDetail"
import RoomList from "../Components/Page/Lecture/Room/RoomList"

const LectureRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<LectureList />} />
            <Route path="detail" element={<LectureDetail />} />
            <Route path="create" element={<LectureCreate />} />
            <Route path="/room" element={<RoomList />} />
            <Route path="/room/announce" element={<RoomAnnounce />} />
            <Route path="/room/detail" element={<RoomDetail />} />
            <Route path="/room/create" element={<RoomCreate />} />
        </Routes>
    )
}

export default LectureRoute
