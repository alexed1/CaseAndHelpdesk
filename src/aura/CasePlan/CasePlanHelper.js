/**
 * Created by Shubham on 1/29/2019.
 */
({
    _getCaseManagerData : function(component, recordId){
        component.set('v.startCaseStepManagement',true);
        component.set("v.recordId", recordId);
        var actionVar = component.get("c.manageCase");
        actionVar.setParams({ recordId : recordId });
        actionVar.setCallback(this, function(response) {
            component.set("v.caseManager",response.getReturnValue());
        });
        $A.enqueueAction(actionVar);
    },

})