const { Client } = require('pg')

const pg = new Client({
  user: 'me',
  password: 'password',
  database: 'bigalDB'
})

//connect to the database
pg.connect((err) => {
  if (err) {
    console.error('connection error', err)
  } else {
    console.log('connected to: ' + pg.database)
  }
})

module.exports = pg;
