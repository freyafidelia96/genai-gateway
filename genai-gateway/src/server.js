require("dotenv").config();

const express = require("express");
const { promptQueue } = require("./queue");
const rateLimit = require("express-rate-limit");
const { createBullBoard } = require("@bull-board/api");
const { BullMQAdapter } = require("@bull-board/api/bullMQAdapter");
const { ExpressAdapter } = require("@bull-board/express");

const app = express();

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(promptQueue)],
  serverAdapter,
});

app.use(express.json());
app.use("/admin/queues", serverAdapter.getRouter());

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 requests per IP per minute
  message: { error: "too many requests, slow down" },
});

app.use("/prompt", limiter);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/prompt", async (req, res) => {
  const { model, prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  const job = await promptQueue.add("process-prompt", {
    model: model || "gpt-4",
    prompt,
  });

  res.status(202).json({ jobId: job.id, message: "job queued" });
});

app.get("/status/:jobId", async (req, res) => {
  const job = await promptQueue.getJob(req.params.jobId);

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  const state = await job.getState();
  const result = await job.returnvalue;

  res.json({ jobId: job.id, state, result });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
