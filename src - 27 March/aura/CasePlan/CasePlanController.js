({
    doInit: function(component, evt, helper) {

            helper._getCaseManagerData(component, component.get('v.recordId'));


    },
    updateCaseStep : function(component,event,helper){
        console.log('Flow Not Hide : ',component.get('v.startCaseStepManagement'));
        component.set("v.SelectedIndex",event.currentTarget.getAttribute("data-ind"));
        component.set("v.caseStepId",event.currentTarget.getAttribute("data-id"));
        var interval = window.setInterval($A.getCallback(() => helper._updateData(component, component.get('v.recordId'), component.get("v.caseManager.caseStepWraperList["+component.get("v.SelectedIndex")+"].IsCompleted"),interval)), 1000);
        if(!component.get("v.caseManager.caseStepWraperList["+component.get("v.SelectedIndex")+"].IsPending")){
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
                },
                {
                    name : "CaseId",
                    type : "String",
                    value: component.get('v.recordId')
                }

            ];
            console.log('flowCaseStart : ' + flowCaseStart);
            flowCaseStart.startFlow('Case_Step_Management',inputVariablesCaseStart);
            console.log('Flow Not Hide : ',component.get('v.startCaseStepManagement'));
        }else{
            component.set('v.caseStepId',event.currentTarget.getAttribute("data-id"));
            component.set('v.startCaseStepManagement',true);
            component.set('v.alreadyFlowRuning',true);
        }

    },
    updateComponentAfterCompletion : function(component, event, helper){
            console.log('Start Associate Flow');
            var isParentComplete;
            if(event.getParam("status") === "FINISHED_SCREEN" || event.getParam("status") === "FINISHED") {
                        helper._getCaseManagerData(component, component.get('v.recordId'));

                        console.log('Update Complete to is Pending');
                        var outputVariables = event.getParam("outputVariables");
                        var outputVar;
                        for(var i = 0; i < outputVariables.length; i++) {
                           outputVar = outputVariables[i];
                           if(outputVar.name === "outputVaribale") {
                                console.log('Output ', outputVar.value);
                                if(outputVar.value === "First Complete Parent Case Step!!!"){
                                    console.log('Flow Not Hide : ',component.get('v.startCaseStepManagement'));
                                    component.set('v.startCaseStepManagement',true);
                                    isParentComplete = false;
                                }else{
                                    component.set('v.startCaseStepManagement',false);
                                    isParentComplete= true;
                                }
                           }
                        }
                        if(isParentComplete){
                            var currentUrl = window.location.href;
                            var finishFlows = encodeURI('/flow/Case_Step_Complete_Handler?CaseStepId='+component.get('v.caseStepId') + '&retURL=/005');
                            var associateFlowUrl = encodeURI('/flow/'+component.get("v.caseManager.caseStepWraperList["+component.get("v.SelectedIndex")+"].StepFlow")+'?recordId='+component.get('v.caseStepId')+'&retURL='+finishFlows);
                            window.open(associateFlowUrl, "_blank");
                        }else{
                            helper._getCaseManagerData(component, component.get('v.recordId'));
                            component.set('v.startCaseStepManagement',false);
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                "title": "Error!",
                                "message": "Please Complete Parent Step!"
                            });
                            toastEvent.fire();
                        }
                }

        },

     restartFlow : function(component,event,helper){
         component.set('v.alreadyFlowRuning',false);
         var currentUrl = window.location.href;
         var finishFlows = encodeURI('/flow/Case_Step_Complete_Handler?CaseStepId='+component.get('v.caseStepId'));
         var associateFlowUrl = encodeURI('/flow/'+component.get("v.caseManager.caseStepWraperList["+component.get("v.SelectedIndex")+"].StepFlow")+'?recordId='+component.get('v.caseStepId')+'&retURL='+finishFlows);
         window.open(associateFlowUrl, "_blank");

     },
     closeFlowMessageModel : function(component,event,helper){
         component.set('v.alreadyFlowRuning',false);
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

    closeModalOnFinish : function(component, event, helper){
        if(event.getParam("status") === "FINISHED_SCREEN" || event.getParam("status") === "FINISHED") {
            component.set("v.openModal",false);
            helper._getCaseManagerData(component, component.get('v.recordId'));
        }
    },

    hideModal : function(component, event, helper){
        component.set("v.openModal",false);
        helper._getCaseManagerData(component, component.get('v.recordId'));
    },

    changeStatus: function(component,event,helper){
        component.set("v.changeCaseStatus",true);
        var oldOrderList = component.get('v.caseManager.recordCasePlan.CaseStatusOrdering__c');
        var res = oldOrderList.split(";");
        var nextStatus ="";
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
        if(nextStatus == null || nextStatus == undefined){
            nextStatus ="";
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
            },
            {
                name:"casePlanId",
                type:"String",
                value:component.get("v.caseManager.recordCasePlan.Id")
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
                    }else if( outputVar.value == "Case Plan Setup Completed"){
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Success!",
                            "message": outputVar.value
                        });
                        toastEvent.fire();
                    }else{
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Error!",
                            "message": outputVar.value
                        });
                        toastEvent.fire();
                    }
                }
             }
          }
       },


})