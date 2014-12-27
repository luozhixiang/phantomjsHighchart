<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Phantomjs Snow</title>
    
    <link rel="stylesheet" type="text/css" href="${_r.contextPath}/bootstrap/css/bootstrap.css" />
    <link rel="stylesheet" type="text/css" href="${_r.contextPath}/css/all.css">
    
    
    <script type="text/javascript">
        var contextPath = "${_r.contextPath}";
    </script>
    
    <script type='text/javascript'>
		var brite = brite || {};
		var module = module || {};
		var require = function(t){
			if(t == "./handlebars.runtime-v1.3.0" || t == "./handlebars.runtime-v1.3.0.js" ){
				return Handlebars;
			}else if(t == "brite"){
				return brite;
			}
		};
	</script>

	<script type="text/javascript" src="${_r.contextPath}/js/jquery.min.js"></script>
	<script type="text/javascript" src="${_r.contextPath}/js/handlebars.runtime-v1.3.0.js"></script>
	<script type="text/javascript" src="${_r.contextPath}/js/handlebars.custom.helper.js"></script>
	<script type="text/javascript" src="${_r.contextPath}/js/handlebars.common.helper.js"></script>
	<script type="text/javascript" src="${_r.contextPath}/js/1_brite.js"></script>
	<script type="text/javascript" src="${_r.contextPath}/js/brite.gtx.js"></script>
	<script type="text/javascript" src="${_r.contextPath}/js/smr.js"></script>
	<script type="text/javascript" src="${_r.contextPath}/js/smr.utils.js"></script>
	<script type="text/javascript" src="${_r.contextPath}/js/highcharts.js"></script>
	<script type="text/javascript" src="${_r.contextPath}/js/templates.js"></script>
    
    <script type="text/javascript" src="${_r.contextPath}/js/app.js"></script>
    <script type="text/javascript" src="${_r.contextPath}/js/report.js"></script>
    
    
    [#-- Global Initialization --] 
    <script type="text/javascript">
      // set the default to load the template
      brite.defaultComponentConfig.loadTmpl = true;
    </script>
    [#-- /Global Initialization --] 
    	
  </head>

  <body>
  	<div id="bodyPage" class="sectionOverview">
  	
  	<div class="sectionOverviewSummary">
		<div class="sectionOverviewSummary-chart">
			<div class="chart-content"></div>
		</div>
		
		
		<div class="SMA-REPORT-ENGAGEMENTMETRICS sectionOverviewSummary-bottom funnel-chart">
			<span class="spanTitle">Engagement Funnel</span>
			<div class="sectionOverviewSummary-summary">
				<table >
					<tr>
						<th class="name">Metrics</th>
						<th class="count">Count</th>
						<th class="rate" colspan="2">Rate</th>
					</tr>
				</table>
			</div>
			<div class="cb"></div>
		</div>
	</div>
  	
  	
  	<div id="content" style="display:none">
  			<div class="part" style="display:none">
	  			<label>Start phantomjs </label>
	  			<button class="btn btn-primary phantomjsBtn startBtn " data-value="start">Start</button>
			</div>
  			<div class="part"  style="display:none">
	  			<label>Close phantomjs </label>
	  			<button class="btn btn-primary phantomjsBtn closeBtn" data-value="close" disabled="disabled">close</button>
			</div>
  			<div class="report-data-loading">
	          	<div>
			  	</div>
		   </div>
  		</div>
  		<div id="content" " style="display:none">
  			<div class="part">
	  			<label>Report Type: Batch -> Section: Overview -> View: Summary -> All page </label>
	  			<button class="btn btn-primary exportChartBtn" >Export Chart</button>
			</div>
  			<div class="part">
	  			<label class="status success">success!</label>
	  			<label class="status failure">failure!</label>
  			</div>
  			<div class="report-data-loading">
	          	<div>
			  	</div>
		   </div>
  		</div>
  	</div>
  	
  	<script id="tmpl-sectionOverviewSummary-summary-tr" type="text/html">
	<tr data-metric="{{summaryObj.name}}">
		<td class="name first">{{#if summaryObj.clickable}}<span class="metric" data-metric="{{summaryObj.name}}">{{summaryObj.label}}</span>{{else}}{{summaryObj.label}}{{/if}}</td>
		<td class="count">{{#equal summaryObj.name 'revenue'}}{{conversionCurrency}}{{/equal}}{{summaryObj.count}}</td>
		{{#if showName}}
			<td class="rateVal">{{summaryObj.rate}}</td>
			<td class="noBorder"></td>
		{{else}}
			{{#equal summaryObj.name 'revenue'}}
				<td class="rate last noBorder" colspan="2">{{#notEqual summaryObj.name 'revenue'}}{{summaryObj.rate}}{{/notEqual}}</td>
			{{else}}
				<td class="rateVal noBorderRight" {{#if summaryObj.color}}style='color:{{summaryObj.color}};'{{/if}}>{{summaryObj.rate}}</td>
				<td class="last noBorderLeft">
					{{#notEqualAndTrue summaryObj.isRate false summaryObj.isBar}}
						<div class="funnel-bar">
							<div class="bar" style="width:{{summaryObj.rate}}"></div>
						</div>
					{{/notEqualAndTrue}}
				</td>
			{{/equal}}
		{{/if}}
	</tr>
</script>
  	<script type="text/javascript">
		$(function(){
			$(".exportChartBtn").click(function(){
				var $reportDataLoading = $(".report-data-loading");
				$reportDataLoading.show();
				app.ajaxRequest(app.host + "/exportChart",{type:"1"}, "POST").pipe(function(val){
					if(val.result == "SUCCESS"){
						$(".success").show();
						$(".failure").hide();
					}else{
						$(".success").hide();
						$(".failure").show();
					}
					$reportDataLoading.hide();
				});
			});
			
			$(".phantomjsBtn").click(function(){
				var oper = $(this).attr("data-value");
				var $reportDataLoading = $(".report-data-loading");
				$reportDataLoading.show();
				app.ajaxRequest(app.host + "/doServer", {oper: oper}, "POST").pipe(function(val){
					if(val.result == "SUCCESS"){
						$(".success").show();
						$(".failure").hide();
						if(oper == 'start'){
							$(".startBtn").attr("disabled", true);
							$(".closeBtn").removeAttr("disabled");
						}else{
							$(".closeBtn").attr("disabled", true);
							$(".startBtn").removeAttr("disabled");
						}
					}else{
						$(".success").hide();
						$(".failure").show();
					}
					$reportDataLoading.hide();
				});
			});
			
		});
	</script>
  </body>
</html>