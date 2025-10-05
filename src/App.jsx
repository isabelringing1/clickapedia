import { useState, useEffect, useRef } from "react";
import { fetchWikiPage } from "../public/util";
import questsJson from "./quests.json";

import Article from "./Article";
import Menu from "./Menu";

import "./App.css";

function App() {
  const [log, setLog] = useState(["Incremental_game"]);
  const [openedLinks, setOpenedLinks] = useState({ Incremental_game: true });
  const [autos, setAutos] = useState(2);
  const [quests, setQuests] = useState({});
  const [knowledge, setKnowledge] = useState(1);

  const [currentArticle, setCurrentArticle] = useState(0);

  const linksToCheck = useRef([]);
  const questList = questsJson["quests"];

  useEffect(() => {
    for (var i = 0; i < questList.length; i++) {
      var quest = questList[i];
      if (quest.trigger <= knowledge && !quests[quest.id]) {
        var newQuests = { ...quests };
        newQuests[quest.id] = { complete: false, quest: quest };
        setQuests(newQuests);
        break;
      }
    }
  }, [knowledge]);

  useInterval(() => {
    if (autos == 0) {
      return;
    }
    var newTopics = [];
    for (var i = 0; i < autos; i++) {
      if (linksToCheck.current.length > 0) {
        var newTopic = linksToCheck.current[0];
        if (!openedLinks[newTopic]) {
          newTopics.push(newTopic);
        }
        linksToCheck.current = linksToCheck.current.slice(1);
      }
    }
    setLog([...log, ...newTopics]);
    setKnowledge(knowledge + newTopics.length);
    var newOpenedLinks = { ...openedLinks };
    for (var topic in newTopics) {
      newOpenedLinks[topic] = true;
    }
    setOpenedLinks(newOpenedLinks);
  }, 5000);

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest function.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
  const resurfaceArticle = (id) => {
    setCurrentArticle(id);
  };

  return (
    <div id="content">
      {log.map((a, i) => {
        if (a[0] == "*" || a[0] == "#") {
          return null;
        }
        return (
          <Article
            isCurrent={i == log.length - 1}
            topic={a}
            key={"article-" + i}
            log={log}
            setLog={setLog}
            openedLinks={openedLinks}
            setOpenedLinks={setOpenedLinks}
            id={i}
            knowledge={knowledge}
            setKnowledge={setKnowledge}
            linksToCheck={linksToCheck}
            currentArticle={currentArticle}
            setCurrentArticle={setCurrentArticle}
            resurfaceArticle={resurfaceArticle}
          />
        );
      })}
      <Menu
        log={log}
        openedLinks={openedLinks}
        knowledge={knowledge}
        setKnowledge={setKnowledge}
        autos={autos}
        setAutos={setAutos}
        quests={quests}
        resurfaceArticle={resurfaceArticle}
      />
    </div>
  );
}

export default App;
