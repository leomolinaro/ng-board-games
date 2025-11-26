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

@Injectable({ providedIn: "root" })
export class WotrGameQuery {
  private characterStore = inject(WotrCharacterStore);
  private regionStore = inject(WotrRegionStore);
  private nationStore = inject(WotrNationStore);
  private frontStore = inject(WotrFrontStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private unitUtils = inject(WotrUnitUtils);

  freePeoples = new WotrFrontQuery("free-peoples", this.frontStore);
  shadow = new WotrFrontQuery("shadow", this.frontStore);
  front(frontId: WotrFrontId): WotrFrontQuery {
    switch (frontId) {
      case "free-peoples":
        return this.freePeoples;
      case "shadow":
        return this.shadow;
    }
  }

  fellowship = new WotrFellowshipQuery(this.fellowshipStore, this.regionStore, this.nationStore);

  gandalfTheGrey = new WotrCharacterQuery(
    "gandalf-the-grey",
    this.characterStore,
    this.regionStore,
    this.fellowshipStore
  );
  strider = new WotrCharacterQuery(
    "strider",
    this.characterStore,
    this.regionStore,
    this.fellowshipStore
  );
  legolas = new WotrCharacterQuery(
    "legolas",
    this.characterStore,
    this.regionStore,
    this.fellowshipStore
  );
  gimli = new WotrCharacterQuery(
    "gimli",
    this.characterStore,
    this.regionStore,
    this.fellowshipStore
  );
  boromir = new WotrCharacterQuery(
    "boromir",
    this.characterStore,
    this.regionStore,
    this.fellowshipStore
  );
  meriadoc = new WotrCharacterQuery(
    "meriadoc",
    this.characterStore,
    this.regionStore,
    this.fellowshipStore
  );
  peregrin = new WotrCharacterQuery(
    "peregrin",
    this.characterStore,
    this.regionStore,
    this.fellowshipStore
  );
  gandalfTheWhite = new WotrCharacterQuery(
    "gandalf-the-white",
    this.characterStore,
    this.regionStore,
    this.fellowshipStore
  );
  aragorn = new WotrCharacterQuery(
    "aragorn",
    this.characterStore,
    this.regionStore,
    this.fellowshipStore
  );
  gollum = new WotrCharacterQuery(
    "gollum",
    this.characterStore,
    this.regionStore,
    this.fellowshipStore
  );
  saruman = new WotrCharacterQuery(
    "saruman",
    this.characterStore,
    this.regionStore,
    this.fellowshipStore
  );
  theWitchKing = new WotrCharacterQuery(
    "the-witch-king",
    this.characterStore,
    this.regionStore,
    this.fellowshipStore
  );
  theMouthOfSauron = new WotrCharacterQuery(
    "the-mouth-of-sauron",
    this.characterStore,
    this.regionStore,
    this.fellowshipStore
  );
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
}
