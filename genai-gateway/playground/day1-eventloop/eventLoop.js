console.log("1 - start");

setTimeout(() => console.log("2 - timer"), 0);

setImmediate(() => console.log("3 - immediate"));

Promise.resolve().then(() => console.log("4 - promise"));

console.log("5 - end");
