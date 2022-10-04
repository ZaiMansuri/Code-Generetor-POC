let fs = require('fs');
let jszip = require('jszip');
let zip = new jszip();
let crcode = require('../crc');
let IotCommandFitco = require('../FITCOOMQTT/iot');
let callbackIotFitco = require('../FITCOOMQTT/callback');
let serverFitco = require('../FITCOOMQTT/server');
let iotUrbane = require('../URBANEMQTT/iot');
let callbackUrbane = require('../URBANEMQTT/callback');
let serverUrbane = require('../URBANEMQTT/server');
let IotCommandLannmarker = require('./iot');
let callbackIotLannmarker = require('./callback');
let mqttServerLannmarker = require('./server');
let iotCallbackHandlerLannmarker = require('../iotCallbackHandler');
const { cpuUsage } = require('process');
module.exports = {
  getPacifierName(data, params) {

    const propertyLannmarker = [
      "MT1",
      "mt",
      "Id",
      "iot_hw",
      "iot_sw",
      "ecu_hw",
      "product",
      "ecu_sw",
      "mac",
      "MT2",
      "MT4",
      "MT5",
      "mn",
      "gtc",
      "la",
      "lo",
      "su",
      "va",
      "gs",
      "rm",
      "mcc",
      "ss",
      "mnc",
      "tt",
      "td",
      "io",
      "ws",
      "rf",
      "hs",
      "sf",
      "ib",
      "sb",
      "pw",
      "cy",
      "sl",
      "rtc",
      "pa",
      "apad",
      "auser",
      "Ip",
      "port",
      "ping",
      "tripint",
      "statint",
      "mqid",
      "mquser",
      "mqpass",
      "speedlim",
      "network",
      "network2",
      "network3",
      "pdop",
      "impact",
      "batsn",
      "totrip",
      "totime",
      "tocap",
      "ctype",
      "cell",
    ];
    const propertyFitcoo = [
      // "a",
      // "i",
      // "t",
      // "s",
      // "d",
      // "c",
      // "k",
      // "h",
      // "p",
      // "y",
      // "l",
      // "x",
      // "d",
      // "q",
      // "w",
      // "z",
      // "p",
      // "e",
      // "n",
      // "u",
      // "b",
      // "g",
      // "m",
      "Shutdown (down)",
      "power on (down)",
      "Clear one-time riding mileage (down)",
      "Clear single riding time (down)",
      "Clear total mileage (down)",
      "Clear the total riding time (down)",
      "Set the speed limit data (down)",
      "Get the vehicle parameters (down)",
      "Indicates upload latitude and longitude(GGA format) (down)",
      "Restart (down)",
      "Requested hardware information (down)",
      "Upgrade firmware (down)",
      "Issue upgraded firmware",
      "Request SIM Instruction",
      "Alarm( down",
      "Get user parameters (down)",
      "Headlight switchover setting (down)",
      "Headlight control (down)",
      "power on the",
      "power off the",
      "clear one-time riding mileage,",
      "clear single riding time,",
      "clear total mileage,",
      "total riding time,",
      "the speed at",
      "the speed at",
      "vehicle parameters,",
      "latitude,",
      "restart the network",
      "hardware info ",
      "get SIM card number",
      "alarm of network",
      "get user parameters,",
      "headlight always on",
      "Vibration setting (down)",
      "Kilometer mile switchover setting (down)",
      "Set APN",
      "Remove battery(down)",
      "Lock battery(down)",
      "Headlight control (down)",
    ];
    const propertyUrbane = [
      "0x50",
      "0xe0",
      "0x51",
      "0xe1",
      "0x52",
      "0xe2",
      "0x53",
      "0xe3",
      "0x54",
      "0xe4",
      "0x55",
      "0xe5",
      "0x80",
      "0x01",
      "0x83",
      "0x23",
      "0xb3",
      "0xFF",
    ];
    let codeBlock = { iot: {}, iotCallback: {} };
    let isLanMarker = false;
    let isFitcoo = false;
    let isUrbane = false;
    zip.folder("MQTT/SourceCode");
    if (fs.existsSync("/server/assets/tmp")) {
      console.log('in dir exist :>> ');
      fs.rmdir("/server/assets/tmp", { recursive: true })
        .then(() => console.log('directory removed!'));
    }
    for (let d of data) {
      if ((d.includes('FitRider') || d.includes('Fitcoo')) && !isFitcoo) {
        isFitcoo = true;
        codeBlock.iot = (IotCommandFitco.imports);
        codeBlock.iotCallback = (callbackIotFitco.imports);
        codeBlock.iotCallback += callbackIotFitco.subscribeIot;
        codeBlock.iot += (IotCommandFitco.publishToIot);
        // console.log('codeBlock.iotCallback :>> ', codeBlock.iotCallback);
      }
      else if ((d.includes('urbane') || d.includes('Urbane') || d.includes('URBANE')) && !isUrbane) {
        isUrbane = true;
        codeBlock.iotCallback = Object.values(callbackUrbane).join("");
        codeBlock.iot = Object.values(iotUrbane.imports).join("");
        codeBlock.iot += Object.values(iotUrbane.publishToIot).join("");
        codeBlock.iot += Object.values(iotUrbane.location).join("");
        zip.file('MQTT/SourceCode/crc.js', Object.values(crcode.crc).join(""));
        fs.writeFileSync('assets/tmp/crc.js', Object.values(crcode.crc).join(""));
      } else if (!isUrbane && !isFitcoo) {
        isLanMarker = true;
        codeBlock.iotCallback = (callbackIotLannmarker.imports);
        codeBlock.iot = (IotCommandLannmarker.imports);
        codeBlock.iot += (IotCommandLannmarker.publishToIot);
        codeBlock.iotCallback += (callbackIotLannmarker.otherDataReceived);
        codeBlock.iotCallback += (callbackIotLannmarker.getIotUpdateInfo);
        codeBlock.iotCallback += (callbackIotLannmarker.modifyKeys);

      }
    }

    console.log('isFitcoo :>> ', isFitcoo, isUrbane, isLanMarker);
    let iot = {};
    for (let d of data) {
      if (isFitcoo) {
        let word = propertyFitcoo.includes(d);
        if (word) {
          console.log(word, d);
          switch (d) {
            case "Shutdown (down)":
              codeBlock.iot += IotCommandFitco.lockUnlock;
              codeBlock.iot += (IotCommandFitco.powerOn);
              break;
            case 'Shutdown (down)':
              codeBlock.iot += (IotCommandFitco.powerOff);
              break;
            case 'Clear one-time riding mileage (down)':
              codeBlock.iot += (IotCommandFitco.clearOneTimeMilage);
              break;
            case 'Clear single riding time (down)':
              codeBlock.iot += (IotCommandFitco.singleRideClearMilageReport);
              break;
            case 'Clear total mileage (down)':
              codeBlock.iot += (IotCommandFitco.totalMilageClear);
              break;
            case 'Clear the total riding time (down)':
              codeBlock.iot += (IotCommandFitco.totalRidingTimeClear);
              break;
            case 'Set the speed limit data (down)':
              codeBlock.iot += (IotCommandFitco.setMaxSpeed);
              break;
            case 'Get the vehicle parameters (down)':
              codeBlock.iot += (IotCommandFitco.track);
              break;
            case 'Indicates upload latitude and longitude(GGA format) (down)':
              codeBlock.iot += (IotCommandFitco.location);
              break;
            case 'Restart (down)':
              codeBlock.iot += (IotCommandFitco.restart);
              break;
            case 'Requested hardware information (down)':
              codeBlock.iot += (IotCommandFitco.hardwareInfo);
              break;
            case 'get SIM card number':
              codeBlock.iot += (IotCommandFitco.getSimInfo);
              break;
            case 'Alarm( down':
              codeBlock.iot += (IotCommandFitco.alarmOn);
              break;
            case 'Get user parameters (down)':
              codeBlock.iot += (IotCommandFitco.getUserParams);
              break;
            case 'Headlight control (down)':
              codeBlock.iot += (IotCommandFitco.forceLightOn);
              break;
            case 'Vibration setting (down)':
              codeBlock.iot += (IotCommandFitco.vibrationSetting);
              break;
            case 'Kilometer mile switchover setting (down)':
              codeBlock.iot += (IotCommandFitco.kilometerMileSwitch);
              break;
            case 'Set APN':
              codeBlock.iot += (IotCommandFitco.setAPN);
              break;
            case 'Remove battery(down)':
              codeBlock.iot += (IotCommandFitco.removeBattery);
              break;
            case 'Lock battery(down)':
              codeBlock.iot += (IotCommandFitco.lockBattery);
              break;
            case 'Headlight switchover setting (down)':
              codeBlock.iot += (IotCommandFitco.lightOff);
              codeBlock.iot += (IotCommandFitco.lightOn);
              break;
          }
        }
      }
      else if (isUrbane) {
        let word = propertyUrbane.includes(d);
        if (word) {
          console.log(word, d);
        }
        switch (d) {
          case "0x01":
            codeBlock.iot += (iotUrbane.lockUnlock);
            break;
          case "0x50":
            codeBlock.iot += iotUrbane.setPingInterval;
            codeBlock.iot += iotUrbane.setRidePingInterval;
            break;
          case "0x52": codeBlock.iot += iotUrbane.setMaxSpeed;
            break;
          case "0x53": codeBlock.iot += iotUrbane.lightOn;
            codeBlock.iot += iotUrbane.lightOff;

            break;
          case "0x54": codeBlock.iot += iotUrbane.alarmOn;
            codeBlock.iot += iotUrbane.alarmOff;
            break;

          case "0x55": codeBlock.iot += iotUrbane.statusVersion;
            break;
        }
      }
      else if (!isUrbane && !isFitcoo) {
        let word = propertyLannmarker.includes(d);
        // find keywords regarding code in mqtt folder files
        if (word) {
          console.log(word, d);
          switch (d) {
            case 'MT2':
              // code block
              codeBlock.iotCallback += Object.values(callbackIotLannmarker.mt2Received).join("");
              codeBlock.iot += Object.values(IotCommandLannmarker.lock).join("");
              codeBlock.iot += Object.values(IotCommandLannmarker.lightOn).join("");
              codeBlock.iot += Object.values(IotCommandLannmarker.lightOff).join("");
              codeBlock.iot += Object.values(IotCommandLannmarker.alarmOn).join("");
              codeBlock.iot += Object.values(IotCommandLannmarker.alarmOff).join("");
              codeBlock.iot += Object.values(IotCommandLannmarker.setMaxSpeed).join("");
              codeBlock.iot += Object.values(IotCommandLannmarker.setPingInterval).join("");
              codeBlock.iot += Object.values(IotCommandLannmarker.setRidePingInterval).join("");
              codeBlock.iot += Object.values(IotCommandLannmarker.track).join("");
              codeBlock.iot += Object.values(IotCommandLannmarker.publishToIot).join("");
              break;
            case 'MT1':
              // code block
              codeBlock.iotCallback += Object.values(callbackIotLannmarker.subscribeIot).join("");
              codeBlock.iotCallback += Object.values(callbackIotLannmarker.mt1Received).join("");
              codeBlock.iot += Object.values(IotCommandLannmarker.subscribeToIot).join("");
              break;
            case 'MT4':
              // code block
              codeBlock.iotCallback += Object.values(callbackIotLannmarker.mt4Received).join("");
              break;
            case 'MT5':
              // code block
              codeBlock.iotCallback += Object.values(callbackIotLannmarker.mt5Received).join("");
              break;
          }
        }
        // console.log('codeBlock :>> ', codeBlock);
      }
    }
    //server file write
    if (isFitcoo) {
      let startServer = serverFitco.data(params.port, params.username, params.password);
      let sObj = { server: startServer, publish: serverFitco.publish, subscribe: serverFitco.subscribe };
      zip.file('MQTT/SourceCode/server.js', Object.values(sObj).join(""));
      fs.writeFileSync('assets/tmp/server.js', Object.values(sObj).join(""));
    }
    else if (isUrbane) {
      let startServer = serverFitco.data(params.port, params.username, params.password);
      let sObj = { server: startServer, publish: serverUrbane.publish, subscribe: serverUrbane.subscribe };
      zip.file('MQTT/SourceCode/server.js', Object.values(sObj).join("") + '}');
      fs.writeFileSync('assets/tmp/server.js', Object.values(sObj).join("") + '}');
    }
    else {
      let startServer = mqttServerLannmarker.data(params.port, params.username, params.password);
      let sObj = { server: startServer, publish: mqttServerLannmarker.publish, subscribe: mqttServerLannmarker.subscribe };
      zip.file('MQTT/SourceCode/server.js', Object.values(sObj).join(""));
      fs.writeFileSync('assets/tmp/server.js', Object.values(sObj).join(""));
    }
    if (codeBlock) {
      //cmd file write
      if (codeBlock.iot) {
        zip.file('MQTT/SourceCode/iot.js', codeBlock.iot + "}");
        fs.writeFileSync('assets/tmp/iot.js', (codeBlock.iot) + `}`);
      }
      if (codeBlock.iotCallback) {
        console.log('codeBlock.iotCallback :>> ', codeBlock.iotCallback + `}`);
        console.log('typeoff :>> ', typeof codeBlock.iotCallback);
        zip.file('MQTT/SourceCode/callback.js', codeBlock.iotCallback + `}`);
        fs.writeFileSync('assets/tmp/callback.js', codeBlock.iotCallback + `}`, 'utf8');
      }
      zip.file('MQTT/SourceCode/iotCallbackHandler.js', Object.values(iotCallbackHandlerLannmarker).join(""));
      fs.writeFileSync('assets/tmp/iotCallbackHandler.js', Object.values(iotCallbackHandlerLannmarker).join(""));
      //create zip file to user
      if (jszip.support.uint8array) {
        console.log('1 in uni8');
        promise = zip.generateAsync({
          type: "uint8array"
        });
      } else {
        console.log('2 in string');
        promise = zip.generateAsync({
          type: "string"
        });
      }
      zip
        .generateNodeStream({
          type: 'nodebuffer',
          streamFiles: true
        })
        .pipe(fs.createWriteStream('./sourceCode.zip'))
        .on('finish', function () {
          console.log("sourceCode.zip written success.");
        });
      return true;
    } I
    return false;
  },
};