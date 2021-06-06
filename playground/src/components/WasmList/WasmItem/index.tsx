import React, { useCallback } from "react"
import { WasmBuild } from "../../../models/WasmBuild"
import moment from "moment"
import style from "./style.module.scss"
import { BiCopy } from "react-icons/bi"
import { copyTextToClipboard } from "../../../utils/text-copy"
import { VscDebugStart } from "react-icons/vsc"
import classnames from "classnames"

type Props = {
  item: WasmBuild,
  onRunClick: (url: WasmBuild) => void
}

export function WasmItemComponent ({ item, onRunClick }: Props) {
  const onWasmCopyClick = useCallback(() => {
    copyTextToClipboard(item.wasmUrl)
  }, [item])
  const onWatCopyClick = useCallback(() => {
    copyTextToClipboard(item.wasmUrl)
  }, [item])
  const onRunClickInternal = useCallback(() => {
    onRunClick(item)
  }, [item])
  return (
    <div className={style.frame}>
      <div className={style.date}>{moment(item.createdAt).format("YYYY/MM/DD HH:mm:ss")}</div>
      <div className={style.copyButtons}>
        <div
          className={classnames(style.button, style.run)}
          onClick={onRunClickInternal}
        >
          <VscDebugStart />
          <span>RUN</span>
        </div>
        <div
          className={classnames(style.button, style.copy)}
          onClick={onWasmCopyClick}
        >
          <span>WASM</span>
          <BiCopy/>
        </div>
        <div
          className={classnames(style.button, style.copy)}
          onClick={onWatCopyClick}
        >
          <span>WAT</span>
          <BiCopy/>
        </div>
      </div>
    </div>
  )
}