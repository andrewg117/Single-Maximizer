import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from '../css/new_release_style.module.css'

const ImageUpload = ({ changeFile, file, fieldname, altText, isEdit, setEdit }) => {

  const [blob, getBlob] = useState(useCallback(() => {
    if (file && !isEdit) {
      return URL.createObjectURL(file.get(fieldname))
    } else if (isEdit === true) {
      return file
    }
  }, [file, isEdit, fieldname]))

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.png']
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
    }
  }, [blob, file, isEdit])

  return (
    <>
      <div {...getRootProps()} hidden={file}>
        <input {...getInputProps()} />
        <p>Drag and drop or click to upload image</p>
      </div>
      {
        file !== null ?
          <>
            {isEdit === true ? <img src={`data:image/*;base64,${blob}`} alt={altText} /> : <img src={blob} alt={altText} disabled={!file} hidden={!file} onLoad={() => { URL.revokeObjectURL(blob) }} />}
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
