import { Route, Routes } from "react-router-dom";
import HeaderTitle from "../Components/Common/HeaderTitle";
import BoardRoute from "../Routes/BoardRoute";
import LectureRoute from "../Routes/LectureRoute";
import MainRoute from "../Routes/MainRoute";

const HeaderTitlePage = () => {
    return (
        <>
            <HeaderTitle />
            <Routes>
                <Route path="/*" element={<MainRoute />} />
                <Route path="/board/*" element={<BoardRoute />} />
                <Route path="/lecture/*" element={<LectureRoute />} />
            </Routes>
        </>
    );
};

export default HeaderTitlePage;
