const uuidv1 = require('uuid/v1');
const uuidv3 = require('uuid/v3');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');

module.exports = function(RED) {

    function UUID(config) {
        RED.nodes.createNode(this, config);

        let node = this;
        let success = true;
        let errorMessage = "";
        let result = "";
        this.field = config.field || "payload";
        this.fieldType = config.fieldType || "msg";

        this.on('input', function(msg) {
          console.log(config)
            let uuidVersion = "";
            let namespaceType = "";
            let namespace = "";
            let namespaceCustom = "";

            // Check if we need to use programmatic values
            if (msg.agiliteUtils) {
                if (msg.agiliteUtils.uuidVersion) {
                    if (msg.agiliteUtils.uuidVersion !== "") {
                        uuidVersion = msg.agiliteUtils.uuidVersion;
                    }
                }

                if (msg.agiliteUtils.namespaceType) {
                    if (msg.agiliteUtils.namespaceType !== "") {
                        namespaceType = msg.agiliteUtils.namespaceType;
                    }
                }

                if (msg.agiliteUtils.namespace) {
                    if (msg.agiliteUtils.namespace !== "") {
                        namespace = msg.agiliteUtils.namespace;
                    }
                }

                if (msg.agiliteUtils.namespaceCustom) {
                    if (msg.agiliteUtils.namespaceCustom !== "") {
                        namespaceCustom = msg.agiliteUtils.namespaceCustom;
                    }
                }
            }

            if (uuidVersion === "") {
                uuidVersion = config.uuidVersion;
            }

            if (namespaceType === "") {
                namespaceType = config.namespaceType;
            }

            if (namespace === "") {
                namespace = config.namespace;
            }

            if (namespaceCustom === "") {
                namespaceCustom = config.namespaceCustom;
            }

            //Fix to also handle is msg.a
            if (namespaceCustom === "") {
              namespaceCustom = config.namespaceCustom;
            }

            if (namespaceCustom === "") {
              namespaceCustom = config.namespaceCustom;
            }


            // Validate Data
            if (uuidVersion === "") {
                success = false;
                errorMessage = "No UUID Version was provided";
            } else {
                switch (uuidVersion) {
                    case "v3":
                    case "v5":
                        if (namespaceType === "") {
                            success = false;
                            errorMessage = "No Namespace Type was provided";
                        } else if (namespace === "") {
                            success = false;
                            errorMessage = "No Namespace was provided";
                        } else if (namespaceType === "custom" && namespaceCustom === "") {
                            success = false;
                            errorMessage = "No custom Namespace Type was provided";
                        }

                        break;
                }
            }

            if (!success) {
                node.error(errorMessage, msg);
                return false;
            }

            // Process Function
            try {
                switch (uuidVersion) {
                    case "v1":
                        result = uuidv1();
                        break;
                    case "v4":
                        result = uuidv4();
                        break;
                    case "v3":
                        switch (namespaceType) {
                            case "dns":
                                result = uuidv3(namespace, uuidv3.DNS);
                                break;
                            case "url":
                                result = uuidv3(namespace, uuidv3.URL);
                                break;
                            case "custom":
                                // Here you need to ensure namespaceCustom is a valid UUID
                                result = uuidv3(namespace, namespaceCustom);
                                break;
                        }
                        break;
                    case "v5":
                        switch (namespaceType) {
                            case "dns":
                                result = uuidv5(namespace, uuidv5.DNS);
                                break;
                            case "url":
                                result = uuidv5(namespace, uuidv5.DNS);
                                break;
                            case "custom":
                                // Here you need to ensure namespaceCustom is a valid UUID
                                result = uuidv5(namespace, namespaceCustom);
                                break;
                        }
                        break;
                }
            } catch (err) {
                node.error("Error generating UUID: " + err.message, msg);
                return;
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
};
