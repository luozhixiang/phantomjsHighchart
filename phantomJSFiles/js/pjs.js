var page = require('webpage').create();
var system = require('system');

var url = system.args[1];
var uri = system.args[2];
var imageName = system.args[3];
var json = system.args[4];
var reportType = system.args[5];
var reportName = system.args[6];
page.viewportSize = {
	width : 1300,
	height : 900
};

var fs = require('fs');
var content = fs.read(json);
var obj = JSON.parse(content);
console.log(reportName + "cccc")
page.open(url + uri, function() {
	// Transactional : Transactional Mailing Report :<Report Name>
	// Program :Lifecycle Program Report :<Reprort Name>
	// Batch : Batch Mailing Report : <Report Name>
	// BATCH|TRANSACTIONAL|PROGRAM
	var title = "";
	if (reportType == "BATCH") {
		title = ("Batch : Batch Mailing Report :" + reportName);
	}
	if (reportType == "TRANSACTIONAL") {
		title = ("Transactional : Transactional Mailing Report :" + reportName);
	}
	if (reportType == "PROGRAM") {
		title = ("Program :Lifecycle Program Report :" + reportName);
	}
	obj.title = title;
	obj.reportType = reportType;
	page.includeJs(url + '/js/report.js', function() {
		doReport(page, obj)
		window.setTimeout(function() {
			// console.log("--->go image")
			page.render(imageName);
			phantom.exit();

		}, 3000);

	});
});

function doReport(page, json) {
	page.evaluate(function(json) {
<<<<<<< HEAD
		showSummaryChartPart('day', json.items[0].data, json.reportType);
=======
		showSummaryChartPart('day', json.items[0].data);
>>>>>>> FETCH_HEAD
		showBottomSummaryPart('day', json.items[0].summary, json.reportType);
		$("#reportTitle").html(json.title);
	}, json);
}