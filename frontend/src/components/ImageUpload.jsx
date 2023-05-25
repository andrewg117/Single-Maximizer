// ImageUpload.js
import { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from '../css/new_release_style.module.css'

const ImageUpload = ({ changeFile, file }) => {

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.png']
    },
    onDrop: (acceptedFiles) => {
      let formData = new FormData();
      formData.append('trackCover', acceptedFiles[0])
      console.log(formData.get('trackCover'))
      changeFile(formData)
    }
  });

  // const handleImageUpload = async (e) => {
  //   e.preventDefault()
  //   try {
  //     const formData = new FormData()
  //     formData.append('image', file)

  //     // await axios.post('/upload', formData)

  //     // Reset selected image state
  //     changeFile(null)

  //     alert('Image uploaded successfully.')
  //   } catch (error) {
  //     console.error('Error uploading image:', error)
  //     alert('Error uploading image.')
  //   }
  // }

  useEffect(() => {
    if (file) {

      return () => {
        URL.revokeObjectURL(URL.createObjectURL(file.get('trackCover')))
        changeFile(null)
      }
    }
  }, [file, changeFile])

  return (
    <div id={styles.image_div}>
      <div {...getRootProps()} hidden={file}>
        <input {...getInputProps()} />
        <p>Drag and drop or click to upload cover art</p>
      </div>
      {
        file !== null ?
          <>
            <img src={URL.createObjectURL(file.get('trackCover'))} alt="Upload Track Cover" disabled={!file} hidden={!file} onLoad={() => { URL.revokeObjectURL(URL.createObjectURL(file.get('trackCover'))) }} />
            <div
              id={styles.remove_image}
              onClick={(e) => changeFile(null)}>
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
