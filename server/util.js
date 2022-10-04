"use strict";
const _ = require("lodash");
const iplocation = require("iplocation").default;
const moment = require("moment");

module.exports = {
    /**
     * @description generate slug from string
     * @param text
     * @return {string}
     */
    slugify: (text) => {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "-") // Replace spaces with -
            .replace(/[^\w\-]+/g, "") // Remove all non-word chars
            .replace(/\-\-+/g, "-") // Replace multiple - with single -
            .replace(/^-+/, "") // Trim - from start of text
            .replace(/-+$/, "");
    },
    randomString(strLength) {
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZ123456abcdefghiklmnopqrstuvwxyz";
        let string_length = strLength || 8;
        let randomstring = "";
        let charCount = 0;
        let numCount = 0;

        for (let i = 0; i < string_length; i++) {
            // If random bit is 0, there are less than 3 digits already saved, and there are not already 5 characters saved, generate a numeric value.
            if (
                (Math.floor(Math.random() * 2) == 0 && numCount < 3) ||
                charCount >= 5
            ) {
                let rnum = Math.floor(Math.random() * 10);
                randomstring += rnum;
                numCount += 1;
            } else {
                // If any of the above criteria fail, go ahead and generate an alpha character from the chars string
                let rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum, rnum + 1);
                charCount += 1;
            }
        }

        return randomstring;
    },

    /**
     * @description: humanize string into readable format
     * @param str
     */
    humanize: (str) => {
        return str
            .replace(/^[\s_]+|[\s_]+$/g, "")
            .replace(/[_\s]+/g, " ")
            .replace(/^[a-z]/, (m) => {
                return m.toUpperCase();
            });
    },
    /**
     * Merge multiple objects into one
     * @param roles
     * @returns {*}
     */
    mergeObjects: function (roles) {
        // Custom merge function ORs together non-object values, recursively
        // calls itself on Objects.
        let merger = function (a, b) {
            if (_.isObject(a)) {
                return _.merge({}, a, b, merger);
            }

            return a || b;
        };

        // Allow roles to be passed to _.merge as an array of arbitrary length
        let args = _.flatten([{}, roles, merger]);

        return _.merge.apply(_, args);
    },
    /**
     * @description getting base URL of project
     * @return {string}
     */
    getBaseUrl: () => {
        if (sails.config.custom && sails.config.custom.baseUrl) {
            return sails.config.custom.baseUrl;
        }
        let usingSSL =
            sails.config.ssl && sails.config.ssl.key && sails.config.ssl.cert;
        let port = sails.config.proxyPort || sails.config.port;
        let domain = "";
        let interfaces = require("os").networkInterfaces();
        for (let devName in interfaces) {
            let iface = interfaces[devName];
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                if (
                    alias.family === "IPv4" &&
                    alias.address !== "127.0.0.1" &&
                    !alias.internal
                ) {
                    domain = alias.address;
                }
            }
        }
        let localAppURL = `${usingSSL ? "https" : "http"}://${domain}${
            port == 80 || port == 443 ? "" : `:${port}`
        }`;

        return localAppURL;
    },
    randomNumber: (length = 4) => {
        let numbers = "123456789123456789";
        let result = "";
        for (let i = length; i > 0; --i) {
            result += numbers[Math.round(Math.random() * (numbers.length - 1))];
        }
        return result;
    },
    getPrimaryEmail(emails) {
        if (emails && _.size(emails) > 0) {
            let email = _.find(emails, (email) => {
                return email.isPrimary;
            });

            return email && email.email ? email.email : "";
        }

        return "";
    },

    /**
     * @function generateModelLocalId
     * @description generate local id based on model specified
     * @param options => "{
     *                      "parentId":<string>
     *                   }"
     * @param callback
     */
    generateModelLocalId: function (options, callback) {
        let self = this;
        let Model;
        if (_.isObject(options.model)) {
            Model = options.model;
        } else {
            Model = sails.models[options.model];
        }
        let params = {};
        async.waterfall([
            // get parent location
            function (wcb) {
                let filter = {};
                if (options.parentId) {
                    filter = {
                        where: {
                            id: options.parentId,
                        },
                    };
                } else {
                    filter = {
                        where: {
                            parentId: null,
                        },
                    };
                }
                filter.sort = "localIdSequence DESC";
                filter.limit = 1;
                Model.find(filter).exec((err, parents) => {
                    if (err) {
                        callback(err);
                    }

                    if (parents && parents.length) {
                        let parent = parents[0];
                        // set parent local id
                        if (options.parentId) {
                            params.parentLocalId = parent.localId;
                        }
                        wcb(null, parent);
                    } else {
                        wcb(null, undefined);
                    }
                });
            },

            // generate local id
            function (parent, wcb) {
                if (options.parentId && parent) {
                    // find last group sequence record for generate next localId
                    let filter = {
                        where: {
                            parentLocalId: parent.localId,
                        },
                    };
                    filter.sort = "localIdSequence DESC";
                    filter.limit = 1;
                    Model.find(filter).exec((err, lastGroupSequenceRecords) => {
                        if (err) {
                            callback(err);
                        }

                        // if last record available generate local id after that
                        if (
                            lastGroupSequenceRecords &&
                            lastGroupSequenceRecords.length
                        ) {
                            let lastGroupSequenceRecord =
                                lastGroupSequenceRecords[0];
                            var localOptions = {};
                            localOptions.lastLocalId = parent.localId;
                            localOptions.lastSeqNum =
                                lastGroupSequenceRecord.localIdSequence;
                            localOptions.onlyAlphabet = false; // set alphabet false , due to local id available
                            params.localIdSequence =
                                lastGroupSequenceRecord.localIdSequence + 1;
                            params.lastSeqNum =
                                lastGroupSequenceRecord.localIdSequence + 1; // set last sequence + 1
                            params.localId = self.generateLocalId(localOptions); // generate local id
                            callback(null, params);
                        }
                        // if not available last record , then generate local id based on parent
                        else {
                            var localOptions = {};
                            localOptions.lastLocalId = parent.localId; // set local id of parent
                            localOptions.lastSeqNum = 0; // set last sequence as zero
                            localOptions.onlyAlphabet = false; // set alphabet false , due to local id available
                            params.localIdSequence = 1; // and next sequence as one plus last sequence
                            params.lastSeqNum = 1;
                            params.localId = self.generateLocalId(localOptions);
                            callback(null, params);
                        }
                    });
                }
                // if parent id not available in request, generate new local id
                else {
                    let localOptions = {};
                    localOptions.lastLocalId =
                        parent && parent.localId ? parent.localId : "";
                    localOptions.lastSeqNum =
                        parent && parent.localIdSequence
                            ? parent.localIdSequence || 0
                            : 0;
                    localOptions.onlyAlphabet = !(parent && options.parentId); // if parent id available in req. set alphabet true, otherwise false
                    params.localIdSequence =
                        parent && parent.localIdSequence
                            ? (parent.localIdSequence || 0) + 1
                            : 1; // if local id sequence available ,increment
                    params.lastSeqNum = localOptions.lastSeqNum;
                    params.localId = self.generateLocalId(localOptions);
                    callback(null, params);
                }
            },
        ]);
    },

    /**
     * Alphabet auto generate sequence array
     * @param options => number        integer     count of total alphabet array sequence
     * @param options => lastLocalId     string      Starting character of sequence
     * @param obj           string      Extra object details
     *                                  only_alphabet: true ? Generate only alphabetic ids : 'A-1-1-'
     * @returns {Array}     array       Array of alphabet sequence
     * ex.
     *  request num : 5
     *          start_cha : "Y" => array start with +1 character
     *  return  array : ["Z", "AA", "AB", "AC", "AD"]
     *
     *  request num : 5
     *          start_cha : "" => array start with +1 character
     *  return  array : ["A", "B", "C", "D", "E"]
     */
    generateLocalId: function (options) {
        // set default parameters, if not available in request
        if (!_.has(options, "returnString") && !options.returnString) {
            options.returnString = true;
        }
        if (!_.has(options, "onlyAlphabet") && !options.onlyAlphabet) {
            options.onlyAlphabet = false;
        }
        if (!_.has(options, "addSuffix") && !options.addSuffix) {
            options.addSuffix = "-";
        }
        if (!_.has(options, "number") && !options.number) {
            options.number = 1;
        }

        let letters = "";
        let letterSeries = [];
        let i = 1;
        let lastLocalId = options.lastLocalId;
        if (options.onlyAlphabet) {
            lastLocalId = !_.isEmpty(lastLocalId)
                ? _.first(lastLocalId.split("-"))
                : "";

            /**
             * fromLetters => String letter to sequence number
             * ex. A - 1, B - 2, .. , AA - 27
             */
            let baseChar = 1;
            let len = lastLocalId.length;
            let pos = len;
            while ((pos -= 1) > -1) {
                baseChar +=
                    (lastLocalId.charCodeAt(pos) - 64) *
                    Math.pow(26, len - 1 - pos);
            }

            /**
             * toLetters => Number to Alphabet letter
             * @param num => Int => ex. 1   2   ..  27
             * @returns {string} => ex. A   B   ..  AA
             */
            var toLetters = function (num) {
                "use strict";
                let mod = num % 26;
                let pow = (num / 26) | 0;
                let out = mod ? String.fromCharCode(64 + mod) : (pow--, "Z");

                return pow ? toLetters(pow) + out : out;
            };

            do {
                letters = toLetters(baseChar);
                letterSeries.push(letters);
                baseChar += 1;
                i += 1;
            } while (i <= options.number);

            if (
                options &&
                ((options.addPrefix && !_.isEmpty(options.addPrefix)) ||
                    (options.addSuffix && !_.isEmpty(options.addSuffix)))
            ) {
                _.each(letterSeries, (ls, index) => {
                    if (options.addPrefix) {
                        letterSeries[index] = `${options.addPrefix}${ls}`;
                    }
                    if (options.addSuffix) {
                        letterSeries[index] = `${ls}${options.addSuffix}`;
                    }
                });
            }

            if (options.returnString) {
                return _.first(letterSeries);
            }

            return letterSeries;
        }
        options.lastSeqNum = options.lastSeqNum ? options.lastSeqNum : 0;
        let nextId = `${lastLocalId}${options.lastSeqNum + 1}-`;

        return nextId;
    },
    async getClientIpInfo(ip) {
        console.log(ip);
        ip = ip.replace("::ffff:", "");
        console.log(ip);

        return new Promise((resolve, reject) => {
            iplocation(ip, [], (error, res) => {
                if (error) {
                    console.log("failes to find ip details");
                }
                resolve({
                    ip: ip,
                    address: {
                        country: res && res.country ? res.country : "",
                        region: res && res.region ? res.region : "",
                        city: res && res.city ? res.city : "",
                        postalCode: res && res.postal ? res.postal : "",
                        latitude: res && res.latitude ? res.latitude : "",
                        longitude: res && res.longitude ? res.longitude : "",
                    },
                    time: moment().toISOString(),
                });
            });
        });
    },
    doubleDateToString(doubleDate) {
        return doubleDate
            ? moment(doubleDate * 1000 * 60 * 60 * 24).format("MM/DD/YYYY")
            : "";
    },
    doubleDateToISO(doubleDate) {
        return doubleDate
            ? moment(doubleDate * 1000 * 60 * 60 * 24).toISOString()
            : "";
    },
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    convertObjectIdToString(array, key) {
        let response = [];
        _.each(array, (value) => {
            response.push(value[key].toString());
        });

        return response;
    },
    getDateWithCurrentTime(date) {
        let newDate = new Date(date).toTimeString();
        newDate = new Date(`${new Date().toDateString()} ${newDate}`);

        return newDate;
    },
    getStartOfTheDay(date) {
        return `${moment(date).format("YYYY-MM-DD")}T00:00:00.000Z`;
    },
    getEndOfTheDay(date) {
        return `${moment(date).format("YYYY-MM-DD")}T23:59:59.999Z`;
    },
    getFirstDateOfMonth(date) {
        return `${moment(date).format("YYYY-MM")}-01T00:00:00.000Z`;
    },
    displayDateTime: (date, hour24 = false) => {
        let timeStr = "hh:mm A";
        if (hour24) timeStr = "HH:mm";
        return date ? moment(date).format("DD-MM-YYYY, " + timeStr) : "-";
    },
    getTimeFromNow() {
        return moment().toISOString();
    },
    formatDate: (date) => {
        return date ? moment(date).format("MMM DD, YYYY HH:mm:ss a") : "-";
    },
    createDateFromTwoDate(takeDate, takeTime) {
        return moment(
            `${takeDate} ${takeTime}`,
            "DD/MM/YYYY HH:mm"
        ).toISOString();
    },
    getPrimaryValue: (array, key) => {
        return array && array.length
            ? _.find(array, {
                  isPrimary: true,
              })[key]
            : "";
    },
    getPrimaryObj: (array) => {
        return array && array.length
            ? _.find(array, {
                  isPrimary: true,
              })
            : "";
    },
    getTimeDifference(start, end, unit = "minutes") {
        let time = moment(end).diff(moment(start), "seconds");
        if (unit === "minutes") {
            time /= 60;
        }
        if (unit === "days") {
            time /= 60 * 60 * 24;
        }

        return Number(parseFloat(time).toFixed(2));
    },
    addTime(value, time = null, unit = "minutes") {
        if (time === null) {
            time = moment().toISOString();
        }

        return moment(time).add(value, unit).toISOString();
    },
    getFloat(value) {
        return Number(parseFloat(value).toFixed(2));
    },
    formatTime(value, unit = "seconds") {
        let duration = moment
            .utc(moment.duration(value, unit).as("milliseconds"))
            .format("HH:mm:ss");

        return duration;
    },
    convertMeterToDefaultDistanceType(meters) {
        if (meters <= 0) {
            return 0;
        }
        let distanceDivider = 1000;
        if (
            sails.config.DEFAULT_DISTANCE_UNIT ===
            sails.config.DISTANCE_UNIT.MILES
        ) {
            distanceDivider = 1609;
        }
        let distance = meters / distanceDivider;

        return distance;
    },
    difference(object, base) {
        function changes(object, base) {
            return _.transform(object, (result, value, key) => {
                if (!_.isEqual(value, base[key])) {
                    result[key] =
                        _.isObject(value) && _.isObject(base[key])
                            ? changes(value, base[key])
                            : value;
                }
            });
        }

        return changes(object, base);
    },
    convertOmniUTCDate(date, time) {
        let newDate = `${date} ${time}`;

        return moment(newDate, "DDMMYY HHmmss.SS").toISOString();
    },
    convertKmToMiles(km) {
        if (km <= 0) {
            return km;
        }

        return Number(parseFloat(km / 1.609344).toFixed(2));
    },
    currTimeInYearForIot(date = null) {
        let time = moment();
        if (date) {
            time = moment(date);
        }
        let currTimeInYear = time.utcOffset(0).format("YYMMDDHHmmss");

        return currTimeInYear;
    },
    currTimeInFullYearForIot(date = null) {
        let time = moment();
        if (date) {
            time = moment(date);
        }
        let currTimeInYear = time.utcOffset(0).format("YYYYMMDDHHmmss");

        return currTimeInYear;
    },
    getUnixTimestampInSeconds() {
        let currTime = moment().unix();

        return currTime;
    },
    convertDMSToLocation(latInput, latDirection, lngInput, lngDirection) {
        let latitude =
            Number(latInput.slice(0, 2)) + Number(latInput.slice(2, 10)) / 60;
        let longitude =
            Number(lngInput.slice(0, 3)) + Number(lngInput.slice(3, 11)) / 60;

        let { lat, lng } = this.setDirectionWiseLocation(
            latDirection,
            lngDirection,
            latitude,
            longitude
        );

        return { lat, lng };
    },

    setDirectionWiseLocation(latDirection, lngDirection, lat, lng) {
        if (latDirection === "S") {
            lat *= -1;
        }
        if (lngDirection === "W") {
            lng *= -1;
        }
        return {
            lat,
            lng,
        };
    },

    subtractTime(value, time = null, unit = "minutes") {
        if (time === null) {
            time = moment().toISOString();
        }

        return moment(time).subtract(value, unit).toISOString();
    },

    convertDateToTime(dates) {
        if (dates) {
            let time = new Date(dates).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            });
            return time;
        }
    },
    displayTime: (date, hour24 = false) => {
        let timeStr = "hh:mm A";
        if (hour24) {
            timeStr = "HH:mm";
        }

        return date ? moment(date).format(timeStr) : "-";
    },
    getNumbersOfDays(startDateTime, endDateTime) {
        var startDate = moment(startDateTime);
        var endDate = moment(endDateTime);
        return endDate.diff(startDate, "days");
    },
    getHoursFromMinute(sec) {
        //Seconds to hour conversion
        let rHours = Math.floor(sec / 3600);
        let rMinutes = Math.floor((sec % 3600) / 60);
        let rSeconds = Math.floor((sec % 3600) % 60);

        if (rHours.toString().length === 1) {
            rHours = `0${rHours}`;
        }
        if (rMinutes.toString().length === 1) {
            rMinutes = `0${rMinutes}`;
        }
        if (rSeconds.toString().length === 1) {
            rSeconds = `0${rSeconds}`;
        }
        return `${rHours}h : ${rMinutes}m : ${rSeconds}s`;
    },
    getIotCommandExpiryTime() {
        let time = this.addTime(
            sails.config.IOT_REQUEST_TIME_OUT_LIMIT,
            null,
            "seconds"
        );

        return time;
    },
    addHourMinDate: (date, hour, min) => {
       let dateString = moment(date).format("YYYY-MM-DD");
       dateString = moment(dateString).add(hour,"hours").add(min,'minutes').toISOString();
       return dateString ? moment(dateString).format("DD-MM-YYYY, hh:mm A") : "-";
    },
    containsWord(string, word) {
        return new RegExp(
            "(?:[^.w]|^|^\\W+)" + word + "(?:[^.w]|\\W(?=\\W+|$)|$)"
        ).test(string);
    },
    hex2Ascii(hex) {
        let ascii = "";
        for (let i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
            ascii += String.fromCharCode(parseInt(hex.substr(i, 2), 16));

        return ascii;
    },

    ascii2Hex(ascii) {
        let hex = "";
        for (let i = 0; i < ascii.length; i++)
            hex += ascii.charCodeAt(i).toString(16);

        return hex;
    },

    hexToDec(hex) {
        let decimalNo = parseInt(hex.toString(), 16);

        return decimalNo;
    },
    getMinutes(value) {
        var d = Number(value);
        var min = Math.floor((d % 3600) / 60);
        return min;
    },

    decToHex(dec) {
        let hex = dec.toString(16);

        return hex;
    },

    hex2bin(hex) {
        let binary = ("00000000" + parseInt(hex, 16).toString(2)).substr(-8);

        return binary;
    },

    getDecimalConvertedObject(data) {
        for (let key in data) {
            data[key] = this.hexToDec(data[key]);
        }

        return data;
    },

    generateMd5Hash(data) {
        const crypto = require("crypto");
        let hash = crypto
            .createHash("md5")
            .update(data)
            .digest("hex")
            .toLowerCase();

        return hash;
    },

    referralCode() {
        let len = 8;
        var text = "";
        var possible = "ABCDEFGHIkLMNOPQRSTUVWXYZ0123456789";
        for (var i = 0; i < len; i++) {
            text += possible.charAt(
                Math.floor(Math.random() * possible.length)
            );
        }

        return text;
    },

    timeFormateToSecond(time) {
        time = time.replace(" h:", ":");
        time = time.replace(" m:", ":");
        time = time.replace(" s", "");
        time = time.replace(" ", "");
        time = time.replace(" 0", "00");
        var hms = time; // your input string
        var a = hms.split(":"); // split it at the colons

        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        var seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

        return seconds;
    },

    getKiloMeter(value) {
        return value ? value / 1000 : 0;
    },

    getHoursFromMinute(sec) {
        //Seconds to hour conversion
        // let d = Number(sec);
        let rhours = Math.floor(sec / 3600);
        let rminutes = Math.floor((sec % 3600) / 60);
        let rseconds = Math.floor((sec % 3600) % 60);

        if (rhours.toString().length === 1) {
            rhours = `0${rhours}`;
        }
        if (rminutes.toString().length === 1) {
            rminutes = `0${rminutes}`;
        }
        if (rseconds.toString().length === 1) {
            rseconds = `0${rseconds}`;
        }
        // Minute to hour conversion
        // let hours = minu / 60;
        // let rhours = Math.floor(hours);
        // let minutes = (hours - rhours) * 60;
        // let rminutes = Math.round(minutes);
        return `${rhours}h : ${rminutes}m : ${rseconds}s`;
    },

     // value in meter
     getDistanceInDefaultUnit(value){
        if(sails.config.DEFAULT_DISTANCE_UNIT === "MILES"){
          return value ? _.round(value /  1609,2) : 0;
        } else {
            return value ? _.round(value / 1000,2) : 0;
        }
    },

    convertSecondToMin(value){
        return value ? value / 60 : 0;
    }
};
