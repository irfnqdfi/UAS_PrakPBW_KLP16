import { useState, useEffect } from 'react'

// Generic hook untuk fetch data dari API
const useFetch = (fetchFn, deps = []) => {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const refetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchFn()
      setData(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refetch() }, deps)

  return { data, loading, error, refetch }
}

export default useFetch
