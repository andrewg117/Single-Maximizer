import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from '../css/new_release_style.module.css'

const ImageUpload = ({ changeFile, file, isEdit, setEdit }) => {

  const [blob, getBlob] = useState(useCallback(() => {
    if (file && !isEdit) {
      return URL.createObjectURL(file.get('trackCover'))
    } else if (isEdit === true) {
      return file
    }
  }, [file, isEdit]))

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.png']
    },
    onDrop: async (acceptedFiles) => {
      let formData = new FormData()
      formData.append('trackCover', acceptedFiles[0])

      getBlob(URL.createObjectURL(formData.get('trackCover')))
      changeFile(formData)
    }
  });

  useEffect(() => {
    if (isEdit === true) {
      getBlob(file)
    }
    return () => {
      URL.revokeObjectURL(blob)
    }
  }, [blob, file, isEdit])

  return (
    <div id={styles.image_div}>
      <div {...getRootProps()} hidden={file}>
        <input {...getInputProps()} />
        <p>Drag and drop or click to upload cover art</p>
      </div>
      {
        file !== null ?
          <>
            {isEdit === true ? <img src={`data:image/*;base64,${blob}`} alt='Cover' /> : <img src={blob} alt="Upload Track Cover" disabled={!file} hidden={!file} onLoad={() => { URL.revokeObjectURL(blob) }} />}
            {/* <img src={blob} alt="Upload Track Cover" disabled={!file} hidden={!file} onLoad={() => { URL.revokeObjectURL(blob) }} /> */}
            {/* <img src={`data:image/*;base64,${blob}`} alt='Upload Track Cover'  /> */}
            <div
              id={styles.remove_image}
              onClick={(e) => {
                setEdit(false)
                changeFile(null)
              }}>
              X
            </div>
          </>
          :
          <></>
      }
    </div>
  )
}

export default ImageUpload
