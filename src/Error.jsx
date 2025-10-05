import { useEffect, useState } from "react";
function Error(props) {
  const { message, setMessage } = props;

  const [cn, setCn] = useState("error-div");

  useEffect(() => {
    console.log("message is " + message);
    if (message == "") {
      return;
    }
    setCn("error-div error-in");
    setTimeout(() => {
      setCn("error-div");
      setMessage("");
    }, 700);
  }, [message]);

  return (
    <div className="error-container">
      <div className={cn}>Error: {message}</div>
    </div>
  );
}

export default Error;
