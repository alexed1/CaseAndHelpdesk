({
    doInit : function (component,event, helper) {
        helper.fetchCurrentUserProfile(component,event,helper);
    },
    startTicketCreateFlow : function (component) {
        var modalDiv = component.find("modalDiv");
        $A.util.addClass(modalDiv, "slds-show"); 
        $A.util.removeClass(modalDiv, "slds-hide");
        // Find the component whose aura:id is "flowData"
        var flow = component.find("flowData");
        // In that component, start your flow. Reference the flow's Unique Name.
        flow.startFlow("Create_New_HelpDesk_Ticket");
    },
    handleClose : function(component, event, helper) {
        var modalDiv = component.find("modalDiv");
        $A.util.addClass(modalDiv, "slds-hide");
        $A.util.removeClass(modalDiv, "slds-show");
        $A.get('e.force:refreshView').fire();

    },
    startManageTicketFlow : function (component) {
        var modalDiv = component.find("modalDiv");
        $A.util.addClass(modalDiv, "slds-show");
        $A.util.removeClass(modalDiv, "slds-hide");
        var flow = component.find("flowData");
        flow.startFlow("HelpDesk_Management_Flow");
    },
    handleApplicationEvent : function(cmp, event) {
        var message = event.getParam("message");
        // set the handler attributes based on event data
        if(message){
            var modalDiv = cmp.find("modalDiv");
        	$A.util.addClass(modalDiv, "slds-hide");
        	$A.util.removeClass(modalDiv, "slds-show");
            $A.get('e.force:refreshView').fire();
        }
    }
})