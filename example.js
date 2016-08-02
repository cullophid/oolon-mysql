const query = require('./')(process.env.MYSQL_URL)

query("SELECT * FROM mytable", [])
  .then((res) => console.log(res))
  .catch((err) => console.log(err))
