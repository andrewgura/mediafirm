var express = require('express');
var router = express.Router();
var pg = require("../../database.js")


//Used for NewAd Screen, get spenders related to district
router.get('/spenders:id', async function(req, res) {

  var id = req.params.id;
  const spenders = await pg.query('SELECT * from spenders WHERE districtid = $1', [id]);
  res.json({spenders: spenders.rows})
})

//Used for EditAd Screen, get current spender on top
router.get('/spenders:id/current:current', async function(req, res) {

  var id = req.params.id;
  var current = req.params.current;

  const spenders = await pg.query('SELECT * from spenders WHERE districtid = $1 ORDER BY spenderid = $2 DESC', [id, current]);
  res.json({spenders: spenders.rows})
})


//Used for EditMediaBuy screen for current selected spender to be on top
router.get('/spenders:id/district:district', async function(req, res) {

  var id = req.params.id;
  var district = req.params.district;

  const spenders = await pg.query('SELECT * from spenders WHERE districtid = $1 ORDER BY spenderid = $2 DESC', [district, id]);
  res.json({spenders: spenders.rows})
})

router.post('/spenders', async function(req, res) {
try{
  await pg.query(
      `INSERT INTO spenders (spender, abbrev, districtid, fedcommitteeid, fedcandidateid) VALUES
      ($1, $2, $3, 1, 1)`,
      [req.body.spender, req.body.abbrev, req.body.districtid])
      res.sendStatus(200);
  } catch(e){
    console.log(e);
    res.sendStatus(400)
  }
})



module.exports = router;
