var system = require('system'),
    args = system.args
    Page = require('webpage');


function wizzair() {
    //TODO: VALIDACJA
    var page = Page.create(),
        server = 'https://wizzair.com/en-GB/FlightSearch';


    //sHOWTIME
	
function parseFlights($str) {
	var da,
		ret = [],
		reg = /[a-zA-Z]+, ([0-9]+) ([a-zA-Z]+)\n([0-9][0-9]:[0-9][0-9]) → ([0-9][0-9]:[0-9][0-9])\t(.*?)\t(.*?)\t(.*?)\t(.*?)\n/gi;
	
	while($row = reg.exec($str)) {
		da = $row[1]+"/"+$row[2]+"/2015 ";
		ret.push({
			'start': da + $row[3],
			'stop': da + $row[4],
			'price': $row[5],
			'price_discount': $row[6]
		});
	}
	return ret;
}

    page.open(server, function (status) {
        if (status !== 'success') {
            console.log('Unable to post!');
        } else {
			var ret = [];
			console.log('evaluating');
			var p = page.evaluate(function() {
				$("#ControlGroupRibbonAnonNewHomeView_AvailabilitySearchInputRibbonAnonNewHomeView_AutocompleteOriginStation").click();
				$(".box-autocomplete").each(function(index, el) {
					if($(el).css('display')==='block') {
						$(el).find("li[data-iata=WAW]").focus().trigger('mouseup');
					}
				});


				$("#ControlGroupRibbonAnonNewHomeView_AvailabilitySearchInputRibbonAnonNewHomeView_AutocompleteDestinationStation").click();
				$(".box-autocomplete").each(function(index, el) {
					if($(el).css('display')==='block') {
						$(el).find("li[data-iata=CRL]").focus().trigger('mouseup');
					}
				});
				$("#ControlGroupRibbonAnonNewHomeView_AvailabilitySearchInputRibbonAnonNewHomeView_DepartureDate").datepicker("setDate", "24/06/2015");
				$("#ControlGroupRibbonAnonNewHomeView_AvailabilitySearchInputRibbonAnonNewHomeView_ButtonSubmit").click();
			});
			console.log('timeout');
			
			setTimeout(function() {
				var p1 = page.evaluate(function() {
					var txt =  document.querySelector(".flights-container").innerText;
					$(".show-next a").click();
					return txt;
				});
				ret.push(parseFlights(p1));
				
				setTimeout(function() {
					var p1 = page.evaluate(function() {
						var txt =  document.querySelector(".flights-container").innerText;
						$(".show-next a").click();
						return txt;
					});
					ret.push(parseFlights(p1));
					console.log(ret);
					phantom.exit();
				}, 2000);
				
				console.log("ok");
				
			}, 3000);
			
			//phantom.exit();
        }
    });
};

wizzair();
