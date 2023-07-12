import { styled, DefaultTheme } from "styled-components"

interface ButtonStyle {
    theme: DefaultTheme
    width?: string
    height?: string
    margin?: string
    padding?: string
    backgroundColor?: keyof DefaultTheme["color"]
    border?: string
    borderRadius?: number
}

let Button = styled.button<ButtonStyle>`
    width: ${(props) => props.width || "fit-content"};
    height: ${(props) => props.height || "fit-content"};
    margin: ${(props) => props.margin || "0px"};
    padding: ${(props) => props.padding || "0px"};
    background-color: ${(props) => props.theme.color || "inherit"};
    border: ${(props) => props.border || "none"};
    border-radius: ${(props) => `${props.borderRadius}px` || "0"};
    cursor: pointer;
`

export default Button
