import { useState } from 'react'
import urls from './urls.json'
import sha256 from 'crypto-js/sha256'

/**
 * Renders the main application component.
 *
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  const [urlItems] = useState(
    urls.map((d) => {
      const absoluteUrl = window.location.origin + d.url
      const absoluteUrlObject = new URL(absoluteUrl)
      const hash = sha256(absoluteUrlObject.searchParams.toString()).toString()

      // add the hash to the url a  s h parameter
      const urlWithHash = new URL(absoluteUrl)
      if (absoluteUrlObject.search.length > 0) {
        urlWithHash.searchParams.append('h', hash)
      }
      return {
        url: absoluteUrl,
        urlWithHash: urlWithHash.toString(),
        description: d.description,
        hash,
      }
    })
  )

  const exampleCode = `
    import sha256 from 'crypto-js/sha256' 
    const hash = sha256(absoluteUrlObject.searchParams.toString()).toString()
  `

  return (
    <div>
      <h2>Api endpoints</h2>
      <ul>
        {urlItems.map((item, index) => (
          <li key={index}>
            <h3>{item.description}</h3>
            <a href={item.urlWithHash}>{item.urlWithHash}</a>
          </li>
        ))}
      </ul>

      <h2>Debug</h2>
      <pre>{exampleCode}</pre>
    </div>
  )
}

export default App
