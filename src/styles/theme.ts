import { DefaultTheme } from "styled-components"

const color = {
    orange: "#FF5C00", // 주 색상
    orange1: "#FE7E48",
    orange2: "rgba(255, 92, 0, 0.1)",
    bk: "#242230",
    wh: "#FFFFFF",
    grey: "#EFEFEF",
    grey1: "#DBDBDB",
    grey2: "#A5A4A8",
    grey3: "#7F8193",
    grey4: "#585469",
    grey6: "#363342",
    transparent: "transparent",
}

const fontSize = {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    xxl: "22px",
    xxxl: "28px",
}

export type ColorTypes = typeof color
export type FontSizeTypes = typeof fontSize

export const theme: DefaultTheme = {
    color,
    fontSize,
}

// const theme: DefaultTheme = {}

// export default theme
