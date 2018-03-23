(function($) {

  //Display user name on welcome screen
  var name = $.cookie('name');
  $('#welcomePerson').text('Welcome to Club Central, ' + name + '!');
  console.log(name);


  //populate user list of clubs
  var clubs = $.cookie('clubs');
  console.log('clubs: ' + clubs);
  var $list = $('#clubList');
  var clubArray = JSON.parse(clubs);
  var adminid = $.cookie('userid');

  for (var i = 0; i < clubArray.length; i++) {
    $list.append('<li> <a href="/clubpage/' + clubArray[i] + '/admin/' + adminid + '">' + clubArray[i] + '</a></li>');
  }


})(jQuery);