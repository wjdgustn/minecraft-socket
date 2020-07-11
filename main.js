const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');

const web = require('./web');
const webSocket = require('./socket');
const setting = require('./setting.json');

const app = express();

let protocol;
let options;
if(setting.USE_SSL) {
    protocol = "https://";
    options = {
        cert: fs.readFileSync(setting.SSL_CERT),
        key: fs.readFileSync(setting.SSL_KEY)
    }
}
else {
    protocol = "http://";
}

app.use(web);

let server;
if(setting.USE_SSL) {
    server = https.createServer(options, app).listen(setting.PORT, () => {
        console.log('보안 서버가 구동중입니다!');
    });
}
else {
    server = http.createServer(app).listen(setting.PORT, () => {
        console.log("서버가 구동중입니다!");
    });
}

webSocket(server, app);