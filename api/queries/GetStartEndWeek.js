var pg = require("../../database.js")
var moment = require('moment');

var startDay = 'Monday';
var days = {Sunday: 9, Monday: 8, Tuesday: 7, Wednesday: 6, Thursday: 5, Friday: 4, Saturday: 3}
var currentDate = "";
var primaryDate = "";
var generalDate = "";
var filingDate = "";
var week1StartPrimary = "";
var week1StartGeneral = "";
var primaryDaysAway = 0;
var generalDaysAway = 0;
var primaryDaysWeek1 = 0;
var generalDaysWeek1 = 0;
var primaryWeekNum = 0;
var generalWeekNum = 0;
var primaryWeekStart = "";
var generalWeekStart = "";
var primaryWeekEnd = "";
var generalWeekEnd = "";
var status = 1;
var error = [];
var today = new Date();


function setUp(primaryDate, generalDate, currentDate = "", startDay = "") {
   this.primaryDate = primaryDate;
   this.generalDate = generalDate;
   this.currentDate = (currentDate == "" ? today : currentDate);
   if(days[startDay] > 0) {
     this.startDay = startDay;
   } else {
     this.startDay = "Monday";
   }
   this.getDays();
 }

function getDays() {
    // Calculate how many days until the primary/general
    var primdate = new Date(this.primaryDate);
    var gendate = new Date(this.generalDate);
    var curdate = new Date(this.currentDate);

    // Calculate how many days until the primary/general
    var primTimeDiff = Math.abs(primdate.getTime() - curdate.getTime());
    var primDiffDays = Math.ceil(primTimeDiff / (1000 * 3600 * 24));


    var genTimeDiff = Math.abs(gendate.getTime() - curdate.getTime());
    var genDiffDays = Math.ceil(genTimeDiff / (1000 * 3600 * 24));

    this.primaryDaysAway = primDiffDays
    this.generalDaysAway = genDiffDays

    // For the primary figure out when Week 1 starts (depending on the StartDay for a week, ie 'Monday')
    this.week1StartPrimary = moment(this.primaryDate).subtract(1, "week").subtract(1, "day").format("YYYY-MM-DD")
    // For the general figure out when Week 1 starts (depending on the StartDay for a week, ie 'Monday')
    this.week1StartGeneral = moment(this.generalDate).subtract(1, "week").subtract(1, "day").format("YYYY-MM-DD")

    // Figure out how many days until Week 1 begins for the primary/general
    this.primaryDaysWeek1 = moment(this.week1StartPrimary).diff(moment(this.currentDate), 'days');
    this.primaryDaysWeek1 = moment(this.week1StartGeneral).diff(moment(this.currentDate), 'days');

    // Count the number of days until Week 1 starts for the primary/general and divide by 7 (round up) to figure out how many weeks until Week 1 begins then add an additional week (for Week 1) to figure out what week we're in
    this.primaryWeekNum = ((moment(this.week1StartPrimary).diff(moment(this.currentDate), 'days') / 7) + 1);
    this.generalWeekNum = ((moment(this.week1StartGeneral).diff(moment(this.currentDate), 'days') / 7) + 1);

    getStartEndDates();
 }


 async function setupByDistrict(districtID, currentDate = "", startDay = "") {
    if (districtID > 0) {
       var result = await pg.query("SELECT filingDate, PrimaryDate, GeneralDate FROM Districts WHERE DistrictID = $1 LIMIT 1", [districtID]);
       if (result.rows.length > 0) {

          this.filingDate = result.rows[0]["filingdate"];
          this.primaryDate = result.rows[0]["primarydate"];
          this.generalDate = result.rows[0]["generaldate"];

          this.currentDate = (currentDate == "" ? dateFormat(today, "yyyy-mm-dd") : currentDate);

          this.startDay = (days[startDay] > 0) ? startDay : "Monday";

       // Run calculations
        getDays();
       }
       else {
       //   $this->Status = 0;
       //   $this->Error[] = "We have no record matching that DistrictID.";
       }
    }
    else {
     //  $this->Status = 0;
     //  $this->Error[] = "DistrictID should be a positive integer.";
    }
 }


 async function setupByState(statecode, currentDate = "", startday = "") {
    if (stateCode.length == 2) {
     //  currentCycle = CurrentCycle();
       var currentCycle = 2018;
       var result = await pg.query("SELECT FilingDate, PrimaryDate, GeneralDate FROM Districts WHERE State=$1 AND Cycle=$2 LIMIT 1 ", [stateCode, currentCycle]);
       if (result.rows > 0) {
          this.filingDate = result.rows[0]["FilingDate"];
          this.primaryDate = result.rows[0]["PrimaryDate"];
          this.generalDate = result.rows[0]["GeneralDate"];
          this.currentDate = (currentDate == "" ? today : currentDate);

          this.startDay = (days[startDay] > 0) ? startDay : "Monday";

          // Run calculations
          this.getDays();
       }
       else {
       //   $this->Status = 0;
       //   $this->Error[] = "We have no record matching that State Code.";
       }
    }
    else {
     //  $this->Status = 0;
   //    this->Error[] = "State Code should be a 2-letter word, i.e. 'IL'.";
    }
 }

 function getStartEndDates() {
    // Figure out the WeekStart and WeekEnd for Primary/General
    if (this.generalWeekNum > 1) {
       generalWeekStart = this.week1StartGeneral;
       generalWeekEnd = this.generalDate;

    }
    else {
       startDays = (this.generalWeekNum - 2) * 7 + 7;
       endDays = (this.generalWeekNum - 2) * 7 + 1;

        generalWeekStart = moment(this.week1StartGeneral).subtract(startDays, "day").format("YYYY-MM-DD");
        generalWeekEnd = moment(this.week1StartGeneral).subtract(endDays, "day").format("YYYY-MM-DD");
    }

    if (this.primaryWeekNum > 1) {
       primaryWeekStart = this.week1StartPrimary;
       primaryWeekEnd = this.primaryDate;
    }
    else {
       primaryWeekStart = this.generalWeekStart;
       primaryWeekEnd = this.generalWeekEnd;
    }

 }

var getStartEndWeek = {
   setUpDates: async function(id){

     var district = await pg.query("SELECT cycle, state, districtcode, filingdate FROM districts WHERE districtid = $1 LIMIT 1", [id])

     var startdate = district.rows[0].filingdate;
     var cycle = district.rows[0].cycle;
     var state = district.rows[0].state;
     var districtcode = district.rows[0].districtcode;

     await setupByDistrict(id, startdate, "Monday");

     var dates = {
       generalWeekStart: generalWeekStart,
       generalWeekEnd: generalWeekEnd,
       primaryWeekStart: primaryWeekStart,
       primaryWeekEnd: primaryWeekEnd
     };

     return dates;
   }
}

module.exports = getStartEndWeek;
