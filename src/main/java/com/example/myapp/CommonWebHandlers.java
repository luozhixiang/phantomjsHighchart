package com.example.myapp;

import com.britesnow.snow.web.RequestContext;
import com.britesnow.snow.web.param.annotation.WebParam;
import com.britesnow.snow.web.rest.annotation.WebPost;
import com.google.inject.Inject;
import com.google.inject.Singleton;
import com.google.inject.name.Named;

//import com.strongview.phantomview.PhantomRun;

@Singleton
@SuppressWarnings({ "rawtypes", "unchecked" })
public class CommonWebHandlers {

    @Inject
    public CommonWebHandlers() {
    }

    @Inject
    @Named("myApp.phantomjsPath")
    private String     phantomjsPath;

    @Inject
    @Named("myApp.jsPath")
    private String     jsPath;

    @Inject
    @Named("myApp.ip")
    private String     ip;

    @Inject
    @Named("myApp.port")
    private String     port;

    @Inject
    @Named("myApp.outputSuffix")
    private String     outputSuffix;

    @Inject
    @Named("myApp.outputName")
    private String     outputName;

    @Inject
    @Named("myApp.visitAddress")
    private String     visitAddress;

    @Inject
    @Named("myApp.visitUri")
    private String     visitUri;

    private PhantomRun phantomRun = new PhantomRun();

    @WebPost("/exportChart")
    public WebResponse exportChart(@WebParam("type") String type, RequestContext rc) {
        String result = null;
        try {
            result = phantomRun.exportChart(phantomjsPath, jsPath + "/overview-summary-all.js", visitAddress, visitUri, outputName, type);
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalStateException("Cannot execute script " + jsPath + "/overview-summary-all.js", e);
        }
        return WebResponse.success(result);
    }

    @WebPost("/doServer")
    public WebResponse createServer(@WebParam("oper") String oper, RequestContext rc) {
        String result = null;
        try {
            if ("start".equals(oper)) {
                result = phantomRun.startPhantomjs(phantomjsPath, jsPath + "server.js", ip, port);
            } else {
                result = phantomRun.stopPhantomjs();
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalStateException("Cannot execute script " + jsPath + "server.js", e);
        }

        return WebResponse.success(result);
    }

    @WebPost("/exportChart2")
    public WebResponse exportChart2(@WebParam("type") String type, RequestContext rc) {
        String result = null;
        try {
            HttpClientComponent httpClientComponent = new HttpClientComponent();
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append("http://");
            stringBuilder.append(ip);
            stringBuilder.append(":");
            stringBuilder.append(port);
            String params = "{\"output\": [\"" + outputName
                                    + "."
                                    + outputSuffix
                                    + "\"],\"address\": [\""
                                    + visitAddress
                                    + "\"]}";
            result = httpClientComponent.sendRequest(params.getBytes(), stringBuilder.toString());
        } catch (Exception e) {
            result = "ERROR";
            e.printStackTrace();
            // throw new IllegalStateException("Cannot execute script ", e);
        }

        return WebResponse.success(result);
    }
}
