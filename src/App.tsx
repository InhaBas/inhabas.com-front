import React from "react"
import { ThemeProvider } from "styled-components"

import { theme } from "./styles/theme"
import GlobalStyle from "./styles/Globalstyles"

import P from "./styles/assets/P"

function App() {
    return (
        // <div className="App">
        //   <header className="App-header">
        //     <img src={logo} className="App-logo" alt="logo" />
        //     <p>
        //       Edit <code>src/App.tsx</code> and save to reload.
        //     </p>
        //     <a
        //       className="App-link"
        //       href="https://reactjs.org"
        //       target="_blank"
        //       rel="noopener noreferrer"
        //     >
        //       Learn React
        //     </a>
        //   </header>
        // </div>
        <ThemeProvider theme={theme}>
            <GlobalStyle />
            <P color="orange" $underline $center>
                ㅎㅇㅎㅇ
            </P>
        </ThemeProvider>
    )
}

export default App
