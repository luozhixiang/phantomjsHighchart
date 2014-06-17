package com.example.myapp;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

public class HttpClientComponent {

    public String sendRequest(byte[] bs, String url) throws Exception {
        CloseableHttpClient httpclient = HttpClients.createDefault();
        try {
            HttpPost post = new HttpPost(url);
            post.setHeader("Content-Type", "application/json");
            ByteArrayEntity entity = new ByteArrayEntity(bs);
            entity.setContentEncoding("GBK");
            post.setEntity(entity);
            CloseableHttpResponse response = httpclient.execute(post);
            String result = null;
            try {
                int status = response.getStatusLine().getStatusCode();
                result = status == 200 ? "SUCCESS" : "ERROR";
                System.out.println(status);
                EntityUtils.consume(response.getEntity());
            } finally {
                response.close();
            }
            return result;
        } catch (final Exception e) {
            throw e;
        } finally {
            httpclient.close();
        }
    }

//    public static void main(String[] args) throws Exception {
//        CloseableHttpClient httpclient = HttpClients.createDefault();
//        try {
//            HttpPost post = new HttpPost("http://127.0.0.1:3003");
//            post.setHeader("Content-Type", "application/json");
//            ByteArrayEntity entity = new ByteArrayEntity("{\"output\": [\"baidu.png\"],\"address\": [\"http://www.baidu.com/\"]}".getBytes());
//            entity.setContentEncoding("GBK");
//            post.setEntity(entity);
//            CloseableHttpResponse response = httpclient.execute(post);
//            try {
//                System.out.println("----------------------------------------");
//                System.out.println(response.getStatusLine());
//                EntityUtils.consume(response.getEntity());
//            } finally {
//                response.close();
//            }
//        } finally {
//            httpclient.close();
//        }
//    }

}
