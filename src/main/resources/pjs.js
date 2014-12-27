var page = require('webpage').create();
var system = require('system');

var url = system.args[1];
var uri = system.args[2];
var imageName = system.args[3];
var json = system.args[4];

page.viewportSize = {
	width : 1300,
	height : 900
};

var fs = require('fs');
var content = fs.read(json);
var obj = JSON.parse(content);
//console.log("goo")
page.open(url + uri, function() {
	page.includeJs(url + '/js/report.js', function() {
		doReport(page, obj)
		window.setTimeout(function() {
//			console.log("--->go image")
			page.render(imageName);
			phantom.exit();

		}, 3000);

	});
});

function doReport(page, json) {
	page.evaluate(function(json) {
		showSummaryChartPart('day', json.items[0].data);
		showBottomSummaryPart('day', json.items[0].summary)
	}, json);
}