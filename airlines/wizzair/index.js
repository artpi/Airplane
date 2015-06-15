var system = require('system'),
    args = system.args
    utils = require('../utils.js');
    Page = require('webpage');



function wizzair(src, dst, date) {
    //TODO: VALIDACJA
    var page = utils.page(),
        server = 'https://wizzair.com/en-GB/FlightSearch';


    //sHOWTIME
	
	function parseFlights($str) {
		var da,
			ret = [],
			reg = /[a-zA-Z]+, ([0-9]+) ([a-zA-Z]+)\n([0-9][0-9]:[0-9][0-9]) → ([0-9][0-9]:[0-9][0-9])\t(.*?)\t(.*?)\t(.*?)\t(.*?)\n/gi;
		
		while($row = reg.exec($str)) {
			da = "2015"+"-"+utils.monthNameToNumber($row[2])+"-"+$row[1]+" ";
			ret.push({
				'start': da + $row[3],
				'stop': da + $row[4],
				'price': $row[5],
				'price_discount': $row[6]
			});
		}
		return ret;
	}

	function nextFlights(id, ret) {
		setTimeout(function() {
			var p1 = page.evaluate(function() {
				var txt =  document.querySelector(".flights-container").innerText;
				$(".show-next a").click();
				return txt;
			});
			ret = ret.concat(parseFlights(p1));
			//console.log(id);
			if(id >= 2) {
				console.log(JSON.stringify(ret));
				phantom.exit(0);
			} else {
				nextFlights(id+1, ret);
			}
		}, 3000);
	}


    page.open(server, function (status) {
        if (status !== 'success') {
            console.log('Unable to post!');
            phantom.exit(1);
        } else {
			var ret = [];
			var p = page.evaluate(function(src, dst, date) {
				$("#ControlGroupRibbonAnonNewHomeView_AvailabilitySearchInputRibbonAnonNewHomeView_AutocompleteOriginStation").click();
				$(".box-autocomplete").each(function(index, el) {
					if($(el).css('display')==='block') {
						$(el).find("li[data-iata="+src+"]").focus().trigger('mouseup');
					}
				});


				$("#ControlGroupRibbonAnonNewHomeView_AvailabilitySearchInputRibbonAnonNewHomeView_AutocompleteDestinationStation").click();
				$(".box-autocomplete").each(function(index, el) {
					if($(el).css('display')==='block') {
						$(el).find("li[data-iata="+dst+"]").focus().trigger('mouseup');
					}
				});
				$("#ControlGroupRibbonAnonNewHomeView_AvailabilitySearchInputRibbonAnonNewHomeView_DepartureDate").datepicker("setDate", date);
				$("#ControlGroupRibbonAnonNewHomeView_AvailabilitySearchInputRibbonAnonNewHomeView_ButtonSubmit").click();
			}, src, dst, date);
			nextFlights(0, ret);
			
        }
    });
};

wizzair(args[1], args[2], args[3]);
