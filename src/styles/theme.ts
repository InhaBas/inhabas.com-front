import { DefaultTheme } from "styled-components"

const color = {
    bk: "#242230",
    wh: "#FFFFFF",
    red: "#f56642",
    blue: "#007bff",
    grey: "#4b4d56",
    grey1: "#DBDBDB",
    grey2: "#A5A4A8",
    grey3: "#7F8193",
    grey4: "#7886a0",
    green: "#d4edda",
    TextGreen: "#155724",
    tabelHo: "#ededed",
    transparent: "transparent",
    bklayer: "rgba(0, 0, 0, 0.4)",
    whlayer: "rgba(255, 255, 255, 0.1)",
    border: "#ecebf5",
    tableBorder: "#dee2e6",
    textColor: "#4611a7",
    bgColor: "#4611a7",
    bgColorHo: "#7133e2",
    none: "rgba(0, 0, 0, 0.1)",
}

const fontSize = {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
    xxl: "28px",
    xxxl: "50px",
    extraBig: "80pt",
    extraBig1: "60pt",
}

export type ColorTypes = typeof color
export type FontSizeTypes = typeof fontSize

export const theme: DefaultTheme = {
    color,
    fontSize,
}

// const theme: DefaultTheme = {}

// export default theme
