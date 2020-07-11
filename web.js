const express = require('express');
const url = require('url');
const querystring = require('querystring');

const setting = require('./setting.json');

const app = express.Router();

app.post('/cmd', (req, res, next) => {
    const ws = req.app.get('ws');
    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query,'&','=');

    if(parsedQuery.secretkey != setting.SECRET_KEY) {
        res.json({ "code" : "error" , "message" : "secretkey 옵션이 누락되었거나 알맞지 않습니다." });
        return;
    }
    if(parsedQuery.command == null) {
        res.json({ "code" : "error" , "message" : "command 옵션이 누락되었습니다." });
        return;
    }
    if(ws == null) {
        res.json({ "code" : "error" , "message" : "연결된 웹소켓 클라이언트가 없습니다." });
        return;
    }

    ws.send(parsedQuery.command);
    res.json({ "code" : "success" , "message" : "요청을 정상적으로 처리했습니다." });
});

module.exports = app;