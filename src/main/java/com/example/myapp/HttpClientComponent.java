package com.example.myapp;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.CoreProtocolPNames;
import org.apache.http.util.EntityUtils;

public class HttpClientComponent {

    public String sendRequest(byte[] bs,String url) throws Exception {
        DefaultHttpClient client = new DefaultHttpClient();

        try {
            client.getParams().setParameter(CoreProtocolPNames.HTTP_CONTENT_CHARSET, "GBK");
            client.getParams().setIntParameter("http.socket.timeout", 2 * 60 * 60 * 1000);
            client.getParams().setIntParameter("http.connection.timeout", 60);

            HttpPost post = new HttpPost(url);
            post.setHeader("Content-Type", "application/json");
            ByteArrayEntity entity = new ByteArrayEntity(bs);
            entity.setContentEncoding("GBK");
            post.setEntity(entity);
            HttpResponse res = client.execute(post);
            int status = res.getStatusLine().getStatusCode();
            String result = status == 200 ? "SUCCESS" : "ERROR";
            System.out.println(status);
            //
            EntityUtils.consume(res.getEntity());
            post.abort();
            return result;
        } catch (final Exception e) {
            throw e;
        } finally {
            client.getConnectionManager().shutdown();
        }
    }
    
//    public static void main(String[] args) throws Exception {
//        new HttpClientComponent().sendRequest("{\"buildChart\":\"{series:[{data:[29.9,71.5,106.4]}]}\"}".getBytes(), "http://127.0.0.1:3003");
//    }
}
