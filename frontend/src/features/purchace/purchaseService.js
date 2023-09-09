import axios from "axios"

const NODE_ENV = process.env.NODE_ENV
const RENDER_API_URL = process.env.RENDER_API_URL + '/api/purchase/'
const API_URL = NODE_ENV === 'production' ? RENDER_API_URL : '/api/purchase/'

const makePurchase = async () => {

  let response
  response = await axios.post(API_URL, { 'test': 'test' })

  return response.data
}


const getPurchase = async () => {

  let response
  response = await axios.get(API_URL)


  return response.data
}

const purchaseService = {
  makePurchase,
  getPurchase,
}

export default purchaseService