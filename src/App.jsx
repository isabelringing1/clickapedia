import { useState, useEffect } from "react";

import Article from "./Article";
import Menu from "./Menu";

import "./App.css";

function App() {
  const [log, setLog] = useState(["Incremental_game"]);
  const [dict, setDict] = useState({ Incremental_game: true });
  const [knowledge, setKnowledge] = useState(1);

  return (
    <div id="content">
      {log.map((a, i) => {
        if (a[0] == "*") {
          return null;
        }
        return (
          <Article
            topic={a}
            key={"article-" + i}
            log={log}
            setLog={setLog}
            dict={dict}
            setDict={setDict}
            id={i}
            top={i * 8}
            left={i * 8}
            knowledge={knowledge}
            setKnowledge={setKnowledge}
          />
        );
      })}
      <Menu log={log} dict={dict} knowledge={knowledge} />
    </div>
  );
}

export default App;
