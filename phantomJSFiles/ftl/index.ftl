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
	<script type="text/javascript" src="${_r.contextPath}/js/brite.min.js"></script>
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
  <h4 id="reportTitle" style="padding-left:10px"><Report Name></h4>
  	<div id="bodyPage" class="sectionOverview">
  	<div class="sectionOverviewSummary">
		<div class="sectionOverviewSummary-chart">
			<div class="viewBy head">
				<span>View by </span>
				<span class="SMA-REPORT-VIEWBYDAY action" data-view="day">Day</span>
				<span class="SMA-REPORT-VIEWBYWEEK action " data-view="week">Week</span>
				<span class="SMA-REPORT-VIEWBYMONTH action " data-view="month">Month</span>
				<span class="SMA-REPORT-VIEWBYQUARTER action " data-view="quarter">Quarter</span>
			</div>
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

  </body>
</html>