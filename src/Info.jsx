function Info(props) {
  const { show, setShow } = props;

  return (
    show && (
      <div className="info-container" onClick={() => setShow(false)}>
        <div className="info-div">
          <div>Can you open every article on Wikipedia?</div>
          <div>Probably not. Why don't you try, anyway?</div>
        </div>
      </div>
    )
  );
}

export default Info;
