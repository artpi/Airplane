var utils = require('../../utils.js');

function wizzair(src, dst, date, callback) {
    var page = utils.page(),
        server = 'https://wizzair.com/en-GB/FlightSearch',
        date = utils.parseDate(date),
        wizzDate = date.day + "/" +date.month + "/" + date.year;

	
	function parseFlights($str) {
		var da;
		var	row;
		var ret = [];
		var reg = /[a-zA-Z]+, ([0-9]+) ([a-zA-Z]+)\n([0-9][0-9]:[0-9][0-9]) → ([0-9][0-9]:[0-9][0-9])\t(.*?)\t(.*?)\t(.*?)\t(.*?)\n/gi;
		
		while(row = reg.exec($str)) {
			da = date.year+"-"+utils.monthNameToNumber(row[2])+"-"+row[1]+" ";
			ret.push({
				'start': da + row[3],
				'stop': da + row[4],
				'price': row[5],
				'price_discount': row[6]
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
			if(id >= 2) {
				callback(ret);
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
			}, src, dst, wizzDate);
			nextFlights(0, ret);
        }
    });
};

module.exports = wizzair;