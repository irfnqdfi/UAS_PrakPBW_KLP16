import api from './api'
export const nutritionService = {
  getAll:  ()         => api.get('/nutrition'),
  getOne:  (id)       => api.get(`/nutrition/${id}`),
  create:  (data)     => api.post('/nutrition', data),
  update:  (id, data) => api.put(`/nutrition/${id}`, data),
  remove:  (id)       => api.delete(`/nutrition/${id}`),
}
