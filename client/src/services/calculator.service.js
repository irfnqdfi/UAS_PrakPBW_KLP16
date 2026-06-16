import api from './api'
export const calculatorService = {
  calculate: (data) => api.post('/calculator', data),
}
