import axios from "axios"
import jwt_decode from 'jwt-decode'

const NODE_ENV = process.env.NODE_ENV
const RENDER_API_URL = process.env.RENDER_API_URL + '/api/users/'
const API_URL = NODE_ENV === 'production' ? RENDER_API_URL : '/api/users/'

const register = async (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

const emailUser = async (userData) => {
  if(userData.type === 'reset') {
    const response = await axios.post(API_URL + 'reset', userData)
  
    return response.data
  } else if (userData.type === 'register') {
    const response = await axios.post(API_URL + 'email', userData)
  
    return response.data
  }
}

const emailData = async (token) => {
  const response = await axios.get(API_URL + 'email/' + token.toString())
  // console.log(token)
  return response.data
}

const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)
  console.log(NODE_ENV)
  console.log(RENDER_API_URL)
  console.log(API_URL)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

const reset = async (userData) => {
  const response = await axios.put(API_URL + 'reset', userData)

  return response.data
}

const getUser = async () => {

  let response

  response = await axios.get(API_URL + 'me')

  return response.data
}

const update = async (userData) => {

  let response

  response = await axios.put(API_URL + 'me', userData)

  return response.data
}

const checkToken = async () => {

  let response

  response = await axios.get(API_URL + 'token')
  // console.log(response.status)
  if (response.status === 401) {
    localStorage.removeItem('user')
  }

  return response.data
}

const logout = async () => {
  const response = await axios.post(API_URL + 'logout')

  if (response.data) {
    localStorage.removeItem('user')
  }

  return response.data
}

const authService = {
  register,
  emailUser,
  emailData,
  login,
  reset,
  getUser,
  update,
  checkToken,
  logout,
}


export default authService