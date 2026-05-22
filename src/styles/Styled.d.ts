// import original module declarations
import "styled-components"
import { ColorTypes, FontSizeTypes, BreakpointTypes, MediaTypes } from "./theme"

// and extend them!
declare module "styled-components" {
    export interface DefaultTheme {
        color: ColorTypes
        fontSize: FontSizeTypes
        breakpoints: BreakpointTypes
        media: MediaTypes
    }
}
