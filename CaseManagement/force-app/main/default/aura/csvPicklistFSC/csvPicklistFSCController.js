({
    // Invoke will update picklist value for rendered picklist
    invoke : function(component, event, helper){
		var listType = component.get('v.listType');
        if(listType == 'simple'){
            helper.generateFromSimpleList(component.get('v.CSVString').split(","), component);         
        } else //each list member is complex, which means semicolon separated
        {
            var stringList = component.get('v.CSVString').split(',');
            if(stringList){
                helper.generateFromCommaSeparatedSublist(stringList, component);     
            } 
        }
            
    }
})