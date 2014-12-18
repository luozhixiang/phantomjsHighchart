var page = require('webpage').create();
var server = require('webserver').create();
var system = require('system');
var host, port;

page.onConsoleMessage = function(msg) {
	console.log(msg);
};

if (system.args.length !== 3) {
	console.log('Usage: server.js <some port>');
	phantom.exit(1);
} else {
	port = system.args[2];
	var listening = server.listen(port, function(request, response) {
		var url = "http://100.180.2.81:8081/index.html";
		page.open(url, function(status) {
			if (status !== 'success') {
				console.log('FAIL to load the address');
			} else {
//				page.includeJs("http://localhost:8083/phantomjs-highchart/js/0_jquery.min.js", function() {
//					page.evaluate(function() {
//						 $(".form-signin").hide();
////						console.log("$(\".submitBtn\").val() -> " + $(".form-signin").submit());
//					});
					page.render("E:\\aa.png");
//					phantom.exit();
//				});
//				console.log("GOT REPLY FROM SERVER:");
//				console.log(page.content);
			}
		});

		// we set the headers here
		response.statusCode = 200;
		response.headers = {
			"Cache" : "no-cache",
			"Content-Type" : "text/html"
		};
		// this is also possible:
		response.setHeader("foo", "bar");
		// now we write the body
		// note: the headers above will now be sent implictly
		response.write("<html><head><title>YES!</title></head>");
		// note: writeBody can be called multiple times
		response.write("<body><p>pretty cool :)</body></html>");
		response.close();
	});
	if (!listening) {
		console.log("could not create web server listening on port " + port);
		phantom.exit();
	}
	console.log("OK, PhantomJS is ready." + system.args);
}