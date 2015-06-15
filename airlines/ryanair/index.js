var utils = require('../../utils.js');


function ryanair(fr, to, date, callback) {
    var date = utils.parseDate(date);
    var page = utils.page();

    console.log(JSON.stringify(date));
    //TODO: VALIDACJA
    var server = 'http://www.bookryanair.com/SkySales/Booking.aspx?culture=pl-PL&lc=pl-PL',
        data = "ADULT=1&sector1_d="+to+"&sector1_o="+fr+"&sector_1_d="+ date.day +"&sector_1_m="+ date.month+date.year +"&sector_2_d=00&sector_2_m=--&tc=1&travel_type=on&acceptTerms=yes&zoneDiscount=&oneway=true&fromAirportName=&toAirportIATA=&dateFlightFromInput=&dateFlightToInput=&adultQuantityInput=Wi%C4%99cej&TEEN=0&CHILD=0&INFANT=0";


    function decompose(str) {
        var ret = [],
            time = [], 
            flight,
            date,
            rTime = /[a-z], ([a-z]+) ([0-9]+) ([0-9][0-9][0-9][0-9])/gi,
            rFlight = /([A-Z]+[0-9]+)\t([0-9][0-9]:[0-9][0-9])\t([0-9][0-9]:[0-9][0-9])\t([0-9,.]+)/gi;
            time = rTime.exec(str);

            console.log(str);

            while(flight = rFlight.exec(str)) {
                ret.push({
                    id: flight[1],
                    start: utils.getDate(time[3], time[1], time[2], flight[2]),
                    stop: utils.getDate(time[3], time[1], time[2], flight[3]),
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
            page.evaluate(function(selector, id) {
                var el = document.querySelectorAll(selector)[id];
                utils.clickEl(document, el);
            }, selector, id);


            setTimeout(function() {
                var result = page.evaluate(function() {
                    return document.querySelector(".avl").innerText;
                });
                console.log(result);
                ret.concat(decompose(result));

                id++;
                if(id >= count) {
                    callback(ret);
                } else {
                    scrapDay(id);
                }

            }, 100);
        }
        scrapDay(0);
    }


    page.open(server, 'post', data, function (status) {
        if (status !== 'success') {
            console.log('Unable to post!');
        } else {
            scrapData(page);
        }
    });
};

module.exports = ryanair;
