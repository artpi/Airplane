var system = require('system'),
    args = system.args
    Page = require('webpage');


function ryanair(fr, to, day, month) {
    //TODO: VALIDACJA
    var page = Page.create(),
        server = 'http://www.bookryanair.com/SkySales/Booking.aspx?culture=pl-PL&lc=pl-PL',
        data = "ADULT=1&sector1_d="+to+"&sector1_o="+fr+"&sector_1_d="+day+"&sector_1_m="+month+"&sector_2_d=00&sector_2_m=--&tc=1&travel_type=on&acceptTerms=yes&zoneDiscount=&oneway=true&fromAirportName=&toAirportIATA=&dateFlightFromInput=&dateFlightToInput=&adultQuantityInput=Wi%C4%99cej&TEEN=0&CHILD=0&INFANT=0";


function decompose(str) {
    var ret = {time: {}, flights: []},
        time, flight,
        rTime = /[a-z], ([a-z]+) ([0-9]+) ([0-9][0-9][0-9][0-9])/gi,
        rFlight = /([A-Z]+[0-9]+)\t([0-9][0-9]:[0-9][0-9])\t([0-9][0-9]:[0-9][0-9])\t([0-9,.]+)/gi;

        time = rTime.exec(str);
        ret.time.m = time[1];
        ret.time.d = time[2];
        ret.time.y = time[3];

        while(flight = rFlight.exec(str)) {
            ret.flights.push({
                id: flight[1],
                start: flight[2],
                end: flight[3],
                price: flight[4]
            });
        }

        return ret;
}

    function scrapData(page) {
        var ret = [],
            count = 7,
            selector = "ol#tabs1 li.ng-scope a";

        function scrapDay(id) {
            //console.log("Scraping day " + id);
            page.evaluate(function(selector, id) {
                var el = document.querySelectorAll(selector)[id];
                var ev = document.createEvent("MouseEvent");
                    ev.initMouseEvent(
                          "click",
                          true /* bubble */, true /* cancelable */,
                          window, null,
                          0, 0, 0, 0, /* coordinates */
                          false, false, false, false, /* modifier keys */
                          0 /*left*/, null
                          );
                    el.dispatchEvent(ev);
            }, selector, id);

            setTimeout(function() {
                //console.log('po timeout');
                var result = page.evaluate(function() {
                    return document.querySelector(".avl").innerText;
                });
                ret.push(decompose(result));

                id++;
                if(id >= count) {
                    console.log(JSON.stringify(ret));
                    phantom.exit(0);
                } else {
                    scrapDay(id);
                }

            }, 100);
        }
        scrapDay(0);
    }

    //sHOWTIME
    //setTimeout(function() {
    //    console.log("timeout");
    //    phantom.exit(1);
    //}, 60*1000);
    //
//    page.onResourceRequested = function (request) {
//    console.log('Request ' + JSON.stringify(request, undefined, 4));
//};
//
page.onError = function(msg, trace) {
};
page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';

    page.open(server, 'post', data, function (status) {
        if (status !== 'success') {
            console.log('Unable to post!');
        } else {
            scrapData(page);
        }
    });
};

ryanair(args[1], args[2], args[3], args[4]);
