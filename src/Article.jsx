import { useState, useEffect, useRef } from "react";
import {
  formatTopic,
  fetchWikiPage,
  fetchAllLinksForPage,
  fetchWikiSummary,
  fetchArticleCategories,
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
  const dragTop = useRef(null);
  const dragLeft = useState(null);

  var isCondensed = currentArticle != id && id > 0;

  useEffect(() => {
    if (!posTop && id > 0) {
      setPosTop(Math.random() * (window.innerHeight / 2));
      setPosLeft((Math.random() * window.innerWidth) / 2);
    }
  }, []);

  useEffect(() => {
    async function getLinks() {
      setLoading(true);
      var content = await fetchWikiPage(topic);
      var summary = await fetchWikiSummary(topic);
      var categories = await fetchArticleCategories(topic);
      setContent(content);
      setSummary(summary);
      //console.log(categories);
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

    if (
      href.startsWith("./Wikipedia:") ||
      href.startsWith("./Help:") ||
      href.startsWith("./File:")
    ) {
      console.log("Meta link: " + href);
      setLog([...log, "#HELP"]);
      return;
    }
    href = href.split("#")[0];

    if (href && href.startsWith("./")) {
      var newPage = decodeURIComponent(href.replace("./", ""));

      var newOpenedLinks = { ...openedLinks };
      if (!openedLinks[newPage]) {
        setLog([...log, newPage]);
        newOpenedLinks[newPage] = true;
        setKnowledge(knowledge + 1);
        setCurrentArticle(log.length);
      } else {
        setLog([...log, "*" + newPage]);
      }
      setOpenedLinks(newOpenedLinks);
    }
  };

  const startDrag = (e) => {
    if (id == 0) {
      return;
    }

    dragTop.current = e.clientY;
    dragLeft.current = e.clientX;
    document.onmouseup = closeDragElement;
    document.onmousemove = articleDragged;
  };

  const closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  };

  const articleDragged = (e) => {
    if (id == 0) {
      return;
    }
    e.preventDefault();
    // calculate the new cursor position:
    var leftDelta = dragLeft.current - e.clientX;
    var topDelta = dragTop.current - e.clientY;

    // set the element's new position:
    setPosTop(posTop - topDelta);
    setPosLeft(posLeft - leftDelta);
  };

  var cn = "article " + topic;
  if (currentArticle == id && id != 0) {
    cn += " current";
  }
  cn += isCondensed ? " condensed" : " full";

  var articleStyle = {
    top: posTop + "px",
    left: posLeft + "px",
    zIndex: isCondensed ? id : 1000000,
  };

  return (
    ready && (
      <div
        className={cn}
        id={"article-" + id}
        style={id == 0 ? {} : articleStyle}
        onClick={onArticleClicked}
        onMouseDown={startDrag}
      >
        <div className="article-header" id={"article-header-" + id}>
          {isCondensed && <div className={"expand-text"}>Click to expand</div>}
          <h1>{formatTopic(topic)}</h1>
        </div>

        {loading && <p>Loading...</p>}
        {!isCondensed && (
          <div
            dangerouslySetInnerHTML={{ __html: content }}
            style={{ lineHeight: 1.6 }}
          />
        )}
        {isCondensed && (
          <div
            className="condensed"
            dangerouslySetInnerHTML={{ __html: summary }}
          ></div>
        )}
      </div>
    )
  );
}

export default Article;
