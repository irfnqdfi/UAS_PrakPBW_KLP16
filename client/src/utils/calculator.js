// BMR / TDEE / Macro calculator (client-side mirror of backend)
export const calcBMR = (gender, weight, height, age) => {
  const base = 10 * weight + 6.25 * height - 5 * age
  return gender === 'male' ? base + 5 : base - 161
}

export const activityMultipliers = {
  sedentary:          { label: 'Tidak Aktif (kerja kantoran)',     val: 1.2   },
  lightly_active:     { label: 'Aktif Ringan (olahraga 1-3x/mgg)', val: 1.375 },
  moderately_active:  { label: 'Aktif Sedang (olahraga 3-5x/mgg)', val: 1.55  },
  very_active:        { label: 'Sangat Aktif (olahraga 6-7x/mgg)', val: 1.725 },
  extra_active:       { label: 'Ekstra Aktif (atlet / kerja berat)', val: 1.9  },
}

export const goalLabels = {
  bulking:    { label: 'Bulking',    color: 'badge-blue',   desc: '+300 kcal surplus' },
  cutting:    { label: 'Cutting',    color: 'badge-red',    desc: '-400 kcal defisit' },
  maintaining:{ label: 'Maintaining',color: 'badge-green',  desc: 'Maintenance calories' },
}

export const categoryLabels = {
  chest:     'Dada',
  back:      'Punggung',
  legs:      'Kaki',
  shoulders: 'Bahu',
  arms:      'Lengan',
  cardio:    'Kardio',
  full_body: 'Full Body',
}

export const reminderTypeLabels = {
  workout:        { label: 'Latihan',       icon: '🏋️', color: 'badge-blue'   },
  water:          { label: 'Minum Air',     icon: '💧', color: 'badge-blue'   },
  protein:        { label: 'Protein',       icon: '🥩', color: 'badge-red'    },
  progress_check: { label: 'Cek Progress',  icon: '📊', color: 'badge-purple' },
}
