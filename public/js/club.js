//OVERALL DESCRIPTION OF WHAT THIS DOES
(function($) {

    //Display club name on admin screen
    var clubName = $.cookie('clubName');
    $('#clubName').text(clubName);
    console.log(clubName);

    //Display club name for This week in...
    $('#thisWeek').text('This week in ' + clubName);

    //Display welcome message
    var blurb = $.cookie('blurb');
    $('#blurb').text(blurb);

    //Display calendar message
    $('#checkCal').text('Check out whats going on this week in ' + clubName);

    //Populate list of events
    var events = $.cookie('events');
    console.log('events ' + events);
    var $eventList = $('#eventList');
    var calEvents = []

    if(events) {
        var eventArray = JSON.parse(events);

        for (var i = 0; i < eventArray.length; i++) {
            $eventList.append('<li> Title: ' + eventArray[i].eventname + "   Date: " +
                eventArray[i].date + "   Start Time: " + eventArray[i].starttime +
                "   End Time: " + eventArray[i].endtime + '</li>');
            var date = eventArray[i].date

            var startTime = date.substring(6, 10) + '-' + date.substring(0, 2) + '-' + date.substring(3, 5) +
                'T' +  eventArray[i].starttime + ':00';

            var endTime = date.substring(6, 10) + '-' + date.substring(0, 2) + '-' + date.substring(3, 5) +
                'T' +  eventArray[i].endtime + ':00';

            var e = {
                title : eventArray[i].eventname,
                start : startTime,
                end : endTime
            }

            console.log(startTime);
            console.log(endTime);

            calEvents.push(e);
        }
    }

    //Show the calendar
    $.getScript("../../../lib/moment.min.js");
    $.getScript("../../../js/gcal.js");

    //console.log($.cookie('email'));

    console.log(calEvents);

    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,basicWeek,basicDay'
      },
      eventSources: [
        {
            events: calEvents
        }
      ]
    });

    var original = $('.fc-center').find("h2").text();
    $('.fc-center').find("h2").text(original.replace(new RegExp("undefined", 'g'), ""));

    var removeUndef = function() {
        var original = $('.fc-center').find("h2").text();
        $('.fc-center').find("h2").text(original.replace(new RegExp("undefined", 'g'), ""));

        var originalTime = $('.fc-time').text();
        $('.fc-time').text(originalTime.replace(new RegExp("undefined", 'g'), ""));
    };

    $(".fc-toolbar").on('click', '.fc-button', removeUndef);







})(jQuery);