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

const imageService = {
  postImage,
}


export default imageService