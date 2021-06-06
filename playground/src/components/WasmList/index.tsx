import React from "react"
import { WasmBuild } from "../../models/WasmBuild"
import { WasmItemComponent } from "./WasmItem"

type Props = {
  items: WasmBuild[]
  onRunClick: (url: WasmBuild) => void
}

export function WasmList ({ items, onRunClick }: Props) {
  return (
    <div>
      {items.map(i => {
        return (
          <WasmItemComponent key={i.id} item={i} onRunClick={onRunClick}/>
        )
      })}
    </div>
  )
}