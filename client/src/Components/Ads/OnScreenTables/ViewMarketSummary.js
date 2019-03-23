import React, { Component } from "react";
import { Modal } from 'react-bootstrap';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css'
var moment = require('moment');

class ViewMarketSummary extends Component {
  /* eslint-disable */
  constructor(props) {
    super(props);
    this.state = {
      markets: [],
      topSpenders: [],
      spenderResults: [],
      adResults: [],
      topSupports: [],
      topMediaTypes: [],
      toggles: [],
      singleMediaType: [],
      summary: [],
      start: "",
      end: "",
      earliestStart: "",
      earliestEnd: "",
      times: [],
      rangeSlider: [],
      minSlide: 1,
      maxSlide: 0,
      maxSlideStart: 0
    }
  }

  async componentDidMount() {

    const response = await fetch('/api/summarySpender' + this.props.districtid + "/electiontype" + this.props.type);
    await response.json().then(data => {

      var markets = [];
      data.markets.map(item => {
          markets.push(item)
      })


      var topSpenders = [];
      data.spenders.map(item => {
          topSpenders.push(item)
      })

      var spenderResults = [];
      data.spenderResults.map(item => {
          spenderResults.push(item)
      })

      var adResults = [];
      data.adResults.map(item => {
          adResults.push(item)
      })

      var topSupports = [];
      data.supports.map(item => {
          topSupports.push(item)
      })

      var topMediaTypes = [];
      var singleMediaType = [];
      data.mediatypes.map(item => {
          topMediaTypes.push(item)

          if(singleMediaType.includes(item) === false){
            singleMediaType.push(item)
          }

      })

      var earliestStart, earliestEnd;

      if(data.earliestStartEndBuys === undefined) {
        earliestStart = ''
        earliestEnd = ''
      } else {
        earliestStart = data.earliestStartEndBuys.startdate;
        earliestEnd = data.earliestStartEndBuys.enddate;
      }


      // var earliestStart = data.earliestStartEndBuys.startdate  ? data.earliestStartEndBuys.startdate  : new Date();

      this.setState({markets: markets, topSpenders: topSpenders, spenderResults: spenderResults,
        topSupports: topSupports, topMediaTypes: topMediaTypes, singleMediaType: singleMediaType,
        adResults: adResults,
        start: data.startEndDates.generalWeekStart, end: data.startEndDates.generalWeekEnd,
        earliestStart: earliestStart, earliestEnd: earliestEnd
      });
    })

    await this.weekrange();
    this.buildSpenderSummary();
  }




  async weekrange() {
        var times = [];

        var start = new Date(this.state.start)
        var finish = new Date(this.state.end)

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
         } while (x > moment(this.state.earliestStart).format("MM/DD") === true);
         times.reverse();
         times.pop();
         times.push(lastweek)

         this.setState({times: times, maxSlide: times.length, maxSlideStart: times.length})

