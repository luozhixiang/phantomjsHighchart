var brite = require("brite"); // Could also use window.brite as index.js sets it, but this is preferred for modularity
brite.config.tmplPath = "componentFiles/";
var Handlebars = require('./handlebars.runtime-v1.3.0.js');
//brite.config.tmplExt = ".html";
var smr = window.smr = window.smr || {};

module.exports = smr;

var console = window.console;
if(!console){
	console = {
		log:function(t){}
	}
}

// --------- Render Function --------- //
// Just a little indirection to render a template using handlebars.
Handlebars.templates = Handlebars.templates || {};
function render(templateName,data){
  var tmpl = Handlebars.templates[templateName];
  if (!tmpl){
  	alert(templateName);
  	throw "app-error: not template found for : " + templateName;
  }
  return tmpl(data);
}

smr.render = render;
// --------- /Render Function --------- //

(function($){
	//check the browsers type
	var ua = navigator.userAgent.toLowerCase();

	var isChrome = ua.match(/chrome\/([\d.]+)/);
	var isSafari = ua.match(/version\/([\d.]+)/);
	var isFirefox = ua.match(/firefox\/([\d.]+)/);
	var isIE = ua.match(/msie ([\d.]+)/);

	smr.isChrome = isChrome;
	smr.isSafari = isSafari;
	smr.isFirefox = isFirefox;
	smr.isIE = isIE;

	if(isIE){
		if(isIE[1] == '9.0' && document.documentMode == 9){
			//do nothing
		}else{
			//in IE does not support indexOf
			if(!Array.indexOf){
			    Array.prototype.indexOf = function(obj){
			        for(var i=0; i<this.length; i++){
			            if(this[i]==obj){
			                return i;
			            }
			        }
			        return -1;
			    }
			}

			//in IE does not support localStorage
			if(typeof localStorage == 'undefined'){
				//create localStorage
				var localStorageClass = function(){
					this.options = {
				        expires : 60*24*3600,
				        domain : "bin_gao@live.cn"
				    }
				}
				localStorageClass.prototype = {
					//init ,add expire time
					init:function(){
				        var date = new Date();
				        date.setTime(date.getTime() + 60*24*3600);
				        this.setItem('expires',date.toGMTString());
				    },
				    //check the key
				    findItem:function(key){
				        var bool = document.cookie.indexOf(key);
				        if( bool < 0 ){
				            return true;
				        }else{
				            return false;
				        }
				    },
				    //get item value, if not return null
				    getItem:function(key){
				        var i = this.findItem(key);
				        if(!i){
				            var array = document.cookie.split(';')
				            for(var j=0;j<array.length;j++){
				                var arraySplit = array[j];
				                if(arraySplit.indexOf(key) > -1){
				                	var getValue = array[j].split('=');
				                    getValue[0] = getValue[0].replace(/^\s\s*/, '').replace(/\s\s*$/, '')
				                    if(getValue[0]==key){
				                    	return getValue[1];
				                    }else{
				                    	return 'null';
				                    }
				                }
				            }
				        }
				    },
				    //set item
				    setItem:function(key,value){
				    	var i = this.findItem(key)
				    	document.cookie=key+'='+value;
				    },
				    //removeItem item
				    removeItem:function(key){
				    	var i = this.findItem(key)
				    	document.cookie=key+'='+"";
				    },
				    //clear cookie
				    clear:function(){
				    	for(var cl =0 ;cl<arguments.length;cl++){
				            var date = smr.serverDate;
				            date.setTime(date.getTime() - 100);
				            document.cookie =arguments[cl] +"=a; expires=" + date.toGMTString();
				        }
				    }
				}
			    localStorage = new localStorageClass();
			    localStorage.init();
			}
		}
	}
})(jQuery);

//IE7 does not support the JSON
if((smr.isIE && smr.isIE[1] == '7.0') || (smr.isIE && document.documentMode == 7)){
	var JSON;
	if (!JSON) {
	    JSON = {};
	}
	(function () {
	    'use strict';

	    function f(n) {
	        // Format integers to have at least two digits.
	        return n < 10 ? '0' + n : n;
	    }

	    if (typeof Date.prototype.toJSON !== 'function') {

	        Date.prototype.toJSON = function (key) {

	            return isFinite(this.valueOf())
	                ? this.getUTCFullYear()     + '-' +
	                    f(this.getUTCMonth() + 1) + '-' +
	                    f(this.getUTCDate())      + 'T' +
	                    f(this.getUTCHours())     + ':' +
	                    f(this.getUTCMinutes())   + ':' +
	                    f(this.getUTCSeconds())   + 'Z'
	                : null;
	        };

	        String.prototype.toJSON      =
	            Number.prototype.toJSON  =
	            Boolean.prototype.toJSON = function (key) {
	                return this.valueOf();
	            };
	    }

	    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	        gap,
	        indent,
	        meta = {    // table of character substitutions
	            '\b': '\\b',
	            '\t': '\\t',
	            '\n': '\\n',
	            '\f': '\\f',
	            '\r': '\\r',
	            '"' : '\\"',
	            '\\': '\\\\'
	        },
	        rep;


	    function quote(string) {
	        escapable.lastIndex = 0;
	        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
	            var c = meta[a];
	            return typeof c === 'string'
	                ? c
	                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	        }) + '"' : '"' + string + '"';
	    }


	    function str(key, holder) {

	        var i,          // The loop counter.
	            k,          // The member key.
	            v,          // The member value.
	            length,
	            mind = gap,
	            partial,
	            value = holder[key];

	        if (value && typeof value === 'object' &&
	                typeof value.toJSON === 'function') {
	            value = value.toJSON(key);
	        }

	        if (typeof rep === 'function') {
	            value = rep.call(holder, key, value);
	        }
	        switch (typeof value) {
	        case 'string':
	            return quote(value);
	        case 'number':
	            return isFinite(value) ? String(value) : 'null';
	        case 'boolean':
	        case 'null':
	            return String(value);
	        case 'object':

	            if (!value) {
	                return 'null';
	            }
	            gap += indent;
	            partial = [];

	            if (Object.prototype.toString.apply(value) === '[object Array]') {
	                length = value.length;
	                for (i = 0; i < length; i += 1) {
	                    partial[i] = str(i, value) || 'null';
	                }
	                v = partial.length === 0
	                    ? '[]'
	                    : gap
	                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
	                    : '[' + partial.join(',') + ']';
	                gap = mind;
	                return v;
	            }

	            if (rep && typeof rep === 'object') {
	                length = rep.length;
	                for (i = 0; i < length; i += 1) {
	                    if (typeof rep[i] === 'string') {
	                        k = rep[i];
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            } else {
	                for (k in value) {
	                    if (Object.prototype.hasOwnProperty.call(value, k)) {
	                        v = str(k, value);
	                        if (v) {
	                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
	                        }
	                    }
	                }
	            }

	            v = partial.length === 0
	                ? '{}'
	                : gap
	                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
	                : '{' + partial.join(',') + '}';
	            gap = mind;
	            return v;
	        }
	    }

	// If the JSON object does not yet have a stringify method, give it one.
	    if (typeof JSON.stringify !== 'function') {
	        JSON.stringify = function (value, replacer, space) {

	            var i;
	            gap = '';
	            indent = '';

	            if (typeof space === 'number') {
	                for (i = 0; i < space; i += 1) {
	                    indent += ' ';
	                }
	            } else if (typeof space === 'string') {
	                indent = space;
	            }
	            rep = replacer;
	            if (replacer && typeof replacer !== 'function' &&
	                    (typeof replacer !== 'object' ||
	                    typeof replacer.length !== 'number')) {
	                throw new Error('JSON.stringify');
	            }
	            return str('', {'': value});
	        };
	    }

	    if (typeof JSON.parse !== 'function') {
	        JSON.parse = function (text, reviver) {
	            var j;

	            function walk(holder, key) {
	                var k, v, value = holder[key];
	                if (value && typeof value === 'object') {
	                    for (k in value) {
	                        if (Object.prototype.hasOwnProperty.call(value, k)) {
	                            v = walk(value, k);
	                            if (v !== undefined) {
	                                value[k] = v;
	                            } else {
	                                delete value[k];
	                            }
	                        }
	                    }
	                }
	                return reviver.call(holder, key, value);
	            }

	            text = String(text);
	            cx.lastIndex = 0;
	            if (cx.test(text)) {
	                text = text.replace(cx, function (a) {
	                    return '\\u' +
	                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	                });
	            }

	            if (/^[\],:{}\s]*$/
	                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
	                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
	                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
	                j = eval('(' + text + ')');
	                return typeof reviver === 'function'
	                    ? walk({'': j}, '')
	                    : j;
	            }
	            throw new SyntaxError('JSON.parse');
	        };
	    }
	}());
}

