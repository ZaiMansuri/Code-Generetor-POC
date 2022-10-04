const UtilService = require('../util');

const ackStructure = {
    label: { start: 0, end: 2 },
    decodeHelpByte: { start: 2, end: 2 },
    packetLength: { start: 4, end: 2 },
    dataType: { start: 6, end: 2 },
    deviceId: { start: 8, end: 32 },
    token: { start: 40, end: 8 },
    dataUnit: { start: 48 }
};
const mqttServer = require('./server');
module.exports = {
    imports: `const UtilService = require('../util');
    const ackStructure = {
        label: { start: 0, end: 2 },
        decodeHelpByte: { start: 2, end: 2 },
        packetLength: { start: 4, end: 2 },
        dataType: { start: 6, end: 2 },
        deviceId: { start: 8, end: 32 },
        token: { start: 40, end: 8 },
        dataUnit: { start: 48 }
    };
    const mqttServer = require('./server'); module.exports = {` ,
    subscribeIot: `subscribeIot() {
        mqttServer.subscribe('/data/mqtt/iot', (err) => {
            if (err) {
                console.log('Cant subscribe iot');
            }
            console.log('Subscribe to iot');
            //can handle any business logic here 
        });
    },`,

    decodeCallback: `decodeCallback(ack) {
        let data = {};
        let helpByte = ack.substr(ackStructure.decodeHelpByte.start, ackStructure.decodeHelpByte.end);
        helpByte = UtilService.hex2bin(helpByte);
        let hasDeviceId = helpByte.substr(2, 1) == '1';
        let hasToken = helpByte.substr(3, 1) == '1';
        data.dataType = ack.substr(ackStructure.dataType.start, ackStructure.dataType.end);
        let nextDataStart = ackStructure.deviceId.start;
        if (hasDeviceId) {
            data.imei = ack.substr(ackStructure.deviceId.start, ackStructure.deviceId.end);
            nextDataStart += ackStructure.deviceId.end;
        }
        if (hasToken) {
            data.token = ack.substr(ackStructure.token.start, ackStructure.token.end);
            nextDataStart += ackStructure.token.end;
        }
        let dataUnit = ack.substring(nextDataStart, ack.length);
        switch (data.dataType.toLowerCase()) {
            case '83':
                data = this.decodeLockCallback(dataUnit, data);
                break;

            case 'e0':
                data = this.decodeIoTConfigurationCallback(dataUnit, data);
                break;

            case 'e1':
                data = this.decodeEcuConfigurationCallback(dataUnit, data);
                break;

            case 'e2':
                data = this.decodeCurrentSpeedCallback(dataUnit, data);
                break;

            case 'e3':
                data = this.decodeLightStatusCallback(dataUnit, data);
                break;

            case 'e4':
                data = this.decodeAlarmStatusCallback(dataUnit, data);
                break;

            case 'e5':
                data = this.decodeVersionStatusCallback(dataUnit, data);
                break;

            case 'b3':
                data = this.decodeBatteryLockCallback(dataUnit, data);
                break;

            case '80':
                data = this.decodeIoTStatusCallback(dataUnit, data);
                break;

            case 'ff':
                data = this.decodeHeartBeat(dataUnit, data);
                break;

            default:
                break;
        }

        return data;
    },`,

    callbackReceived: `callbackReceived(data, actualCallback) {
        //  IOTCommandCallbackTrack.create({
        //     imei: data.imei,
        //     logType: 'CALLBACK',
        //     actualCallback: JSON.stringify(actualCallback),
        //     decodedCallback: data
        // });
        // write your business logic here to manage callback data.
    },`,

    decodeLockCallback: `decodeLockCallback(dataUnit, data) {
        data.lockStatus = UtilService.hexToDec(dataUnit.substr(0, 2));
        if (data.lockStatus == 1) {
            data.lockStatus = false;
        } else {
            data.lockStatus = true;
        }

        return data;
    },`,

    ddecodeIoTConfigurationCallback: `ecodeIoTConfigurationCallback(dataUnit, data) {
        data.sensorSensitivityLevel = dataUnit.substr(0, 2);
        data.batteryReserveTime = dataUnit.substr(2, 2);
        data.ridePingInterval = dataUnit.substr(4, 2);
        data.lowBatteryThreshold = dataUnit.substr(6, 2);
        data.backupBatteryInterval = dataUnit.substr(8, 8);
        data.pingInterval = dataUnit.substr(16, 8);
        data.sleepPingInterval = dataUnit.substr(24, 8);

        data = UtilService.getDecimalConvertedObject(data);

        return data;
    },`,

    decodeEcuConfigurationCallback: `decodeEcuConfigurationCallback(dataUnit, data) {
        data.lowSpeedMode = dataUnit.substr(0, 2);
        data.middleSpeedMode = dataUnit.substr(2, 2);
        data.highSpeedMode = dataUnit.substr(4, 2);
        data.engineStartMode = dataUnit.substr(6, 2);

        data = UtilService.getDecimalConvertedObject(data);

        return data;
    },`,

    decodeCurrentSpeedCallback: `decodeCurrentSpeedCallback(dataUnit, data) {
        data.mode = dataUnit.substr(0, 2);
        data.isResponse = dataUnit.substr(2, 2);
        data.speed = dataUnit.substr(4, 2);
        data.currentRideDistance = dataUnit.substr(6, 8);
        data.workingCurrent = dataUnit.substr(14, 8);

        data = UtilService.getDecimalConvertedObject(data);

        data.errorCode = dataUnit.substr(22, 10)

        return data;
    },`,

    decodeLightStatusCallback: `decodeLightStatusCallback(dataUnit, data) {
        data.headLightStatus = dataUnit.substr(0, 2);
        data.tailLightStatus = dataUnit.substr(2, 2);
        data.findIotVoiceStatus = dataUnit.substr(4, 2);

        data = UtilService.getDecimalConvertedObject(data);

        return data;
    },`,

    decodeAlarmStatusCallback: `decodeAlarmStatusCallback(dataUnit, data) {
        switch ('01') {
            case dataUnit.substr(0, 2):
                data.alarmType = 1;
                break;

            case dataUnit.substr(2, 2):
                data.alarmType = 2;
                break;

            case dataUnit.substr(4, 2):
                data.alarmType = 3;
                break;

            case dataUnit.substr(6, 2):
                data.alarmType = 4;
                break;

            case dataUnit.substr(8, 2):
                data.alarmType = 5;
                break;

            default:
                break;
        }

        return data;
    },`,

    decodeVersionStatusCallback: `decodeVersionStatusCallback(dataUnit, data) {
        let nextDataStart = 0;
        if (dataUnit.substr(nextDataStart, nextDataStart += 2) == '01') {
            data.iotFirmwareVersion = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.iotHardwareVersion = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.ecuFirmwareVersion = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.ecuHardwareVersion = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.bluetoothFirmwareVersion = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.batteryLockStatus = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.lockStatus = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.iccid = dataUnit.substring(nextDataStart, nextDataStart += 46);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.blueToothMac = dataUnit.substring(nextDataStart, nextDataStart += 14);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.serialNo = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.iotHardwareVersion = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.iotSerialNo = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.ecuSerialNo = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }

        data = UtilService.getDecimalConvertedObject(data);

        return data;
    },`,

    decodeBatteryLockCallback: `decodeBatteryLockCallback(dataUnit, data) {
        data.batteryLockStatus = UtilService.hexToDec(dataUnit.substr(0, 2));
        if (data.batteryLockStatus == 1) {
            data.batteryLockStatus = false;
        } else {
            data.batteryLockStatus = true;
        }

        return data;
    },`,

    decodeIoTStatusCallback: `decodeIoTStatusCallback(dataUnit, data) {
        if (dataUnit.substr(0, 2) == '00') {
            data.lngDirection = 'E';
        } else {
            data.lngDirection = 'W';
        }
        let longitude = dataUnit.substr(2, 8);
        longitude = UtilService.hexToDec(longitude);
        longitude /= 1000000;
        if (dataUnit.substr(10, 2) == '00') {
            data.latDirection = 'N';
        } else {
            data.latDirection = 'S';
        }
        let latitude = dataUnit.substr(12, 8);
        latitude = UtilService.hexToDec(latitude);
        latitude /= 1000000;
        let { lat, lng } = UtilService.setDirectionWiseLocation(data.latDirection, data.lngDirection, latitude, longitude);
        data.lat = lat;
        data.lng = lng;

        data.noOfLocatedStars = UtilService.hexToDec(dataUnit.substr(20, 2));
        data.gpsSpeed = UtilService.hexToDec(dataUnit.substr(22, 2));
        data.altitude = UtilService.hexToDec(dataUnit.substr(24, 4));
        data.azimuth = UtilService.hexToDec(dataUnit.substr(28, 4));
        data.mcc = UtilService.hexToDec(dataUnit.substr(32, 8));
        data.mnc = UtilService.hexToDec(dataUnit.substr(40, 8));
        data.lac = UtilService.hexToDec(dataUnit.substr(48, 8));
        data.cellId = UtilService.hexToDec(dataUnit.substr(56, 8));
        data.csqRssi = UtilService.hexToDec(dataUnit.substr(64, 8));
        data.dateTime = dataUnit.substr(72, 16);
        data.lockStatus = UtilService.hexToDec(dataUnit.substr(88, 2));
        if (data.lockStatus == 1) {
            data.lockStatus = false;
        } else {
            data.lockStatus = true;
        }
        data.chargeStatus = UtilService.hexToDec(dataUnit.substr(90, 2));
        data.batteryVoltage = UtilService.hexToDec(dataUnit.substr(92, 4));
        data.batteryLevel = UtilService.hexToDec(dataUnit.substr(96, 2));
        data.backupBatteryVoltage = UtilService.hexToDec(dataUnit.substr(98, 4));
        data.backupBatteryLevel = UtilService.hexToDec(dataUnit.substr(102, 2));
        if (data.imei) {
            data.imei = UtilService.hexToDec(data.imei);
        }

        return data;
    },`,

    decodeHeartBeat: `decodeHeartBeat(dataUnit, data) {
        data.reservedBatteryLevel = UtilService.hexToDec(dataUnit.substr(2, 2));
        data.temperature = UtilService.hexToDec(dataUnit.substr(4, 2));
        data.chargeStatus = UtilService.hexToDec(dataUnit.substr(6, 2));
        data.batteryVoltage = UtilService.hexToDec(dataUnit.substr(8, 4));
        data.lockStatus = UtilService.hexToDec(dataUnit.substr(12, 2));
        if (data.lockStatus == 1) {
            data.lockStatus = false;
        } else {
            data.lockStatus = true;
        }
        data.mcc = UtilService.hexToDec(dataUnit.substr(14, 8));
        data.mnc = UtilService.hexToDec(dataUnit.substr(22, 8));
        data.lac = UtilService.hexToDec(dataUnit.substr(30, 8));
        data.cellId = UtilService.hexToDec(dataUnit.substr(38, 8));
        data.csqRssi = UtilService.hexToDec(dataUnit.substr(46, 8));
        if (data.imei) {
            data.imei = UtilService.hexToDec(data.imei);
        }

        return data;
    } `,
};
module = {
    subscribeIot() {
        mqttServer.subscribe('/data/mqtt/iot', (err) => {
            if (err) {
                console.log('Cant subscribe iot');
            }
            console.log('Subscribe to iot');
            //can handle any business logic here 
        });
    },

    decodeCallback(ack) {
        let data = {};
        let helpByte = ack.substr(ackStructure.decodeHelpByte.start, ackStructure.decodeHelpByte.end);
        helpByte = UtilService.hex2bin(helpByte);
        let hasDeviceId = helpByte.substr(2, 1) == '1';
        let hasToken = helpByte.substr(3, 1) == '1';
        data.dataType = ack.substr(ackStructure.dataType.start, ackStructure.dataType.end);
        let nextDataStart = ackStructure.deviceId.start;
        if (hasDeviceId) {
            data.imei = ack.substr(ackStructure.deviceId.start, ackStructure.deviceId.end);
            nextDataStart += ackStructure.deviceId.end;
        }
        if (hasToken) {
            data.token = ack.substr(ackStructure.token.start, ackStructure.token.end);
            nextDataStart += ackStructure.token.end;
        }
        let dataUnit = ack.substring(nextDataStart, ack.length);
        switch (data.dataType.toLowerCase()) {
            case '83':
                data = this.decodeLockCallback(dataUnit, data);
                break;

            case 'e0':
                data = this.decodeIoTConfigurationCallback(dataUnit, data);
                break;

            case 'e1':
                data = this.decodeEcuConfigurationCallback(dataUnit, data);
                break;

            case 'e2':
                data = this.decodeCurrentSpeedCallback(dataUnit, data);
                break;

            case 'e3':
                data = this.decodeLightStatusCallback(dataUnit, data);
                break;

            case 'e4':
                data = this.decodeAlarmStatusCallback(dataUnit, data);
                break;

            case 'e5':
                data = this.decodeVersionStatusCallback(dataUnit, data);
                break;

            case 'b3':
                data = this.decodeBatteryLockCallback(dataUnit, data);
                break;

            case '80':
                data = this.decodeIoTStatusCallback(dataUnit, data);
                break;

            case 'ff':
                data = this.decodeHeartBeat(dataUnit, data);
                break;

            default:
                break;
        }

        return data;
    },

    callbackReceived(data, actualCallback) {
        //  IOTCommandCallbackTrack.create({
        //     imei: data.imei,
        //     logType: 'CALLBACK',
        //     actualCallback: JSON.stringify(actualCallback),
        //     decodedCallback: data
        // });
        // write your business logic here to manage callback data.
    },

    decodeLockCallback(dataUnit, data) {
        data.lockStatus = UtilService.hexToDec(dataUnit.substr(0, 2));
        if (data.lockStatus == 1) {
            data.lockStatus = false;
        } else {
            data.lockStatus = true;
        }

        return data;
    },

    decodeIoTConfigurationCallback(dataUnit, data) {
        data.sensorSensitivityLevel = dataUnit.substr(0, 2);
        data.batteryReserveTime = dataUnit.substr(2, 2);
        data.ridePingInterval = dataUnit.substr(4, 2);
        data.lowBatteryThreshold = dataUnit.substr(6, 2);
        data.backupBatteryInterval = dataUnit.substr(8, 8);
        data.pingInterval = dataUnit.substr(16, 8);
        data.sleepPingInterval = dataUnit.substr(24, 8);

        data = UtilService.getDecimalConvertedObject(data);

        return data;
    },

    decodeEcuConfigurationCallback(dataUnit, data) {
        data.lowSpeedMode = dataUnit.substr(0, 2);
        data.middleSpeedMode = dataUnit.substr(2, 2);
        data.highSpeedMode = dataUnit.substr(4, 2);
        data.engineStartMode = dataUnit.substr(6, 2);

        data = UtilService.getDecimalConvertedObject(data);

        return data;
    },

    decodeCurrentSpeedCallback(dataUnit, data) {
        data.mode = dataUnit.substr(0, 2);
        data.isResponse = dataUnit.substr(2, 2);
        data.speed = dataUnit.substr(4, 2);
        data.currentRideDistance = dataUnit.substr(6, 8);
        data.workingCurrent = dataUnit.substr(14, 8);

        data = UtilService.getDecimalConvertedObject(data);

        data.errorCode = dataUnit.substr(22, 10)

        return data;
    },

    decodeLightStatusCallback(dataUnit, data) {
        data.headLightStatus = dataUnit.substr(0, 2);
        data.tailLightStatus = dataUnit.substr(2, 2);
        data.findIotVoiceStatus = dataUnit.substr(4, 2);

        data = UtilService.getDecimalConvertedObject(data);

        return data;
    },

    decodeAlarmStatusCallback(dataUnit, data) {
        switch ('01') {
            case dataUnit.substr(0, 2):
                data.alarmType = 1;
                break;

            case dataUnit.substr(2, 2):
                data.alarmType = 2;
                break;

            case dataUnit.substr(4, 2):
                data.alarmType = 3;
                break;

            case dataUnit.substr(6, 2):
                data.alarmType = 4;
                break;

            case dataUnit.substr(8, 2):
                data.alarmType = 5;
                break;

            default:
                break;
        }

        return data;
    },

    decodeVersionStatusCallback(dataUnit, data) {
        let nextDataStart = 0;
        if (dataUnit.substr(nextDataStart, nextDataStart += 2) == '01') {
            data.iotFirmwareVersion = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.iotHardwareVersion = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.ecuFirmwareVersion = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.ecuHardwareVersion = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.bluetoothFirmwareVersion = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.batteryLockStatus = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.lockStatus = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.iccid = dataUnit.substring(nextDataStart, nextDataStart += 46);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.blueToothMac = dataUnit.substring(nextDataStart, nextDataStart += 14);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.serialNo = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.iotHardwareVersion = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.iotSerialNo = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }
        if (dataUnit.substring(nextDataStart, nextDataStart += 2) == '01') {
            data.ecuSerialNo = dataUnit.substring(nextDataStart, nextDataStart += 78);
        }

        data = UtilService.getDecimalConvertedObject(data);

        return data;
    },

    decodeBatteryLockCallback(dataUnit, data) {
        data.batteryLockStatus = UtilService.hexToDec(dataUnit.substr(0, 2));
        if (data.batteryLockStatus == 1) {
            data.batteryLockStatus = false;
        } else {
            data.batteryLockStatus = true;
        }

        return data;
    },

    decodeIoTStatusCallback(dataUnit, data) {
        if (dataUnit.substr(0, 2) == '00') {
            data.lngDirection = 'E';
        } else {
            data.lngDirection = 'W';
        }
        let longitude = dataUnit.substr(2, 8);
        longitude = UtilService.hexToDec(longitude);
        longitude /= 1000000;
        if (dataUnit.substr(10, 2) == '00') {
            data.latDirection = 'N';
        } else {
            data.latDirection = 'S';
        }
        let latitude = dataUnit.substr(12, 8);
        latitude = UtilService.hexToDec(latitude);
        latitude /= 1000000;
        let { lat, lng } = UtilService.setDirectionWiseLocation(data.latDirection, data.lngDirection, latitude, longitude);
        data.lat = lat;
        data.lng = lng;

        data.noOfLocatedStars = UtilService.hexToDec(dataUnit.substr(20, 2));
        data.gpsSpeed = UtilService.hexToDec(dataUnit.substr(22, 2));
        data.altitude = UtilService.hexToDec(dataUnit.substr(24, 4));
        data.azimuth = UtilService.hexToDec(dataUnit.substr(28, 4));
        data.mcc = UtilService.hexToDec(dataUnit.substr(32, 8));
        data.mnc = UtilService.hexToDec(dataUnit.substr(40, 8));
        data.lac = UtilService.hexToDec(dataUnit.substr(48, 8));
        data.cellId = UtilService.hexToDec(dataUnit.substr(56, 8));
        data.csqRssi = UtilService.hexToDec(dataUnit.substr(64, 8));
        data.dateTime = dataUnit.substr(72, 16);
        data.lockStatus = UtilService.hexToDec(dataUnit.substr(88, 2));
        if (data.lockStatus == 1) {
            data.lockStatus = false;
        } else {
            data.lockStatus = true;
        }
        data.chargeStatus = UtilService.hexToDec(dataUnit.substr(90, 2));
        data.batteryVoltage = UtilService.hexToDec(dataUnit.substr(92, 4));
        data.batteryLevel = UtilService.hexToDec(dataUnit.substr(96, 2));
        data.backupBatteryVoltage = UtilService.hexToDec(dataUnit.substr(98, 4));
        data.backupBatteryLevel = UtilService.hexToDec(dataUnit.substr(102, 2));
        if (data.imei) {
            data.imei = UtilService.hexToDec(data.imei);
        }

        return data;
    },

    decodeHeartBeat(dataUnit, data) {
        data.reservedBatteryLevel = UtilService.hexToDec(dataUnit.substr(2, 2));
        data.temperature = UtilService.hexToDec(dataUnit.substr(4, 2));
        data.chargeStatus = UtilService.hexToDec(dataUnit.substr(6, 2));
        data.batteryVoltage = UtilService.hexToDec(dataUnit.substr(8, 4));
        data.lockStatus = UtilService.hexToDec(dataUnit.substr(12, 2));
        if (data.lockStatus == 1) {
            data.lockStatus = false;
        } else {
            data.lockStatus = true;
        }
        data.mcc = UtilService.hexToDec(dataUnit.substr(14, 8));
        data.mnc = UtilService.hexToDec(dataUnit.substr(22, 8));
        data.lac = UtilService.hexToDec(dataUnit.substr(30, 8));
        data.cellId = UtilService.hexToDec(dataUnit.substr(38, 8));
        data.csqRssi = UtilService.hexToDec(dataUnit.substr(46, 8));
        if (data.imei) {
            data.imei = UtilService.hexToDec(data.imei);
        }

        return data;
    }
};