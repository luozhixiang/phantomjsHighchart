package com.example.myapp;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.List;

public class PhantomRun {
    private Process process = null;

//    String phantomjsPath = "/Users/south/WORK/tool/phantomjs-1.9.8-macosx/bin/phantomjs";
//    String jsFilePath = "resources/overview-summary-all.js";
//    String url = "http://localhost:8081/index-dev.html";
//    String reportType = "BATCH";
//    phantomRun.exportChart(phantomjsPath, jsFilePath, url, reportType);
    
    public String exportChart(String phantomjsPath, String jsFilePath, String url, String uri, String imageSavePath,
                            String reportType) {
        List<String> paramList = new LinkedList<String>();
        paramList.add(phantomjsPath);
        paramList.add(jsFilePath);
        paramList.add(url);//1
        paramList.add(uri);//2
        paramList.add(imageSavePath);//3
        if (reportType != null) {
            paramList.add(reportType);//4
        }

        StringBuilder stringBuilder = null;
        String[] parameters = paramList.toArray(new String[paramList.size()]);

        try {
            Process process = Runtime.getRuntime().exec(parameters);

            int exitStatus = process.waitFor();
            BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream()));

            String currentLine = null;
            stringBuilder = new StringBuilder(exitStatus == 0 ? "SUCCESS" : "ERROR:");
            currentLine = bufferedReader.readLine();

            while (currentLine != null) {
                stringBuilder.append(currentLine);
                currentLine = bufferedReader.readLine();
            }
            System.out.println(stringBuilder.toString());

        } catch (Exception e) {
            throw new IllegalStateException("Cannot execute script " + jsFilePath, e);
        }

        return stringBuilder.toString();
    }

    public String startPhantomjs(String phantomjsPath, String jsFilePath, String ip, String port) {
        List<String> paramList = new LinkedList<String>();
        paramList.add(phantomjsPath);
        paramList.add(jsFilePath);
        paramList.add(ip);
        paramList.add(port);

        StringBuilder stringBuilder = null;
        String[] parameters = paramList.toArray(new String[paramList.size()]);

        try {
            process = new ProcessBuilder(parameters).start();// Runtime.getRuntime().exec(parameters);
            // int exitStatus = process.waitFor();
            final BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String readLine = bufferedReader.readLine();
            String exitStatus = "SUCCESS";
            if (readLine == null || !readLine.contains("ready")) {
                exitStatus = "ERROR";
            }
            stringBuilder = new StringBuilder(exitStatus);
            System.out.println(stringBuilder.toString());

        } catch (Exception e) {
            throw new IllegalStateException("Cannot execute script " + jsFilePath, e);
        }
        return stringBuilder.toString();
    }

    public String stopPhantomjs() {
        if (process != null) {
            try {
                process.getErrorStream().close();
                process.getInputStream().close();
                process.getOutputStream().close();
            } catch (IOException e) {
                e.printStackTrace();
                return "ERROR";
            }
            process.destroy();
        }
        return "SUCCESS";
    }
}
