var Page = require('webpage');

function mapMonth(month) {
    var mL = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var mS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var m=mS.indexOf(month)+1;
    if(m<10) {
    	return "0"+m;
    } else {
    	return ""+m;
    }
  
}


function click(doc, el) {
    var ev = doc.createEvent("MouseEvent");
    ev.initMouseEvent(
          "click",
          true /* bubble */, true /* cancelable */,
          window, null,
          0, 0, 0, 0, /* coordinates */
          false, false, false, false, /* modifier keys */
          0 /*left*/, null
          );
    el.dispatchEvent(ev);
}

function parseDate(date) {
	var arr = date.split("-");
	return {
		month: arr[1],
		day: arr[2],
		year: arr[0]
	};
}

function getDate(y, m, d, h, m) {
	return y + "-" + m + "-" + d + " " + h;
}


module.exports = {
	getDate: getDate,
	parseDate: parseDate,
	clickEl: click,
	monthNameToNumber: mapMonth,
	page: function() {
		var page = Page.create();
		page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';
		page.onError = function(msg, trace) {};
		return page;
	}
};