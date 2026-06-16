import api from './api'
export const workoutService = {
  getAll:  (params)   => api.get('/workouts', { params }),
  getOne:  (id)       => api.get(`/workouts/${id}`),
  create:  (data)     => api.post('/workouts', data),
  update:  (id, data) => api.put(`/workouts/${id}`, data),
  remove:  (id)       => api.delete(`/workouts/${id}`),
}
