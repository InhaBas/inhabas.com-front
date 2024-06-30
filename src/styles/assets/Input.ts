import { DefaultTheme, styled } from "styled-components";

interface InputStyle {
    theme: DefaultTheme;
    width?: string;
    height?: string;
    $margin?: string;
    $padding?: string;
    $backgroundColor?: keyof DefaultTheme["color"];
    $border?: string | keyof DefaultTheme["color"];
    $borderColor?: string | keyof DefaultTheme["color"];
    $borderRadius?: number | string;
    textIndent?: string;
    display?: string;
    color?: keyof DefaultTheme["color"];
    fontSize?: keyof DefaultTheme["fontSize"];
    fontWeight?: number;
}

const Input = styled.input<InputStyle>`
    width: ${(props) => props.width || ""};
    height: ${(props) => props.height || ""};
    margin: ${(props) => props.$margin || "0px"};
    padding: ${(props) => props.$padding || "5px 10px"};
    background-color: ${(props) => props.theme.color || "inherit"};
    font-size: ${(props) => props.theme.fontSize[props.fontSize || "md"]};
    color: ${(props) => props.theme.color || props.theme.color};
    border: ${(props) => `${props.$border}` || "none"};
    border-color: ${(props) => props.theme.color[props.color || "border"]};
    border-radius: ${(props) => `${props.$borderRadius}px` || "none"};
    display: ${(props) => props.display || "inline-block"};
    text-indent: ${(props) => props.textIndent || 0};
    &:focus {
        outline: none;
    }
`;

const TextInput = styled(Input).attrs({ type: "text" })<InputStyle>`
    border: 1px solid ${(props) => props.theme.color.grey1};
    border-radius: ${(props) => `${props.$borderRadius}px` || "2px"};
    ::-webkit-input-placeholder {
        color: ${(props) => props.theme.color.textColor};
        font-size: 10px;
    }
    box-sizing: border-box;
    padding: ${(props) => props.$padding || "13px 10px"};
    height: ${(props) => props.height || "40px"};
`;

const NumberInput = styled(TextInput).attrs({ type: "number" })<InputStyle>`
    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    ::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })<InputStyle>`
    appearance: none;
    margin: 0;
    width: 20px;
    height: 20px;
    border: 1px solid ${(props) => props.theme.color.grey3};
    border-radius: 2px;

    &:hover {
        cursor: pointer;
        border: 2px solid ${(props) => props.theme.color.bgColor};
    }

    &:checked {
        background: center url("/images/checkbox_purple.svg") no-repeat;
        border: none;
    }
`;

const Label = styled.label<InputStyle>`
    font-size: ${(props) => props.fontSize || "14px"};
    width: ${(props) => props.width || ""};
    height: ${(props) => props.height || ""};
    margin: ${(props) => props.$margin || ""};
    padding: ${(props) => props.$padding || ""};
    color: ${(props) => props.theme.color[props.color || "bk"]};

    :hover {
        cursor: pointer;
    }
`;

const Radio = styled.input.attrs({ type: "radio" })<InputStyle>`
    appearance: none;
    margin: 0;
    width: 20px;
    height: 20px;
    border: 1px solid ${(props) => props.theme.color.grey3};
    border-radius: 50%;

    &:hover {
        cursor: pointer;
        border: 2px solid ${(props) => props.theme.color.bgColor};
    }

    &:checked {
        background: center url("/images/radio_purple.svg") no-repeat;
        border: none;
    }
`;

const SearchInput = styled(TextInput)`
    padding: 9px 12px;
    width: 165px;

    &:focus {
        outline: none;
    }

    &::placeholder {
        font-size: 13px;
    }
`;

const DateInput = styled.input.attrs({ type: "date" })<InputStyle>`
    width: ${(props) => props.width || "100%"};
    height: ${(props) => props.height || "40px"};
    margin: ${(props) => props.$margin || "0"};
    padding: ${(props) => props.$padding || "13px 10px"};
    border: 1px solid ${(props) => props.theme.color.grey1};
    border-radius: 2px;
    color: ${(props) => props.theme.color[props.color || "bk"]};
`;

const DateTime = styled.input.attrs({ type: "datetime-local" })<InputStyle>`
    width: ${(props) => props.width || "100%"};
    height: ${(props) => props.height || "40px"};
    margin: ${(props) => props.$margin || "0"};
    padding: ${(props) => props.$padding || "13px 10px"};
    border: 1px solid ${(props) => props.theme.color.grey1};
    border-radius: 2px;
    color: ${(props) => props.theme.color[props.color || "bk"]};
`;

const TextArea = styled.textarea<InputStyle>`
    width: ${(props) => props.width || ""};
    height: ${(props) => props.height || ""};
    margin: ${(props) => props.$margin || "0px"};
    padding: ${(props) => props.$padding || "12px 14px 14px"};
    background-color: ${(props) => props.theme.color[props.$backgroundColor || "transparent"]};
    font-size: ${(props) => props.theme.fontSize[props.fontSize || "sm"]};
    color: ${(props) => props.theme.color[props.color || "bk"]};
    border: 1px solid ${(props) => props.theme.color.grey1};
    border-radius: ${(props) => `${props.$borderRadius}px` || "4px"};
    display: ${(props) => props.display || "inline-block"};
    resize: none;
    &:focus {
        outline: none;
    }
    ::-webkit-input-placeholder {
        color: ${(props) => props.theme.color.grey2};
    }
`;

const Select = styled.select<InputStyle>`
    width: ${(props) => props.width || "100%"};
    height: ${(props) => props.height || "40px"};
    margin: ${(props) => props.$margin || "0px"};
    padding: ${(props) => props.$padding || "6px 12px"};
    background-color: ${(props) => props.theme.color[props.$backgroundColor || "transparent"]};
    font-size: ${(props) => props.theme.fontSize[props.fontSize || "sm"]};
    color: ${(props) => props.theme.color[props.color || "bk"]};
    border: 1px solid ${(props) => props.theme.color.grey1};
    border-radius: ${(props) => `${props.$borderRadius}px` || "4px"};
    display: ${(props) => props.display || "inline-block"};
    resize: none;
    cursor: pointer;
    &:focus {
        outline: none;
    }

    &:invalid {
        color: ${(props) => props.theme.color.grey2};
    }
`;

export { Checkbox, DateInput, DateTime, Input, Label, NumberInput, Radio, SearchInput, Select, TextArea, TextInput };
