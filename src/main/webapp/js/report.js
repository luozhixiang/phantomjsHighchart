function showSummaryChartPart(by, data) {
	console.log(data)
	var $e = $("#bodyPage");
	var $container = $e.find(".sectionOverviewSummary-chart .chart-content");
	if (typeof data == "undefined") {
		$container.html("");
		$container.append("<div class='noData'>No Data!</div>");
	} else {
		by = by || "day";

		// clear container
		$container.empty();
		$container.append("<div class='fstCon'></div><div class='secCon'></div>");

		// init series
		var openObj = {
			name : "Open Rate",
			data : [],
			color : "#9cb951"
		};
		var clickObj = {
			name : "Click Rate",
			data : [],
			color : "#6694bd"
		};

		var deliveredObj = {
			name : "Delivered",
			data : [],
			color : "#6694bd",
			borderColor : "#6694bd"
		};

		var failedObj = {
			name : "Failed",
			data : [],
			color : {
				linearGradient : [ "0%", "0%", "0%", "100%" ],
				stops : [ [ 0, '#FF6965' ], [ 1, '#AA4643' ] ]
			},
			borderColor : "#6E2D2B"
		};

		var categories = [];
		// if (view.reportType == smr.REPORT_TYPE.BATCH) {
		for (var i = 0; i < data.length; i++) {
			categories.push(data[i].date);
			openObj.data.push(smr.checkNumber(data[i].opens.uniqueRate));
			clickObj.data.push(smr.checkNumber(data[i].clicks.uniqueRate));
			deliveredObj.data.push(smr.checkNumber(data[i].delivered.count));
			failedObj.data.push(smr.checkNumber(data[i].failed.count));
		}
		// } else {
		// for (var i = 0; i < data.length; i++) {
		// categories.push(data[i].date);
		// openObj.data.push(smr.checkNumber(data[i].uniqueOpens.rate));
		// clickObj.data.push(smr.checkNumber(data[i].uniqueClicks.rate));
		// deliveredObj.data.push(smr.checkNumber(data[i].delivered.count));
		// failedObj.data.push(smr.checkNumber(data[i].failed.count));
		// }
		// }
		// the first chart
		var fstChart = new Highcharts.Chart({
			chart : {
				renderTo : $container.find('.fstCon').get(0),
				defaultSeriesType : 'line',
				height : 150,
				marginLeft : 60,
				marginRight : 60,
				spacingTop : 0,
				spacingBottom : 6,
				backgroundColor : 'rgba(0,0,0,0)'
			},
			title : {
				text : "Open & Click Rates",
				align : 'left',
				x : 50,
				margin : 0,
				style : {
					color : '#303030',
					fontSize : '10.5pt',
					fontWeight : 'bold',
					fontFamily : 'Arial'
				}
			},
			xAxis : {
				categories : categories,
				gridLineWidth : 1,
				gridLineColor : '#cccccc',
				tickWidth : 0,
				title : {
					text : null
				},
				labels : {
					enabled : false,
					rotation : 325,
					x : -1,
					y : 28
				}
			},
			yAxis : {
				lineWidth : 1,
				gridLineWidth : 1,
				gridLineColor : '#e6e6e6',
				title : {
					text : null
				},
				labels : {
					formatter : function() {
						var showVal = smr.formatNumber(this.value, "short");
						showVal = showVal + "%";
						return showVal;
					}
				},
				min : 0
			},
			credits : {
				enabled : false
			},
			tooltip : {
				formatter : function() {
					var yVal = this.y;
					var val = (yVal >= 10) ? Highcharts.numberFormat(yVal, 1) : Highcharts.numberFormat(yVal, 2);
					yVal = val + "%";
					return '<span>' + this.x + '</span><br/>' + '<span>' + this.series.name + ': <b>' + yVal
							+ '</b></span>';
				}
			},
			plotOptions : {
				line : {
					marker : {
						enabled : true,
						symbol : 'circle',
						lineColor : '#FFFFFF',
						lineWidth : 2
					}
				}
			},
			legend : {
				verticalAlign : 'top',
				borderWidth : 0,
				symbolWidth : 30,
				x : -20,
				y : -2
			},
			series : [ openObj, clickObj ]
		});

		// the second chart
		var secChart = new Highcharts.Chart({
			chart : {
				renderTo : $container.find('.secCon').get(0),
				defaultSeriesType : 'column',
				height : 130,
				marginLeft : 60,
				marginRight : 60,
				spacingTop : 0,
				spacingBottom : 6,
				backgroundColor : 'rgba(0,0,0,0)'
			},
			title : {
				text : "Delivered & Failed",
				align : 'left',
				margin : 9,
				x : 50,
				style : {
					color : '#303030',
					fontSize : '10.5pt',
					fontWeight : 'bold',
					fontFamily : 'Arial'
				}
			},
			xAxis : {
				categories : categories,
				gridLineWidth : 1,
				gridLineColor : '#cccccc',
				tickLength : 0,
				title : {
					text : null
				},
				labels : {
					rotation : 325,
					step : Math.ceil(categories.length / 31),
					x : -1,
					y : 20,
					formatter : function() {
						var date = this.value;
						if (by == "day" || by == "week") {
							if (this.value != 0) {
								date = smr.formatDate(smr.parseDate(this.value), "MM-dd")
							} else {
								date = "null";
							}
						}
						return date;
					}
				}
			},
			yAxis : {
				lineWidth : 1,
				gridLineWidth : 1,
				gridLineColor : '#e6e6e6',
				title : {
					text : null,
					rotation : 0,
					x : 0
				},
				labels : {
					formatter : function() {
						return smr.formatNumber(this.value, "short");
					}
				},
				min : 0
			},
			credits : {
				enabled : false
			},
			tooltip : {
				formatter : function() {
					return '<span>' + this.x + '</span><br/>' + '<span>' + this.series.name + ': <b>'
							+ smr.formatNumber(this.y) + '</b></span>';
				}
			},
			plotOptions : {
				column : {
					borderRadius : 2,
					stacking : 'normal'
				}
			},
			legend : {
				enabled : false
			},
			series : [ failedObj, deliveredObj ]
		});

		// here re-draw the chart if the chart width not match the content
		var containerWidth = $container.find(".fstCon").width();
		var containerChartWidth = $container.find(".fstCon .highcharts-container").width();
		var diffValue = containerWidth - containerChartWidth;
		// if (diffValue > 5 && !view.reDraw) {
		// view.showView(view.viewName, _viewBy);
		// view.reDraw = true;
		// }
	}
}

$(function() {
	var url = $.url();
	var json = url.param('json') || "getBatchSummary-breakdownbyday.jso";
	app.ajaxRequest(app.host + "/getReportData", {
		json : json
	}, "POST").pipe(function(val) {
		console.log(val)
		if (val.success == true) {
			showSummaryChartPart('day', val.result.items[0].data)
		} else {
		}
	});
})
