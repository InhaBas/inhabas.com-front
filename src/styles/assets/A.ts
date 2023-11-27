import { DefaultTheme, styled } from "styled-components"

interface Astyle {
    theme: DefaultTheme
    color?: keyof DefaultTheme["color"]
    $hoverColor?: keyof DefaultTheme["color"]
    fontSize?: keyof DefaultTheme["fontSize"]
    fontWeight?: number
    whiteSpace?: string
    $center?: boolean
    underline?: string
}

let A = styled.a<Astyle>`
    width: 100%;
    height: fit-content;
    margin: 0;
    padding: 0;
    font-size: ${(props) => props.theme.fontSize[props.fontSize || "md"]};
    font-weight: ${(props) => props.fontWeight || "500"};
    word-wrap: break-word;
    color: ${(props) => props.theme.color[props.color || "bk"]};
    overflow: hidden;
    text-overflow: ellipsis;
    ${(props) => props.$center && "text-align: center"};
    text-decoration-line: ${(props) => props.underline || "none"};

    &:hover {
        color: ${(props) => props.theme.color[props.$hoverColor || "bk"]};
    }
`

export default A
