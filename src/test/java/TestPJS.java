import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.List;

public class TestPJS {
    public String exportChart(String phantomjsPath, String pjsPath, String url, String uri, String imageSavePath,
                            String jsonPath, String reportType, String reportName) {
        List<String> paramList = new LinkedList<String>();
        paramList.add(phantomjsPath);
        paramList.add(pjsPath);
        paramList.add(url);// 1
        paramList.add(uri);// 2
        paramList.add(imageSavePath);// 3
        paramList.add(jsonPath);// 4
        paramList.add(reportType);// 5
        paramList.add(reportName);// 6

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
            throw new IllegalStateException("Cannot execute script " + pjsPath, e);
        }

        return stringBuilder.toString();
    }

    // Transactional : Transactional Mailing Report :<Report Name>
    // Program :Lifecycle Program Report :<Reprort Name>
    // Batch : Batch Mailing Report : <Report Name>
    public static void main(String[] args) {
        try {
            String path = "/Users/luo/WORK";
            String phantomjsPath = path + "/tool/phantomjs-1.9.8-macosx/bin/phantomjs";
            String pjsPath = path + "/workspace_snow/luo/phantomjsHighchart/phantomjsHighchart/src/main/resources/pjs.js";
            String visitAddress = "http://localhost:8080/phantomjs-highchart";
            String visitUri = "/";
            String reportName = "TEST";
            //
            String imageSavePath = path + "/tool/phantomjs-1.9.8-macosx/bin/batchsummary.png";
            String jsonPath = path + "/workspace_snow/luo/phantomjsHighchart/phantomjsHighchart/src/main/resources/batchsummary.json";
            String reportType = "BATCH";// BATCH|TRANSACTIONAL|PROGRAM
            new TestPJS().exportChart(phantomjsPath, pjsPath, visitAddress, visitUri, imageSavePath, jsonPath, reportType, reportName);
            //
            imageSavePath = path + "/tool/phantomjs-1.9.8-macosx/bin/transactionalsummary.png";
            jsonPath = path + "/workspace_snow/luo/phantomjsHighchart/phantomjsHighchart/src/main/resources/transactionalsummary.json";
            reportType = "TRANSACTIONAL";// BATCH|TRANSACTIONAL|PROGRAM
            new TestPJS().exportChart(phantomjsPath, pjsPath, visitAddress, visitUri, imageSavePath, jsonPath, reportType, reportName);
            //
            imageSavePath = path + "/tool/phantomjs-1.9.8-macosx/bin/progamsummary.png";
            jsonPath = path + "/workspace_snow/luo/phantomjsHighchart/phantomjsHighchart/src/main/resources/progamsummary.json";
            reportType = "PROGRAM";// BATCH|TRANSACTIONAL|PROGRAM
            new TestPJS().exportChart(phantomjsPath, pjsPath, visitAddress, visitUri, imageSavePath, jsonPath, reportType, reportName);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
