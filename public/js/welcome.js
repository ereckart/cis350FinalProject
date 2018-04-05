(function($) {

    //Display user name on welcome screen
    var name = $.cookie('name');
    $('#welcomePerson').text('Welcome to Club Central, ' + name + '!');
    console.log(name);


    //populate user list of Admin clubs
    var adminclubs = $.cookie('adminclubs');
    console.log('clubs: ' + adminclubs);
    var $adminlist = $('#adminclubList');
    var adminClubArray = JSON.parse(adminclubs);
    var adminid = $.cookie('userid');

    for (var i = 0; i < adminClubArray.length; i++) {
        $adminlist.append('<li> <a href="/clubpage/' + adminClubArray[i] + '/admin/' + adminid + '">' + adminClubArray[i] + '</a></li>');
    }

    //populate user list of clubs
    var clubs = $.cookie('clubs');
    console.log('clubs: ' + clubs);
    var $clublist = $('#clubList');
    var clubArray = JSON.parse(clubs);
    var adminid = $.cookie('userid');

    for (var i = 0; i < clubArray.length; i++) {
        $clublist.append('<li> <a href="/club/' + clubArray[i] + '">' + clubArray[i] + '</a></li>');
    }


})(jQuery);