import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Buffer } from 'buffer'
import { FaEdit } from 'react-icons/fa'
import { toast } from 'react-toastify'
import AudioPlayer from 'react-h5-audio-player'
import styles from '../css/new_release_style.module.css'
import 'react-h5-audio-player/lib/styles.css'

function AudioUpload({ changeFile, file, fieldname }) {
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
      if (acceptedFiles[0]) {
        let formData = new FormData()
        formData.append(fieldname, acceptedFiles[0])
        let megBytes = Math.round((acceptedFiles[0].size / 1024 ** 2) * 100) / 100
        megBytes = megBytes.toString()
        formData.append('size', megBytes)

        setEdit(false)

        getBlob(URL.createObjectURL(formData.get(fieldname)))
        changeFile((prevState) => ({
          ...prevState,
          [fieldname]: formData
        }))
      } else {
        toast.error("File size is too large")
      }
    },
    maxSize: 21000000,
  })


  useEffect(() => {
    return () => {
      URL.revokeObjectURL(blob)
    }
  }, [blob])

  return (
    <>
      <div>
        {file !== null ?
          <>
            {isEdit === true ?
              <>
                <AudioPlayer
                  src={makeBlob()}
                  controls
                  layout="horizontal"
                  autoPlayAfterSrcChange={false}
                  volume={.2}
                />
              </>
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
                {/* <p>{file instanceof FormData ? 'Size: ' + file.get('size') : ''}</p> */}
              </>
            }
            {/* <p
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
          X Change Audio
        </p> */}
          </>
          :
          <>
          </>
        }
      </div>
      <div style={{ cursor: 'pointer' }} {...getRootProps()} >
        <input {...getInputProps()} />
        <p hidden={file}>Drag and drop or click to upload audio</p>
        <div>
          <p><FaEdit hidden={!file} /> Change Audio</p>

        </div>
      </div>

    </>
  )
}

export default AudioUpload