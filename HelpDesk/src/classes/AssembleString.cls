global class AssembleString {
    /**
    * Created by Ashish Pandey on 20/1/19.
    * Method:getAllHelpDeskNotes
    * comment: @InvocableMethod allowed it to be called from cloud flow or PB
    * parameter:parent record Id
    * return:all helpdesk Notes body in a specified format as:
    * 
    * 	Note History
        ---------------
        Created: 12/10/18
        Did some more research and found out foo
        ----------------
        Created: 12/9/18
		Did initial research and found out bar

    */
    
    @InvocableMethod(label='Get Notes Body' description='Returns the list of HelpDeskNotes Body corresponding to the specified Parent IDs.') 
    global static List<string> getAllHelpDeskNotes(List<String> recordId){
        
        List<HelpDesk_Note__c> listOfNotes = new List<HelpDesk_Note__c>();
        listOfNotes=[Select Body__c,CreatedDate from HelpDesk_Note__c where HelpDesk_Ticket__c IN:recordId ORDER BY CreatedDate DESC];
	    List<String> stringOfNotes = new List<String>();
        for(HelpDesk_Note__c item: listOfNotes) {
            stringOfNotes.add(String.valueOf(item.CreatedDate.format()));
            stringOfNotes.add('<br/>');
            stringOfNotes.add(String.valueOf(item.Body__c));
            stringOfNotes.add('<br/>');
            stringOfNotes.add('-----------------------------------');
            stringOfNotes.add('<br/>');
        }
        String result = String.join(stringOfNotes, ', ');
        result = result.replace(',', '');
        return result.split('\n');
    }

}