import Log from "./Log";
import Progress from "./Progress";
import Quests from "./Quests";
import Shop from "./Shop";

function Menu(props) {
  const {
    log,
    openedLinks,
    knowledge,
    setKnowledge,
    autos,
    setAutos,
    quests,
    resurfaceArticle,
  } = props;
  return (
    <div id="menu">
      <Log log={log} resurfaceArticle={resurfaceArticle} />
      <Progress openedLinks={openedLinks} knowledge={knowledge} autos={autos} />

      <Shop
        knowledge={knowledge}
        setKnowledge={setKnowledge}
        autos={autos}
        setAutos={setAutos}
      />

      <Quests quests={quests} />
    </div>
  );
}
export default Menu;
