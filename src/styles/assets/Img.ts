import styled from "styled-components"

interface ImgStyle {
    $objectFit?: string
    $filter?: string
    $HFilter?: string
}

const Img = styled.img<ImgStyle>`
    height: 100%;
    width: 100%;
    object-fit: ${(props) => props.$objectFit || "fill"};
    filter: ${(props) => props.$filter || "none"};

    &:hover {
        filter: ${(props) => props.$HFilter || "transparent"};
    }
`

export default Img
