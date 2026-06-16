import api from './api'
export const goalService = {
  getAll:  ()         => api.get('/goals'),
  getOne:  (id)       => api.get(`/goals/${id}`),
  create:  (data)     => api.post('/goals', data),
  update:  (id, data) => api.put(`/goals/${id}`, data),
  remove:  (id)       => api.delete(`/goals/${id}`),
}
