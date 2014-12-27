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

    public static void main(String[] args) {
        try {
            String phantomjsPath = "/Users/south/WORK/tool/phantomjs-1.9.8-macosx/bin/phantomjs";
            String pjsPath = "/Users/south/WORK/workspace_snow/luo/phantomjsHighchart/phantomjsHighchart/src/main/resources/pjs.js";
            String visitAddress = "http://localhost:8080/phantomjs-highchart";
            String visitUri = "/";
            String imageSavePath = "/Users/south/WORK/tool/phantomjs-1.9.8-macosx/bin/a.png";
            String jsonPath = "/Users/south/WORK/workspace_snow/luo/phantomjsHighchart/phantomjsHighchart/src/main/resources/transactionalsummary.json";
            String reportType = "TRANSACTIONAL";// BATCH|TRANSACTIONAL|PROGRAM
            // Transactional : Transactional Mailing Report :<Report Name>
            // Program :Lifecycle Program Report :<Reprort Name>
            // Batch : Batch Mailing Report : <Report Name>
            String reportName = "TEST";
            //
            new TestPJS().exportChart(phantomjsPath, pjsPath, visitAddress, visitUri, imageSavePath, jsonPath, reportType, reportName);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
