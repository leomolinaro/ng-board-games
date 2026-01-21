import { inject, Injectable } from "@angular/core";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrCharacterQuery } from "../character/wotr-character-query";
import { WotrCharacterStore } from "../character/wotr-character-store";
import { WotrFellowshipQuery } from "../fellowship/wotr-fellowship-query";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrFrontQuery } from "../front/wotr-front-query";
import { WotrFrontStore } from "../front/wotr-front-store";
import { WotrNationId } from "../nation/wotr-nation-models";
import { WotrNationQuery } from "../nation/wotr-nation-query";
import { WotrNationStore } from "../nation/wotr-nation-store";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionQuery } from "../region/wotr-region-query";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrUnitUtils } from "../unit/wotr-unit-utils";

@Injectable()
export class WotrGameQuery {
  private characterStore = inject(WotrCharacterStore);
  private regionStore = inject(WotrRegionStore);
  private nationStore = inject(WotrNationStore);
  private frontStore = inject(WotrFrontStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private unitUtils = inject(WotrUnitUtils);

  freePeoples = new WotrFrontQuery("free-peoples", this.frontStore, this.characterStore);
  shadow = new WotrFrontQuery("shadow", this.frontStore, this.characterStore);
  front(frontId: WotrFrontId): WotrFrontQuery {
    switch (frontId) {
      case "free-peoples":
        return this.freePeoples;
      case "shadow":
        return this.shadow;
    }
  }

  fellowship = new WotrFellowshipQuery(this.fellowshipStore, this.regionStore, this.nationStore);

  gandalfTheGrey = this.newCharacter("gandalf-the-grey");
  strider = this.newCharacter("strider");
  legolas = this.newCharacter("legolas");
  gimli = this.newCharacter("gimli");
  boromir = this.newCharacter("boromir");
  meriadoc = this.newCharacter("meriadoc");
  peregrin = this.newCharacter("peregrin");
  gandalfTheWhite = this.newCharacter("gandalf-the-white");
  aragorn = this.newCharacter("aragorn");
  gollum = this.newCharacter("gollum");
  saruman = this.newCharacter("saruman");
  theWitchKing = this.newCharacter("the-witch-king");
  theMouthOfSauron = this.newCharacter("the-mouth-of-sauron");
  private newCharacter(characterId: WotrCharacterId): WotrCharacterQuery {
    return new WotrCharacterQuery(
      characterId,
      this.characterStore,
      this.regionStore,
      this.fellowshipStore
    );
  }
  messengerOfTheDarkTowerUsed() {
    return this.characterStore.messengerOfTheDarkTowerUsed();
  }
  setMessengerOfTheDarkTowerUsed() {
    this.characterStore.setMessengerOfTheDarkTowerUsed();
  }
  resetMessengerOfTheDarkTower() {
    this.characterStore.resetMessengerOfTheDarkTower();
  }
  minions = [this.saruman, this.theMouthOfSauron, this.theWitchKing];
  companions = [
    this.gandalfTheGrey,
    this.strider,
    this.legolas,
    this.gimli,
    this.boromir,
    this.meriadoc,
    this.peregrin,
    this.gandalfTheWhite,
    this.aragorn
  ];
  character(characterId: WotrCharacterId): WotrCharacterQuery {
    switch (characterId) {
      case "gandalf-the-grey":
        return this.gandalfTheGrey;
      case "strider":
        return this.strider;
      case "legolas":
        return this.legolas;
      case "gimli":
        return this.gimli;
      case "boromir":
        return this.boromir;
      case "meriadoc":
        return this.meriadoc;
      case "peregrin":
        return this.peregrin;
      case "aragorn":
        return this.aragorn;
      case "gandalf-the-white":
        return this.gandalfTheWhite;
      case "gollum":
        return this.gollum;
      case "saruman":
        return this.saruman;
      case "the-mouth-of-sauron":
        return this.theMouthOfSauron;
      case "the-witch-king":
        return this.theWitchKing;
    }
  }

  dwarves = new WotrNationQuery("dwarves", this.nationStore, this.regionStore);
  elves = new WotrNationQuery("elves", this.nationStore, this.regionStore);
  north = new WotrNationQuery("north", this.nationStore, this.regionStore);
  rohan = new WotrNationQuery("rohan", this.nationStore, this.regionStore);
  gondor = new WotrNationQuery("gondor", this.nationStore, this.regionStore);
  freePeoplesNations = [this.dwarves, this.elves, this.north, this.rohan, this.gondor];
  sauron = new WotrNationQuery("sauron", this.nationStore, this.regionStore);
  isengard = new WotrNationQuery("isengard", this.nationStore, this.regionStore);
  southrons = new WotrNationQuery("southrons", this.nationStore, this.regionStore);
  shadowNations = [this.sauron, this.isengard, this.southrons];
  nation(nationId: WotrNationId): WotrNationQuery {
    switch (nationId) {
      case "dwarves":
        return this.dwarves;
      case "elves":
        return this.elves;
      case "north":
        return this.north;
      case "rohan":
        return this.rohan;
      case "gondor":
        return this.gondor;
      case "sauron":
        return this.sauron;
      case "isengard":
        return this.isengard;
      case "southrons":
        return this.southrons;
    }
  }

  private _regions: Partial<Record<WotrRegionId, WotrRegionQuery>> = {};

  region(regionId: WotrRegionId): WotrRegionQuery {
    if (!this._regions[regionId]) {
      this._regions[regionId] = new WotrRegionQuery(regionId, this.regionStore, this.unitUtils);
    }
    return this._regions[regionId];
  }
  regions(...regionIds: WotrRegionId[]): WotrRegionQuery[] {
    if (regionIds.length === 0) regionIds = this.regionStore.state().ids;
    return regionIds.map(id => this.region(id));
  }
  strongholdRegions(): WotrRegionQuery[] {
    return this.regions().filter(region => region.isStronghold());
  }
}
