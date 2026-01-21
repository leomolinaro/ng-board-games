import { inject, Injectable } from "@angular/core";
import { WotrCharacterHandler } from "../character/wotr-character-handler";
import { WotrCharacterId, WotrCompanionId } from "../character/wotr-character-models";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrGameQuery } from "../game/wotr-game-query";
import { WotrHuntFlow } from "../hunt/wotr-hunt-flow";
import { WotrRingBearerCorrupted } from "../hunt/wotr-hunt-models";
import { WotrHuntStore } from "../hunt/wotr-hunt-store";
import { WotrLogWriter } from "../log/wotr-log-writer";
import { WotrNationHandler } from "../nation/wotr-nation-handler";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import {
  corruptFellowship,
  WotrFellowshipAction,
  WotrFellowshipCorruption
} from "./wotr-fellowship-actions";
import { WotrRingDestroyed } from "./wotr-fellowship-models";
import { WotrFellowshipModifiers } from "./wotr-fellowship-modifiers";
import { WotrFellowshipStore } from "./wotr-fellowship-store";

@Injectable()
export class WotrFellowshipHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private nationHandler = inject(WotrNationHandler);
  private fellowshipStore = inject(WotrFellowshipStore);
  private regionStore = inject(WotrRegionStore);
  private huntStore = inject(WotrHuntStore);
  private huntFlow = inject(WotrHuntFlow);
  private characterHandler = inject(WotrCharacterHandler);
  private logger = inject(WotrLogWriter);
  private q = inject(WotrGameQuery);
  private fellowshipModifiers = inject(WotrFellowshipModifiers);

  init() {
    this.actionRegistry.registerActions(this.getActionAppliers() as any);
    this.actionRegistry.registerActionLoggers(this.getActionLoggers() as any);
    this.actionRegistry.registerEffectLogger<WotrFellowshipCorruption>(
      "fellowship-corruption",
      (effect, f) => [
        `Fellowship is ${effect.quantity < 0 ? "healed" : "corrupted"} by ${this.nCorruptionPoints(Math.abs(effect.quantity))}`
      ]
    );
  }

  getActionAppliers(): WotrActionApplierMap<WotrFellowshipAction> {
    return {
      "fellowship-declare": (story, front) => this.declare(story.region),
      "fellowship-corruption": (action, front) => this.corrupt(action.quantity),
      "fellowship-push": (action, front) => this.pushFellowship(action.region),
      "fellowship-guide": (action, front) => this.changeGuide(action.companion),
      "fellowship-hide": (action, front) => this.hide(),
      "fellowship-progress": (action, front) => this.progress(),
      "fellowship-reveal": (action, front) => this.reveal(action.region),
      "fellowship-reveal-in-mordor": (action, front) => this.revealInMordor(),
      "companion-random": (action, front) => {} /*empty*/,
      "companion-separation": (action, front) =>
        this.separateCompanions(action.companions, action.toRegion)
    };
  }

  hide(): void {
    this.fellowshipStore.setHideAttempt();
    this.fellowshipStore.hide();
  }

  async progress(): Promise<void> {
    this.fellowshipStore.setMoveAttempt();
    if (this.fellowshipStore.isOnMordorTrack()) {
      await this.huntFlow.resolveHunt();
      this.huntStore.addFellowshipDie();
    } else {
      this.fellowshipStore.increaseProgress();
      await this.huntFlow.resolveHunt();
      this.huntStore.addFellowshipDie();
    }
    if (this.fellowshipStore.isOnMordorTrack() && this.fellowshipStore.progress() === 6) {
      throw new WotrRingDestroyed();
    }
  }

  reveal(regionId: WotrRegionId): void {
    this.regionStore.moveFellowshipToRegion(regionId);
    this.fellowshipStore.reveal();
  }

  revealInMordor(): void {
    this.fellowshipStore.reveal();
  }

  async declare(regionId: WotrRegionId): Promise<void> {
    this.regionStore.moveFellowshipToRegion(regionId);
    this.fellowshipStore.setProgress(0);
    this.nationHandler.checkNationActivationByFellowshipDeclaration(regionId);
    if (this.q.fellowship.corruption() > 0 && this.q.fellowship.isInFreePeoplesSettlement()) {
      this.healEffect(1);
    }
    await this.fellowshipModifiers.onAfterFellowshipDeclaration(regionId);
  }

  changeGuide(companionId: WotrCompanionId): void {
    this.fellowshipStore.setGuide(companionId);
  }

  pushFellowship(regionId: WotrRegionId): void {
    this.regionStore.moveFellowshipToRegion(regionId);
  }

  private characters(characters: WotrCharacterId[]) {
    return characters.map(c => this.q.character(c).name).join(", ");
  }

  private nCorruptionPoints(quantity: number) {
    return `${quantity} corruption point${quantity === 1 ? "" : "s"}`;
  }

  separateCompanions(companions: WotrCompanionId[], toRegionId: WotrRegionId): void {
    for (const companionId of companions) {
      this.fellowshipStore.removeCompanion(companionId);
    }
    this.characterHandler.playCharacters(companions, toRegionId);
  }

  corrupt(nCorruption: number) {
    this.fellowshipStore.corrupt(nCorruption);
    if (this.fellowshipStore.corruption() >= 12) {
      throw new WotrRingBearerCorrupted();
    }
  }

  corruptEffect(nCorruption: number) {
    this.corrupt(nCorruption);
    this.logger.logEffect(corruptFellowship(nCorruption));
  }

  healEffect(nHealed: number) {
    this.fellowshipStore.corrupt(-nHealed);
    this.logger.logEffect(corruptFellowship(-nHealed));
  }

  checkFellowshipMovingInMordor() {
    if (this.fellowshipStore.isOnMordorTrack() && !this.fellowshipStore.hasMovedOrHid()) {
      this.corruptEffect(1);
    }
  }

  private getActionLoggers(): WotrActionLoggerMap<WotrFellowshipAction> {
    return {
      "fellowship-corruption": (action, front, f) => [
        f.player(front),
        ` ${action.quantity < 0 ? "heals" : "adds"} ${this.nCorruptionPoints(Math.abs(action.quantity))}`
      ],
      "fellowship-guide": (action, front, f) => [
        f.player(front),
        " chooses ",
        f.character(action.companion),
        " as the guide"
      ],
      "fellowship-push": (action, front, f) => [
        f.player(front),
        " pushes the Fellowship to ",
        f.region(action.region)
      ],
      "fellowship-declare": (action, front, f) => [
        f.player(front),
        " declares the Fellowship in ",
        f.region(action.region)
      ],
      "fellowship-hide": (action, front, f) => [f.player(front), " hides the Fellowship"],
      "fellowship-progress": (action, front, f) => [f.player(front), " moves the Fellowship"],
      "fellowship-reveal": (action, front, f) => [
        f.player(front),
        " reveals the Fellowship in ",
        f.region(action.region)
      ],
      "fellowship-reveal-in-mordor": (action, front, f) => [
        f.player(front),
        " reveals the Fellowship in Mordor"
      ],
      "companion-random": (action, front, f) => [
        f.player(front),
        " draws ",
        this.characters(action.companions),
        " randomly"
      ],
      "companion-separation": (action, front, f) => [
        f.player(front),
        " separates ",
        this.characters(action.companions),
        " from the Fellowship to ",
        f.region(action.toRegion)
      ]
    };
  }
}
