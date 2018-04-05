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


    // //populate user list of clubs
    // var clubs = $.cookie('clubs');
    // console.log('clubs: ' + clubs);
    // //clubs = clubs.slice(2);
    // var $list = $('#clubList');
    // var clubArray = JSON.parse(clubs);

    // for (var i = 0; i < clubArray.length; i++) {
    //     $list.append('<li>' + clubArray[i] + '</li>');
    // }



})(jQuery);