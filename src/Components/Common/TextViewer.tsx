import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { Viewer } from "@toast-ui/react-editor";
import React from "react";

interface Props {
    contents: string;
}

const TextViewer: React.FC<Props> = ({ contents }) => {
    return <Viewer initialValue={contents || ""} />;
};

export default TextViewer;
