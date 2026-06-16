import api from './api'
export const measurementService = {
  getAll:  ()         => api.get('/measurements'),
  getOne:  (id)       => api.get(`/measurements/${id}`),
  create:  (data)     => api.post('/measurements', data),
  update:  (id, data) => api.put(`/measurements/${id}`, data),
  remove:  (id)       => api.delete(`/measurements/${id}`),
}
