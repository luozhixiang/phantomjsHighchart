var page = require('webpage').create();
var system = require('system');

var url = system.args[1];
var uri = system.args[2];
var imageName = system.args[3];
var json = system.args[4];
var reportType = system.args[5];
var reportName = system.args[6];
var isPDF = system.args[7];
page.viewportSize = {
	width : 1300,
	height : 900
};

var fs = require('fs');
var content = fs.read(json);
var obj = JSON.parse(content);
page.open(url + uri, function() {
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
	obj.isPDF = isPDF;
	page.includeJs(url + '/js/report.js', function() {
		doReport(page, obj)
	});

	window.setTimeout(function() {
		if (isPDF && isPDF == "true") {
			page.paperSize = {
				format : 'A4',
				orientation : 'landscape',
				margin : '1cm'
			};
			page.render(imageName + ".pdf", {
				format : 'pdf',
				quality : '100'
			});
		} else {
			page.render(imageName);
		}
		phantom.exit();
	}, 3000);
});

function doReport(page, json) {
	page.evaluate(function(json) {
		showSummaryChartPart('day', json.items[0].data, json.reportType, json.isPDF);
		showBottomSummaryPart('day', json.items[0].summary, json.reportType);
		$("#reportTitle").html(json.title);
	}, json);
}