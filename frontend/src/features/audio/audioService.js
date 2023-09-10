import axios from "axios"

const NODE_ENV = process.env.NODE_ENV
const RENDER_API_URL = process.env.RENDER_API_URL + '/api/audio/'
const API_URL = '/api/audio/'

const postAudio = async (audioData) => {

  let response

  response = await axios.post(API_URL, audioData)
  

  return response.data
}

const getAudio = async (trackId) => {

  let response

  response = await axios.get(API_URL + trackId)
  

  return response.data
}

const updateAudio = async (audioData) => {

  let response

  response = await axios.put(API_URL + audioData, audioData)
  

  return response.data
}

const deleteAudio = async (trackId) => {

  let response

  response = await axios.delete(API_URL + trackId)
  

  return response.data
}

const audioService = {
  postAudio,
  getAudio,
  updateAudio,
  deleteAudio
}


export default audioService