({
    CSV2JSON : function (component,csv) {
        var arr = [];
        arr =  csv.split('\n');
        var jsonObj = [];
        var headers = arr[0].split(',');
        for(var i = 1; i < arr.length; i++) {
            var data = arr[i].split(',');
            var obj = {};
            for(var j = 0; j < data.length; j++) {
                obj[headers[j].trim()] = data[j].trim();
            }
            jsonObj.push(obj);
        }
        return JSON.stringify(jsonObj);
    },

    processDataHelper : function (component,event) {
        component.set("v.showSpinner",true);
        const fileInput = component.find("fileRawData").getElement();
        const file = fileInput.files[0];
        component.set('v.columns', [
            {label: 'Description', fieldName: 'labelName', type: 'text'},
            {label: 'Count', fieldName: 'resultCount', type: 'Integer'}
        ]);

        if (file){
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = $A.getCallback(function (evt) {
                var csv = evt.target.result;
                var result = this.CSV2JSON(component,csv);
                component.set("v.jsonData",result);
                component.set("v.showSpinner",false);
                component.set("v.showcard",true);
            });
        }
    },

    insertCampaignMembersHelper : function (component,event,helper) {
        component.set("v.showSpinner",true);
        component.set('v.columns', [
            {label: 'Description', fieldName: 'labelName', type: 'text'},
            {label: 'Count', fieldName: 'resultCount', type: 'Integer'}
        ]);        
        var campMemberInsert = component.get("c.insertMembersFromCSVFile");
        campMemberInsert.setParams({
            "dataFromSpreadsheet":component.get("v.jsonData"),
            "campaignId":component.get("v.recordId")
        });
        campMemberInsert.setCallback(this, function(response){
            var toastEvent = $A.get("e.force:showToast");
            var state = response.getState();
            if (state === "SUCCESS") {
                var responseText = response.getReturnValue();
                if(responseText.isSuccess){
                    component.set("v.showcard",false);
                    component.set("v.showSpinner",false);
                    component.set('v.resultData', responseText.listResults);
                    component.set("v.displayResultData",true);
                }
                if(!responseText.isSuccess){
                    toastEvent.setParams({
                        "type":"error",
                        "duration":3000,
                        "title": "ERROR",
                        "message": responseText.errorMessage
                    });
                    toastEvent.fire();
                    $A.get("e.force:closeQuickAction").fire();
                    $A.get('e.force:refreshView').fire();
                    component.set("v.showSpinner",false);
                }
            }
        });
        $A.enqueueAction(campMemberInsert);
    },    

    closeModalHelper : function(component,event,helper){
        $A.get("e.force:closeQuickAction").fire();
        $A.get('e.force:refreshView').fire();
	},
})
