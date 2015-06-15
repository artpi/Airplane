var system = require('system');
var args = system.args;
var wizzair = require("./airlines/wizzair/index.js");
var ryanair = require("./airlines/ryanair/index.js");

//var ret = wizzair("WAW", "BGY", "28/08/2015");
ryanair("aWMI", "BGY", "2015-07-28", function(elements) {
	for (var i = 0; i < elements.length; i++) {
		console.log(JSON.stringify(elements[i]));
	};
	phantom.exit(0);
});
