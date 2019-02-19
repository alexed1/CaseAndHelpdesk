trigger UpdateCallObject on Case (before insert) {
    //get the current user with their cogito user id...
    User currentuser = [Select Id,Name,Cogito_User_ID__c from User where Id=:userinfo.getuserId()];
    String LiveObjectId;
    
    List<Live_Call_Object__c> LiveCallObjectList = new List<Live_Call_Object__c>();
    
    if(currentuser != null && String.isNotBlank(currentuser.Cogito_User_ID__c)){
        //Check for existing Live object records for that user...
        for(Live_Call_Object__c live:[select id,name,Cogito_User_ID__c from Live_Call_Object__c where Cogito_User_ID__c =: currentuser.Cogito_User_ID__c limit 1]){
            LiveObjectId = live.id;
        }
        
        //if the live object record is not found create one with current user cogito id....
        if(String.isBlank(LiveObjectId) && String.isNotBlank(currentuser.Cogito_User_ID__c)){
            Live_Call_Object__c LiveCall = new Live_Call_Object__c();
            LiveCall.Cogito_User_ID__c=currentuser.Cogito_User_ID__c;
            LiveCallObjectList.add(LiveCall);
        }
        
        if(!LiveCallObjectList.isEmpty()){
            //insert the new live object record and assign the id of the record to LiveObjectId...
            try{ insert LiveCallObjectList ; LiveObjectId=LiveCallObjectList[0].id; }Catch(dmlException e){}
        }
    }
    
    
    for(case cases :trigger.new){
        if(String.isNotBlank(LiveObjectId)){
            //Assign the created or existing live object record to the case...
            cases.Live_Call_Object__c = LiveObjectId ;
        }
    }
    
}