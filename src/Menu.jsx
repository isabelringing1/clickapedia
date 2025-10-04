import Log from "./Log";
import Progress from "./Progress";

function Menu(props) {
  const { log, dict, knowledge } = props;
  return (
    <div id="menu">
      <Log log={log} />
      <Progress dict={dict} knowledge={knowledge} />
    </div>
  );
}
export default Menu;
