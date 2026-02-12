import { Injectable } from "@angular/core";
import { WotrActionDie, WotrActionToken } from "../action-die/wotr-action-die-models";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrElvenRing, WotrFrontId } from "../front/wotr-front-models";
import { WotrHuntTileId } from "../hunt/wotr-hunt-models";
import { WotrArmyUnitType, WotrNationId } from "../nation/wotr-nation-models";

const BASE_PATH = "assets/wotr";

export interface WotrUnitImage {
  source: string;
  width: number;
  height: number;
}

@Injectable({ providedIn: "root" })
export class WotrAssetsStore {
  constructor() {
    this.init();
  }

  private init() {
    this.initNations();
    this.initCharacters();
  }

  mapSlotsPath(): string {
    return `${BASE_PATH}/wotr-map-slots.json`;
  }
  mapImageSource() {
    return `${BASE_PATH}/map.jpg`;
  }
  mapSvgSource() {
    return `${BASE_PATH}/map.svg`;
  }

  private NATION_BY_ID: Record<
    WotrNationId,
    { regular: WotrUnitImage; elite: WotrUnitImage; leader?: WotrUnitImage }
  > = {} as any;
  armyUnitImage(type: WotrArmyUnitType, nationId: WotrNationId) {
    switch (type) {
      case "regular":
        return this.NATION_BY_ID[nationId].regular;
      case "elite":
        return this.NATION_BY_ID[nationId].elite;
    }
  }
  leaderImage(nationId: WotrNationId) {
    return this.NATION_BY_ID[nationId].leader!;
  }
  private initNations() {
    this.NATION_BY_ID.dwarves = {
      regular: this.unitImage("dwarven-regular", 23, 34),
      elite: this.unitImage("dwarven-elite", 27, 42),
      leader: this.unitImage("dwarven-leader", 41, 43)
    };
    this.NATION_BY_ID.elves = {
      regular: this.unitImage("elven-regular", 19, 45),
      elite: this.unitImage("elven-elite", 36, 46),
      leader: this.unitImage("elven-leader", 29, 48)
    };
    this.NATION_BY_ID.gondor = {
      regular: this.unitImage("gondor-regular", 23, 48),
      elite: this.unitImage("gondor-elite", 41, 48),
      leader: this.unitImage("gondor-leader", 40, 46)
    };
    this.NATION_BY_ID.north = {
      regular: this.unitImage("north-regular", 30, 40),
      elite: this.unitImage("north-elite", 36, 54),
      leader: this.unitImage("north-leader", 33, 44)
    };
    this.NATION_BY_ID.rohan = {
      regular: this.unitImage("rohan-regular", 21, 48),
      elite: this.unitImage("rohan-elite", 47, 45),
      leader: this.unitImage("rohan-leader", 33, 44)
    };
    this.NATION_BY_ID.isengard = {
      regular: this.unitImage("isengard-regular", 35, 43),
      elite: this.unitImage("isengard-elite", 46, 46)
    };
    this.NATION_BY_ID.sauron = {
      regular: this.unitImage("sauron-regular", 31, 40),
      elite: this.unitImage("sauron-elite", 40, 44)
    };
    this.NATION_BY_ID.southrons = {
      regular: this.unitImage("southron-regular", 31, 49),
      elite: this.unitImage("southron-elite", 46, 46)
    };
  }

  private NAZGUL: WotrUnitImage = this.unitImage("nazgul", 42, 67);
  nazgulImage() {
    return this.NAZGUL;
  }

