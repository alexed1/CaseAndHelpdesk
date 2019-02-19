@isTest
public class recieveEventFromCogitoTest {
    @isTest static void UnitTest(){
        restRequest req=new restRequest();
        restResponse res=new restResponse();
        req.requestURI='/services/apexrest/updateLiveCall';
        req.requestBody=blob.valueOf('{ "cogito_user_id": "agent001", "cx_score": 9.6, "Keyword_ch0_count": 2, "Keyword_ch0_value": "test", "agentSlowToRespondAlert_count": 0, "agentSlowToRespondAlert_active": false, "highSilenceAlert_count": 0, "highSilenceAlert_active": false, "agentLowSpeakingRateAlert_count": 0, "agentLowSpeakingRateAlert_active": false, "extendedOverlapAlert_count": 0, "extendedOverlapAlert_active": false, "agentContinuousSpeakingAlert_count": 0, "agentContinuousSpeakingAlert_active": false, "highSpeakingRateAlert_count": 0, "highSpeakingRateAlert_active": false, "empathyCueAlert_count": 0, "empathyCueAlert_active": false, "agentLowEnergyAlert_count": 0, "agentLowEnergyAlert_active": false}');
        req.httpMethod='POST';
        
        restContext.request=req;
        restContext.response=res;
        
        test.startTest();
        	recieveEventFromCogito.doPost();
        test.stopTest();
    }
    
    @isTest static void UnitTestExisting(){
        Live_Call_Object__c LiveCall = new Live_Call_Object__c();
        LiveCall.Cogito_User_ID__c='agent001';
        insert LiveCall;
        
        restRequest req=new restRequest();
        restResponse res=new restresponse();
        req.requestURI='/services/apexrest/updateLiveCall';
        req.requestBody=blob.valueOf('{ "cogito_user_id": "agent001", "cx_score": 9.6, "Keyword_ch0_count": 2, "Keyword_ch0_value": "test", "agentSlowToRespondAlert_count": 0, "agentSlowToRespondAlert_active": false, "highSilenceAlert_count": 0, "highSilenceAlert_active": false, "agentLowSpeakingRateAlert_count": 0, "agentLowSpeakingRateAlert_active": false, "extendedOverlapAlert_count": 0, "extendedOverlapAlert_active": false, "agentContinuousSpeakingAlert_count": 0, "agentContinuousSpeakingAlert_active": false, "highSpeakingRateAlert_count": 0, "highSpeakingRateAlert_active": false, "empathyCueAlert_count": 0, "empathyCueAlert_active": false, "agentLowEnergyAlert_count": 0, "agentLowEnergyAlert_active": false}');
        req.httpMethod='POST';
        
        restContext.request=req;
        restContext.response=res;
        
        test.startTest();
        	recieveEventFromCogito.doPost();
        test.stopTest();
    }
}