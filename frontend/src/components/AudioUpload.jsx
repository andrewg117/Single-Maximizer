import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from '../css/new_release_style.module.css'

function AudioUpload({ changeFile, file, fieldname, altText }) {
  const [isEdit, setEdit] = useState(true)

  const [blob, getBlob] = useState(useCallback(() => {
    if (file && !isEdit) {
      return URL.createObjectURL(file.get(fieldname))
    } else if (isEdit === true) {
      return file
    }
  }, [file, isEdit, fieldname]))

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'audio/mp3': ['.mp3']
    },
    onDrop: async (acceptedFiles) => {
      let formData = new FormData()
      formData.append(fieldname, acceptedFiles[0])

      setEdit(false)

      getBlob(URL.createObjectURL(formData.get(fieldname)))
      changeFile((prevState) => ({
        ...prevState,
        [fieldname]: formData
      }))
    }
  })


  useEffect(() => {
    if (isEdit === true) {
      getBlob(file)
    }
    return () => {
      URL.revokeObjectURL(blob)
      URL.revokeObjectURL(file)
    }
  }, [blob, file, isEdit])

  return (
    <>
      <p>Audio Upload</p>
      <div style={{ cursor: 'pointer' }} {...getRootProps()} hidden={file}>
        <input {...getInputProps()} />
        <p>Drag and drop or click to upload audio</p>
      </div>
      <div>
        {file ?
          <>
            {/* {console.log(blob)} */}
            {isEdit === true ?
              <>
              {console.log(blob)}
                <audio controls>
                  <source src={`data:audio/mp3;base64,${file}`} />
                  {altText}
                </audio>
              </>
              :
              <>
                <audio controls>
                  <source src={blob} type="audio/mp3" />
                  {altText}
                </audio>
                <p>{file.get('trackAudio').name}</p>
              </>
            }
            <p
              id={styles.remove_audio}
              onClick={(e) => {
                setEdit(false)
                getBlob(null)
                URL.revokeObjectURL(blob)
                URL.revokeObjectURL(file)
                changeFile((prevState) => ({
                  ...prevState,
                  [fieldname]: null
                }))
              }}>
              Remove
            </p>
          </>
          :
          <>
          </>
        }
      </div>
    </>
  )
}

export default AudioUpload