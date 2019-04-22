@isTest
private class AssembleStringTest{
    @isTest
    static void TestgetAllHelpDeskNotes(){
        Test.startTest();

        HelpDesk_Ticket__c ticket = new HelpDesk_Ticket__c(
          Status__c = 'Closed',          // Status
          Category__c = 'Question',        // Category
          Subject__c = 'Subject3',         // Subject
          Description__c = 'description'  // Description
        );
        insert ticket;
        HelpDesk_Note__c notes = new HelpDesk_Note__c(
          HelpDesk_Ticket__c = ticket.Id,
          Body__c = 'some body goes here'
        );
        insert notes;
        List<String> ticketsIds = new List<String>{ticket.Id};
        AssembleString.getAllHelpDeskNotes(ticketsIds);
        Test.stopTest();
        ticket = [Select Id From HelpDesk_Ticket__c where ID = :ticket.id];
        System.assertNotEquals(null,ticket);
    }
}