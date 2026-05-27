import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api/flights'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const flightService = {
  save: async (flightData) => {
    const response = await apiClient.post('', flightData)
    return response.data
  },

  list: async () => {
    const response = await apiClient.get('')
    return response.data
  },

  findByCode: async (code) => {
    const response = await apiClient.get(`/code/${code}`)
    return response.data
  },

  findByCarrier: async (carrier) => {
    const response = await apiClient.get(`/carrier/${carrier}`)
    return response.data
  },

  findByRoute: async (source, destination) => {
    const response = await apiClient.get(`/route`, {
      params: { source, destination },
    })
    return response.data
  },

  findByPriceRange: async (min, max) => {
    const response = await apiClient.get(`/price`, {
      params: { min, max },
    })
    return response.data
  },

  deleteFlight: async (code) => {
    const response = await apiClient.delete(`/${code}`)
    return response.data
  },
}
