const Puppeteer = require("./Puppeteer");
const chalk = require("chalk");
const log = console.log;
const Spinner = require("cli-spinner").Spinner;

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

async function main(sport) {
  try {
    let spinner = new Spinner(`processing your request for ${sport} .... %s`);
    spinner.setSpinnerString("|/-\\");
    spinner.start();
    const env = process.env.NODE_ENV;
    let url = "http://www.espncricinfo.com/scores/";
    if (sport === "cricket") {
      url = "http://www.espncricinfo.com/scores/";
    } else if (sport === "football") {
    }

    let browserInstance = new Puppeteer();
    let page = await browserInstance.openWebPage(url, env);

    if (sport === "cricket") {
      spinner.stop();
      await Scores(page);
    }

    await browserInstance.close();
  } catch (error) {
    console.error(error);
  }
}

async function Commentry() { }

async function Scores(page) {
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
