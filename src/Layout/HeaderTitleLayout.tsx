import { Route, Routes } from "react-router-dom";
import HeaderTitle from "../Components/Common/HeaderTitle";
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
                </Routes>
            </FlexDiv>
        </>
    );
};

export default HeaderTitlePage;
