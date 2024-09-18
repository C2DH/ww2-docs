import axios from 'axios'
import { useEffect, useState } from 'react'

const App = () => {
  const [data, setData] = useState(null)
  useEffect(() => {
    console.log('useEffect')

    axios.get('/api/document').then((res) => {
      console.log('res', res)
      setData(res.data)
    })
  }, [])
  return (
    <div>
      <h1>ww2</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default App
