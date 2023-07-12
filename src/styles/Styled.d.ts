// import original module declarations
import "styled-components"
import { ColorTypes, FontSizeTypes } from "./theme"

// and extend them!
declare module "styled-components" {
    export interface DefaultTheme {
        color: ColorTypes
        fontSize: FontSizeTypes
    }
}
