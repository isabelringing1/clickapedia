import { formatTopic } from "../public/util";

function Log(props) {
  const { log } = props;

  return (
    <div id="log">
      {log.map((a, i) => {
        console.log(a);
        if (a[0] == "*") {
          return (
            <div className="log-entry red" key={"log-" + i}>
              You've already opened{" "}
              <a className="log-article purple" target="_blank">
                {formatTopic(a.substring(1))}
              </a>
            </div>
          );
        } else {
          return (
            <div className="log-entry" key={"log-" + i}>
              Opened{" "}
              <a className="log-article" target="_blank">
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
