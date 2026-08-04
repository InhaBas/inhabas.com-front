// Toast UI Editor
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
// Color Syntax Plugin
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import { forwardRef } from "react";
import styled from "styled-components";
import "tui-color-picker/dist/tui-color-picker.css";
import { media, theme } from "../../styles/theme";

const EditorWrapper = styled.div`
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: ${theme.color.grey2} ${theme.color.border};

    &::-webkit-scrollbar,
    .toastui-editor-defaultUI-toolbar::-webkit-scrollbar {
        display: block;
        height: 8px;
    }

    &::-webkit-scrollbar-thumb,
    .toastui-editor-defaultUI-toolbar::-webkit-scrollbar-thumb {
        background: ${theme.color.grey2};
        border-radius: 4px;
    }

    .toastui-editor-defaultUI {
        width: 100%;
        min-width: 0;
    }

    .toastui-editor-defaultUI-toolbar {
        max-width: 100%;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
        scrollbar-width: thin;
    }

    ${media.mobile} {
        .toastui-editor-dropdown-toolbar {
            width: min(280px, calc(100vw - 64px));
            max-width: calc(100vw - 64px);
            height: auto;
            max-height: 180px;
            flex-wrap: wrap;
            overflow-x: hidden;
            overflow-y: auto;
        }
    }

    .toastui-editor-main,
    .toastui-editor-md-container,
    .toastui-editor-ww-container {
        min-width: 0;
        max-width: 100%;
    }
`;

const colorSyntaxOptions = {
    preset: [
        "#333333",
        "#666666",
        "#FFFFFF",
        "#EE2323",
        "#F89009",
        "#009A87",
        "#006DD7",
        "#8A3DB6",
        "#333333",
        "#666666",
        "#FFFFFF",
        "#EE2323",
        "#F89009",
        "#009A87",
        "#006DD7",
        "#8A3DB6",
    ],
};

const TextEditor = forwardRef(({ initialContent }: { initialContent?: string }, ref) => {
    return (
        <EditorWrapper>
            <Editor
                ref={ref as React.MutableRefObject<Editor>}
                height="500px"
                previewStyle="vertical"
                initialEditType="markdown"
                initialValue={initialContent}
                toolbarItems={[
                    // 툴바 옵션 설정
                    ["heading", "bold", "italic", "strike"],
                    ["hr", "quote"],
                    ["ul", "ol", "task", "indent", "outdent"],
                    ["table", "image", "link"],
                    ["code", "codeblock"],
                ]}
                usageStatistics={false} // 통계 수집 거부
                plugins={[[colorSyntax, colorSyntaxOptions]]}
            />
        </EditorWrapper>
    );
});

export default TextEditor;
