/**
 * Created by Shubham on 2/7/2019.
 */

global class CaseMgmt_FlowRestAPI {

    @InvocableMethod
    public static List<String> fetchAllFlows(List<String> RecordIdList){
        List<String> orderStatusStringList = new List<String>();
        //Map<String, Case_Plan_Support_Process__c> mcs = Case_Plan_Support_Process__c.getAll();
        //Case_Plan_Support_Process__c mc = Case_Plan_Support_Process__c.getValues();


        //String caserecord =  [Select Id, RecordTypeId from Case where Id IN :  RecordIdList LIMIT 1].RecordTypeId;
        String sfdcURL = URL.getSalesforceBaseUrl().toExternalForm();
        String restAPIURL = sfdcURL + '/services/data/v44.0/actions/custom/flow/';
        caseMgmt_JSON2Apex myWrapper;
        HttpRequest httpRequest = new HttpRequest();
        httpRequest.setMethod('GET');
        PageReference pg = new PageReference('/Apex/SessionIdUtilityPage');
        String sessionId ='';
        If(!test.isRunningTest()) {
            sessionId = pg.getContent().toString().substringBetween('<div id="apiSeesionID">', '</div>').trim();
        }
        //System.debug('SD: --> ' + pg.getContent().toString());
        System.debug('SD: ' + sessionId);
        httpRequest.setHeader('Authorization', 'OAuth ' + sessionId);
        System.debug('URL >>> ' + restAPIURL);
        httpRequest.setHeader('Authorization', 'Bearer ' + sessionId);
        httpRequest.setEndpoint(restAPIURL);
        String response = '';
        String orderString;
        try {
            Http http = new Http();
            HttpResponse httpResponse = http.send(httpRequest);
            if (httpResponse.getStatusCode() == 200 ) {
                response = JSON.serializePretty( JSON.deserializeUntyped(httpResponse.getBody()) );
                JSON2ApexFlow allFlowList =  JSON2ApexFlow.parse(httpResponse.getBody());
                List<JSON2ApexFlow.Actions> listOfStatus = allFlowList.Actions;
                for(JSON2ApexFlow.Actions actions : listOfStatus){
                    if(orderString == null){
                        orderString = String.valueOf(actions.name);
                    }else{
                        orderString = orderString + ';' + String.valueOf(actions.name);
                    }
                }
                orderStatusStringList.add(orderString);
            } else {
                System.debug(' httpResponse ' + httpResponse.getBody() );
                throw new CalloutException( httpResponse.getBody() );
            }
        } catch( System.Exception e) {
            System.debug('ERROR: '+ e);
            throw e;
        }
        return orderStatusStringList;
    }
}