var express = require('express');
var router = express.Router();
var pg = require("../../database.js")

//Get All Ads related to client with mediabuydetails
router.get('/allads:id', async function(req, res) {
  var id = req.params.id;
  const ads = await pg.query(`
    SELECT
      	ad.adid,
      	ad.description,
      	ad.mediaurl,
      	ad.type,
      	ad.support,
        buy.electiontype,
      	sum(day.amount) as amount,
      	sum(day.trps) as trps,
      	sum(day.spots) as spots,
      	min(day.date) as earliest,
      	max(day.date) as latest
    FROM
      	mediabuydetailsday day,
      	mediabuys buy,
      	ads ad
    WHERE ad.districtid = $1
      and buy.adid = ad.adid
      and buy.mediabuyid = day.mediabuyid
    GROUP BY ad.adid,
    buy.electiontype

  `, [id]);
  res.json({ads: ads.rows})
})

//Get All related to client
router.get('/districtads:id', async function(req, res) {
  var id = req.params.id;
  const ads = await pg.query(`
    SELECT
      	ad.*
    FROM
      	ads ad
    WHERE ad.districtid = $1
  `, [id]);
  res.json({ads: ads.rows})
})

//Get one Ad
router.get('/ads:id', async function(req, res) {
  var id = req.params.id
  const ads = await pg.query('SELECT * FROM ads WHERE adid = $1', [id]);
  res.json({ads: ads.rows})
})


//Get one Ad for Edit MediaBuy Screen
router.get('/ads:id/district:district', async function(req, res) {
  var id = req.params.id;
  var district = req.params.district;

  const ads = await pg.query('SELECT * from ads WHERE districtid = $1 ORDER BY adid = $2 DESC', [district, id]);
  res.json({ads: ads.rows})
})

router.get('/adBuy:id', async function(req, res) {
  var id = req.params.id
  const ads = await pg.query(`
    select
    	sum(day.amount) as amount,
    	sum(day.trps) as trps,
    	sum(day.spots) as spots,
    	min(day.date) as earliest,
    	max(day.date) as latest
    from
    mediabuydetailsday day,
    mediabuys buy,
    ads a
    WHERE buy.adid = a.adid
    and buy.mediabuyid = day.mediabuyid
    AND a.adid = $1`, [id]);
  res.json({ads: ads.rows})
})

router.post('/ads', async function(req, res) {
try{
  await pg.query(
      `INSERT INTO ads (description, mediaurl, type, support, districtid, spender) VALUES
      ($1, $2, $3, $4, $5, $6)`,
      [req.body.description, req.body.url, req.body.type, req.body.support, req.body.districtid, req.body.spenderid])
      res.sendStatus(200);
  } catch(e){
    console.log(e);
    res.sendStatus(400)
  }
})

//Update Ad
router.put('/ads:id', async function(req, res) {
  var id = req.params.id;
  try{
      await pg.query(`
        UPDATE ads
        SET description=$2, support=$3, mediaurl=$4, type=$5, spender=$6
        WHERE adid=$1`,[id, req.body.description, req.body.support, req.body.mediaurl, req.body.type, req.body.spenderid]);
      res.sendStatus(200)
  } catch(e) {
    console.log(e)
      res.sendStatus(400)
  }
})

//Delete one ad
router.delete('/ads:id', async function(req, res) {
  var id = req.params.id
  try{
    await pg.query(`DELETE from ads WHERE adid = $1`,[id]);
    res.sendStatus(200);
  } catch(e) {
    console.log(e);
    res.sendStatus(400);
  }

})


module.exports = router;
