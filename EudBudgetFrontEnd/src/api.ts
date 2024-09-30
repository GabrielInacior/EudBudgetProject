import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    console.log('Making request to', config.url)
    return config
  },
  (error) => {
    console.error('Request error', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    console.log('Response received')
    return response
  },
  (error) => {
    console.error('Response error', error)
    return Promise.reject(error)
  }
)

export default api
