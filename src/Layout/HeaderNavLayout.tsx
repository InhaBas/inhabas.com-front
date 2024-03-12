import { Route, Routes } from "react-router-dom";
import HeaderNav from "../Components/Common/HeaderNav";
import Honor from "../Components/Page/IBAS/Honor";
import Introduce from "../Components/Page/IBAS/Introduce";
import Main from "../Components/Page/IBAS/Main";
import MyInfo from "../Components/Page/IBAS/MyInfo/MyInfo";
import Scholarship from "../Components/Page/IBAS/Scholarship/Scholarship";
import { Div } from "../styles/assets/Div";
import HeaderTitleLayout from "./HeaderTitleLayout";

const HeaderNavPage = () => {
    return (
        <Div width="100%" $position="relative">
            <HeaderNav />
            <Routes>
                {/* header nav만 필요한 ui 는 여기 따로 route를 정의해둔다 */}
                <Route path="/" element={<Main />} />
                <Route path="introduce" element={<Introduce />} />
                <Route path="honor" element={<Honor />} />

                <Route path="myInfo" element={<MyInfo />} />

                <Route path="scholarship" element={<Scholarship />} />

                <Route path="/*" element={<HeaderTitleLayout />} />
            </Routes>
            {/* </Div> */}
        </Div>
    );
};

export default HeaderNavPage;
