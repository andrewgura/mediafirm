var express = require('express');
var router = express.Router();
var dateFormat = require('dateformat');
var pg = require("../../database.js");
var bd = require("../queries/BuyDetail.js")

//Get multiple that match mediabuytypeid
  router.get('/mediabuydetails/mediabuytype:id', async function(req, res) {
    var id = req.params.id;
    const mediabuydetails = await pg.query(`
                                    SELECT m.mediabuydetailid,
                                      m.mediabuytypeid,
                                      s.station,
                                      to_char(m.amount, '9999999D99') as amount,
                                      m.cpp,
                                      m.trps,
                                      m.spots
                                    FROM
                                      mediabuydetails m,
                                      stations s
                                    WHERE
                                      m.mediabuytypeid = $1
                                    AND
                                      m.stationsystemid = s.stationid
                                    ORDER BY
                                      m.mediabuydetailid`, [id]);

    res.json({mediabuydetails: mediabuydetails.rows})
  })

//Get one for Edit screen
router.get('/details:id', async function(req, res) {
  var id = req.params.id;
  const mediabuydetails = await pg.query(`SELECT * FROM mediabuydetails WHERE mediabuydetailid = $1`, [id]);

  const detailbreakdown = await pg.query(`
                                SELECT b.*
                                FROM mediabuydetailsday d,
                                mediabuydetails a, buydetailbreakdown b
                                WHERE b.mediabuydetailsdayid = d.mediabuydetailsdayid
                                AND d.mediabuydetailid = a.mediabuydetailid
                                AND a.mediabuydetailid = $1
                                `, [id])

  res.json({mediabuydetails: mediabuydetails.rows, detailbreakdown: detailbreakdown.rows});
})

//Create one and add records into mediabuydetailsday
router.post('/mediabuydetails', async function(req, res) {

  var date = new Date();
  var datesubmitted = date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);

  var getStartEnd = await pg.query(`
                                SELECT b.startdate, b.enddate, i.last_value + 1 as mediabuydetailsid, day.last_value + 1 as dayid
                                FROM mediabuys b, mediabuydetailsid i, mediabuydetailsdayid day
                                WHERE b.mediabuyid = $1
                                `, [req.body.buyid])

  //Get start and end date of the Mediabuy
  var startdate = getStartEnd.rows[0].startdate;
  var enddate = getStartEnd.rows[0].enddate;

  //Format the start and end date into JavaScript Dates
  var partstart = startdate.split('-');
  var startdate = new Date(partstart[0], partstart[1] - 1, partstart[2]);

  var partsend = enddate.split('-');
  var enddate = new Date(partsend[0], partsend[1] - 1, partsend[2]);

  //Takes the difference of the days
  var timeDiff = Math.abs(startdate.getTime() - enddate.getTime());
  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

  try{
    //create new mediabuydetail
    await pg.query(
        `INSERT INTO mediabuydetails (mediabuytypeid, stationsystemid, amount, cpp, trps, spots, datesubmitted, mediabuyid) VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [req.body.mediabuytypeid, req.body.stationsystemid, req.body.amount, req.body.cpp, req.body.trps, req.body.spots, datesubmitted, req.body.buyid])

        var mediabuydetailsid = getStartEnd.rows[0].mediabuydetailsid;

        //loop for creating new records in the mediabuydetailsday table and buydetailbreakdown table
        bd.createNew(diffDays, partstart, req, getStartEnd, mediabuydetailsid);

      res.sendStatus(200);
    } catch(e){
      console.log(e);
      res.sendStatus(400)
    }
})

//Update one
router.put('/details:id', async function(req, res) {
  var id = req.params.id;
    var date = new Date();
    var datesubmitted = date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  try{
      await pg.query(`
                      UPDATE mediabuydetails
                      SET stationsystemid=$2, amount=$3, cpp=$4, trps=$5, spots=$6
                      WHERE mediabuydetailid=$1`,[id, req.body.station, req.body.amount, req.body.cpp, req.body.trps, req.body.spots]);

      res.sendStatus(200)
  } catch(e) {
    console.log(e)
      res.sendStatus(400)
  }
})

//Delete one and delete mediabuydetailsday records
router.delete('/mediabuydetails:id', async function(req, res) {
  var id = req.params.id;
  try{
    await pg.query(`
      DELETE FROM buydetailbreakdown AS q
        WHERE EXISTS (
        SELECT
        FROM buydetailbreakdown AS w
        JOIN mediabuydetailsday
        USING (mediabuydetailsdayid)
        JOIN mediabuydetails
        USING (mediabuydetailid)
        WHERE mediabuydetailid = $1
        AND w.breakdownid = q.breakdownid
        )`,[id]);


    await pg.query(`DELETE from mediabuydetailsday WHERE mediabuydetailid = $1`,[id]);
    await pg.query(`DELETE from mediabuydetails WHERE mediabuydetailid = $1`,[id]);
    res.sendStatus(200)
  } catch(e){
    console.log(e)
    res.sendStatus(400)
  }
})

function createMediaBuyDetailsDay() {

}

module.exports = router;
