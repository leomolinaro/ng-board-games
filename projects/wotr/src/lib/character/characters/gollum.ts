import { Injectable, inject } from "@angular/core";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { CaptainOfTheWestAbility, WotrCharacterCard } from "./wotr-character-card";

// Gollum - Slave of the Ring
// As soon as there are no Companions in the Fellowship, immediately add Gollum to the Fellowship.
// Gollum becomes the Guide of the Fellowship.
// Guide. Standard numbered Hunt tiles with a "Reveal" icon do not reveal the Fellowship. If the Fellowship is not revealed as an effect of the Hunt, you may choose to
// reveal it to reduce the Hunt damage by one (to a minimum of zero).

@Injectable({ providedIn: "root" })
export class WotrGollum extends WotrCharacterCard {
  private regionStore = inject(WotrRegionStore);
  protected characterStore = inject(WotrCharacterStore);

  protected override characterId: WotrCharacterId = "gollum";

  override inPlayAbilities(): WotrCardAbility[] {
    return [
      new CaptainOfTheWestAbility(this.characterId, this.characterStore),
      new DwarfOfEreborAbility(this.characterStore)
    ];
  }
}

class DwarfOfEreborAbility implements WotrCardAbility {
  constructor(private characterStore: WotrCharacterStore) {}
  activate(): void {}
  deactivate(): void {}
}
