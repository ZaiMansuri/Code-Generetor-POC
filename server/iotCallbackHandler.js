const UtilService = require('./util');

module.exports = {
    handler: `
module.exports = {
    unlockCallbackReceived(data) {
        doWhatAfterUnlock(data);
    },

    lockCallbackReceived(data) {
        doWhatAfterLock(data);
    },

    calculateAndUpdateLocation(locationData, data) {
        const { latInput, latDirection, lngInput, longDirection } = locationData;
        const { lat, lng } = this.convertDMSToLocation(latInput, latDirection, lngInput, longDirection);
        data.lat = lat;
        data.lng = lng;
        return data
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

}`
};
module = {

    unlockCallbackReceived(data) {
        doWhatAfterUnlock(data);
    },

    async lockCallbackReceived(data) {
        doWhatAfterLock(data);
    },

    calculateAndUpdateLocation(locationData, data) {
        const { latInput, latDirection, lngInput, longDirection } = locationData;
        const { lat, lng } = UtilService.convertDMSToLocation(latInput, latDirection, lngInput, longDirection);
        data.lat = lat;
        data.lng = lng;
        return data
    }
};