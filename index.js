({
    processData : function (component, event, helper){
        component.set("v.showSpinner",true);
        const fileInput = component.find("fileRawData").getElement();
        const file = fileInput.files[0];
    },
})
