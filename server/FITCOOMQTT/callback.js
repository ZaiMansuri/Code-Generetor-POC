module.exports = {
    imports: ` const mqttServer = require('./server');
    module.exports = { `,
    subscribeIot: `subscribeIot() {
        mqttServer.subscribe('/data/mqtt/iot', (err) => {
            if (err) {
                console.log('Cant subscribe iot');
            }
            console.log('Subscribe to iot'); 
            //can handle any business logic here 
        });
    },
    `
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
    }
};