import { useState, useEffect } from "react";
import { formatTopic } from "../public/util";

function Article(props) {
  var {
    topic,
    log,
    setLog,
    dict,
    setDict,
    id,
    top,
    left,
    knowledge,
    setKnowledge,
  } = props;
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWikiPage();
  }, [topic]);

  useEffect(() => {
    console.log(log);
  }, [log]);

  async function fetchWikiPage() {
    setLoading(true);
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
          topic
        )}`
      );
      const html = await res.text();
      setContent(html);
    } catch (err) {
      console.error("Failed to load page:", err);
      setContent("<p>Failed to load page.</p>");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const container = document.getElementById("article-" + id);

    const handleClick = (e) => {
      console.log(e);
      e.preventDefault();
      const link = e.target.closest("a");
      console.log(link);

      if (!link) return;

      if (link.className.includes("mw-selflink-fragment")) {
        console.log("Self Link");
        return;
      }
      if (link.className.includes("#cite-note")) {
        console.log("Citation");
        return;
      }

      var href = link.getAttribute("href");
      href = href.split("#")[0];

      if (href && href.startsWith("./")) {
        var newPage = decodeURIComponent(href.replace("./", ""));
        if (!dict[newPage]) {
          setLog([...log, newPage]);
          dict[newPage] = true;
          setKnowledge(knowledge + 1);
        } else {
          setLog([...log, "*" + newPage]);
        }
      }
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, [content]);

  const getRandomInitialPos = () => {};

  return (
    <div
      className="article"
      id={"article-" + id}
      style={{ marginTop: top + "vh", marginLeft: left + "vh" }}
    >
      <h1>{formatTopic(topic)}</h1>
      {loading && <p>Loading...</p>}
      <div
        id="wiki-content"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{ lineHeight: 1.6 }}
      />
    </div>
  );
}

export default Article;
