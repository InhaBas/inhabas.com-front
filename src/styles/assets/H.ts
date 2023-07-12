import { styled, DefaultTheme } from "styled-components"

interface Hstyle {
    theme: DefaultTheme
    color?: keyof DefaultTheme["color"]
    fontSize?: keyof DefaultTheme["fontSize"]
    fontWeight?: number
}

const H1 = styled.h1<Hstyle>`
    width: 100%;
    height: fit-content;
    margin: 0;
    padding: 0;
    font-size: ${(props) => props.theme.fontSize || props.theme.fontSize};
    font-weight: ${(props) => props.fontWeight || "700"};
    color: ${(props) => props.theme.color || props.theme.color};
`

const H2 = styled.h2<Hstyle>`
    width: 100%;
    height: fit-content;
    margin: 0;
    padding: 0;
    font-size: ${(props) => props.theme.fontSize || props.theme.fontSize};
    font-weight: ${(props) => props.fontWeight || "500"};
    color: ${(props) => props.theme.color || props.theme.color};
`

export { H1, H2 }
