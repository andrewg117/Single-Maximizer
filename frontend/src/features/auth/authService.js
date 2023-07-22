import axios from "axios"
import jwt_decode from 'jwt-decode'

const API_URL = '/api/users/'

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

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

const reset = async (userData) => {
  const response = await axios.put(API_URL + 'reset', userData)

  return response.data
}

const getUser = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  let response

  response = await axios.get(API_URL + 'me', config)

  return response.data
}

const update = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  let response

  response = await axios.put(API_URL + 'me', userData, config)

  return response.data
}

const checkToken = (token) => {
  if (!token) {
    return true
  }

  const decodedToken = jwt_decode(token)
  const currentTime = Date.now() / 1000

  return decodedToken.exp < currentTime
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