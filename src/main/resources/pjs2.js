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

page.open(url + uri, function() {
//	page.includeJs(url + '/js/jquery.min.js');

//	window.setTimeout(function() {
//		page.includeJs(url + '/build/1.4.3/build.js', function() {
//			if (reportType == "BATCH") {
//				page.evaluate(function() {
//					smr.showReport("#reports-container", smr.REPORT_TYPE.BATCH);
//				});
//			} else if (reportType == "PROGRAM") {
//				page.evaluate(function() {
//					smr.showReport("#reports-container", smr.REPORT_TYPE.PROGRAM);
//				});
//			} else if (reportType == "TRANSACTIONAL") {
//				page.evaluate(function() {
//					smr.showReport("#reports-container", smr.REPORT_TYPE.TRANSACTIONAL);
//				});
//			}
//
//		});
//	}, 1000);

	window.setTimeout(function() {
//		var clipRect = page.evaluate(function() {
//			var target = $("#reports-container")[0].getBoundingClientRect();
//			var rect = {
//				top : target.top,
//				left : target.left,
//				width : target.width,
//				height : target.height
//			}
//			return rect;
//		});
//
//		page.clipRect = clipRect;

		page.render(imageName);
		phantom.exit();

	}, 3000);
});
