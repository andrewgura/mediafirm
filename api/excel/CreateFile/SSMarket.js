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

async function makeSSMarket(req,res, spenderResults, earliestStartEndBuys, markets, mediatypes, spenders, supports, adResults){

  var ads = [].concat.apply([], adResults);

  var bottomMediaTypes = removeDups(mediatypes).concat("Total")

  if(supports.length > 1){
    bottomMediaTypes = bottomMediaTypes.concat(bottomMediaTypes);
  }

  var varianceTypes = removeDups(mediatypes).concat("Total");

  var bottomSupportsInit = removeDups(supports);
  var bottomSupports = [];


    for(var i = 0; i < bottomMediaTypes.length / 2; i++) {
      bottomSupports = bottomSupports.concat(bottomSupportsInit)
    }

    bottomSupports.sort()

    //If only one support, need to double it this way
    if(bottomSupports.length == 1){
      bottomSupports = bottomSupports.concat(bottomSupports)
    }

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

  //Change week range based on user slider values
  var customWeekEnd = times.length - req.body.end;
  if(customWeekEnd > 0) {
    for(var i = 0; i < customWeekEnd; i++){
      times.shift();
    }
  }

var customStartRange = 0;
if(req.body.start > 0){
  customStartRange = req.body.start
}

var ws = {};

for(var m = 0; m < markets.length; m++){

  //WorkSheet name, new worksheet
   ws[m] = wb.addWorksheet(markets[m]);

  //Title of Excel Document for WorkSheet 1
  ws[m].cell(1, 1,1,8,true).string('Spender Summary by Market').style(style1);

        //Write headers
           for(var i = 0; i < times.length; i++) {
             if(req.body.start > times.length - i && req.body.start > 1 && i != times.length) {


             } else {
                 //Weak Number
                 ws[m].cell(3, 6 + i + (i - 1), 3, 7 + i + (i - 1), true).string("Week " + (times.length - i)).style(weeksStyle);
                 //Week Ranges
                 ws[m].cell(4, 6 + i + (i - 1), 4, 7 + i + (i -1), true).string(times[i]).style(weeksStyle);
                 //Headers
                 ws[m].cell(5, 1).string("Market").style(columnhead);
                 ws[m].cell(5, 2).string("Support").style(columnhead);
                 ws[m].cell(5, 3).string("Spender").style(columnhead);
                 ws[m].cell(5, 4).string("Type").style(columnhead);
                 ws[m].cell(5, 4 + i + (i + 1)).string("Dollars").style(columnhead);
                 ws[m].cell(5, 5 + i + (i + 1)).string("TRPS/Spots").style(columnhead);
           }

             //Totals Column
             if(i == times.length - 1) {

                if(customStartRange == 0){
                     ws[m].cell(4,
                      4 + i + (i + 1) + 2,
                      4,
                      5 + i + (i + 1) + 2,
                      true).string("Total").style(totalHead);

                     ws[m].cell(5, 4 + i + (i + 1) + 2).string("Dollars").style(totalHead);
                     ws[m].cell(5, 5 + i + (i + 1) + 2).string("TRPS/Spots").style(totalHead);
                 } else {
                     ws[m].cell(4,
                      4 + i + (i + 1) + 2 - (customStartRange * 2 - 2),
                      4,
                      5 + i + (i + 1) + 2 - (customStartRange * 2 - 2),
                      true).string("Total").style(totalHead);

                     ws[m].cell(5, 4 + i + (i + 1) + 2 - (customStartRange * 2 - 2)).string("Dollars").style(totalHead);
                     ws[m].cell(5, 5 + i + (i + 1) + 2 - (customStartRange * 2 - 2)).string("TRPS/Spots").style(totalHead);
                 }


             }

           } //end i loop, times.


           //Top table start
           for(var a = 0; a < mediatypes.length; a++) {

             //Top market, merge all cells
             if(a == mediatypes.length - 1) {
               ws[m].cell(6 +  a - mediatypes.length + 1,
              1,
              6 +   a,
              1,
              true
            ).string(markets[m]).style(emptyCell)

             }

             var supportStyle;

             //Styling for support & spender cell
             if(supports[a] == "Friendly") {
               supportStyle = friendlyCell;
             } else if(supports[a] == "Unfriendly") {
                supportStyle = unFriendlyCell;
             } else {
               supportStyle = emptyCell;
             }

             //Top supports, merge cells
               if(supports[a - 1] == supports[a] && supports[a + 1] == supports[a]) {
               } else if(supports[a + 1] == supports[a]) {
               } else if(supports[a - 1] == supports[a]) {

                     var joint = 0;

                     for(var q = 0; q < supports.length; q++) {
                       if(supports[q] == supports[a]) {
                         joint += 1;
                       }
                     }





                       ws[m].cell(6 + a - joint + 1,
                        2,
                        6 + a,
                        2,
                        true
                      ).string(supports[a]).style(supportStyle);

               } else {
                 ws[m].cell(6 + a, 2).string(supports[a]).style(supportStyle);
               }


               if(spenders[a - 1] == spenders[a] && spenders[a + 1] == spenders[a]) {
                } else if(spenders[a + 1] == spenders[a]) {
                } else if(spenders[a - 1] == spenders[a]) {

                     var joint = 0;
                     var count = a - 1;
                     while(spenders[count] == spenders[a]){
                       joint += 1;
                       count += 1;
                     }
                     ws[m].cell(6 +   a - joint + 1,
                      3,
                      6 + a,
                      3,
                      true
                    ).string(spenders[a]).style(supportStyle);
               } else {
                 ws[m].cell(6 + a, 3).string(spenders[a]).style(supportStyle);
               }


               ws[m].cell(6 + a, 4).string(mediatypes[a]).style(emptyCell)

               var overallBroadcast = 0;
               var overallTrps = 0;


                for(var o = 0; o < times.length; o++) {
                  var broadcastTotal = 0;
                  var trpsTotal = 0;

                  if(req.body.start > times.length - o && req.body.start > 1 && o != times.length) {
                  } else {


                  for(var i = 0; i < spenderResults.length; i++) {

                            var broadcast = spenderResults[i].amount;

                            if(spenderResults[i].trps == 0){
                                var trps = spenderResults[i].spots;
                            } else {
                              var trps = spenderResults[i].trps;
                            }

                            var date = moment(spenderResults[i].date).format("MM/DD")
                            var firstTime = moment(times[o].substr(0,5), "MM/DD").subtract(1, "days")
                            var secondTime = moment(times[o].substr(7,9), "MM/DD").add(1, "days")

                             if(spenderResults[i].market == markets[m] && spenderResults[i].spender == spenders[a] && spenderResults[i].mediatype == mediatypes[a] && spenderResults[i].support == supports[a]) {
                               if(moment(date , "MM/DD").isBetween(moment(firstTime, "MM/DD"), moment(secondTime, "MM/DD"), null, '[]')) {

                                        broadcastTotal += broadcast;
                                        overallBroadcast += broadcast;
                                        trpsTotal += trps;
                                        overallTrps += trps;

                                  }

                              }


                              var cellStyle;

                              if(supports[a] == "Friendly" && broadcastTotal > 0){
                                cellStyle = friendlyCell;
                              } else if(supports[a] == "Unfriendly" && broadcastTotal > 0) {
                                cellStyle = unFriendlyCell;
                              } else {
                                cellStyle = emptyCell;
                              }


                        ws[m].cell(6 +   a, 4 + o + (o + 1)).number(Math.round(broadcastTotal)).style(cellStyle);
                        ws[m].cell(6 +   a, 5 + o + (o + 1)).number(Math.round(trpsTotal)).style(cellStyle);

                  }

               }}


                if(o == times.length && customStartRange > 0){

                  if(overallBroadcast > 0) {
                   ws[m].cell(6 +   a, 4 + (times.length * 2) + 1 - (customStartRange * 2 - 2)).number(Math.round(overallBroadcast)).style(totalCell);
                 } else {
                   ws[m].cell(6 +   a, 4 + (times.length * 2) + 1 - (customStartRange * 2 - 2)).number(0).style(totalCell);
                 }

                 if(overallTrps > 0) {
                   ws[m].cell(6 +   a, 4 + (times.length * 2) + 2 - (customStartRange * 2 - 2)).number(Math.round(overallTrps)).style(totalCell);
                 } else {
                   ws[m].cell(6 +   a, 4 + (times.length * 2) + 2 - (customStartRange * 2 - 2)).number(0).style(totalCell);
                 }



                } else {

                   if(overallBroadcast > 0) {
                    ws[m].cell(6 +   a, 4 + (times.length * 2) + 1).number(Math.round(overallBroadcast)).style(totalCell);
                  } else {
                    ws[m].cell(6 +   a, 4 + (times.length * 2) + 1).number(0).style(totalCell);
                  }

                  if(overallTrps > 0) {
                    ws[m].cell(6 +   a, 4 + (times.length * 2) + 2).number(Math.round(overallTrps)).style(totalCell);
                  } else {
                    ws[m].cell(6 +   a, 4 + (times.length * 2) + 2).number(0).style(totalCell);
                  }

                }

           }// Top table end a loop






      //Second Table
      for(var a = 0; a < bottomMediaTypes.length; a++){

        //Second table market rows
        if(a == bottomMediaTypes.length - 1) {
            ws[m].cell(
              6 +   mediatypes.length + 1 + a - bottomMediaTypes.length + 1,
              1,
              6 +   mediatypes.length + 1 + a,
              1,
              true
            ).string(markets[m]).style(emptyCell)
        }

        var supportStyle;

        if(bottomSupports[a] == "Friendly"){
          supportStyle = friendlyCell;
        } else if(bottomSupports[a] == "Unfriendly") {
          supportStyle = unFriendlyCell;
        } else {
          supportStyle = emptyCell;
        }

        if(bottomSupports[a - 1] == bottomSupports[a] && bottomSupports[a + 1] == bottomSupports[a]) {
         } else if(bottomSupports[a + 1] == bottomSupports[a]) {
         } else if(bottomSupports[a - 1] == bottomSupports[a]) {

              var joint = 0;

              for(var q = 0; q < bottomSupports.length; q++) {
                if(bottomSupports[q] == bottomSupports[a]) {
                  joint += 1;
                }
              }


              ws[m].cell(6 +   mediatypes.length + 1 + a - (joint - 1),
              2,
              6 +   mediatypes.length + 1 + a,
              3,
              true).string(bottomSupports[a]).style(supportStyle)
        } else {
          ws[m].cell(6 +   mediatypes.length + 1 + a, 2, 6 +
          mediatypes.length + 1 + a, 3, true).string(bottomSupports[a]).style(supportStyle)

        }







        ws[m].cell(6 +   mediatypes.length + 1 + a, 4).string(bottomMediaTypes[a]).style(emptyCell);

        var overallBroadcast = 0;
        var overallTrps = 0;

            for(var o = 0; o < times.length; o++) {
              var broadcastTotal = 0;
              var trpsTotal = 0;

              if(req.body.start > times.length - o && req.body.start > 1 && o != times.length) {
              } else {

              for(var i = 0; i < spenderResults.length; i++) {

                      var broadcast = spenderResults[i].amount;

                      if(spenderResults[i].trps == 0){
                        var trps = spenderResults[i].spots;
                      } else {
                        var trps = spenderResults[i].trps;
                      }

                      var date = moment(spenderResults[i].date).format("MM/DD")
                      var firstTime = moment(times[o].substr(0,5), "MM/DD").subtract(1, "days")
                      var secondTime = moment(times[o].substr(7,9), "MM/DD").add(1, "days")

                         if(spenderResults[i].market == markets[m] && spenderResults[i].mediatype == bottomMediaTypes[a] && spenderResults[i].support == bottomSupports[a]) {
                             if(moment(date , "MM/DD").isBetween(moment(firstTime, "MM/DD"), moment(secondTime, "MM/DD"), null, '[]')) {

                                    broadcastTotal += broadcast;
                                    overallBroadcast += broadcast;
                                    trpsTotal += trps;
                                    overallTrps += trps;

                              }

                          }

                      //Total media type row
                      if(spenderResults[i].market == markets[m] && bottomMediaTypes[a] == "Total" && spenderResults[i].support == bottomSupports[a]) {
                        if(moment(date , "MM/DD").isBetween(moment(firstTime, "MM/DD"), moment(secondTime, "MM/DD"), null, '[]')) {
                            broadcastTotal += broadcast;
                            overallBroadcast += broadcast;
                            trpsTotal += trps;
                           }
                      }

                      var cellStyle;

                      if(bottomSupports[a] == "Friendly" && broadcastTotal > 0) {
                        cellStyle = friendlyCell
                      } else if(bottomSupports[a] == "Unfriendly" && broadcastTotal > 0) {
                        cellStyle = unFriendlyCell;
                      } else {
                        cellStyle = emptyCell;
                      }

                    ws[m].cell(6 +  mediatypes.length + 1 + a, 4 + o + (o + 1)).number(Math.round(broadcastTotal)).style(cellStyle);

                    if(bottomMediaTypes[a] == "Total"){
                        ws[m].cell(6 +  mediatypes.length + 1 + a, 5 + o + (o + 1)).style(blankStyle);
                    } else {
                        ws[m].cell(6 +  mediatypes.length + 1 + a, 5 + o + (o + 1)).number(Math.round(trpsTotal)).style(cellStyle);
                    }

              }

            }
      }

      if(customStartRange > 0){

        ws[m].cell(6 +   mediatypes.length + 1 + a, 4 + (times.length * 2) + 1 - (customStartRange * 2 - 2)).number(Math.round(overallBroadcast)).style(totalCell);

        if(bottomMediaTypes[a] == "Total"){
          ws[m].cell(6 +   mediatypes.length + 1 + a, 4 + (times.length * 2) + 2 - (customStartRange * 2 - 2)).style(blankStyle);
        } else {
           ws[m].cell(6 +   mediatypes.length + 1 + a, 4 + (times.length * 2) + 2 - (customStartRange * 2 - 2)).number(Math.round(overallTrps)).style(totalCell);
        }

      } else {


        ws[m].cell(6 +   mediatypes.length + 1 + a
        , 4 + (times.length * 2) + 1).number(Math.round(overallBroadcast)).style(totalCell);

        if(bottomMediaTypes[a] == "Total"){
          ws[m].cell(6 +   mediatypes.length + 1 + a, 4 + (times.length * 2) + 2).style(blankStyle);
        } else {
           ws[m].cell(6 +   mediatypes.length + 1 + a, 4 + (times.length * 2) + 2).number(Math.round(overallTrps)).style(totalCell);
        }

      }

    }







      //Variance table
      for(var v = 0; v < varianceTypes.length; v++) {
        var overAllAmount = 0;
        var overallTrps = 0;

        //Media Type cell
       ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + v, 2, 6 +
         mediatypes.length + 1 + bottomMediaTypes.length + 1 + v, 3, true).string(varianceTypes[v] + " Variance").style(emptyCell)
        //Blank cell
        ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + v, 4).string("").style(emptyCell);


        for(var o = 0; o < times.length; o++) {
          if(req.body.start > times.length - o && req.body.start > 1 && o != times.length) {
          }else {
          var amountTotal = 0;
          var trpsTotal = 0;

          if(req.body.start > times.length - o && req.body.start > 1 && o != times.length) {
          } else {
            for(var i = 0; i < spenderResults.length; i++) {

                    var amount = spenderResults[i].amount;

                    if(spenderResults[i].trps > 0){
                      var trps = spenderResults[i].trps;
                    } else {
                      var trps = spenderResults[i].spots;
                    }

                    var date = moment(spenderResults[i].date).format("MM/DD")
                    var firstTime = moment(times[o].substr(0,5), "MM/DD").subtract(1, "days")
                    var secondTime = moment(times[o].substr(7,9), "MM/DD").add(1, "days")

                       if(spenderResults[i].market == markets[m] && spenderResults[i].mediatype == varianceTypes[v]) {
                          if(moment(date , "MM/DD").isBetween(moment(firstTime, "MM/DD"), moment(secondTime, "MM/DD"), null, '[]')) {
                                if(spenderResults[i].person != "Friendly") {
                                  amountTotal -= amount;
                                  trpsTotal -= trps;

                                  overAllAmount -= amount;
                                  overallTrps -= trps;

                                } else {
                                  amountTotal += amount;
                                  trpsTotal += trps;

                                  overAllAmount += amount;
                                  overallTrps += trps;

                                }

                            }

                        } else if (spenderResults[i].market == markets[m] && varianceTypes[v] == "Total") {

                          if(moment(date , "MM/DD").isBetween(moment(firstTime, "MM/DD"), moment(secondTime, "MM/DD"), null, '[]')) {

                               if(spenderResults[i].person != "Friendly") {
                                 amountTotal -= amount;
                                 trpsTotal -= trps;

                                 overAllAmount -= amount;
                                 overallTrps -= trps;

                               } else {
                                 amountTotal += amount;
                                 trpsTotal += trps;

                                 overAllAmount += amount;
                                 overallTrps += trps;

                               }

                           }

                        }

                        var cellStyle;

                        if(bottomSupports[a] == "Friendly" && broadcastTotal > 0) {
                          cellStyle = friendlyCell
                        } else if(bottomSupports[a] == "Unfriendly" && broadcastTotal > 0) {
                          cellStyle = unFriendlyCell;
                        } else {
                          cellStyle = emptyCell;
                        }

                      ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + v, 4 + o + (o + 1)).number(Math.round(amountTotal)).style(cellStyle);

                      if(varianceTypes[v] == "Total"){
                        ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + v, 4 + o + (o + 2)).style(blankStyle);
                      } else {
                        ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + v, 4 + o + (o + 2)).number(Math.round(trpsTotal)).style(cellStyle);
                      }

              }// end i loop, end of spenderResults

            }}// end o loop, time ranges


            if(customStartRange > 0){
              ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + v, 4 + (times.length * 2) + 1 - (customStartRange * 2 - 2)).number(Math.round(overAllAmount)).style(totalCell);

              if(varianceTypes[v] == "Total"){
                ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + v, 4 + (times.length * 2) + 2 - (customStartRange * 2 - 2)).style(blankStyle);
              } else {
                ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + v, 4 + (times.length * 2) + 2 - (customStartRange * 2 - 2)).number(Math.round(overallTrps)).style(totalCell);
              }


            } else {
              ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + v, 4 + (times.length * 2) + 1).number(Math.round(overAllAmount)).style(totalCell);

              if(varianceTypes[v] == "Total"){
                ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + v, 4 + (times.length * 2) + 2).style(blankStyle);
              } else {
                ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + v, 4 + (times.length * 2) + 2).number(Math.round(overallTrps)).style(totalCell);
              }

            }



        }
      }//end v loop, variance table/varianceTypes, has overall totals of a loop, end of row



      ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + varianceTypes.length + 2, 3).string("Spender").style(columnhead);;
      ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + varianceTypes.length + 2, 4).string("Spot").style(columnhead);
      ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + varianceTypes.length + 2, 5).string("Dollars").style(columnhead);
      ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + varianceTypes.length + 2, 6).string("TRPS/Spots").style(columnhead);
      ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + varianceTypes.length + 2, 7).string("Type").style(columnhead);
      ws[m].cell(6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + varianceTypes.length + 2, 8,
                 6 +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + varianceTypes.length + 2, 9, true).string("Flight Dates").style(columnhead);

    for(var a = 0; a < ads.length; a++) {

      var cellStyle;

      if(ads[a].support == "Friendly") {
        cellStyle = friendlyCell
      } else if(ads[a].support == "Unfriendly") {
        cellStyle = unFriendlyCell;
      } else {
        cellStyle = emptyCell;
      }

      ws[m].cell(7 + a +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + varianceTypes.length + 2, 3).string(ads[a].spender).style(cellStyle);
      ws[m].cell(7 + a +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + varianceTypes.length + 2, 4).string(ads[a].description).style(cellStyle);
      ws[m].cell(7 + a +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + varianceTypes.length + 2, 5).number(Math.round(ads[a].total)).style(cellStyle);
      ws[m].cell(7 + a +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + varianceTypes.length + 2, 6).number(Math.round(ads[a].spots)).style(cellStyle);
      ws[m].cell(7 + a +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + varianceTypes.length + 2, 7).string(ads[a].mediatype).style(emptyCell);
      ws[m].cell(7 + a +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + varianceTypes.length + 2, 8,
                7 + a +   mediatypes.length + 1 + bottomMediaTypes.length + 1 + varianceTypes.length + 2, 9, true).string(ads[a].start + " - " + ads[a].end).style(emptyCell);
    }


}// end m loop, mediamarkets, finish creating excel

	wb.write('MyWorkBook.xlsx', res);
}

module.exports = makeSSMarket;
