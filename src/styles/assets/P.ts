import { styled, DefaultTheme } from "styled-components"

interface Ptyle {
    theme: DefaultTheme
    color?: keyof DefaultTheme["color"]
    fontSize?: keyof DefaultTheme["fontSize"]
    fontWeight?: number
    whiteSpace?: string
    $center?: boolean
    $underline?: boolean
    // [key: string]: any
}

const P = styled.p<Ptyle>`
    width: 100%;
    height: fit-content;
    margin: 0;
    padding: 0;
    font-size: ${(props) => props.theme.fontSize[props.fontSize || "md"]};
    font-weight: ${(props) => props.fontWeight || "500"};
    word-wrap: break-word;
    color: ${(props) => props.theme.color[props.color || "bk"]};
    white-space: ${(props) => props.whiteSpace || "nowrap"};
    overflow: hidden;
    text-overflow: ellipsis;
    ${(props) => props.$center && "text-align: center"};
    ${(props) => props.$underline && "text-decoration-line: underline"};
`

export default P
