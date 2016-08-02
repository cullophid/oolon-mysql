const Url = require('url')
const curry = require('lodash.curry')
const mysql = require('mysql')

const getOptions = (url) => {
  const { hostname, port, path, auth } = Url.parse(url)
  const [user, password] = auth.split(':')
  return {
    connectionLimit: 10,
    host: hostname,
    user: user,
    port: port,
    password: password,
    database: path ? path.slice(1) : undefined
  }
}

module.exports = (url) => {
  connectionPool = mysql.createPool(getOptions(url))

  const exitWithError = (err) => {
    console.log('CONNECTION ERROR', err.stack || err)
    return process.exit(1)
  }

  return curry((query, params) => {
    return new Promise((resolve, reject) => {
      connectionPool.getConnection((err, conn) => {
        if (err) return exitWithError(err)
        conn.query(query, params, (err, result) => {
          if (err) reject(err)
          resolve(result)
        })
      })
    })
  })
}
