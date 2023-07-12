import { styled, DefaultTheme } from "styled-components"

interface InputStyle {
    theme: DefaultTheme
    width?: string
    height?: string
    margin?: string
    padding?: string
    backgroundColor?: keyof DefaultTheme["color"]
    border?: string
    borderRadius?: number
    textIndent?: string
    display?: string
    color?: keyof DefaultTheme["color"]
    fontSize?: keyof DefaultTheme["fontSize"]
    fontWeight?: number
}

const Input = styled.input<InputStyle>`
    width: ${(props) => props.width || ""};
    height: ${(props) => props.height || ""};
    margin: ${(props) => props.margin || "0px"};
    padding: ${(props) => props.padding || "5px 10px"};
    background-color: ${(props) => props.theme.color || "inherit"};
    font-size: ${(props) => props.theme.fontSize[props.fontSize || "md"]};
    color: ${(props) => props.theme.color || props.theme.color};
    border: ${(props) => props.border || "none"};
    border-radius: ${(props) => `${props.borderRadius}px` || "none"};
    display: ${(props) => props.display || "inline-block"};
    text-indent: ${(props) => props.textIndent || 0};
    &:focus {
        outline: none;
    }
`

const TextInput = styled(Input).attrs({ type: "text" })<InputStyle>`
    border: 1px solid ${(props) => props.theme.color.grey1};
    border-radius: 4px;
    ::-webkit-input-placeholder {
        color: ${(props) => props.theme.color.grey2};
    }
    box-sizing: border-box;
    padding: ${(props) => props.padding || "13px 10px"};
    height: ${(props) => props.height || "40px"};
`

const NumberInput = styled(TextInput).attrs({ type: "number" })<InputStyle>`
    ::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    ::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
`

const Checkbox = styled.input.attrs({ type: "checkbox" })<InputStyle>`
    appearance: none;
    margin: 0;
    width: 18px;
    height: 18px;
    border: 1.5px solid ${(props) => props.theme.color.grey3};
    border-radius: 4px;

    :hover {
        cursor: pointer;
    }

    :checked {
        background: center url("/images/checkbox_img.svg") no-repeat;
        border: none;
    }
`

const Label = styled.label<InputStyle>`
    font-size: ${(props) => props.fontSize || "14px"};
    width: ${(props) => props.width || ""};
    height: ${(props) => props.height || ""};
    margin: ${(props) => props.margin || ""};
    padding: ${(props) => props.padding || ""};
    color: ${(props) => props.theme.color[props.color || "bk"]};

    :hover {
        cursor: pointer;
    }
`

const Radio = styled.input.attrs({ type: "radio" })<InputStyle>`
    appearance: none;
    margin: 0 8px 0 0;
    width: ${(props) => props.width || "18px"};
    height: ${(props) => props.height || "18px"};
    border: 1.5px solid ${(props) => props.theme.color.grey3};
    border-radius: 50%;

    :hover {
        cursor: pointer;
    }

    :checked {
        background: center url("/images/radio_img.svg") no-repeat;
        border: none;
        background-size: cover;
    }
`

const Date = styled.input.attrs({ type: "date" })<InputStyle>`
    font-size: 14px;
    width: ${(props) => props.width || ""};
    height: ${(props) => props.height || ""};
    margin: ${(props) => props.margin || ""};
    padding: ${(props) => props.padding || ""};
    border: 1px solid ${(props) => props.theme.color.grey1};
    color: ${(props) => props.theme.color[props.color || "bk"]};
`

const TextArea = styled.textarea<InputStyle>`
    width: ${(props) => props.width || ""};
    height: ${(props) => props.height || ""};
    margin: ${(props) => props.margin || "0px"};
    padding: ${(props) => props.padding || "12px 14px 14px"};
    background-color: ${(props) => props.theme.color[props.backgroundColor || "transparent"]};
    font-size: ${(props) => props.theme.fontSize[props.fontSize || "sm"]};
    color: ${(props) => props.theme.color[props.color || "bk"]};
    border: 1px solid ${(props) => props.theme.color.grey1};
    border-radius: ${(props) => props.borderRadius || "4px"};
    display: ${(props) => props.display || "inline-block"};
    resize: none;
    &:focus {
        outline: none;
    }
    ::-webkit-input-placeholder {
        color: ${(props) => props.theme.color.grey2};
    }
`

const Select = styled.select<InputStyle>`
    border: 1px solid ${(props) => props.theme.color.grey1};
    border-radius: 4px;
    box-sizing: border-box;
    padding: 0 6px;
    height: 40px;
    width: 100%;
    border-radius: 4px;
    font-size: 14px;

    &:focus {
        outline: none;
    }

    &:invalid {
        color: ${(props) => props.theme.color.grey2};
    }
`

export { Input, TextArea, Radio, Label, Checkbox, TextInput, NumberInput, Select, Date }
