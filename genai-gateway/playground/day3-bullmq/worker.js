const { Worker } = require("bullmq");

const connection = { host: "localhost", port: 6380 };

const worker = new Worker(
  "prompt-jobs",
  async (job) => {
    console.log(`Picked up job ${job.id}:`, job.data);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { result: `Processed prompt: ${job.data.prompt}` };
  },
  { connection },
);

worker.on("completed", (job, result) => {
  console.log(`Job ${job.id} finished:`, result);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});
