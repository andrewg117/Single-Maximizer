import axios from "axios"

const API_URL = '/api/users/'

const register = async  (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

const login = async  (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

const getUser = async  (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.get(API_URL + 'me', config)

  return response.data
}

const update = async  (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.put(API_URL + 'me', userData, config)

  return response.data
}


const logout = () => {
  localStorage.removeItem('user')
}

const authService = {
  register,
  login,
  getUser,
  update,
  logout,
}


export default authService