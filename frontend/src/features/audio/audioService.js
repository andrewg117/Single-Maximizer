import axios from "axios"
import authService from "../auth/authService"

const API_URL = '/api/audio/'

const postAudio = async (audioData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  let response

  if (!authService.checkToken(token)){
    response = await axios.post(API_URL, audioData, config)
  }

  return response.data
}

const getAudio = async (trackId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  let response

  if (!authService.checkToken(token)){
    response = await axios.get(API_URL + trackId, config)
  }

  return response.data
}

const updateAudio = async (audioData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  let response

  if (!authService.checkToken(token)){
    response = await axios.put(API_URL + audioData, audioData, config)
  }

  return response.data
}

const deleteAudio = async (trackId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  let response

  if (!authService.checkToken(token)){
    response = await axios.delete(API_URL + trackId, config)
  }

  return response.data
}

const audioService = {
  postAudio,
  getAudio,
  updateAudio,
  deleteAudio
}


export default audioService