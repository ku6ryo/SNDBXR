import * as React from "react"
import { useEffect, useState, Fragment, useRef } from "react"
import * as ReactDOM from "react-dom"
import "sanitize.css/sanitize.css"
import style from "./style.module.scss"
import { editor as monacoEditor } from "monaco-editor"
import { VscDebugStart } from "react-icons/vsc"
import { apiClient } from "./global"
import { initialCode } from "./constants"
import { v4 as uuid } from "uuid"


const LEFT_PANEL_DEFAULT_WIDTH = 500;
const EDITOR_DEFAULT_HEIGHT = 600;

type LogLine = {
  id: string,
  text: string
}

const logLines: LogLine[] = []

const App = () => {
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const playerIFrameRef = useRef<HTMLIFrameElement | null>(null)
  const [leftPanelWidth, setLeftPanelWidth] = useState(LEFT_PANEL_DEFAULT_WIDTH)
  const [editorHeight, setEditorHeight] = useState(EDITOR_DEFAULT_HEIGHT)
  const [separatorMoving, setSeparatorMoving] = useState(false)
  const [editor, setMonacoEditor] = useState<monacoEditor.IStandaloneCodeEditor | null>(null)
  const [logUpdateTime, setLogUpdateTime] = useState<number>(0)
  useEffect(() => {
    if (editorContainerRef.current) {
      monacoEditor.setTheme("vs-dark")
      const editor = monacoEditor.create(editorContainerRef.current, {
        automaticLayout: true,
        value: initialCode,
        language: "typescript"
      })
      setMonacoEditor(editor)
    }
  }, [])

  const onSeparatorClick =  (e: React.MouseEvent<HTMLDivElement>) => {
    setSeparatorMoving(true)
  }
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (separatorMoving) {
      setLeftPanelWidth(leftPanelWidth + e.movementX)
    }
  }
  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setSeparatorMoving(false)
  }
  const onMouseLeave = () => {
    setSeparatorMoving(false)
  }
  const addLog = (line: string) => {
    logLines.push({
      id: uuid(),
      text: line,
    })
    setLogUpdateTime(new Date().getTime())
  }
  const onPlayClick = async () => {
    if (editor) {
      addLog("Compiling ...")
      const code = editor.getModel()?.getValue()
      if (code) {
        try {
          const res = await apiClient.compile(code)
          addLog(res.wasm.path)
          addLog(res.wat.path)
          ;(playerIFrameRef.current?.contentWindow! as any).connector.requestLoad("http://localhost:8080" + res.wasm.path)
        } catch (e) {
          addLog(e.message)
        }
      } else {
        addLog("code empty")
      }
    }
  }
  return (
    <div>
      <div className={style.header}>
        <div className={style.playButton} onClick={onPlayClick}>
          <VscDebugStart/>
          <span>PLAY</span>
        </div>
      </div>
      <div className={style.body}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div
          className={style.leftPanel}
          style={{
            width: leftPanelWidth + "px"
          }}
        >
          <div
            className={style.editorSection}
            style={{
              height: editorHeight + "px"
            }}
          >
            <div
              className={style.editorContainer}
              ref={editorContainerRef}
            ></div>
          </div>
          <div
            className={style.logSection}
            style={{
              height: `calc(100% - ${editorHeight}px)`
            }}
          >
            <div className={style.title}>LOG</div>
            <div className={style.logLines}>
              {logLines.map(line => {
                return (
                  <div key={line.id} className={style.log}>{line.text}</div>
                )
              })}
            </div>
          </div>
          <div className={style.separator}
            onMouseDown={onSeparatorClick}
          />
        </div>
        <div
          className={style.rightPanel}
          style={{
            left: leftPanelWidth,
            width: `calc(100% - ${leftPanelWidth}px)`,
          }}
        >
          <iframe ref={playerIFrameRef} src="http://localhost:8080/three"></iframe>
        </div>
      </div>
    </div>
  )
}

const Root = (
  <Fragment>
    <App/>
  </Fragment>
)

const root = document.createElement("div")
root.id = "root"
document.body.appendChild(root)
ReactDOM.render(Root, root)