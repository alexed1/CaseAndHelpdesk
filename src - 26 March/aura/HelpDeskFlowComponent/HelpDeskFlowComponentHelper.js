({
    fetchCurrentUserProfile : function(component, event,helper) {
        var action = component.get("c.getCurrentUserProfile");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                component.set("v.userProfile", result);
            }  
        });
        $A.enqueueAction(action);
    },
})