         await this.buildWeekDisplayRange()
  }







  buildSpenderSummary() {
    var tabs = [];

    for(var m = 0; m < this.state.markets.length; m++){
      var topTable = [];


      var weekRow = [];
      var timeRow = [];

      //Write table week ranges
      var weekCell = [];
      var timeCell = [];
      for(var a = 0; a < this.state.times.length; a++) {

          weekCell.push(<td className={"week week" + Number(this.state.times.length - a)} style={{backgroundColor: "#3d4c79", color: "#ffffff"}} colSpan="2" >Week: {this.state.times.length - a}</td>)
          timeCell.push(<td className={"week week" + Number(this.state.times.length - a)} style={{backgroundColor: "#3d4c79", color: "#ffffff"}} colSpan="2" >{this.state.times[a]}</td>)

      }
      weekRow.push(<tr><td style={{border: "none"}}></td><td style={{border: "none"}}></td><td style={{border: "none"}}></td>{weekCell}</tr>);
      timeRow.push(<tr><td style={{border: "none"}}></td><td style={{border: "none"}}></td><td style={{border: "none"}}></td>{timeCell}<td colSpan="2">Total</td></tr>)
      topTable.push(weekRow);
      topTable.push(timeRow);

      //Write table column headers
      var headerRow = [];
      var headerCell = [];
      for(var a = 0; a < this.state.times.length; a++) {
              headerCell.push(<td className={"week week" + Number(this.state.times.length - a)}>Amount</td>);
              headerCell.push(<td className={"week week" + Number(this.state.times.length - a)}>TRPS/Spots</td>);
      }

      headerRow.push(<tr style={{backgroundColor: "#ca9e41", color: "#ffffff"}}><td>Support</td><td>Spender</td><td>Type</td>{headerCell}<td>Dollars</td><td>TRPS/Spots</td></tr>)
      topTable.push(headerRow)


      //Begin writing top Table
      for(var a = 0; a < this.state.topMediaTypes.length; a++) {
        var row = [];

        var supportCell = [];
        var spenderCell = [];
        var typeCell = [];


        if(this.state.topSupports[a] == "Friendly") {
          supportCell.push(<td className="friendly">{this.state.topSupports[a]}</td>)
          spenderCell.push(<td className="friendly">{this.state.topSpenders[a]}</td>)
        } else {
          supportCell.push(<td className="unfriendly">{this.state.topSupports[a]}</td>)
          spenderCell.push(<td className="unfriendly">{this.state.topSpenders[a]}</td>)
        }


        typeCell.push(<td>{this.state.topMediaTypes[a]}</td>)

        var amountTotal = 0;
        var trpsspotsTotal = 0;

        var dataRow = [];

          for(var o = 0; o < this.state.times.length; o++) {
            var amountCell = 0;
            var trpsspotsCell = 0;


            for(var i = 0 ; i < this.state.spenderResults.length; i++){

                  var amount = this.state.spenderResults[i].amount;

                  if(this.state.spenderResults[i].trps === 0){
                      var trps = this.state.spenderResults[i].spots;
                  } else {
                    var trps = this.state.spenderResults[i].trps;
                  }

                  var date = moment(this.state.spenderResults[i].date).format("MM/DD")
                  var firstTime = moment(this.state.times[o].substr(0,5), "MM/DD").subtract(1, "days")
                  var secondTime = moment(this.state.times[o].substr(7,9), "MM/DD").add(1, "days")

                  if(this.state.spenderResults[i].market === this.state.markets[m] && this.state.spenderResults[i].spender === this.state.topSpenders[a] && this.state.spenderResults[i].mediatype === this.state.topMediaTypes[a] && this.state.spenderResults[i].support === this.state.topSupports[a]) {
                      if(moment(date , "MM/DD").isBetween(moment(firstTime, "MM/DD"), moment(secondTime, "MM/DD"), null, '[]')) {

                        amountCell += amount;
                        trpsspotsCell += trps;

                         amountTotal += amount;
                         trpsspotsTotal += trps;

                       }

                   }

            }

              if(this.state.topSupports[a] == "Friendly" && amountCell > 0){
                    dataRow.push(<td className={"friendly week week" + Number(this.state.times.length - o)}>{Math.round(amountCell)}</td>)
                    dataRow.push(<td className={"friendly week week" + Number(this.state.times.length - o)}>{Math.round(trpsspotsCell)}</td>)
              } else if (this.state.topSupports[a] != "Friendly" && amountCell > 0) {
                  dataRow.push(<td className={"unfriendly week week" + Number(this.state.times.length - o)}>{Math.round(amountCell)}</td>)
                  dataRow.push(<td className={"unfriendly week week" + Number(this.state.times.length - o)}>{Math.round(trpsspotsCell)}</td>)
              } else {
                dataRow.push(<td className={"week week" + Number(this.state.times.length - o)}>{Math.round(amountCell)}</td>)
                dataRow.push(<td className={"week week" + Number(this.state.times.length - o)}>{Math.round(trpsspotsCell)}</td>)
              }
          }


        row.push(<tr className={this.state.topMediaTypes[a].replace(/\s/g, "")}>{supportCell}{spenderCell}{typeCell}{dataRow}<td>{Math.round(amountTotal)}</td><td>{Math.round(trpsspotsTotal)}</td></tr>)
        topTable.push(row)
      }



      var middleMediaTypes = () => {
        var x = [];

        for(var i = 0; i < this.state.topMediaTypes.length; i++){
          if(x.includes(this.state.topMediaTypes[i]) == false) {
            x.push(this.state.topMediaTypes[i])
          }
        }
        x.push("Total");

        x = x.concat(x)

        return x;
      };


      var middleSupports = () => {
        var x = [];
        x = Array.from(new Set(this.state.topSupports));
        var y = [];
        for(var i = 0; i < middleMediaTypes().length / 2; i++) {
          y = y.concat(x)
        }
        y.sort();
        return y;
      }

      var middleTable = [];
      middleTable.push(<tr style={{height: "50px", border: "none"}}></tr>)

      //Begin Middle Table
      for(var a = 0; a < middleSupports().length; a++) {
          var row = [];
          var supportCell = [];
          var typeCell = [];

          if(middleSupports()[a] == "Friendly") {
            supportCell.push(<td className="friendly" colSpan="2">{middleSupports()[a]}</td>)
          } else {
            supportCell.push(<td className="unfriendly" colSpan="2">{middleSupports()[a]}</td>)
          }

          typeCell.push(<td>{middleMediaTypes()[a]}</td>)

          var dataRow = [];

          var amountTotal = 0;
          var trpsspotsTotal = 0;
          for(var o = 0; o < this.state.times.length; o++) {



            var amountCell = 0;
            var trpsspotsCell = 0;
                for(var i = 0 ; i < this.state.spenderResults.length; i++){

                    var amount = this.state.spenderResults[i].amount;

                    if(this.state.spenderResults[i].trps === 0){
                        var trps = this.state.spenderResults[i].spots;
                    } else {
                      var trps = this.state.spenderResults[i].trps;
                    }


                    var date = moment(this.state.spenderResults[i].date).format("MM/DD")
                    var firstTime = moment(this.state.times[o].substr(0,5), "MM/DD").subtract(1, "days")
                    var secondTime = moment(this.state.times[o].substr(7,9), "MM/DD").add(1, "days")

                    if(this.state.spenderResults[i].market === this.state.markets[m] && this.state.spenderResults[i].mediatype === middleMediaTypes()[a] && this.state.spenderResults[i].support === middleSupports()[a]) {
                      if(moment(date , "MM/DD").isBetween(moment(firstTime, "MM/DD"), moment(secondTime, "MM/DD"), null, '[]')) {

                          amountCell += amount;
                          trpsspotsCell += trps;

                           amountTotal += amount;
                           trpsspotsTotal += trps;

                         }
                     }


                     if(this.state.spenderResults[i].market === this.state.markets[m] && middleMediaTypes()[a] === "Total" && this.state.spenderResults[i].support === middleSupports()[a]) {
                        if(moment(date , "MM/DD").isBetween(moment(firstTime, "MM/DD"), moment(secondTime, "MM/DD"), null, '[]')) {

                           amountCell += amount;
                           trpsspotsCell += trps;

                            amountTotal += amount;
                            trpsspotsTotal += trps;
                          }
                     }

                }
            if(middleSupports()[a] === "Friendly" && amountCell > 0){
                  dataRow.push(<td className={"friendly week week" + Number(this.state.times.length - o)}>{Math.round(amountCell)}</td>)
                  dataRow.push(<td className={"friendly week week" + Number(this.state.times.length - o)}>{Math.round(trpsspotsCell)}</td>)
            } else if (middleSupports()[a] !== "Friendly" && amountCell > 0) {
                dataRow.push(<td className={"unfriendly week week" + Number(this.state.times.length - o)}>{Math.round(amountCell)}</td>)
                dataRow.push(<td className={"unfriendly week week" + Number(this.state.times.length - o)}>{Math.round(trpsspotsCell)}</td>)
            } else {
              dataRow.push(<td className={"week week" + Number(this.state.times.length - o)}>{Math.round(amountCell)}</td>)
              dataRow.push(<td className={"week week" + Number(this.state.times.length - o)}>{Math.round(trpsspotsCell)}</td>)
            }
          }



          row.push(<tr className={middleMediaTypes()[a].replace(/\s/g, "")}>{supportCell}{typeCell}{dataRow}<td>{Math.round(amountTotal)}</td><td>{Math.round(trpsspotsTotal)}</td></tr>)
          middleTable.push(row)
      }

      var variances = () => {
        var x = [];

        for(var i = 0; i < this.state.topMediaTypes.length; i++) {
            if(x.includes(this.state.topMediaTypes[i]) === false) {
              x.push(this.state.topMediaTypes[i])
            }
        }

        return x;
      }

      var botttomTable = [];
      botttomTable.push(<tr style={{height: "50px"}}></tr>)

      for(var v = 0; v < variances().length; v++) {
        var typeCell = [<td colSpan="2">{variances()[v] + " Variance"}</td>];
        var blankCell = [<td></td>]
        var row = [];

        var overAllAmount = 0;
        var overallTrps = 0;
        var dataRow = [];
        for(var o = 0; o < this.state.times.length; o++) {
          var amountTotal = 0;
          var trpsTotal = 0;


            for(var i = 0; i < this.state.spenderResults.length; i++) {

                    var amount = this.state.spenderResults[i].amount;

                    if(this.state.spenderResults[i].trps > 0){
                      var trps = this.state.spenderResults[i].trps;
                    } else {
                      var trps = this.state.spenderResults[i].spots;
                    }

                    var date = moment(this.state.spenderResults[i].date).format("MM/DD")
                    var firstTime = moment(this.state.times[o].substr(0,5), "MM/DD").subtract(1, "days")
                    var secondTime = moment(this.state.times[o].substr(7,9), "MM/DD").add(1, "days")

                       if(this.state.spenderResults[i].market === this.state.markets[m] && this.state.spenderResults[i].mediatype === variances()[v]) {
                          if(moment(date , "MM/DD").isBetween(moment(firstTime, "MM/DD"), moment(secondTime, "MM/DD"), null, '[]')) {

                                if(this.state.spenderResults[i].support !== "Friendly") {
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

                        } else if (this.state.spenderResults[i].market === this.state.markets[m] && variances()[v] === "Total") {

                        if(moment(date , "MM/DD").isBetween(moment(firstTime, "MM/DD"), moment(secondTime, "MM/DD"), null, '[]')) {

                               if(this.state.spenderResults[i].support !== "Friendly") {
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

              }// end i loop, end of spenderResults

              dataRow.push(<td className={"week week" + Number(this.state.times.length - o)}>{Math.round(amountTotal)}</td>)
              dataRow.push(<td className={"week week" + Number(this.state.times.length - o)}>{Math.round(trpsTotal)}</td>)
            }// end o loop, time ranges
            row.push(typeCell, blankCell,dataRow);

        botttomTable.push(<tr className={variances()[v].replace(/\s/g, "")}>{row}<td>{Math.round(overAllAmount)}</td><td>{Math.round(overallTrps)}</td></tr>);
      }

      var adsTable = [];
      adsTable.push(<tr style={{height: "50px"}}></tr>)
      adsTable.push(<tr><td>Spender</td><td>Spot</td><td>Dollars</td><td>TRPS/Spots</td><td>Type</td><td colSpan="2">Flight Dates</td></tr>)


      for(var i = 0; i < this.state.adResults.length; i++) {
        var row = [];
        var spenderCell = this.state.adResults[i].spender;
        var spotCell = this.state.adResults[i].spot;
        var dollarsCell = this.state.adResults[i].total;
        var trpsCell = this.state.adResults[i].spots;
        var typeCell = this.state.adResults[i].mediatype;
        var flightDates = this.state.adResults[i].start + " - " + this.state.adResults[i].end;

        row.push(<tr><td>{spenderCell}</td><td>{spotCell}</td><td>{dollarsCell}</td><td>{trpsCell}</td><td>{typeCell}</td><td colspan="2">{flightDates}</td></tr>)
        adsTable.push(row)
      }




      if(m === 0) {
        tabs.push(<div id={this.state.markets[m]} className="tabcontent firsttab"><h3>{this.state.markets[m]}</h3><table><tbody>{topTable}{middleTable}{botttomTable}{adsTable}</tbody></table></div>)
      } else {
        tabs.push(<div id={this.state.markets[m]} className="tabcontent"><h3>{this.state.markets[m]}</h3><table><tbody>{topTable}{middleTable}{botttomTable}{adsTable}</tbody></table></div>)
      }


    }
    this.setState({summary: tabs})
  }


  buildWeekDisplayRange() {
    var x = [
      <div style={{width: "70%", margin: "20px", marginLeft: "50px"}}>
           <Range min={1} max={this.state.maxSlideStart} defaultValue={[1, this.state.maxSlide]} onChange={this.weekRangeSlide.bind(this)}/>
      </div>
    ]

    this.setState({rangeSlider: x});
  }




  handleCheck(mediatype){
    var type = document.getElementsByClassName(mediatype.replace(/\s/g, ""));


    for(var i = 0; i < type.length; i++) {
        type[i].classList.toggle("hide")
      }
  }


  weekRangeSlide(event) {
    this.setState({minSlide: event[0], maxSlide: event[1]})

    var cells = document.getElementsByClassName("week");

    for(var i = 0; i < cells.length; i++) {
      var currentCell = Number(cells[i].className.replace(/\D/g,''));

        if(event[0] <= currentCell && currentCell <= event[1] ){
            cells[i].classList.remove("hide")
        } else {
          cells[i].classList.add("hide")
        }

    }
  }

  changeTab(e, item) {

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");

    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");

    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(e).style.display = "block";
    item.currentTarget.className += " active";

  }

  render() {
    const { singleMediaType, markets } = this.state;



    return (
      <Modal className="spenderSummary" show={true} onHide={()=> this.props.onResultChange()}>
        <h2>Spender Summary By Market</h2>
        <h3>{this.props.type}</h3>
        <div style={{display: "flex"}}>
          <div className="checkboxContainer">
              <h4>Hide By MediaType</h4>
              <div className="checkboxes">
               {singleMediaType.map(item => {
                 return (
                   <p style={{marginLeft: "1em"}}><input type="checkbox" onChange={this.handleCheck.bind(this, item)} name={item} value={item}/> <span>{item}</span></p>
                 )
               })}
              </div>
            </div>

        <div className="sliderContain">
         <h3 className="text-center">Weeks {this.state.minSlide} - {this.state.maxSlide}</h3>
         {this.state.rangeSlider}
       </div>
       </div>

        <div className="spenderSumContainer">
          <h2>Markets</h2>
          <div className="tab">
            {markets.map((item, index) => {
                if(index === 0){
                  return (
                    <button className="tablinks active" onClick={this.changeTab.bind(this, item)}>{item}</button>
                  )
                } else {
                  return (
                    <button className="tablinks" onClick={this.changeTab.bind(this, item)}>{item}</button>
                  )
              }
            })}
          </div>
            {this.state.summary}
        </div>
    </Modal>
    );
  }
}

export default ViewMarketSummary;
