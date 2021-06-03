import * as React from "react"
import { useEffect, useState, Fragment, useRef } from "react"
import * as ReactDOM from "react-dom"
import "sanitize.css/sanitize.css"
import style from "./style.module.scss"
import { editor as monacoEditor } from "monaco-editor"
import { VscDebugStart } from "react-icons/vsc"
import { IoLogoGithub } from "react-icons/io"
import { AiFillCaretDown, AiFillDelete } from "react-icons/ai"
import { apiClient } from "./global"
import { initialCode } from "./constants"
import { v4 as uuid } from "uuid"
import { Button, SelectMenu, SelectMenuItem } from "evergreen-ui"
import { Spinner } from "evergreen-ui"


const LEFT_PANEL_DEFAULT_WIDTH = 500;
const EDITOR_DEFAULT_HEIGHT = 600;

type LogLine = {
  id: string,
  text: string
}

const logLines: LogLine[] = []

enum Player {
  UNITY = "UNITY",
  THREE = "THREE",
}

const App = () => {
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const playerIFrameRef = useRef<HTMLIFrameElement | null>(null)
  const [leftPanelWidth, setLeftPanelWidth] = useState(LEFT_PANEL_DEFAULT_WIDTH)
  const [editorHeight, setEditorHeight] = useState(EDITOR_DEFAULT_HEIGHT)
  const [separatorMoving, setSeparatorMoving] = useState(false)
  const [editor, setMonacoEditor] = useState<monacoEditor.IStandaloneCodeEditor | null>(null)
  const [logUpdateTime, setLogUpdateTime] = useState<number>(0)
  const [compiling, setCompiling] = useState(false)
  const [player, setPlayer] = useState(Player.THREE)
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
  const onSeparatorMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (separatorMoving) {
      setLeftPanelWidth(leftPanelWidth + e.movementX)
    }
  }
  const stopSeparatorMoving = () => {
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
      setCompiling(true)
      addLog("Compiling ...")
      const code = editor.getModel()?.getValue()
      if (code) {
        try {
          const res = await apiClient.compile(code)
          addLog(res.wasm.path)
          addLog(res.wat.path)
          ;(playerIFrameRef.current?.contentWindow! as any).createSandbox("http://localhost:8080" + res.wasm.path)
        } catch (e) {
          addLog(e.message)
        }
        setCompiling(false)
      } else {
        addLog("code empty")
      }
    }
  }
  const onRemoveAllClick = () => {
    ;(playerIFrameRef.current?.contentWindow! as any).deleteAllSandboxes()
  }
  const onPlayerSelect = (item: SelectMenuItem) => {
    const player = item.value as Player
    setPlayer(player)
  }
  return (
    <div>
      <div className={style.header}>
        <div className={style.operationButtons}>
          <Button
            iconBefore={compiling ? Spinner : VscDebugStart}
            onClick={onPlayClick}
          >Run</Button>
          <Button
            iconBefore={AiFillDelete}
            onClick={onRemoveAllClick}
          >Remove Sandboxes</Button>
          <SelectMenu
            title="Players"
            hasFilter={false}
            options={[
              {
                label: 'Unity',
                value: 'UNITY',
              },
              {
                label: 'Three.js',
                value: 'THREE',
              },
            ]}
            onSelect={onPlayerSelect}
          >
            <Button
              iconAfter={AiFillCaretDown}
            >{player == Player.UNITY ? (
              "Unity"
            ): (
              "Three.js"
            )}</Button>
          </SelectMenu>
        </div>
        <div className={style.github}>
          <a href="https://github.com/ku6ryo/SNDBXR" target="_blank">
            <Button iconBefore={IoLogoGithub}>Github</Button>
          </a>
        </div>
      </div>
      <div
        className={style.body}
        onMouseMove={onSeparatorMove}
        onMouseUp={stopSeparatorMoving}
        onMouseLeave={stopSeparatorMoving}
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
          <div
            className={style.separator}
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
          <iframe ref={playerIFrameRef} src={`/player/${player.toLocaleLowerCase()}`}></iframe>
          {separatorMoving && (
            <div className={style.playerCover}/>
          )}
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