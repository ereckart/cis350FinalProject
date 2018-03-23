(function($) {


  var name = $.cookie('name');

  $('#welcomePerson').text('Welcome to Club Central, ' + name + '!');
  console.log(name);


})(jQuery);