function ShopCard(props) {
  const { card, canBuy, onBuy } = props;
  var cn = "shop-card";
  if (!canBuy) {
    cn += " disabled";
  }
  return (
    <div
      className={cn}
      onClick={() => {
        if (canBuy) onBuy(card);
      }}
    >
      <div className="shop-card-title shop-text">{card.title}</div>
      <div className="shop-card-desc shop-text">{card.desc}</div>
      <div className="shop-card-cost shop-text">
        Cost: {card.cost} Knowledge
      </div>
    </div>
  );
}

export default ShopCard;
