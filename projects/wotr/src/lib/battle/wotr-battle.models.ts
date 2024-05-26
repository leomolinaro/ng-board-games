import { WotrCardId } from "../card/wotr-card.models";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrUnits } from "../unit/wotr-unit-actions";

export interface WotrBattle {
  region: WotrRegionId;
  retroguard: WotrUnits | null;
  attackerCombatCard?: WotrCardId;
  defenderCombatCard?: WotrCardId;
}
