// Day 3: BullMQ experiments

const { Queue } = require("bullmq");

const connection = { host: "localhost", port: 6379 };
const promptQueue = new Queue("prompt-jobs", { connection });

module.exports = { promptQueue };


