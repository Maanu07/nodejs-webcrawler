function printReport(pages) {
  console.log("---------------------");
  console.log("REPORT START");
  console.log("---------------------");

  const sortedPages = sortPages(pages);
  for (let page of sortedPages) {
    const url = page[0];
    const count = page[1];
    console.log(console.log(`Found ${count} internal links to ${url}`));
  }

  console.log("---------------------");
  console.log("REPORT ENDS");
  console.log("---------------------");
}

function sortPages(pages) {
  const sortedPages = Object.entries(pages).sort((a, b) => {
    hitA = a[1];
    hitB = b[1];
    return hitB - hitA;
  });

  return sortedPages;
}

module.exports = { printReport, sortPages };
