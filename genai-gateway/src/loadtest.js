async function loadTest() {
  console.log("sending 20 jobs...");

  const requests = Array.from({ length: 20 }, (_, i) =>
    fetch("http://localhost:3000/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4",
        prompt: `question number ${i + 1}`,
      }),
    }).then((r) => r.json()),
  );

  const results = await Promise.all(requests);
  results.forEach((r) => console.log("queued:", r.jobId));
}

loadTest();
