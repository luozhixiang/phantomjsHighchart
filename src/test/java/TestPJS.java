import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.List;

public class TestPJS {
    public String exportChart(String phantomjsPath, String pjsPath, String url, String uri, String imageSavePath,
                            String jsonPath, String reportType, String reportName, String pdfSavePath,
                            String conversionCurrency, boolean conversionEnabled, String breakDownBy,
                            String showClicks, String showOpens) {
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
        paramList.add(showClicks);// 11
        paramList.add(showOpens);// 12

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
            //
            String[] breakDownByArr = new String[] { "day", "month", "week" };
            String[] showClicksArr = new String[] { "true", "false" };
            String[] showOpensArr = new String[] { "true", "false" };
            String[] conversionCurrencyArr = new String[] { "$" };
            String[] conversionEnabledArr = new String[] { "true", "false" };
            String[][] reportTypeArrs = new String[][] { new String[] { "BATCH", "batchsummary.json" },
                    new String[] { "TRANSACTIONAL", "transactionalsummary.json" },
                    new String[] { "PROGRAM", "progamsummary.json" } };
            //
            for (int i = 0; i < breakDownByArr.length; i++) {
                for (int j = 0; j < showClicksArr.length; j++) {
                    for (int j2 = 0; j2 < showOpensArr.length; j2++) {
                        for (int k = 0; k < reportTypeArrs.length; k++) {
                            for (int k2 = 0; k2 < conversionCurrencyArr.length; k2++) {
                                for (int l = 0; l < conversionEnabledArr.length; l++) {
                                    String breakDownBy = breakDownByArr[i];
                                    String showClicks = showClicksArr[j];
                                    String showOpens = showOpensArr[j2];
                                    String conversionCurrency = conversionCurrencyArr[k2];
                                    boolean conversionEnabled = "true".equals(conversionEnabledArr[l]);
                                    //
                                    String[] reportTypeArr = reportTypeArrs[k];
                                    String reportType = reportTypeArr[0];
                                    String jsonPath = dataPath + "/" + reportTypeArr[1];
                                    String fileName = reportType + "_breakDownBy-"
                                                            + breakDownBy
                                                            + "_showClicks-"
                                                            + showClicks
                                                            + "_showOpens-"
                                                            + showOpens
                                                            + "_conversionCurrency-"
                                                            + conversionCurrency
                                                            + "_conversionEnabled-"
                                                            + conversionEnabled;
                                    String imageSavePath = path + projectPath
                                                            + "/src/main/resources/export/"
                                                            + fileName
                                                            + ".png";
                                    String pdfSavePath = path + projectPath
                                                            + "/src/main/resources/export/"
                                                            + fileName
                                                            + ".pdf";
                                    //
                                    new TestPJS().exportChart(phantomjsPath, pjsPath, visitAddress, visitUri, imageSavePath, jsonPath, reportType, reportName, pdfSavePath, conversionCurrency, conversionEnabled, breakDownBy, showClicks, showOpens);
                                }
                            }
                        }
                    }
                }

            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
