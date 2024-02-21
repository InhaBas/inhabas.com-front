import styled from "styled-components";
import { DefaultTheme } from "styled-components/dist/types";

interface DivStyle {
    theme: DefaultTheme;
    width?: string;
    height?: string;
    flex?: string;
    $margin?: string;
    $padding?: string;
    $backgroundColor?: keyof DefaultTheme["color"];
    $zIndex?: number;
    $border?: string;
    $borderColor?: keyof DefaultTheme["color"];
    $borderT?: string;
    $borderB?: string;
    $borderR?: string;
    $borderL?: string;
    radius?: number;
    display?: string;
    $alignitems?: string;
    $justifycontent?: string;
    direction?: string;
    wrap?: string;
    $pointer?: boolean;
    $minHeight?: string;
    $maxHeight?: string;
    $minWidth?: string;
    $maxWidth?: string;
    overflow?: string;
    $position?: string;
    $top?: string;
    $bottom?: string;
    $left?: string;
    $right?: string;
    $HFilter?: string;
    $verticalAlign?: string;
    $whiteSpace?: string;
    fontSize?: keyof DefaultTheme["fontSize"];
    color?: keyof DefaultTheme["color"];
}

const Div = styled.div<DivStyle>`
    width: ${(props) => props.width || "fit-content"};
    height: ${(props) => props.height || "fit-content"};
    margin: ${(props) => props.$margin || "0px"};
    padding: ${(props) => props.$padding || "0px"};
    background-color: ${(props) => props.theme.color[props.$backgroundColor || "transparent"]};
    z-index: ${(props) => props.$zIndex || "auto"};
    border: ${(props) => props.$border || "none"};
    border-color: ${(props) => props.theme.color[props.$borderColor || "transparent"]};
    border-top: ${(props) => props.$borderT || ""};
    border-bottom: ${(props) => props.$borderB || ""};
    border-right: ${(props) => props.$borderR || ""};
    border-left: ${(props) => props.$borderL || ""};
    border-radius: ${(props) => `${props.radius}px` || "none"};
    border-collapse: collapse;
    display: ${(props) => props.display || "block"};
    ${(props) => props.$pointer && "cursor:pointer;"};
    min-height: ${(props) => props.$minHeight || ""};
    max-height: ${(props) => props.$maxHeight || ""};
    min-width: ${(props) => props.$minWidth || ""};
    max-width: ${(props) => props.$maxWidth || ""};
    overflow: ${(props) => props.overflow || "visible"};
    position: ${(props) => props.$position || "static"};
    top: ${(props) => props.$top || ""};
    bottom: ${(props) => props.$bottom || ""};
    left: ${(props) => props.$left || ""};
    right: ${(props) => props.$right || ""};
    vertical-align: ${(props) => props.$verticalAlign || ""};
    white-space: ${(props) => props.$whiteSpace || "nowrap"};

    &: {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
    }
    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera*/
    }

    transition: background-color 0.2s;

    &:hover {
        filter: ${(props) => props.$HFilter || "transparent"};
    }
`;

const FlexDiv = styled(Div)<DivStyle>`
    display: flex;
    align-items: ${(props) => props.$alignitems || "center"};
    justify-content: ${(props) => props.$justifycontent || "center"};
    flex-direction: ${(props) => props.direction || "row"};
    flex-wrap: ${(props) => props.wrap || "wrap"};
`;

const Container = styled(FlexDiv)`
    width: 80%;
    max-width: 80%;
    padding: 5% 0;
`;

const DetailContainer = styled(Div)`
    width: 800px;
    max-width: 800px;
    padding: 5% 0;
`;

const InputLabel = styled.label<DivStyle>`
    width: ${(props) => props.width || "fit-content"};
    height: ${(props) => props.height || "fit-content"};
    display: ${(props) => props.display || "block"};
    align-items: ${(props) => props.$alignitems || "center"};
    justify-content: ${(props) => props.$justifycontent || "center"};
    flex-direction: ${(props) => props.direction || "row"};
    flex-wrap: ${(props) => props.wrap || "wrap"};
    margin: ${(props) => props.$margin || "0px"};
    padding: ${(props) => props.$padding || "0px"};
    background-color: ${(props) => props.theme.color[props.$backgroundColor || "transparent"]};
    z-index: ${(props) => props.$zIndex || "auto"};
    border: ${(props) => props.$border || "none"};
    border-color: ${(props) => props.theme.color[props.$borderColor || "transparent"]};
    border-top: ${(props) => props.$borderT || ""};
    border-bottom: ${(props) => props.$borderB || ""};
    border-right: ${(props) => props.$borderR || ""};
    border-left: ${(props) => props.$borderL || ""};
    border-radius: ${(props) => `${props.radius}px` || "none"};
    border-collapse: collapse;
    display: ${(props) => props.display || "block"};
    ${(props) => props.$pointer && "cursor:pointer;"};
    min-height: ${(props) => props.$minHeight || ""};
    min-width: ${(props) => props.$minWidth || ""};
    overflow: ${(props) => props.overflow || "visible"};
`;

export { Container, DetailContainer, Div, FlexDiv, InputLabel };
