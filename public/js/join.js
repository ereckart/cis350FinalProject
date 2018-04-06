(function($) {
    //Display user name on welcome screen
    var club = $.cookie('clubToJoin');
    $('#clubname').text('Join ' + club + '!');
})(jQuery);