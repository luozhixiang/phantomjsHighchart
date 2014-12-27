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

		waitFor(function() {
			return page.evaluate(function() {
				return $("#bodyPage").attr("load") == "true";
			});
		}, function() {
			window.setTimeout(function() {
				page.render(imageName);
				phantom.exit();
			}, 3000);
		});

	});
});

function doReport(page, json) {
	page.evaluate(function(json) {
		showSummaryChartPart('day', json.items[0].data, json.reportType);
		showBottomSummaryPart('day', json.items[0].summary, json.reportType);
		$("#reportTitle").html(json.title);
	}, json);
}

function waitFor(testFx, onReady, timeOutMillis) {
	var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 10001, // < Default
	// Max
	// Timeout
	// is 3s
	start = new Date().getTime(), condition = false, interval = setInterval(function() {
		if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
			// If not time-out yet and condition not yet fulfilled
			condition = (typeof (testFx) === "string" ? eval(testFx) : testFx()); // <
			// defensive
			// code
		} else {
			if (!condition) {
				// If condition still not fulfilled (timeout but condition is
				// 'false')
				console.log("'waitFor()' timeout");
				phantom.exit(1);
			} else {
				// Condition fulfilled (timeout and/or condition is 'true')
				console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
				typeof (onReady) === "string" ? eval(onReady) : onReady();
				clearInterval(interval); // < Stop this interval
			}
		}
	}, 100); // < repeat check every 100ms
};