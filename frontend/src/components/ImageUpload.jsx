import { useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaEdit } from 'react-icons/fa'
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
      <div id={styles.image_upload_div} {...getRootProps()}>
        <input {...getInputProps()} />
        <p hidden={file}>Drag and drop or click to upload image</p>
        {
          file ?
            <>
              {isEdit === true ?
                <>
                  <img src={`data:image/*;base64,${makeBlob()}`} alt={altText} />
                  <FaEdit className={styles.edit_image} />
                </>
                :
                <>
                  <img src={makeBlob()} alt={altText} onLoad={() => { URL.revokeObjectURL(blob) }} />
                  <FaEdit className={styles.edit_image} />
                  {/* <p>{file instanceof FormData ? file.get('Image').name : ''}</p>
                  <p>{file instanceof FormData ? 'Size: ' + file.get('size') : ''}</p> */}
                </>
              }
            </>
            :
            <></>
        }
      </div>

    </>
  )
}

export default ImageUpload
