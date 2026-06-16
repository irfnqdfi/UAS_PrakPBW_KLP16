import api from './api'
export const profileService = {
  update:         (data) => api.put('/profile', data),
  changePassword: (data) => api.put('/profile/password', data),
}
