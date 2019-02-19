@RestResource(urlMapping='/updateLiveCall')
Global class recieveEventFromCogito{
    
    @HttpPost
    global static void doPost(){
        List<Live_Call_Object__c> LiveCallObjectList = new List<Live_Call_Object__c>();
        // RestRequest req = RestContext.request;
        String responseBody = restcontext.request.requestbody.tostring();
        System.debug('responseBody--'+responseBody);
        JSON2Apex result = recieveEventFromCogito.parse(responseBody);
        if(result != null){
            Live_Call_Object__c LiveCall = new Live_Call_Object__c();
            for(Live_Call_Object__c Live : [select id from Live_Call_Object__c where Cogito_User_ID__c =: result.cogito_user_id order by createddate desc Limit 1 ]){
                LiveCall = Live;
            }
            
            if(string.isNotBlank(result.cogito_user_id)){
                LiveCall.Cogito_User_ID__c = result.cogito_user_id;
            }
            if(result.cx_score != null){
                LiveCall.Current_Cx_Score__c = result.cx_score;
            }
            if(result.Keyword_ch0_count != null){
                LiveCall.Key_Word_Count__c = result.Keyword_ch0_count;
            }
            
            LiveCall.Key_Word_Displayed__c = result.Keyword_ch0_value;
            
            if(result.agentSlowToRespondAlert_count != null){
                LiveCall.Slow_To_Respond_Count__c = result.agentSlowToRespondAlert_count;
            }
            if(result.agentSlowToRespondAlert_active != null){
                LiveCall.Is_slow_to_respond_displayed__c = result.agentSlowToRespondAlert_active;
            }
            if(result.highSilenceAlert_count != null){
                LiveCall.Extended_silence_count__c = result.highSilenceAlert_count;
            }
            if(result.highSilenceAlert_active != null){
                LiveCall.Is_extended_silence_displayed__c = result.highSilenceAlert_active;
            }
            if(result.agentLowSpeakingRateAlert_count != null){
                LiveCall.Speaking_slowly_count__c = result.agentLowSpeakingRateAlert_count;
            }
            if(result.agentLowSpeakingRateAlert_active != null){
                LiveCall.Is_speaking_slowly_displayed__c = result.agentLowSpeakingRateAlert_active;
            }
            if(result.extendedOverlapAlert_count != null){
                LiveCall.Extended_overlap_count__c = result.extendedOverlapAlert_count;
            }
            if(result.extendedOverlapAlert_active != null){
                LiveCall.Is_extended_overlap_displayed__c = result.extendedOverlapAlert_active;
            }
            if(result.agentContinuousSpeakingAlert_count != null){
                LiveCall.Continuous_speaking_count__c = result.agentContinuousSpeakingAlert_count;
            }
            if(result.agentContinuousSpeakingAlert_active != null){
                LiveCall.Is_continuous_speaking_displayed__c = result.agentContinuousSpeakingAlert_active;
            }
            if(result.highSpeakingRateAlert_count != null){
                LiveCall.Speaking_quickly_count__c = result.highSpeakingRateAlert_count;
            }
            if(result.highSpeakingRateAlert_active != null){
                LiveCall.Is_speaking_quickly_displayed__c = result.highSpeakingRateAlert_active;
            }
            if(result.empathyCueAlert_count != null){
                LiveCall.Empathy_Cue_Count__c = result.empathyCueAlert_count;
            }
            if(result.empathyCueAlert_active != null){
                LiveCall.Is_Empathy_Cue_Displayed__c = result.empathyCueAlert_active;
            }
            if(result.agentLowEnergyAlert_count != null){
                LiveCall.Energy_cue_count__c = result.agentLowEnergyAlert_count;
            }
            if(result.agentLowEnergyAlert_active != null){
                LiveCall.Is_energy_cue_displayed__c = result.agentLowEnergyAlert_active;
            }
            LiveCall.Event_Received__c = true;
            LiveCallObjectList.add(LiveCall);   
        }
        if(LiveCallObjectList.size() > 0){
            try{ Upsert LiveCallObjectList; } catch(exception e){}
        }   
        
    }
    
    public class JSON2Apex {
        public String cogito_user_id;
        public Decimal cx_score;
        public Integer Keyword_ch0_count;
        public String Keyword_ch0_value;
        public Integer agentSlowToRespondAlert_count;
        public Boolean agentSlowToRespondAlert_active;
        public Integer highSilenceAlert_count;
        public Boolean highSilenceAlert_active;
        public Integer agentLowSpeakingRateAlert_count;
        public Boolean agentLowSpeakingRateAlert_active;
        public Integer extendedOverlapAlert_count;
        public Boolean extendedOverlapAlert_active;
        public Integer agentContinuousSpeakingAlert_count;
        public Boolean agentContinuousSpeakingAlert_active;
        public Integer highSpeakingRateAlert_count;
        public Boolean highSpeakingRateAlert_active;
        public Integer empathyCueAlert_count;
        public Boolean empathyCueAlert_active;
        public Integer agentLowEnergyAlert_count;
        public Boolean agentLowEnergyAlert_active;
    }
    public static JSON2Apex parse(String json) {
        return (JSON2Apex) System.JSON.deserialize(json, JSON2Apex.class);
    }    
}