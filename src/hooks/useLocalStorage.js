import { useEffect, useState } from 'react'
import Storage from '../storage/storage'

export default function useLocalStorage() {
  const [data, setData] = useState(null)
  useEffect(() => {
    Storage.loadAll().then(s => setData(s || []))
  }, [])
  return { data, setData }
}