/**
 * Created by Shubham on 2/5/2019.
 */

trigger caseToAddCaseSteps on Case (after insert, after update) {
    map<Id,Id> caseWithCasePlan = new map<Id,Id>();
    Map<Id,List<Id>> mapOfCaseplanWithCaseStep = new Map<Id,List<Id>>();
    List<Case_Step__c> listToupdateCaseStep = new List<Case_Step__c>();
    List<Id> listOfCaseStepId = new List<Id>();
    if(trigger.isAfter && (trigger.isInsert || trigger.isUpdate)){
        if (trigger.oldMap == null) {
            for(Case caseObj : trigger.new){
                if(caseObj.Case_Plan__c != null){
                    caseWithCasePlan.put(caseObj.Case_Plan__c,caseObj.Id);
                }

            }
        }else{
            for(Case caseObj : trigger.new){
                if(caseObj.Case_Plan__c != trigger.oldMap.get(caseObj.Id).Case_Plan__c && caseObj.Case_Plan__c != null){
                    caseWithCasePlan.put(caseObj.Case_Plan__c,caseObj.Id);
                }

            }
        }

        if(caseWithCasePlan != null){
            for(Plan_Step__c planStep : [Select Id, Case_Plan__c, Case_Step__c from Plan_Step__c where Case_Plan__c IN: caseWithCasePlan.keySet()]){
                if(mapOfCaseplanWithCaseStep.containsKey(planStep.Case_Plan__c)){
                    mapOfCaseplanWithCaseStep.get(planStep.Case_Plan__c).add(planStep.Case_Step__c);
                    listOfCaseStepId.add(planStep.Case_Step__c);
                }else{
                    List<Id> caseStepId = new List<Id>();
                    caseStepId.add(planStep.Case_Step__c);
                    mapOfCaseplanWithCaseStep.put(planStep.Case_Plan__c,caseStepId);
                    listOfCaseStepId.add(planStep.Case_Step__c);

                }
            }
        }
        if(mapOfCaseplanWithCaseStep != null){
            for(Case_Step__c caseStep : [SELECT Id, Case__c from Case_Step__c where Id IN : listOfCaseStepId]){
                for(Id id : mapOfCaseplanWithCaseStep.keySet()){
                    for(Id idCaseStep : mapOfCaseplanWithCaseStep.get(id)){
                        if(idCaseStep == caseStep.Id){
                            caseStep.Case__c = caseWithCasePlan.get(id);
                            listToupdateCaseStep.add(caseStep);
                        }
                    }
                }
            }
        }
        if (listToupdateCaseStep.size() > 0) {
                update listToupdateCaseStep;
        }
    }
}