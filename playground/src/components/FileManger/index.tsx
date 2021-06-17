import React, { useState } from "react"
import { apiClient } from "../../global"
import { UserFile } from "../../models/UserFile"
import style from "./style.module.scss"
import { v4 as uuid } from "uuid"

type Props = {
  onAddClick: (file: UserFile) => void
}

export function FileManager({
  onAddClick,
} : Props) {
  const [userFiles, setUserFiles] = useState<UserFile[]>([])

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.addEventListener("load", function () {
        const userFile = {
          id: uuid(),
          path: file.name,
          type: file.type,
          url: reader.result,
        } as UserFile
        setUserFiles([userFile, ...userFiles])
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }

  return (
    <div className={style.frame}>
      <div>
        <input type="file" onChange={onFileChange}/>
      </div>
      <div>
        {userFiles.map(file => {
          return (
            <div key={file.id}>
              <div>{file.path}</div>
              <div onClick={() => onAddClick(file)}>add</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}