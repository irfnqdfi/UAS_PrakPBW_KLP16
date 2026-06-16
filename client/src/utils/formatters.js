export const fmtDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

export const fmtDateTime = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export const fmtNum = (n, decimals = 1) =>
  n != null ? Number(n).toFixed(decimals) : '-'

export const fmtKcal = (n) =>
  n != null ? `${Math.round(n)} kcal` : '-'

export const fmtKg = (n) =>
  n != null ? `${fmtNum(n)} kg` : '-'

export const fmtPct = (n) =>
  n != null ? `${fmtNum(n)}%` : '-'

export const fmtLiter = (n) =>
  n != null ? `${fmtNum(n)} L` : '-'

export const fmtCm = (n) =>
  n != null ? `${fmtNum(n)} cm` : '-'
