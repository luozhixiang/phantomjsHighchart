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
    private String phantomjsPath;

    @Inject
    @Named("myApp.jsPath")
    private String jsPath;

    @Inject
    @Named("myApp.ip")
    private String ip;

    @Inject
    @Named("myApp.port")
    private String port;

    @WebPost("/doServer")
    public WebResponse createServer(@WebParam("oper") String oper, RequestContext rc) {
        String result = null;
        try {
            PhantomRun phantomRun = new PhantomRun();
            // if ("start".equals(oper)) {
            result = phantomRun.startPhantomjs(phantomjsPath, jsPath + "buildPhantomjs.js", ip, port);
            // } else {
            // result = phantomRun.stopPhantomjs();
            // }
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalStateException("Cannot execute script " + jsPath + "buildPhantomjs.js", e);
        }

        return WebResponse.success(result);
    }

    @WebPost("/exportChart")
    public WebResponse exportChart(@WebParam("type") String type, RequestContext rc) {
        String result = null;
        try {
            HttpClientComponent httpClientComponent = new HttpClientComponent();
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append("http://");
            stringBuilder.append(ip);
            stringBuilder.append(":");
            stringBuilder.append(port);
            result = httpClientComponent.sendRequest("{\"buildChart\":\"{series:[{data:[29.9,71.5,106.4]}]}\"}".getBytes(), stringBuilder.toString());
        } catch (Exception e) {
            e.printStackTrace();
            throw new IllegalStateException("Cannot execute script ", e);
        }

        return WebResponse.success(result);
    }

}
