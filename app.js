const Puppeteer = require("./Puppeteer");
const chalk = require("chalk");
const log = console.log;
const Spinner = require("cli-spinner").Spinner;

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

async function main(sport) {
  let browserInstance;
  try {
    await new Promise(function(resolve, reject) {
      require("dns").resolve("www.google.com", function(err) {
        if (err) {
          reject("Internet Connection appears to be offline");
        } else {
          resolve();
        }
      });
    });

    let spinner = new Spinner(`processing your request for ${sport} .... %s`);
    spinner.setSpinnerString("|/-\\");
    spinner.start();
    const env = process.env.NODE_ENV;
    let url = "http://www.espncricinfo.com/scores/";
    if (sport === "cricket") {
      url = "http://www.espn.in/cricket/scores";
    } else if (sport === "football") {
      url = "http://www.espn.in/football/scoreboard";
    }
    browserInstance = new Puppeteer();
    let page = await browserInstance.openWebPage(url, env);

    spinner.stop();
    if (sport === "cricket") {
      await cricketScores(page);
    } else if (sport === "football") {
      await footballScores(page);
    }

    await browserInstance.close();
    browserInstance = null;
  } catch (error) {
    error.toString().match(/Internet Connection/i) ? log(chalk.red("INTERNET OFFLINE : " + error)) : log(chalk.red("SCRIPT CRASHED : " + error));
    if (browserInstance) {
      await browserInstance.close();
    }
  }
}

async function Commentry() {}

async function footballScores(page) {
  // events
  let events = await page.evaluate(() => {
    let eventsObject = document.getElementById("events").children;
    let eventsArray = [];
    for (key in eventsObject) {
      eventsArray.push(eventsObject[key].innerText);
    }
    return eventsArray;
  });
  for (let i = 0; i < events.length; i++) {
    let innerText = events[i];
    if (typeof innerText !== "string") {
      continue;
    }

    if (innerText.match(/summary/i)) {
      // event
      innerText = innerText.trim().split("\n");
      innerText.pop();
      innerText.pop();
      // innerText = innerText.toString().replace('/,/g', ' ');
      log(chalk.magenta(innerText[0]) + "\t" + chalk.cyan(innerText[1]));
      log(chalk.magenta(innerText[4]) + "\t" + chalk.cyan(innerText[5]));
      log("score : " + chalk.yellow(innerText[2]));
      log("game time : " + chalk.gray(innerText[3]));
    } else {
      // event heading
      console.log("\n");
      innerText = innerText.trim().toUpperCase();
      log(chalk.green(innerText));
    }
  }
}

async function cricketScores(page) {
  // series
  let events = await page.$$(".scoreCollection.cricket");
  for (let i = 0; i < events.length; i++) {
    // heading
    let heading = await events[i].$eval(".scoreCollection__header", node => node.innerText);
    heading = heading.trim();
    console.log("\n");
    log(chalk.green(heading));

    // matches
    let matches = await events[i].$$(".cscore");
    for (let j = 0; j < matches.length; j++) {
      // score overview
      let match_status = await matches[j].$eval(".cscore_date-time", node => node.innerText);
      match_status = match_status.trim();
      let match_type = await matches[j].$eval(".cscore_info-overview", node => node.innerText);
      match_type = match_type.trim();

      log("status : " + chalk.yellow(match_status));
      log("venue : " + chalk.cyan(match_type));

      // competitors
      let first_team = await matches[j].$eval(".cscore_competitors > li:nth-child(1)", node => node.innerText);
      let second_team = await matches[j].$eval(".cscore_competitors > li:nth-child(2)", node => node.innerText);
      if (first_team && first_team.includes("\n")) {
        first_team = first_team.split("\n");
        first_team = first_team.map(element => {
          return element.trim();
        });
        first_team = first_team.filter(element => {
          return element !== "" || element !== null;
        });
        log(chalk.magenta(first_team[0] + "\t" + first_team[first_team.length - 1]));
      } else {
        log(chalk.magenta(first_team));
      }

      if (second_team && second_team.includes("\n")) {
        second_team = second_team.split("\n");
        second_team = second_team.map(element => {
          return element.trim();
        });
        second_team = second_team.filter(element => {
          return element !== "" || element !== null;
        });
        log(chalk.magenta(second_team[0] + "\t" + second_team[second_team.length - 1]));
      } else {
        log(chalk.magenta(second_team));
      }

      // commentry
      let commentry = await matches[j].$eval(".cscore_commentary", node => node.innerText);
      commentry = commentry.trim();
      if (commentry) {
        log(chalk.gray(commentry));
      }
    }
  }
}

module.exports = {
  main: main
};
