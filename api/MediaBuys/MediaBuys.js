var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
var pg = require("../../database.js")

/**

Media Buys

**/
var date = new Date();
var datesubmitted = date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
var timestamp = datesubmitted + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()

//Get All related to district
router.get('/mediabuysdistrict:id', async function(req, res) {
  var id = req.params.id;
  const mediabuys = await pg.query(`
    SELECT
         m.mediabuyid,
         m.startdate,
         m.enddate,
         m.status,
         ad.description,
         ad.adid,
         m.spenderid,
         m.electiontype,
    	   ad.description,
         s.spender
     FROM
         mediabuys m,
         spenders s,
    	   ads ad,
         districts d
     WHERE m.spenderid = s.spenderid
     AND m.districtid = d.districtid
     AND d.districtid = $1
	 AND m.adid = ad.adid
     ORDER BY m.mediabuyid`, [id]);
  res.json({mediabuys: mediabuys.rows})
})

//Get All related to mediamarket
router.get('/mediabuysmarket:id', async function(req, res) {
  var id = req.params.id;
  const mediabuys = await pg.query(`
    SELECT
         m.mediabuyid,
         m.startdate,
         m.enddate,
         m.status,
         ad.description,
         ad.adid,
         m.spenderid,
         m.electiontype,
    	   ad.description,
         s.spender
     FROM
         mediabuys m,
         spenders s,
    	   ads ad
     WHERE m.spenderid = s.spenderid
     AND m.marketid = $1
	 AND m.adid = ad.adid
     ORDER BY m.mediabuyid`, [id]);
  res.json({mediabuys: mediabuys.rows})
})

//Create New
router.post('/mediabuys', async function(req, res) {
  var status = "Regular";

  if(req.body.marketid > 0) {
    status = "Reserved"
  }

try{
  await pg.query(
      `INSERT INTO MediaBuys (spenderid, districtid, startdate, enddate, total, status, datesubmitted, datecreated, adid, districttype, inactive, electiontype, marketid) VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9,'random', 0, $10, $11)`,
      [req.body.spenderid, req.body.districtid, req.body.start, req.body.end, 1, status, datesubmitted, timestamp, req.body.ad, req.body.type, req.body.marketid])
      res.sendStatus(200);
  } catch(e){
    console.log(e);
    res.sendStatus(400)
  }
})

//Get one
router.get('/mediabuy:id', async function(req, res) {
  var id = req.params.id
  const mediabuys = await pg.query(`
    SELECT
      m.startdate,
      m.enddate,
      s.spender
    FROM mediabuys m,
    spenders s
    WHERE m.mediabuyid = $1
    AND m.spenderid = s.spenderid
    `, [id]);
  res.json({mediabuys: mediabuys.rows})
})

//Update one
router.put('/mediabuys:id', async function(req, res) {
  var id = req.params.id;
  try{
      await pg.query(`
          UPDATE mediabuys
          SET adid=$2, spenderid=$3
          WHERE mediabuyid=$1`,[id, req.body.adid, req.body.spenderid]);

    res.sendStatus(200)
  } catch(e){
    console.log(e)
    res.sendStatus(400)
  }
})

router.delete('/mediabuys:id', async function(req, res) {
  var id = req.params.id

  try{
    await pg.query(`DELETE from buydetailbreakdown WHERE mediabuyid = $1`,[id]);
    await pg.query(`DELETE from mediabuydetailsday WHERE mediabuyid = $1`,[id]);
    await pg.query(`DELETE from mediabuytype WHERE mediabuyid = $1`,[id]);
    await pg.query(`DELETE from mediabuys WHERE mediabuyid = $1`,[id]);
    res.sendStatus(200);
  } catch(e) {
    console.log(e);
    res.sendStatus(400);
  }

})

module.exports = router;
