/**
 * Created by Shubham on 2/1/2019.
 */
({
    // Invoke will update picklist value for rendered picklist
    invoke : function(component, event, helper){
        console.log('entering invoke for CaseRecordTypePicklistController');
        console.log('vlabelpicklist is: ' + component.get('v.LabelPicklist'));
        if(component.get('v.LabelPicklist') == 'Add to which Case Status'){
            //Update Value In Picklist if Component Call From Add New Plan Step
            var oldOrderList = component.get('v.recordTypeCSV');
            var res = oldOrderList.split(";");
            var valueForList = [];
             for (var i = 0; i < res.length; i++) {
                 valueForList.push({label:res[i],value:res[i],});
             }
            component.set("v.Options",valueForList);
        }else if(component.get('v.LabelPicklist') == 'Run which Flow when this step is started'){
            //Update Value In Picklist if Component Call From Add New Plan Step
            var oldOrderList = component.get('v.recordTypeCSV');
            var res = oldOrderList.split(";");
            var valueForList = [];
             for (var i = 0; i < res.length; i++) {
                 valueForList.push({label:res[i],value:res[i],});
             }
            component.set("v.Options",valueForList);
        }else if(component.get('v.LabelPicklist') == 'Link to which Case Record Type?'){
            //Update Value In Picklist if Component Call From Create Case Plan
            console.log('entering the create case plan scenario');
            var fieldNameArr = component.get('v.Options');
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
                console.log('vrecordTypeCSV is: ' + component.get('v.recordTypeCSV'));
                

                component.set('v.Options', colArr);
                console.log('voptions is: ' + component.get('v.Options'));
            }
        }else if(component.get('v.LabelPicklist') == 'Specify a predecessor (parent) case step'){
            //Update Value In Picklist if Component Call From Add New Plan Step
            var fieldNameArr = component.get('v.Options');
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