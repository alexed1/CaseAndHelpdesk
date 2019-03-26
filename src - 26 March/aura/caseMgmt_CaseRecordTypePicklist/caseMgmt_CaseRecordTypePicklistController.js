/**
 * Created by Shubham on 2/1/2019.
 */
({
    invoke : function(component, event, helper){
        if(component.get('v.LabelPicklist') == 'Add to which Case Status'){
            console.log(component.get('v.recordTypeCSV'));
            var oldOrderList = component.get('v.recordTypeCSV');
            var res = oldOrderList.split(";");
            var valueForList = [];
             for (var i = 0; i < res.length; i++) {
                 valueForList.push({label:res[i],value:res[i],});
             }
            component.set("v.Options",valueForList);
        }else if(component.get('v.LabelPicklist') == 'Run which Flow when this step is started'){
            console.log(component.get('v.recordTypeCSV'));
            var oldOrderList = component.get('v.recordTypeCSV');
            var res = oldOrderList.split(";");
            var valueForList = [];
             for (var i = 0; i < res.length; i++) {
                 valueForList.push({label:res[i],value:res[i],});
             }
            component.set("v.Options",valueForList);
        }else if(component.get('v.LabelPicklist') == 'Link this Case Plan to Support Process'){
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
        }else if(component.get('v.LabelPicklist') == 'Specify a predecessor (parent) case step'){
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