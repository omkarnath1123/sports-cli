#!/usr/bin/env node
"use strict";

const packageJSON = require("./package.json");
const semver = require("semver");
const yargs = require("yargs");
const chalk = require("chalk");
const log = console.log;

yargs
  .options({
    s: {
      alias: "sport",
      describe: "choose a sport",
      choices: ["cricket", "football"]
    },
    node_env: {
      describe: "set node environment",
      choices: ["development", "production"]
    }
  })
  .alias("h", "help")
  .help("help")
  .usage("Usage: $0 [options]")
  .showHelpOnFail(false, "Specify --help for available options");

yargs
  .alias("v", "version")
  .version(packageJSON.version)
  .describe("v", "show version information");

const argv = yargs.argv;
const sport = argv.sport;
const node_env = argv.node_env;

if (!semver.satisfies(process.versions.node, packageJSON.engines.node)) {
  console.error("CANNOT RUN WITH NODE " + process.versions.node);
  console.error("Socker Cli requires Node " + packageJSON.engines.node + ".");
  process.exit(1);
}
if (!sport) {
  console.error("You must provide an sport-type with the --sport flag");
  process.exit(1);
}

if (node_env) {
  log(chalk.blue("only add flag node environment for development purposes !!"));
  log(chalk.red("[NODE ENV] : ") + chalk.yellow("development"));
  process.env.NODE_ENV = node_env;
}

const app = require("./app.js");
app.main(sport, node_env);
