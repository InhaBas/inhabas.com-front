import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import GlobalStyle from "./styles/Globalstyles";
import { theme } from "./styles/theme";

import BoardRoute from "./Routes/BoardRoute";
import LectureRoute from "./Routes/LectureRoute";
import MainRoute from "./Routes/MainRoute";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle />

            <Routes>
                <Route path="/*" element={<MainRoute />} />
                <Route path="/board/*" element={<BoardRoute />} />
                <Route path="/lecture/*" element={<LectureRoute />} />
            </Routes>
            {/* <Bottom /> */}
        </ThemeProvider>
    );
}

export default App;
