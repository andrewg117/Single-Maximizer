import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from '../css/new_release_style.module.css'

const ImageFrame = ({ blob, id, removePress }) => {
  return (
    <>
      <div id={styles.press_frame}>
        <img src={URL.createObjectURL(blob)} alt='N/A' onLoad={() => { URL.revokeObjectURL(blob) }} />
        <p id={styles.remove_press} onClick={(e) => removePress(e, id)}>
          X
        </p>
      </div>
    </>
  )
}

function PressUpload({ changeFile, trackPress }) {
  // const [pressList, setList] = useState([])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.png']
    },
    onDrop: async (acceptedFiles) => {
      let formData = new FormData()
      formData.append('Press', acceptedFiles[0])
      let megBytes = Math.round((acceptedFiles[0].size / 1024 ** 2) * 100) / 100
      megBytes = megBytes.toString() + ' MB'
      formData.append('size', megBytes)

      // setEdit(false)

      // getBlob(URL.createObjectURL(formData.get('Image')))

      changeFile((prevState) => ({
        ...prevState,
        trackPress: [
          ...trackPress,
          formData.get('Press')
        ]
      }))
    }
  })

  const removePress = (e, id) => {
    e.preventDefault()
    // setList(files.filter((item, index) => index !== id))

    changeFile((prevState) => ({
      ...prevState,
      trackPress: trackPress.filter((item, index) => index !== id)
    }))
  }

  useEffect(() => {
    return () => {
      // files.map((item, index) => {
      //   return []
      // })
      // URL.revokeObjectURL(blob)
      if(trackPress.length > 0) {
      }
    }
  }, [trackPress])

  return (
    <div id={styles.press_upload}>
      {
        trackPress.length > 0 ?
        trackPress.map((item, index) => {
          // return <p key={index}>{item.path}</p>
          return <ImageFrame key={index} id={index} blob={item} removePress={removePress} />
        })
        :
        []
      }
      <div id={styles.add_press} {...getRootProps()}>
        <input {...getInputProps()} />
        <div>Add Photo</div>
      </div>
    </div>
  )
}

export default PressUpload