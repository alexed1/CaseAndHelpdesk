/**
 * Created by Shubham on 2/1/2019.
 */
({
    // Invoke will update picklist value for rendered picklist
    invoke : function(component, event, helper){
		var oldOrderList = component.get('v.recordTypeCSV');
        var fieldNameArr = component.get('v.Options');
        if(component.get('v.LabelPicklist') == component.get('v.caseStatusLabel')){
            //Update Value In Picklist if Component Call From Add New Plan Step
            var res = oldOrderList.split(";");
            var valueForList = [];
             for (var i = 0; i < res.length; i++) {
                 valueForList.push({label:res[i],value:res[i],});
             }
            component.set("v.Options",valueForList);
        }else if(component.get('v.LabelPicklist') == component.get('v.predecessorLabel') || component.get('v.LabelPicklist') == component.get('v.recordTypeLabel')){
            //Update Value In Picklist if Component Call From Add New Plan Step
            var colsStr = component.get('v.recordTypeCSV');
            var colStrArr = colsStr.split(';');
            if(colStrArr){
                var colArr = new Array();
                for(var i = 0; i < colStrArr.length; i++){
                    var colDetailArr = colStrArr[i].split(',');
                    if(colDetailArr.length === 2){
                    	var colObj = {label: colDetailArr[1], value: colDetailArr[0]};
                        colArr.push(colObj);
                    }
                }
                component.set('v.Options', colArr);
            }
        }
    },
})