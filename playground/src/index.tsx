import React from "react"
import { useState, Fragment, useRef } from "react"
import ReactDOM from "react-dom"
import "sanitize.css/sanitize.css"
import style from "./style.module.scss"
import { AiFillDelete } from "react-icons/ai"
import { v4 as uuid } from "uuid"
import { Button } from "evergreen-ui"
import { WasmList } from "./components/WasmList"
import { WasmBuild } from "./models/WasmBuild"
import { Logger, LogLine } from "./components/Logger"
import classnames from "classnames"
import { FaGithub, FaUnity } from "react-icons/fa"
import { IoMdCode } from "react-icons/io"
import { VscPackage } from "react-icons/vsc"
import { CgExtension } from "react-icons/cg"
import { FileManager } from "./components/FileManger"
import { Asset, AssetType } from "./models/Asset"
import { UserFile } from "./models/UserFile"
import { CodeEditor } from "./components/CodeEditor"


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

enum Panel {
  CODE = "CODE",
  FILE = "FILE"
}

const App = () => {
  const playerIFrameRef = useRef<HTMLIFrameElement | null>(null)
  const [leftPanelWidth, setLeftPanelWidth] = useState(LEFT_PANEL_DEFAULT_WIDTH)
  const [editorHeight, setEditorHeight] = useState(EDITOR_DEFAULT_HEIGHT)
  const [separatorMoving, setSeparatorMoving] = useState(false)
  const [separatorHorizontalMoving, setSeparatorHorizontalMoving] = useState(false)
  const [logUpdateTime, setLogUpdateTime] = useState<number>(0)
  const [player, setPlayer] = useState(Player.THREE)
  const [wasmBuilds, setWasmBuilds] = useState<WasmBuild[]>([])
  const [leftBottomTab, setLeftBottomTab] = useState(LeftBottomTab.OUTPUT)
  const [panel, setPanel] = useState(Panel.CODE)
  const [assets, setAssets] = useState<Asset[]>([])

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
  const play = (url: string) => {
    ;(playerIFrameRef.current?.contentWindow! as any).createSandbox(url)
  }
  const onRemoveAllClick = () => {
    ;(playerIFrameRef.current?.contentWindow! as any).deleteAllSandboxes()
  }
  const onLeftBottomTabClick = (tab: LeftBottomTab) => {
    setLeftBottomTab(tab)
  }
  const onWasmRunClick = (build: WasmBuild) => {
    play(build.wasmUrl)
    const asset: Asset = {
      id: uuid(),
      type: AssetType.SCRIPT,
      name: build.id
    }
    setAssets([asset, ...assets])
  }
  const onFileAddClick = (file: UserFile) => {
    ;(playerIFrameRef.current?.contentWindow! as any).loadGltf(file.url)
    const asset = {
      id: uuid(),
      type: AssetType.GLTF,
      name: file.path,
    }
    setAssets([asset, ...assets])
  }
  const onBuildCreated = (build: WasmBuild) => {
    setWasmBuilds([build, ...wasmBuilds])
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
          <div
            className={style.item}
            onClick={() => setPanel(Panel.CODE)}
          >
            <IoMdCode />
          </div>
          <div
            className={style.item}
            onClick={() => setPanel(Panel.FILE)}
          >
            <CgExtension />
          </div>
        </div>
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
            {panel === Panel.FILE && (
              <FileManager
                onAddClick={onFileAddClick}
              />
            )}
            {panel === Panel.CODE && (
              <CodeEditor
                onBuildCreated={onBuildCreated}
                onMessageUpdated={addLog}
              />
            )}
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
          <div className={style.assetHierarchy}>
            {assets.map(asset => {
              return (
                <div className={style.asset}>
                  <div className={style.type}>{asset.type}</div>
                  <div className={style.name}>{asset.name}</div>
                </div>
              )
            })}
          </div>
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