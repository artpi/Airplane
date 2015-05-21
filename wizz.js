var system = require('system'),
    args = system.args
    Page = require('webpage');


function mapMonth(month) {
    var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var m=mS.indexOf(month)+1;
    if(m<10) {
    	return '0'+m;
    } else {
    	return ''+m;
    }
}

function wizzair(src, dst, date) {
    //TODO: VALIDACJA
    var page = Page.create(),
        server = 'https://wizzair.com/en-GB/FlightSearch';

	page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';

    //sHOWTIME
	
	function parseFlights($str) {
		var da,
			ret = [],
			reg = /[a-zA-Z]+, ([0-9]+) ([a-zA-Z]+)\n([0-9][0-9]:[0-9][0-9]) → ([0-9][0-9]:[0-9][0-9])\t(.*?)\t(.*?)\t(.*?)\t(.*?)\n/gi;
		
		while($row = reg.exec($str)) {
			da = "2015"+"-"+mapMonth($row[2])+"-"+$row[1]+" ";
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
