// ImageUpload.js
import { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

const ImageUpload = ({ type }) => {
  const [selectedImage, setSelectedImage] = useState(null)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.png']
    },
    onDrop: (acceptedFiles) => {
      setSelectedImage({
        file: acceptedFiles[0],
        url: URL.createObjectURL(acceptedFiles[0])
      })
    }
  });

  // const handleImageUpload = async (e) => {
  //   e.preventDefault()
  //   try {
  //     const formData = new FormData()
  //     formData.append('image', selectedImage)

  //     // await axios.post('/upload', formData)

  //     // Reset selected image state
  //     setSelectedImage(null)

  //     alert('Image uploaded successfully.')
  //   } catch (error) {
  //     console.error('Error uploading image:', error)
  //     alert('Error uploading image.')
  //   }
  // }

  useEffect(() => {
    if (selectedImage) {
      console.log(selectedImage)

      return () => {
        URL.revokeObjectURL(selectedImage.url)
      }
    }
  }, [selectedImage])

  return (
    <div>
      <div {...getRootProps()} hidden={selectedImage}>
        <input {...getInputProps()} />
        <p>Drag and drop an image here, or click to select an image</p>
      </div>
      {
        selectedImage !== null ?
          <img src={selectedImage.url} alt="Upload Track Cover" disabled={!selectedImage} hidden={!selectedImage} onLoad={() => { URL.revokeObjectURL(selectedImage.url) }} />
          :
          <></>
      }
    </div>
  )
}

export default ImageUpload
