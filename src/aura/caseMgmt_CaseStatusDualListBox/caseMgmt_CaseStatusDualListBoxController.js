/**
 * Created by Shubham on 1/23/2019.
 */
({
        invoke : function(component, event, helper) {
            if(!component.get('v.isEditScreen')){
                console.log(component.get('v.StatusOrder'));
                var oldOrderList = component.get('v.StatusOrder');
                var res = oldOrderList.split(";");
                var valueForList = [];
                for (var i = 0; i < res.length; i++) {
                    valueForList.push({label:res[i],value:res[i],});
                }
                component.set("v.options",valueForList);
            }else{
                var oldOrderList = component.get('v.StatusOrder');
                var selectedOrderList = component.get('v.SelectedStatusOrder');
                var res = oldOrderList.split(";");
                var selectedRes = selectedOrderList.split(";");
                var flag =0;
                var items = [];
                for (var i = 0; i < res.length; i++) {
                    flag = 0;
                    for(var j = 0; j<selectedRes.length; j++){
                        if(res[i] == selectedRes[j]){
                            flag=1;
                        }
                    }
                    if(flag==1){
                        var item = {
                           "label": res[i],
                           "value": res[i],
                        };
                        items.push(item);
                    }
                }
                component.set("v.options", items);
                component.set("v.values", selectedRes);
            }
         },

         handleChange : function(component, event, helper){
             console.log('Chnage : ');
             var selectedOptionValue = event.getParam("value");
             var newOrder= "";
             for(var i=0; i< selectedOptionValue.length; i++){
                 if(newOrder.length <=0){
                    newOrder = selectedOptionValue[i];
                 }else{
                      newOrder = newOrder + ";" + selectedOptionValue[i];
                 }

             }
             component.set('v.StatusOrder',newOrder);

         }
})