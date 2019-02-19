global class CaseMgmt_CasePlanController {
    @auraEnabled
    public static CaseManager manageCase(Id recordId){
        
        CaseManager caseManagerRecord = new CaseManager();
        List<Id> caseStepIdList = new List<Id>();
        List<Case> caseRecords = new List<Case>([Select Id, Status,Case_Plan__c  From Case where Id =: recordId]);
        if(!caseRecords.isEmpty()){
            caseManagerRecord.CaseStatus = caseRecords[0].Status;
        }
        for(Case_Plan__c casePlan : [Select Id, Status__c, CaseStatusOrdering__c  From Case_Plan__c where Id =: caseRecords[0].Case_Plan__c And Status__c = 'Active']){
            System.debug('SD : Case Plan : ' + casePlan);
            caseManagerRecord.recordCasePlan = casePlan;
        }
        for(Plan_Step__c planStep : [Select Id, Name, Case_Step__c, Case_Plan__c  From Plan_Step__c where Case_Plan__c =: caseManagerRecord.recordCasePlan.Id]){
            caseManagerRecord.listOfPlanSteps.add(planStep);
            caseStepIdList.add(planStep.Case_Step__c);
        }
        for(Case_Step__c caseStep : [Select Id, Start_When__c,Associate_Case_Status__c, IsCompleted__c,Is_Pending__c,Is_Required__c, Name, Flow__c From Case_Step__c where Case__c =: recordId AND Id IN: caseStepIdList AND Associate_Case_Status__c =: caseRecords[0].Status ORDER By CreatedDate ASC ]){
            caseManagerRecord.listOfCaseSteps.add(caseStep);
        }
        
        
        System.debug('SD : Case Record : ' + caseManagerRecord);
        return caseManagerRecord;
    }
    
    
    @InvocableMethod
    public static List<String> fetchRecordTypePicklistValue(List<String> RecordIdList){
        List<String> orderStatusStringList = new List<String>();
        //Map<String, Case_Plan_Support_Process__c> mcs = Case_Plan_Support_Process__c.getAll();
        //Case_Plan_Support_Process__c mc = Case_Plan_Support_Process__c.getValues();
        
        
        //String caserecord =  [Select Id, RecordTypeId from Case where Id IN :  RecordIdList LIMIT 1].RecordTypeId;
        String sfdcURL = URL.getSalesforceBaseUrl().toExternalForm();
        String restAPIURL = sfdcURL + '/services/data/v45.0/ui-api/object-info/Case/picklist-values/' +RecordIdList[0];
        caseMgmt_JSON2Apex myWrapper;
        HttpRequest httpRequest = new HttpRequest();
        httpRequest.setMethod('GET');
        PageReference pg = new PageReference('/Apex/SessionIdUtilityPage');
        String sessionId ='';
        If(!test.isRunningTest()){
            sessionId = pg.getContent().toString().substringBetween('<div id="apiSeesionID">','</div>').trim();
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
            If(!test.isRunningTest()){
                Http http = new Http();
                HttpResponse httpResponse = http.send(httpRequest);
                if (httpResponse.getStatusCode() == 200 ) {
                    response = JSON.serializePretty( JSON.deserializeUntyped(httpResponse.getBody()) );
                    caseMgmt_JSON2Apex selectedCse =  caseMgmt_JSON2Apex.parse(httpResponse.getBody());
                    List<caseMgmt_JSON2Apex.values> listOfStatus = selectedCse.picklistFieldValues.Status.Values;
                    for(caseMgmt_JSON2Apex.values value : listOfStatus){
                        if(orderString == null){
                            orderString = String.valueOf(value.value);
                        }else{
                            orderString = orderString + ';' + String.valueOf(value.value);
                        }
                    }
                    orderStatusStringList.add(orderString);
                } else {
                    System.debug(' httpResponse ' + httpResponse.getBody() );
                    throw new CalloutException( httpResponse.getBody() );
                }
            }
        } catch( System.Exception e) {
            System.debug('ERROR: '+ e);
            throw e;
        }
        return orderStatusStringList;
    }
    
    public class CaseManager{
        @auraEnabled public List<Plan_Step__c> listOfPlanSteps;
        @auraEnabled public String CaseStatus;
        @auraEnabled public List<Case_Step__c> listOfCaseSteps;
        @auraEnabled public Case_Plan__c recordCasePlan;
        public CaseManager(){
            listOfCaseSteps = new List<Case_Step__c>();
            listOfPlanSteps = new List<Plan_Step__c>();
            CaseStatus = '';
            recordCasePlan = new Case_Plan__c();
        }
    }
    
}