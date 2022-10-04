const UtilService = require('../util');
const crcService = require('../crc');

const commandStructure = {
    label: { start: 0, end: 2 },
    decodeHelpByte: { start: 2, end: 2 },
    packetLength: { start: 4, end: 2 },
    dataType: { start: 6, end: 2 },
    deviceId: { start: 8, end: 32 },
    token: { start: 40, end: 8 },
    dataUnit: { start: 48 }
};
module.exports = {
    imports: `
    const crcService = require('./crc');
    
    const commandStructure = {
        label: { start: 0, end: 2 },
        decodeHelpByte: { start: 2, end: 2 },
        packetLength: { start: 4, end: 2 },
        dataType: { start: 6, end: 2 },
        deviceId: { start: 8, end: 32 },
        token: { start: 40, end: 8 },
        dataUnit: { start: 48 }
    };
    module.exports = { `,
    lockUnlock: `lockUnlock(reqCommand, scooter, bookingNumber = 0) {
        let command = reqCommand;
        let topic = '01';
        let encodedCommand = '01';
        let imei = (scooter.imei).toString(16);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;

        if (reqCommand === 'start' || reqCommand === 'unlock') {
            encodedCommand += '02';
        } else if (reqCommand === 'stop' || reqCommand === 'lock') {
            encodedCommand += '01';
        }
        imei = scooter.imei;
        if (!bookingNumber) {
            bookingNumber = 0;
        }

        let res = this.publishToIot(topic, command, imei, encodedCommand, reqCommand);
        if (!res.isRequested && !res.message) {
            res.message = 'Cant ' + command + ' Scooter';
        }
        return res;
    },`,

    lightOn: `lightOn(scooter) {
        let encodedCommand = '53';
        let topic = '53';
        let imei =  (scooter.imei).toString(16);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;
        encodedCommand += '01010100';

        imei = scooter.imei;

        let res = this.publishToIot(topic, command, imei, encodedCommand, 'LIGHT_ON');
        if (!res.isRequested && !res.message) {
            res.message = 'Cant lightOn scooter';
        }

        return res;
    },`,

    lightOff: `lightOff(scooter) {
        let encodedCommand = '53';
        let topic = '53';
        let imei = (scooter.imei).toString(16);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;
        encodedCommand += '01000000';

        imei = scooter.imei;

        let res = this.publishToIot(topic, command, imei, encodedCommand, 'LIGHT_OFF');
        if (!res.isRequested && !res.message) {
            res.message = 'Cant lightOff scooter';
        }

        return res;
    },`,

    setMaxSpeed: `setMaxSpeed(scooter, data) {
        let topic = 52;
        let mode = '00';
        if (data.value > 18) {
            mode = '01';
        } else if (data.value > 30) {
            mode = '02';
        }
        let encodedCommand = '52';
        let imei = (scooter.imei).toString(16);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;
        encodedCommand = encodedCommand + '01' + mode + '00';

        imei = scooter.imei;

        let res = this.publishToIot(topic, command, imei, encodedCommand, 'SET_MAX_SPEED');
        if (!res.isRequested && !res.message) {
            res.message = 'Cant setMaxSpeed of scooter';
        }

        return res;
    },`,

    setPingInterval: `setPingInterval(scooter, data) {
        let encodedCommand = '50';
        let topic = '50';
        let imei =  (scooter.imei).toString(16);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;
        let pingInterval = Math.ceil(data.value / 60);
        pingInterval = ('00000000' + (pingInterval).toString(16)).substr(-8);
        encodedCommand += '010000000000000000' + pingInterval + '00000000';

        imei = scooter.imei;

        let res = this.publishToIot(topic, command, imei, encodedCommand, 'SET_PING_INTERVAL');
        if (!res.isRequested && !res.message) {
            res.message = 'Cant set PingInterval of scooter';
        }

        return res;
    },`,

    setRidePingInterval: `setRidePingInterval(scooter, data) {
        let encodedCommand = '50';
        let topic = '50';
        let imei =  (scooter.imei).toString(16);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;
        let pingInterval = ('00' +  (data.value).toString(16)).substr(-2);
        encodedCommand += '010000' + pingInterval + '00000000000000000000000000';

        imei = scooter.imei;

        let res = this.publishToIot(topic, command, imei, encodedCommand, "SET_RIDE_PING_INTERVAL");
        if (!res.isRequested && !res.message) {
            res.message = 'Cant set PingInterval of scooter';
        }

        return res;
    },`,

    alarmOn: `alarmOn(scooter, data) {
        let encodedCommand = '54';
        let topic = '54';
        let imei =  (scooter.imei).toString(16);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;
        let pingInterval = Math.ceil(data.value / 60);
        pingInterval = ('00000000' + (pingInterval).toString(16)).substr(-8);
        encodedCommand += '010100000000';

        imei = scooter.imei;

        let res = this.publishToIot(topic, command, imei, encodedCommand, 'ALARM_ON');
        if (!res.isRequested && !res.message) {
            res.message = 'Cant alarmOn scooter';
        }

        return res;
    },`,

    alarmOff: `alarmOff(scooter) {
        let encodedCommand = '54';
        let topic = '54';
        let imei =  (scooter.imei).toString(16);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;
        let pingInterval = Math.ceil(data.value / 60);
        pingInterval = ('00000000' + (pingInterval).toString(16)).substr(-8);
        encodedCommand += '010000000000';

        imei = scooter.imei;

        let res = this.publishToIot(topic, command, imei, encodedCommand, 'ALARM_OFF');
        if (!res.isRequested && !res.message) {
            res.message = 'Cant alarmOff scooter';
        }

        return res;
    },`,
    statusVersion: `statusVersion(scooter) {
        let encodedCommand = '55';
        let topic = '55';
        let imei =  (scooter.imei).toString(16);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;
        let pingInterval = Math.ceil(data.value / 60);
        pingInterval = ('00000000' +  (pingInterval).toString(16)).substr(-8);
        encodedCommand += '010000000000';

        imei = scooter.imei;

        let res = this.publishToIot(topic, command, imei, encodedCommand, 'STATUS_CHECK');
        if (!res.isRequested && !res.message) {
            res.message = 'Cant alarmOff scooter';
        }

        return res;
    },`,
    location: `location(scooter) {
        const imei = scooter.imei;
        let commandToSend = 'ggps';

        let res = this.publishToIot(imei, commandToSend, scooter.userId, 'LOCATION');
        if (!res.isRequested && !res.message) {
            res.message = 'Cant get current location of scooter';
        }

        return res;
    },`,

    publishToIot: `publishToIot(topic, command, imei, encodedCommand, commandName = '', currentTry = 1) {
        let commonCommandBytes = '5e30';
        let packetLength = encodedCommand.length / 2;
        packetLength += 5;
        packetLength =  (packetLength).toString(16);
        encodedCommand = commonCommandBytes + packetLength + encodedCommand;
        let crc = crcService.calculateCRC16IBM(encodedCommand);
        crc = ('0000' + crc).substr(-4);
        encodedCommand = encodedCommand + crc;

        let iotRequest = {
            request: { topic: encodedCommand },
            data: command,
            manufacturer: 'URBANE',
            imei: imei,
            requestTry: currentTry
        };

        let res = new Promise((resolve, reject) => {
            mqttServer.publish(topic, 0, encodedCommand, (err) => {
                let message = command + ' published to scooter: ' + topic;
                iotRequest.response = { message };
                if (err) {
                    iotRequest.response.message = 'Cant publish ' + command + 'to scooter: ' + topic;
                    console.error(iotRequest.response.message);
                    resolve(false);
                }
                console.log(iotRequest.response.message);
                resolve(true);
            });
        });

        if (!res && iotRequest.requestTry <= 2) {
            this.publishToIot(topic, command, imei, encodedCommand, commandName, iotRequest.requestTry + 1);
        }
        console.log('----------------- Publish To Scooter Log End-----------------');
    },`
};
module = {
    lockUnlock(reqCommand, scooter, bookingNumber = 0) {
        let command = reqCommand;
        let topic = '01';
        let encodedCommand = '01';
        let imei = UtilService.decToHex(scooter.imei);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;

        if (reqCommand === 'start' || reqCommand === 'unlock') {
            encodedCommand += '02';
        } else if (reqCommand === 'stop' || reqCommand === 'lock') {
            encodedCommand += '01';
        }
        imei = scooter.imei;
        if (!bookingNumber) {
            bookingNumber = 0;
        }

        let res = this.publishToIot(topic, command, imei, encodedCommand, reqCommand);
        if (!res.isRequested && !res.message) {
            res.message = 'Cant ' + command + ' Scooter';
        }
        return res;
    },

    lightOn(scooter) {
        let encodedCommand = '53';
        let topic = '53';
        let imei = UtilService.decToHex(scooter.imei);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;
        encodedCommand += '01010100';

        imei = scooter.imei;

        let res = this.publishToIot(topic, command, imei, encodedCommand, 'LIGHT_ON');
        if (!res.isRequested && !res.message) {
            res.message = 'Cant lightOn scooter';
        }

        return res;
    },

    lightOff(scooter) {
        let encodedCommand = '53';
        let topic = '53';
        let imei = UtilService.decToHex(scooter.imei);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;
        encodedCommand += '01000000';

        imei = scooter.imei;

        let res = this.publishToIot(topic, command, imei, encodedCommand, 'LIGHT_OFF');
        if (!res.isRequested && !res.message) {
            res.message = 'Cant lightOff scooter';
        }

        return res;
    },

    setMaxSpeed(scooter, data) {
        let topic = 52;
        let mode = '00';
        if (data.value > 18) {
            mode = '01';
        } else if (data.value > 30) {
            mode = '02';
        }
        let encodedCommand = '52';
        let imei = UtilService.decToHex(scooter.imei);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;
        encodedCommand = encodedCommand + '01' + mode + '00';

        imei = scooter.imei;

        let res = this.publishToIot(topic, command, imei, encodedCommand, 'SET_MAX_SPEED');
        if (!res.isRequested && !res.message) {
            res.message = 'Cant setMaxSpeed of scooter';
        }

        return res;
    },

    setPingInterval(scooter, data) {
        let encodedCommand = '50';
        let topic = '50';
        let imei = UtilService.decToHex(scooter.imei);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;
        let pingInterval = Math.ceil(data.value / 60);
        pingInterval = ('00000000' + UtilService.decToHex(pingInterval)).substr(-8);
        encodedCommand += '010000000000000000' + pingInterval + '00000000';

        imei = scooter.imei;

        let res = this.publishToIot(topic, command, imei, encodedCommand, 'SET_PING_INTERVAL');
        if (!res.isRequested && !res.message) {
            res.message = 'Cant set PingInterval of scooter';
        }

        return res;
    },

    setRidePingInterval(scooter, data) {
        let encodedCommand = '50';
        let topic = '50';
        let imei = UtilService.decToHex(scooter.imei);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;
        let pingInterval = ('00' + UtilService.decToHex(data.value)).substr(-2);
        encodedCommand += '010000' + pingInterval + '00000000000000000000000000';

        imei = scooter.imei;

        let res = this.publishToIot(topic, command, imei, encodedCommand, "SET_RIDE_PING_INTERVAL");
        if (!res.isRequested && !res.message) {
            res.message = 'Cant set PingInterval of scooter';
        }

        return res;
    },

    alarmOn(scooter, data) {
        let encodedCommand = '54';
        let topic = '54';
        let imei = UtilService.decToHex(scooter.imei);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;
        let pingInterval = Math.ceil(data.value / 60);
        pingInterval = ('00000000' + UtilService.decToHex(pingInterval)).substr(-8);
        encodedCommand += '010100000000';

        imei = scooter.imei;

        let res = this.publishToIot(topic, command, imei, encodedCommand, 'ALARM_ON');
        if (!res.isRequested && !res.message) {
            res.message = 'Cant alarmOn scooter';
        }

        return res;
    },

    alarmOff(scooter) {
        let encodedCommand = '54';
        let topic = '54';
        let imei = UtilService.decToHex(scooter.imei);
        imei = ('00000000000000000000000000000000' + imei).substr(-32);
        encodedCommand += imei;
        let token = '';
        encodedCommand += token;
        let pingInterval = Math.ceil(data.value / 60);
        pingInterval = ('00000000' + UtilService.decToHex(pingInterval)).substr(-8);
        encodedCommand += '010000000000';

        imei = scooter.imei;

        let res = this.publishToIot(topic, command, imei, encodedCommand, 'ALARM_OFF');
        if (!res.isRequested && !res.message) {
            res.message = 'Cant alarmOff scooter';
        }

        return res;
    },

    location(scooter) {
        const imei = scooter.imei;
        let commandToSend = `ggps`;

        let res = this.publishToIot(imei, commandToSend, scooter.userId, 'LOCATION');
        if (!res.isRequested && !res.message) {
            res.message = 'Cant get current location of scooter';
        }

        return res;
    },

    publishToIot(topic, command, imei, encodedCommand, commandName = '', currentTry = 1) {
        let commonCommandBytes = '5e30';
        let packetLength = encodedCommand.length / 2;
        packetLength += 5;
        packetLength = UtilService.decToHex(packetLength);
        encodedCommand = commonCommandBytes + packetLength + encodedCommand;
        let crc = crcService.calculateCRC16IBM(encodedCommand);
        crc = ('0000' + crc).substr(-4);
        encodedCommand = encodedCommand + crc;

        let iotRequest = {
            request: { topic: encodedCommand },
            data: command,
            manufacturer: 'URBANE',
            imei: imei,
            requestTry: currentTry
        };

        let res = new Promise((resolve, reject) => {
            mqttServer.publish(topic, 0, encodedCommand, (err) => {
                let message = command + ' published to scooter: ' + topic;
                iotRequest.response = { message };
                if (err) {
                    iotRequest.response.message = 'Cant publish ' + command + 'to scooter: ' + topic;
                    console.error(iotRequest.response.message);
                    resolve(false);
                }
                console.log(iotRequest.response.message);
                resolve(true);
            });
        });

        if (!res && iotRequest.requestTry <= 2) {
            this.publishToIot(topic, command, imei, encodedCommand, commandName, iotRequest.requestTry + 1);
        }
        console.log('----------------- Publish To Scooter Log End-----------------');
    }
};