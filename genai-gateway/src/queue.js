// BullMQ queue definition

const { Queue } = require("bullmq");

const connection = { host: "127.0.0.1", port: 6379 };
const promptQueue = new Queue("prompt-jobs", { connection });

module.exports = { promptQueue, connection };
