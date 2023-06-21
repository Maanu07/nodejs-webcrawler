// GOAL : Our program will take a website as an input and crawl it .

const { crawlPage } = require("./crawl");
const { printReport } = require("./report");

async function main() {
  if (process.argv.length < 3) {
    console.log("no website provided");
    process.exit(1);
  }

  if (process.argv.length > 3) {
    console.log("too many command line args");
    return;
  }

  const baseURL = process.argv[2];
  // console.log("started crawling " + baseURL);
  const pages = await crawlPage(baseURL, baseURL, {});
  printReport(pages);
}

main();
