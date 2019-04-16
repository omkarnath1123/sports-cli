const puppeteer = require("puppeteer");
let env = process.env.NODE_ENV;

module.exports = class Puppeteer {
  constructor(options) {
    this.options = {
      params: {
        // slowMo: 100,
        ignoreHTTPSErrors: true,
        headless: env === "production",
        // executablePath: '/Users/omkarnath/Applications/Google Chrome.app',
        args: [
          "--ash-host-window-bounds=1920x1080",
          "--window-size=1920,1048",
          "--window-position=0,0",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage"
        ],
        defaultViewport: {
          width: 1366,
          height: 768
        },
        env
      },
      ...options
    };
  }

  async openWebPage(url, node_env) {
    this.options.params.headless = node_env === "production";
    if (!this.browserInstance) {
      this.browserInstance = await puppeteer.launch(this.options.params);
    }
    this.webPage = await this.browserInstance.newPage();
    let page = await this.webPage.goto(url, {
      waitUntil: "load",
      timeout: 60000
    });
    if (page.status() !== 200) {
      throw new Error("could not open web page -> " + url);
    }
    return this.webPage;
  }

  async close() {
    if (this.webPage) await this.webPage.close();
    delete this.webPage;
    if (this.browserInstance) await this.browserInstance.close();
    delete this.browserInstance;
  }
};
