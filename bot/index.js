var socket = require("socket.io-client")(`http://localhost:9999`);
const getCSV = require('get-csv');
// import {publishToQueue} from './amqp'
const {publishToQueue} =  require('./amqp');
const QUEUE = 'BotQueue';

socket.on("connect", function () {
    console.log('connect')
    socket.emit('BotPong', { data: `Hello, I am the chat bot, type /stock=stock_code for information`});
});
socket.on("BotPing", function (data) {
    let stock = data.split('=')[1].trim()
    getCSV(`https://stooq.com/q/l/?s=${stock}&f=sd2t2ohlcv&h&e=csv`)
        .then(rows => {
             console.log(rows)
            if (rows[0].Open == 'N/D')
                console.log('Stock code not found. Try another one.')
            else
                // console.log(`${rows[0].Symbol} quote is ${rows[0].Open} per share.`)
                publishToQueue(QUEUE, `${rows[0].Symbol} quote is ${rows[0].Open} per share.`);
        }).catch(e => {
            console.log(e)
        });
});
socket.on("disconnect", function () {
    console.log('disconnect')
});
