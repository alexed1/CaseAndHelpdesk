({
    doInit: function(component, event, helper) {
        component.set('v.columns', [{
                label: 'Ticket Number',
                fieldName: 'Name',
                type: 'Auto Number',
            	sortable: true
            },
            {
            label: 'Subject',
                fieldName: 'Subject__c',
                type: 'Text'
            },
            {
                label: 'Type',
                fieldName: 'Category__c',
                type: 'Picklist',
                sortable: true
            },
            {
                label: 'Status',
                fieldName: 'Status__c',
                type: 'Picklist',
                sortable: true
            },
           {
            label: 'Owner',
                fieldName: 'OwnerId',
                type: 'Text',
                sortable: false
            }
        ]);
        helper.doFetchTickets(component);
    },
    
    getSelectedName: function (cmp, event) {
        //save the selected rows into a flow-accessible attribute
        let selectedRows = event.getParam('selectedRows');
        cmp.set("v.selectedRows", selectedRows);
		let arr = [];        
        // Display that fieldName of the selected rows
        for (var i = 0; i < selectedRows.length; i++){
            arr.push(selectedRows[i].Id);
        }
        cmp.set("v.selectedTicketIds", arr);
    },
    handleAssignTicket : function(component, event, helper) {
        let tableDiv = component.find("tableId");
        let assignDiv = component.find("assignDiv");
        let alltickets =component.get("v.allselectedTicketIds");
        let selectedTicketIds =component.get("v.selectedTicketIds");
        if(alltickets.length>0 || selectedTicketIds.length>0){
            $A.util.addClass(tableDiv, "slds-hide");
        	$A.util.removeClass(tableDiv, "slds-show");
            $A.util.addClass(assignDiv, "slds-show");
            $A.util.removeClass(assignDiv, "slds-hide");
            helper.fetchUserList(component,event,helper);
        }else{
            helper.showToast(component, event, helper);
        }

    },
    handleSelectedUser : function(component, event, helper) {
        let selectedTicketIds =component.get("v.selectedTicketIds");
        helper.handleSelectedUser(component,selectedTicketIds);
    },
    handleCloseTicket : function(component, event, helper) {
        let selectedTicketIds =component.get("v.selectedTicketIds");
        let alltickets =component.get("v.allselectedTicketIds");
        if(alltickets.length>0 || selectedTicketIds.length>0){
        	helper.updateTicketStatus(component,selectedTicketIds);
        }else{
            helper.showToast(component, event, helper);
        }

    },
    next: function (component, event, helper) {
        helper.next(component, event);
    },
    previous: function (component, event, helper) {
        helper.previous(component, event);
    },
    updateColumnSorting: function (cmp, event, helper) {
        let fieldName = event.getParam('fieldName');
        let sortDirection = event.getParam('sortDirection');
        cmp.set("v.sortedBy", fieldName);
        cmp.set("v.sortedDirection", sortDirection);
        helper.sortData(cmp, fieldName, sortDirection);
    } 
})