  private CHARACTER_BY_ID: Record<WotrCharacterId, WotrUnitImage> = {} as any;
  characterImage(characterId: WotrCharacterId) {
    return this.CHARACTER_BY_ID[characterId];
  }
  private initCharacterImage(fileName: string, width: number, height: number): WotrUnitImage {
    return { source: `${BASE_PATH}/characters/${fileName}.png`, width, height };
  }
  private initCharacters() {
    this.CHARACTER_BY_ID["gandalf-the-grey"] = this.initCharacterImage("gandalf-the-grey", 31, 55);
    this.CHARACTER_BY_ID.strider = this.initCharacterImage("strider", 31, 47);
    this.CHARACTER_BY_ID.boromir = this.initCharacterImage("boromir", 30, 44);
    this.CHARACTER_BY_ID.legolas = this.initCharacterImage("legolas", 28, 45);
    this.CHARACTER_BY_ID.gimli = this.initCharacterImage("gimli", 33, 38);
    this.CHARACTER_BY_ID.meriadoc = this.initCharacterImage("merry", 29, 33);
    this.CHARACTER_BY_ID.peregrin = this.initCharacterImage("pippin", 30, 36);
    this.CHARACTER_BY_ID.aragorn = this.initCharacterImage("aragorn", 30, 48);
    this.CHARACTER_BY_ID["gandalf-the-white"] = this.initCharacterImage(
      "gandalf-the-white",
      31,
      55
    );
    this.CHARACTER_BY_ID.gollum = this.initCharacterImage("gollum", 28, 35);
    this.CHARACTER_BY_ID.saruman = this.initCharacterImage("saruman", 53, 44);
    this.CHARACTER_BY_ID["the-witch-king"] = this.initCharacterImage("witch-king", 57, 44);
    this.CHARACTER_BY_ID["the-mouth-of-sauron"] = this.initCharacterImage("mouth", 43, 41);
    // Kome
    this.CHARACTER_BY_ID.brand = this.initCharacterImage("brand", 10, 10);
    this.CHARACTER_BY_ID.dain = this.initCharacterImage("dain", 10, 10);
    this.CHARACTER_BY_ID.denethor = this.initCharacterImage("denethor", 10, 10);
    this.CHARACTER_BY_ID.theoden = this.initCharacterImage("theoden", 10, 10);
    this.CHARACTER_BY_ID.thranduil = this.initCharacterImage("thranduil", 10, 10);
    this.CHARACTER_BY_ID["the-black-serpent"] = this.initCharacterImage("black-serpent", 10, 10);
    this.CHARACTER_BY_ID["the-shadow-of-mirkwood"] = this.initCharacterImage(
      "shadow-of-mirkwood",
      10,
      10
    );
    this.CHARACTER_BY_ID.ugluk = this.initCharacterImage("ugluk", 10, 10);
  }

  private FELLOWSHIP: WotrUnitImage = this.unitImage("fellowship", 31, 31);
  private FELLOWSHIP_REVEALED: WotrUnitImage = this.unitImage("fellowship-revealed", 47, 47);
  fellowshipImage(revealed: boolean) {
    return revealed ? this.FELLOWSHIP_REVEALED : this.FELLOWSHIP;
  }

  cardPreviewImage(cardId: WotrCardId) {
    return `${BASE_PATH}/card-previews/${cardId}.png`;
  }
  cardImage(cardId: WotrCardId) {
    return `${BASE_PATH}/cards/${cardId}.png`;
  }

  private unitImage(fileName: string, width: number, height: number): WotrUnitImage {
    return { source: `${BASE_PATH}/units/${fileName}.png`, width, height };
  }

  actionDieImage(actionDie: WotrActionDie, front: WotrFrontId) {
    return `${BASE_PATH}/action-dice/${front === "free-peoples" ? "fp" : "s"}-${actionDie}.png`;
  }
  actionTokenImage(actionToken: WotrActionToken, front: WotrFrontId) {
    return `${BASE_PATH}/action-tokens/${front === "free-peoples" ? "fp" : "s"}-${actionToken}.png`;
  }
  huntTileImage(huntTile: WotrHuntTileId) {
    if (huntTile.endsWith("km")) return `${BASE_PATH}/kome/hunt-tiles/${huntTile}.png`;
    return `${BASE_PATH}/hunt-tiles/${huntTile}.png`;
  }
  politicalMarkerImage(nationId: WotrNationId, active: boolean) {
    return `${BASE_PATH}/political-markers/${nationId}-${active ? "active" : "inactive"}.png`;
  }
  fellowshipProgressCounter(revealed: boolean) {
    return `${BASE_PATH}/fellowship-counters/fellowship-progress-counter-${revealed ? "back" : "front"}.png`;
  }
  corruptionCounter() {
    return `${BASE_PATH}/fellowship-counters/corruption-counter.png`;
  }
  elvenRingImage(elvenRing: WotrElvenRing) {
    return `${BASE_PATH}/elven-rings/${elvenRing}.png`;
  }
  victoryMarker(front: WotrFrontId, points: number) {
    if (points <= 10) {
      return `${BASE_PATH}/victory-markers/${front}.png`;
    } else {
      return `${BASE_PATH}/victory-markers/${front}-10.png`;
    }
  }
  controlMarker(front: WotrFrontId) {
    return `${BASE_PATH}/control-markers/${front}.png`;
  }
}
