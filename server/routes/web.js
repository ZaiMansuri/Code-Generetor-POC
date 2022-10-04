const path = require('path');
const express = require('express');
const multer = require('multer')
let https = require("https");
let fs = require("fs");
var request = require("request");
let jszip = require('jszip');
let zip = new jszip();
let dataSetMqtt = require("../MQTTScooter/datasetMQTT");
let mqttServer = require('../MQTTScooter/server');
let iotCallbackHandler = require('../iotCallbackHandler');
// The authentication key (API Key).
const router = express.Router();
const API_KEY = "zara88222@gmail.com_0848d972ea04b993";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/uploads')
    },
    filename: function (req, file, cb) {
        // You could rename the file name
        // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))

        // You could use the original name
        cb(null, file.originalname)
    }
});

let upload = multer({
    storage: storage
})

function pdfCo(req, params) {
    var query = `https://api.pdf.co/v1/pdf/convert/to/json`;
    let reqOptions = {
        uri: query,
        headers: {
            "x-api-key": API_KEY
        },
        formData: {
            name: path.basename(req.destinationFile),
            async: 'False',
            file: fs.createReadStream(req.sourceFile)
        }
    };
    // Send request
    request.post(reqOptions, function (error, response, body) {
        if (error) {
            return console.error("Error: ", error);
        }
        // Parse JSON response
        let isChecked;
        let data = JSON.parse(body);
        if (data.error == false) {
            // Download JSON file
            var file = fs.createWriteStream(req.destinationFile);
            https.get(data.url, (response2) => {
                response2.pipe(file)
                    .on("close", () => {
                        console.log(`Generated JSON file saved as "${req.destinationFile}" file.`);
                        goToCodes(req.destinationFile);
                        return true;
                        resolve(true);
                    });
            });
        } else {
            // Service reported error
            console.log("Error: " + data.message);
        }
    });
    // goToCodes(req.destinationFile, params);
    return true;
}

function goToCodes(DestinationFile, params) {
    //put promise hhere
    let isMQTT = false;
    let isFitcoo = false;
    let isUrbane = false;
    console.log('DestinationFile :>> ', DestinationFile);
    let result;
    // new Promise((resolve, reject) => {
    let data = fs.readFileSync(DestinationFile, "utf8");
    // let jsonData = JSON.stringify(data);
    let jsonData = JSON.parse(data);
    let dataSet = new Set();
    if (jsonData && jsonData.document) {
        if (jsonData.document.page) {
            if (jsonData.document.page && jsonData.document.page.row && jsonData.document.page.row.length) {
                // for (let page of jsonData.document.page) {
                for (let r of jsonData.document.page.row) {
                    if (r.column && typeof 'object') {
                        for (let i of r.column) {
                            let data = i;
                            if (data && data.text && typeof data.text == 'object') {
                                let keywords = data.text["#text"]
                                if (typeof keywords == 'string') {
                                    if (keywords.includes('MQTT') || keywords.includes('mqtt') || keywords.includes('Mqtt')) {
                                        isMQTT = true;
                                    }
                                    if (keywords.includes('FitRider') || keywords.includes('Fitcoo')) {
                                        isFitcoo = true;
                                    }
                                    if (keywords.includes('urbane') || keywords.includes('Urbane') || keywords.includes('URBANE')) {
                                        isUrbane = true;
                                    }
                                    dataSet.add(keywords);
                                }
                            }
                        }
                    }
                }
                // }
            }
            else {
                for (let page of jsonData.document.page) {
                    for (let r of page.row) {
                        if (r.column && typeof 'object') {
                            for (let i of r.column) {
                                let data = i;
                                if (data && data.text && typeof data.text == 'object') {
                                    let keywords = data.text["#text"]
                                    if (typeof keywords == 'string') {
                                        if (keywords.includes('MQTT') || keywords.includes('mqtt') || keywords.includes('Mqtt')) {
                                            isMQTT = true;
                                        }
                                        if (keywords.includes('FitRider') || keywords.includes('Fitcoo')) {
                                            isFitcoo = true;
                                        }
                                        if (keywords.includes('urbane') || keywords.includes('Urbane') || keywords.includes('URBANE')) {
                                            isUrbane = true;
                                        }
                                        dataSet.add(keywords);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            let isExist;
            console.log('isMQTT :>> ', isMQTT, isFitcoo, isUrbane);
            // console.log('dataSet :>> ', dataSet);
            isExist = dataSetMqtt.getPacifierName(dataSet, params);
            console.log('isExist :>> ', isExist);
            result = isExist;
        }
    }
    console.log('end go to code  :>> ', result);
    return result;
}

// Upload Image
router.post("/upload", upload.single('file'), (req, res, next) => {

    let filename = req.file.filename.split('.').slice(0, -1).join('.');
    let params = { port: req.headers.port, username: req.headers.username, password: req.headers.password, ip: req.headers.ip };
    console.log('filename :>> ', filename);
    let result = pdfCo({
        sourceFile: req.file.path,
        destinationFile: `assets/convertJson/${filename}.json`,
    }, params);

    console.log('result in post :>> ', result);
    if (result) {
        let obj = {
            image: req.file.path,
            result: '/sourceCode.zip'
        };
        return res.json(obj);
    }
});

module.exports = router;