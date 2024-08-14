const path = require('path')
const crypto = require('crypto')
const debug = require('debug')('ww2')
const { mkdir, writeFile, readFile } = require('fs').promises
const axios = require('axios')
console.log('hello ❤️')

console.log('Usage example: `WW2_API_HOST=http://localhost npm run dev`')
console.log('ENV variables prefixed by WW2_:')
Object.entries(process.env)
  .filter((d) => d[0].indexOf('WW2_', 0) === 0)
  .forEach(([key, value]) => console.log(`- ${key}=${value}`))
console.log()
debug('hello from the debugger ❤️')

async function generateApiStaticFile(url, config) {
  const absoluteUrl = `${config.host}${url}`
  debug('\ngenerateApiStaticFile url:', absoluteUrl)
  // get hash of the ? part of the url
  // e.g. /story/?filters={"tags__slug":"theme"} -> hash of `filters={"tags__slug":"theme"}`
  const urlObject = new URL(absoluteUrl)
  const urlPath = urlObject.pathname
  debug('url path:', urlPath)
  const queryString = urlObject.searchParams.toString()
  debug('queryString:', queryString.length)
  const hash = crypto.createHash('sha256').update(queryString).digest('hex')
  debug('hash:', hash)
  let filepath =
    queryString.length > 1
      ? `${config.dist}/${urlPath}/${hash}.json`
      : `${config.dist}/${urlPath}/index.json`
  filepath = filepath.replace(/\/+/g, '/')
  debug('filepath:', filepath)
  // remove ownership
  const contents = await axios
    .get(absoluteUrl)
    .then((res) => res.data)
    .then((data) => {
      if (data.next) {
        data.next = data.next.replace(config.host, '')
      }
      if (data.previous) {
        data.previous = data.previous.replace(config.host, '')
      }
      if (data.results && Array.isArray(data.results)) {
        return {
          ...data,
          results: data.results.map((d) => {
            delete d.owner
            return d
          }),
        }
      } else if (data.owner) {
        delete data.owner
        delete data.url
      }
      return data
    })
  // print contents in corresponding filepath
  debug('writeFile...')
  // create missing directory recurively
  const dir = path.dirname(filepath)
  try {
    await mkdir(dir)
    debug('mkdir', dir)
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
  await writeFile(filepath, JSON.stringify(contents, null, 2))
  debug('writeFile done')
  return {
    url,
    hash,
    filepath: filepath.replace(config.dist, ''),
  }
}

async function buildApiFolders(config) {
  try {
    debug('buildApiFolders: mkdir', `${config.dist}/api`)
    await mkdir(`${config.dist}/api`)

    console.log('✔️ Successfully created api folder')
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
    debug('buildApiFolders: api folder already exists')
  }

  try {
    debug('buildApiFolders: mkdir', `${config.dist}/api/story`)
    await mkdir(`${config.dist}/api/story`)

    console.log('✔️ Successfully created api/story folder')
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
    debug('buildApiFolders: api/story folder already exists')
  }
  try {
    debug('buildApiFolders: mkdir', `${config.dist}/api/document`)
    await mkdir(`${config.dist}/api/document`)

    console.log('✔️ Successfully created api/document folder')
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
    debug('buildApiFolders: api/document folder already exists')
  }
}

async function prefetch() {
  debug('prefetch')
  const urlsPath =
    process.env.WW2_URLS_LIST_PATH ?? path.join(__dirname, './urls.json')

  const urlItems = await readFile(urlsPath, 'utf8').then(JSON.parse)

  const config = {
    dirname: __dirname,
    dist:
      process.env.WW2_API_STATIC_OUTPUT_PATH ??
      path.join(__dirname, '../public'),
    host: process.env.WW2_API_HOST ?? 'http://localhost/api',
    urls: urlItems.map((d) => d.url),
  }
  console.log(config)
  await buildApiFolders(config)
  const results = []

  for (const urlItem of urlItems) {
    console.log(
      results.length + 1,
      'of ',
      urlItems.length,
      '\n - url:',
      urlItem.url
    )
    const result = await generateApiStaticFile(urlItem.url, config)
    results.push({
      ...urlItem,
      hash: result.hash,
      url: urlItem.url.replace(/\%22/g, '"'),
    })
  }

  // save as json
  await writeFile(
    path.join(__dirname, '../docs/urls.json'),
    JSON.stringify(results, null, 2)
  )
  console.log('✔️ Successfully saved urls.json')
}

if (require.main === module) {
  prefetch()
}
