import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from '../css/new_release_style.module.css'

const ImageUpload = ({ changeFile, file, fieldname, altText }) => {
  const [isEdit, setEdit] = useState(true)

  const makeBlob = useCallback(() => {
    if (file && !isEdit) {
      return URL.createObjectURL(file.get('Image'))
    } else if (isEdit === true) {
      return file
    }
  }, [file, isEdit])

  const [blob, getBlob] = useState(makeBlob())

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.png']
    },
    onDrop: async (acceptedFiles) => {
      let formData = new FormData()
      formData.append('Image', acceptedFiles[0])

      setEdit(false)

      getBlob(URL.createObjectURL(formData.get('Image')))
      
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
      <div {...getRootProps()} hidden={file}>
        <input {...getInputProps()} />
        <p>Drag and drop or click to upload image</p>
      </div>
      {
        file ?
          <>
            {isEdit === true ?
              <img src={`data:image/*;base64,${makeBlob()}`} alt={altText} />
              // <img src={makeBlob()} alt={altText}  onLoad={() => { URL.revokeObjectURL(blob) }} />
              :
              <img src={makeBlob()} alt={altText} onLoad={() => { URL.revokeObjectURL(blob) }} />
            }
            <div
              id={styles.remove_image}
              onClick={(e) => {
                setEdit(false)
                changeFile((prevState) => ({
                  ...prevState,
                  [fieldname]: null
                }))
              }}>
              X
            </div>
          </>
          :
          <></>
      }
    </>
  )
}

export default ImageUpload
