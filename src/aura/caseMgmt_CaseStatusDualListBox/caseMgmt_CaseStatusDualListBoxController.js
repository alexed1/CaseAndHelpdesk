/**
 * Created by Shubham on 1/23/2019.
 */
({
        invoke : function(component, event, helper) {
            console.log('invoke>>>');
            if(!component.get('v.isEditScreen')){
                var oldOrderList = component.get('v.StatusOrder');
                var res;
                if(oldOrderList){
                   res = oldOrderList.split(";");   
                }
                var valueForList = [];
                for (var i = 0; i < res.length; i++) {
                    valueForList.push({label:res[i],value:res[i],});
                }
                component.set("v.options",valueForList);
            }else{
                var res;
                var oldOrderList = component.get('v.StatusOrder');
                var selectedOrderList = component.get('v.SelectedStatusOrder');
                if(oldOrderList){
                	res = oldOrderList.split(";");
                }
                var selectedRes = selectedOrderList.split(";");
                var flag =0;
                var items = [];
                for (var i = 0; i < res.length; i++) {
                    var item = {
                           "label": res[i],
                           "value": res[i],
                        };
                        items.push(item);
                }
                console.log('Items: ' + items);
                console.log('selectedRes: ' + selectedRes);
                component.set("v.options", items);
                component.set("v.values", selectedRes);
                console.log('Chnage : ');
                var selectedOptionValue = component.get("v.values");
                var newOrder= "";
                for(var i=0; i< selectedOptionValue.length; i++){
                    if(newOrder.length <=0){
                        newOrder = selectedOptionValue[i];
                    }else{
                        newOrder = newOrder + ";" + selectedOptionValue[i];
                    }
                }
                component.set('v.SelectedValue',newOrder);
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
             component.set('v.SelectedValue',newOrder);

         }
})