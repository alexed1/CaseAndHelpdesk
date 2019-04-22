global class HelpDesk_Ticket_Management_Ctrl {
    /**
    * Created by 7Summits on 20/1/19.
    * Apex Controller for HelpDesk_Ticket_Management & HelpDeskFLowComponent lightning component
    */
    @AuraEnabled
    global static List < HelpDesk_Ticket__c > fetchHelpDeskTickets() {
        return [ SELECT Id, Name,OwnerId,Owner.Name,Owner.LastName,Category__c, Description__c, Status__c,Subject__c FROM HelpDesk_Ticket__c where Status__c!='Closed'];
    }
    
    @AuraEnabled
    global static List<String> getUserList() {
        List<User> userList=[select Name from User WHERE IsActive = true]; 
        List<String> username = new List<String>();
        for(User u :userList){
            username.add(u.Name);
        }
        return username; 
    }
    @AuraEnabled
    global static String getCurrentUserProfile() {
        Id profileId=userinfo.getProfileId();
        String profileName=[Select Id,Name from Profile where Id=:profileId].Name;
        return profileName;
    }
    @AuraEnabled
    global static void updateOwner(String userName,List<List<String>> ticketIds, List<String> selectedIds) {
        List<String> ids = new List<String>();
        for(List<String> tickets :ticketIds){
            ids.addAll(tickets);
        }
        ids.addAll(selectedIds);
        List<User> userList=[select Id,Name from User WHERE Name =: userName LIMIT 1];
		List<HelpDesk_Ticket__c> helpDesk =[ SELECT Id,OwnerId, Name,Category__c, Description__c, Status__c,Subject__c FROM HelpDesk_Ticket__c where Id IN:ids];
        for(HelpDesk_Ticket__c tickets :helpDesk){
            tickets.OwnerId=userList[0].Id;
            tickets.Status__c='Assigned';
        }
        try{
            if(helpDesk.size()>0){
               update helpDesk;
            }
            
        }catch(Exception e){
            System.debug('Exception e'+e);
        }
        
    }
    @AuraEnabled
    global static void closeTicket(List<List<String>> ticketIds, List<String> selectedId) {
        List<String> ids = new List<String>();
        for(List<String> tickets :ticketIds){
            ids.addAll(tickets);
        }
        ids.addAll(selectedId);
		List<HelpDesk_Ticket__c> helpDesk =[ SELECT Id,Status__c FROM HelpDesk_Ticket__c where Id IN:ids];
        for(HelpDesk_Ticket__c tickets :helpDesk){
            tickets.Status__c='Closed';
        }
        try{
            if(helpDesk.size()>0){
            	update helpDesk;
            }
        }catch(Exception e){
            System.debug('Exception e'+e);
        }
    }
}