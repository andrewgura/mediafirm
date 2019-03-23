var express = require('express');
var router = express.Router();
var pg = require("../../database.js")

//Used in Pages/AdView to show breakdowns related to a mediabuy that arent linked to an ad yet
router.get('/breakdown:id', async function(req, res) {
  var id = req.params.id;
  const breakdown = await pg.query(
`SELECT
  break.*
FROM
  buydetailbreakdown break,
  mediabuydetailsday d,
  mediabuydetails a,
  mediabuytype t,
  mediabuys b
WHERE break.mediabuydetailsdayid = d.mediabuydetailsdayid
  AND d.mediabuydetailid = a.mediabuydetailid
  AND a.mediabuytypeid = t.mediabuytypeid
  AND t.mediabuyid = b.mediabuyid
  AND b.mediabuyid = $1
  AND break.adid = 0
`, [id]);
  res.json({breakdown: breakdown.rows})
})

//Update the breakdown to be linked to an ad, down on Pages/Adview
router.put('/breakdown', async function(req,res) {
  try{
    await pg.query(`
        UPDATE buydetailbreakdown
        SET adid=$2
        WHERE breakdownid=$1`,[req.body.breakdownid, req.body.adid]);
        res.sendStatus(200)
  } catch(e) {
      console.log(e);
      res.sendStatus(400)
  }
})

module.exports = router;
