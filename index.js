({
    processData : function (component, event, helper){
        component.set("v.showSpinner",true);
        const fileInput = component.find("fileRawData").getElement();
        const file = fileInput.files[0];
        if (file){
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                var csv = evt.target.result;
                var result = helper.CSV2JSON(component,csv);
                component.set("v.jsonData",result);
                component.set("v.showSpinner",false);
                component.set("v.showcard",true);
            }
        }
    };

    insertCampaignMembers : function(component, event, helper) {
        helper.insertCampaignMembersHelper(component,event);
    },

    closeModal : function(component,event,helper){
        helper.closeModalHelper(component,event);
	};
})
