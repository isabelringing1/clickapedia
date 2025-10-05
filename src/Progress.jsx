function Progress(props) {
  const { openedLinks, knowledge, autos } = props;

  const getProgress = () => {
    var total = 7068811;
    var progress = Object.keys(openedLinks).length;
    var percent = (100 * progress) / total;
    return Math.floor(percent);
  };

  return (
    <div className="progress-container">
      <div className="progress-text">Knowledge: {knowledge}</div>
      {autos > 0 && (
        <div className="progress-text">
          Auto-opening {autos / 5} pages a second
        </div>
      )}
      <div className="progress-text">
        You've opened {Object.keys(openedLinks).length} articles (
        {getProgress() + "%"} of Wikipedia)
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
