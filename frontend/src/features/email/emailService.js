import axios from "axios"

const NODE_ENV = process.env.NODE_ENV
const RENDER_API_URL = process.env.RENDER_API_URL + '/api/email/'
const API_URL = '/api/email/'

const sendEmail = async (emailData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(API_URL, emailData, config)

  return response.data
}

const emailService = {
  sendEmail
}

export default emailService