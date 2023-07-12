import styled from "styled-components"
import { DefaultTheme } from "styled-components/dist/types"

interface DivStyle {
    theme: DefaultTheme
    width?: string
    height?: string
    margin?: string
    padding?: string
    backgroundColor?: keyof DefaultTheme["color"]
    zIndex?: number
    border?: string
    borderTop?: string
    borderBottom?: string
    borderRight?: string
    borderLeft?: string
    borderRadius?: number
    display?: string
    alignItems?: string
    justifyContent?: string
    direction?: string
    wrap?: string
    $pointer?: boolean
    minHeight?: string
    minWidth?: string
    overflow?: string
}

const Div = styled.div<DivStyle>`
    width: ${(props) => props.width || "fit-content"};
    height: ${(props) => props.height || "fit-content"};
    margin: ${(props) => props.margin || "0px"};
    padding: ${(props) => props.padding || "0px"};
    background-color: ${(props) => props.theme.color[props.backgroundColor || "transparent"]};
    z-index: ${(props) => props.zIndex || "auto"};
    border: ${(props) => props.border || "none"};
    border-top: ${(props) => props.borderTop || ""};
    border-bottom: ${(props) => props.borderBottom || ""};
    border-right: ${(props) => props.borderRight || ""};
    border-left: ${(props) => props.borderLeft || ""};
    border-radius: ${(props) => `${props.borderRadius}px` || "none"};
    border-collapse: collapse;
    display: ${(props) => props.display || "block"};
    align-items: ${(props) => props.alignItems || "center"};
    justify-content: ${(props) => props.justifyContent || "center"};
    ${(props) => props.$pointer && "cursor:pointer;"};
    min-height: ${(props) => props.minHeight || ""};
    min-width: ${(props) => props.minWidth || ""};
    overflow: ${(props) => props.overflow || "visible"};
`

const FlexDiv = styled(Div)<DivStyle>`
    display: flex;
    flex-direction: ${(props) => props.direction || "row"};
    flex-wrap: ${(props) => props.wrap || "wrap"};
`

export { Div, FlexDiv }
