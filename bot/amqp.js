const amqp = require("amqplib/callback_api");
let ch = null;
amqp.connect(
  process.env.AMPQ_HOST,
  function (err, conn) {
    conn.createChannel(function (err, channel) {
      ch = channel;
    });
  }
);
const publishToQueue = async (queueName, data, cb) => {
  ch.sendToQueue(queueName, new Buffer(data));
  cb();
};
process.on("exit", (code) => {
  ch.close();
  console.log(`Closing rabbitmq channel`);
});

module.exports = {
  publishToQueue,
};
