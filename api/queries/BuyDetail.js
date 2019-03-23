var pg = require("../../database.js")
var dateFormat = require('dateformat');

var date = new Date();
var datesubmitted = date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);


var bd = {

  /*
  ~~CreateNew: creates records in MediaBuydetailsday table and buydetailbreakdown table
  All parameters required
  diffdays: int calculated by subtracting mediabuy startdate from enddate
  partstart: String formmated from javascript date object of media buy start date
  req: req from the client, used to get form data
  getStartEnd: query done to get start and enddate from media buy, also next default value of mediabuydetailsid
  */
  createNew: async function(diffDays, partstart, req, getStartEnd, mediabuydetailsid) {
    var buyid = req.body.buyid;
    var market = req.body.market;
    var buytypeid = req.body.mediabuytypeid;
    var station = req.body.stationsystemid;

    var marketid = await pg.query("SELECT marketid FROM mediamarkets WHERE market = $1 LIMIT 1", [market]);


    //Getting the next ID of mediabuydetailsid by looking at the auto-increment sequence
    for(var i = 0; i < diffDays; i++){
        var startdate = new Date(partstart[0], partstart[1] - 1, partstart[2]);
        var amount = req.body.amount / diffDays;
        var trps = req.body.trps / diffDays;
        var spots = req.body.spots / diffDays;

        startdate.setDate(startdate.getDate() + i);
        var date  = dateFormat(startdate,"yyyy-mm-dd");

        try{
            await pg.query(`INSERT INTO mediabuydetailsday (mediabuydetailid, stationsystemid, date, amount, trps, spots, datesubmitted, mediabuyid, marketid, mediabuytypeid) VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [mediabuydetailsid,station,date,amount,trps,spots,datesubmitted, buyid, marketid.rows[0].marketid, buytypeid])
        }catch (e) {
          console.log(e)
        }

        var detaildayid = Number(getStartEnd.rows[0].dayid);

        //break up the array that holds the percent values
        var percentsByDay = req.body.dates[i][date].split(",");

        //loop throuh each percent to add a new record for each
        for(var j = 1; j <= percentsByDay.length; j++){


          var newamount = (amount/100) * Number(percentsByDay[j - 1]);
          var newtrps = (trps/100) * Number(percentsByDay[j - 1]);
          var newspots = (spots/100) * Number(percentsByDay[j - 1]);

          await pg.query(`INSERT INTO buydetailbreakdown (percent, mediabuydetailsdayid, date, adid, mediabuyid, mediabuytypeid, amount, trps, spots) VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [percentsByDay[j - 1], detaildayid + i, date, 0, buyid, buytypeid, newamount, newtrps, newspots])
      }
    }
  }



}

module.exports = bd;
