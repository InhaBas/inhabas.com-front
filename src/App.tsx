import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { ThemeProvider } from "styled-components";

import GlobalStyle from "./styles/Globalstyles";
import { theme } from "./styles/theme";

import { failRefreshing } from "./recoil/frontState";

import Bottom from "./components/common/Bottom";
import MobileBlocker from "./components/common/MobileBlocker";
import { Modal } from "./components/common/modal/Modal";
import ScrollToTop from "./components/common/ScrollToTop";
import NotFound from "./pages/NotFound";
import Login from "./pages/member/Login";
import LoginProcess from "./pages/member/LoginProcess";
import Rule from "./pages/member/Rule";
import Signup from "./pages/member/Signup";
import SignupQuestion from "./pages/member/SignupQuestion";
import HeaderNavLayout from "./layout/HeaderNavLayout";

import { Div } from "./styles/assets/Div";

import "./index.css";

const App = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isNotLogin = useRecoilValue(failRefreshing);
    const url = location.pathname.split("/").slice(1, 3).join("/");
    useEffect(() => {
        if (
            isNotLogin &&
            location.pathname.substring(1) &&
            ![
                "board/opensource",
                "board/sponsor",
                "board/usage",
                "board/contest",
                "board/activity",
                "activity",
                "activity/detail",
                "introduce",
                "scholarship",
                "login",
            ]?.includes(url)
        ) {
            alert("로그인을 해주세요");
            navigate("/");
        }
    }, [location, isNotLogin]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <MobileBlocker />
            <Modal />
            <Div width="100%" height="100vh">
                <ScrollToTop />
                <Routes>
                    {/* HeaderNav가 필요 없는 page 일 경우 여기에 Route 정의  */}
                    <Route path="login" element={<Login />} />
                    <Route path="login/process" element={<LoginProcess />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="signup/question" element={<SignupQuestion />} />
                    <Route path="rule/:id" element={<Rule />} />
                    <Route path="/*" element={<HeaderNavLayout />} />
                    <Route path="notfound" element={<NotFound />} />
                </Routes>
                <Bottom />
            </Div>
        </ThemeProvider>
    );
};

export default App;
