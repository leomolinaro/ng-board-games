import { WotrCardId } from "../card/wotr-card.models";
import { WotrRegionId } from "../region/wotr-region.models";

export interface WotrBattle {
  region: WotrRegionId;
  attackerCombatCard?: WotrCardId;
  defenderCombatCard?: WotrCardId;
}


