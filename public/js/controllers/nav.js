(function() {
  var pathname = window.location.pathname;
  if (pathname === "/about") {
    $('#nav_about').addClass('active');
  } else if (pathname == "/contact") {
    $('#nav_contact').addClass('active');
  } else if (pathname == "/connect") {
    $('#nav_connect').addClass('active');
  }
})();