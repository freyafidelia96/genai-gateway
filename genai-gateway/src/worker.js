// BullMQ worker that processes jobs

const { Worker } = require("bullmq");
const { connection } = require("./queue");

async function callAI(model, prompt) {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return `[mock response] model: ${model}, prompt: "${prompt}"`;
}

const worker = new Worker('prompt-jobs', async (job) => {
  const { model, prompt } = job.data;
  console.log(`Processing job ${job.id} - prompt: "${prompt}"`);

  const result = await callAI(model, prompt);
  return result;
}, { connection, concurrency: 3 });

worker.on('completed', (job, result) => {
  console.log(`job ${job.id} completed:`, result);
});

worker.on('failed', (job, err) => {
  console.error(`job ${job.id} failed:`, err.message);
});

console.log('worker is running...');
