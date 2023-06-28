import axios from "axios"
import authService from "../auth/authService"

const API_URL = '/api/purchase/'

const makePurchase = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }

  let response

  if (!authService.checkToken(token)) {
    response = await axios.post(API_URL, { 'test': 'test' }, config)
  }

  return response.data
}


const getPurchase = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }

  let response

  if (!authService.checkToken(token)) {
    response = await axios.get(API_URL, config)
  }

  return response.data
}

const purchaseService = {
  makePurchase,
  getPurchase,
}

export default purchaseService