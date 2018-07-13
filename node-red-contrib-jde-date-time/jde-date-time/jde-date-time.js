module.exports = function(RED){
    function JDEDateTime(config){
        RED.nodes.createNode(this, config);
        this.field = config.field || "payload";
        this.fieldType = config.fieldType || "msg";
        var node = this;

        const jde = require('jde-date-time');
        const Mustache = require('mustache');
        

        this.on("input", function(msg){
            //Declcare variables for each of the input fields
            let actionType = config.actionType;
            let dateTimeValue = config.dateTimeValue;
            let success = true;
            let errorMessage = "";

            //Validate Fields
            if (config.actionType === ""){
                success = false;
                errorMessage = "Please select an Action Type";
            }else if(config.dateTimeValue === ""){
                success = false;
                errorMessage = "Please provide a Date/Time Value";
            }

            if(!success){
                node.error(errorMessage, msg);
                return false;
            }

            dateTimeValue = Mustache.render(dateTimeValue, msg);

            //Process logic based on actionType
            switch (actionType){
                case "1":
                dateTimeValue = jde.convertJDEDateToJSDate(dateTimeValue);
                break;
                case "2":
                dateTimeValue = jde.convertJDETimeToJSTime(dateTimeValue);
                break;
                case "3":
                dateTimeValue = jde.convertJSDateToJDEDate(dateTimeValue);
                break;
                case "4":
                dateTimeValue = jde.convertJSTimeToJDETime(dateTimeValue);
                break;
            }

            switch (node.fieldType) {
                case "msg":
                    RED.util.setMessageProperty(msg, node.field, dateTimeValue);
                    break;
                case "flow":
                    node.context().flow.set(node.field, dateTimeValue);
                    break;
                case "global":
                    node.context().global.set(node.field, dateTimeValue);
                    break;
            }
            
            
            node.send(msg);
        });
    }

    RED.nodes.registerType("jde-date-time", JDEDateTime);

}