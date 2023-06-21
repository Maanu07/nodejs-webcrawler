const { JSDOM } = require("jsdom");

async function crawlPage(baseUrl, currentURL, pages) {
  const baseUrlObj = new URL(baseUrl);

  // No need to crawl external link
  const currentURLObject = new URL(currentURL);
  if (baseUrlObj.hostname !== currentURLObject.hostname) {
    return pages;
  }

  // If already crawled a page just increase its count value
  const normalizedCurrentUrl = normalizeURL(currentURL);
  if (pages[normalizedCurrentUrl] > 0) {
    pages[normalizedCurrentUrl]++;
    return pages;
  }

  pages[normalizedCurrentUrl] = 1;

  console.log(`actively crawling ${currentURL}`);

  try {
    const res = await fetch(currentURL);
    // checking for 400 and 500 reponse
    if (res.status > 399) {
      console.log(
        "Error occured while fetching",
        currentURL,
        "with status code",
        res.status
      );
      return pages;
    }
    // checking if response received is html or not
    const contentType = res.headers.get("Content-Type");
    if (!contentType.includes("text/html")) {
      console.log(
        "Non html response received,",
        "instead recevied",
        contentType
      );
      return pages;
    }

    const htmlBody = await res.text();
    const nextUrls = getURLsFromHTML(htmlBody, baseUrl);

    // recursively crawling through all the internal pages
    for (const nextUrl of nextUrls) {
      pages = await crawlPage(baseUrl, nextUrl, pages);
    }

    return pages;
  } catch (error) {
    console.log("Error Occured ", error.message);
  }
}

function normalizeURL(url) {
  const urlObject = new URL(url);
  const urlWithoutProtocol = urlObject.host + urlObject.pathname;
  if (urlWithoutProtocol.length > 0 && urlWithoutProtocol.slice(-1) === "/") {
    return urlWithoutProtocol.slice(0, -1);
  }
  return urlWithoutProtocol;
}

function getURLsFromHTML(html, baseUrl) {
  const dom = new JSDOM(html);
  const allLinkElements = dom.window.document.querySelectorAll("a");
  const urls = [];
  for (item of allLinkElements) {
    if (item.href.slice(0, 1) !== "/" && !item.href.startsWith("http")) {
      continue;
    }
    if (item.href.slice(0, 1) === "/") {
      // relative url
      urls.push(baseUrl + item);
    } else {
      // absolute url
      urls.push(item.href);
    }
  }
  return urls;
}

module.exports = { normalizeURL, getURLsFromHTML, crawlPage };
