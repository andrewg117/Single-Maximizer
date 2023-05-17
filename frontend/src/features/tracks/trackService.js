import axios from "axios"
import authService from "../auth/authService"

const API_URL = '/api/tracks/'

const createTrack = async (trackData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  let response

  if (!authService.checkToken(token)){
    response = await axios.post(API_URL, trackData, config)
  }

  return response.data
}

const getTrack = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  
  let response

  if (!authService.checkToken(token)){
    response = await axios.get(API_URL, config)
  }

  return response.data
}

const getSingle = async (trackId, token) => {
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

const updateSingle = async (id, trackData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  let response

  if (!authService.checkToken(token)){
    response = await axios.put(API_URL + id, trackData, config)
  }

  return response.data
}

const deleteTrack = async (trackId, token) => {
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

const trackService = {
  createTrack,
  getTrack,
  getSingle,
  updateSingle,
  deleteTrack
}


export default trackService