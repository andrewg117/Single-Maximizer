import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from '../css/new_release_style.module.css'

const ImageUpload = ({ changeFile, file, fieldname, url, urlField, altText }) => {
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
      let megBytes = Math.round((acceptedFiles[0].size / 1024 ** 2) * 100) / 100
      megBytes = megBytes.toString() + ' MB'
      formData.append('size', megBytes)

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
      <div {...getRootProps()} hidden={file || url}>
        <input {...getInputProps()} />
        <p>Drag and drop or click to upload image</p>
      </div>
      {url !== '' ?
        <>
          <img src={url} alt={altText} onLoad={() => { URL.revokeObjectURL(blob) }} />
          <div
            id={styles.remove_image}
            onClick={(e) => {
              setEdit(false)
              changeFile((prevState) => ({
                ...prevState,
                [fieldname]: null,
                [urlField]: ''
              }))
            }}>
            X
          </div>
        </>
        :
        <></>
      }
      {
        file ?
          <>
            <img src={makeBlob()} alt={altText} onLoad={() => { URL.revokeObjectURL(blob) }} />
            <p>{file instanceof FormData ? file.get('Image').name : ''}</p>
            <p>{file instanceof FormData ? 'Size: ' + file.get('size') : ''}</p>
            <div
              id={styles.remove_image}
              onClick={(e) => {
                setEdit(false)
                changeFile((prevState) => ({
                  ...prevState,
                  [fieldname]: null,
                  [urlField]: ''
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
