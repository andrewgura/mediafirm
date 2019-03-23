var xl = require('excel4node');
var pg = require("../../../database.js");
var getStartEndWeek = require("../../queries/getStartEndWeek")
var moment = require('moment');

function removeDups(x) {
  return Array.from(new Set(x));
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function makeSSStation(req,res, spenderResults, earliestStartEndBuys){

  var adid = req.body.adids;
  var adResults = [];

for(var i = 0; i < adid.length; i++) {
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
}

  var ads = [].concat.apply([], adResults);

  var supportTypes = [];

  ads.forEach((item) => {
    var su = item.support;
    var sp = item.spender;

    supportTypes.push({[sp]: su})
  })

  var stationResults = [];
  for(var i = 0; i < adid.length; i++){
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
          stationResults.push(adStations.rows);
      }

  var stations = [].concat.apply([], stationResults);
  var data = [];

  stations.forEach((item, i) => {


  var arr = item.addetails.split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

  for(var a = 0; a < arr.length; a++) {
  		arr[a] = arr[a].replace(/[()]/g, '');
      arr[a] = arr[a].replace(/['"]+/g, '');

  }

		var spender = arr[3]
    var mediatype = arr[2];
    var market = arr[1];
    var station = arr[0]

    if(i == 0) {

    	data.push({[spender]: [{[market]: [{[mediatype]: [station]}]}]})
    } else {


    	var spendercheck = 0;

      for(var s = 0; s < data.length; s++) {
      		var marketCheck = 0;

            var existSpender = Object.keys(data[s]);
            if(existSpender == spender) {
              spendercheck += 1;
            }

            for(var m = 0; m < data[s][existSpender].length; m++) {

            	var existMarket = Object.keys(data[s][existSpender][m])
            	if(Object.keys(data[s][existSpender][m]) == market) {
              	marketCheck += 1;
              }


              var typeCheck = 0;

              for(var t = 0; t < data[s][existSpender][m][existMarket].length; t++) {

                var existMediaType = Object.keys(data[s][existSpender][m][existMarket][t]);
              	if(Object.keys(data[s][existSpender][m][existMarket][t]) == mediatype) {
                	typeCheck += 1;
                }


                var stationCheck = 0;
                for(var n = 0; n < data[s][existSpender][m][existMarket][t][existMediaType].length; n++) {

                	var existStation = data[s][existSpender][m][existMarket][t][existMediaType];
                  if(existStation == station) {
                  	stationCheck += 0;
                  }

                }

              if(stationCheck == 0 && spender == existSpender && existMarket == market && mediatype == existMediaType){
            		data[s][existSpender][m][existMarket][t][existMediaType].push(station)
          		}

              }

            if(typeCheck == 0 && spender == existSpender && existMarket == market ){
            	data[s][existSpender][m][existMarket].push({[mediatype]: [station]})
          	}


            }

          if(marketCheck == 0 && spender == existSpender ){
            data[s][existSpender].push({[market]: [{[mediatype]: [station]}]})
          }
      }

      if(spendercheck == 0 ){
      	data.push({[spender]: [{[market]: [{[mediatype]: [station]}]}]})
      }

    }



})

  var startEndDates = await getStartEndWeek.setUpDates(14);

  var generalWeekStart = startEndDates.generalWeekStart;
  var generalWeekEnd = startEndDates.generalWeekEnd;
  var primaryWeekStart = startEndDates.primaryWeekStart;
  var primaryWeekEnd = startEndDates.primaryWeekEnd;

  var wb = new xl.Workbook();

  var style1 = wb.createStyle({
    font: {
       color: 'black',
       underline: true,
       size: 30
     }
});

  var friendlyCell = wb.createStyle({
    alignment: {
       wrapText: true,
       size: 11,
       horizontal: 'center',
       vertical: "center"
      },
     fill: {
       type: 'pattern',
       patternType: 'solid',
       fgColor: '#8bb1e0'
     },
     border: {
       left: {
         style: "medium",
         color: "#968772"
       },
       top: {
         style: "medium",
         color: "#968772"
       },
       bottom: {
         style: "medium",
         color: "#968772"
       },
       right: {
         style: "medium",
         color: "#968772"
       },
     }
  })

  var unFriendlyCell = wb.createStyle({
    alignment: {
       wrapText: true,
       size: 11
     },
     alignment: {
       horizontal: 'center',
       vertical: "center"
      },
     fill: {
       type: 'pattern',
       patternType: 'solid',
       fgColor: '#edc4b4'
     },
     border: {
       left: {
         style: "medium",
         color: "#968772"
       },
       top: {
         style: "medium",
         color: "#968772"
       },
       bottom: {
         style: "medium",
         color: "#968772"
       },
       right: {
         style: "medium",
         color: "#968772"
       },
     }
  })


  var totalHead = wb.createStyle({
    font: {
       bold: true,
       color: '#000000',
       size: 11
     },
    alignment: {
      horizontal: 'center',
      vertical: "center"
     },
     fill: {
       type: 'pattern',
       patternType: 'solid',
       fgColor: '#f7be45'
     },
     border: {
       left: {
         style: "medium",
         color: "#968772"
       },
       top: {
         style: "medium",
         color: "#968772"
       },
       bottom: {
         style: "medium",
         color: "#968772"
       },
       right: {
         style: "medium",
         color: "#968772"
       },
     }
  })

  var totalCell = wb.createStyle({
    alignment: {
      horizontal: 'center',
      vertical: "center"
     },
     fill: {
       type: 'pattern',
       patternType: 'solid',
       fgColor: '#f7f79b'
     },
     border: {
       left: {
         style: "medium",
         color: "#968772"
       },
       top: {
         style: "medium",
         color: "#968772"
       },
       bottom: {
         style: "medium",
         color: "#968772"
       },
       right: {
         style: "medium",
         color: "#968772"
       },
     }
  })

  var weeksStyle = wb.createStyle({
    font: {
       bold: true,
       color: '#ffffff',
       size: 11
     },
     fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: "#3368aa"
     },
     alignment: {
        wrapText: true,
        horizontal: 'center',
        vertical: "center"
    },
    border: {
      left: {
        style: "medium",
        color: "#968772"
      },
      top: {
        style: "medium",
        color: "#968772"
      },
      bottom: {
        style: "medium",
        color: "#968772"
      },
      right: {
        style: "medium",
        color: "#968772"
      },
    }
});

var emptyCell = wb.createStyle({
  font: {
     bold: true,
     color: '#282828',
     size: 11
   },
   alignment: {
      horizontal: 'center',
      vertical: "center"
  },
  border: {
    left: {
      style: "medium",
      color: "#968772"
    },
    top: {
      style: "medium",
      color: "#968772"
    },
    bottom: {
      style: "medium",
      color: "#968772"
    },
    right: {
      style: "medium",
      color: "#968772"
    },
  }
});

var blankStyle = wb.createStyle({
  font: {
     bold: true,
     color: '#ffffff',
     size: 11
   },
   fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: "#6d6d6d"
   },
   alignment: {
      horizontal: 'center'
  },
  border: {
    left: {
      style: "medium",
      color: "#968772"
    },
    top: {
      style: "medium",
      color: "#968772"
    },
    bottom: {
      style: "medium",
      color: "#968772"
    },
    right: {
      style: "medium",
      color: "#968772"
    },
  }
});

var columnhead = wb.createStyle({
  font: {
     bold: true,
     color: '#000000',
     size: 11
   },
   fill: {
      type: 'pattern',
      patternType: 'solid',
      fgColor: "#bcaf8b"
   },
   alignment: {
      wrapText: true,
      horizontal: 'center',
  },
  border: {
    left: {
      style: "medium",
      color: "#968772"
    },
    top: {
      style: "medium",
      color: "#968772"
    },
    bottom: {
      style: "medium",
      color: "#968772"
    },
    right: {
      style: "medium",
      color: "#968772"
    },
  }
});


  //Get date ranges
  var times = [];
  var start = new Date(generalWeekStart)
  var finish = new Date(generalWeekEnd)

  var startweek = moment(start).add(1, "days").format("MM/DD");
  var finishweek = moment(finish).add(1, "days").format("MM/DD");

  var lastweek = startweek + " - " + finishweek;

  var inc = 0;

   do {
     var x = moment(start).subtract(inc, "weeks").add(1, "days").format("MM/DD");
     var y = moment(finish).subtract(inc, "weeks").subtract(1, "days").format("MM/DD");

     var weekspan= x + " - " + y
     times.push(weekspan)
     inc++;
   } while (x > moment(earliestStartEndBuys.rows[0].startdate).format("MM/DD") == true);
   times.reverse();
   times.pop();
   times.push(lastweek)
  //End get date ranges

  //WorkSheet name, new worksheet
   ws = wb.addWorksheet('Spender Summary Station');
  ws.column(1).setWidth(20);

   ws.cell(1, 1,1,8,true).string('Spender Summary by Station').style(style1);

  var tableLength = 0;
  var spenderTotalLength = 0;
  var marketTotal = 0;

  for(var a = 0; a < data.length; a++) {
        var spenderTotal = 0;




        var spenderName = Object.keys(data[a])
        var supporttype = '';

        //Check if spender is friendly/unfriendly
        for(var q = 0; q < supportTypes.length; q++) {
          var name = Object.keys(supportTypes[q])

          if(spenderName[0] == name[0]) {
            supporttype = supportTypes[q][name];
          }
        }

        var cellStyle;

        if(supporttype == "Friendly") {
          cellStyle = friendlyCell
        } else if(supporttype == "Unfriendly") {
          cellStyle = unFriendlyCell;
        } else {
          cellStyle = emptyCell;
        }



        //Spendername cell
        ws.cell(4 + (a * tableLength), 1).string(spenderName).style(emptyCell);

        for(var t = 0; t < data[a][spenderName].length; t++) {
          //market Name
          var markName = Object.keys(data[a][spenderName][t]);

          var marketLength = 0;

          ws.cell(8 + (a * tableLength), 3 + times.length + 1).string("Total");

          for(var m = 0; m < data[a][spenderName][t][markName].length; m++){
          //Table headers. weeks
            for(var i = 0; i < times.length; i++) {
                ws.cell(7 + (a * tableLength), 4 + i + (i - 1), 7 + (a * tableLength), 5 + i + (i - 1), true).string("Week " + (times.length - i)).style(weeksStyle);
                //Week Ranges
                ws.cell(8 + (a * tableLength), 4 + i + (i - 1), 8 + (a * tableLength), 5 + i + (i - 1), true).string(times[i]).style(weeksStyle);

                //Market Name Cell
                ws.cell(8 + (a * tableLength), 1).string(markName);
                ws.cell(8 + (a * tableLength), 2).string("");

                ws.cell(9 + (a * tableLength), 2).string("Affiliate").style(columnhead);
                ws.cell(9 + (a * tableLength), 3 + (i * 2)).string("Dollars").style(columnhead);
                ws.cell(9 + (a * tableLength), 4 + (i* 2)).string("TRPS/Spots").style(columnhead)

                if(i == times.length - 1) {
                  ws.cell(9 + (a * tableLength), 3 + (times.length * 2)).string("Dollars").style(totalCell);
                  ws.cell(9 + (a * tableLength), 4 + (times.length * 2)).string("TRPS/Spots").style(totalCell)
                }
              }


              var mediatype = Object.keys(data[a][spenderName][t][markName][m]);
              //Media type cell
              ws.cell(9 + (a * tableLength),1).string(mediatype +  " Stations").style(columnhead);

              for(var s = 0; s < data[a][spenderName][t][markName][m][mediatype].length; s++) {
                    var stationName = data[a][spenderName][t][markName][m][mediatype][s];
                    ws.cell(10 + s + (a * tableLength), 1).string(stationName).style(cellStyle);
                    ws.cell(10 + s + (a * tableLength), 2).string("").style(cellStyle);
                    var dollarsTotal = 0;
                    var trpsTotal = 0;

                  for(var q = 0; q < times.length; q++){
                    var dollarsCell = 0;
                    var trpsCell = 0;


                                    for(var i = 0; i < spenderResults.length; i++) {

                                              var dollars = spenderResults[i].amount;

                                              if(spenderResults[i].trps == 0){
                                                  var trps = spenderResults[i].spots;
                                              } else {
                                                var trps = spenderResults[i].trps;
                                              }

                                              var date = moment(spenderResults[i].date).format("MM/DD")
                                              var firstTime = moment(times[o].substr(0,5), "MM/DD").subtract(1, "days")
                                              var secondTime = moment(times[o].substr(7,9), "MM/DD").add(1, "days")

                                               if(spenderResults[i].station == stationName && spenderResults[i].spender == spenderName) {
                                                   if(moment(date , "MM/DD").isBetween(moment(firstTime, "MM/DD"), moment(secondTime, "MM/DD"), null, '[]')) {
                                                          dollarsCell += dollars;
                                                          trpsCell += trps;
                                                          dollarsTotal += dollars;
                                                          trpsTotal += trps;
                                                          spenderTotal += dollars;

                                                    }

                                                }

                                     }



                /* Dollars Cell */    ws.cell(10 + s + (a * tableLength), 2 + q + (q + 1)).number(Math.round(dollarsCell)).style(cellStyle);
                /* Spots/TRPS Cell */ ws.cell(10 + s + (a * tableLength), 3 + q + (q + 1)).number(Math.round(trpsCell)).style(cellStyle);
                  }

                  ws.cell(10 + s + (a * tableLength), 3 + (times.length * 2)).number(Math.round(dollarsTotal)).style(totalCell);
                  ws.cell(10 + s + (a * tableLength), 4 + (times.length * 2)).number(Math.round(trpsTotal)).style(totalCell);


                    if(s == data[a][spenderName][t][markName][m][mediatype].length - 1){
                      ws.cell(10 + s + 1 + (a * tableLength), 1).string("Total").style(emptyCell)
                      tableLength += data[a][spenderName][t][markName][m][mediatype].length + 9;
                      marketLength += data[a][spenderName][t][markName][m][mediatype].length + 2;
                    }

              }
           }

        ws.cell(10 + marketLength + (a * marketTotal), 1).string(markName + " Total").style(emptyCell);
        marketTotal = tableLength;
    }


    ws.cell(5 + (a * spenderTotalLength), 1).string("Spender Total");
    ws.cell(5 + (a * spenderTotalLength), 2).number(spenderTotal);
    spenderTotalLength += tableLength;
}



   wb.write('MyWorkBook.xlsx', res);
}

module.exports = makeSSStation;
