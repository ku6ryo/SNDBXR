import React from "react"
import style from "./style.module.scss"

export type LogLine = {
  id: string,
  text: string
}

type Props = {
  lines: LogLine[],
}

export function Logger ({ lines }: Props) {
  return (
    <div className={style.frame}>
      {lines.map(line => {
        return (
          <div key={line.id} className={style.log}>{line.text}</div>
        )
      })}
    </div>
  )
}