var page = require('webpage').create();
var system = require('system');

var url = "http://localhost:8080/phantomjs-highchart";
var uri = "/";
var imageName = "/Users/south/WORK/tool/phantomjs-1.9.8-macosx/bin/a.png";

page.viewportSize = {
	width : 1300,
	height : 900
};

var fs = require('fs');
var content = fs.read("/Users/south/Downloads/batchsummary.json");
var obj = JSON.parse(content);

page.open(url + uri, function() {
	page.includeJs(url + '/js/report.js', function() {
		console.log("11111")
		doReport(page, obj)
		window.setTimeout(function() {
			console.log("--->go image")
			page.render(imageName);
			phantom.exit();

		}, 5000);

	});
});

function doReport(page, json) {
	page.evaluate(function(json) {
		showSummaryChartPart('day', json.items[0].data);
		showBottomSummaryPart('day', json.items[0].summary)
	}, json);
}