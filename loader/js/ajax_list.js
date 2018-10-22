/**
 * navbar-ontop.js 1.0.0
 * Add .navbar-ontop class to navbar when the page is scrolled to top
 * Make sure to add this script to the <head> of page to avoid flickering on load
 */

(function loadXMLDoc()
    {
      var lis_dom = "";
      for (var i = 0; i < 10; i++) {
        lis_dom += "<li class=\"list-group-item d-flex justify-content-between align-items-center\"> This is ajax Num <span class=\"badge badge-primary badge-pill\">" + i + "</span> </li>"
      };

      document.getElementById("idlist-group").innerHTML=lis_dom;
})();