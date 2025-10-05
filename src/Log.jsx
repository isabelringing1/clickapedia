import { formatTopic } from "../public/util";

function Log(props) {
  const { log, resurfaceArticle } = props;
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
    </div>
  );
}

export default Log;
