import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from '../css/new_release_style.module.css'

const ImageFrame = ({ imageID, removePress }) => {
  return (
    <>
      <div id={styles.press_frame}>
        <p>{imageID}</p>
        <p id={styles.remove_press} onClick={(e) => removePress(e, imageID)}>
          X
        </p>
      </div>
    </>
  )
}

function PressUpload({ changeFile, files, fieldname, altText }) {
  const [ pressList, setList ] = useState(() => {return [1, 2, 3, 4, 5, 6]})

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

      setList(() => ({
        pressList: pressList.push(URL.createObjectURL(formData.get('Press')))
      }))

      // changeFile((prevState) => ({
      //   ...prevState,
      //   [fieldname]: [fieldname].push(URL.createObjectURL(formData.get('Press')))
      // }))
    }
  })

  const removePress = (e, item) => {
    e.preventDefault()
    // console.log(pressList.filter(i => i !== item))
    setList(pressList.filter(i => i !== item))
  }

  return (
    <div id={styles.press_upload}>
      {
        pressList.map((item) => {
          return <ImageFrame key={item} imageID={item} removePress={removePress} />
        })
      }
      <div id={styles.add_press}>
        <div>Add Photo</div>
        {/* <div>+</div> */}
      </div>
    </div>
  )
}

export default PressUpload