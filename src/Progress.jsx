function Progress(props) {
  const { dict, knowledge } = props;
  const getProgress = () => {
    var total = 7068811;
    var progress = Object.keys(dict).length;
    var percent = (100 * progress) / total;
    console.log(percent);
    return Math.floor(percent);
  };
  return (
    <div className="progress-container">
      <div className="progress-text">Knowledge: {knowledge}</div>
      <div className="progress-text">
        You've explored {getProgress() + "%"} of Wikipedia
      </div>
      <div className="progress">
        <div
          className="progress-inner"
          style={{ width: getProgress() + "%" }}
        ></div>
      </div>
    </div>
  );
}
export default Progress;
