import { WotrCardId } from "../card/wotr-card.models";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrArmy } from "../unit/wotr-unit.models";

export interface WotrBattle {
  region: WotrRegionId;
  retroguard: WotrArmy | null;
  attackerCombatCard?: WotrCardId;
  defenderCombatCard?: WotrCardId;
}
