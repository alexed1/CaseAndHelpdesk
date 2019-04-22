@isTest
private class HelpDesk_Ticket_Management_Ctrl_Test{
    @isTest
    static void TestfetchHelpDeskTickets(){
        Test.startTest();
        Id ticket = createHelpDeskTicket();
        System.assertNotEquals(null,ticket);
        HelpDesk_Ticket_Management_Ctrl.fetchHelpDeskTickets();
        Test.stopTest();
    }
    @isTest
    static void TestgetUserList(){
        Test.startTest();
		String username = createUser();
        System.assertNotEquals(null,username);
		HelpDesk_Ticket_Management_Ctrl.getUserList();
        Test.stopTest();
    }
    @isTest
    static void TestgetCurrentUserProfile(){
        Test.startTest();
		String username = createUser();
        System.assertNotEquals(null,username);
		HelpDesk_Ticket_Management_Ctrl.getCurrentUserProfile();
        Test.stopTest();
    }
    @isTest
    static void TestupdateOwner(){
        Test.startTest();
        String username = createUser();
        System.assertNotEquals(null,username);
        Id ticket = createHelpDeskTicket();
        Id ticket2 = createHelpDeskTicket();
        System.assertNotEquals(null,ticket);
        List<List<String>> tickets = new List<List<String>>();
        List<String> ticketsIds = new List<String>{ticket,ticket2};
        tickets.add(ticketsIds);
        HelpDesk_Ticket_Management_Ctrl.updateOwner(username,tickets,ticketsIds);
        Test.stopTest();
    }
    @isTest
    static void TestcloseTicket(){
        Test.startTest();
        Id ticket = createHelpDeskTicket();
        System.assertNotEquals(null,ticket);
        List<List<String>> tickets = new List<List<String>>();
        List<String> ticketsIds = new List<String>{ticket};
        tickets.add(ticketsIds);
        HelpDesk_Ticket_Management_Ctrl.closeTicket(tickets,ticketsIds);
        Test.stopTest();
    }
    private static Id createHelpDeskTicket() {
        HelpDesk_Ticket__c ticket = new HelpDesk_Ticket__c(
            Status__c = 'Closed',
            Category__c = 'Question',
            Subject__c = 'sub',
            Description__c = 'description'
        );
        insert ticket;
        return ticket.Id;
    }
    private static String createUser() {
        User u = new User(
             ProfileId = [SELECT Id FROM Profile WHERE Name = 'System Administrator'].Id,
             LastName = 'last',
             Email = 'testhelpdesk@test.com',
             Username = 'testhelpdesk@amamama.com' + System.currentTimeMillis(),
             CompanyName = 'TEST',
             Title = 'title',
             Alias = 'alias',
             TimeZoneSidKey = 'America/Los_Angeles',
             EmailEncodingKey = 'UTF-8',
             LanguageLocaleKey = 'en_US',
             LocaleSidKey = 'en_US'
        );
        insert u;
        return u.LastName;
    }
}