import axios from "axios"
import authService from "../auth/authService"

const API_URL = '/api/image/'

const postImage = async (imageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  let response

  if (!authService.checkToken(token)){
    response = await axios.post(API_URL, imageData, config)
  }

  return response.data
}

const postPress = async (pressData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  let response

  if (!authService.checkToken(token)){
    response = await axios.post(API_URL + 'press', pressData, config)
  }

  return response.data
}


const getImage = async (imageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      ...imageData
    }
  }

  let response
  if (!authService.checkToken(token)){
    response = await axios.get(API_URL, config)
  }

  return response.data
}

const getPress = async (pressData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      ...pressData
    }
  }

  let response
  if (!authService.checkToken(token)){
    response = await axios.get(API_URL + 'press', config)
  }

  return response.data
}

const updateImage = async (imageData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    },
  }

  let response

  if (!authService.checkToken(token)){
    response = await axios.put(API_URL + imageData, imageData, config)
  }

  return response.data
}

const deleteImage = async (trackID, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  let response

  if (!authService.checkToken(token)){
    response = await axios.delete(API_URL + trackID, config)
  }

  return response.data
}

const imageService = {
  postImage,
  postPress,
  getImage,
  getPress,
  updateImage,
  deleteImage
}

export default imageService