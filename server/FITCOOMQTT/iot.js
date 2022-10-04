
module.exports = {
    imports: `
    const mqttServer = require('./server');
    let moment = require(moment); 
    module.exports = { `,
    lockUnlock: `lockUnlock(reqCommand, iot) {
        let qos = 0;
        let command = reqCommand;
        let topic = iot.imei.toString();
        let data = {};
        if (reqCommand === 'start' || reqCommand === 'unlock') {
            data.a = 1;
            command = 'unlock';
        } else if (reqCommand === 'stop' || reqCommand === 'lock') {
            qos = 1;
            data.a = 3;
            command = 'lock';
        }
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, data, qos, reqCommand);
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }
        return res;
    },`,

    lightOn: `lightOn(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 37,
            d: 1
        };
        let command = 'lightOn';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOn');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    singleRideClearMilageReport: `singleRideClearMilageReport(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 7
        };
        let command = 'lightOn';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOn');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    totalMilageClear: `totalMilageClear(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 9
        };
        let command = 'lightOn';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOn');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    removeBattery: `removeBattery(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 60
        };
        let command = 'lightOn';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOn');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    lockBattery: `lockBattery(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 62
        };
        let command = 'lightOn';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOn');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    totalRidingTimeClear: `totalRidingTimeClear(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 11
        };
        let command = 'lightOn';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOn');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    powerOn: `powerOn(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 1
        };
        let command = 'lightOn';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOn');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    vehicleFailureReport: `vehicleFailureReport(iot) {
    const qos = 0;
    let topic = iot.imei.toString();
    const requestData = {
        a: 17,
        e: 10
    };
    let command = 'lightOff';
    let res = {
        isRequested: false,
        message: ''
    };
    res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOff');
    if (!res.isRequested) {
        res.message = 'Cant ' + command + ' the Iot.';
    }

    return res;
    },`,
    lightOff: `lightOff(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 37,
            d: 0
        };
        let command = 'lightOff';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOff');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    powerOff: `powerOff(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 3,
        };
        let command = 'lightOff';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOff');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    clearOneTimeMilage: `clearOneTimeMilage(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 5,
            d: 0
        };
        let command = 'lightOff';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOff');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    setAPN: `setAPN(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 53,
            z: "AT+QICSGP=15,1,"+apn+","+username+","+password+",0"
        };
        let command = 'lightOff';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOff');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    getUserParams: `getUserParams(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 35
        };
        let command = 'get location';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'Location');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    restart: `restart(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 20,
        };
        let command = 'lightOff';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOff');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    hardwareInfo: `hardwareInfo(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 21,
        };
        let command = 'lightOff';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOff');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    getSimInfo: `getSimInfo(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 24,
        };
        let command = 'lightOff';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOff');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    vibrationSetting: `vibrationSetting(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 39,
            v: 0
        };
        let command = 'lightOff';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOff');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    kilometerMileSwitch: `kilometerMileSwitch(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 41,
            f: 0 // 1 for miles 0 for Kms
        };
        let command = 'lightOff';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOff');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    forceLightOn: `forceLightOn(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 43,
            j: 0 // 1 for miles 0 for Kms
        };
        let command = 'lightOff';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOff');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    heartBeat: `heartBeat(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 27
            i : iot.iotNo,
        }
        let command = 'alarmOn';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'AlarmOn');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    alarmOn: `alarmOn(iot, contentType = 7) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 28
        }
        let command = 'alarmOn';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'AlarmOn');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,

    setMaxSpeed: `setMaxSpeed(iot, data) {
        let km = data.value;
        let topic = iot.imei.toString();

        if (data.value < 4) {
            km = Math.ceil((km * 600) / 4);
        } else {
            let decimalNo = (km - Math.floor(km)).toString().substr(0, 2);
            let points = (decimalNo * 50) / 100;
            let diff = (Math.floor(km) - 4) / 2;
            km = (diff * 100) + 400 + points;
        }
        const qos = 1;
        const requestData = {
            a: 13,
            k: km
        }
        let command = 'setMaxSpeed';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'SetMaxSpeed');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    location: `location(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 18
        };
        let command = 'get location';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'Location');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,
    track: `track(iot, seconds = 30) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 15
        };
        let command = 'track';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'track');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },`,

    publishToIot: `publishToIot(topic, command, data, qos, commandName = '', currentTry = 1) {

        let iotRequest = {
            request: { topic: topic },
            data: command,
            manufacturer: 'FITRIDER',
            imei: topic,
            requestTry: currentTry
        };
        let res = new Promise((resolve, reject) => {
            mqttServer.publish(topic, qos, JSON.stringify(data), (err) => {
                let message = command + 'published to iot: ' + topic;
                iotRequest.response = { message };
                if (err) {
                    iotRequest.response.message = 'Cant publish ' + command + ' to iot: ' + topic;
                    console.error(iotRequest.response.message);
                    resolve(false);
                }
                console.log(iotRequest.response.message);
                resolve(true);
            });
        });

        if (!res && iotRequest.requestTry <= 2) {
            this.publishToIot(topic, command, data, qos, commandName, iotRequest.requestTry + 1);
        }
        console.log('----------------- Publish To Iot Log End-----------------');

        return res;
    },`,
    setRidePingInterval: `setRidePingInterval(iot, data, ip, port, imei) {
            const qos = 0;
            let topic = iot.imei.toString();
            const requestData = {
                a: 33,
                u: ''+ip+','+port+','+imei+','+data.value,
            };
            let command = 'setRidePingInterval';
            let res = {
                isRequested: false,
                message: ''
            };
            res.isRequested = this.publishToIot(topic, command, requestData, qos, 'SetRidePingInterval');
            if (!res.isRequested) {
                res.message = 'Cant ' + command + ' the Iot.';
            }
    
            return res;
        },`
};
module = {
    lockUnlock(reqCommand, iot) {
        let qos = 0;
        let command = reqCommand;
        let topic = iot.imei.toString();
        let data = {};
        if (reqCommand === 'start' || reqCommand === 'unlock') {
            data.a = 1;
            command = 'unlock';
        } else if (reqCommand === 'stop' || reqCommand === 'lock') {
            qos = 1;
            data.a = 3;
            command = 'lock';
        }
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, data, qos, reqCommand);
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }
        return res;
    },

    lightOn(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 37,
            d: 1
        };
        let command = 'lightOn';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOn');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },

    lightOff(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 37,
            d: 0
        };
        let command = 'lightOff';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'LightOff');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },

    alarmOn(iot, contentType = 7) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 28
        }
        let command = 'alarmOn';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'AlarmOn');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },

    alarmOff(iot, contentType = 6) {
    },

    setMaxSpeed(iot, data) {
        let km = data.value;
        let topic = iot.imei.toString();

        if (data.value < 4) {
            km = Math.ceil((km * 600) / 4);
        } else {
            let decimalNo = (km - Math.floor(km)).toString().substr(0, 2);
            let points = (decimalNo * 50) / 100;
            let diff = (Math.floor(km) - 4) / 2;
            km = (diff * 100) + 400 + points;
        }
        const qos = 1;
        const requestData = {
            a: 13,
            k: km
        }
        let command = 'setMaxSpeed';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'SetMaxSpeed');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },

    setPingInterval(iot, data) {

    },

    setRidePingInterval(iot, data) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 33,
            u: `${sails.config.SERVER_IP},${sails.config.SERVER_PORT},${iot.imei},${data.value}`
        };
        let command = 'setRidePingInterval';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'SetRidePingInterval');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },

    location(iot) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 18
        };
        let command = 'get location';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'Location');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },
    track(iot, seconds = 30) {
        const qos = 0;
        let topic = iot.imei.toString();
        const requestData = {
            a: 15
        };
        let command = 'track';
        let res = {
            isRequested: false,
            message: ''
        };
        res.isRequested = this.publishToIot(topic, command, requestData, qos, 'track');
        if (!res.isRequested) {
            res.message = 'Cant ' + command + ' the Iot.';
        }

        return res;
    },

    publishToIot(topic, command, data, qos, commandName = '', currentTry = 1) {

        let iotRequest = {
            request: { topic: topic },
            data: command,
            manufacturer: 'FITRIDER',
            imei: topic,
            requestTry: currentTry
        };
        let res = new Promise((resolve, reject) => {
            sails.config.mqttServer.publish(topic, qos, JSON.stringify(data), (err) => {
                let message = command + 'published to iot: ' + topic;
                iotRequest.response = { message };
                if (err) {
                    iotRequest.response.message = 'Cant publish ' + command + ' to iot: ' + topic;
                    console.error(iotRequest.response.message);
                    resolve(false);
                }
                console.log(iotRequest.response.message);
                resolve(true);
            });
        });

        if (!res && iotRequest.requestTry <= 2) {
            this.publishToIot(topic, command, data, qos, commandName, iotRequest.requestTry + 1);
        }
        console.log('----------------- Publish To Iot Log End-----------------');

        return res;
    }
}