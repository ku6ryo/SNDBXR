import React, { useState } from "react"
import { apiClient } from "../../global"
import { UploadedFile } from "../../models/UploadedFile"
import style from "./style.module.scss"

type Props = {
  files: UploadedFile[],
  onAddClick: (asset: UploadedFile) => void
  onFileUploaded: (file: UploadedFile) => void
}

export function FileManager({
  files,
  onAddClick,
  onFileUploaded,
} : Props) {
  const [file, setFile] = useState<File | null>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      const file = files[0]
      setFile(file)
    }
  }
  const onUploadClick = async () => {
    if (file) {
      const uploaded = await apiClient.uploadFile(file)
      onFileUploaded(uploaded)
    }
  }

  return (
    <div className={style.frame}>
      <div>
        <input type="file" onChange={onFileChange}/>
      </div>
      <div>
        <button onClick={onUploadClick}>upload</button>
      </div>
      <div>
        {files.map(file => {
          return (
            <div key={file.id}>
              <div>{file.name}</div>
              <div onClick={() => onAddClick(file)}>add</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}