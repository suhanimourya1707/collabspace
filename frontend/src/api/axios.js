import axios from 'axios'

const api = axios.create({
  baseURL: 'https://collabspace-production-90c8.up.railway.app',
})

export default api