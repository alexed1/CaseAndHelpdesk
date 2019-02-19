@isTest
public class updateCallObjectTest {
    @isTest static void UnittestNewLiveCall(){
        user testUser=new user(id=userInfo.getUserId());
        testUser.Cogito_User_ID__c='Test';
        update testUser;
        
        Case testCase=new case();
        testCase.subject='Test Case';
        testCase.Priority='High';
        testCase.Origin='Phone';
        insert testCase;
    }
    
    @isTest static void UnittestExistingLiveCall(){
        user testUser=new user(id=userInfo.getUserId());
        testUser.Cogito_User_ID__c='Test';
        update testUser;
        
        Live_Call_Object__c LiveCall = new Live_Call_Object__c();
        LiveCall.Cogito_User_ID__c='Test';
        insert LiveCall;
        
        Case testCase=new case();
        testCase.subject='Test Case';
        testCase.Priority='High';
        testCase.Origin='Phone';
        insert testCase;
    }
}