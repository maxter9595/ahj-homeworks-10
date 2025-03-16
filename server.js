require("dotenv").config();
const http = require("http");
const events = require("events");

const eventEmitter = new events.EventEmitter();
const port = process.env.PORT || 3000;

let matchEvents = [];
let eventId = 0;
const maxEvents = 50;

const startEvent = {
  id: ++eventId,
  type: "start",
  text: "Игра началась!",
  timestamp: new Date().toLocaleString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }),
};

matchEvents.push(startEvent);
eventEmitter.emit("newEvent", startEvent);

function generateEvent() {
  if (matchEvents.length >= maxEvents + 1) {
    const endEvent = {
      id: ++eventId,
      type: "end",
      text: "Матч окончен!",
      timestamp: new Date().toLocaleString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };
    matchEvents.push(endEvent);
    eventEmitter.emit("newEvent", endEvent);
    clearInterval(interval);
    return;
  }

  const random = Math.random();
  let event;

  if (random < 0.5) {
    event = {
      type: "action",
      text: "Идёт перемещение мяча по полю,<br> игроки и той, и другой команды активно<br> пытаются атаковать",
    };
  } else if (random < 0.9) {
    event = {
      type: "freekick",
      text: "Нарушение правил, будет штрафной<br> удар",
    };
  } else {
    event = { type: "goal", text: "Отличный удар! И Г-О-Л!" };
  }

  event.id = ++eventId;
  event.timestamp = new Date().toLocaleString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  matchEvents.push(event);
  eventEmitter.emit("newEvent", event);
}

const interval = setInterval(generateEvent, 5000);

const server = http.createServer((req, res) => {
  if (req.url === "/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    matchEvents.forEach((event) => {
      res.write(`id: ${event.id}\n`);
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    });

    const listener = (event) => {
      res.write(`id: ${event.id}\n`);
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    eventEmitter.on("newEvent", listener);

    req.on("close", () => {
      eventEmitter.off("newEvent", listener);
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
