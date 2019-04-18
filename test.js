
const app = require("./app.js");

let sport = process.env.sport || "cricket";
let node_env = process.env.NODE_ENV || "development";
app.main(sport, node_env);