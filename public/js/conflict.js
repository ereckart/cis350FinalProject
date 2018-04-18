(function($) {
    // Populate list of clubs
    console.log('within conflict.js');

    //getting user id
    var userid = $.cookie('userid');
    console.log('userid: ' + userid);
    $('#userid').val(userid);
    
    var adminclubs = $.cookie('adminclubs');
    var clubs = $.cookie('clubs');
    var $clubList = $('#clubsList');

    var clubArray = JSON.parse(clubs).concat(JSON.parse(adminclubs));
    
    for (var i = 0; i < clubArray.length; i++) {
        inputString = '<input type="checkbox" id="club"'+ i + ' name="club' + i + '" value="' + clubArray[i] + '">' + clubArray[i];
        $clubList.append('<li>'+inputString+'</li>');
    }

})(jQuery);

