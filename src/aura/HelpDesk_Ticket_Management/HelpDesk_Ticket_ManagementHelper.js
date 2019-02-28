({
    fetchUserList : function(component, event) {
        var action = component.get("c.getUserList");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                component.set("v.userMap", result);
            }
        });
        $A.enqueueAction(action);
    },
    handleSelectedUser : function(component, selectedTicketIds) {
        var selectedUser = component.get("v.selectedUser");
        this.UpdateAssigned(component,selectedUser,selectedTicketIds);
    },
    UpdateAssigned : function(component, selectedUser, selectedTicketIds) {
        var action = component.get("c.updateOwner");
        action.setParams({userName : selectedUser,
                          ticketIds:component.get("v.allselectedTicketIds"),
                          selectedIds: selectedTicketIds
         });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                var appEvent = $A.get("e.c:HelpDeskUpdateOwnerEvt");
                appEvent.setParams({
                    "message" : "updated" });
                appEvent.fire();
                this.ticketAssignedToast(component);
            }
        });
        $A.enqueueAction(action);
    },
    ticketAssignedToast : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "type":"success",
            "message": "Tickets Assigned!."
        });
        toastEvent.fire();
    },
    updateTicketStatus : function(component, selectedTicketIds) {
        var action = component.get("c.closeTicket");
        action.setParams({
            ticketIds:component.get("v.allselectedTicketIds"),
            selectedId: selectedTicketIds
        }); 
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                var appEvent = $A.get("e.c:HelpDeskUpdateOwnerEvt");
                appEvent.setParams({
                    "message" : "updated" });
                appEvent.fire();
                this.ticketCloseToast(component);
            }
        });
        $A.enqueueAction(action);
    },
    doFetchTickets : function(component) {
        var action = component.get('c.fetchHelpDeskTickets');
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === 'SUCCESS' && component.isValid()){
                var pageSize = component.get("v.pageSize");
                component.set('v.ticketData', response.getReturnValue());
                // get size of all the records and then hold into an attribute "totalRecords"
                component.set("v.totalRecords", component.get("v.ticketData").length);
                //Set the current Page as 0
                component.set("v.currentPage",0);
                // set start as 0
                component.set("v.startPage",0);
                component.set("v.endPage",pageSize-1);
                var paginationList = [];
                for(var i=0; i< pageSize; i++){
                    if(component.get("v.ticketData").length> i){
                        paginationList.push(response.getReturnValue()[i]);
                		paginationList[i].OwnerId= paginationList[i].Owner.LastName;
                    }
                }
                component.set('v.paginationList', paginationList);
                this.sortData(component, component.get("v.sortedBy"), component.get("v.sortedDirection"));
            }else{
                console.log('ERROR');
            }
        });
        $A.enqueueAction(action);
    },
    next : function(component, event){
        var getPreviousTicket = component.get("v.allselectedTicketIds");
        var current = component.get("v.currentPage");    
        var dTable = component.find("helpDeskTable");
        var selectedRows = dTable.getSelectedRows();
        var pgName = "page" + current;
        component.get("v.selectedTicket")[pgName] = selectedRows;
        var rowsIds = [];
		var allTickets = component.get("v.selectedTicket");
		var x = allTickets[pgName];
        for(var i=0;i<x.length;i++){
            rowsIds.push(x[i].Id);  
        } 
        
        getPreviousTicket.push(rowsIds);
        component.set("v.allselectedTicketIds",getPreviousTicket);
        current = current +1;
        pgName = "page" + current;
        var selectedRows = component.get("v.selectedTicket")[pgName];
        component.set("v.currentPage",current);
        //console.log("Next selectedAccount "+JSON.stringify(component.get("v.selectedTicket")));
        var sObjectList = component.get("v.ticketData");
        var end = component.get("v.endPage");
        var start = component.get("v.startPage");
        var pageSize = component.get("v.pageSize");
        var paginationlist = [];
        var counter = 0;
        for(var i=end+1; i<end+pageSize+1; i++){
            if(sObjectList.length > i){
                sObjectList[i].OwnerId=sObjectList[i].Owner.LastName;
                paginationlist.push(sObjectList[i]);
            }
            counter ++ ;
        }
        start = start + counter;
        end = end + counter;
        component.set("v.startPage",start);
        component.set("v.endPage",end);
        component.set('v.paginationList', paginationlist);
        if (typeof selectedRows != 'undefined' && selectedRows) {
            var selectedRowsIds = [];
            for(var i=0;i<selectedRows.length;i++){
                selectedRowsIds.push(selectedRows[i].Id);  
            }         
            var dTable = component.find("helpDeskTable");
            dTable.set("v.selectedRows", selectedRowsIds); 
        }
    },
    previous : function(component, event){   
        var current = component.get("v.currentPage");
        var dTable = component.find("helpDeskTable");
        var selectedRows = dTable.getSelectedRows();
        var pgName = "page" + current;
        component.get("v.selectedTicket")[pgName] = selectedRows;
        current = current - 1; 
        pgName = "page" + current;
        var selectedRows = component.get("v.selectedTicket")[pgName];
        component.set("v.currentPage",current);
        console.log("Prev selectedAccount "+JSON.stringify(component.get("v.selectedTicket")));        
        var sObjectList = component.get("v.ticketData");
        var end = component.get("v.endPage");
        var start = component.get("v.startPage");
        var pageSize = component.get("v.pageSize");
        var paginationlist = [];
        var counter = 0;
        for(var i= start-pageSize; i < start ; i++){
            if(i > -1){
                paginationlist.push(sObjectList[i]);
                counter ++;
            }else{
                start++;
            }
        }
        start = start - counter;
        end = end - counter;
        component.set("v.startPage",start);
        component.set("v.endPage",end);
        component.set('v.paginationList', paginationlist);
        if (typeof selectedRows != 'undefined' && selectedRows) {
            var selectedRowsIds = [];
            for(var i=0;i<selectedRows.length;i++){
                selectedRowsIds.push(selectedRows[i].Id);  
            }         
            var dTable = component.find("helpDeskTable");
            dTable.set("v.selectedRows", selectedRowsIds);
        }
    },
    showToast : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            mode: 'pester',
            type:'error',
            message: 'Select atleast one ticket'
        });
        toastEvent.fire();
    },
    sortData: function (cmp, fieldName, sortDirection) {
        var data = cmp.get("v.paginationList");
        var reverse = sortDirection !== 'asc';
        data.sort(this.sortBy(fieldName, reverse))
        cmp.set("v.paginationList", data);
    },
    sortBy: function (field, reverse, primer) {
        var key = primer ?
            function(x) {return primer(x[field])} :
            function(x) {return x[field]};
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    },
    ticketCloseToast : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "type":"success",
            "message": "Tickets Closed!."
        });
        toastEvent.fire();
    }
})