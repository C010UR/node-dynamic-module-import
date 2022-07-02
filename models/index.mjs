import { promises as fs } from "fs";
import { join, resolve } from "path";

const __dirname = resolve();
const regex = /^.*(?=\.)/g;

const modelList = {};

for (const model of await fs.readdir(join(__dirname, "./models"))) {
  // getting model name
  let mn = model.match(regex);
  if (!mn) {
    console.error('[Models]: "' + model + '" is not a valid file name');
    continue;
  }
  if (mn[0] === "index") continue;
  // getting model function
  const { default: fc } = await import("./" + model);
  if (typeof fc !== "function") {
    console.error('[Models]: "' + model + '" is not a function');
    continue;
  }
  modelList[mn[0]] = fc;
}

if (Object.entries(modelList).length === 0) {
  console.error("[Models]: No models provided");
  process.exit(1);
}

export default modelList;
