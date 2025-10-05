function Info(props) {
  const { info, setInfo } = props;

  var infoHtml = (
    <div className="info-div">
      <div className="info-text">Can you open every article on Wikipedia?</div>
      <div className="info-text">Probably not. Why don't you try, anyway?</div>
    </div>
  );

  var endingHtml = (
    <div className="info-div">
      <div className="info-text">Congrats on getting your first cluster!</div>
      <div className="info-text">
        This is as far as the game goes at the moment. Clickipedia was made
        (very quickly) for{" "}
        <a href="https://wikigamejam.org/">WikiGameJam NYC 2025</a>.
      </div>
      <div className="info-text">
        If you have any feedback, please reach out to{" "}
        <a href="mailto:isabelringing1@gmail.com">Isabel</a>. Thanks for
        playing!
      </div>
    </div>
  );

  return (
    info != "" && (
      <div className="info-container" onClick={() => setInfo("")}>
        {info == "info" ? infoHtml : endingHtml}
      </div>
    )
  );
}

export default Info;
