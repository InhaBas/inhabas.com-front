import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import GlobalStyle from "./styles/Globalstyles";
import { theme } from "./styles/theme";

import { Modal } from "./Components/Common/Modal/Modal";
import BoardRoute from "./Routes/BoardRoute";
import LectureRoute from "./Routes/LectureRoute";
import MainRoute from "./Routes/MainRoute";
import { Div } from "./styles/assets/Div";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Modal />
            <Div width="100%">
                <Routes>
                    <Route path="/*" element={<MainRoute />} />
                    <Route path="/board/*" element={<BoardRoute />} />
                    <Route path="/lecture/*" element={<LectureRoute />} />
                </Routes>
                {/* <Bottom /> */}
            </Div>
        </ThemeProvider>
    );
}

export default App;
