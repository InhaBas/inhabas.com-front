import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { ThemeProvider } from "styled-components";

import GlobalStyle from "./styles/Globalstyles";
import { theme } from "./styles/theme";

import { failRefreshing } from "./Recoil/frontState";

import Bottom from "./Components/Common/Bottom";
import { Modal } from "./Components/Common/Modal/Modal";
import ScrollToTop from "./Components/Common/ScrollToTop";
import NotFound from "./Components/Page/Error/NotFound";
import Login from "./Components/Page/Member/Login";
import LoginProcess from "./Components/Page/Member/LoginProcess";
import Rule from "./Components/Page/Member/Rule";
import Signup from "./Components/Page/Member/Signup";
import SignupQuestion from "./Components/Page/Member/SignupQuestion";
import HeaderNavLayout from "./Layout/HeaderNavLayout";

import { Div } from "./styles/assets/Div";

import "./index.css";

const App = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isNotLogin = useRecoilValue(failRefreshing);

    useEffect(() => {
        // 페이지 경로에 따라 로그인 상태를 검사하고 알림을 표시합니다.

        if (
            (isNotLogin && ["/honor"]?.includes(location.pathname)) ||
            (isNotLogin &&
                location.pathname.substring(1) &&
                !["opensource", "sponsor", "usage", "contest", "activity"]?.includes(location.pathname))
        ) {
            alert("로그인을 해주세요");
            navigate("/");
        }
    }, [location, isNotLogin]);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
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
