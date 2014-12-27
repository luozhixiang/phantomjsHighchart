import com.example.myapp.PhantomRun;

public class TestPJS {
    public static void main(String[] args) {
        try {
            String phantomjsPath = "/Users/south/WORK/tool/phantomjs-1.9.8-macosx/bin/phantomjs";
            String pjsPath = "/Users/south/WORK/workspace_snow/luo/phantomjsHighchart/phantomjsHighchart/src/main/resources/pjs.js";
            String visitAddress = "http://localhost:8080/phantomjs-highchart";
            String visitUri = "/";
            String outputName = "/Users/south/WORK/tool/phantomjs-1.9.8-macosx/bin/a.png";
            String jsonPath = "/Users/south/WORK/workspace_snow/luo/phantomjsHighchart/phantomjsHighchart/src/main/resources/batchsummary.json";
            //
            new PhantomRun().exportChart(phantomjsPath, pjsPath, visitAddress, visitUri, outputName, jsonPath);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
