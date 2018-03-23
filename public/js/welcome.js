(function($) {

  //Display user name on welcome screen
  var name = $.cookie('name');
  $('#welcomePerson').text('Welcome to Club Central, ' + name + '!');
  console.log(name);
  console.log('clubs: ' + clubs);

  //populate user list of clubs
  var clubs = $.cookie('clubs');
  clubs = clubs.slice(2);
  var $list = $('#clubList');
  var clubArray = JSON.parse(clubs);

  for (var i = 0; i < clubArray.length; i++) {
    $list.append('<li>' + clubArray[i] + '</li>');
  }


})(jQuery);