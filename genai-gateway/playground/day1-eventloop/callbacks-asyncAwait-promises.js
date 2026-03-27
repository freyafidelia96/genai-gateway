let fs = require("fs");

//callbacks
//You pass a function (the callback) directly into readFile. Node runs your function when the file is ready. Error is always the first argument — this is called "error-first callback" convention.

fs.readFile("file.txt", "utf-8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  console.log("File content:", data);
});

//promises
//readFile now returns a Promise object — a box that will eventually contain the file data. .then() runs when it succeeds, .catch() runs on error. Chainable and flat.

fs = require("fs/promises");
fs.readFile("file.txt", "utf-8")
  .then((data) => {
    console.log("File content:", data);
  })
  .catch((err) => {
    console.error("Error reading file:", err);
  });

//async/await
//await pauses execution inside the function until the Promise resolves — but does NOT block the event loop. Other code keeps running. This is still a Promise under the hood, just written to look synchronous.

async function readFileAsync() {
  try {
    const data = await fs.readFile("file.txt", "utf-8");
    console.log("File content:", data);
  } catch (err) {
    console.error("Error reading file:", err);
  }
}

readFileAsync();

// 5 functions

async function readFile() {
  const data = await fs.readFile("file.txt", "utf-8");
  console.log(data);
}

async function writeFile() {
  await fs.writeFile("file.txt", "I am in my daring season right now");
  console.log("File written");
}

const { setTimeout: wait } = require("timers/promises");

async function delay() {
  console.log("waiting...");
  await wait(2000);
  console.log("2 seconds later");
}

async function getUser() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const user = await res.join();
  console.log(user.name);
}

async function runAll() {
  await writeFile();
  const data = await readFile();
  await delay();
  await getUser();
}

runAll();
