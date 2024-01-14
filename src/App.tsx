import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import GlobalStyle from "./styles/Globalstyles";
import { theme } from "./styles/theme";

import Carousel from "./Components/Common/Carousel";
import { Modal } from "./Components/Common/Modal/Modal";
import Login from "./Components/Page/Member/Login";
import LoginProcess from "./Components/Page/Member/LoginProcess";
import Rule from "./Components/Page/Member/Rule";
import Signup from "./Components/Page/Member/Signup";
import SignupQuestion from "./Components/Page/Member/SignupQuestion";
import HeaderNavLayout from "./Layout/HeaderNavLayout";

import Bottom from "./Components/Common/Bottom";
import { Div } from "./styles/assets/Div";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Modal />
            <Div width="100%">
                <Routes>
                    {/* HeaderNav가 필요 없는 page 일 경우 여기에 Route 정의  */}
                    <Route path="slide" element={<Carousel />} />
                    <Route path="login" element={<Login />} />
                    <Route path="login/process" element={<LoginProcess />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="signup/question" element={<SignupQuestion />} />
                    <Route path="rule" element={<Rule />} />

                    <Route path="/*" element={<HeaderNavLayout />} />
                </Routes>
                <Bottom />
            </Div>
        </ThemeProvider>
    );
}

export default App;
