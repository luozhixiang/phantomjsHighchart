<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Phantomjs Snow</title>
    
    <link rel="stylesheet" type="text/css" href="${_r.contextPath}/bootstrap/css/bootstrap.css" />
    <link rel="stylesheet" type="text/css" href="${_r.contextPath}/bootstrap/css/bootstrap-responsive.css" />
    <link rel="stylesheet" type="text/css" href="${_r.contextPath}/css/imports-all.less.css">
    
    <script type="text/javascript">
        var contextPath = "${_r.contextPath}";
    </script>
    
    [@webBundle path="/js/" type="js" /]
    
    
    [#-- Global Initialization --] 
    <script type="text/javascript">
      // set the default to load the template
      brite.defaultComponentConfig.loadTmpl = true;
    </script>
    [#-- /Global Initialization --] 
    	
  </head>

  <body>
  	<div id="bodyPage">
  	<div id="content">
  			<div class="part">
	  			<label>Start phantomjs </label>
	  			<button class="btn btn-primary phantomjsBtn" data-value="start">Start</button>
			</div>
  			<!--div class="part">
	  			<label>Close phantomjs </label>
	  			<button class="btn btn-primary phantomjsBtn" data-value="close" >close</button>
			</div-->
  			<div class="report-data-loading">
	          	<div>
	          		<span class="loading-data-gif">&nbsp;</span><span>Loading data...</span>
			  	</div>
		   </div>
  		</div>
  		<div id="content">
  			<div class="part">
	  			<label>Report Type: Batch -> Section: Overview -> View: Summary -> All page </label>
	  			<button class="btn btn-primary exportChartBtn" >Export Chart</button>
			</div>
  			<div class="part">
	  			<label class="status success">The image of report generate success!</label>
	  			<label class="status failure">The image of report generate failure!</label>
  			</div>
  			<div class="report-data-loading">
	          	<div>
	          		<span class="loading-data-gif">&nbsp;</span><span>Loading data...</span>
			  	</div>
		   </div>
  		</div>
  	</div>
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