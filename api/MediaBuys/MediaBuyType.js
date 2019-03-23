var express = require('express');
var router = express.Router();
var pg = require("../../database.js")

/**

Media Buy Type

**/
//Get one mediabuytype for editing
router.get('/mediabuytype:id', async function(req, res) {
  var id = req.params.id;
  const mediabuytype = await pg.query('SELECT * FROM mediabuytype WHERE mediabuytypeid = $1', [id]);
  res.json({mediabuytype: mediabuytype.rows})
})

//Mediabuytype thats tied to mediabuy
router.get('/mediabuytype/mediabuy:id', async function(req, res) {
  var id = req.params.id;
  const mediabuytype = await pg.query(`
  SELECT
    t.mediabuytypeid,
    s.scheduletype,
    t.mediatype,
    t.marketid,
    m.market,
    t.total
  FROM
    mediabuytype t,
    mediamarkets m,
    mediascheduletypes s
  WHERE
    t.marketid = m.marketid
  AND
    s.scheduletypeid = t.scheduletype
  AND
    mediabuyid = $1
  ORDER BY datecreated`, [id]);
  res.json({mediabuytype: mediabuytype.rows})
})

router.put('/mediabuytype:id', async function(req, res) {
  var id = req.params.id;
  try{
      await pg.query(`
        UPDATE mediabuytype
        SET scheduletype=$2, mediatype=$3, marketid=$4, total=$5
        WHERE mediabuytypeid=$1`,[id, req.body.scheduletype, req.body.mediatype, req.body.marketid, req.body.total]);
      res.sendStatus(200)
  } catch(e) {
    console.log(e)
      res.sendStatus(400)
  }
})

//Create New
router.post('/mediabuytype', async function(req, res) {
  var spenderid = Math.floor(Math.random() * 500) + 1;

  var date = new Date();
  var datesubmitted = date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  var timestamp = datesubmitted + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()

try{
  await pg.query(
      `INSERT INTO mediabuytype (mediabuyid, scheduletype, mediatype, marketid, total, datesubmitted, datecreated, inactive)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 0)`,
      [req.body.mediabuyId, 1, req.body.mediatype, req.body.marketid, req.body.total, datesubmitted, timestamp])

      res.sendStatus(200);
  } catch(e){
    console.log(e);
    res.sendStatus(400)
  }
})

router.delete('/mediabuytype:id', async function(req, res) {
  var id = req.params.id;
  try{
    await pg.query(`DELETE FROM mediabuydetailsday WHERE mediabuytypeid = $1`,[id])
    await pg.query(`DELETE from mediabuydetails WHERE mediabuytypeid = $1`,[id]);
    await pg.query(`DELETE from mediabuytype WHERE mediabuytypeid = $1`,[id]);
    res.sendStatus(200)
  } catch(e){
    console.log(e)
    res.sendStatus(400)
  }
})

module.exports = router;
