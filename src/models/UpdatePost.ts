import Update, { SaleItem } from "./update";

export default class UpdatePost {
  constructor(private update: Update) {}

  getSaleString = (item: SaleItem) => {
    const getPriceString = (price: number, saleAmount: number) =>
      (price * (1 - saleAmount / 100)).toLocaleString("en-US");
    let priceString = "";
    if (item.price) {
      priceString = item.tradePrice
        ? ` (GTA$ ${getPriceString(item.price, item.amount)} / ${getPriceString(
            item.tradePrice,
            item.amount
          )})`
        : ` (GTA$ ${getPriceString(item.price, item.amount)})`;
    } else if (item.minPrice && item.maxPrice) {
      priceString = ` (GTA$ ${getPriceString(
        item.minPrice,
        item.amount
      )} - ${getPriceString(item.maxPrice, item.amount)})`;
    }

    return item.url
      ? ` - ${item.amount}% off ${item.name}${priceString} [↗](${item.url})`
      : ` - ${item.amount}% off ${item.name}${priceString}`;
  };

  get = () => {
    const groups: string[] = [];

    if (this.update.new.length) {
      groups.push(
        "**New Content**\n\n" +
          this.update.new
            .map((item) =>
              item.url ? ` - ${item.name} [↗](${item.url})` : ` - ${item.name}`
            )
            .join("\n\n")
      );
    }
    if (this.update.podium) {
      groups.push(
        "**Podium Vehicle**\n\n" +
          (this.update.podium.url
            ? ` - ${this.update.podium.name} [↗](${this.update.podium.url})`
            : ` - ${this.update.podium.name}`)
      );
    }
    if (this.update.bonusActivities.length) {
      groups.push(
        "**Bonus GTA$ and RP Activities**\n\n" +
          this.update.bonusActivities
            .map((activity) => {
              const bonusString =
                activity.moneyAmount === activity.rpAmount
                  ? activity.moneyAmount + "x GTA$ and RP"
                  : activity.moneyAmount +
                    "x GTA$ and " +
                    activity.rpAmount +
                    "x RP";

              return (
                " - " +
                bonusString +
                " on " +
                (activity.url
                  ? `${activity.name} [↗](${activity.url})`
                  : `${activity.name}`)
              );
            })
            .join("\n\n")
      );
    }
    if (this.update.sale.length) {
      groups.push(
        "**Discounted Content**\n\n" +
          this.update.sale.map(this.getSaleString).join("\n\n")
      );
    }
    if (this.update.twitchPrime.length) {
      groups.push(
        "**Twitch Prime Bonuses**\n\n" +
          this.update.twitchPrime.map(this.getSaleString).join("\n\n")
      );
    }
    if (this.update.targetedSale.length) {
      groups.push(
        "**Targeted Sales**\n\n" +
          this.update.targetedSale.map(this.getSaleString).join("\n\n")
      );
    }
    if (this.update.timeTrial) {
      groups.push(
        `**Time Trial**\n\n - [${this.update.timeTrial.name}](${this.update.timeTrial.url})`
      );
    }
    if (this.update.rcTimeTrial) {
      groups.push(
        `**RC Bandito Time Trial**\n\n - [${this.update.rcTimeTrial.name}](${this.update.rcTimeTrial.url})`
      );
    }
    if (this.update.premiumRace) {
      groups.push(
        `**Premium Race**\n\n - [${this.update.premiumRace.name}](${this.update.premiumRace.url})`
      );
    }

    groups.push(
      "View embedded updates [here](https://gtaonline-cf0ea.web.app/)."
    );

    return groups.join("\n\n");
  };
}
