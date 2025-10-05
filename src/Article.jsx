import { useState, useEffect } from "react";
import {
  formatTopic,
  fetchWikiPage,
  fetchAllLinksForPage,
  fetchWikiSummary,
} from "../public/util";

function Article(props) {
  var {
    topic,
    log,
    setLog,
    openedLinks,
    setOpenedLinks,
    id,
    knowledge,
    setKnowledge,
    linksToCheck,
    currentArticle,
    setCurrentArticle,
    resurfaceArticle,
  } = props;
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const [posTop, setPosTop] = useState(0);
  const [posLeft, setPosLeft] = useState(0);
  const [dragTop, setDragTop] = useState(null);
  const [dragLeft, setDragLeft] = useState(null);

  var isCondensed = currentArticle != id && id > 0;

  useEffect(() => {
    if (!posTop && id > 0) {
      setPosTop(Math.random() * (window.innerHeight / 2));
      setPosLeft(Math.random() * window.innerWidth - window.innerWidth / 2);
    }
  }, []);

  useEffect(() => {
    async function getLinks() {
      setLoading(true);
      var content = await fetchWikiPage(topic);
      var summary = await fetchWikiSummary(topic);
      setContent(content);
      setSummary(summary);
      setLoading(false);
      setReady(true);
      var links = await fetchAllLinksForPage(topic);
      linksToCheck.current.push(...links);
    }
    getLinks();
  }, [topic]);

  const onArticleClicked = (e) => {
    e.preventDefault();
    if (isCondensed) {
      console.log("resurfacing " + id);
      resurfaceArticle(id);
    }
    const link = e.target.closest("a");
    //console.log(link);

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

    if (href.startsWith("./Wikipedia:") || href.startsWith("./Help:")) {
      console.log("Meta");
      setLog([...log, "#HELP"]);
      return;
    }
    href = href.split("#")[0];

    if (href && href.startsWith("./")) {
      var newPage = decodeURIComponent(href.replace("./", ""));

      if (!openedLinks[newPage]) {
        setLog([...log, newPage]);
        openedLinks[newPage] = true;
        setKnowledge(knowledge + 1);
        setCurrentArticle(log.length);
      } else {
        setLog([...log, "*" + newPage]);
      }
    }
  };

  const onMouseDown = (e) => {
    if (id == 0) {
      return;
    }
    setDragTop(e.clientY);
    setDragLeft(e.clientX);
    console.log("drag start");
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  };

  const closeDragElement = (e) => {
    document.onmouseup = null;
    document.onmousemove = null;
  };

  const elementDrag = (e) => {
    if (id == 0) {
      return;
    }
    e.preventDefault();
    // calculate the new cursor position:
    var leftDelta = dragLeft ? dragLeft - e.clientX : 0;
    var topDelta = dragTop ? dragTop - e.clientY : 0;

    // set the element's new position:
    setPosTop(posTop - topDelta);
    setPosLeft(posLeft - leftDelta);
    setDragTop(e.clientY);
    setDragLeft(e.clientX);
  };

  var cn = "article " + topic;
  if (currentArticle == id && id != 0) {
    cn += " current";
  }
  cn += isCondensed ? " condensed" : " full";

  return (
    ready && (
      <div
        className={cn}
        id={"article-" + id}
        style={{
          marginTop: posTop + "px",
          marginLeft: posLeft + "px",
          zIndex: isCondensed || id == 0 ? id : 1000000,
        }}
        onClick={onArticleClicked}
      >
        <div
          className="article-header"
          id={"article-header-" + id}
          onMouseDown={onMouseDown}
        >
          <h1>{formatTopic(topic)}</h1>
        </div>

        {loading && <p>Loading...</p>}
        {!isCondensed && (
          <div
            id="wiki-content"
            dangerouslySetInnerHTML={{ __html: content }}
            style={{ lineHeight: 1.6 }}
          />
        )}
        {isCondensed && (
          <div dangerouslySetInnerHTML={{ __html: summary }}></div>
        )}
      </div>
    )
  );
}

export default Article;
