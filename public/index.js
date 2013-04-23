;(function ($, window, undefined) {
  'use strict';

  var $doc = $(document),
  Modernizr = window.Modernizr;

  $(document).ready(function() {
    $.fn.foundationAlerts           ? $doc.foundationAlerts() : null;
    $.fn.foundationButtons          ? $doc.foundationButtons() : null;
    $.fn.foundationAccordion        ? $doc.foundationAccordion() : null;
    $.fn.foundationNavigation       ? $doc.foundationNavigation() : null;
    $.fn.foundationTopBar           ? $doc.foundationTopBar() : null;
    $.fn.foundationCustomForms      ? $doc.foundationCustomForms() : null;
    $.fn.foundationMediaQueryViewer ? $doc.foundationMediaQueryViewer() : null;
    $.fn.foundationTabs             ? $doc.foundationTabs({callback : $.foundation.customForms.appendCustomMarkup}) : null;
    $.fn.foundationTooltips         ? $doc.foundationTooltips() : null;
    $.fn.foundationMagellan         ? $doc.foundationMagellan() : null;
    $.fn.foundationClearing         ? $doc.foundationClearing() : null;

    $.fn.placeholder                ? $('input, textarea').placeholder() : null;
  });

  // UNCOMMENT THE LINE YOU WANT BELOW IF YOU WANT IE8 SUPPORT AND ARE USING .block-grids
  // $('.block-grid.two-up>li:nth-child(2n+1)').css({clear: 'both'});
  // $('.block-grid.three-up>li:nth-child(3n+1)').css({clear: 'both'});
  // $('.block-grid.four-up>li:nth-child(4n+1)').css({clear: 'both'});
  // $('.block-grid.five-up>li:nth-child(5n+1)').css({clear: 'both'});

  // Hide address bar on mobile devices (except if #hash present, so we don't mess up deep linking).


  if (Modernizr.touch && !window.location.hash) {
    $(window).load(function () {
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 0);
    });
  }

})(jQuery, this);




$(document).ready(function() {

mainPageQuotes();

}); // document ready function



var adminModeOn =false;


// MENU ///////////////////////////////////////////

function mainPageQuotes() {getQuotes("score", "all", 1)};

function topQuotes() {getQuotes("score", "all", 2)
$("#introduction").hide();
$("#advertblock").hide();
adminModeOn=false;
};

function justSpottedQuotes() { getQuotes("createdAt", "all", 1)
$("#introduction").hide();
$("#advertblock").hide();
adminModeOn=false;
};

function adminMode() { getQuotes("createdAt", "all", 1)
$("#introduction").hide();
$("#advertblock").hide();
adminModeOn=true;
}


// VOTING BUTTONS ////////////////////////////////




function getQuotes(order, industry,limits) {
// where industry is 0 for all - not actived yet

  console.log("retrieving quotes")
  var GoogleQuotes = Parse.Object.extend("GoogleQuotes");
  var query = new Parse.Query(GoogleQuotes);
  query.descending(order);
  query.limit(50); //Ultimately load next when reach that point
  query.greaterThanOrEqualTo("score",limits);
  
  query.find({

  success: function(results) {



if (adminModeOn) {

 $("#descriptionpanel").empty();

  console.log("admin Mode!");
    var template = Handlebars.compile($("#box-templateAdmin").html());
     $(results).each(function(i,e) {
        var q = e.toJSON(); // Serialize the PFObject and store it in q
    $("#descriptionpanel").append(template(q));
    });
}

  else{

      $("#line1").empty();
      $("#line2").empty();
      $("#line3").empty();
      $("#line4").empty();

      var template = Handlebars.compile($("#box-template").html());
      var count= 0;
      var whichColumn="";

      $(results).each(function(i,e) {
        var q = e.toJSON(); // Serialize the PFObject and store it in q

       // cycle through columns 

      count++;

      if (count % 4 == 0) {whichColumn='#line'+4;}
      else if (count % 3 == 0) {whichColumn='#line'+3;}
      else if (count % 2 == 0) {whichColumn='#line'+2;}
      else {whichColumn='#line1';};

      $(whichColumn).append(template(q));
      });

}

//-----------------------

//$("#uparrow").click(function(){
//console.log("click!");
//}) // does work!

  },
  error: function(object, error) {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and description.
  }



  });
}


function updateQuote(objectId, action){

// 1: set to zero (equivalent of remove), 2: increment, 3: decrement

  var GoogleQuotes = Parse.Object.extend("GoogleQuotes");
  var googleQuotes = new GoogleQuotes;
  googleQuotes.id=objectId;

 switch(action) {

  case 1:
  googleQuotes.set("score", 0);
  break;

  case 2:
  googleQuotes.increment("score");
  break;

  case 3:
  googleQuotes.increment("score",-1);
  break;

 }
 
  googleQuotes.save(null, {
    success: function(googleQuotes) {
      console.log("score updated")
       getQuotes("score", "industry", 1) //THIS WILL NEED CHANGING FROM HARD CODE
    },
    error: function(googleQuotes, error) {
      console.log("Error updating score")
    }
  });

}

  

