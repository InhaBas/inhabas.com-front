import { useState } from "react";
import { styled } from "styled-components";
import { Div, FlexDiv } from "../../styles/assets/Div";
import Img from "../../styles/assets/Img";
import P from "../../styles/assets/P";

const DropDownList = styled("ul")`
    width: 100%;
    padding: 0;
    margin: 0;
    background: ${(props) => props.theme.color.wh};
    box-sizing: border-box;
    box-shadow: 0px 20px 50px 0 rgba(0, 0, 0, 0.2);

    font-size: ${(props) => props.theme.fontSize.sm};
    font-weight: 500;
    &:first-child {
        padding-top: 0.8em;
    }
`;

const ListItem = styled("li")`
    list-style: none;
    margin-bottom: 0.8em;
    padding: 10px 20px;
    cursor: pointer;
    &:hover {
        background: ${(props) => props.theme.color.bgColor};
        color: ${(props) => props.theme.color.wh};
    }
`;

/*
    label: 선택되기 전 렌더링되는 문구
    options: 선택값들
    value: back에 보내줄 data (선택사항)
    onChange: 부모 컴포넌트가 선택된 값들을 알수 있게 하는 함수

*/
const Dropdown = ({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: string[];
    value?: string[];
    onChange: (value: string) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");

    const toggling = () => setIsOpen(!isOpen);

    const onOptionClicked = (option: string, value?: string) => () => {
        setSelectedOption(option);

        if (value !== undefined) {
            onChange(value);
        }

        setIsOpen(false);
    };

    return (
        <Div width="100%" $position="relative">
            <FlexDiv
                onClick={toggling}
                width="100%"
                height="40px"
                $justifycontent="space-between"
                $padding="6px 12px"
                radius={3}
                $border="1px solid"
                $borderColor="grey1"
                $pointer
            >
                <FlexDiv>
                    <P fontSize="sm">{selectedOption || label}</P>
                </FlexDiv>
                <FlexDiv width="10px">
                    <Img src="/images/chevron-down_grey.svg" />
                </FlexDiv>
            </FlexDiv>
            {isOpen && (
                <FlexDiv $zIndex={3} width="100%" $position="absolute">
                    <DropDownList>
                        {options.map((option, idx) => (
                            <ListItem
                                onClick={onOptionClicked(option, value !== undefined ? value[idx] : "")}
                                key={Math.random()}
                            >
                                {option}
                            </ListItem>
                        ))}
                    </DropDownList>
                </FlexDiv>
            )}
        </Div>
    );
};

export default Dropdown;
