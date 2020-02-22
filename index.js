const server = require('./server');
const environment = require('./config/environment');


server.listen(environment.listenPort, () => {
    console.log(`***Server is listening on port ${environment.listenPort}***`);
})