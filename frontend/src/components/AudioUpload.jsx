import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Buffer } from 'buffer'
import AudioPlayer from 'react-h5-audio-player'
import styles from '../css/new_release_style.module.css'
import 'react-h5-audio-player/lib/styles.css'

function AudioUpload({ changeFile, file, fieldname, altText }) {
  const [isEdit, setEdit] = useState(true)

  const makeBlob = useCallback(() => {
    if (file && !isEdit) {
      return URL.createObjectURL(file.get(fieldname))
    } else if (file && isEdit) {
      const audioBuffer = Buffer.from(file.buffer, 'base64')
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' })
      const href = URL.createObjectURL(blob)
      // console.log(href.toString())
      return href
    }

  }, [file, isEdit, fieldname])

  const [blob, getBlob] = useState(makeBlob())

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
    return () => {
      URL.revokeObjectURL(blob)
    }
  }, [blob])

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
            {isEdit === true ?
              <>
                <AudioPlayer
                  // src={`data:audio/mp3;base64,${makeBlob()}`}
                  src={makeBlob()}
                  controls
                  layout="horizontal"
                />
              </>
              :
              <>
                <AudioPlayer
                  src={blob}
                  controls
                  layout="horizontal"
                />
                <p>{file.get('trackAudio').name}</p>
              </>
            }
            <p
              id={styles.remove_audio}
              onClick={(e) => {
                setEdit(false)
                getBlob(null)
                URL.revokeObjectURL(blob)
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