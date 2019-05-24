/****************
 Purpose: Create and Update picklist and its values for plan step 
 Handler: PicklistDescriber
 ****************/
trigger PicklistDescriberTrigger on Plan_Step__c (after insert, before insert, after update) {
    Set<Id> picklistDescriberIdSet = new Set<Id>();
    Map<String, Plan_Step__c> picklistIdOldValueMap = new Map<String, Plan_Step__c>();
    if(Trigger.isAfter && Trigger.isInsert) {
        for(Plan_Step__c picklist : Trigger.New) {
            picklistDescriberIdSet.add(picklist.Id);
        }
        if(!picklistDescriberIdSet.isEmpty()){
            If(!test.isRunningTest()){
                Database.executeBatch(new PicklistDescriber(picklistDescriberIdSet, picklistIdOldValueMap));
            }
        }
    }

    if(Trigger.isBefore && Trigger.isInsert) {
        Set<String> picklistDescriberNameSet = new Set<String>();
        Set<String> picklistDescriberUniqueNameSet = new Set<String>();
        for(Plan_Step__c picklist : Trigger.New) {
            picklistDescriberNameSet.add(picklist.Object_API_Name__c + '' + picklist.Picklist_Field_API_Name__c + '' + picklist.Name);
        }
        for(Plan_Step__c picklist : [SELECT Id, Unique_Name__c FROM Plan_Step__c WHERE Unique_Name__c IN :picklistDescriberNameSet]) {
            picklistDescriberUniqueNameSet.add(picklist.Unique_Name__c);
        }
        for(Plan_Step__c picklist : Trigger.New) {
            if(picklistDescriberUniqueNameSet.contains(picklist.Object_API_Name__c + '' + picklist.Picklist_Field_API_Name__c + '' + picklist.Name)) {
                picklist.addError('Picklist value "' + picklist.Name + '"' + ' for "' + picklist.Picklist_Field_API_Name__c + '" picklist already exists on ' + picklist.Object_API_Name__c + ' object.');
            }
        }
    }

    if(Trigger.IsAfter && Trigger.isUpdate) {
        for(Plan_Step__c picklist : Trigger.New) {
            if(Trigger.oldMap.get(picklist.Id).Object_API_Name__c != picklist.Object_API_Name__c
                    || Trigger.oldMap.get(picklist.Id).Name != picklist.Name
                    || Trigger.oldMap.get(picklist.Id).Picklist_Field_API_Name__c != picklist.Picklist_Field_API_Name__c
                    || Trigger.oldMap.get(picklist.Id).Picklist_Field_API_Name__c != picklist.Picklist_Field_API_Name__c) {
                picklistIdOldValueMap.put(picklist.Id, Trigger.oldMap.get(picklist.Id));
                picklistDescriberIdSet.add(picklist.Id);
            }
        }
        if(!picklistDescriberIdSet.isEmpty()){
            If(!test.isRunningTest()){
                Database.executeBatch(new PicklistDescriber(picklistDescriberIdSet, picklistIdOldValueMap));
            }
        }
    }


}