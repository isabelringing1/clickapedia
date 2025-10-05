const formatTopic = (topic) => {
  return topic.split("_").join(" ");
};

async function fetchWikiPage(topic, onlyInner = true) {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
        topic
      )}`
    );
    const html = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    return doc.body.innerHTML;

    //console.log(html);
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

async function fetchArticleCategories(title) {
  const endpoint = "https://en.wikipedia.org/w/api.php";
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    titles: title,
    prop: "categories",
    cllimit: "max", // get as many categories as allowed
    origin: "*", // 👈 this enables CORS for browsers
  });

  const url = `${endpoint}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const data = await response.json();

    // Extract categories
    const pages = data.query.pages;
    const page = Object.values(pages)[0]; // first (and usually only) page
    const categories =
      page.categories?.map((c) => c.title.replace("Category:", "")) || [];

    //console.log(categories);
    return categories;
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
}

export {
  formatTopic,
  fetchWikiPage,
  fetchAllLinksForPage,
  fetchWikiSummary,
  fetchArticleCategories,
};
