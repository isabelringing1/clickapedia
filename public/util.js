const formatTopic = (topic) => {
  return topic.split("_").join(" ");
};

async function fetchWikiPage(topic) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
        topic
      )}`
    );
    const html = await res.text();
    return html;
  } catch (err) {
    console.error("Failed to load page:", err);
    return "<p>Failed to load page.</p>";
  }
}

async function fetchWikiSummary(topic) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        topic
      )}`
    );
    var json = await res.text();
    json = JSON.parse(json);
    return json.extract_html;
  } catch (err) {
    console.error("Failed to load page:", err);
    return "<p>Failed to load page.</p>";
  }
}

async function fetchAllLinksForPage(title) {
  const endpoint = "https://en.wikipedia.org/w/api.php";
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "links",
    titles: title,
    pllimit: "max", // maximum number per request
    origin: "*", // needed for CORS
  });

  let links = [];
  let cont = null;

  do {
    const url = `${endpoint}?${params.toString()}${
      cont ? `&plcontinue=${cont}` : ""
    }`;
    const response = await fetch(url);
    const data = await response.json();

    const pages = data.query.pages;
    const page = Object.values(pages)[0];

    if (page.links) {
      links.push(...page.links.map((l) => l.title));
    }

    cont = data.continue?.plcontinue;
  } while (cont);
  return links;
}

async function fetchShortDescription(title) {}

export { formatTopic, fetchWikiPage, fetchAllLinksForPage, fetchWikiSummary };