(function($){

	smr.reportPathPrefix = "report/";

	smr.REPORT_TYPE = {
			"BATCH":"batch",
			"TRANSACTIONAL":"transactional",
			"PROGRAM":"program",
			"DELIVERABILITY":"deliverability",
			"DELIVERABILITYDOMAINS":"deliverabilityDomains",
			"DOMAINDRILLDOWN":"domainDrillDown",
			"AUDIENCE":"audience",
			"MAILINGDETAIL":"mailingDetail",
			"ABTEST":"ABTest",
			"CAMPAIGNOPTIMIZER":"campaignOptimizer",
			"DEVICEUSAGE":"deviceUsage",
			"USERINSIGHT":"userInsight"
	};

	smr.firstReportInit = {
		"BATCH":false,
		"TRANSACTIONAL":false,
		"PROGRAM":false
	};

	//keep the pre view value for different reports
	smr.preViewSelectVal = {
		"batch":"",
		"transactional":"",
		"program":"",
		"deliverability":"",
		"deliverabilityDomains":"",
		"domainDrillDown":"",
		"audience":""
	};

	smr.isMock = function(){
		return !(typeof dojo !== "undefined");
	}

	smr.metricOrders = ["category","date","targeted","triggered","invalid",'sent',"failed",'delivered','opens','clicks','unsub','unsubs','conversions','complaints','revenue',
						'active','risk','inactive','total','rate'];

	smr.conversionEnabled = true;
	smr.conversionCurrency = "$";
	smr.maxPies = 5;
	smr.selectionLimit = 1000;
	smr.isProgramLicensed = true;
	smr.campaginOverViewMiddleDateType = null;
	smr.campaginOverViewMiddleinAchive = null;
	smr.allDateRangeShow = false;
	smr.maxMailingsInLinkSection = 0;
	smr.isOmniEnabled = true;
	//when pivotBy==0 use it, value will be changed when change fetchSingleMetric checkbox
	smr.fetchSingleMetric = true;
	//origin value for fetchSingleMetric, keep it, when pivotBy!=0 use it
	smr.fetchSingleMetricOrigin = true;
	//check whether need to load pivotTable when change Options
	smr.needReloadPivotTable = true;
	//show segment in User Insight (Options, segmentList and Segment Group Comparison)
	smr.showSegment = false;
	//show Audience Segmentation in BreakdownBy/PivotBy in Pivot view
	smr.showSegmentInPivot = false;
	//show Catalog in BreakdownBy/PivotBy in Pivot view
	smr.showCatalogInPivot = false;
	smr.pivotRequestIdCache = {};

	smr.hasSubOrgs = {
		"batch":true,
		"transactional":false,
		"program":true,
		"deliverability":false,
		"deliverabilityDomains":false,
		"campaignOverview":false,
		"audience":false
	}

	smr.isRootOrg = {
		"batch":false,
		"transactional":false,
		"program":false,
		"deliverability":false,
		"deliverabilityDomains":false,
		"campaignOverview":false,
		"audience":false
	}

	smr.includeSummaryTemp = {
		"batch":{},
		"transactional":{},
		"program":{}
	}

	//save some temp data from server
	smr.dataTempObject = {};
	
	smr.maxReports = 100;

	smr.showReport = function(elem,reportType,reportSection,conversionEnabled,conversionCurrency,
			mailingIds,mailingType,viewName,breakDownBy,serverDate,startDate,endDate,isProgramLicensed,fromReportType,domain,hasSubOrgs,isRootOrg,programMailingIds,isOmniEnabled,
			fetchSingleMetric,showSegment,showSegmentInPivot,showCatalogInPivot,maxMailingsInLinkSection,selectionLimit,maxReports){
		if(domain){
			var option ={mailingIds:mailingIds,mailingType:mailingType,startDate:startDate,endDate:endDate};
			smr.showDomainDrillDownReport(elem,smr.REPORT_TYPE.DOMAINDRILLDOWN,fromReportType,domain,option);
			return;
		}
		var $elem = $(elem);
		// first we empty it
		$elem.bEmpty();
		$elem.addClass(brite.ua.cssHas());
		//add serverDate to smr
		if(serverDate){
			smr.serverDate = (typeof serverDate=="undefined")? new Date():serverDate;
		}
		if(typeof smr.serverDate == "undefined"){
			smr.serverDate = new Date();
		}

		reportType = reportType || smr.REPORT_TYPE.BATCH;

		var isPivotReport = false;
		if (typeof reportType.isPivot != "undefined") {
			isPivotReport = reportType.isPivot;
			reportType = reportType.reportTypeVal;
		}

		if(reportType == smr.REPORT_TYPE.MAILINGDETAIL){
			if(mailingIds && mailingIds.length>0){
				if(!startDate && !endDate){
					startDate = null;
					endDate = null;
					smr.allDateRangeShow = true;
				}else{
					smr.allDateRangeShow = false;
				}
			}else{
				if(!startDate) startDate = new Date(smr.serverDate - 29 * 24 * 60 * 60 * 1000);
				if(!endDate) endDate = smr.serverDate;
			}
		}else{
			smr.allDateRangeShow = false;
		}

		//change the value of conversionEnabled and conversionCurrency
		if(typeof conversionEnabled != "undefined" && conversionEnabled != null){
			smr.conversionEnabled = conversionEnabled;
		}
		if(typeof conversionCurrency != "undefined" && conversionEnabled != null){
			smr.conversionCurrency = conversionCurrency;
		}
		if(typeof selectionLimit != "undefined" && selectionLimit != null){
			smr.selectionLimit = selectionLimit;
		}
		if(typeof isProgramLicensed != "undefined"){
			smr.isProgramLicensed = isProgramLicensed;
		}
		if(typeof hasSubOrgs != "undefined"){
			smr.hasSubOrgs[reportType]=hasSubOrgs;
		}
		if(typeof isRootOrg != "undefined"){
			smr.isRootOrg[reportType]=isRootOrg;
		}
		if(smr.isRootOrg[reportType]){
			smr.hasSubOrgs[reportType]=true;
		}
		if(typeof isOmniEnabled != "undefined" && isOmniEnabled != null){
			smr.isOmniEnabled = isOmniEnabled;
		}
		if(typeof maxMailingsInLinkSection != "undefined"){
			smr.maxMailingsInLinkSection = maxMailingsInLinkSection;
		}
		if(typeof fetchSingleMetric != "undefined" && fetchSingleMetric != null){
			smr.fetchSingleMetric = fetchSingleMetric;
			smr.fetchSingleMetricOrigin = fetchSingleMetric;
		}
		if(typeof showSegment != "undefined" && showSegment != null){
			smr.showSegment = showSegment;
		}
		if(typeof showSegmentInPivot != "undefined" && showSegmentInPivot != null){
			smr.showSegmentInPivot = showSegmentInPivot;
		}
		if(typeof showCatalogInPivot != "undefined" && showCatalogInPivot != null){
			smr.showCatalogInPivot = showCatalogInPivot;
		}
		if(typeof maxReports != "undefined" && maxReports != null){
			smr.maxReports = maxReports;
		}
		
		if(reportType == smr.REPORT_TYPE.DELIVERABILITY){
			reportSection = reportSection || "sectionDeliverabilityOverview";
        }else if(reportType == smr.REPORT_TYPE.DELIVERABILITYDOMAINS){
			reportSection = reportSection || "sectionDeliverabilityDomains";
        }else if(reportType == "campaignOverview"){
            reportSection = reportSection || "sectionCampaignOverview";
		}else if(reportType == smr.REPORT_TYPE.AUDIENCE){
            reportSection = reportSection || "sectionAudienceOverview";
		}else if(reportType == smr.REPORT_TYPE.MAILINGDETAIL){
            reportSection = reportSection || "sectionMailingDetail";
        }else if(reportType == smr.REPORT_TYPE.DEVICEUSAGE){
            reportSection = reportSection || "sectionDeviceUsageOverview";
        }else if(reportType == smr.REPORT_TYPE.ABTEST || reportType == smr.REPORT_TYPE.CAMPAIGNOPTIMIZER){
            reportSection = reportSection || "sectionABAndCO";
        }else if(reportType == smr.REPORT_TYPE.USERINSIGHT){
            reportSection = reportSection || "sectionUserInsightOverview";
		}else{
			reportSection = reportSection || "sectionOverview";
		}

		brite.display("report",$elem,{reportType:reportType,reportSection:reportSection,mailingIds:mailingIds,mailingType:mailingType,viewName:viewName,breakDownBy:breakDownBy,startDate:startDate,endDate:endDate,programMailingIds:programMailingIds,fromReportType:fromReportType, isPivotReport:isPivotReport});		
	}

	smr.showOverviewSummaryReport = function(elem,reportType,mailingIds,mailingType,startDate,endDate,hasSubOrgs,isRootOrg,includeArchived,mailingName){
		var $elem = $(elem);
		// first we empty it
		$elem.bEmpty();
		$elem.addClass(brite.ua.cssHas());

		if(typeof hasSubOrgs != "undefined"){
			smr.hasSubOrgs[reportType]=hasSubOrgs;
		}
		if(typeof isRootOrg != "undefined"){
			smr.isRootOrg[reportType]=isRootOrg;
		}
		if(smr.isRootOrg[reportType]){
			smr.hasSubOrgs[reportType]=true;
		}
		reportType = reportType || smr.REPORT_TYPE.BATCH;

		brite.display("overviewSummary",$elem,{reportType:reportType,mailingIds:mailingIds,mailingType:mailingType,startDate:startDate,endDate:endDate,includeArchived:includeArchived,mailingName:mailingName});
	}

	smr.showDomainDrillDownReport = function(elem,reportType,fromReportType,domainName,option){
		var $elem = $(elem);
		// first we empty it
		$elem.bEmpty();
		$elem.addClass(brite.ua.cssHas());
		var mailingIds = null;
		var mailingType = null;
		var startDate = null;
		var endDate = null;
		if(option){
			mailingIds = option.mailingIds;
			mailingType = option.mailingType;
			startDate = option.startDate;
			endDate = option.endDate;
		}

		var innerDfd = $.Deferred();
		var domainDrillSetAndType = smr.getSetAndType(reportType,"main");
		var domainDrillSet = domainDrillSetAndType.set;
		var domainIdsType = "";

		if(mailingIds && mailingIds.length>0){
			domainDrillSet.clear(true);
			if(mailingType == "program"){
				domainDrillSet.attr("domainType","Program");
				domainIdsType="programIds";
				smr.getProgramsForFilterBox(null,null,null,null,mailingIds).done(function(data){
					innerDfd.resolve(data.items);
				});
			}else if(mailingType == "campaign"){
				domainDrillSet.attr("domainType","Campaign");
				domainIdsType="campaignIds";
				smr.getCampaignsForFilterBox(null,null,null,null,fromReportType).done(function(data){
					var items = data.items;
					var newItems = [];
					for(var i = 0; i <items.length ; i++ ){
						 newItems.push({id:items[i].id , name:items[i].campaign});
					}
					innerDfd.resolve(newItems);
				});
			}else if (mailingType == "vsg" || mailingType == "vsgIp"){
				smr.getVSGsForFilterBox(reportType).done(function(data){
					var data = data.items;
					var newItems = [];
					if(mailingType == "vsgIp"){
						domainDrillSet.attr("domainType","IP");
						domainIdsType="vsgIp";
						var iptem = {};
						for(var k=0;k<data.length;k++){
							var ipsarr = data[k].ips;
							for(var i=0 ; i<ipsarr.length; i++ ){
								if(iptem[ipsarr[i]]!=null){
									newItems.push({"id":ipsarr[i],"name":ipsarr[i]});
									iptem[ipsarr[i]]=false;
								}
							}
						}
					}else{
						domainIdsType="vsg";
						domainDrillSet.attr("domainType","VSG");
						for (var k in data){
							newItems.push({"id":data[k].name,"name":data[k].name});
						}
					}
					innerDfd.resolve(newItems);
				});
			}else{
				domainIdsType="mailingIds";
				domainDrillSet.attr("domainType","Mailing");
				smr.getMailingsForFilterBox(null,null,null,null,fromReportType,mailingIds).done(function(data){
					innerDfd.resolve(data.items);
				});
			}

			innerDfd.done(function(data){
				if(startDate && endDate){
					var period = smr.buildPeriod('inCustomDateRange',startDate,endDate);
					domainDrillSet.period(period);
					domainDrillSet.attr("limit",true);
				}
				domainDrillSet.attr("domainName",domainName);
				domainDrillSet.attr("domainIdsType",domainIdsType);
				for(var i=0;i<data.length;i++){
					if(smr.isInArray(mailingIds,data[i].id)) domainDrillSet.add({id:data[i].id,name:data[i].name});
				}
				brite.display("report",$elem,{reportType:reportType,fromReportType:fromReportType,reportSection:"sectionDomainDrilldown",domainName:domainName});
			});
		}else{
			var fromSetAndType = smr.getSetAndType(fromReportType,"main");
			var _tempPrevSet = smr.createCopySet(fromSetAndType.set);
			smr.copySet(domainDrillSet , _tempPrevSet);
			domainDrillSet.attr("domainType",fromSetAndType.type);
			domainDrillSet.attr("domainName",domainName);
			domainDrillSet.attr("limit",fromSetAndType.set.attr("limit"));
			domainDrillSet.attr("includeSubOrg",fromSetAndType.set.attr("includeSubOrg"));

			if(fromSetAndType.type=="IP") domainIdsType = "vsgIp";
			if(fromSetAndType.type=="VSG") domainIdsType = "vsg";
			if(fromSetAndType.type=="Campaign") domainIdsType = "campaignIds";
			if(fromSetAndType.type=="Program") domainIdsType = "programIds";
			if(fromSetAndType.type=="Mailing") domainIdsType = "mailingIds";
			domainDrillSet.attr("domainIdsType",domainIdsType);
			brite.display("report",$elem,{reportType:reportType,fromReportType:fromReportType,reportSection:"sectionDomainDrilldown",domainName:domainName});
		}
	}

	smr.getJsonData = function(url,isNewRequest,paramData,requestId){
		if(typeof paramData == "undefined"){
			paramData = {};
		}
		var dfd = $.Deferred();
		var index = url.indexOf("?");
		var uri = url;
		var tempUrl = smr.buildTempUrl(url,paramData);
		if(index > 0){
			uri = url.substring(0,index);
		}
		//When we click on left navigation and open the report, invalidate all data caches and reload the data
		if(isNewRequest){
			smr.dataTempObject = {};
		}
		if(typeof requestId != "undefined" && requestId != null ){
			paramData["requestId"] = requestId;
		}
		smr.dataTempObject[uri] = smr.dataTempObject[uri] || {};
		var tempObj = smr.dataTempObject[uri];
		console.log("SMR DEBUG: calling " + url);
		if(tempObj.url == tempUrl){
			console.log("SMR DEBUG: saved url, use cache");
			dfd.resolve(tempObj.data);
		}else{
			var innerDfd = $.Deferred();
			var typeVal = (smr.isMock()) ? "GET" : "POST";
			console.log("SMR DEBUG: calling Type " + typeVal);
			jQuery.ajax({
				type: typeVal,
	            url: url,
	            async: true,
	            dataType: "json",
	            traditional:true,
	            data:paramData
	        }).success(function(data){
	        	innerDfd.resolve(data);
	        }).fail(function(jxhr,arg2){
	        	try {
		        	if (jxhr.responseText){
		        		console.log("SMR WARNING: json not well formatted, falling back to JS eval");
		        		var data = eval("(" + jxhr.responseText + ")");
		        		if(typeof requestId!="undefined" && requestId!=null){
		        			data.requestId = requestId;
		        		}
		        		innerDfd.resolve(data);	
		        	}else{
		        		innerDfd.fail("cannot get " + url + " : " + arg2);
			        	throw "SMR EXCEPTION: Cannot get content for ";
		        	}
	        	}catch (ex){
	        		console.log("SMR ERROR: " + ex + " Fail parsing JSON for url: " + url + "\nContent received:\n" + jxhr.responseText);
	        		innerDfd.fail("SMR ERROR: Cannot get JSON from " + url);
	        	}
	        });

			innerDfd.done(function(data){
				if(typeof smr.dataTempObject[uri] == "undefined"){
					smr.dataTempObject[uri] = {};
				}
				smr.dataTempObject[uri].data = data;
				smr.dataTempObject[uri].url = tempUrl;
				dfd.resolve(smr.dataTempObject[uri].data);
			});
		}

        return dfd.promise();
	}

	/**
	 * Return a deferred object that will resolve with the JSON data.<br />
	 * TODO: needs to add filter (when webservice will be implemented)
	 *
	 * @param mailingName {string} The mailingName to be search (optional)
	 * @param startDate   {string} The starting date (optional)
	 * @param endDate     {string} The end date (optional)
	 */
	smr.getMailingsForFilterBox = function(mailingName,startDate,endDate,includeArchived,reportType,mailingIds,includeSubOrg){

		// ------ building the real URL ----- //
        var url;
        var paramData= {mailingIds:[]};
        if (reportType == "campaignOverview") {
            url = smr.reportPathPrefix + "mailing/getCampaignsForOverview.do?";
        } else {
            url = smr.reportPathPrefix + "mailing/getMailingsForFilterBox.do?";
        }

        if (reportType != "campaignOverview") {
            if (mailingName) {
            	paramData.mailingName = mailingName;
            } else {
            	paramData.mailingName = "";
            }
        }
		//For tranasactional&program no need to pass date range to the Filter API
		if (reportType && (reportType != smr.REPORT_TYPE.TRANSACTIONAL && reportType != smr.REPORT_TYPE.PROGRAM)){
			if (startDate){
				var dateString = smr.formatDate(startDate);
				paramData.startDate = dateString;
			}

			if (endDate){
				var dateString = smr.formatDate(endDate);
				paramData.endDate = dateString;
			}
		}

		if (includeArchived){
			paramData.includeArchived = includeArchived;
		}

		if (includeSubOrg){
			paramData.includeSubOrg = includeSubOrg;
		}

		if (reportType && reportType == smr.REPORT_TYPE.TRANSACTIONAL){
			paramData.transactional = true;
		}

		if(mailingIds){
			for(var i=0;i<mailingIds.length;i++){
				paramData.mailingIds.push(mailingIds[i]);
			}
		}

		// ------ /building the real URL ----- //

        if (smr.isMock()) {
            console.log("SMR DEBUG: Mock mode ON, do not call url: " + url);
            if (reportType == "campaignOverview") {
                url = "data/getCampaignsForOverview.jso";
            } else {
                url = "data/getMailingsForFilterBox.jso";
            }
        }
		// ------ make the request ------ //
		var isNewRequest = true;
		return smr.getJsonData(url,isNewRequest,paramData);
		// ------ /make the request ------ //
	}

	/**
	 * Return a deferred object that will resolve with the JSON data.<br />
	 * TODO: needs to add filter (when webservice will be implemented)
	 *
	 * @param campaignName {string} The mailingName to be search (optional)
	 * @param startDate   {string} The starting date (optional)
	 * @param endDate     {string} The end date (optional)
	 */
	smr.getCampaignsForFilterBox = function(campaignName,startDate,endDate,includeArchived,reportType,includeSubOrg){

		// ------ building the real URL ----- //
		var url = "";
		var dataParam = {};
        if (reportType == "campaignOverview") {
            url = smr.reportPathPrefix + "mailing/getCampaignsForOverview.do?";
        } else {
            url = smr.reportPathPrefix + "mailing/getCampaignsForFilterBox.do?";
        }

		if (campaignName){
			dataParam.campaignName = campaignName;
		}
		//For tranasactional&program no need to pass date range to the Filter API
		if (reportType && (reportType != smr.REPORT_TYPE.TRANSACTIONAL && reportType != smr.REPORT_TYPE.PROGRAM)){
			if (startDate){
				var dateString = smr.formatDate(startDate);
				dataParam.startDate = dateString;
			}
			if (endDate){
				var dateString = smr.formatDate(endDate);
				dataParam.endDate = dateString;
			}
		}

		if (includeArchived){
			dataParam.includeArchived = includeArchived;
		}

		if (includeSubOrg){
			dataParam.includeSubOrg = includeSubOrg;
		}

		if (reportType){
			if(reportType == smr.REPORT_TYPE.TRANSACTIONAL){
				dataParam.transactional = true;
			}else if(reportType == smr.REPORT_TYPE.PROGRAM){
				dataParam.program = true;
			}
		}
		// ------ /building the real URL ----- //

		if (smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON, do not call url: " + url);
            if(reportType == "campaignOverview"){
                url = "data/getCampaignsForOverview.jso";
            }else{
                url = "data/getCampaignsForFilterBox.jso";
            }

		}
		// ------ make the request ------ //
		var isNewRequest = true;
		return smr.getJsonData(url,isNewRequest,dataParam);
		// ------ /make the request ------ //

	}

	/**
	 * Return a deferred object that will resolve with the JSON data.<br />
	 * TODO: needs to add filter (when webservice will be implemented)
	 *
	 * @param campaignName {string} The mailingName to be search (optional)
	 * @param startDate   {string} The starting date (optional)
	 * @param endDate     {string} The end date (optional)
	 */
	smr.getProgramsForFilterBox = function(campaignName,startDate,endDate,includeArchived,mailingIds,includeSubOrg){

		// ------ building the real URL ----- //
		var url = smr.reportPathPrefix + "mailing/getProgramsForFilterBox.do?";
		var dataParam ={programIds:[]};

		if (campaignName){
			dataParam.campaignName=campaignName;
		}

		if (includeArchived){
			dataParam.includeArchived=includeArchived;
		}

		if (includeSubOrg){
			dataParam.includeSubOrg=includeSubOrg;
		}

		if(mailingIds){
			for(var i=0;i<mailingIds.length;i++){
				dataParam.programIds.push(mailingIds[i]);
			}
		}
		// ------ /building the real URL ----- //


		if (smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON, do not call url: " + url);
			url = "data/getProgramsForFilterBox.jso";
		}
		// ------ make the request ------ //
		var isNewRequest = true;
		return smr.getJsonData(url,isNewRequest,dataParam);
		// ------ /make the request ------ //

	}

	/**
	 * Return a deferred object that will resolve with the JSON data.<br />
	 * TODO: needs to add filter (when webservice will be implemented)
	 *
	 */
	smr.getVSGsForFilterBox = function(reportType,includeSubOrg){
		// ------ building the real URL ----- //
		var url = smr.reportPathPrefix + "mailing/getVsgsForFilterBox.do?";
		var dataParam = {};

		if(reportType == smr.REPORT_TYPE.DELIVERABILITY){
			dataParam.includeInactive = false;
		}
		if(includeSubOrg){
			dataParam.includeSubOrg = includeSubOrg;
		}

		if (smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON, do not call url: " + url);
			url = "data/getDeliverabilityVSGsIPsReport.jso";
		}
		// ------ /building the real URL ----- //

		// ------ make the request ------ //
		var isNewRequest = true;
		return smr.getJsonData(url,isNewRequest,dataParam);
		// ------ /make the request ------ //

	}

	/**
	 * Return a deferred object that will resolve with the JSON data.<br />
	 * TODO: needs to add filter (when webservice will be implemented)
	 *
	 */
	smr.getTargetsForFilterBox = function(reportType,startDate,endDate){
		// ------ building the real URL ----- //
		var url = smr.reportPathPrefix + "audience/getTargets.do?";
		var dataParam = {};

		if (startDate){
			var dateString = smr.formatDate(startDate);
			dataParam.startDate = dateString;
		}

		if (endDate){
			var dateString = smr.formatDate(endDate);
			dataParam.endDate = dateString;
		}

		if (smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON, do not call url: " + url);
			url = "data/getAudienceTargetsForFilterBox.jso";
		}
		// ------ /building the real URL ----- //

		// ------ make the request ------ //
		var isNewRequest = true;
		return smr.getJsonData(url,isNewRequest,dataParam);
		// ------ /make the request ------ //
	}

	/**
	 * Return a deferred object that will resolve with the JSON data.<br />
	 * TODO: needs to add filter (when webservice will be implemented)
	 *
	 */
	smr.getMailingDetailsForFilterBox = function(reportType,startDate,endDate,includeArchived,mailingType,mailingId){
		// ------ building the real URL ----- //
		var url = smr.reportPathPrefix + "mailingdetail/getMailings.do?";
		var dataParam = {};

		if (startDate){
			var dateString = smr.formatDate(startDate);
			dataParam.startDate = dateString;
		}

		if (endDate){
			var dateString = smr.formatDate(endDate);
			dataParam.endDate = dateString;
		}

		if (includeArchived){
			dataParam.includeArchived = includeArchived;
		}

		if (mailingType){
			dataParam.mailingType = mailingType;
		}

		if (mailingId){
			dataParam.mailingId = mailingId;
		}

		if (smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON, do not call url: " + url);
			url = "data/getMailingDetailForFilterBox.jso";
		}
		// ------ /building the real URL ----- //

		// ------ make the request ------ //
		var isNewRequest = true;
		return smr.getJsonData(url,isNewRequest,dataParam);
		// ------ /make the request ------ //
	}

	smr.getABTestMailingsForFilterBox = function(reportType,startDate,endDate,includeArchived){
		// ------ building the real URL ----- //
		var url = smr.reportPathPrefix + "abmailing/getMailings.do?";
		var dataParam = {};

		if (startDate){
			var dateString = smr.formatDate(startDate);
			dataParam.startDate = dateString;
		}

		if (endDate){
			var dateString = smr.formatDate(endDate);
			dataParam.endDate = dateString;
		}

		if (includeArchived){
			dataParam.includeArchived = includeArchived;
		}

		if (smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON, do not call url: " + url);
			url = "data/getABMailingForFilterBox.jso";
		}
		// ------ /building the real URL ----- //

		// ------ make the request ------ //
		var isNewRequest = true;
		return smr.getJsonData(url,isNewRequest,dataParam);
		// ------ /make the request ------ //
	}

	smr.getCampaignOptimizerForFilterBox = function(reportType,startDate,endDate,includeArchived){
		// ------ building the real URL ----- //
		var url = smr.reportPathPrefix + "comailing/getMailings.do?";
		var dataParam = {};

		if (startDate){
			var dateString = smr.formatDate(startDate);
			dataParam.startDate = dateString;
		}

		if (endDate){
			var dateString = smr.formatDate(endDate);
			dataParam.endDate = dateString;
		}

		if (includeArchived){
			dataParam.includeArchived = includeArchived;
		}

		if (smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON, do not call url: " + url);
			url = "data/getCampaignOptimizerForFilterBox.jso";
		}
		// ------ /building the real URL ----- //

		// ------ make the request ------ //
		var isNewRequest = true;
		return smr.getJsonData(url,isNewRequest,dataParam);
		// ------ /make the request ------ //
	}

	smr.getTagsForFilterBox = function(reportType,startDate,endDate,includeArchived,includeSubOrg){
		// ------ building the real URL ----- //
		var url = smr.reportPathPrefix + "mailing/getTagsForFilterBox.do?";
		var dataParam = {};

		if (startDate){
			var dateString = smr.formatDate(startDate);
			dataParam.startDate = dateString;
		}

		if (endDate){
			var dateString = smr.formatDate(endDate);
			dataParam.endDate = dateString;
		}

		if (includeArchived){
			dataParam.includeArchived = includeArchived;
		}

		if (includeSubOrg){
			dataParam.includeSubOrg=includeSubOrg;
		}

		dataParam.mailingType = reportType;

		if (smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON, do not call url: " + url);
			url = "data/getTagsForFilterBox.jso";
		}
		// ------ /building the real URL ----- //

		// ------ make the request ------ //
		var isNewRequest = true;
		return smr.getJsonData(url,isNewRequest,dataParam);
		// ------ /make the request ------ //
	}

	smr.getUserInsightForFilterBox = function(recipientId,offset,count){
		// ------ building the real URL ----- //
		var url = smr.reportPathPrefix + "mailing/omni/userInsight/getUsers.do?";
		var reportType = smr.REPORT_TYPE.USERINSIGHT;
		var paramData = {};
		var dateRange = smr.getSetAndType(reportType,"main").set.period().getDateRange();
		if(dateRange.startDate){
			paramData.startDate = smr.formatDate(dateRange.startDate);
		}
		if(dateRange.endDate){
			paramData.endDate = smr.formatDate(dateRange.endDate);
		}
		if(recipientId)  paramData.recipientId = recipientId;
		paramData.count = count;
		paramData.offset = offset;

		if (smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON, do not call url: " + url);
			url = "data/getUserInsightFilterBox.jso";
		}

		// ------ /building the real URL ----- //

		// ------ make the request ------ //
		var isNewRequest = true;
		return smr.getJsonData(url,isNewRequest,paramData);
		// ------ /make the request ------ //
	}

	/**
	 * Return a deferred object that will resolve with the JSON data.<br />
	 * TODO: needs to add filter (when webservice will be implemented)
	 * Note: dataType have common(for Overview, Volume, Engagement, Dis-Engagement,Trends views),comparison,links,linksConversion,failure,sharing,sharingFtaf 
	 */
	smr.getSummary = function(reportType,dataType,breakDownType,isNewRequest,fromReportType,programMailingIds,includeDynamicContent){
		var url;
		// ------ Build Real URL ------ //
		// here make the batch transactional lifecycle use one way
		var objType = "mailing";
		var objReportType = reportType;

		if(reportType == smr.REPORT_TYPE.PROGRAM){
			objType = "program";
			objReportType = "program";
		}

		var paramObject = {mailingIds:[],programIds:[],campaignIds:[],targetId:[],vsgIp:[],vsg:[]};

		// build the mailingsId URL suffix
		if(dataType == "comparison"){
			paramObject.mailingIds2=[];
			paramObject.programIds2=[];
			paramObject.campaignIds2=[];
			// here when reportType is lifecycle, maybe need the programId, right now we did not have so just use mailingId
			var compareAIds = smr.getMailingSet(objReportType,"compareA").list();
			var compareBIds = smr.getMailingSet(objReportType,"compareB").list();
			for(var i=0;i<compareAIds.length;i++){
				paramObject.mailingIds.push(compareAIds[i].id);
			}
			for(var j=0;j<compareBIds.length;j++){
				paramObject.mailingIds2.push(compareBIds[j].id);
			}
			var programAIds = smr.getProgramSet(objReportType,"compareA").list();
			var programBIds = smr.getProgramSet(objReportType,"compareB").list();
			for(var i=0;i<programAIds.length;i++){
				paramObject.programIds.push(programAIds[i].id);
			}
			for(var j=0;j<programBIds.length;j++){
				paramObject.programIds2.push(programBIds[j].id);
			}
			var cCampaignIdsA = smr.getCampaignSet(objReportType,"compareA").list();
			var cCampaignIdsB = smr.getCampaignSet(objReportType,"compareB").list();
			for(var i=0;i<cCampaignIdsA.length;i++){
				paramObject.campaignIds.push(cCampaignIdsA[i].id);
			}
			for(var i=0;i<cCampaignIdsB.length;i++){
				paramObject.campaignIds2.push(cCampaignIdsB[i].id);
			}
		}else if(dataType == "campaignOverview"){
			//Campaign Overview Report does not have mailingIds parameter
            var campaigns = smr.getCampaignSet(reportType,"main").list();
            if (campaigns.length > 0) {
                for (var i = 0; i < campaigns.length; i++) {
                	paramObject.campaignIds.push(campaigns[i].id);
                }
            } else {
                var mainIds = smr.getMailingSet(objReportType,"main").list();
                for(var i=0;i<mainIds.length;i++){
                	paramObject.campaignIds.push(mainIds[i].id);
                }
            }
		}else if(dataType == "domainDrilldown") {
			var setType =  smr.getSetAndType(reportType,"main");
			var itemlist = setType.set.list();
			var domainIdsType = setType.set.attr("domainIdsType");
            for(var i=0; i< itemlist.length ; i++ ){
            	paramObject[domainIdsType].push(itemlist[i].id);
            }
		}else{
			var mainIds = smr.getMailingSet(objReportType,"main").list();
			for(var i=0;i<mainIds.length;i++){
				paramObject[objType + "Ids"].push( mainIds[i].id);
			}

			var campaigns = smr.getCampaignSet(reportType,"main").list();
			for(var i = 0; i < campaigns.length; i++){
				paramObject.campaignIds.push(campaigns[i].id);
			}

			if(reportType == smr.REPORT_TYPE.PROGRAM){
				var programs = smr.getProgramSet(reportType,"main").list();
				for(var i = 0; i < programs.length; i++){
					paramObject.programIds.push(programs[i].id);
				}
			}
			if(reportType==smr.REPORT_TYPE.AUDIENCE){
				var targets = smr.getTargetSet(reportType,"main").list();
				for(var i = 0; i < targets.length; i++){
					paramObject.targetId.push(targets[i].id);
				}
			}
		}

		//build the ips or vsgs for smr.REPORT_TYPE.DELIVERABILITY or smr.REPORT_TYPE.DELIVERABILITYDOMAINS retport
		if(reportType == smr.REPORT_TYPE.DELIVERABILITY || reportType == smr.REPORT_TYPE.DELIVERABILITYDOMAINS){
			var setType =  smr.getSetAndType(reportType,"main");
			var mainIds = setType.set.list();
			var idstypes = (setType.type=="VSG" ? "vsg" :"vsgIp");
			for(var i = 0; i < mainIds.length; i++){
				paramObject[idstypes].push(mainIds[i].id);
			}
		}

		// build the breakDown (note:comparison,links,linksConversion these 3 did not have breakDownBy)
		if(dataType == "common" || dataType == "failure" || dataType == "sharing" || dataType == "sharingFtaf" || dataType == "sms" || dataType=="programEvents" || reportType==smr.REPORT_TYPE.DOMAINDRILLDOWN || reportType==smr.REPORT_TYPE.AUDIENCE){
			paramObject.breakDownBy = breakDownType;
		}
		if(dataType == "campaignOverview" || reportType == smr.REPORT_TYPE.DELIVERABILITY ){
			paramObject.breakDownBy = breakDownType;
		}

		// build the url method
		var urlMethod = smr.reportPathPrefix;
		var addTagValueId = false;
		if(dataType == "common"){
			if(breakDownType=="client" || breakDownType=="browser" || breakDownType=="device"){
				urlMethod = urlMethod  + "deviceusage/getDeviceAndClientReport.do?t=1"; 
			}else{
				if(reportType == smr.REPORT_TYPE.PROGRAM){
					urlMethod = urlMethod + objType + "/" + objReportType + "summary.do?action=getSummary";
					addTagValueId = true;
				}else if(reportType == smr.REPORT_TYPE.AUDIENCE){
					urlMethod = urlMethod  + "audience/getAudienceReport.do?t=1"; 
				}else {
					urlMethod = urlMethod + objReportType + "summary.do?action=getSummary";
					addTagValueId = true;
				}
			}
		}else if(dataType == "comparison"){
			if(reportType == smr.REPORT_TYPE.PROGRAM){
				urlMethod = urlMethod + objType + "/" + objReportType + "comparison.do?action=compare";
				addTagValueId = true;
			}else{
				urlMethod = urlMethod + objReportType + "comparison.do?action=compare";
				addTagValueId = true;
			}
		}else if(dataType == "links"){
			urlMethod = urlMethod + objType + "/getLinksReport.do?";
			//add the attribute for Dynamic Content checkbox
			paramObject.includeDynamicContent = includeDynamicContent;
			if(reportType == smr.REPORT_TYPE.BATCH || reportType == smr.REPORT_TYPE.TRANSACTIONAL || reportType == smr.REPORT_TYPE.PROGRAM){
				addTagValueId = true;
			}
		}else if(dataType == "linksConversion"){
			urlMethod = urlMethod + objType + "/getLinksConversionReport.do?";
			if(reportType == smr.REPORT_TYPE.BATCH || reportType == smr.REPORT_TYPE.TRANSACTIONAL || reportType == smr.REPORT_TYPE.PROGRAM){
				addTagValueId = true;
			}
		}else if(dataType == "failure"){
			if(reportType == smr.REPORT_TYPE.DELIVERABILITY){
				urlMethod = urlMethod + objType + "/getDeliverabilityReport.do?";
			}else{
				urlMethod = urlMethod + objType + "/getFailuresReport.do?";
				if(reportType == smr.REPORT_TYPE.BATCH || reportType == smr.REPORT_TYPE.TRANSACTIONAL || reportType == smr.REPORT_TYPE.PROGRAM){
					addTagValueId = true;
				}
				if(programMailingIds != null){
					paramObject.programMailingIds = programMailingIds;
				}
			}
		}else if(dataType == "sharing"){
			urlMethod = urlMethod + objType + "/getSharingReport.do?";
			if(reportType == smr.REPORT_TYPE.BATCH || reportType == smr.REPORT_TYPE.TRANSACTIONAL || reportType == smr.REPORT_TYPE.PROGRAM){
				addTagValueId = true;
			}
		}else if(dataType == "sharingFtaf"){
			urlMethod = urlMethod + objType + "/getFtafReport.do?";
			if(reportType == smr.REPORT_TYPE.BATCH || reportType == smr.REPORT_TYPE.TRANSACTIONAL || reportType == smr.REPORT_TYPE.PROGRAM){
				addTagValueId = true;
			}
		}else if(dataType == "campaignOverview"){
			urlMethod = urlMethod + objType + "/getCampaignOverviewReport.do?";
		}else if(dataType == "deliverabilityOverview" || dataType == "defers"){
			urlMethod = urlMethod + objType + "/getDeliverabilityReport.do?";
		}else if(dataType == "deliverabilityDomains"){
			urlMethod = urlMethod + objType + "/getDomainFailureReport.do?";
		}else if (dataType == "sms"){
			urlMethod = urlMethod + objType + "/getSMSReport.do?";
			addTagValueId = true;
		}else if (dataType == "domainDrilldown"){
			urlMethod = urlMethod + objType + "/getDomainDeliverabilityDrillDownReport.do?";
		}else if(dataType=="audience"){
			urlMethod = urlMethod + "audience/getAudienceReport.do?t=1";
		}else if(dataType=="programEvents"){
			urlMethod = urlMethod + objType + "/getProgramEventReport.do?";
			addTagValueId = true;
		}

		//add the tagValueId
		if(addTagValueId){
			if(dataType == "comparison"){
				paramObject.tagValueIds = [];
				paramObject.tagValueIds2 = [];
				var compareAIds = smr.getTagSet(reportType,"compareA").list();
				var compareBIds = smr.getTagSet(reportType,"compareB").list();
				for(var i=0;i<compareAIds.length;i++){
					paramObject.tagValueIds.push(compareAIds[i].id);
				}
				for(var j=0;j<compareBIds.length;j++){
					paramObject.tagValueIds2.push(compareBIds[j].id);
				}
			}else{
				paramObject.tagValueIds = [];
				var tags = smr.getTagSet(reportType,"main").list();
				for(var i = 0; i < tags.length; i++){
					paramObject.tagValueIds.push(tags[i].id);
				}
			}
		}

		//when reportType is transactional will add this &transactionalal=true
		if(reportType == smr.REPORT_TYPE.TRANSACTIONAL){
			paramObject.transactional = true;
		}

		//when reportType is lifecycle will add this &program=true
		var programStatu = "";
		if(reportType == smr.REPORT_TYPE.PROGRAM){
			if(dataType == "links" || dataType == "failure" || dataType == "sharing" || dataType == "sharingFtaf" || dataType == "linksConversion"){
				paramObject.program = true;
			}
			if(breakDownType=="client" || breakDownType=="browser" || breakDownType=="device"){
			   paramObject.program = true;
			}
		}

		var includeArchiveStr = "";
		var includeSubOrgStr = "";
		var dateStr="";
		var domain="";
		if(dataType == "comparison"){
			var setTypeA = smr.getSetAndType(reportType,"compareA");
			var setTypeB = smr.getSetAndType(reportType,"compareB");
			var dateRangeA = setTypeA.set.period().getDateRange();
			var dateRangeB = setTypeB.set.period().getDateRange();
			var limitA = setTypeA.set.attr("limit");
			var limitB = setTypeB.set.attr("limit");
			if(limitA){
				if(dateRangeA.startDate){
					paramObject.startDate = smr.formatDate(dateRangeA.startDate);
				}
				if(dateRangeA.endDate){
					paramObject.endDate = smr.formatDate(dateRangeA.endDate);
				}
			}
			if(limitB){
				if(dateRangeB.startDate){
					paramObject.startDate2 = smr.formatDate(dateRangeB.startDate);
				}
				if(dateRangeB.endDate){
					paramObject.endDate2 = smr.formatDate(dateRangeB.endDate);
				}
			}

			//includeArchive
			var includeArchiveA = setTypeA.set.attr("includeArchive");
			var includeArchiveB = setTypeB.set.attr("includeArchive");
			var includeSubOrgA = setTypeA.set.attr("includeSubOrg");
			var includeSubOrgB = setTypeB.set.attr("includeSubOrg");
			if(includeArchiveA){
				paramObject.includeArchived = true;
			}else{
				paramObject.includeArchived = false;
			}
			if(includeArchiveB){
				paramObject.includeArchived2 = true;
			}else{
				paramObject.includeArchived2 = false;
			}
			if(includeSubOrgA){
				paramObject.includeSubOrg = true;
			}else{
				paramObject.includeSubOrg = false;
			}
			if(includeSubOrgB){
				paramObject.includeSubOrg2 = true;
			}else{
				paramObject.includeSubOrg2 = false;
			}
		}else{
			if(reportType == smr.REPORT_TYPE.DELIVERABILITY || reportType == smr.REPORT_TYPE.DELIVERABILITYDOMAINS){
				var deliset = smr.getSetAndType(reportType,"main").set;
				var dateRange = deliset.period().getDateRange();
				if(dateRange.startDate){
					paramObject.startDate = smr.formatDate(dateRange.startDate);
				}
				if(dateRange.endDate){
					paramObject.endDate = smr.formatDate(dateRange.endDate);
				}
				var includeSubOrg = deliset.attr("includeSubOrg");
				if(includeSubOrg){
					paramObject.includeSubOrg = true;
				}else{
					paramObject.includeSubOrg = false;
				}
			}else if(reportType == smr.REPORT_TYPE.DOMAINDRILLDOWN){
				var domainSet = smr.getSetAndType(reportType,"main").set;
				var limit = domainSet.attr("limit");
				var dateRange = domainSet.period().getDateRange();
				if(limit){
					if(dateRange.startDate){
						paramObject.startDate = smr.formatDate(dateRange.startDate);
					}
					if(dateRange.endDate){
						paramObject.endDate = smr.formatDate(dateRange.endDate);
					}
				}
				paramObject.domainName = domainSet.attr("domainName");
				var includeSubOrg = domainSet.attr("includeSubOrg");
				if(includeSubOrg){
					paramObject.includeSubOrg = true;
				}else{
					paramObject.includeSubOrg = false;
				}

			} else {
				var dateRange = smr.getSetAndType(reportType,"main").set.period().getDateRange();
				var limit = smr.getSetAndType(reportType,"main").set.attr("limit");
				if(limit){
					if(dateRange.startDate){
						paramObject.startDate = smr.formatDate(dateRange.startDate);
					}
					if(dateRange.endDate){
						paramObject.endDate = smr.formatDate(dateRange.endDate);
					}
				}

				var includeArchive = smr.getSetAndType(reportType,"main").set.attr("includeArchive");
				if(includeArchive){
					paramObject.includeArchived = true;
				}else{
					paramObject.includeArchived = false;
				}
				if(dataType != "campaignOverview"){
					var includeSubOrg = smr.getSetAndType(reportType,"main").set.attr("includeSubOrg");
					if(includeSubOrg){
						paramObject.includeSubOrg = true;
					}else{
						paramObject.includeSubOrg = false;
					}
				}

			}
		}
		var fromType = "";
		if(reportType == smr.REPORT_TYPE.DOMAINDRILLDOWN && fromReportType){
			paramObject.fromReportType = fromReportType;
		}
		url = urlMethod;
		// ------ /Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			var fileName = "data/get";
			var rType = reportType.substring(0,1).toUpperCase( ) + reportType.substring(1);
			var dType = dataType.substring(0,1).toUpperCase( ) + dataType.substring(1);

			if(reportType == smr.REPORT_TYPE.DELIVERABILITY){
				fileName = fileName + "DeliverabilityReport.jso";
			}else if(reportType == smr.REPORT_TYPE.DELIVERABILITYDOMAINS){
				fileName = fileName + "DeliverabilityDomainsReport.jso";
			}else if(reportType == smr.REPORT_TYPE.AUDIENCE){
				fileName = fileName + "AudienceReport.jso";
			}else{
				if(dataType == "links" || dataType == "linksConversion" || dataType == "sharing" || dataType == "sharingFtaf" || dataType == "failure"|| dataType == "comparison"){
					fileName = fileName + rType + dType + "Report.jso"
				}else if(dataType == "campaignOverview"){
					fileName = fileName + rType + "Report.jso"
				}else if(dataType == "deliverabilityOverview"){
					fileName = fileName + dType + "Report.jso"
				}else if(dataType == "sms"){
					fileName = fileName + "SMSReport-breakdownby"+ breakDownType +".jso"
				}else if(dataType == "programEvents"){
					fileName = fileName + "ProgramEvents.jso"
				}else if(breakDownType=="client" || breakDownType=="browser" || breakDownType=="device"){
					fileName = fileName + "DeviceAndClientReport.jso"
				}else{
					fileName = fileName + rType + "Summary-breakdownby" + breakDownType + ".jso"
				}
			}

			url = fileName;
			if(reportType == smr.REPORT_TYPE.DOMAINDRILLDOWN){
				url = "data/getDomainDrilldown.jso";
			}
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,isNewRequest,paramObject);
	}

	smr.getMailingDetailSummary = function(reportType,dataType,isNewRequest,subType,includeDynamicContent){
		var url;
		var paramData = {};
		// ------ Build Real URL ------ //
		var objType = "mailingdetail";
		var urlMethod = smr.reportPathPrefix;

		if(dataType == "Summary"){
			urlMethod = urlMethod + objType + "/getSummary.do?";
		}else if(dataType == "LinkPerformance"){
			urlMethod = urlMethod + objType + "/getLinkPerformance.do?";
		}else if(dataType == "DeviceUsage"){
			urlMethod = urlMethod + objType + "/getDeviceUsage.do?";
		}else{
			urlMethod = urlMethod + objType + "/getMailingDetail.do?";
		}

		var dateStr = "";
		var itemList = smr.getSetAndType(reportType,"main").set;

		var dataList = itemList.list();
		if(typeof dataList[0] == "undefined"){
			var data = {};
			var dfd = $.Deferred();
			dfd.resolve(data);
			return dfd.promise();
		}

		paramData.mailingId = dataList[0].id;
		
		var mailingType = dataList[0].mailingType;
		if(mailingType == "Transactional" || mailingType == "transactional" || mailingType == "Program" || mailingType == "program"){
			if(!smr.allDateRangeShow){
				var dateRange = itemList.period().getDateRange();
				if(dateRange.startDate){
					paramData.startDate = smr.formatDate(dateRange.startDate);
				}
				if(dateRange.endDate){
					paramData.endDate = smr.formatDate(dateRange.endDate);
				}
			}
		}

		var linkType = "";
		if(subType != null && typeof subType != "undefined"){
			if(subType == "clicks"){
				paramData.includeClicks = true;
				paramData.includeConversions = false;
				paramData.includeDynamicContent = includeDynamicContent;
			}else if(subType == "conversions"){
				paramData.includeClicks = false;
				paramData.includeConversions = true;
			}else{
				paramData.includeClicks = true;
				paramData.includeConversions = true;
				paramData.includeDynamicContent = includeDynamicContent;
			}
		}

		url = urlMethod ;
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			var fileName = "data/getMailingDetail";
			if(dataType == "Summary"){
				url = fileName + "Summary.jso";
			}else if(dataType == "LinkPerformance"){
				url = fileName + "LinkPerformance.jso";
			}else if(dataType == "DeviceUsage"){
				url = fileName + "DeviceUsage.jso";
			}else{
				url = fileName + ".jso";
			}
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,isNewRequest,paramData);
	}

	smr.getDeviceUsageSummary = function(reportType,dataType,isNewRequest){
		var url;
		var paramData = {};
		// ------ Build Real URL ------ //
		var urlMethod = smr.reportPathPrefix;
		urlMethod = urlMethod + "/deviceusage/getDeviceUsageReport.do?";

		var itemList = smr.getSetAndType(reportType,"main").set;
		var dateRange = itemList.period().getDateRange();
		if(dateRange.startDate){
			paramData.startDate = smr.formatDate(dateRange.startDate);
		}
		if(dateRange.endDate){
			paramData.endDate = smr.formatDate(dateRange.endDate);
		}

		if(dataType){
			paramData.breakDownBy = dataType;
		}

		url = urlMethod ;
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			url = "data/getDeviceUsageReport.jso";
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,isNewRequest,paramData);
	}

	smr.getABTestSummary = function(reportType,isNewRequest){
		var url;
		var paramData = {};
		// ------ Build Real URL ------ //
		var objType = "mailingdetail";
		var urlMethod = smr.reportPathPrefix +"abmailing/getABMailingReport.do?";

		var dateStr = "";
		var itemList = smr.getSetAndType(reportType,"main").set;

		var dataList = itemList.list();
		paramData.mailingId = dataList[0].id;

		url = urlMethod ;
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			url = "data/getABMailingReport.jso";
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,isNewRequest,paramData);
	}

	smr.getCampaignOptimizerSummary = function(reportType,isNewRequest){
		var url;
		var paramData = {};
		// ------ Build Real URL ------ //
		var urlMethod = smr.reportPathPrefix +"comailing/getCOMailingReport.do?";

		var dateStr = "";
		var itemList = smr.getSetAndType(reportType,"main").set;

		var dataList = itemList.list();
		paramData.mailingId = dataList[0].id;

		url = urlMethod ;
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			url = "data/getCampaignOptimizerReport.jso";
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,isNewRequest,paramData);
	}

	smr.getBigDataSummary = function(reportType,actionName,metrics,viewRates,showUnique,isNewRequest,fetchSingleMetric,isHaveMetric,requestId,versionId,reportId){
		var actions = {
				"getOverview"     :{"mockUrl":"data/getBigDataOverview.jso","section":"overview"},
				"getVolume"       :{"mockUrl":"data/getBigDataVolume.jso","section":"volume"},
				"getEngagement"   :{"mockUrl":"data/getBigDataEngagement.jso","section":"engagement"},
				"getDisEngagement":{"mockUrl":"data/getBigDataDisEngagement.jso","section":"disengagement"},
				"getConversions"  :{"mockUrl":"data/getBigDataConversions.jso","section":"conversions"},
				"getFailures"     :{"mockUrl":"data/getBigDataFailures.jso","section":"failures"},
				"getShares"       :{"mockUrl":"data/getBigDataShares.jso","section":"sharing"},
				"getFTAF"         :{"mockUrl":"data/getBigDataFTAF.jso","section":"sharingFTAF"}
		}
		var url;
		// ------ Build Real URL ------ //
		var urlMethod = smr.reportPathPrefix +"mailing/omni/";

		urlMethod = urlMethod + "getReportData.do?";
		//var identifierIncludeSummary = "";

		var paramObject = {mailingIds:[],programIds:[],campaignIds:[],tagValueIds:[]};

		var sectionName = actions[actionName]["section"];
		if((sectionName == "overview" || sectionName == "failures") && typeof viewRates != "undefined" && viewRates != null){
			paramObject.viewRates = viewRates;
		}
		if(sectionName == "engagement" && typeof showUnique != "undefined" && showUnique != null){
			paramObject.showUnique = showUnique;
		}

		var mainIds = smr.getMailingSet(reportType,"main",true).list();
		for(var i=0;i<mainIds.length;i++){
			paramObject.mailingIds.push( mainIds[i].id);
			//identifierIncludeSummary+="&mailingIds="+mainIds[i].id;
		}

		var campaigns = smr.getCampaignSet(reportType,"main",true).list();
		for(var i = 0; i < campaigns.length; i++){
			paramObject.campaignIds.push(campaigns[i].id);
			//identifierIncludeSummary+="&campaignIds="+campaigns[i].id;
		}

		if(reportType == smr.REPORT_TYPE.PROGRAM){

			var programs = smr.getProgramSet(reportType,"main",true).list();
			for(var i = 0; i < programs.length; i++){
				paramObject.programIds.push(programs[i].id);
				//identifierIncludeSummary+="&programIds="+programs[i].id;
			}
		}

		var tags = smr.getTagSet(reportType,"main",true).list();
		for(var i = 0; i < tags.length; i++){
			paramObject.tagValueIds.push(tags[i].id);
			//identifierIncludeSummary+="&tagValueIds="+tags[i].id;
		}

		var set = smr.getSetAndType(reportType,"main",true).set;
		var dateRange = set.period().getDateRange();
		var limit = set.attr("limit");
		if(limit){
			if(dateRange.startDate){
				paramObject.startDate = smr.formatDate(dateRange.startDate);
				//identifierIncludeSummary+="&startDate="+paramObject.startDate;
			}
			if(dateRange.endDate){
				paramObject.endDate = smr.formatDate(dateRange.endDate);
				//identifierIncludeSummary+="&endDate="+paramObject.endDate;
			}
		}

		//add the isAllSelected for pivot request, now rename the isAllSelected to allMailingSelected
		if(typeof set.attr("isAllSelected") == "undefined"){
			paramObject.allMailingSelected = true;
		}else{
			paramObject.allMailingSelected = set.attr("isAllSelected");
		}

		//when Fetch Single Metric, we should cache the Summary on the local , when the includeSummary is false
		//since the Summary will not be passed in the JSON data from server
		//includeSummary parameter changed only when the mailing selector or date changed
		if(fetchSingleMetric){
//			var includeSummaryTemp = smr.includeSummaryTemp[reportType][actionName];
//			if(includeSummaryTemp){
//				if(includeSummaryTemp.identifierIncludeSummary==identifierIncludeSummary){
//					includeSummaryTemp.include = false;
//				}else{
//					includeSummaryTemp.identifierIncludeSummary=identifierIncludeSummary;
//					includeSummaryTemp.include = true;
//				}
//			}else{
//				smr.includeSummaryTemp[reportType][actionName]={include:false,identifierIncludeSummary:identifierIncludeSummary};
//			}
			paramObject.includeSummary = true; //smr.includeSummaryTemp[reportType][actionName].include;
		}

		//only pass the metrics when Fetch All Metrics unchecked
		//when default pivot, also do not pass metrics
		if(isHaveMetric){
			paramObject.metrics = metrics;
		}

		var includeArchive = set.attr("includeArchive");
		paramObject.includeArchived = includeArchive ? true : false ;

		var includeSubOrg = set.attr("includeSubOrg");
		paramObject.includeSubOrg = includeSubOrg ? true : false;

		var pivotOption = set.attr("pivotOption");
		var breakdowns = pivotOption[sectionName+"-breakdown"] || [{name:"Mailing",value:"mailing"}];

		paramObject.versionId = versionId;
		paramObject.reportId = reportId;
		paramObject.reportSection = sectionName;
		paramObject.mailingType = reportType;
		paramObject.breakDownBy = [];
		$.each(breakdowns,function(i,item){paramObject.breakDownBy.push(item.value);});
		paramObject.pivotColumn = pivotOption[sectionName] ? pivotOption[sectionName].value : "" ;

		//should not sent 0 to the server
		if(paramObject.pivotColumn == 0){
			paramObject.pivotColumn = "";
		}
		url = urlMethod ;
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			url = actions[actionName]["mockUrl"];
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,isNewRequest,paramObject,requestId);
	}

	smr.savePivotReport = function(name,reportSection,metrics,mailingType,breakDownBy,pivotColumn,reportId,runOnce,recurring,runOnceFrequency,runOnceStartTime,recurrenceFrequency,recurrenceInterval,recurrencePeriod,daysOfWeek,sendEmail,recipients,message,dateRange,recurrenceStartTime,recurrenceEndOption,recurrenceEndDate,maxOccurrences,recurrenceDays,recurrenceOrdinal,recurrenceOrdinalPeriod){
		var url;
		// ------ Build Real URL ------ //
		var urlMethod = smr.reportPathPrefix +"mailing/omni/saveReport.do?";
		//in the server side a special token for security purposes
		if(!smr.isMock()){
			urlMethod+="tmqz="+dojo.byId("tmqzId").value;
		}
		var reportTypeVal = "batch";
		if(mailingType == smr.REPORT_TYPE.TRANSACTIONAL){
			reportTypeVal = "tx";
		}else if(mailingType == smr.REPORT_TYPE.PROGRAM){
			reportTypeVal = "lcm";
		}
		//dateRange should be sent without space
		if(typeof dateRange != "undefined" && dateRange != null){
			dateRange = dateRange.replace(/\s/g, "");
			if(dateRange == "Incustomdaterange"){
				dateRange = "Custom";
			}
		}

		var paramObject = {
			name:name,
			reportSection:reportSection,
			metrics:metrics,
			breakDownBy:breakDownBy,
			reportType:reportTypeVal,
			pivotColumn: (pivotColumn == 0 ? "" : pivotColumn),
			reportId:reportId,
			runOnce: runOnce,
			recurring: recurring,
			runOnceFrequency:runOnceFrequency,
			runOnceStartTime: runOnceStartTime,
			recurrenceFrequency: recurrenceFrequency,
			recurrenceInterval: recurrenceInterval,
			recurrencePeriod: recurrencePeriod,
			recurrenceStartTime: recurrenceStartTime,
			recurrenceEndOption: recurrenceEndOption,
			recurrenceEndDate: recurrenceEndDate,
			maxOccurrences: maxOccurrences,
			recurrenceDays:recurrenceDays,
			recurrenceOrdinal:recurrenceOrdinal,
			recurrenceOrdinalPeriod:recurrenceOrdinalPeriod,
			daysOfWeek: daysOfWeek,
			sendEmail: sendEmail,
			recipients: recipients,
			dateRange: dateRange,
			message: message
		};
		
		var setAndType = smr.getSetAndType(mailingType,"main",true);
		var set = setAndType.set;
		var includeSubOrg = set.attr("includeSubOrg");
		var period = set.period();
		var limit = set.attr("limit");
		var dateRange = period.getDateRange();

		paramObject.includeSubOrg = includeSubOrg ? true : false;

		var includeArchive = set.attr("includeArchive");
		paramObject.includeArchived = includeArchive ? true : false;

		if(period.dateType == "inCustomDateRange"){
			paramObject.selectionType = "Date";
		}else{
			paramObject.selectionType = setAndType.type;
		}
		
		if(setAndType.type == "Mailing" && set.attr("selectByLaunchDate")){
			paramObject.selectionType = "Date";
		}
		
		var ids = set.list();
		if(ids.length > 0){
			var selectionIds = [];
			for(var i = 0; i < ids.length; i++){
				selectionIds.push(ids[i].id);
			}
			paramObject.selectionIds = selectionIds;
		}

		if(limit){
			if(dateRange.startDate){
				paramObject.startDate = smr.formatDate(dateRange.startDate);
			}
			if(dateRange.endDate){
				paramObject.endDate = smr.formatDate(dateRange.endDate);
			}
		}

		//add the isAllSelected for pivot request, now rename the isAllSelected to allMailingSelected
		if(typeof set.attr("isAllSelected") == "undefined"){
			paramObject.allMailingSelected = true;
		}else{
			paramObject.allMailingSelected = set.attr("isAllSelected");
		}

		url = urlMethod ;
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			url = "data/getSavePivotReport.jso";
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,true,paramObject);
	}

	smr.getPivotBreakdowns = function(reportType, breakdowns){
		var url;
		// ------ Build Real URL ------ //
		var urlMethod = smr.reportPathPrefix +"mailing/omni/getBreakdowns.do?";
		var paramObject = {breakDownBy: breakdowns};

		var set = smr.getSetAndType(reportType,"main",true).set;
		var includeSubOrg = set.attr("includeSubOrg");
		paramObject.includeSubOrg = includeSubOrg ? true : false;

		url = urlMethod ;
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			url = "data/getPivotBreakdowns.jso";
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,true,paramObject);
	}

	smr.listPivotReport = function(reportSection,mailingType,reportId){
		var url;
		// ------ Build Real URL ------ //
		var urlMethod = smr.reportPathPrefix +"mailing/omni/getReport.do?";
		var reportTypeVal = "batch";
		if(mailingType == smr.REPORT_TYPE.TRANSACTIONAL){
			reportTypeVal = "tx";
		}else if(mailingType == smr.REPORT_TYPE.PROGRAM){
			reportTypeVal = "lcm";
		}
		var paramObject = {reportSection:reportSection, reportType:reportTypeVal};
		if(reportId && reportId!=""){
			paramObject.reportId = reportId;
		}
		url = urlMethod ;
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			url = "data/getListPivotReport.jso";
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,true,paramObject);
	}

	smr.deletePivotReport = function(reportId){
		var url;
		// ------ Build Real URL ------ //
		var urlMethod = smr.reportPathPrefix +"mailing/omni/deleteReport.do?";
		//in the server side a special token for security purposes
		if(!smr.isMock()){
			urlMethod+="tmqz="+dojo.byId("tmqzId").value;
		}

		var paramObject = {reportId:reportId};
		url = urlMethod ;
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			url = "data/getDeletePivotReport.jso";
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,true,paramObject);
	}

	smr.getPivotSubMenus = function(reportType,options,catalogId,isNewRequest){
		// ------ Build Real URL ------ //
		var url = smr.reportPathPrefix +"mailing/omni/getPivotSubMenus.do?";

		var paramObject = {mailingIds:[],programIds:[],campaignIds:[],tagValueIds:[]};
		var mainIds = smr.getMailingSet(reportType,"main",true).list();
		for(var i=0;i<mainIds.length;i++){
			paramObject.mailingIds.push( mainIds[i].id);
		}

		var campaigns = smr.getCampaignSet(reportType,"main",true).list();
		for(var i = 0; i < campaigns.length; i++){
			paramObject.campaignIds.push(campaigns[i].id);
		}

		if(reportType == smr.REPORT_TYPE.PROGRAM){
			var programs = smr.getProgramSet(reportType,"main",true).list();
			for(var i = 0; i < programs.length; i++){
				paramObject.programIds.push(programs[i].id);
			}
		}

		var tags = smr.getTagSet(reportType,"main",true).list();
		for(var i = 0; i < tags.length; i++){
			paramObject.tagValueIds.push(tags[i].id);
		}

		var set = smr.getSetAndType(reportType,"main",true).set;
		var dateRange = set.period().getDateRange();
		var limit = set.attr("limit");
		if(limit){
			if(dateRange.startDate){
				paramObject.startDate = smr.formatDate(dateRange.startDate);
			}
			if(dateRange.endDate){
				paramObject.endDate = smr.formatDate(dateRange.endDate);
			}
		}

		var includeArchive = set.attr("includeArchive");
		paramObject.includeArchived = includeArchive ? true : false;

		var includeSubOrg = set.attr("includeSubOrg");
		paramObject.includeSubOrg = includeSubOrg ? true :false;

		paramObject.menuType = options;
		paramObject.mailingType = reportType;
		if(catalogId != ""){
			paramObject.catalogId = catalogId;
		}
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			var menuTypes ={"segment":"Segment","catalog":"Catalog","tag":"Tag","catalogField":"CatalogField" };
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			url = "data/getBigDataPivotSubMenus"+menuTypes[options]+".jso";
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,isNewRequest,paramObject);
	}

	smr.getUserInsightSummary = function(dataType,isNewRequest){
		var url;
		var reportType = smr.REPORT_TYPE.USERINSIGHT;
		var paramData = {};
		// ------ Build Real URL ------ //
		var urlMethod = "";
		if(dataType == "common"){
			urlMethod = smr.reportPathPrefix +"mailing/omni/userInsight/getOverview.do?";
		// hide this for now, revert to one request
			//urlMethod = smr.reportPathPrefix +"mailing/omni/userInsight/getOverviewSummary.do?";
		//}else if(dataType == "segmentation"){
			//urlMethod = smr.reportPathPrefix +"mailing/omni/userInsight/getOverviewSegmentation.do?";
		}else if(dataType == "programs"){
			urlMethod = smr.reportPathPrefix +"mailing/omni/userInsight/getPrograms.do?";
		}else{
			urlMethod = smr.reportPathPrefix +"mailing/omni/userInsight/getMails.do?";
		}

		var set = smr.getSetAndType(reportType,"main").set;
		var list = set.list();
		var curNum = set.attr("UserInsightShowIndex") || 1;
		var item = list[curNum-1];
		if(item){
			paramData.audienceId = item.id;
		}

		if(dataType == "common" || dataType == "segmentation"){
			var overviewSelectedOptions = set.attr("overviewSelected") || smr.defaultUserInsightOptions;
			var segmentIds = [];
			$.each(overviewSelectedOptions,function(i,temp){segmentIds.push(temp.id);});
			paramData.segmentIds = segmentIds;
		}

		var dateRange = set.period().getDateRange();
		if(dateRange.startDate){
			paramData.startDate = smr.formatDate(dateRange.startDate);
		}
		if(dateRange.endDate){
			paramData.endDate = smr.formatDate(dateRange.endDate);
		}

		url = urlMethod ;
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			if(dataType == "common"){
				url = "data/getUserInsight.jso";
			}else if(dataType == "segmentation"){
				url = "data/getUserInsightSegmentation.jso";
			}else if(dataType == "programs"){
				url = "data/getUserInsightPrograms.jso";
			}else{
				url = "data/getUserInsightEmails.jso";
			}
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,isNewRequest,paramData);
	}

	smr.getUserInsightSegments = function(dataType,isNewRequest){
		var url = smr.reportPathPrefix +"mailing/omni/userInsight/getSegments.do";
		var reportType = smr.REPORT_TYPE.USERINSIGHT;
		var paramData = {};

		// ------ Build Real URL ------ //
		var dateRange = smr.getSetAndType(reportType,"main").set.period().getDateRange();
		if(dateRange.startDate){
			paramData.startDate = smr.formatDate(dateRange.startDate);
		}
		if(dateRange.endDate){
			paramData.endDate = smr.formatDate(dateRange.endDate);
		}
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			url = "data/getUserInsightSegments.jso";
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,isNewRequest,paramData);
	}

	smr.getMailContent = function(mailingId, type){
		var url = smr.reportPathPrefix +"mailing/omni/userInsight/getMailContent.do";
		var reportType = smr.REPORT_TYPE.USERINSIGHT;
		var paramData = {};

		// ------ Build Real URL ------ //
		var set = smr.getSetAndType(reportType,"main").set;

		var list = set.list();
		var curNum = set.attr("UserInsightShowIndex") || 1;
		var item = list[curNum-1];
		if(item){
			paramData.audienceId = item.id;
		}
		if(mailingId){
			paramData.mailingId = mailingId;
		}

		var mailingType = "";
		if(type == "Batch"){
			mailingType = "batch";
		}else if(type == "Transactional"){
			mailingType = "transactional";
		}else if(type == "LCM"){
			mailingType = "program";
		}
		paramData.mailingType = mailingType;
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			url = "data/getMailContent.jso";
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		var result = {"items":[]};
		var innerDfd = $.Deferred();
		jQuery.ajax({ 
			type: "post",  url: url,  dataType: "html", traditional:true,  data:paramData
        }).success(function(data){
        	result.items.push({"data":data});
        	innerDfd.resolve(result);
        }).fail(function(jxhr,arg2){
        	result.items.push({"data":"<div>There is error for the request!</div>"})
        	innerDfd.resolve(result);
        });
		return innerDfd.promise();
	}


	smr.SaveSummaryReport = function(reportType, reportId, name){
		var url;
		// ------ Build Real URL ------ //
		var urlMethod = smr.reportPathPrefix +"saveReport.do?";

		var reportTypeVal = "Batch";
		if(reportType == smr.REPORT_TYPE.TRANSACTIONAL){
			reportTypeVal = "Tx";
		}else if(reportType == smr.REPORT_TYPE.PROGRAM){
			reportTypeVal = "Lcm";
		}
		var paramObject = {
			name:name,
			reportType:reportTypeVal,
			reportId:reportId
		};

		var set = smr.getSetAndType(reportType).set;
		var mailingType = set.type;
		paramObject.selectionType = mailingType.substring(0,1).toUpperCase() + mailingType.substring(1,mailingType.length);
		if(set.attr("selectByLaunchDate")){
			paramObject.selectionType = "Date";
		}
		paramObject.mailingType = reportType.toLowerCase();

		var itemList = set.list();
		paramObject.selectionIds = [];
		for(var i=0; i<itemList.length; i++){
			paramObject.selectionIds.push( itemList[i].id);
		}

		var dateRange = set.period().getDateRange();
		var limit = set.attr("limit");
		if(limit){
			if(dateRange.startDate){
				paramObject.startDate = smr.formatDate(dateRange.startDate);
			}
			if(dateRange.endDate){
				paramObject.endDate = smr.formatDate(dateRange.endDate);
			}
		}

		//add the dateRange when save
		var selectByLaunchDate = "last30Days";
		if((mailingType == "Mailing" || mailingType == "mailing") && !set.attr("selectByLaunchDate")){
			if(reportType == smr.REPORT_TYPE.TRANSACTIONAL){
				selectByLaunchDate = set.period().dateType;
			}else{
				var pivotOption = set.attr("pivotOption") || [];
				selectByLaunchDate = typeof pivotOption.launchDate != "undefined" ? pivotOption.launchDate : selectByLaunchDate;
			}
		}else if(typeof set.period() != "undefined" && set.period() != null){
			selectByLaunchDate = set.period().dateType;
		}
		var dateRange = replaceReg(selectByLaunchDate.toLowerCase());
		if(dateRange == "Incustomdaterange") dateRange = "Custom";
		paramObject.dateRange = dateRange;

		var includeSubOrg = set.attr("includeSubOrg");
		paramObject.includeSubOrg = includeSubOrg ? true : false;

		var includeArchive = set.attr("includeArchive");
		paramObject.includeArchived = includeArchive ? true : false;

		if(!smr.isMock()){
			urlMethod += "tmqz=" + dojo.byId("tmqzId").value;
		}

		url = urlMethod ;
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			url = "data/getSummaryReportSave.jso";
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,true,paramObject);
	}

	function replaceReg(str){
		var reg = /\b(\w)|\s(\w)/g;
		return str.replace(reg,function(m){return m.toUpperCase()})
	}

	smr.listSummaryReport = function(reportType,reportId){
		var url;
		// ------ Build Real URL ------ //
		var urlMethod = smr.reportPathPrefix +"getReport.do?";
		var reportTypeVal = "Batch";
		if(reportType == smr.REPORT_TYPE.TRANSACTIONAL){
			reportTypeVal = "Tx";
		}else if(reportType == smr.REPORT_TYPE.PROGRAM){
			reportTypeVal = "Lcm";
		}
		var paramObject = {reportType:reportTypeVal};
		if(reportId && reportId!=""){
			paramObject.reportId = reportId;
		}

		if(!smr.isMock()){
			urlMethod += "tmqz=" + dojo.byId("tmqzId").value;
		}

		url = urlMethod ;
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			url = "data/getSummaryReportList.jso";
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,true,paramObject);
	}

	smr.deleteSummaryReport = function(reportId){
		var url;
		// ------ Build Real URL ------ //
		var urlMethod = smr.reportPathPrefix +"deleteReport.do?";

		var paramObject = {reportId:reportId};

		if(!smr.isMock()){
			urlMethod += "tmqz=" + dojo.byId("tmqzId").value;
		}

		url = urlMethod ;
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			url = "data/getSummaryReportDelete.jso";
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,true,paramObject);
	}

	smr.saveSchedule = function(reportId,includePdf,includeCsv,subject,message,frequency,dayOfWeek,dayOfMonth,sendTime,recipients,duration){
		var url;
		// ------ Build Real URL ------ //
		var urlMethod = smr.reportPathPrefix +"saveSchedule.do?";

		var paramObject = {
			reportId:reportId,
			includePdf:includePdf,
			includeCsv:includeCsv,
			subject:subject,
			message:message,
			frequency:frequency,
			dayOfWeek: dayOfWeek,
			dayOfMonth:dayOfMonth,
			sendTime:sendTime,
			recipients:recipients,
			duration :duration
		};

		if(!smr.isMock()){
			urlMethod += "tmqz=" + dojo.byId("tmqzId").value;
		}

		url = urlMethod ;
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			url = "data/getScheduleSave.jso";
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,true,paramObject);
	}


	smr.deleteSchedule = function(reportId){
		var url;
		// ------ Build Real URL ------ //
		var urlMethod = smr.reportPathPrefix +"deleteSchedule.do?";

		var paramObject = {reportId:reportId};

		if(!smr.isMock()){
			urlMethod += "tmqz=" + dojo.byId("tmqzId").value;
		}

		url = urlMethod ;
		// ------ Build Real URL ------ //

		// ------ If mock, then, change the URL to be the mock static file ------ //
		if(smr.isMock()){
			console.log("SMR DEBUG: Mock mode ON: do not call url: " + url);
			url = "data/getScheduleDelete.jso";
		}
		// ------ /If mock, then, change the URL to be the mock static file ------ //
		return smr.getJsonData(url,true,paramObject);
	}

	/**
	 * Open a new windown to down load the excel
	 *
	 * @param reportType
	 * @param breakDownBy
	 * @param reportSections
	 * @param subTotalBy
	 */
	smr.getReportAsExcel = function(reportType,breakDownBy,reportSections,subTotalBy){
		var url = "";
		if(reportType == smr.REPORT_TYPE.DELIVERABILITY){
			url = smr.reportPathPrefix + "mailing/getDeliverabilityReportAsExcel.do?";
			var newWindow = window.open("", "_blank");
			if (!newWindow) return false;

			var html = "";
			html += "<html><head></head><body><form id='formid' method='post' action='" + url + "'>";

			var setType = smr.getSetAndType(reportType,"main");
			//build the ip or vsg
			var mainIds = setType.set.list();
			var idstypes = (setType.type=="VSG" ? "vsg" : "ip");
			for(var i = 0; i < mainIds.length; i++){
				html += "<input type='hidden' name='" + idstypes + "' value='" + mainIds[i].id + "'/>";
			}

			var dateRange = setType.set.period().getDateRange();
			if(dateRange.startDate){
				html += "<input type='hidden' name='startDate' value='" + smr.formatDate(dateRange.startDate) + "'/>";
			}
			if(dateRange.endDate){
				html += "<input type='hidden' name='endDate' value='" + smr.formatDate(dateRange.endDate) + "'/>";
			}

			if (breakDownBy){
				html += "<input type='hidden' name='breakDownBy' value='" + breakDownBy + "'/>";
			}

			if (subTotalBy){
				html += "<input type='hidden' name='subTotalBy' value='" + subTotalBy + "'/>";
			}

			if (reportSections){
				for(var i = 0; i < reportSections.length; i++){
					html += "<input type='hidden' name='reportSections' value='" + reportSections[i] + "'/>";
				}
			}
			var includeSubOrg = setType.set.attr("includeSubOrg");
			if(includeSubOrg){
				html += "<input type='hidden' name='includeSubOrg' value='true'/>";
			}else{
				html += "<input type='hidden' name='includeSubOrg' value='false'/>";
			}

			html += "</form><script type='text/javascript'>document.getElementById(\"formid\").submit()</script></body></html>";
			newWindow.document.write(html);
			return newWindow;

		}else{
			url = smr.reportPathPrefix + "mailing/getMailingSummaryReportAsExcel.do?";
			if(reportType==smr.REPORT_TYPE.AUDIENCE){
				url = smr.reportPathPrefix + "audience/getAudienceReportAsExcel.do?"
			}

			var newWindow = window.open("", "_blank");
			if (!newWindow) return false;

			var html = "";
			html += "<html><head></head><body><form id='formid' method='post' action='" + url + "'>";
			html += "<input type='hidden' name='mailingType' value='" + reportType + "'/>";

			if (breakDownBy){
				html += "<input type='hidden' name='breakDownBy' value='" + breakDownBy + "'/>";
			}

			if (subTotalBy){
				html += "<input type='hidden' name='subTotalBy' value='" + subTotalBy + "'/>";
			}

			if (reportSections){
				for(var i = 0; i < reportSections.length; i++){
					html += "<input type='hidden' name='reportSections' value='" + reportSections[i] + "'/>";
				}
			}

			var startDate="",endDate="";
			var set = smr.getSetAndType(reportType,"main").set;
			var dateRange = set.period().getDateRange();
			var limit = set.attr("limit");
			var mailingIds = set.list();
			for(var i = 0; i < mailingIds.length; i++){
				if(set.type == "mailing"){
					html += "<input type='hidden' name='mailingIds' value='" + mailingIds[i].id + "'/>";
				}
				if(set.type == "program"){
					html += "<input type='hidden' name='programIds' value='" + mailingIds[i].id + "'/>";
				}
				if(set.type == "campaign"){
					html += "<input type='hidden' name='campaignIds' value='" + mailingIds[i].id + "'/>";
				} 
				if(set.type == "target"){
					html += "<input type='hidden' name='targetId' value='" + mailingIds[i].id + "'/>";
				}
				if(reportType != smr.REPORT_TYPE.AUDIENCE){
					if(set.type == "tag"){
						html += "<input type='hidden' name='tagValueIds' value='" + mailingIds[i].id + "'/>";
					}
				}
			}
			if(limit){
				if(dateRange.startDate){
					html += "<input type='hidden' name='startDate' value='" + smr.formatDate(dateRange.startDate) + "'/>";
				}
				if(dateRange.endDate){
					html += "<input type='hidden' name='endDate' value='" + smr.formatDate(dateRange.endDate) + "'/>";
				}
			}

			if(reportType!=smr.REPORT_TYPE.AUDIENCE){
				var includeArchive = set.attr("includeArchive");
				if(includeArchive){
					html += "<input type='hidden' name='includeArchived' value='true'/>";
				}else{
					html += "<input type='hidden' name='includeArchived' value='false'/>";
				}

				var includeSubOrg = set.attr("includeSubOrg");
				if(includeSubOrg){
					html += "<input type='hidden' name='includeSubOrg' value='true'/>";
				}else{
					html += "<input type='hidden' name='includeSubOrg' value='false'/>";
				}
			}

			html += "</form><script type='text/javascript'>document.getElementById(\"formid\").submit()</script></body></html>";
			newWindow.document.write(html);
			return newWindow;
		}
	}

	smr.getReportAsExcelForPivot = function($evnetObject,reportType, setcionName, metricVal, reportName){
		var sections = {
				"sectionOverview"     :{"section":"overview"},
				"sectionVolume"       :{"section":"volume"},
				"sectionEngagement"   :{"section":"engagement"},
				"sectionDisEngagement":{"section":"disengagement"},
				"sectionConversions"  :{"section":"conversions"},
				"sectionFailures"     :{"section":"failures"}
		}
		var url = smr.reportPathPrefix + "mailing/omni/getExcel.do?";
		var newWindow = window.open("", "_blank");
		if (!newWindow) return false;

		var html = "";
		html += "<html><head></head><body><form id='formid' method='post' action='" + url + "'>";
		html += "<input type='hidden' name='mailingType' value='" + reportType + "'/>";

		var startDate="",endDate="";
		var set = smr.getSetAndType(reportType,"main",true).set;
		var mailingIds = set.list();
		for(var i = 0; i < mailingIds.length; i++){
			if(set.type == "mailing"){
				html += "<input type='hidden' name='mailingIds' value='" + mailingIds[i].id + "'/>";
			}
			if(set.type == "program"){
				html += "<input type='hidden' name='programIds' value='" + mailingIds[i].id + "'/>";
			}
			if(set.type == "campaign"){
				html += "<input type='hidden' name='campaignIds' value='" + mailingIds[i].id + "'/>";
			}
			if(set.type == "tag"){
				html += "<input type='hidden' name='tagValueIds' value='" + mailingIds[i].id + "'/>";
			}
		}

		var limit = set.attr("limit");
		var dateRange = set.period().getDateRange();
		if(limit){
			if(dateRange.startDate){
				html += "<input type='hidden' name='startDate' value='" + smr.formatDate(dateRange.startDate) + "'/>";
			}
			if(dateRange.endDate){
				html += "<input type='hidden' name='endDate' value='" + smr.formatDate(dateRange.endDate) + "'/>";
			}
		}

		var includeArchive = set.attr("includeArchive");
		if(includeArchive){
			html += "<input type='hidden' name='includeArchived' value='true'/>";
		}else{
			html += "<input type='hidden' name='includeArchived' value='false'/>";
		}

		var includeSubOrg = set.attr("includeSubOrg");
		if(includeSubOrg){
			html += "<input type='hidden' name='includeSubOrg' value='true'/>";
		}else{
			html += "<input type='hidden' name='includeSubOrg' value='false'/>";
		}

		var pivotOption = set.attr("pivotOption");
		var reportSection = sections[setcionName]["section"];
		var columnsAll  = pivotOption.columns;
		var columns = columnsAll[reportSection] ? columnsAll[reportSection] : null;

		html += "<input type='hidden' name='reportSection' value='" + reportSection + "'/>";

		var breakdowns = pivotOption[reportSection+"-breakdown"] || [{name:"Mailing",value:"mailing"}];
		if (breakdowns){
			for(var i = 0; i < breakdowns.length; i++){
				html += "<input type='hidden' name='breakDownBy' value='" + breakdowns[i].value + "'/>";
			}
		}

		var $pivotSegmentTableSortTh = $evnetObject.closest(".report").find(".pivotTable .pivotDataPart .pivotSegmentTable th[data-order]");
		if($pivotSegmentTableSortTh.size()>0){
			html += "<input type='hidden' name='vSortColumn' value='" + $pivotSegmentTableSortTh.data("data-column") + "'/>";
			html += "<input type='hidden' name='vSortOrder' value='" + $pivotSegmentTableSortTh.attr("data-order").toLowerCase() + "'/>";
			html += "<input type='hidden' name='vSortColumnIdx' value='" + $pivotSegmentTableSortTh.index() + "'/>";
		}

		var $pivotDataTableSortTh = $evnetObject.closest(".report").find(".pivotTable .pivotDataPart .pivotDataTable th[data-order]");
		if($pivotDataTableSortTh.size()>0){
			var columnLabel = $pivotDataTableSortTh.data("data-column");
			var segmentTableSortThLength = $evnetObject.closest(".report").find(".pivotTable .pivotDataPart .pivotSegmentTable th").size();
			html += "<input type='hidden' name='vSortColumn' value='" + columnLabel + "'/>";
			html += "<input type='hidden' name='vSortOrder' value='" + $pivotDataTableSortTh.attr("data-order").toLowerCase() + "'/>";
			html += "<input type='hidden' name='vSortColumnIdx' value='" + (segmentTableSortThLength + brite.array.getIndex(columns,"label",columnLabel)) + "'/>";
		}

		var pivotByValue = pivotOption[reportSection] ? pivotOption[reportSection].value : "0" ;
		if(pivotByValue != "0" ){
			var datebase = {"day":"date","week":"date","month":"date","quarter":"date","year":"date"};
			var columnSortType  = datebase[pivotByValue] || "name";
			if(pivotByValue=="mailing"){
				columnSortType = pivotOption.sortBy =="Date" ? "launchDate" : "name";
			}
			html += "<input type='hidden' name='columnSortType'  value='" + columnSortType + "'/>";
			html += "<input type='hidden' name='columnSortOrder' value='" + (pivotOption.sortOrder=="Ascending" ? "left2right": "right2left") + "'/>";
		}

		var pivotColumn = pivotOption[reportSection] ? pivotOption[reportSection].value : "" ;
		if(pivotColumn == 0)pivotColumn = "";
		html += "<input type='hidden' name='pivotColumn' value='" + pivotColumn + "'/>";

		if(typeof metricVal != "undefined" && metricVal != null && metricVal != ""  && metricVal != 0){
			html += "<input type='hidden' name='metrics' value='" + metricVal + "'/>";
		}

		//pass the columns selected in the options menu of pivot view

		if (columns){
			for(var i = 0; i < columns.length; i++){
				html += "<input type='hidden' name='columnNames' value='" + columns[i].label + "'/>";
			}
		}

		//pass name of the saved report currently being displayed
		if(typeof reportName != "undefined" && reportName != "New"){
			html += "<input type='hidden' name='reportName' value='" + reportName + "'/>";
		}

		//only overview and failure section have viewRate
		if(setcionName == "sectionOverview" || setcionName == "sectionFailures"){
			var viewRates = pivotOption.viewRate;
			if(viewRates){
				html += "<input type='hidden' name='viewRates' value='true'/>";
			}else{
				html += "<input type='hidden' name='viewRates' value='false'/>";
			}
		}

		//only engagement section have showUnique
		if(setcionName == "sectionEngagement"){
			var showUnique = pivotOption.uniqueStats;
			if(showUnique){
				html += "<input type='hidden' name='showUnique' value='true'/>";
			}else{
				html += "<input type='hidden' name='showUnique' value='false'/>";
			}
		}

		if(typeof set.attr("isAllSelected") == "undefined"){
			html += "<input type='hidden' name='allMailingSelected' value='true'/>";
		}else{
			var isAllSelected = set.attr("isAllSelected");
			html += "<input type='hidden' name='allMailingSelected' value='"+ isAllSelected +"'/>";
		}

		html += "</form><script type='text/javascript'>document.getElementById(\"formid\").submit()</script></body></html>";
		newWindow.document.write(html);
		return newWindow;
	}


	smr.getReportAsExcelOrCsvForPivot = function($eventObject, reportType, reportId, versionId, reportSection, viewRates,showUnique, type, includeAllColumns){
		var url = "";
		if(type == "excel"){
			url = smr.reportPathPrefix + "mailing/omni/getExcel.do?";
		}else{
			url = smr.reportPathPrefix + "mailing/omni/getCsv.do?";
		}
		var newWindow = window.open("", "_blank");
		if (!newWindow) return false;

		var html = "";
		html += "<html><head></head><body><form id='formid' method='post' action='" + url + "'>";

		var set = smr.getSetAndType(reportType,"main",true).set;
		var pivotOption = set.attr("pivotOption");
		var columnsAll  = pivotOption.columns;
		var columns = columnsAll[reportSection] ? columnsAll[reportSection] : null;

		html += "<input type='hidden' name='reportId' value='" + reportId + "'/>";

		html += "<input type='hidden' name='versionId' value='" + versionId + "'/>";

		//only overview and failure section have viewRate
		if(reportSection == "overview" || reportSection == "failures"){
			if(viewRates){
				html += "<input type='hidden' name='viewRates' value='true'/>";
			}else{
				html += "<input type='hidden' name='viewRates' value='false'/>";
			}
		}

		//only engagement section have showUnique
		if(reportSection == "engagement"){
			if(showUnique){
				html += "<input type='hidden' name='showUnique' value='true'/>";
			}else{
				html += "<input type='hidden' name='showUnique' value='false'/>";
			}
		}

		var $pivotSegmentTableSortTh = $eventObject.closest(".report").find(".sectionInteractionStore-PivotTable .pivotDataPart .pivotSegmentTable th[data-order]");
		if($pivotSegmentTableSortTh.size()>0){
			html += "<input type='hidden' name='vSortColumn' value='" + $pivotSegmentTableSortTh.data("data-column") + "'/>";
			html += "<input type='hidden' name='vSortOrder' value='" + $pivotSegmentTableSortTh.attr("data-order").toLowerCase() + "'/>";
			html += "<input type='hidden' name='vSortColumnIdx' value='" + $pivotSegmentTableSortTh.index() + "'/>";
		}

		var $pivotDataTableSortTh = $eventObject.closest(".report").find(".sectionInteractionStore-PivotTable .pivotDataPart .pivotDataTable th[data-order]");
		if($pivotDataTableSortTh.size()>0){
			var columnLabel = $pivotDataTableSortTh.data("data-column");
			var segmentTableSortThLength = $eventObject.closest(".report").find(".sectionInteractionStore-PivotTable .pivotDataPart .pivotSegmentTable th").size();
			html += "<input type='hidden' name='vSortColumn' value='" + columnLabel + "'/>";
			html += "<input type='hidden' name='vSortOrder' value='" + $pivotDataTableSortTh.attr("data-order").toLowerCase() + "'/>";
			html += "<input type='hidden' name='vSortColumnIdx' value='" + (segmentTableSortThLength + brite.array.getIndex(columns,"label",columnLabel)) + "'/>";
		}

		var pivotByValue = pivotOption[reportSection] ? pivotOption[reportSection].value : "0" ;
		if(pivotByValue != "0" && pivotByValue != "" ){
			var datebase = {"day":"date","week":"date","month":"date","quarter":"date","year":"date"};
			var columnSortType  = datebase[pivotByValue] || "name";
			if(pivotByValue=="mailing"){
				columnSortType = pivotOption.sortBy =="Date" ? "launchDate" : "name";
			}
			html += "<input type='hidden' name='columnSortType'  value='" + columnSortType + "'/>";
			html += "<input type='hidden' name='columnSortOrder' value='" + (pivotOption.sortOrder=="Ascending" ? "left2right": "right2left") + "'/>";
		}

		//pass the columns selected in the options menu of pivot view
		if (columns){
			for(var i = 0; i < columns.length; i++){
				html += "<input type='hidden' name='columnNames' value='" + columns[i].label + "'/>";
			}
		}
		
		//when statusData is large_data
		if(includeAllColumns){
			html += "<input type='hidden' name='includeAllColumns'  value='true'/>";
		}
		
		html += "</form><script type='text/javascript'>document.getElementById(\"formid\").submit()</script></body></html>";
		newWindow.document.write(html);
		return newWindow;
	}

	smr.sortMetrics = function(arr){
		if(smr.isChrome || smr.isFirefox){
			return arr.sort(function(a,b){
				var aName,bName;
				// test two types of arr, one is ['sent',...],another is [{label:"label":name:"sent"},...]
				if(typeof a == "string"){
					aName = a;
				}else{
					aName = a.name;
				}
				if(typeof b == "string"){
					bName = b;
				}else{
					bName = b.name;
				}
				var aIndex = smr.metricOrders.indexOf(aName.toLowerCase());
				var bIndex = smr.metricOrders.indexOf(bName.toLowerCase());

				if(aIndex == -1 && bIndex == -1){
					return -1;
				}else if(aIndex == -1 || bIndex == -1){
					if(aIndex == -1){
						return 1;
					}else{
						return -1;
					}
				}
				return  aIndex - bIndex;
			});
		}else{
			return arr.sort(function(a,b){
				var aName,bName;
				// test two types of arr, one is ['sent',...],another is [{label:"label":name:"sent"},...]
				if(typeof a == "string"){
					aName = a;
				}else{
					aName = a.name;
				}
				if(typeof b == "string"){
					bName = b;
				}else{
					bName = b.name;
				}
				var aIndex = smr.metricOrders.indexOf(aName.toLowerCase());
				var bIndex = smr.metricOrders.indexOf(bName.toLowerCase());
				if(aIndex == -1 || bIndex == -1){
					if(aIndex == -1){
						return 1;
					}else{
						return -1;
					}
				}
				return  aIndex - bIndex;
			});
		}
	}

	// check whether we have the breakdownby value
	smr.checkIsHaveBreakdownValue = function(reportType,val){
		var isHave = false;
		if(reportType == smr.REPORT_TYPE.BATCH){
			//batch did not have program
			if(val == "program"){
				isHave = true;
				alert("Breakdown by [" + val + "] not implemented yet");
			}
		}else if(reportType == smr.REPORT_TYPE.TRANSACTIONAL){
			//transactional did not have target and program
			if(val == "target" || val == "program"){
				isHave = true;
				alert("Breakdown by [" + val + "] not supported yet");
			}
		}else if(reportType == smr.REPORT_TYPE.PROGRAM){
			//lifecycle did not have target
			if(val == "target"){
				isHave = true;
				alert("Breakdown by [" + val + "] not supported yet");
			}
		}
		return isHave;
	}

	// when did not have breakdownby value ,go back to the previous one
	smr.goBackPreBreakdownValue = function($comThis,breakDownType){
		var $combobox = $comThis.find(".combobox");
		$combobox.attr("data-value",breakDownType);
		var $aItem = $combobox.find('.combobox-list a[data-value="'+breakDownType+'"]');
		$combobox.find(".combobox-button label").text($aItem.text());
		$comThis.find(".combobox-list .item").removeClass('selected').removeClass('default');
		$aItem.addClass('default').addClass('selected');
	}

	smr.addTableColumn = function(tableDataInfo,breakDownType,isDomianDrilldown){
		var set = smr.getSetAndType(tableDataInfo.reportType).set;
		if(breakDownType == "mailing"){
			tableDataInfo.tableColumns.push({name:"Date",label:"Mailing",isDate:true,isMockDateVal:true,isAlignLeft:true,hasOrgTitle:set.attr("includeSubOrg")});
			tableDataInfo.tableColumns.push({name:"Date",label:"Subject",isDate:true,isMockDateVal:true,isAlignLeft:true});
		}else if(breakDownType == "target"){
			tableDataInfo.tableColumns.push({name:"Date",label:"Target",isDate:true,isMockDateVal:true,isAlignLeft:true,hasOrgTitle:set.attr("includeSubOrg")});
		}else if(breakDownType == "campaign"){
			tableDataInfo.tableColumns.push({name:"Date",label:"Campaign",isDate:true,isMockDateVal:true,isAlignLeft:true});
		}else if(breakDownType == "domain"){
			if(isDomianDrilldown){
				tableDataInfo.tableColumns.push({name:"Date",label:"Domain",isDate:true,isMockDateVal:true,isDomianDrilldown:true,isAlignLeft:true});
			}else{
				tableDataInfo.tableColumns.push({name:"Date",label:"Domain",isDate:true,isMockDateVal:true,isAlignLeft:true});
			}
		}else if(breakDownType == "program"){
			tableDataInfo.tableColumns.push({name:"Date",label:"Program",isDate:true,isMockDateVal:true,isAlignLeft:true,hasOrgTitle:set.attr("includeSubOrg")});
		}else if(breakDownType == "ip"){
			tableDataInfo.tableColumns.push({name:"Date",label:"IP",isDate:true,isMockDateVal:true,isAlignLeft:true});
		}else if(breakDownType == "vsg"){
			tableDataInfo.tableColumns.push({name:"Date",label:"Vsg",isDate:true,isMockDateVal:true,isAlignLeft:true});
		}else if(breakDownType == "keyword"){
			tableDataInfo.tableColumns.push({name:"Date",label:"Keyword",isDate:true,isMockDateVal:true,isAlignLeft:true});
		}else if(breakDownType == "org"){
			tableDataInfo.tableColumns.push({name:"Date",label:"Organization",isDate:true,isMockDateVal:true,isAlignLeft:true,isLeftEllipse:true});
		}else if(breakDownType == "orgRollup"){
			tableDataInfo.tableColumns.push({name:"Date",label:"Organization (Rollup)",isDate:true,isMockDateVal:true,isAlignLeft:true,isLeftEllipse:true});
		}else if(breakDownType == "device"){
			tableDataInfo.tableColumns.push({name:"Date",label:"Device",isDate:true,isMockDateVal:true,isAlignLeft:true});
		}else if(breakDownType == "client"){
			//tableDataInfo.tableColumns.push({name:"Date",label:"Client",isDate:true,isMockDateVal:true,isAlignLeft:true});
		}else if(breakDownType == "browser"){
			tableDataInfo.tableColumns.push({name:"Date",label:"Web Browser",isDate:true,isMockDateVal:true,isAlignLeft:true});
		}else if(breakDownType == "engagementBucket"){
			tableDataInfo.tableColumns.push({name:"Date",label:"Engagement Segment",isDate:true,isMockDateVal:true,isAlignLeft:true});
		}else if(breakDownType == "eventType"){
			tableDataInfo.tableColumns.push({name:"Date",label:"Event Type",isDate:true,isMockDateVal:true,isAlignLeft:true});
		}else{
			tableDataInfo.tableColumns.push({name:"Date",label:"Date",isDate:true,isMockDateVal:false,isAlignLeft:true});
		}
		return tableDataInfo;
	}

	smr.addTableColumnData = function(resultDataRow,rowData,breakDownType,reportType){
		var includeSubOrg = smr.getSetAndType(reportType).set.attr("includeSubOrg");
		if(breakDownType == "mailing"){
			resultDataRow.Mailing = {value:(rowData.mailing ? rowData.mailing : "no name"),mailingId:rowData.mailingId};
			resultDataRow.Subject =  rowData.subject ? rowData.subject : "no subject";;
			if(includeSubOrg) resultDataRow.organization = rowData.organization ? rowData.organization : "no organization";
		}else if(breakDownType == "target"){
			resultDataRow.Target = rowData.target ? rowData.target : "no name";
			if(includeSubOrg) resultDataRow.organization = rowData.organization ? rowData.organization : "no organization";
		}else if(breakDownType == "campaign"){
			resultDataRow.Campaign = rowData.campaign ? rowData.campaign : "no name";
		}else if(breakDownType == "domain"){
			resultDataRow.Domain = rowData.domain ? rowData.domain : "no name";
		}else if(breakDownType == "program"){
			resultDataRow.Program = rowData.program ? rowData.program : "no name";
			if(includeSubOrg) resultDataRow.organization = rowData.organization ? rowData.organization : "no organization";
		}else if(breakDownType == "ip"){
			resultDataRow.IP = rowData.vsgIp ? rowData.vsgIp : "no name";
		}else if(breakDownType == "vsg"){
			resultDataRow.Vsg = rowData.vsg ? rowData.vsg : "no name";
		}else if(breakDownType == "keyword"){
			resultDataRow.Keyword = rowData.name ? rowData.name : "no name";
		}else if(breakDownType == "org"){
			resultDataRow.Organization = rowData.organization ? rowData.organization : "no name";
		}else if(breakDownType == "orgRollup"){
			resultDataRow["Organization (Rollup)"] = rowData.organization ? rowData.organization : "no name";
		}else if(breakDownType == "engagementBucket"){
			resultDataRow["Engagement Segment"] = rowData.engagementBucket ? rowData.engagementBucket.substring(0,1).toUpperCase()+rowData.engagementBucket.substring(1) : "no name";
		}else if(breakDownType == "device"){
			resultDataRow["Device"] = rowData.platform ? rowData.platform : "no name";
		}else if(breakDownType == "client"){
			//resultDataRow["Client"] = rowData.type ? rowData.type : "no name";
		}else if(breakDownType == "browser"){
			resultDataRow["Web Browser"] = rowData.browser ? rowData.browser : "no name";
		}else if(breakDownType == "eventType"){
			resultDataRow["Event Type"] = rowData.eventType ? rowData.eventType : "no name";
		}else{
			resultDataRow.Date = rowData.date ? rowData.date : "no date";
		}
		return resultDataRow;
	}

	smr.buildTitleValue = function(breakDownType){
		var titleVal = "";
		if(breakDownType == "org"){
			titleVal = "Organization";
		}else if(breakDownType == "orgRollup"){
			titleVal = "Organization (Rollup)";
		}else if(breakDownType == "vsg"){
			titleVal = "Mailing Server Group";
		}else if(breakDownType == "failureCode" || breakDownType == "failureDetailCode"){
			titleVal = "Failure Detail Code";
		}else if(breakDownType == "failureCategory"){
			titleVal = "Failure Category";
		}else if(breakDownType == "engagementBucket"){
			titleVal = "Engagement Segment";
		}else if(breakDownType == "client"){
			titleVal = "Mail Client";
		}else if(breakDownType == "browser"){
			titleVal = "Web Browser";
		}else if(breakDownType == "eventType"){
			titleVal = "Event Type";
		}else{
			titleVal = breakDownType.substring(0,1).toUpperCase( ) + breakDownType.substring(1);
		}
		return titleVal;
	}

	smr.buildColumnTitleValue = function(breakDownType){
		var titleVal = "";
		if(breakDownType == "org"){
			titleVal = "Organization";
		}else if(breakDownType == "orgRollup"){
			titleVal = "Organization (Rollup)";
		}else if(breakDownType == "vsg"){
			titleVal = "Mailing Server Group";
		}else if(breakDownType == "failureCode" || breakDownType == "failureDetailCode"){
			titleVal = "Failure Detail Code";
		}else if(breakDownType == "failureCategory"){
			titleVal = "Failure Category";
		}else if(breakDownType == "engagementBucket"){
			titleVal = "Engagement Segment";
		}else if(breakDownType == "client"){
			titleVal = "Mail Client";
		}else if(breakDownType == "browser"){
			titleVal = "Web Browser";
		}else if(breakDownType == "eventType"){
			titleVal = "Event Type";
		}else if(breakDownType == "day" || breakDownType == "week" || breakDownType == "month" || breakDownType == "quarter" || breakDownType == "year"){
			titleVal = "Date";
		}else{
			titleVal = breakDownType.substring(0,1).toUpperCase( ) + breakDownType.substring(1);
		}
		return titleVal;
	}

    smr.campiagnOverviewOpenTab=function(type,param){
    	var campaignOverviewset = smr.getSetAndType("campaignOverview","main").set;
    	var campiagnOverviewPeriod = campaignOverviewset.period();
    	smr.campaginOverViewMiddleDateType = campiagnOverviewPeriod.dateType;
    	smr.campaginOverViewMiddleinAchive = campaignOverviewset.attr("includeArchive");
    	sm.comp.tab.TabMgr.openTab(type,param);
    }

	smr.clearPivotViewCache = function(reportType,section){
		var set = smr.getSetAndType(reportType,"main",true).set;
		var pivotOption = set.attr("pivotOption");
		pivotOption.columns[section] = [];
		pivotOption[section] = null;
		breakdowns = [{name:"Mailing",value:"mailing"}];
		pivotOption[section+"-breakdown"] = breakdowns;
		set.attr("pivotOption",pivotOption);

		//when clean change back the value to origin value
		smr.fetchSingleMetric = smr.fetchSingleMetricOrigin;
	}

	smr.isInArray = function(arr,ele){
		if(arr==null || ele==null) return false;
		for(var i = 0;i<arr.length; i++){
			if(arr[i]==ele) return true;
		}
		return false;
	}

	smr.buildTempUrl=function(url,paramData){
		var uri = new String(url);
		for(k in paramData){
			if(paramData[k] && typeof paramData[k] =="object"){
				for(var i=0;i<paramData[k].length; i++){
					uri += "&" + k+"="+paramData[k][i];
				}
			}else{
				uri += "&" + k+"="+paramData[k];
			}
		}
		return uri;
	}

})(jQuery);