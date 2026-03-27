# GenAI Inference Gateway

A Node.js API that queues AI prompt requests using BullMQ and Redis, so the server never crashes under load. Built to demonstrate production-grade async architecture patterns.

---

## The Problem It Solves

Without a queue, every incoming prompt request directly calls the AI API. Under heavy load — say 1000 users hitting the endpoint simultaneously — the server opens 1000 concurrent connections and crashes.

This gateway solves that with a simple pattern: **accept everything immediately, process in controlled batches.**

The server responds in milliseconds with a job ID. The worker processes at most 3 jobs at a time. Clients poll for results when ready. No matter how many requests come in, the system stays stable.

---

## Architecture
```
Client → Express (server.js) → Redis → Worker (worker.js)
           ↓                               ↓
      202 + jobId              processes job, saves result
           ↓
Client polls GET /status/:jobId → gets result when ready
```

- **server.js** — accepts requests, drops jobs into the queue, returns immediately
- **queue.js** — shared BullMQ queue config and Redis connection
- **worker.js** — picks up jobs, runs the AI call, saves results back to Redis
- **Redis** — holds jobs while they wait, bridges the server and worker

The server and worker are completely independent. The server's only job is to accept and queue — fast. The worker's only job is to process — controlled.

---

## Project Structure
```
genai-gateway/
├── playground/              # Learning experiments (Days 1–3)
│   ├── day1-eventloop/
│   ├── day2-express/
│   └── day3-bullmq/
├── src/                     # The real project
│   ├── server.js            # Express API + rate limiting + Bull Board
│   ├── queue.js             # BullMQ queue definition + Redis connection
│   ├── worker.js            # Job processor with concurrency control
│   └── loadtest.js          # Sends 20 jobs simultaneously
├── .env.example
└── package.json
```

---

## Getting Started

**Prerequisites**
- Node.js 18+
- Redis running on port 6379

**Install dependencies**
```bash
cd src
npm install
```

**Set up environment**
```bash
cp .env.example .env
```

**Start Redis**
```bash
redis-server
```

**Start the worker** (Terminal 2)
```bash
node worker.js
```

**Start the server** (Terminal 3)
```bash
node server.js
```

**Open the job dashboard**
```
http://localhost:3000/admin/queues
```

---

## API

### Submit a prompt
```
POST /prompt
Content-Type: application/json

{ "model": "gpt-4", "prompt": "explain black holes" }
```
Returns `202 Accepted` with a `jobId` immediately.

### Check job status
```
GET /status/:jobId
```
Returns `state` (waiting / active / completed / failed) and `result` when done.

### Health check
```
GET /health
```

---

## Key Features

- **Non-blocking** — server responds in milliseconds, never waits for AI
- **Concurrency control** — worker processes max 3 jobs simultaneously
- **Rate limiting** — max 10 requests per IP per minute
- **Job persistence** — Redis stores jobs so nothing is lost if the worker restarts
- **Live dashboard** — Bull Board UI shows all job states in real time

---

## .env.example
```
# Add your AI API key here when swapping out the mock
AI_API_KEY=your-key-here
```
