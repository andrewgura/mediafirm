var express = require('express');
var router = express.Router();
const { Client } = require('pg')
var pg = require("../../database.js")
var getStartEndWeek = require("../queries/getStartEndWeek")

//Used in ViewSpenderSum.js && client/SpenderSummary.js
router.get('/summarySpender:id/electiontype:type', async function(req, res) {

  var districtid = req.params.id;
  var type = req.params.type;


  var adids = await pg.query(`SELECT adid FROM ads WHERE districtid = $1`, [districtid]);

  var adid = [];

  adids.rows.forEach(function(item) {
	   adid.push(item.adid)
  })


  var earliestStartEndBuys = await pg.query(`SELECT
                                              buys.startdate,
                                              buys.enddate
                                            FROM
                                              mediabuys buys,
                                              ads a,
                                              districts d
                                            WHERE d.districtid = $1
                                            AND a.districtid = d.districtid
                                            AND a.adid = buys.adid
                                            AND buys.electiontype = $2
                                            ORDER BY buys.startdate ASC LIMIT 1`, [districtid, type]);

  var spenderResults = [];
  var adResults = [];
  var sResults = [];


  for(var i = 0; i < adid.length; i++) {

      const results = await pg.query(`
        SELECT
              day.date,
              day.amount,
              detail.cpp,
              day.trps,
              type.mediatype,
              spend.spender,
              ads.support,
              day.spots,
              market.market,
              station.station
        FROM
            mediabuydetailsday day,
            mediabuydetails detail,
            mediabuys buy,
            spenders spend,
            mediabuytype type,
            ads ads,
            mediamarkets market,
            stations station
        WHERE ads.adid = buy.adid
          AND ads.adid = $1
          AND ads.spender = spend.spenderid
          AND day.marketid = market.marketid
          AND buy.mediabuyid = day.mediabuyid
          AND detail.mediabuydetailid = day.mediabuydetailid
          AND buy.electiontype = $2
          AND type.mediabuytypeid = day.mediabuytypeid
          AND day.stationsystemid = station.stationid`, [adid[i], type]);

      spenderResults.push(results.rows);

      const adData = await pg.query(`SELECT
                                          ad.adid,
                                          ad.description,
                                          ad.districtid,
                                          ad.support,
                                          min(spend.spender) as spender,
                                          sum(detail.amount) as total,
                                          sum(detail.spots) as spots,
                                          min(buy.startdate) as start,
                                          min(buy.enddate) as end,
                                          array_agg(DISTINCT(type.mediatype)) as mediatype,
                                          array_agg(DISTINCT(market.market)) as market
                                    FROM
                                          ads ad,
                                          spenders spend,
                                          mediabuys buy,
                                          mediabuydetails detail,
                                          mediabuytype type,
                                          mediamarkets market
                                  WHERE ad.adid = $1
                                  AND ad.spender = spend.spenderid
                                  AND ad.adid = buy.adid
                                  AND buy.mediabuyid = detail.mediabuyid
                                  AND type.mediabuytypeid = detail.mediabuytypeid
                                  AND type.marketid = market.marketid
                                  GROUP BY ad.adid`, [adid[i]]);

      adResults.push(adData.rows);

      var adStations = await pg.query(`
                                      SELECT
                                      distinct(station.station,
                                      station.market,
                                      station.type,
                                      spender.spender) as addetails
                                      FROM
                                      stations station,
                                      ads ad,
                                      spenders spender,
                                      mediabuys buy,
                                      mediabuydetails detail
                                      WHERE ad.adid = $1
                                      AND ad.adid = buy.adid
                                      AND buy.mediabuyid = detail.mediabuyid
                                      AND detail.stationsystemid = station.stationid
                                      AND buy.spenderid = spender.spenderid
                                                                              `, [adid[i]]);
        sResults.push(adStations.rows);
  }

  var stations = [].concat.apply([], sResults);
  var stationData = [];

  stations.forEach((item, i) => {


  var arr = item.addetails.split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

  for(var a = 0; a < arr.length; a++) {
      arr[a] = arr[a].replace(/[()]/g, '');
      arr[a] = arr[a].replace(/['"]+/g, '');

  }
  stationData.push(arr);
})

  //For loop to add all markets to array & mediatypes & spenders
  var markets = [];
  var mediatypesResults = [];
  var spendersInit = [];
  var supportsInit = [];



  for(var i = 0; i < spenderResults.length; i++){
      spenderResults[i].forEach(function(item) {
          if(markets.includes(item.market) == false){
            markets.push(item.market)
          }

          if(mediatypesResults.includes(item.mediatype) == false){
            mediatypesResults.push(item.mediatype)
          }
      })
  }

  var mergeAdResults = adResults.map(adResults => adResults[0]);
  mergeAdResults.sort((a, b) => b.spender < a.spender);
  mergeAdResults.sort((a, b) => b.support < a.support);



  for(var i = 0; i < mergeAdResults.length; i++){

        if(spendersInit.includes(mergeAdResults[i].spender) == false) {
          supportsInit.push(mergeAdResults[i].support);
          spendersInit.push(mergeAdResults[i].spender);
        }
  }


        var supports = [];
        var spenders = [];

        for(var i = 0; i < mergeAdResults.length; i++) {

            for(var a = 0; a < mediatypesResults.length; a++){
              if(supportsInit[i] != undefined) {
                supports.push(supportsInit[i]);
              }

              if(spendersInit[i] != undefined) {
                spenders.push(spendersInit[i]);
              }
            }

        }


        var mediatypes = [];
        for(var i = 0; i < spendersInit.length; i++){
          for(var a = 0; a < mediatypesResults.length; a++){
            mediatypes.push(mediatypesResults[a])
          }
        }


    var startEndDates = await getStartEndWeek.setUpDates(14);

    var ads = [].concat.apply([], adResults);
    var spendResults = [].concat.apply([], spenderResults);

    res.send({earliestStartEndBuys: earliestStartEndBuys.rows[0], startEndDates: startEndDates, markets: markets, mediatypes: mediatypes, spenders: spenders, supports: supports, adResults: ads, spenderResults: spendResults, stationData: stationData})

})

module.exports = router;
