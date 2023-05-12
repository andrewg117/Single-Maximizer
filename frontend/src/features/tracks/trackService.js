import axios from "axios"

const API_URL = '/api/tracks/'

const createTrack = async (trackData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(API_URL, trackData, config)

  return response.data
}

const getTrack = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(API_URL, config)

  return response.data
}

const getSingle = async (trackId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(API_URL + trackId, config)

  return response.data
}

const deleteTrack = async (trackId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.delete(API_URL + trackId, config)

  return response.data
}

const trackService = {
  createTrack,
  getTrack,
  getSingle,
  deleteTrack
}


export default trackService