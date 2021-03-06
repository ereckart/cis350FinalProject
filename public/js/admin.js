//import $ from '../../../js/jquery.js';
import '../../../js/fullcalendar.js';

(function($) {

    //Display club name on admin screen
    var clubName = $.cookie('clubName');
    $('#clubName').text(clubName);

    //Display club join URL
    $('#URL').text('localhost:8080/join/' + clubName);

    //Display club name for This week in...
    $('#thisWeek').text('This week in ' + clubName);

    //Display calendar message
    $('#checkCal').text('Check out whats going on this week in ' + clubName);

    // //Display welcome message
    var blurb = $.cookie('blurb');
    $('#blurb').text(blurb);

    // Populate list of members
    var members = $.cookie('members');
    var $memberlist = $('#memberList');
    var memberArray = JSON.parse(members);

    for (var i = 0; i < memberArray.length; i++) {
        $memberlist.append('<li>' + memberArray[i] + '</li>');
    }

    // Populate list of members for new event
    var $memberListForClubs = $('#memberListForClubs');
    if (memberArray.len != 0) {
        $memberListForClubs.append('<li><input type="checkbox" id="memberSelectAll" id="selectall"> Select All </li>');
    }
    for (var i = 0; i < memberArray.length; i++) {
        var inputString = '<input type="checkbox" class="membercheckbox" id="member"'+ i + ' name="member' + i + '" value="' + memberArray[i] + '">' + memberArray[i];
        $memberListForClubs.append('<li>' + inputString +'</li>');
    }

    // Select All Button
    $("#memberSelectAll").click(function () {
        $(".membercheckbox").prop('checked', $(this).prop('checked'));
    });


    // Send the Clubname
    $('#clubname').val(clubName);

    //Populate list of events
    var events = $.cookie('events');
    var $eventList = $('#eventList');
    var calEvents = []
    if(events) {
        var eventArray = JSON.parse(events);

        for (var i = 0; i < eventArray.length; i++) {
            $eventList.append('<li> Title: ' + eventArray[i].eventname + "   Date: " +
                eventArray[i].date + "   Start Time: " + eventArray[i].starttime +
                "   End Time: " + eventArray[i].endtime + '</li>');

            var date = eventArray[i].date;

            var startTime = date.substring(6, 10) + '-' + date.substring(0, 2) + '-' + date.substring(3, 5) +
                'T' +  eventArray[i].starttime + ':00';

            var endTime = date.substring(6, 10) + '-' + date.substring(0, 2) + '-' + date.substring(3, 5) +
                'T' +  eventArray[i].endtime + ':00';

            var e = {
                title : eventArray[i].eventname,
                start : startTime,
                end : endTime
            }

            calEvents.push(e);
        }
    }

    var conflicts = $.cookie('conflicts');
    var conflictCalEvents = [];
    if (conflicts) {
        var conflictArray = JSON.parse(conflicts);

        for (var i = 0; i < conflictArray.length; i++) {
            var date = conflictArray[i].date;
            var startTime = date.substring(6, 10) + '-' + date.substring(0,2) + '-' + date.substring(3, 5) +
            'T' + conflictArray[i].starttime + ':00';
            var endTime = date.substring(6, 10) + '-' + date.substring(0,2) + '-' + date.substring(3, 5) +
            'T' + conflictArray[i].endtime + ':00';
            var ctitle = conflictArray[i].ownerid + ' - ' + conflictArray[i].reason;

            var c = {
                title : ctitle,
                start : startTime,
                end : endTime
            }

            conflictCalEvents.push(c);
        }


    }

    //Show the calendar
    $.getScript("../../../lib/moment.min.js");
    $.getScript("../../../js/gcal.js");

    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,basicWeek,basicDay'
      },
      eventSources: [
        {
            events: calEvents
        },
        {
            events: conflictCalEvents,
            color: 'red'
        },
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