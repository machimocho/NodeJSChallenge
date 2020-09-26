var socket = require("socket.io-client")(`http://localhost:9999`);
const getCSV = require("get-csv");
// import {publishToQueue} from './amqp'
const { publishToQueue } = require("./amqp");
const QUEUE = "BotQueue";

socket.on("connect", function () {
  console.log("connect");
  socket.emit("BotPong", {
    data: `Hello, I am the chat bot, type /stock=stock_code for information`,
  });
});
socket.on("BotPing", function (data) {
  console.log("BotPing");
  let stock = data.message.split("=")[1].trim();
  getCSV(`https://stooq.com/q/l/?s=${stock}&f=sd2t2ohlcv&h&e=csv`)
    .then((rows) => {
      if (rows[0].Open == "N/D")
        // console.log('Stock code not found. Try another one.')
        socket.emit("Queue Ready", {
          socket: data.userSocket,
          message: "Stock code not found. Try another one.",
          found: false,
        });
      else
        publishToQueue(
          QUEUE,
          `${rows[0].Symbol} quote is ${rows[0].Open} per share.`,
          function () {
            socket.emit("Queue Ready", {
              socket: data.userSocket,
              found: true,
            });
          }
        );
    })
    .catch((e) => {
      console.log(e);
    });
});
socket.on("disconnect", function () {
  console.log("disconnect");
});
