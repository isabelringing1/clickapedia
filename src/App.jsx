import { useState, useEffect, useRef } from "react";
import questsJson from "./quests.json";

import Article from "./Article";
import Menu from "./Menu";
import Logo from "../public/Logo.png";
import Debug from "./Debug";

import "./App.css";

function App() {
  const [log, setLog] = useState(["Incremental_game"]);
  const [openedLinks, setOpenedLinks] = useState({ Incremental_game: true });
  const [autos, setAutos] = useState(0);
  const [quests, setQuests] = useState({});
  const [knowledge, setKnowledge] = useState(1);

  const [currentArticle, setCurrentArticle] = useState(0);

  const linksToCheck = useRef([]);
  const ms = useRef(0);
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

  const shouldFireAuto = () => {
    if (autos == 0) {
      return false;
    }
    var divider = Math.ceil(5000 / autos / 10) * 10; // round to nearest 10
    return ms.current % divider == 0;
  };

  useInterval(() => {
    ms.current += 10;
    if (!shouldFireAuto()) {
      return;
    }
    var newTopics = [];
    console.log(linksToCheck.current);

    if (linksToCheck.current.length > 0) {
      var newTopic = linksToCheck.current[0];
      console.log("new topic: " + newTopic);
      if (!openedLinks[newTopic]) {
        newTopics.push(newTopic);
      }
      linksToCheck.current = linksToCheck.current.slice(1);
    }

    setLog([...log, ...newTopics]);
    setKnowledge(knowledge + newTopics.length);
    var newOpenedLinks = { ...openedLinks };
    for (var i in newTopics) {
      newOpenedLinks[newTopics[i]] = true;
    }
    console.log(
      "opened links: " +
        Object.keys(openedLinks).length +
        ", " +
        Object.keys(newOpenedLinks).length
    );
    setOpenedLinks(newOpenedLinks);
  }, 10);

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
  console.log("rerender app");

  return (
    <div id="content">
      <Debug setAutos={setAutos} setKnowledge={setKnowledge} />
      <div className="game-header">
        <img src={Logo} className="game-logo" />
      </div>
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
