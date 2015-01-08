import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.List;

public class TestPJS {
    public String exportChart(String phantomjsPath, String pjsPath, String url, String uri, String imageSavePath,
                            String jsonPath, String reportType, String reportName, String pdfSavePath,
                            String conversionCurrency, boolean conversionEnabled, String breakDownBy) {
        List<String> paramList = new LinkedList<String>();
        paramList.add(phantomjsPath);
        paramList.add(pjsPath);
        paramList.add(url);// 1
        paramList.add(uri);// 2
        paramList.add(imageSavePath);// 3
        paramList.add(jsonPath);// 4
        paramList.add(reportType);// 5
        paramList.add(reportName);// 6
        paramList.add(pdfSavePath);// 7
        paramList.add(conversionCurrency);// 8
        paramList.add(conversionEnabled + "");// 9
        paramList.add(breakDownBy);// 10

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
            // for luo
            String path = "/Users/luo/WORK";
            String projectPath = "/workspace_snow/luo/phantomjsHighchart/phantomjsHighchart";
            String phantomjsPath = path + "/tool/phantomjs-1.9.8-macosx/bin/phantomjs";
            String dataPath = path + projectPath + "/src/main/resources/2";
            String visitAddress = "http://localhost:8080/phantomjs-highchart";
     
            // for gao
            // String path = "/Users/bin_gao/Documents/workspace-4";
            // String projectPath = "/phantomjsHighchart";
            // String phantomjsPath = "/usr/local/bin/phantomjs";
            // String dataPath = path + projectPath + "/src/main/resources/2";
            // String visitAddress = "http://localhost:8080/";

            String pjsPath = path + projectPath + "/src/main/resources/pjs.js";
            String visitUri = "/";
            String reportName = "TEST";
            String breakDownBy = "day";
            //
            String conversionCurrency = "$";
            boolean conversionEnabled = false;
            String imageSavePath = path + projectPath + "/src/main/resources/export/0batchsummary.png";
            String pdfSavePath = path + projectPath + "/src/main/resources/export/0batchsummary.pdf";
            String jsonPath = dataPath + "/batchsummary.json";
            String reportType = "BATCH";// BATCH|TRANSACTIONAL|PROGRAM
            new TestPJS().exportChart(phantomjsPath, pjsPath, visitAddress, visitUri, imageSavePath, jsonPath, reportType, reportName, pdfSavePath, conversionCurrency, conversionEnabled, breakDownBy);
            //
            imageSavePath = path + projectPath + "/src/main/resources/export/0transactionalsummary.png";
            pdfSavePath = path + projectPath + "/src/main/resources/export/0transactionalsummary.pdf";
            jsonPath = dataPath + "/transactionalsummary.json";
            reportType = "TRANSACTIONAL";// BATCH|TRANSACTIONAL|PROGRAM
            new TestPJS().exportChart(phantomjsPath, pjsPath, visitAddress, visitUri, imageSavePath, jsonPath, reportType, reportName, pdfSavePath, conversionCurrency, conversionEnabled, breakDownBy);
            //
            imageSavePath = path + projectPath + "/src/main/resources/export/0progamsummary.png";
            pdfSavePath = path + projectPath + "/src/main/resources/export/0progamsummary.pdf";
            jsonPath = dataPath + "/progamsummary.json";
            reportType = "PROGRAM";// BATCH|TRANSACTIONAL|PROGRAM
            new TestPJS().exportChart(phantomjsPath, pjsPath, visitAddress, visitUri, imageSavePath, jsonPath, reportType, reportName, pdfSavePath, conversionCurrency, conversionEnabled, breakDownBy);
            //
            dataPath = path + projectPath + "/src/main/resources/3";
            reportType = "BATCH";// BATCH|TRANSACTIONAL|PROGRAM
            //
            imageSavePath = path + projectPath + "/src/main/resources/export/0batchsummary_day.png";
            pdfSavePath = path + projectPath + "/src/main/resources/export/0batchsummary_day.pdf";
            jsonPath = dataPath + "/getBatchSummary-breakdownbyday.jso";
            new TestPJS().exportChart(phantomjsPath, pjsPath, visitAddress, visitUri, imageSavePath, jsonPath, reportType, reportName, pdfSavePath, conversionCurrency, conversionEnabled, breakDownBy);
            //
            imageSavePath = path + projectPath + "/src/main/resources/export/0batchsummary_week.png";
            pdfSavePath = path + projectPath + "/src/main/resources/export/0batchsummary_week.pdf";
            jsonPath = dataPath + "/getBatchSummary-breakdownbyweek.jso";
            new TestPJS().exportChart(phantomjsPath, pjsPath, visitAddress, visitUri, imageSavePath, jsonPath, reportType, reportName, pdfSavePath, conversionCurrency, conversionEnabled, breakDownBy);
            //
            imageSavePath = path + projectPath + "/src/main/resources/export/0batchsummary_month.png";
            pdfSavePath = path + projectPath + "/src/main/resources/export/0batchsummary_month.pdf";
            jsonPath = dataPath + "/getBatchSummary-breakdownbymonth.jso";
            new TestPJS().exportChart(phantomjsPath, pjsPath, visitAddress, visitUri, imageSavePath, jsonPath, reportType, reportName, pdfSavePath, conversionCurrency, conversionEnabled, breakDownBy);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
