import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Buffer } from 'buffer'
import AudioPlayer from 'react-h5-audio-player'
import styles from '../css/new_release_style.module.css'
import 'react-h5-audio-player/lib/styles.css'

function AudioUpload({ changeFile, file, fieldname, url, urlField }) {
  const [isEdit, setEdit] = useState(true)

  const makeBlob = useCallback(() => {
    if (file && (file instanceof FormData) && !isEdit) {
      return URL.createObjectURL(file.get(fieldname))
    } else if (isEdit === true) {
      const audioBuffer = Buffer.from(file.buffer, 'base64')
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' })
      const href = URL.createObjectURL(blob)
      // console.log(href.toString())
      return href
    } else {
      return null
    }

  }, [file, isEdit, fieldname])

  const [blob, getBlob] = useState()

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'audio/mp3': ['.mp3']
    },
    onDrop: async (acceptedFiles) => {
      let formData = new FormData()
      formData.append(fieldname, acceptedFiles[0])
      let megBytes = Math.round((acceptedFiles[0].size / 1024 ** 2) * 100) / 100
      megBytes = megBytes.toString() + ' MB'
      formData.append('size', megBytes)

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
      <div style={{ cursor: 'pointer' }} {...getRootProps()} hidden={file || url}>
        <input {...getInputProps()} />
        <p>Drag and drop or click to upload audio</p>
      </div>
      <div>
        {url ?
          <>
            <AudioPlayer
              src={url}
              controls
              layout="horizontal"
              autoPlayAfterSrcChange={false}
              volume={.2}
            />
            <p
              id={styles.remove_audio}
              onClick={(e) => {
                setEdit(false)
                getBlob(null)
                URL.revokeObjectURL(blob)
                changeFile((prevState) => ({
                  ...prevState,
                  [fieldname]: null,
                  [urlField]: null
                }))
              }}>
              Remove Audio
            </p>
          </>
          :
          <></>}
        {file ?
          <>
            {isEdit === true ?
              <></>
              :
              <>
                <AudioPlayer
                  src={blob}
                  controls
                  layout="horizontal"
                  autoPlayAfterSrcChange={false}
                  volume={.2}
                />
                <p>{file instanceof FormData ? file.get('trackAudio').name : ''}</p>
                <p>{file instanceof FormData ? 'Size: ' + file.get('size') : ''}</p>
                <p
                  id={styles.remove_audio}
                  onClick={(e) => {
                    setEdit(false)
                    getBlob(null)
                    URL.revokeObjectURL(blob)
                    changeFile((prevState) => ({
                      ...prevState,
                      [fieldname]: null,
                      [urlField]: null
                    }))
                  }}>
                  Remove Audio
                </p>
              </>
            }
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