import { useEffect, useState } from 'react'
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
  const [listSize, setListSize] = useState()

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


  useEffect(() => {
    setListSize(() => {
      let size = 0
      if (trackPress.length > 0) {
        trackPress.forEach((item) => {
          size = size + item.size
        })
      }

      let megBytes = Math.round((size / 1024 ** 2) * 100) / 100
      megBytes = megBytes.toString()
      return megBytes
    })
  }, [trackPress])

  const removePress = (e, id) => {
    e.preventDefault()
    // setList(files.filter((item, index) => index !== id))

    changeFile((prevState) => ({
      ...prevState,
      trackPress: trackPress.filter((item, index) => index !== id)
    }))
  }

  return (
    <>
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
      <p>Size Limit: {listSize} / 20 MB</p>
    </>
  )
}

export default PressUpload