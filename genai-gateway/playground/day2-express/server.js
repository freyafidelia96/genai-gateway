// Day 2: Express experiments
const express = require("express");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/prompt", (req, res) => {
  const { model, prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  res.json({
    message: "Job received",
    model: model || "default",
    prompt,
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
