import React from "react"
import { useState, Fragment, useRef } from "react"
import ReactDOM from "react-dom"
import "sanitize.css/sanitize.css"
import style from "./style.module.scss"
import { AiFillDelete } from "react-icons/ai"
import { apiClient } from "./global"
import { initialCode } from "./constants"
import { v4 as uuid } from "uuid"
import { Button } from "evergreen-ui"
import { WasmList } from "./components/WasmList"
import { WasmBuild } from "./models/WasmBuild"
import { Logger, LogLine } from "./components/Logger"
import classnames from "classnames"
import { FaGithub, FaUnity } from "react-icons/fa"
import { TextEditor } from "./components/TextEditor"
import { IoIosBuild, IoMdCode } from "react-icons/io"
import { VscPackage } from "react-icons/vsc"


const LEFT_PANEL_DEFAULT_WIDTH = 500
const EDITOR_DEFAULT_HEIGHT = 600

const logLines: LogLine[] = []

enum Player {
  UNITY = "UNITY",
  THREE = "THREE",
}

enum LeftBottomTab {
  OUTPUT = "OUTPUT",
  ARTIFACTS = "ARTIFACTS",
}

const App = () => {
  const playerIFrameRef = useRef<HTMLIFrameElement | null>(null)
  const [leftPanelWidth, setLeftPanelWidth] = useState(LEFT_PANEL_DEFAULT_WIDTH)
  const [editorHeight, setEditorHeight] = useState(EDITOR_DEFAULT_HEIGHT)
  const [separatorMoving, setSeparatorMoving] = useState(false)
  const [separatorHorizontalMoving, setSeparatorHorizontalMoving] = useState(false)
  const [codeText, setCodeText] = useState(initialCode)
  const [logUpdateTime, setLogUpdateTime] = useState<number>(0)
  const [compiling, setCompiling] = useState(false)
  const [player, setPlayer] = useState(Player.THREE)
  const [wasmBuilds, setWasmBuilds] = useState<WasmBuild[]>([])
  const [leftBottomTab, setLeftBottomTab] = useState(LeftBottomTab.OUTPUT)

  const onSeparatorClick =  (e: React.MouseEvent<HTMLDivElement>) => {
    setSeparatorMoving(true)
  }
  const onSeparatorMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (separatorMoving && leftPanelWidth > 200) {
      setLeftPanelWidth(leftPanelWidth + e.movementX)
    }
    if (separatorHorizontalMoving) {
      setEditorHeight(editorHeight + e.movementY)
    }
  }
  const stopSeparatorMoving = () => {
    setSeparatorMoving(false)
    setSeparatorHorizontalMoving(false)
  }
  const onSeparatorHorizontalClick = () => {
    setSeparatorHorizontalMoving(true)
  }
  const addLog = (line: string) => {
    logLines.push({
      id: uuid(),
      text: line,
    })
    setLogUpdateTime(new Date().getTime())
  }
  const onBuildClick = async () => {
    setCompiling(true)
    addLog("Compiling ...")
    if (codeText) {
      try {
        const res = await apiClient.compile(codeText)
        addLog(res.wasm.path)
        addLog(res.wat.path)
        const build: WasmBuild = {
          id: res.id,
          wasmUrl: location.origin + res.wasm.path,
          watUrl: location.origin + res.wasm.path,
          createdAt: new Date()
        }
        setWasmBuilds([build, ...wasmBuilds])
        setLeftBottomTab(LeftBottomTab.ARTIFACTS)
      } catch (e) {
        addLog(e.message)
      }
      setCompiling(false)
    } else {
      addLog("code empty")
    }
  }
  const play = (url: string) => {
    ;(playerIFrameRef.current?.contentWindow! as any).createSandbox(url)
  }
  const onRemoveAllClick = () => {
    ;(playerIFrameRef.current?.contentWindow! as any).deleteAllSandboxes()
  }
  const onLeftBottomTabClick = (tab: LeftBottomTab) => {
    setLeftBottomTab(tab)
  }
  const onWasmRunClick = (url: string) => {
    play(url)
  }
  const onEditorCodeChange = (text: string) => {
    setCodeText(text)
  }
  return (
    <div>
      <div className={style.header}>
        <div className={style.logo}>
          <VscPackage />
          <span>SNDBXR</span>
        </div>
        <a href="https://github.com/ku6ryo/SNDBXR" target="_blank">
          <div className={style.github}>
            <FaGithub/>
          </div>
        </a>
      </div>
      <div
        className={style.body}
        onMouseMove={onSeparatorMove}
        onMouseUp={stopSeparatorMoving}
        onMouseLeave={stopSeparatorMoving}
      >
        <div className={style.sidebar}>
          <div className={style.item}>
            <IoMdCode />
          </div>
        </div>
        <div
          className={style.leftPanel}
          style={{
            width: leftPanelWidth + "px"
          }}
        >
          <div className={style.editorToobar}>
            <div
              className={style.button}
              onClick={onBuildClick}
            >
              <IoIosBuild />
              <span>Build</span>
            </div>
          </div>
          <div
            className={style.editorSection}
            style={{
              height: editorHeight + "px"
            }}
          >
            <div
              className={style.editorContainer}
            >
              <TextEditor text={codeText} onChange={onEditorCodeChange}/>
            </div>
            <div
              className={style.separatorHorizontal}
              onMouseDown={onSeparatorHorizontalClick}
            />
          </div>
          <div
            className={style.leftBottomSection}
            style={{
              height: `calc(100% - ${editorHeight + 37}px)`
            }}
          >
            <div className={style.tabs}>
              <div
                className={classnames({
                  [style.tab]: true,
                  [style.selected]: leftBottomTab === LeftBottomTab.OUTPUT
                })}
                onClick={() => onLeftBottomTabClick(LeftBottomTab.OUTPUT)}
              >OUTPUT</div>
              <div
                className={classnames({
                  [style.tab]: true,
                  [style.selected]: leftBottomTab === LeftBottomTab.ARTIFACTS
                })}
                onClick={() => onLeftBottomTabClick(LeftBottomTab.ARTIFACTS)}
              >ARTIFACTS</div>
            </div>
            <div
              className={style.panel}
            >
              {leftBottomTab === LeftBottomTab.OUTPUT && (
                <Logger lines={logLines} />
              )}
              {leftBottomTab === LeftBottomTab.ARTIFACTS && (
                <WasmList items={wasmBuilds} onRunClick={onWasmRunClick}/>
              )}
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
            left: leftPanelWidth + 48,
            width: `calc(100% - ${leftPanelWidth + 48}px)`,
          }}
        >
          <div className={style.playerSelector}>
            <div
              className={classnames({
                [style.option]: true,
                [style.selected]: player === Player.THREE
              })}
              onClick={() => setPlayer(Player.THREE)}
            >
              <span>three.js</span>
            </div>
            <div
              className={classnames({
                [style.option]: true,
                [style.selected]: player === Player.UNITY
              })}
              onClick={() => setPlayer(Player.UNITY)}
            >
              <FaUnity/>
              <span>Unity</span>
            </div>
          </div>
          <iframe ref={playerIFrameRef} src={`/player/${player.toLocaleLowerCase()}`}></iframe>
          <div className={style.operationButtons}>
            <Button
              iconBefore={AiFillDelete}
              onClick={onRemoveAllClick}
            >Remove Sandboxes</Button>
          </div>
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