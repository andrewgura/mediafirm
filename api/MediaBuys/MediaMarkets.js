var express = require('express');
var router = express.Router();
const { Client } = require('pg')
var pg = require("../../database.js")

router.get('/mediamarkets', async function(req, res) {
  const mediamarkets = await pg.query('SELECT marketid, market FROM mediamarkets ORDER BY market');
  res.json({mediamarkets: mediamarkets.rows})
})

router.get('/mediamarkets:id', async function(req, res) {
  var id = req.params.id;
  const mediamarkets = await pg.query('SELECT marketid, market from mediamarkets ORDER BY marketid = $1 DESC', [id]);
  res.json({mediamarkets: mediamarkets.rows})
})

module.exports = router;
