import { DefaultTheme, styled } from 'styled-components';

interface ButtonStyle {
  theme: DefaultTheme;
  width?: string;
  height?: string;
  $margin?: string;
  $padding?: string;
  $backgroundColor?: keyof DefaultTheme['color'];
  $HBackgroundColor?: keyof DefaultTheme['color'];
  border?: string;
  $borderRadius?: number | string;
  display?: string;
}

let Button = styled.button<ButtonStyle>`
  width: ${(props) => props.width || 'fit-content'};
  height: ${(props) => props.height || 'fit-content'};
  margin: ${(props) => props.$margin || '0px'};
  padding: ${(props) => props.$padding || '0px'};
  display: ${(props) => props.display || 'block'};
  background-color: ${(props) => props.theme.color[props.$backgroundColor || 'transparent']};
  border: ${(props) => props.border || 'none'};
  border-radius: ${(props) => (props.$borderRadius ? `${props.$borderRadius}px` : '0')};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.color[props.$HBackgroundColor || 'transparent']};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* hover 배경을 없앤다. &:hover:not(:disabled)로 쓰면 특이도가 올라가
     styled(Button)으로 확장한 쪽의 &:hover 재정의가 먹지 않는다 */
  &:disabled:hover {
    background-color: ${(props) => props.theme.color[props.$backgroundColor || 'transparent']};
  }
`;

export default Button;
