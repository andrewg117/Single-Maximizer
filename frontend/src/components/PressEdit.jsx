import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from '../css/new_release_style.module.css'

const ImageFrame = ({ blob, id, removePress }) => {
  return (
    <>
      <div id={styles.press_frame}>
        <img src={`data:image/*;base64,${blob}`} alt={'N/A'} />
        <p id={styles.remove_press} onClick={(e) => removePress(e, id)}>
          X
        </p>
      </div>
    </>
  )
}

const NewImageFrame = ({ blob, id, removePress }) => {
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

function PressEdit({ changeFile, trackPress, newPressList, deletePressList }) {
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


      changeFile((prevState) => ({
        ...prevState,
        newPressList: [
          ...newPressList,
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
      trackPress: trackPress.filter((item) => item._id !== id),
      // newPressList: newPressList.filter((item, index) => index !== id),
      deletePressList: [
        ...deletePressList,
        trackPress.find((item) => item._id === id)
      ]
    }))
  }


  const removeNewPress = (e, id) => {
    e.preventDefault()

    changeFile((prevState) => ({
      ...prevState,
      newPressList: newPressList.filter((item, index) => index !== id),
    }))
  }

  useEffect(() => {
    setListSize(() => {
      let size = 0
      if (trackPress.length > 0) {
        trackPress.forEach((item) => {
          size = size + item.file.size
        })
      }
      if (newPressList.length > 0) {
        newPressList.forEach((item) => {
          size = size + item.size
        })
      }

      let megBytes = Math.round((size / 1024 ** 2) * 100) / 100
      megBytes = megBytes.toString()
      return megBytes
    })
    return () => {
      // files.map((item, index) => {
      //   return []
      // })
      // URL.revokeObjectURL(blob)
    }
  }, [trackPress, newPressList])

  return (
    <>
      <p>Size Limit: {listSize + " / "}20 MB</p>
      <div id={styles.press_upload}>
        {
          trackPress.length > 0 ?
            trackPress.map((item, index) => {
              // return <p key={index}>{item.file.originalname}</p>
              return <ImageFrame key={index} id={item._id} blob={item.file.buffer} removePress={removePress} />
            })
            :
            []
        }
        {
          newPressList.length > 0 ?
            newPressList.map((item, index) => {
              // return <p key={index}>{item.file.originalname}</p>
              return <NewImageFrame key={index} id={index} blob={item} removePress={removeNewPress} />
            })
            :
            []
        }
        <div id={styles.add_press} {...getRootProps()}>
          <input {...getInputProps()} />
          <div>Add Photo</div>
        </div>
      </div>
    </>
  )
}

export default PressEdit