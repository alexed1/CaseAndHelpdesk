/**
 * Created by Shubham on 1/29/2019.
 */
({
    _getCaseManagerData : function(component, recordId){
        console.log('Calling');
        component.set('v.startCaseStepManagement',true);
        component.set("v.recordId", recordId);
        var actionVar = component.get("c.manageCase");
        actionVar.setParams({ recordId : recordId });

        actionVar.setCallback(this, function(response) {
            component.set("v.caseManager",response.getReturnValue());
            if($A.util.isEmpty(component.get("v.caseManager.recordCasePlan"))){
                component.set("v.notEmpty",false);
            }
        });

        $A.enqueueAction(actionVar);
    },
    _updateData : function(component, recordId, isCompleted,interval){
            if(!isCompleted){
                component.set('v.startCaseStepManagement',true);
                component.set("v.recordId", recordId);
                var actionVar = component.get("c.manageCase");

                if(actionVar != undefined){
                    actionVar.setParams({ recordId : recordId });
                    actionVar.setCallback(this, function(response) {
                        component.set("v.caseManager",response.getReturnValue());
                    });
                    $A.enqueueAction(actionVar);
                }

            }else{
                window.clearInterval(interval);
            }

        },


})