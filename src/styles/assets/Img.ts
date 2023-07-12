import styled from "styled-components"

interface ImgStyle {
    objectFit?: string
}

const Img = styled.img<ImgStyle>`
    height: 100%;
    object-fit: ${(props) => props.objectFit || "fill"};
`

export default Img
