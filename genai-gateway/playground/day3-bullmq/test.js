const { promptQueue } = require("./queue");

async function main() {
  for (let i = 1; i <= 5; i++) {
    const job = await promptQueue.add("process-prompt", {
      model: "gpt-4",
      prompt: `Question number ${i}`,
    });
    console.log(`Added job ${job.id} to the queue`);
  }

  process.exit(0);
}

main();
