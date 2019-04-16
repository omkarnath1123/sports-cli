const Puppeteer = require("./Puppeteer");

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

async function main(sport) {
  const env = process.env.NODE_ENV;
  let url = "http://www.espncricinfo.com/scores/";
  if (sport === "cricket") {
    url = "http://www.espncricinfo.com/scores/";
  } else if (sport === "football") {
  }

  let browserInstance = new Puppeteer();
  this.page = await browserInstance.openWebPage(url, env);

  await browserInstance.close();
}

module.exports = {
  main: main
};
