/* eslint-disable camelcase */
const UtilService = require('../util');
const IotCallbackHandler = require('../iotCallbackHandler');
const mqttServer = require('./server');
module.exports = {
    imports: `const moment = require('moment'); 
    const IotCallbackHandler = require('./iotCallbackHandler');
    const mqttServer = require('./server'); 
    module.exports = {`,
    subscribeIot: ` subscribeIot() {
        console.log('in subscribeIot');
        const topicUrl = '/data/mqtt/iot';
        let iots = [{ imei: '867577047771333' }];
        for (let iot of iots) {
            if (iot.imei) {
                mqttServer.subscribe(""+topicUrl,iot.imei+"", (err) => {
                    if (err) {
                        throw ('Can't subscribe iot: ',iot.imei);
                    }
                });
            }
        }
    },`,
    mt1Received: `mt1Received(imei, data) {
        let devices = this.getDevices(imei);
        let currentTime = moment().toISOString();

        data.connectionStatus = true;
        data.lastConnectedDateTime = currentTime;
        data.lastConnectionCheckDateTime = currentTime;
        this.updateIot(devices, data);
    },`,
    mt2Received: `mt2Received(imei, reqData) {
        let devices = this.getDevices(imei);
        let data = {
            lat: reqData.la,
            lng: reqData.lo,
            status: 0,
            mode: 'D',
            speed: reqData.ws,
            batteryLevel: reqData.sb,
            chargeStatus: reqData.pw !== 0
        };
        reqData.imei = imei;
        reqData.status = 0;
        reqData.mode = 'D';
        reqData.pw = reqData.pw !== 0;

        let iotUpdateInfo = this.getIotUpdateInfo(reqData.rf, reqData.io);
        console.log('iotUpdateInfo', iotUpdateInfo);
        // keep track of 
        IOTCallbackLockUnlockTrack.create({ imei: imei, data: reqData });

    },`,
    mt4Received: `mt4Received(imei, reqData) {
        IOTCallbackInfoTrack.create({ imei: imei, data: reqData });
        reqData.imei = imei;
    },`,
    mt5Received: `mt5Received(imei, reqData) {
        IOTCallbackInfoTrack.create({ imei: imei, data: reqData });
    },`,

    otherDataReceived: `otherDataReceived(imei, reqData) {
        IOTCallbackInfoTrack.create({ imei: imei, data: reqData });
        let commandToSend = reqData;
        console.log('reqData.from', reqData, typeof commandToSend);
        if (typeof commandToSend === 'string') {
            commandToSend = JSON.parse(commandToSend);
        }
        if (commandToSend.from && commandToSend.from === 'SM') {
            delete commandToSend.from;
            mqttIotService.publishToIot(imei, commandToSend);
        }
    },`,

    getIotUpdateInfo: `getIotUpdateInfo(rf, io) {
        let iotInfo = {
            isTripStarted: false,
            isTripStop: false,
            isLocked: false
        };
        const rfBit = this.getBinaryNumber(rf);
        const ioBit = this.getBinaryNumber(io);
        iotInfo.isTripStarted = rfBit.substring(7, 8) === '1';
        iotInfo.isTripStop = rfBit.substring(8, 9) === '1';
        iotInfo.isLocked = ioBit.substring(6, 7) === '1';

        return iotInfo;
    },
    getBinaryNumber(number) {
        let str = number.toString(2);
        str = str.split('').reverse().join('');

        return str;
    },`,

    getDevices: `getDevices(imei) {
        //pass query to get iot device list 
        let iot = Iot.findOne({ imei: imei });

        return iot;
    },`,

    updateIot: `updateIot(vehicle, data) {
        if (vehicle && vehicle.id && data) {
            data = this.modifyKeys(data);
            IotCallbackHandler.updateIot(vehicle, data);
        }
    },`,

    modifyKeys: `modifyKeys(data) {
        let newData = {};
        let acceptKeys = ['mac', 'id', 'iot_hw', 'iot_sw', 'ecu_hw', 'ecu_fw',
            'connectionStatus', 'lastConnectedDateTime', 'lastConnectionCheckDateTime'
        ];
        let changeKeyName = {
            id: 'iccid',
            iot_hw: 'iotVersion',
            iot_sw: 'iotVersion',
            ecu_hw: 'ecuHardwareVersion',
            ecu_fw: 'ecuSoftwareVersion'
        };
        for (let key of Object.keys(data)) {
            if (acceptKeys.indexOf(key) > -1) {
                let newKey = key;
                if (changeKeyName[newKey]) {
                    newKey = changeKeyName[newKey];
                }
                newData[newKey] = data[key];
            }
        }

        return newData;
    }`,
};
// return demoFn;
module = {
    subscribeIot() {
        console.log('in subscribeIot');
        const topicUrl = '/data/mqtt/iot';
        let iots = [{ imei: '867577047771333' }];
        for (let iot of iots) {
            if (iot.imei) {
                sails.config.mqttServer.subscribe(`${topicUrl}${iot.imei}`, (err) => {
                    if (err) {
                        throw (`Can't subscribe iot: ${iot.imei}`);
                    }
                    console.log(`Subscribe to iot: ${iot.imei}`);
                });
            }
        }
    },

    mt1Received(imei, data) {
        let devices = this.getDevices(imei);
        let currentTime = UtilService.getTimeFromNow();

        data.connectionStatus = true;
        data.lastConnectedDateTime = currentTime;
        data.lastConnectionCheckDateTime = currentTime;
        this.updateIot(devices, data);
    },

    mt2Received(imei, reqData) {
        let devices = this.getDevices(imei);
        let data = {
            lat: reqData.la,
            lng: reqData.lo,
            status: 0,
            mode: 'D',
            speed: reqData.ws,
            batteryLevel: reqData.sb,
            chargeStatus: reqData.pw !== 0
        };
        reqData.imei = imei;
        reqData.status = 0;
        reqData.mode = 'D';
        reqData.pw = reqData.pw !== 0;

        let iotUpdateInfo = this.getIotUpdateInfo(reqData.rf, reqData.io);
        console.log(` rf=${reqData.rf} io=${reqData.io}`);
        console.log('iotUpdateInfo', iotUpdateInfo);
        // keep track of 
        IOTCallbackLockUnlockTrack.create({ imei: imei, data: reqData });

    },

    mt4Received(imei, reqData) {
        IOTCallbackInfoTrack.create({ imei: imei, data: reqData });
        reqData.imei = imei;
    },

    mt5Received(imei, reqData) {
        IOTCallbackInfoTrack.create({ imei: imei, data: reqData });
    },

    otherDataReceived(imei, reqData) {
        IOTCallbackInfoTrack.create({ imei: imei, data: reqData });
        let commandToSend = reqData;
        console.log('reqData.from', reqData, typeof commandToSend);
        if (typeof commandToSend === 'string') {
            commandToSend = JSON.parse(commandToSend);
        }
        if (commandToSend.from && commandToSend.from === 'SM') {
            delete commandToSend.from;
            mqttIotService.publishToIot(imei, commandToSend);
        }
    },

    getIotUpdateInfo(rf, io) {
        let iotInfo = {
            isTripStarted: false,
            isTripStop: false,
            isLocked: false
        };
        const rfBit = this.getBinaryNumber(rf);
        const ioBit = this.getBinaryNumber(io);
        iotInfo.isTripStarted = rfBit.substring(7, 8) === '1';
        iotInfo.isTripStop = rfBit.substring(8, 9) === '1';
        iotInfo.isLocked = ioBit.substring(6, 7) === '1';

        return iotInfo;
    },

    getBinaryNumber(number) {
        let str = number.toString(2);
        str = str.split('').reverse().join('');

        return str;
    },

    getDevices(imei) {
        //pass query to get iot device list 
        let iot = Iot.findOne({ imei: imei });

        return iot;
    },

    updateIot(vehicle, data) {
        if (vehicle && vehicle.id && data) {
            data = this.modifyKeys(data);
            IotCallbackHandler.updateIot(vehicle, data);
        }
    },

    modifyKeys(data) {
        let newData = {};
        let acceptKeys = ['mac', 'id', 'iot_hw', 'iot_sw', 'ecu_hw', 'ecu_fw',
            'connectionStatus', 'lastConnectedDateTime', 'lastConnectionCheckDateTime'
        ];
        let changeKeyName = {
            id: 'iccid',
            iot_hw: 'iotVersion',
            iot_sw: 'iotVersion',
            ecu_hw: 'ecuHardwareVersion',
            ecu_fw: 'ecuSoftwareVersion'
        };
        for (let key of Object.keys(data)) {
            if (acceptKeys.indexOf(key) > -1) {
                let newKey = key;
                if (changeKeyName[newKey]) {
                    newKey = changeKeyName[newKey];
                }
                newData[newKey] = data[key];
            }
        }

        return newData;
    }
};
