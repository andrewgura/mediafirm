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

async function makeCPPreport(req,res, spenderResults, earliestStartEndBuys, markets, mediatypes, spenders, supports, adResults){
  var results = [].concat.apply([], spenderResults);


  var data = [];

  markets.sort();

  markets.forEach(item => {
    data.push({[item]: []});
  })


for(var a = 0; a < data.length; a++){

  var marketName = Object.keys(data[a])
    results.forEach((item,i) => {
      if(item.market == marketName && data[a][marketName]) {


        if(data[a][marketName].length == 0) {

          data[a][marketName].push({[item.support]: item.spender})

        } else {
          var check = 0;
            for(var x = 0; x < data[a][marketName].length; x++){
              var support = Object.keys(data[a][marketName][x])
                      if(data[a][marketName][x][support] == item.spender){
                          check += 1;
                      }
              }

          if(check == 0) {
            data[a][marketName].push({[item.support]: item.spender})
          }

        }

      }
    })
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
if(req.body.start > 1){
  customStartRange = req.body.start
}


var wb = new xl.Workbook();
var ws = wb.addWorksheet('Sheet 1');
  ws.cell(1, 1,1,8,true).string('CPP Report').style(style1);


for(var m = 0; m < data.length; m++){
  var marketName = Object.keys(data[m])
  var supportLength = data[m][marketName].length;

        //Write headers
           for(var i = 0; i < times.length; i++) {
             if(req.body.start > times.length - i && req.body.start > 1 && i != times.length) {


             } else {

                 //Weak Number
                 ws.cell(3 + (m * (supportLength + 5)), 6 + i - 1).string("Week " + (times.length - i)).style(weeksStyle);
                 //Week Ranges
                 ws.cell(4 + (m * (supportLength + 5)), 6 + i - 1).string(times[i]).style(weeksStyle);
                 //Headers
                 ws.cell(5 + (m * (supportLength + 5)), 1).string("Market").style(columnhead);
                 ws.cell(5 + (m * (supportLength + 5)), 2).string("Support").style(columnhead);
                 ws.cell(5 + (m * (supportLength + 5)), 3).string("Spender").style(columnhead);
                 ws.cell(5 + (m * (supportLength + 5)), 4).string("Type").style(columnhead);
                 ws.cell(5 + (m * (supportLength + 5)), 4 + i + 1).string("Weekly CPP").style(columnhead);
           }

             //Totals Column
             if(i == times.length - 1) {

                if(customStartRange == 0){
                     ws.cell(5 + (m * (supportLength + 5)), 4 + i + 2).string("Avg. CPP").style(totalHead);
                 } else {
                     ws.cell(5 + (m * (supportLength + 5)), 4 + i + 2 - (customStartRange * 2 - 2)).string("Avg. CPP").style(totalHead);
                 }


             }

           } //end i loop, times.



      for(var a = 0; a < supportLength; a++) {

        var supportName = Object.keys(data[m][marketName][a]);
        var spenderName = data[m][marketName][a][supportName];


        var supportStyle;

        //Styling for support & spender cell
        if(supportName == "Friendly") {
          supportStyle = friendlyCell;
        } else if(supportName == "Unfriendly") {
           supportStyle = unFriendlyCell;
        } else {
          supportStyle = emptyCell;
        }

        ws.cell(6 + a + (m * (supportLength + 5)), 1).string(marketName).style(emptyCell);

        //Support
        ws.cell(6 + a + (m * (supportLength + 5)), 2).string(supportName).style(supportStyle);
        //Spender
        ws.cell(6 + a + (m * (supportLength + 5)), 3).string(spenderName).style(supportStyle);

        //Type
        ws.cell(6 + a + (m * (supportLength + 5)), 4).string("Broadcast").style(emptyCell);


        for(var o = 0; o < times.length; o++) {
            var cpp = 0;
            if(req.body.start > times.length - o && req.body.start > 1 && o != times.length) {
            } else {
            for(var i = 0; i < spenderResults.length; i++) {

                  var spenderCpp = spenderResults[i].cpp;

                  var date = moment(spenderResults[i].date).format("MM/DD")
                  var firstTime = moment(times[o].substr(0,5), "MM/DD").subtract(1, "days")
                  var secondTime = moment(times[o].substr(7,9), "MM/DD").add(1, "days")

                       if(spenderResults[i].market == marketName && spenderResults[i].spender == spenderName && spenderResults[i].mediatype == "Broadcast" && spenderResults[i].support == supportName) {
                           if(moment(date , "MM/DD").isBetween(moment(firstTime, "MM/DD"), moment(secondTime, "MM/DD"), null, '[]')) {

                                  cpp = spenderCpp;

                            }

                        }

               var cellStyle;

               if(supportName == "Friendly" && cpp > 0){
                 cellStyle = friendlyCell;
               } else if(supportName == "Unfriendly" && cpp > 0) {
                 cellStyle = unFriendlyCell;
               } else {
                 cellStyle = emptyCell;
               }

                ws.cell(6 + a + (m * (supportLength + 5)), 5 + o).number(Number(cpp)).style(cellStyle);

            }}

        }// end o loop, times.length

        if(supportName == "Friendly" && cpp > 0){
          cellStyle = friendlyCell;
        } else if(supportName == "Unfriendly" && cpp > 0) {
          cellStyle = unFriendlyCell;
        } else {
          cellStyle = emptyCell;
        }

        if(customStartRange > 0){
          ws.cell(6 + a + (m * (supportLength + 5)), 5 + times.length + 1 - (customStartRange * 2 - 2)).number(Number(cpp)).style(totalCell);
        } else {
          ws.cell(6 + a + (m * (supportLength + 5)), 5 + times.length).number(Number(cpp)).style(totalCell);
        }


      }



}// end m loop, mediamarkets, finish creating excel

	wb.write('MyWorkBook.xlsx', res);
}

module.exports = makeCPPreport;
