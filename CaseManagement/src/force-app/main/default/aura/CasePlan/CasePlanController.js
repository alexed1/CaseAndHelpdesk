({
    doInit: function(component, evt, helper) {
        // Fetch initial data from apex class and set to local variables
        helper._getCaseManagerData(component, component.get('v.recordId'));
    },
    updateCaseStep : function(component,event,helper){
        //Invokes when you click on aany of the case step button
        component.set("v.SelectedIndex",event.currentTarget.getAttribute("data-ind"));
        component.set("v.caseStepId",event.currentTarget.getAttribute("data-id"));
        // Setting up a timer to auto refresh a view of component to update UI as per new status.
        var interval = window.setInterval($A.getCallback(() => helper._updateData(component, component.get('v.recordId'), component.get("v.caseManager.caseStepWraperList["+component.get("v.SelectedIndex")+"].IsCompleted"),interval)), 1000);
         //Setting up a flow variable to invoke and update case step status
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
            // Invokes a flow Case_Step_Management.
            flowCaseStart.startFlow('CaseManager_Case_Step_Management',inputVariablesCaseStart);
        }else{
            component.set('v.caseStepId',event.currentTarget.getAttribute("data-id"));
            component.set('v.startCaseStepManagement',true);
            component.set('v.alreadyFlowRuning',true);
        }

    },

    // Invoke this flow when Case Step Management flow is finished.
    updateComponentAfterCompletion : function(component, event, helper){
            var isParentComplete;
            if(event.getParam("status") === "FINISHED_SCREEN" || event.getParam("status") === "FINISHED") {
                        helper._getCaseManagerData(component, component.get('v.recordId'));
                        var outputVariables = event.getParam("outputVariables");
                        var outputVar;
                        for(var i = 0; i < outputVariables.length; i++) {
                           outputVar = outputVariables[i];
                           if(outputVar.name === "outputVaribale") {
                               //validating if their is any parent which is not completed the pop up a error
                                console.log('Output ', outputVar.value);
                                if(outputVar.value === "First Complete Parent Case Step!!!"){
                                    component.set('v.startCaseStepManagement',true);
                                    isParentComplete = false;
                                }else{
                                    //Stop the Case Step Management Flow and Set IsParentCompleted to true
                                    component.set('v.startCaseStepManagement',false);
                                    isParentComplete= true;
                                }
                           }
                        }
                        if(isParentComplete){
                            // If Parent Completed then Invoke Associated Flow using flow URL
                            var currentUrl = window.location.href;
                            var finishFlows = encodeURI('/flow/CaseManager_Case_Step_Complete_Handler?CaseStepId='+component.get('v.caseStepId') + '&retURL=/005');
                            var associateFlowUrl = encodeURI('/flow/'+component.get("v.caseManager.caseStepWraperList["+component.get("v.SelectedIndex")+"].StepFlow")+'?recordId='+component.get('v.caseStepId')+'&retURL='+finishFlows);
                            window.open(associateFlowUrl, "_blank");
                        }else{
                            // Else Update the Component Witha Toast Message
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

     //It Will Invoke the flow again when some leave a flow in complete
     restartFlow : function(component,event,helper){
         component.set('v.alreadyFlowRuning',false);
         var currentUrl = window.location.href;
         var finishFlows = encodeURI('/flow/CaseManager_Case_Step_Complete_Handler?CaseStepId='+component.get('v.caseStepId'));
         var associateFlowUrl = encodeURI('/flow/'+component.get("v.caseManager.caseStepWraperList["+component.get("v.SelectedIndex")+"].StepFlow")+'?recordId='+component.get('v.caseStepId')+'&retURL='+finishFlows);
         window.open(associateFlowUrl, "_blank");

     },

     //Using to Hide Confirmation Message after Click
     closeFlowMessageModel : function(component,event,helper){
         component.set('v.alreadyFlowRuning',false);
     },

    // nIt Will Invoke a add new step flow when end-user click on add step button
    startFlowAddStep : function(component, event, helper){
        //Setting Up Variables for Flow
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
                //Invoke a Add Step Flow From User
        flow.startFlow("Create_Case_Step_Flow",inputVariables);
    },

    // CLose Modal Window if User Ending up with Add Steps
    closeModalOnFinish : function(component, event, helper){
        if(event.getParam("status") === "FINISHED_SCREEN" || event.getParam("status") === "FINISHED") {
            component.set("v.openModal",false);
            //Help To Update the View of Component with new Data
            helper._getCaseManagerData(component, component.get('v.recordId'));
        }
    },

    // Hide Modal If User Click on No
    hideModal : function(component, event, helper){
        component.set("v.openModal",false);
        // Update Data for Component
        helper._getCaseManagerData(component, component.get('v.recordId'));
    },

    // If User Click on Next Transition Button It will Help to Update the Case Status
    changeStatus: function(component,event,helper){
        component.set("v.changeCaseStatus",true);
        var oldOrderList = component.get('v.caseManager.recordCasePlan.CaseStatusOrdering__c');
        var res = oldOrderList.split(";");
        var nextStatus ="";
        var valueForList = [];
        // Checking Next Status Is Available or Not
        for (var i = 0; i < res.length; i++) {
            if(res[i] == component.get("v.caseManager.CaseStatus")){
                if(i<res.length){
                    nextStatus = res[i+1];
                }else{
                    nextStatus = "";
                }

            }
        }

        // if Not then Set Empty Next Status
        if(nextStatus == null || nextStatus == undefined){
            nextStatus ="";
        }


        // Setting Up varibales For Case Status Update Flow
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
        // Invoke a flow from here
        flow.startFlow("CaseManager_Case_Management_Next_Status",inputVariables);
    },

    // Invoke on finish of case status change flow
    handleStatusChange : function (component, event, helper) {
          if(event.getParam("status") === "FINISHED_SCREEN") {
             component.set("v.changeCaseStatus",false);
             var outputVariables = event.getParam("outputVariables");
             var outputVar;
             for(var i = 0; i < outputVariables.length; i++) {
                outputVar = outputVariables[i];
                // Refresh Page when Status is Updated
                if(outputVar.name === "AlertMessage") {
                    if(outputVar.value == "Case Status Updated"){
                        window.location.reload(true);
                    }else if( outputVar.value == "Case Plan Setup Completed"){
                        //Show Toast When Case Plan Is Completed
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Success!",
                            "message": outputVar.value
                        });
                        toastEvent.fire();
                    }else{
                        // Show Toast When Required Case Steps is Not Completed
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