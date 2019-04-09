/**
 * Created by Shubham on 2/5/2019.
 */

trigger caseToAddCaseSteps on Case (after insert, after update, before insert, before update) {

    if(trigger.isBefore && (trigger.isInsert || trigger.isUpdate)){
        caseToAddCaseStepsTriggerHandler.beforeInsertAndUpdate(trigger.new, trigger.oldMap);
    }
    if(trigger.isAfter && (trigger.isInsert || trigger.isUpdate)){
        caseToAddCaseStepsTriggerHandler.afterInsertAndUpdate(trigger.new, trigger.oldMap);
    }
}