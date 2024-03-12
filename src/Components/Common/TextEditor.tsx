// Toast UI Editor
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
// Color Syntax Plugin
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import { forwardRef } from "react";
import "tui-color-picker/dist/tui-color-picker.css";

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

const TextEditor = forwardRef((props, ref) => {
    return (
        <Editor
            ref={ref as React.MutableRefObject<Editor>}
            height="500px"
            previewStyle="vertical"
            initialEditType="markdown"
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
    );
});

export default TextEditor;
