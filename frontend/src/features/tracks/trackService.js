import axios from "axios"

const NODE_ENV = process.env.NODE_ENV
const RENDER_API_URL = process.env.RENDER_API_URL + '/api/tracks/'
const API_URL = NODE_ENV === 'production' ? RENDER_API_URL : '/api/tracks/'

const createTrack = async (trackData) => {

  let response

  response = await axios.post(API_URL, trackData)

  return response.data
}

const getTrack = async () => {
  
  let response

  response = await axios.get(API_URL)

  return response.data
}

const getSingle = async (trackId) => {

  let response

  response = await axios.get(API_URL + trackId)

  return response.data
}

const updateSingle = async (trackID, trackData) => {

  let response

  response = await axios.put(API_URL + trackID, trackData)


  return response.data
}

const deleteTrack = async (trackId) => {

  let response

  response = await axios.delete(API_URL + trackId)

  return response.data
}

const trackService = {
  createTrack,
  getTrack,
  getSingle,
  updateSingle,
  deleteTrack
}


export default trackService