import api from './api'
export const reminderService = {
  getAll:  ()         => api.get('/reminders'),
  create:  (data)     => api.post('/reminders', data),
  update:  (id, data) => api.put(`/reminders/${id}`, data),
  remove:  (id)       => api.delete(`/reminders/${id}`),
}
