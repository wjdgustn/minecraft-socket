const WebSocket = require('ws');
const url = require('url');
const querystring = require('querystring');

const setting = require('./setting.json');

module.exports = (server, app) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const parsedUrl = url.parse(req.url);
        const parsedQuery = querystring.parse(parsedUrl.query,'&','=');

        if(parsedQuery.secretkey != setting.SECRET_KEY) {
            ws.terminate();
            console.log(`${ip}가 잘못된 secretkey로 접근을 시도했습니다.`);
            return;
        }
        else app.set('ws', ws);
        console.log(`웹소켓에 새로운 클라이언트(${ip})가 접속하였습니다.`);

        ws.on('close', () => {
            app.set('ws', null);
            console.log(`웹소켓에서 클라이언트(${ip})의 연결이 끊어졌습니다.`);
        });
    });
}