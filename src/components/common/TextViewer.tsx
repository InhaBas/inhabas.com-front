import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { Viewer } from "@toast-ui/react-editor";
import React from "react";
import styled from "styled-components";
import { theme } from "../../styles/theme";

interface Props {
    contents: string;
}

const ViewerWrapper = styled.div`
    width: 100%;
    max-width: 100%;
    min-width: 0;

    .toastui-editor-contents {
        max-width: 100%;
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    .toastui-editor-contents img {
        max-width: 100%;
        height: auto;
    }

    .toastui-editor-contents table,
    .toastui-editor-contents pre {
        display: block;
        max-width: 100%;
        overflow-x: auto;
        overscroll-behavior-inline: contain;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
        scrollbar-color: ${theme.color.grey2} ${theme.color.border};
    }

    .toastui-editor-contents table::-webkit-scrollbar,
    .toastui-editor-contents pre::-webkit-scrollbar {
        display: block;
        height: 8px;
    }

    .toastui-editor-contents table::-webkit-scrollbar-thumb,
    .toastui-editor-contents pre::-webkit-scrollbar-thumb {
        background: ${theme.color.grey2};
        border-radius: 4px;
    }

    .toastui-editor-contents pre,
    .toastui-editor-contents pre code {
        white-space: pre;
        word-break: normal;
        overflow-wrap: normal;
    }

    .toastui-editor-contents p,
    .toastui-editor-contents a,
    .toastui-editor-contents blockquote,
    .toastui-editor-contents li,
    .toastui-editor-contents h1,
    .toastui-editor-contents h2,
    .toastui-editor-contents h3,
    .toastui-editor-contents h4,
    .toastui-editor-contents h5,
    .toastui-editor-contents h6 {
        max-width: 100%;
        overflow-wrap: anywhere;
        word-break: break-word;
    }
`;

const TextViewer: React.FC<Props> = ({ contents }) => {
    return (
        <ViewerWrapper>
            <Viewer initialValue={contents || ""} />
        </ViewerWrapper>
    );
};

export default TextViewer;
