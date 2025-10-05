import { formatTopic } from "../public/util";

function Log(props) {
  const { log, quests, resurfaceArticle } = props;

  var openQuests = Object.keys(quests).filter((id) => !quests[id].complete);
  console.log(openQuests);

  return (
    <div id="log">
      {log.map((a, i) => {
        if (a[0] == "*") {
          return (
            <div className="log-entry red" key={"log-" + i}>
              You've already opened{" "}
              <a className="log-article purple">
                {formatTopic(a.substring(1))}
              </a>
            </div>
          );
        } else if (a[0] == "#") {
          if (a == "#HELP") {
            return (
              <div className="log-entry red" key={"log-" + i}>
                Link not valid.
              </div>
            );
          }
        } else {
          return (
            <div className="log-entry" key={"log-" + i}>
              Opened{" "}
              <a className="log-article" onClick={() => resurfaceArticle(i)}>
                {formatTopic(a)}
              </a>
            </div>
          );
        }
      })}

      {openQuests.map((id, i) => {
        return (
          <div className="quest" key={"quest-" + i}>
            <div className="quest-text">
              <span className="quest-highlight">Quest:</span>{" "}
              {quests[id].quest.desc}
            </div>
            <div className="quest-text">
              <span className="quest-highlight">Reward:</span>{" "}
              {quests[id].quest.reward} Knowledge
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Log;
