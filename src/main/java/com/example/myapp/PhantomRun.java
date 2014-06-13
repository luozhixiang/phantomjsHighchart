package com.example.myapp;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.List;

public class PhantomRun {
    private Process process = null;

    public String startPhantomjs(String phantomjsPath, String jsFilePath, String ip, String port) {
        List<String> paramList = new LinkedList<String>();
        paramList.add(phantomjsPath);
        paramList.add(jsFilePath);
        paramList.add("-host");
        paramList.add(ip);
        paramList.add("-port");
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
