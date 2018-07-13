module.exports = function(RED) {
  function UUID(config) {
    RED.nodes.createNode(this,config);

    let node = this;
    let success = true;
    let errorMessage = "";
    let result = "";
    this.field = config.field || "payload";
    this.fieldType = config.fieldType || "msg";

    this.on('input', function(msg) {
      let uuidVersion = "";
      let namespaceType = "";
      let namespace = "";
      let namespaceCustom = "";

      //Check if we need to use programmatic values
      if(msg.agiliteUtils){
        if(msg.agiliteUtils.uuidVersion){
          if(msg.agiliteUtils.uuidVersion !== ""){
            uuidVersion = msg.agiliteUtils.uuidVersion;
          }
        }

        if(msg.agiliteUtils.namespaceType){
          if(msg.agiliteUtils.namespaceType !== ""){
            namespaceType = msg.agiliteUtils.namespaceType;
          }
        }

        if(msg.agiliteUtils.namespace){
          if(msg.agiliteUtils.namespace !== ""){
            namespace = msg.agiliteUtils.namespace;
          }
        } 
        
        if(msg.agiliteUtils.namespaceCustom){
          if(msg.agiliteUtils.namespaceCustom !== ""){
            namespaceCustom = msg.agiliteUtils.namespaceCustom;
          }
        }
      }

      if(uuidVersion === ""){
        uuidVersion = config.uuidVersion;
      }

      if(namespaceType === ""){
        namespaceType = config.namespaceType;
      }

      if(namespace === ""){
        namespace = config.namespace;
      }

      if(namespaceCustom === ""){
        namespaceCustom = config.namespaceCustom;
      }

      //Validate Data
      if(uuidVersion === ""){
        success = false;
        errorMessage = "No UUID Version was provided";
      }else{
        switch(uuidVersion){
          case "v3":
          case "v5":
            if(namespaceType === ""){
              success = false;
              errorMessage = "No Namespace Type was provided";
            }else if(namespace === ""){
              success = false;
              errorMessage = "No Namespace was provided";
            }else if(namespaceType === "custom" && namespaceCustom === ""){
                success = false;
                errorMessage = "No custom Namespace Type was provided";
              }

            break;
        }        
      }

      if(!success){
        node.error(errorMessage, msg);
        return false;
      }

      //Process Function
      const uuid = require("uuid/" + uuidVersion);

      switch(uuidVersion){
        case "v1":
        case "v4":
          result = uuid();
          break;
        case "v3":
        case "v5":
          switch(namespaceType){
            case "dns":
              result = uuid(namespace, uuid.DNS);
              break;
            case "url":
              result = uuid(namespace, uuid.URL);
              break;
            case "custom":
              result = uuid(namespace, namespaceCustom);
              break;
          }
          break;                  
      }

      switch (node.fieldType) {
        case "msg":
            RED.util.setMessageProperty(msg, node.field, result);
            break; 
        case "flow":
            node.context().flow.set(node.field, result);
            break;
        case "global":
            node.context().global.set(node.field, result);
            break;
    }
      node.send(msg);
    });
  }

  RED.nodes.registerType("uuid", UUID);
}
