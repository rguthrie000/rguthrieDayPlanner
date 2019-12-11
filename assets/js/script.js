// rguthrie's Day Planner
// 20191211
//
// Simple Day Planner for current day only.  Uses local storage
// for persistence of planned events.  Assigns background color
// to each hour of the workday to indicate past (gray), present
// (red) and future (green). 
// Uses moment.js for date and time.

const PLANNER_START_HOUR = 8;
const PLANNER_END_HOUR = 18;

var eventRecord =
{
  plannerDate: "",
  hours: ["","","","","","","","","",""]
}

// startPlanner() initializes the Day Planner
function startPlanner()
{
  // get today's date -- 
  // first chunk of moment().format() is year, month, and day  
  var yyyyMMdd = ((moment().format()).split("T"))[0];
  // which are separated by hyphens
  var yyyyMMddArr = yyyyMMdd.split("-");
  // join the year, month, and date, and add to the name
  // for use as a localStorage key.
  var dateToday = "DayPlan"+yyyyMMddArr.join("");

  // fetch any previously-stored events (today only)
  // use of savedRecord is required; once getItem fails, new
  // values can't be assigned to that variable.
  savedRecord = JSON.parse(localStorage.getItem(dateToday));
  if (!savedRecord)
  {
    // nothing out there. So get eventRecord ready for storing 
    // new events.
    eventRecord.plannerDate = dateToday;
  } 
  else
  {
    // load up!      
    eventRecord = savedRecord;
    // and write the hours array to the appropriate html elements
    // (targeting the textareas by id)
    for (var hr = PLANNER_START_HOUR; hr < PLANNER_END_HOUR; hr++)
      {$(`#t${hr}`).val(eventRecord.hours[hr-PLANNER_START_HOUR]);}
  }   
  // run the clock once to establish the row colors
  clock();
  // and start the 1 s timer for posting the time and checking when
  // the hour changes to keep the row coloring current.
  var myClock = setInterval(clock,1000.0);
}

// clock() is the 1 s timer service.  moment() from moment.js is used
// for current date and time, and the hour is watched for transitioning
// the row colors. the color assignment is done by class rules in the 
// CSS.  our job is to assign those classes correctly based on the hour.
// note the construction of the element selector -- the elements must
// each have an id of 't<hr>', where hour is one of the hours the 
// Day Planner is active (PLANNER_START_HOUR .. PLANNER_END_HOUR-1).
var oldHour = -1;
function clock()
{
  // get and post the current date and time
  var dateTimeStr = moment().format('MMMM DD YYYY, HH:mm:ss');
  $("#currentDay").text(dateTimeStr);

  // extract the hour and see if the hour has changed.
  var dateTimeArr = dateTimeStr.split(" ");
  var hourMinSec = dateTimeArr[3].split(":");
  var hour = Number(hourMinSec[0]);
  if (hour != oldHour)
  {
    // new hour, let's note that.
    oldHour = hour;
    // and (re-)assign the row colors
    if (hour < PLANNER_START_HOUR)
    {
      // here's the wee hours -- the time before the planner begins  
      for (var i = PLANNER_START_HOUR; i < PLANNER_END_HOUR; i++)
        {$(`#t${i}`).toggleClass("past present",false).addClass("future");}
    }
    else if (hour >= PLANNER_END_HOUR)
    {
      // and here are the after hours  
      for (var i = PLANNER_START_HOUR; i < PLANNER_END_HOUR; i++)
          {$(`#t${i}`).toggleClass("present future",false).addClass("past");}
    }
    else
    {
      // ah, the active hours.  three blocks to separate before, now, and later
      var hr = PLANNER_START_HOUR; 
      // before
      while (hr < hour)
        {$(`#t${hr++}`).toggleClass("present future",false).addClass("past");}
      // now  
      $(`#t${hr++}`).toggleClass("past future",false).addClass("present");
      // later
      while (hr < PLANNER_END_HOUR)
        {$(`#t${hr++}`).toggleClass("past present",false).addClass("future");}
    }
  }
}

// handler for all hour buttons.  uses $(this).val to determine which button
// was clicked (all the buttons have an assigned value, which is their hour
// number).  The matching textarea content is fetched and stored in the 
// events object, then the events object is written to local storage.
$(".saveBtn").click
(
  function() 
  {
    eventRecord.hours[$(this).val()-PLANNER_START_HOUR] = $(this).prev("textarea").val(); 
    localStorage.setItem(eventRecord.plannerDate,JSON.stringify(eventRecord));
  }
)

startPlanner();

