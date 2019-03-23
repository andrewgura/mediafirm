var express = require('express');
var router = express.Router();
const { Client } = require('pg')
var pg = require("../../database.js")

//Used for NewBuyDetail to get all stations related to the market
router.get('/stations:id/type:type', async function(req, res) {
  var id = req.params.id;
  var type = req.params.type;

  const stations = await pg.query('SELECT * from stations WHERE market = $1 AND type = $2', [id, type]);
  res.json({stations: stations.rows})
})

router.post('/stations', async function(req, res) {
try{
  await pg.query(
      `INSERT INTO stations (type, market, station, affiliate, repid, dmacode) VALUES
      ($1, $2, $3, $4, $5, $6)`,
      [req.body.type, req.body.market, req.body.name, req.body.affiliate, 0, 0])
      res.sendStatus(200);
  } catch(e){
    console.log(e);
    res.sendStatus(400)
  }
})

//Used for editmediabuydetail to set current station as first result
router.get('/stations:id/current:station', async function(req, res) {
  var id = req.params.id;
  var station = req.params.station;
  const stations = await pg.query('SELECT * from stations WHERE market = $1 ORDER BY stationid = $2 DESC', [id, station]);
  res.json({stations: stations.rows})
})

module.exports = router;
