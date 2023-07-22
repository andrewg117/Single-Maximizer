import axios from "axios"

const API_URL = '/api/purchase/'

const makePurchase = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }

  let response
  response = await axios.post(API_URL, { 'test': 'test' }, config)


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
  response = await axios.get(API_URL, config)


  return response.data
}

const purchaseService = {
  makePurchase,
  getPurchase,
}

export default purchaseService