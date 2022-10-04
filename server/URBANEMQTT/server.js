const mqttCallbackService = require("./callback");
module.exports = {
    data(port, username, password) {
        return `
        const mqttCallbackService = require("./callback");
    startServer() {
        const aedes = require("aedes")();
        let port = ${port};
        let clients = {};
        aedes.authenticate = function (client, username, password, callback) {
            console.log("in authenticate");
            let authorized =
                username === '${username}' &&
                password.toString() === '${password}',;
            if (authorized) {
                client.user = username;
            } else {
                let error = new Error("Auth error");
                error.returnCode = 1;
                return callback(error, null);
            }
            return callback(null, authorized);
        };

        aedes.authorizePublish = function (client, packet, callback) {
            // let data = payload.toString();
            // console.log('client', client);
            let topic = packet.topic;
            let data = packet.payload.toString();
            data = JSON.parse(data);
            
            let imei = topic
                .toString()
                .substr('/data/mqtt/iot'.toString().length);
            if (!clients[imei]) {
                clients[imei] = client.id;
            }
            if (!data.a) {
                return;
            }
            if (data.a) {
                //manage your business logic here  such as managing each cmd in your system structure
            }
            callback(null);
        };

        aedes.authorizeSubscribe = function (client, sub, callback) {
            // let data = payload.toString();
            console.log("client", client.id);
            let imei = sub.topic;
            // console.log('topic', imei);
            if (!clients[imei]) {
                clients[imei] = client.id;
            }

            callback(null, sub);
        };
        this.publish(topic, data, callback);
        this.subscribe(topic, callback);
        const server = require("net").createServer(aedes.handle);
        server.listen(port,  () => {
            console.log("server listening on port", port);
            mqttCallbackService.subscribeIot();
        });
    },`;
    },
    publish: ` publish (topic, data, callback)  {
        let message = {
            cmd: "publish",
            qos: 0,
            topic: topic,
            payload: data,
            retain: false,
        };
        let clientId = clients[topic];
        if (!aedes.clients[clientId]) {
            console.log("iot is not connected!");

            return callback("iot is not connected!");
        }
        aedes.clients[clientId].publish(message, callback);
        // aedes.publish(message, callback);
    },`,
    subscribe: `subscribe(topic, callback)  {
        console.log("in mqttServer.subscribe topic", topic);
        // console.log('in subscribe callback', callback);
        aedes.subscribe(topic, callback, callback);
    },`
};
module = {
    publish(topic, data, callback) {
        console.log(
            `in mqttServer.publish topic = ${topic}, data = ${data}`
        );
        let message = {
            cmd: "publish",
            qos: 0,
            topic: topic,
            payload: data,
            retain: false,
        };
        let clientId = clients[topic];
        if (!aedes.clients[clientId]) {
            console.log("iot is not connected!");

            return callback("iot is not connected!");
        }
        aedes.clients[clientId].publish(message, callback);
        // aedes.publish(message, callback);
    },
    subscribe(topic, callback) {
        console.log("in mqttServer.subscribe topic", topic);
        // console.log('in subscribe callback', callback);
        aedes.subscribe(topic, callback, callback);
    },
    startServer() {
        const aedes = require("aedes")();
        let port = 1883;
        let clients = {};
        aedes.authenticate = function (client, username, password, callback) {
            console.log("in authenticate");
            let authorized =
                username === "serverAdmin" &&
                password.toString() === "Iot@Mqtt";
            if (authorized) {
                client.user = username;
            } else {
                let error = new Error("Auth error");
                error.returnCode = 1;
                return callback(error, null);
            }
            return callback(null, authorized);
        };

        aedes.authorizePublish = function (client, packet, callback) {
            // let data = payload.toString();
            // console.log('client', client);
            let topic = packet.topic;
            let data = packet.payload.toString();
            data = JSON.parse(data);

            let imei = topic
                .toString()
                .substr('/data/mqtt/iot'.toString().length);
            if (!clients[imei]) {
                clients[imei] = client.id;
            }
            mqttCallbackService.callbackReceived(data, actualCallback);
            callback(null);
        };

        aedes.authorizeSubscribe = function (client, sub, callback) {
            // let data = payload.toString();
            console.log("client", client.id);
            let imei = sub.topic;
            // console.log('topic', imei);
            if (!clients[imei]) {
                clients[imei] = client.id;
            }

            callback(null, sub);
        };
        this.publish(topic, data, callback);
        this.subscribe(topic, callback);
        const server = require("net").createServer(aedes.handle);
        server.listen(port, () => {
            console.log("server listening on port", port);
            mqttCallbackService.subscribeIot();
        });
    },
};
