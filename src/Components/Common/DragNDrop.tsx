import { FlexDiv, InputLabel } from "../../styles/assets/Div"
import Img from "../../styles/assets/Img"
import { Input } from "../../styles/assets/Input"
import P from "../../styles/assets/P"

const DragNDrop = () => {
    return (
        <>
            <Input id="fileAttach" type="file" display="none" multiple />
            <InputLabel
                htmlFor="fileAttach"
                width="100%"
                display="flex"
                height="130px"
                $border="2px dashed"
                $borderColor="border"
                $margin="30px 0"
                direction="column"
                $justifycontent="space-between"
                $pointer
            >
                <FlexDiv width="60px" height="60px" $margin="20px 0 0 0">
                    <Img src="/images/upload_grey.svg" />
                </FlexDiv>
                <FlexDiv $margin="0 0 20px 0">
                    <P>클릭하거나 드래그하여 파일을 업로드하세요</P>
                </FlexDiv>
            </InputLabel>
        </>
    )
}

export default DragNDrop
