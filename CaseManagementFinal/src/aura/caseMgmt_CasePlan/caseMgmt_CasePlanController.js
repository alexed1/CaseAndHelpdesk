({
    doInit: function(component, evt, helper) {
        helper._getCaseManagerData(component, component.get('v.recordId'));
    },
    updateCaseStep : function(component,event,helper){
        console.log('Update Start');
        component.set("v.SelectedIndex",event.currentTarget.getAttribute("data-ind"));
        if(!component.get("v.caseManager.caseStepWraperList["+component.get("v.SelectedIndex")+"].IsPending")){
            component.set("v.caseStepId",event.currentTarget.getAttribute("data-id"));
            var flowCaseStart = component.find("startCaseStep");
            var inputVariablesCaseStart = [
                {
                   name : "CaseStepId",
                   type : "String",
                   value: event.currentTarget.getAttribute("data-id")
                },
                {
                    name : "StartWhen",
                    type : "String",
                    value: component.get("v.caseManager.caseStepWraperList["+component.get("v.SelectedIndex")+"].StartWhen")
                }

            ];
            flowCaseStart.startFlow('Case_Step_Management',inputVariablesCaseStart);
            //helper._getCaseManagerData(component, component.get('v.recordId'));
        }else{
            component.set('v.startCaseStepManagement',true);
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Success!",
                "message": "Step Already in Progress"
            });
            toastEvent.fire();
        }

    },

    startAssociateFlow : function(component, event, helper){
        console.log('Start Associate Flow');
        if(event.getParam("status") === "FINISHED_SCREEN" || event.getParam("status") === "FINISHED") {
            var isParentComplete;
            console.log('Update Complete to is Pending');
            var outputVariables = event.getParam("outputVariables");
            var outputVar;
            for(var i = 0; i < outputVariables.length; i++) {
               outputVar = outputVariables[i];

               if(outputVar.name === "outputVaribale") {
                    console.log('Output', outputVar.value);
                    if(outputVar.value === "First Complete Parent Case Step!!!"){
                        isParentComplete = false;
                    }else{
                        isParentComplete= true;
                    }
               }
            }
            if(isParentComplete){
                component.set('v.startCaseStepManagement',false);
                if(component.get("v.caseManager.caseStepWraperList["+component.get("v.SelectedIndex")+"].StepFlow") != 'None' || component.get("v.caseManager.caseStepWraperList["+component.get("v.SelectedIndex")+"].StepFlow") != null){
                    console.log('Flow Fired');
                     component.set('v.startAssociateFlow',true);
                     var flow = component.find("associateFlow");
                     var inputVariables = [
                         {
                            name : "CaseStepId",
                            type : "String",
                            value: component.get('v.caseStepId')
                         }
                     ];
                     flow.startFlow(component.get("v.caseManager.caseStepWraperList["+component.get("v.SelectedIndex")+"].StepFlow"),inputVariables);

                }
            }else{
                helper._getCaseManagerData(component, component.get('v.recordId'));
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "error!",
                    "message": "Please Complete Parent Step!!!"
                });
                toastEvent.fire();
            }

        }
    },
    handleCaseStep : function(component, event, helper){
        console.log('Handle Associate');
        if(event.getParam("status") === "FINISHED_SCREEN" || event.getParam("status") === "FINISHED") {
            console.log('Associate Complete');
            component.set('v.startAssociateFlow',false);
            component.set('v.stopCaseStepManagement',true);
            var flowCaseStop = component.find("stopCaseStep");
            var inputVariablesCaseStart = [{
               name : "CaseStepId",
               type : "String",
               value: component.get('v.caseStepId')
            }];
            flowCaseStop.startFlow('Complete_Case_Steps',inputVariablesCaseStart);
        }
    },
    stopAssociateFlow : function(component, event, helper){
        console.log('is Completed Updating Start');
        if(event.getParam("status") === "FINISHED_SCREEN" || event.getParam("status") === "FINISHED") {
            console.log('Stoped');
            var outputVariables = event.getParam("outputVariables");
            var outputVar;
            for(var i = 0; i < outputVariables.length; i++) {
               outputVar = outputVariables[i];
               if(outputVar.name === "outputVaribale") {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success!",
                        "message": outputVar.value
                    });
                    toastEvent.fire();
               }
            }
        }
        component.set('v.stopCaseStepManagement',false);
        helper._getCaseManagerData(component, component.get('v.recordId'));
    },

    startFlowAddStep : function(component, event, helper){
        component.set("v.openModal",true);
        var flow = component.find("flowCreateStep");
                var inputVariables = [

                    {
                      name : "Create",
                      type : "Boolean",
                      value : true
                    },
                    {
                        name : "CaseId",
                        type : "String",
                        value : component.get("v.recordId")
                    },
                    {
                        name : "CurrentStatusCase",
                        type : "String",
                        value : component.get("v.caseManager.CaseStatus")
                    },
                    {
                        name : "isAdmin",
                        type : "Boolean",
                        value : false
                    }
                ];
        flow.startFlow("Create_Case_Step_Flow",inputVariables);
    },

    hideModal: function(component, event, helper){
        component.set("v.openModal",false);
        helper._getCaseManagerData(component, component.get('v.recordId'));
    },

    changeStatus: function(component,event,helper){
        component.set("v.changeCaseStatus",true);
        var oldOrderList = component.get('v.caseManager.recordCasePlan.CaseStatusOrdering__c');
        var res = oldOrderList.split(";");
        var nextStatus;
        var valueForList = [];
        for (var i = 0; i < res.length; i++) {
            if(res[i] == component.get("v.caseManager.CaseStatus")){
                if(i<res.length){
                    nextStatus = res[i+1];
                }else{
                    nextStatus = "";
                }

            }
        }
        console.log('Next Status : ' + nextStatus);
        var flow = component.find("nextStatus");
        var inputVariables = [
            {
               name : "CaseRecordId",
               type : "String",
               value: component.get("v.recordId")
            },
            {
                name : "currentCaseStatus",
                type : "String",
                value : component.get("v.caseManager.CaseStatus")
            },
            {
                name : "nextStatus",
                type : "String",
                value : nextStatus
            }


        ];
        flow.startFlow("Case_Management_Next_Status",inputVariables);
    },
    handleStatusChange : function (component, event, helper) {
          if(event.getParam("status") === "FINISHED_SCREEN") {
             component.set("v.changeCaseStatus",false);
             var outputVariables = event.getParam("outputVariables");
             var outputVar;
             for(var i = 0; i < outputVariables.length; i++) {
                outputVar = outputVariables[i];
                if(outputVar.name === "AlertMessage") {
                    if(outputVar.value == "Case Status Updated"){
                        window.location.reload(true);
                    }else{
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Success!",
                            "message": outputVar.value
                        });
                        toastEvent.fire();
                    }
                }
             }
          }
       },


})