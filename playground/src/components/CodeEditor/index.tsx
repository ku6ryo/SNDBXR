import React, { useState } from "react"
import { TextEditor } from "../TextEditor"
import { IoIosBuild } from "react-icons/io"
import { apiClient } from "../../global"
import { initialCode } from "../../constants"
import { WasmBuild } from "../../models/WasmBuild"
import style from "./style.module.scss"

type Props = {
  onBuildCreated: (build: WasmBuild) => void
  onMessageUpdated: (message: string) => void
}

export function CodeEditor ({
  onBuildCreated,
  onMessageUpdated,
}: Props) {
  const [code, setCode] = useState(initialCode)
  const onBuildClick = async () => {
    onMessageUpdated("Building ...")
    if (code) {
      try {
        const res = await apiClient.compile(code)
        const build: WasmBuild = {
          id: res.id,
          wasmUrl: API_BASE_PATH + res.wasm.path,
          watUrl: API_BASE_PATH + res.wasm.path,
          createdAt: new Date()
        }
        onBuildCreated(build)
        onMessageUpdated("Build completed")
      } catch (e) {
        onMessageUpdated(e.message)
      }
    }
  }
  return (
    <div>
      <div className={style.toolbar}>
        <div
          className={style.button}
          onClick={onBuildClick}
        >
          <IoIosBuild />
          <span>Build</span>
        </div>
      </div>
      <div
        className={style.editorContainer}
      >
        <TextEditor text={code} onChange={(text: string) => setCode(text)} />
      </div>
    </div>
  )
}