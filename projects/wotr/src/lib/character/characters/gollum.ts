import { WotrAbility } from "../../ability/wotr-ability";

// Gollum - Slave of the Ring
// As soon as there are no Companions in the Fellowship, immediately add Gollum to the Fellowship.
// Gollum becomes the Guide of the Fellowship.
// Guide. Standard numbered Hunt tiles with a "Reveal" icon do not reveal the Fellowship. If the Fellowship is not revealed as an effect of the Hunt, you may choose to
// reveal it to reduce the Hunt damage by one (to a minimum of zero).

export class GollumGuideAbility implements WotrAbility<unknown> {
  public handler = null;
}
