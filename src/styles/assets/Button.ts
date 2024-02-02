import { DefaultTheme, styled } from "styled-components";

interface ButtonStyle {
    theme: DefaultTheme;
    width?: string;
    height?: string;
    $margin?: string;
    $padding?: string;
    $backgroundColor?: keyof DefaultTheme["color"];
    $HBackgroundColor?: keyof DefaultTheme["color"];
    border?: string;
    $borderRadius?: number | string;
    display?: string;
}

let Button = styled.button<ButtonStyle>`
    width: ${(props) => props.width || "fit-content"};
    height: ${(props) => props.height || "fit-content"};
    margin: ${(props) => props.$margin || "0px"};
    padding: ${(props) => props.$padding || "0px"};
    display: ${(props) => props.display || "block"};
    background-color: ${(props) => props.theme.color[props.$backgroundColor || "transparent"]};
    border: ${(props) => props.border || "none"};
    border-radius: ${(props) => `${props.$borderRadius}px` || "0"};
    cursor: pointer;

    &:hover {
        background-color: ${(props) => props.theme.color[props.$HBackgroundColor || "transparent"]};
    }
`;

export default Button;
