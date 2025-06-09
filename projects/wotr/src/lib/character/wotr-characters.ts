import { WotrActionDie } from "../action-die/wotr-action-die.models";
import { WotrCharacterService } from "./wotr-character.service";

interface WotrCharacterChoice {
  canBeBroughtIntoPlay(die: WotrActionDie): boolean;
}

export class WotrGandalfTheWhiteChoice implements WotrCharacterChoice {
  constructor() {}
  canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    throw new Error("Method not implemented.");
  }
}

export class WotrAragornChoice implements WotrCharacterChoice {
  constructor() {}
  canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    throw new Error("Method not implemented.");
  }
}
export class WotrSarumanChoice implements WotrCharacterChoice {
  constructor(private characterService: WotrCharacterService) {}
  canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    return (
      die === "muster" &&
      this.characterService.isAvailable("saruman") &&
      this.characterService.isAtWar("isengard") &&
      this.characterService.isUnconquered("orthanc")
    );
  }
}
export class WotrWitchKingChoice implements WotrCharacterChoice {
  constructor(private characterService: WotrCharacterService) {}
  canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    return (
      die === "muster" &&
      this.characterService.isAvailable("the-witch-king") &&
      this.characterService.isAtWar("sauron") &&
      this.characterService.someFreePeoplesNationIsAtWar() &&
      this.characterService.someRegionWithShadowArmyAndSauronUnit()
    );
  }
}
export class WotrMouthOfSauronChoice implements WotrCharacterChoice {
  constructor(private characterService: WotrCharacterService) {}
  canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    return (
      die === "muster" &&
      this.characterService.isAvailable("the-mouth-of-sauron") &&
      (this.characterService.isFellowshipOnMordorTrack() || this.characterService.victoryPoints("free-peoples") > 0) &&
      this.characterService.someRegionWithUnconqueredSauronStronghold()
    );
  }
}
