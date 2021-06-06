import React, { useEffect, useRef, useState } from "react"
import { editor as monacoEditor } from "monaco-editor"
import style from "./style.module.scss"
import Monokai from "monaco-themes/themes/Monokai.json"

type Props = {
  text: string,
  onChange: (text: string) => void
}

export function TextEditor ({ text, onChange }: Props) {
  const [editor, setMonacoEditor] = useState<monacoEditor.IStandaloneCodeEditor | null>(null)
  const editorContainerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (editorContainerRef.current) {
      monacoEditor.defineTheme("monokai", Monokai as any)
      monacoEditor.setTheme("monokai")
      const editor = monacoEditor.create(editorContainerRef.current, {
        automaticLayout: true,
        value: text,
        language: "typescript",
        minimap: {
          enabled: false,
        }
      })
      editor.onDidChangeModelContent((e) => {
        onChange(editor.getValue())
      })
      setMonacoEditor(editor)
    }
  }, [])
  return (
    <div
      className={style.frame}
      ref={editorContainerRef}
    ></div>
  )
}