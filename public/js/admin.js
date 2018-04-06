(function($) {

    //Display club name on admin screen
    var clubName = $.cookie('clubName');
    console.log(clubName);
    $('#clubName').text(clubName);
    console.log(clubName);

    //Display club join URL
    $('#URL').text('localhost:8080/join/' + clubName);

    //Display club name for This week in...
    $('#thisWeek').text('This week in ' + clubName);

        //Display calendar message
    $('#checkCal').text('Check out whats going on this week in ' + clubName);

    // //Display welcome message
    // var blurb = $.cookie('blurb');
    // $('#blurb').text(blurb);


    //populate list of members
    var members = $.cookie('members');
    console.log('members ' + members);
    var $memberlist = $('#memberList');
    var memberArray = JSON.parse(members);

    for (var i = 0; i < memberArray.length; i++) {
        $memberlist.append('<li>' + memberArray[i] + '</li>');
    }

    // list of members for add members to event
    var $memberListForClubs = $('#memberListForClubs');
    if (memberArray.len)
    $memberListForClubs.append('<li><input type="checkbox" class="memberSelectAll" id="selectall"> Select All </li>');
    for (var i = 0; i < memberArray.length; i++) {
        inputString = '<input type="checkbox" class="membercheckbox" id="member"'+ i + ' name="member' + i + '" value="' + memberArray[i] + '">' + memberArray[i];
        $memberListForClubs.append('<li>' + inputString +'</li>');
    }
    

    // $("#ckbCheckAll").click(function () {
    // $(".checkBoxClass").prop('checked', $(this).prop('checked'));


    // send the clubname
    $('#clubname').val(clubName);

})(jQuery);