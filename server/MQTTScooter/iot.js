module.exports = {
    imports: `
    const mqttServer = require('./server'); 
    module.export={`,
    lock: `lockUnlock(command, iot, bookingNumber) {
        const imei = iot.imei;
        const commandToSend = { cmd: command };
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(imei, commandToSend);
        if (!res.isRequested) {
            res.message = "Can't " +{command} + "iot";
        }
        console.log(res);
        return res;
    },`,
    lightOn: ` lightOn(iot) {
        const imei = iot.imei;
        const commandToSend = {
            cmd: 'lighton',
            value: "0, 0"
        };
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(imei, commandToSend);
        if (!res.isRequested) {
            res.message = "Can't lightOn iot";
        }
        return res;
    },`,
    lightOff: `lightOff(iot) {
        const imei = iot.imei;
        const commandToSend = { cmd: 'lightoff' };
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(imei, commandToSend);
        if (!res.isRequested) {
            res.message = "Can't lightOff iot";
        }

        return res;
    },`,

    alarmOn: `alarmOn(iot) {
        const imei = iot.imei;
        const commandToSend = {
            cmd: 'alarmon',
            value: "0, 4"
        };
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(imei, commandToSend);
        if (!res.isRequested) {
            res.message = "Can't alarm on iot";
        }
        return res;
    },`,
    alarmOff: `alarmOff(iot) {
        const imei = iot.imei;
        const commandToSend = { cmd: 'alarmoff' };
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(imei, commandToSend);
        if (!res.isRequested) {
            res.message = "Can't alarmOff iot";
        }

        return res;
    },`,

    setMaxSpeed: `setMaxSpeed(iot, data) {
        const imei = iot.imei;
        const commandToSend = {
            cmd: 'param',
            value: "speedlim,"+{data.value}
        };
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(imei, commandToSend);
        if (!res.isRequested) {
            res.message = "Can't set speed  to iot";
        }

        return res;
    },`,

    setPingInterval: `setPingInterval(iot, data) {
        const imei = iot.imei;
        const commandToSend = {
            cmd: 'param',
            value: "tripint,"+{ data.value }
        };
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(imei, commandToSend);
        if (!res.isRequested) {
            res.message = 'Can't set ping interval';
        }
        return res;
    },`,

    setRidePingInterval: `setRidePingInterval(iot, data) {
        const imei = iot.imei;
        const commandToSend = {
            cmd: 'param',
            value: 'ping,'+{data.speed}
        };
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(imei, commandToSend);
        if (!res.isRequested) {
            res.message = 'Can't set ride ping interval';
        }

        return res;
    },`,

    track: `track(iot, seconds = 30) {
        if (typeof seconds === 'object') {
            seconds = 30;
        }
        const imei = iot.imei;
        let res = { isRequested: true };
        const topicUrl = '/data/mqtt/iot';
        res.isRequested = this.subscribeToIot(imei, +"" + topicUrl, imei + "");
        if (res.isRequested) {
            const command = { cmd: 'param', value: "ping,"+ seconds +""  };
            this.publishToIot(imei, command);
        }

        return res;
    },`,

    subscribeToIot: `subscribeToIot(imei, topic, currentTry = 1) {
        let iotRequest = {
            request: { topic: topic },
            manufacturer: 'ABCDE',
            imei: imei,
            requestTry: currentTry
        };
        let res = new Promise((resolve, reject) => {
            mqttServer.subscribe(topic, (err) => {
                let message = "Subscribe to iot: "+ imei +" topic: "+ topic ;
                iotRequest.response = { message };
                if (err) {
                    iotRequest.response.message = "Can't Subscribe to iot: "+ imei +" topic: "+ topic ;
    console.error(iotRequest.response.message);
    resolve(false);
                }
    console.log(iotRequest.response.message);
    resolve(true);
            });
        });
    if (!res && iotRequest.requestTry <= 2) {
    // here 2 is max request limit
    this.subscribeToIot(imei, topic, iotRequest.requestTry + 1);
    }
    return res;
    },`,

    publishToIot: `publishToIot(topic, command, currentTry = 1) {
        console.log('----------------- Publish To iot Log Start-----------------');
        let iotRequest = {
            request: { topic: topic },
            data: command,
            manufacturer: 'ABCDE',
            imei: topic,
            requestTry: currentTry
        };
        console.log('Before Promise');
        let res = new Promise((resolve, reject) => {
            console.log('In Promise');
            let qos = 0;
             mqttServer.publish(topic, qos, JSON.stringify(command), (err) => {
                let message = command + " published to iot: " +topic;
                iotRequest.response = { message };
                if (err) {
                    iotRequest.response.message = command + " Can't  published to iot: " +topic;
                    console.error(iotRequest.response.message);
                    resolve(false);
                }
                console.log(iotRequest.response.message);
                resolve(true);
            });
        });

        if (!res && iotRequest.requestTry <= 2) {
            // here 2 is max request limit
            this.publishToIot(topic, command, iotRequest.requestTry + 1);
        }
        console.log('----------------- Publish To iot Log End-----------------');

        return res;
    },`,

    // return demoFn;
};
module = {
    lockUnlock(command, iot, bookingNumber) {
        const imei = iot.imei;
        const commandToSend = {
            cmd: command
        };
        let res = {
            isRequested: false,
            message: "",
        };
        res.isRequested = this.publishToIot(imei, commandToSend);
        if (!res.isRequested) {
            res.message = "Can't " + {
                command
            } + "iot";
        }
        console.log(res);
        return res;
    },

    lightOn(iot) {
        const imei = iot.imei;
        const commandToSend = {
            cmd: "lighton",
            value: `0, 0`,
        };
        let res = {
            isRequested: false,
            message: "",
        };
        res.isRequested = this.publishToIot(imei, commandToSend);
        if (!res.isRequested) {
            res.message = `Can't lightOn iot`;
        }

        return res;
    },

    lightOff(iot) {
        const imei = iot.imei;
        const commandToSend = {
            cmd: "lightoff"
        };
        let res = {
            isRequested: false,
            message: "",
        };
        res.isRequested = this.publishToIot(imei, commandToSend);
        if (!res.isRequested) {
            res.message = `Can't lightOff iot`;
        }

        return res;
    },

    alarmOn(iot) {
        const imei = iot.imei;
        const commandToSend = {
            cmd: "alarmon",
            value: `0, 4`,
        };
        let res = {
            isRequested: false,
            message: "",
        };
        res.isRequested = this.publishToIot(imei, commandToSend);
        if (!res.isRequested) {
            res.message = `Can't lightOff iot`;
        }

        return res;
    },

    alarmOff(iot) {
        const imei = iot.imei;
        const commandToSend = {
            cmd: "alarmoff"
        };
        let res = {
            isRequested: false,
            message: "",
        };
        res.isRequested = this.publishToIot(imei, commandToSend);
        if (!res.isRequested) {
            res.message = `Can't alarmOff iot`;
        }

        return res;
    },

    setMaxSpeed(iot, data) {
        const imei = iot.imei;
        const commandToSend = {
            cmd: "param",
            value: `speedlim,${data.value}`,
        };
        let res = {
            isRequested: false,
            message: "",
        };
        res.isRequested = this.publishToIot(imei, commandToSend);
        if (!res.isRequested) {
            res.message = `Can't set speed  to iot`;
        }

        return res;
    },

    setPingInterval(iot, data) {
        const imei = iot.imei;
        const commandToSend = {
            cmd: "param",
            value: `tripint,${data.value}`,
        };
        let res = {
            isRequested: false,
            message: "",
        };
        res.isRequested = this.publishToIot(imei, commandToSend);
        if (!res.isRequested) {
            res.message = `Can't set ping interval`;
        }

        return res;
    },

    setRidePingInterval(iot, data) {
        const imei = iot.imei;
        const commandToSend = {
            cmd: "param",
            value: `ping,${data.speed}`,
        };
        let res = {
            isRequested: false,
            message: "",
        };
        res.isRequested = this.publishToIot(imei, commandToSend);
        if (!res.isRequested) {
            res.message = `Can't set ride ping interval`;
        }

        return res;
    },

    track(iot, seconds = 30) {
        if (typeof seconds === "object") {
            seconds = 30;
        }
        const imei = iot.imei;
        let res = {
            isRequested: true
        };
        const topicUrl = "/data/mqtt/iot";
        res.isRequested = this.subscribeToIot(imei, +"" + topicUrl, imei + "");
        if (res.isRequested) {
            const command = {
                cmd: "param",
                value: `ping,${seconds}`
            };
            this.publishToIot(imei, command);
        }
        console.log("res");
        console.log(res);
        console.log("res");

        return res;
    },

    subscribeToIot(imei, topic, currentTry = 1) {
        console.log(`in subscribeToIot ${imei}`);
        let iotRequest = {
            request: {
                topic: topic
            },
            manufacturer: "ABCDE",
            imei: imei,
            requestTry: currentTry,
        };
        let res = new Promise((resolve, reject) => {
            sails.config.mqttServer.subscribe(topic, (err) => {
                let message = `Subscribe to iot: ${imei}, topic: ${topic}`;
                iotRequest.response = {
                    message
                };
                if (err) {
                    iotRequest.response.message = `Can't subscribe iot: ${imei}, topic: ${topic}`;
                    console.error(iotRequest.response.message);
                    resolve(false);
                }
                console.log(iotRequest.response.message);
                resolve(true);
            });
        });
        if (!res && iotRequest.requestTry <= 2) {
            // here 2 is max request limit
            this.subscribeToIot(imei, topic, iotRequest.requestTry + 1);
        }

        return res;
    },

    publishToIot(topic, command, currentTry = 1) {
        console.log(
            "----------------- Publish To iot Log Start-----------------"
        );
        console.log(
            `in publishToIot ${topic}, command: ${command}, currentTry = ${currentTry}`
        );
        let iotRequest = {
            request: {
                topic: topic
            },
            data: command,
            manufacturer: "ABCDE",
            imei: topic,
            requestTry: currentTry,
        };
        console.log(`in publishToIot ${topic}, command: ${command}`);
        console.log("Before Promise");
        let res = new Promise((resolve, reject) => {
            console.log("In Promise");
            let qos = 0;
            sails.config.mqttServer.publish(
                topic,
                qos,
                JSON.stringify(command),
                (err) => {
                    let message = `${command} published to iot: ${topic}`;
                    iotRequest.response = {
                        message
                    };
                    if (err) {
                        iotRequest.response.message = `Can't publish ${command} to iot: ${topic}`;
                        console.error(iotRequest.response.message);
                        resolve(false);
                    }
                    console.log(iotRequest.response.message);
                    resolve(true);
                }
            );
        });

        if (!res && iotRequest.requestTry <= 2) {
            // here 2 is max request limit
            this.publishToIot(topic, command, iotRequest.requestTry + 1);
        }
        console.log(
            "----------------- Publish To iot Log End-----------------"
        );

        return res;
    },
};