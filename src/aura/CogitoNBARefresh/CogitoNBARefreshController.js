({
    doInit : function(component, event, helper) {
        function refreshNBA(){
            var appEvt = $A.get("e.lightning:nextBestActionsRefresh");
            if (!$A.util.isEmpty(component.get("v.recordId"))){
                appEvt.setParam("recordId", component.get("v.recordId"));
            }
            appEvt.fire(); 
            //setInterval(function(){ refreshNBA(); }, 5000);
            
        }
        //refreshNBA();
        //setInterval(refreshNBA, 1000);
        setInterval(refreshNBA, 500);
    }
})