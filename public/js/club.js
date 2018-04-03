(function($) {

    //Display club name on admin screen
    var clubName = $.cookie('clubName');
    $('#clubName').text(clubName);
    console.log(clubName);

    //Display club join URL
    $('#URL').text('localhost:8080/join/' + clubName);

    //Display club name for This week in...
    $('#thisWeek').text('This week in ' + clubName);

    //Display welcome message
    // var blurb = $.cookie('blurb');
    // $('#blurb').text(blurb);


    //populate user list of clubs
    var clubs = $.cookie('clubs');
    console.log('clubs: ' + clubs);
    //clubs = clubs.slice(2);
    var $list = $('#clubList');
    var clubArray = JSON.parse(clubs);

    for (var i = 0; i < clubArray.length; i++) {
        $list.append('<li>' + clubArray[i] + '</li>');
    }


})(jQuery);