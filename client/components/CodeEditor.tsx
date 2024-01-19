import { Editor, EditorProps, OnMount } from "@monaco-editor/react";
import React, { CSSProperties } from "react";
import { CodePresets } from "./CodePresets";

interface Props {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  style?: CSSProperties;
  codeContainerStyles?: CSSProperties;
  presets?: string;
  height?: string;
  fontSize?: number;
  editorDidMount?: OnMount;
}

export const CodeEditor = ({
  code,
  setCode,
  style,
  codeContainerStyles = { width: "65%", height: "100%" },
  height = "400px",
  fontSize = 20,
  editorDidMount,
}: Props) => {
  const handleCodeChange = (newValue: string | undefined) => {
    setCode(newValue ?? "");
  };
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    if (editorDidMount) {
      editorDidMount(editor, monaco);
    } else {
      editor.setValue(code);
      editor.setPosition({ lineNumber: 100, column: 200 });
      editor.focus();
    }
  };

  const editorOptions: EditorProps["options"] = {
    minimap: { enabled: false },
    fontSize: fontSize,
  };
  return (
    <div
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div style={codeContainerStyles}>
        <Editor
          height={height}
          defaultLanguage="python"
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          width={"100%"}
          options={editorOptions}
        />
      </div>
      <CodePresets />
    </div>
  );
};