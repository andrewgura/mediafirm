import React, { Component } from "react";
import { Modal } from 'react-bootstrap';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css'
var moment = require('moment');

class ViewStationSummary extends Component {
  /* eslint-disable */
  constructor(props) {
    super(props);
    this.state = {
      spenders: [],
      spenderResults: [],
      toggles: [],
      summary: [],
      singleMediaType: [],
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

      var spenders = [];
      data.spenders.map(item => {

        if(spenders.includes(item) == false){
          spenders.push(item)
        }

      })

      var spenderResults = [];
      data.spenderResults.map(item => {
          spenderResults.push(item)
      })

      var stationInfo = [];
      data.stationData.map(item => {
          stationInfo.push(item)
      })


      var singleMediaType = [];
      data.mediatypes.map(item => {
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

      this.setState({spenders: spenders, spenderResults: spenderResults,
        singleMediaType: singleMediaType, stationData: stationInfo,
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
    var data = [];

    this.state.stationData.forEach((item, i) => {

      var spender = item[3]
      var mediatype = item[2];
      var market = item[1];
      var station = item[0]

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

console.log(data)



    var tabs = [];

    for(var m = 0; m < data.length; m++){

      var spenderName = Object.keys(data[m]);
      var spenderTotal = 0;


      var topTable = [];

      for(var p = 0; p < data[m][spenderName].length; p++){
        var marketName = Object.keys(data[m][spenderName][p])
        var marketTotal = 0;


        for(var t = 0; t < data[m][spenderName][p][marketName].length; t++){
          var mediaType = Object.keys(data[m][spenderName][p][marketName][t]);

          var weekRow = [];
          var timeRow = [];

          //Write table week ranges
          var weekCell = [];
          var timeCell = [];

          //Write table column headers
          var headerRow = [];
          var headerCell = [];

          for(var a = 0; a < this.state.times.length; a++) {

              weekCell.push(<td key={a} className={"week week" + Number(this.state.times.length - a)} style={{backgroundColor: "#3d4c79", color: "#ffffff"}} colSpan="2" >Week: {this.state.times.length - a}</td>)
              timeCell.push(<td key={a} className={"week week" + Number(this.state.times.length - a)} style={{backgroundColor: "#3d4c79", color: "#ffffff"}} colSpan="2" >{this.state.times[a]}</td>)
              headerCell.push(<td key={a + 'a'} className={"week week" + Number(this.state.times.length - a)}>Dollars</td>);
              headerCell.push(<td key={a + "b"} className={"week week" + Number(this.state.times.length - a)}>TRPS/Spots</td>);

          }
          weekRow.push(<tr><td style={{border: "none"}}></td><td style={{border: "none"}}></td><td style={{border: "none"}}></td>{weekCell}</tr>);
          timeRow.push(<tr><td style={{border: "none"}} colSpan="2">{marketName}</td><td style={{border: "none"}}></td>{timeCell}<td colSpan="2">Total</td></tr>)
          headerRow.push(<tr style={{backgroundColor: "#ca9e41", color: "#ffffff"}}><td colSpan="2">{mediaType + " Stations"}</td><td></td>{headerCell}<td>Dollars</td><td>TRPS/Spots</td></tr>)

          topTable.push(weekRow);
          topTable.push(timeRow);
          topTable.push(headerRow);

          var dataRow = [];

          for(var s = 0; s < data[m][spenderName][p][marketName][t][mediaType].length; s++) {
            var stationCell = [];
            var stationName = data[m][spenderName][p][marketName][t][mediaType][s];
            stationCell.push(<td colSpan="2">{stationName}</td>);

            var amountTotal = 0;
            var trpsTotal = 0;

            var stationRow = [];
            var totalRow = [];

            for(var a = 0; a < this.state.times.length; a++) {
              var amountCell = 0;
              var trpsCell = 0;
              var totalamountCell = 0;
              var totaltrpsCell = 0;

              for(var i = 0 ; i < this.state.spenderResults.length; i++){


                    var amount = this.state.spenderResults[i].amount;

                    if(this.state.spenderResults[i].trps === 0){
                        var trps = this.state.spenderResults[i].spots;
                    } else {
                      var trps = this.state.spenderResults[i].trps;
                    }

                    var date = moment(this.state.spenderResults[i].date).format("MM/DD")
                    var firstTime = moment(this.state.times[a].substr(0,5), "MM/DD").subtract(1, "days")
                    var secondTime = moment(this.state.times[a].substr(7,9), "MM/DD").add(1, "days")

                    if(this.state.spenderResults[i].market == marketName && this.state.spenderResults[i].spender == spenderName && this.state.spenderResults[i].mediatype == mediaType && this.state.spenderResults[i].station == stationName) {
                      if(moment(date , "MM/DD").isBetween(moment(firstTime, "MM/DD"), moment(secondTime, "MM/DD"), null, '[]')) {

                          amountCell += amount;
                          trpsCell += trps;

                           amountTotal += amount;
                           trpsTotal += trps;

                           marketTotal += amount;
                           spenderTotal += amount;

                         }

                     }

                     if(s == data[m][spenderName][p][marketName][t][mediaType].length - 1){
                       if(this.state.spenderResults[i].market == marketName && this.state.spenderResults[i].spender == spenderName && this.state.spenderResults[i].mediatype == mediaType) {
                         if(moment(date , "MM/DD").isBetween(moment(firstTime, "MM/DD"), moment(secondTime, "MM/DD"), null, '[]')) {

                             totalamountCell += amount;
                             totaltrpsCell += trps;

                            }

                        }

                     }



              }

              stationRow.push(<td className={"week week" + Number(this.state.times.length - a)}>{Math.round(amountCell)}</td>)
              stationRow.push(<td className={"week week" + Number(this.state.times.length - a)}>{Math.round(trpsCell)}</td>)

              totalRow.push(<td className={"week week" + Number(this.state.times.length - a)}>{Math.round(totalamountCell)}</td>);
              totalRow.push(<td className={"week week" + Number(this.state.times.length - a)}>{Math.round(totaltrpsCell)}</td>)
            }


            dataRow.push(<tr className={mediaType}>{stationCell}<td></td>{stationRow}<td>{Math.round(amountTotal)}</td><td>{Math.round(trpsTotal)}</td></tr>)

          }
          dataRow.push(<tr><td colSpan="2">Total</td><td></td>{totalRow}</tr>)
          topTable.push(dataRow);
          topTable.push(<tr style={{height: "50px", border: "none"}}></tr>);

          }

          dataRow.push(<tr style={{border: "none", height: "25px"}}></tr>)
          dataRow.push(<tr><td style={{border: "none"}}>{marketName + " Total: " + Math.round(marketTotal)}</td></tr>)
        }

      if(m === 0) {
        tabs.push(<div id={this.state.spenders[m]} className="tabcontent firsttab"><h3>{this.state.spenders[m]}</h3><h4>Spender Total: {Math.round(spenderTotal)}</h4><table style={{border: "none"}}><tbody>{topTable}</tbody></table></div>)
      } else {
        tabs.push(<div id={this.state.spenders[m]} className="tabcontent"><h3>{this.state.spenders[m]}</h3><h4>Spender Total: {Math.round(spenderTotal)}</h4><table style={{border: "none"}}><tbody>{topTable}</tbody></table></div>)
      }


    }
    this.setState({summary: tabs})
  }


  buildWeekDisplayRange() {
    var x = [
      <div key="slider" style={{width: "70%", margin: "20px", marginLeft: "50px"}}>
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
    const { singleMediaType, spenders } = this.state;

    return (
      <Modal className="spenderSummary" show={true} onHide={()=> this.props.onResultChange()}>
        <h2>Spender Summary</h2>
        <h3>{this.props.type}</h3>
        <div style={{display: "flex"}}>
          <div className="checkboxContainer">
              <h4>Hide By MediaType</h4>
              <div className="checkboxes">
               {singleMediaType.map(item => {
                 return (
                   <p style={{marginLeft: "1em"}} key={item}><input type="checkbox" onChange={this.handleCheck.bind(this, item)} name={item} value={item}/> <span>{item}</span></p>
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
          <h2>Spenders</h2>
          <div className="tab">
            {spenders.map((item, index) => {
                if(index === 0){
                  return (
                    <button key={item} className="tablinks active" onClick={this.changeTab.bind(this, item)}>{item}</button>
                  )
                } else {
                  return (
                    <button key={item} className="tablinks" onClick={this.changeTab.bind(this, item)}>{item}</button>
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

export default ViewStationSummary;
