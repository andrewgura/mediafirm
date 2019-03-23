import React, { Component } from "react";
import { Modal } from 'react-bootstrap';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css'
var moment = require('moment');

class ViewCpp extends Component {
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
      markets.sort();

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

    var data = [];

    this.state.markets.forEach(item => {
      data.push({[item]: []});
    })

    data.sort();


    for(var a = 0; a < data.length; a++){

      var marketName = Object.keys(data[a])
        this.state.spenderResults.forEach((item,i) => {
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








    var tabs = [];

    for(var m = 0; m < data.length; m++){
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
      timeRow.push(<tr><td style={{border: "none"}}></td><td style={{border: "none"}}></td><td style={{border: "none"}}></td>{timeCell}</tr>)
      topTable.push(weekRow);
      topTable.push(timeRow);

      //Write table column headers
      var headerRow = [];
      var headerCell = [];
      for(var a = 0; a < this.state.times.length; a++) {
              headerCell.push(<td colspan="2" className={"week week" + Number(this.state.times.length - a)}>Weekly</td>);
      }

      headerRow.push(<tr style={{backgroundColor: "#ca9e41", color: "#ffffff"}}><td>Support</td><td>Spender</td><td>Type</td>{headerCell}<td colSpan="2">Avg. CPP</td></tr>)
      topTable.push(headerRow)


      //Begin writing top Table



        var marketName = Object.keys(data[m])
        var supportLength = data[m][marketName].length;

        var supportCell = [];
        var spenderCell = [];
        var typeCell = [];

        for(var t = 0; t < supportLength; t++){
          var row = [];
          var supportCell = [];
          var spenderCell = [];
          var typeCell = [];

          var rowArrAvg = [];

          var supportName = Object.keys(data[m][marketName][t]);
          var spenderName = data[m][marketName][t][supportName];

          if(supportName == "Friendly") {
            supportCell.push(<td className="friendly">{supportName}</td>)
            spenderCell.push(<td className="friendly">{spenderName}</td>)
          } else {
            supportCell.push(<td className="unfriendly">{supportName}</td>)
            spenderCell.push(<td className="unfriendly">{spenderName}</td>)
          }

          typeCell.push(<td>Broadcast</td>)

          var dataRow = [];
          var amountTotal = 0;
          var trpsspotsTotal = 0;

            for(var o = 0; o < this.state.times.length; o++) {
              var trpsspotsCell = [];


              for(var i = 0 ; i < this.state.spenderResults.length; i++){

                    var trps = Number(this.state.spenderResults[i].cpp);

                    var date = moment(this.state.spenderResults[i].date).format("MM/DD")
                    var firstTime = moment(this.state.times[o].substr(0,5), "MM/DD").subtract(1, "days")
                    var secondTime = moment(this.state.times[o].substr(7,9), "MM/DD").add(1, "days")

                    if(this.state.spenderResults[i].market == marketName && this.state.spenderResults[i].spender == spenderName && this.state.spenderResults[i].mediatype == "Broadcast" && this.state.spenderResults[i].support == supportName) {

                        if(moment(date , "MM/DD").isBetween(moment(firstTime, "MM/DD"), moment(secondTime, "MM/DD"), null, '[]')) {
                          trpsspotsCell.push(trps);
                          rowArrAvg.push(trps);



                         }

                     }
              }
              var sum, avg  = 0;

              if (trpsspotsCell.length){
                        sum = trpsspotsCell.reduce(function(a, b) { return a + b; });
                        avg = sum / trpsspotsCell.length;
              }


                if(this.state.topSupports[a] == "Friendly" && avg > 0){
                      dataRow.push(<td colSpan="2" className={"friendly week week" + Number(this.state.times.length - o)}>{Math.round(avg)}</td>)
                } else if (this.state.topSupports[a] != "Friendly" && avg > 0) {
                    dataRow.push(<td colSpan="2" className={"unfriendly week week" + Number(this.state.times.length - o)}>{Math.round(avg)}</td>)
                } else {
                  dataRow.push(<td colSpan="2" className={"week week" + Number(this.state.times.length - o)}>{Math.round(avg)}</td>)
                }
            }

        var rowSum, rowAvg = 0;

        if (rowArrAvg.length){
                  rowSum = rowArrAvg.reduce(function(a, b) { return a + b; });
                  rowAvg = sum / rowArrAvg.length;
        }

        row.push(<tr>{supportCell}{spenderCell}{typeCell}{dataRow}<td colSpan="2">{rowAvg}</td></tr>)
        topTable.push(row)
      }


      if(m === 0) {
        tabs.push(<div id={Object.keys(data[m])} className="tabcontent firsttab"><h3>{Object.keys(data[m])}</h3><table><tbody>{topTable}</tbody></table></div>)
      } else {
        tabs.push(<div id={Object.keys(data[m])} className="tabcontent"><h3>{Object.keys(data[m])}</h3><table><tbody>{topTable}</tbody></table></div>)
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
        <h2>CPP Report</h2>
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

export default ViewCpp;
