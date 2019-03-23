var express = require('express');
var router = express.Router();
var pg = require("../../database.js");
var fs = require('fs');

router.post('/spendersummary', async function(req, res) {
    var districtid = req.body.districtid;
    var type = req.body.electiontype;
    //run getStartEndWeek to get primary/general week start & end
    //takes input of districtid
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

    var adid = req.body.adids;
    var spenderResults = [];
    var adResults = [];

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
                                      AND day.stationsystemid = station.stationid
                                      `, [adid[i], type]);


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
                                            min(type.mediatype) as mediatype,
                                            min(market.market) as market
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
    }

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

    mediatypesResults.sort();
    
    var mergeAdResults = adResults.map(adResults => adResults[0]);
    mergeAdResults.sort((a, b) => b.spender < a.spender);
    mergeAdResults.sort((a, b) => b.support < a.support);


    for(var i = 0; i < mergeAdResults.length; i++){

          if(spendersInit.includes(mergeAdResults[i].spender) == false) {
            spendersInit.push(mergeAdResults[i].spender);
          }

          if(supportsInit.includes(mergeAdResults[i].support) == false) {
            supportsInit.push(mergeAdResults[i].support);
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

      var spendResults = [].concat.apply([], spenderResults);

      var exceltype = req.body.type;

      var makeSpenderSummary = require('./CreateFile/SpenderSummary.js');
      var makeSSMarket = require('./CreateFile/SSMarket.js');
      var makeSSStation = require('./CreateFile/SSStation.js');
      var makefvuf = require('./CreateFile/FriendVUnFriendly.js');
      var makeCPPreport = require('./CreateFile/CPPreport.js');

      switch(exceltype) {
        case "regular":
                makeSpenderSummary(req, res, spendResults, earliestStartEndBuys, markets, mediatypes, spenders, supports);
                break;
        case "bymarket":
                makeSSMarket(req, res, spendResults, earliestStartEndBuys, markets, mediatypes, spenders, supports, adResults);
                break;
        case "bystation":
                makeSSStation(req, res, spendResults, earliestStartEndBuys, markets, mediatypes, spenders, supports);
                break;
        case "fvuf":
                makefvuf(req, res, spendResults, earliestStartEndBuys, markets, mediatypes, spenders, supports);
                break;
        case "cppreport":
                makeCPPreport(req, res, spendResults, earliestStartEndBuys, markets, mediatypes, spenders, supports);
                break;
      }

});

module.exports = router;
