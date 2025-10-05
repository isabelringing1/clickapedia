import { useState } from "react";
import ShopCard from "./ShopCard";
import shopJson from "./Shop.json";

function Shop(props) {
  const { knowledge, setKnowledge, autos, setAutos } = props;
  var cards = shopJson["items"];

  const [shopDict, setShopDict] = useState({});

  const onBuy = (card) => {
    if (card.category == "auto") {
      setAutos(autos + 1);
    } else {
      console.log("did not recognize card category " + card.category);
      return;
    }
    setKnowledge(knowledge - card.cost);
    var newShopDict = { ...shopDict };
    newShopDict[card.id] = true;
    setShopDict(newShopDict);
  };
  return (
    <div className="shop">
      {cards.map((card, i) => {
        if (shopDict[card.id] || card.trigger > knowledge) {
          return null;
        } else {
          return (
            <ShopCard
              key={"shop-card-" + i}
              card={card}
              canBuy={knowledge >= card.cost}
              onBuy={onBuy}
            />
          );
        }
      })}
    </div>
  );
}

export default Shop;
