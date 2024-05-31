import { Injectable, inject } from "@angular/core";
import { ABgGameService, BgAuthService, unexpectedStory } from "@leobg/commons";
import { firstValueFrom, from } from "rxjs";
import { WotrArmyNotRetreat, WotrArmyNotRetreatIntoSiege, WotrArmyRetreat, WotrArmyRetreatIntoSiege, WotrBattleCease, WotrBattleContinue, WotrCombatCardChoose, WotrCombatCardChooseNot, WotrCombatReRoll, WotrCombatRoll, WotrLeaderForfeit } from "../battle/wotr-battle-actions";
import { WotrCombatDie } from "../battle/wotr-combat-die.models";
import { WotrCardParams } from "../card/wotr-card-effects.service";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrActionApplier } from "../commons/wotr-action-applier";
import { WotrCharacterElimination, WotrCompanionRandom, WotrCompanionSeparation } from "../companion/wotr-character-actions";
import { WotrCharacterId } from "../companion/wotr-character.models";
import { WotrFellowshipCorruption, WotrFellowshipReveal } from "../fellowship/wotr-fellowship-actions";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrHuntReRoll, WotrHuntRoll, WotrHuntTileDraw } from "../hunt/wotr-hunt-actions";
import { WotrHuntTileId } from "../hunt/wotr-hunt.models";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrPlayerAiService } from "../player/wotr-player-ai.service";
import { WotrPlayerLocalService } from "../player/wotr-player-local.service";
import { WotrPlayer } from "../player/wotr-player.models";
import { WotrPlayerService } from "../player/wotr-player.service";
import { WotrUnits } from "../unit/wotr-unit-actions";
import { WotrGameStore } from "./wotr-game.store";
import { WotrRemoteService } from "./wotr-remote.service";
import { WotrAction, WotrDieCardStory, WotrDieStory, WotrPassStory, WotrSkipTokensStory, WotrStory, WotrStoryDoc, WotrTokenStory } from "./wotr-story.models";
import { WotrUiStore } from "./wotr-ui.store";

export interface WotrStoryTask {
  playerId: WotrFrontId;
  task: (playerService: WotrPlayerService) => Promise<WotrStory>;
}

type WotrStoryApplier<S> = (story: S, front: WotrFrontId) => void;

type WotrStoryApplierMap = { [key in WotrStory["type"]]: WotrStoryApplier<{ type: key } & WotrStory> };

@Injectable ()
export class WotrStoryService extends ABgGameService<WotrFrontId, WotrPlayer, WotrStory, WotrPlayerService> {

  private store = inject (WotrGameStore);
  private ui = inject (WotrUiStore);
  private remote = inject (WotrRemoteService);
  private frontStore = inject (WotrFrontStore);
  protected override auth = inject (BgAuthService);
  protected override aiPlayer = inject (WotrPlayerAiService);
  protected override localPlayer = inject (WotrPlayerLocalService);
  private logStore = inject (WotrLogStore);

  protected storyDocs: WotrStoryDoc[] | null = null;
  setStoryDocs (storyDocs: WotrStoryDoc[]) { this.storyDocs = storyDocs; }

  private actionAppliers!: Record<WotrAction["type"], WotrActionApplier<WotrAction>>;
  registerActions (actionAppliers: Record<WotrAction["type"], WotrActionApplier<WotrAction>>) {
    this.actionAppliers = actionAppliers;
  }

  private cardEffects!: Partial<Record<WotrCardId, (params: WotrCardParams) => Promise<void>>>;
  registerCardEffects (cardEffects: Partial<Record<WotrCardId, (params: WotrCardParams) => Promise<void>>>) {
    this.cardEffects = cardEffects;
  }

  protected override getGameId () { return this.store.getGameId (); }
  protected override getPlayer (playerId: WotrFrontId) { return this.store.getPlayer (playerId); }
  protected override getGameOwner () { return this.store.getGameOwner (); }
  protected override startTemporaryState () { this.store.startTemporaryState (); }
  protected override endTemporaryState () { this.store.endTemporaryState (); }
  protected override insertStoryDoc$ (storyId: string, story: WotrStoryDoc, gameId: string) { return this.remote.insertStory$ (storyId, story, gameId); }
  protected override selectStoryDoc$ (storyId: string, gameId: string) { return this.remote.selectStory$ (storyId, gameId); }
  protected override getCurrentPlayerId () { return this.ui.getCurrentPlayerId (); }
  protected override setCurrentPlayer (playerId: WotrFrontId) { this.ui.setCurrentPlayer (playerId); }
  protected override currentPlayerChange$ () { return this.ui.currentPlayerChange$ (); }
  protected override cancelChange$ () { return this.ui.cancelChange$ (); }
  
  private async executeTask<R extends WotrStory> (playerId: WotrFrontId, task: (playerService: WotrPlayerService) => Promise<R>): Promise<R> {
    await new Promise (resolve => { setTimeout (resolve, 10); });
    return firstValueFrom (super.executeTask$ (playerId, p => from (task (p))));
  }
  private async executeTasks (tasks: WotrStoryTask[]): Promise<WotrStory[]> {
    await new Promise (resolve => { setTimeout (resolve, 10); });
    return firstValueFrom (super.executeTasks$ (tasks.map (t => ({
      playerId: t.playerId,
      task$: p => from (t.task (p))
    }))));
  }

  protected override resetUi (turnPlayer: WotrFrontId) {
    this.ui.updateUi ("Reset UI", (s) => ({
      ...s,
      turnPlayer: turnPlayer,
      ...this.ui.resetUi (),
      canCancel: false,
      message: `${this.store.getPlayer (turnPlayer).name} is thinking...`,
    }));
  }

  private async parallelStories (getTask: (front: WotrFrontId) => (playerService: WotrPlayerService) => Promise<WotrStory>) {
    const stories = await this.executeTasks (this.frontStore.frontIds ().map (
      front => ({ playerId: front, task: getTask (front) })
    ));
    let index = 0;
    const toReturn: Record<WotrFrontId, WotrStory> = { } as any;
    for (const frontId of this.frontStore.frontIds ()) {
      const story = stories[index++];
      await this.applyStory (story, frontId);
      toReturn[frontId] = story;
    }
    return toReturn;
  }

  private async story (front: WotrFrontId, task: (playerService: WotrPlayerService) => Promise<WotrStory>) {
    const story = await this.executeTask (front, task);
    await this.applyStory (story, front);
    return story;
  }

  private filterActions<A extends WotrAction> (story: WotrStory, ...actionTypes: A["type"][]): A[] {
    const actions = this.assertActionsStory (story);
    const foundActions = actions.filter (a => actionTypes.includes (a.type)) as A[];
    if (foundActions.length) { return foundActions; }
    throw unexpectedStory (story, actionTypes.join (" or "));
  }

  findAction<A extends WotrAction> (story: WotrStory, ...actionTypes: A["type"][]): A {
    const actions = this.assertActionsStory (story);
    const foundAction = actions.find (a => actionTypes.includes (a.type)) as A;
    if (foundAction) { return foundAction; }
    throw unexpectedStory (story, actionTypes.join (" or "));
  }

  private assertActionsStory (story: WotrStory): WotrAction[] {
    if ("actions" in story) { return story.actions; }
    throw unexpectedStory (story, "some actions");
  }

  private storyAppliers: WotrStoryApplierMap = {
    phase: async (story, front) => {
      for (const action of story.actions) {
        this.logStore.logAction (action, story, front);
        await this.applyAction (action, front);
      }
    },
    battle: async (story, front) => {
      for (const action of story.actions) {
        this.logStore.logAction (action, story, front, "battle");
        await this.applyAction (action, front);
      }
    },
    hunt: async (story, front) => {
      for (const action of story.actions) {
        this.logStore.logAction (action, story, front, "hunt");
        await this.applyAction (action, front);
      }
    },
    die: async (story, front) => {
      for (const action of story.actions) {
        this.logStore.logAction (action, story, front);
        await this.applyAction (action, front);
      }
      this.frontStore.removeActionDie (story.die, front);
    },
    "die-card": async (story, front) => {
      for (const action of story.actions) {
        this.logStore.logAction (action, story, front);
        await this.applyAction (action, front);
      }
      const cardEffect = this.cardEffects[story.card];
      if (cardEffect) { await cardEffect ({ front, story }); }
      this.frontStore.discardCards ([story.card], front);
      this.frontStore.removeActionDie (story.die, front);
    },
    "reaction-card": async (story, front) => {
      for (const action of story.actions) {
        this.logStore.logAction (action, story, front);
        await this.applyAction (action, front);
      }
    },
    "reaction-combat-card": async (story, front) => {
      for (const action of story.actions) {
        this.logStore.logAction (action, story, front);
        await this.applyAction (action, front);
      }
    },
    "reaction-character": async (story, front) => {
      for (const action of story.actions) {
        this.logStore.logAction (action, story, front);
        await this.applyAction (action, front);
      }
    },
    token: async (story, front) => {
      for (const action of story.actions) {
        this.logStore.logAction (action, story, front);
        await this.applyAction (action, front);
      }
      this.frontStore.removeActionToken (story.token, front);
    },
    "die-pass": async (story, front) => { this.logStore.logStory (story, front); },
    "reaction-card-skip": async (story, front) => { this.logStore.logStory (story, front); },
    "reaction-combat-card-skip": async (story, front) => { this.logStore.logStory (story, front, "battle"); },
    "reaction-character-skip": async (story, front) => { this.logStore.logStory (story, front); },
    "token-skip": async (story, front) => this.logStore.logStory (story, front),
  };

  private async applyStory (story: WotrStory, front: WotrFrontId) {
    await (this.storyAppliers[story.type] as any) (story, front);
  }

  private async applyAction (action: WotrAction, frontId: WotrFrontId) {
    const actionApplier = this.actionAppliers[action.type];
    if (!actionApplier) { return; }
    await actionApplier (action, frontId);
  }

  async firstPhaseDrawCards (): Promise<void> {
    await this.parallelStories (f => p => p.firstPhaseDrawCards! ());
  }

  async wantDeclareFellowship (front: WotrFrontId): Promise<WotrStory> {
    return this.story (front, p => p.wantDeclareFellowship! ());
  }

  async huntAllocation (front: WotrFrontId): Promise<WotrStory> {
    return this.story (front, p => p.huntAllocation! ());
  }

  async rollActionDice (): Promise<void> {
    await this.parallelStories (f => p => p.rollActionDice! ());
  }

  async rollHuntDice (front: WotrFrontId): Promise<WotrCombatDie[]> {
    const story = await this.story (front, p => p.rollHuntDice! ());
    const action = this.findAction<WotrHuntRoll> (story, "hunt-roll");
    return action.dice;
  }

  async reRollHuntDice (front: WotrFrontId): Promise<WotrCombatDie[]> {
    const story = await this.story (front, p => p.reRollHuntDice! ());
    const action = this.findAction<WotrHuntReRoll> (story, "hunt-re-roll");
    return action.dice;
  }

  async drawHuntTile (front: WotrFrontId): Promise<WotrHuntTileId> {
    const story = await this.story (front, p => p.drawHuntTile! ());
    const action = this.findAction<WotrHuntTileDraw> (story, "hunt-tile-draw");
    return action.tile;
  }

  async revealFellowship (front: WotrFrontId): Promise<void> {
    const story = await this.story (front, p => p.revealFellowship! ());
    this.findAction<WotrFellowshipReveal> (story, "fellowship-reveal");
  }

  async separateCompanions (front: WotrFrontId): Promise<void> {
    const story = await this.story (front, p => p.separateCompanions! ());
    this.findAction<WotrCompanionSeparation> (story, "companion-separation");
  }

  async absorbHuntDamage (front: WotrFrontId): Promise<(WotrFellowshipCorruption | WotrCharacterElimination | WotrCompanionRandom)[]> {
    const story = await this.story (front, p => p.absorbHuntDamage! ());
    const actions = this.filterActions<WotrFellowshipCorruption | WotrCharacterElimination | WotrCompanionRandom> (
      story,
      "fellowship-corruption", "character-elimination", "companion-random");
    return actions;
  }

  async actionResolution (front: WotrFrontId): Promise<WotrDieStory | WotrTokenStory | WotrDieCardStory | WotrPassStory | WotrSkipTokensStory> {
    const story = await this.story (front, p => p.actionResolution! ());
    switch (story.type) {
      case "die":
      case "die-card":
      case "die-pass":
      case "token":
      case "token-skip": return story;
      default: throw unexpectedStory (story, "die or token");
    }
  }

  async activateTableCard (cardId: WotrCardId, front: WotrFrontId): Promise<WotrStory> {
    return this.story (front, p => p.activateTableCard! (cardId));
  }

  async forfeitLeadership (front: WotrFrontId): Promise<WotrUnits> {
    const story = await this.story (front, p => p.forfeitLeadership! ());
    const action = this.findAction<WotrLeaderForfeit> (story, "leader-forfeit");
    return action.leaders;
  }

  async activateCharacterAbility (characterId: WotrCharacterId, front: WotrFrontId): Promise<false | WotrAction[]> {
    const story = await this.story (front, p => p.activateCharacterAbility! (characterId));
    switch (story.type) {
      case "reaction-character": return story.actions;
      case "reaction-character-skip": return false;
      default: throw unexpectedStory (story, (" character activation or not"));
    }
  }

  async activateCombatCard (cardId: WotrCardId, front: WotrFrontId): Promise<false | WotrAction[]> {
    const story = await this.story (front, p => p.activateCombatCard! (cardId));
    switch (story.type) {
      case "reaction-combat-card": return story.actions;
      case "reaction-combat-card-skip": return false;
      default: throw unexpectedStory (story, (" combat card activation or not"));
    }
  }

  async wantRetreatIntoSiege (front: WotrFrontId): Promise<boolean> {
    const story = await this.story (front, p => p.wantRetreatIntoSiege! ());
    const action = this.findAction<WotrArmyRetreatIntoSiege | WotrArmyNotRetreatIntoSiege> (story, "army-retreat-into-siege", "army-not-retreat-into-siege");
    switch (action.type) {
      case "army-retreat-into-siege": return true;
      case "army-not-retreat-into-siege": return false;
    }
  }

  async wantRetreat (front: WotrFrontId): Promise<boolean> {
    const story = await this.story (front, p => p.wantRetreat! ());
    const action = this.findAction<WotrArmyRetreat | WotrArmyNotRetreat> (story, "army-retreat", "army-not-retreat");
    switch (action.type) {
      case "army-retreat": return true;
      case "army-not-retreat": return false;
    }
  }

  async chooseCombatCard (front: WotrFrontId): Promise<WotrCardId | null> {
    const story = await this.story (front, p => p.chooseCombatCard! ());
    const action = this.findAction<WotrCombatCardChoose | WotrCombatCardChooseNot> (story, "combat-card-choose", "combat-card-choose-not");
    switch (action.type) {
      case "combat-card-choose": return action.card;
      case "combat-card-choose-not": return null;
    }
  }

  async rollCombatDice (front: WotrFrontId): Promise<WotrCombatDie[]> {
    const story = await this.story (front, p => p.rollCombatDice! ());
    const action = this.findAction<WotrCombatRoll> (story, "combat-roll");
    return action.dice;
  }

  async reRollCombatDice (front: WotrFrontId): Promise<WotrCombatDie[]> {
    const story = await this.story (front, p => p.reRollCombatDice! ());
    const action = this.findAction<WotrCombatReRoll> (story, "combat-re-roll");
    return action.dice;
  }

  async parallelRollCombatDice (): Promise<Record<WotrFrontId, WotrCombatDie[]>> {
    const stories = await this.parallelStories (f => p => p.rollCombatDice! ());
    return {
      "free-peoples": this.findAction<WotrCombatRoll> (stories["free-peoples"], "combat-roll").dice,
      shadow: this.findAction<WotrCombatRoll> (stories.shadow, "combat-roll").dice,
    };
  }

  async parallelReRollCombatDice (): Promise<Record<WotrFrontId, WotrCombatDie[]>> {
    const stories = await this.parallelStories (f => p => p.reRollCombatDice! ());
    return {
      "free-peoples": this.findAction<WotrCombatReRoll> (stories["free-peoples"], "combat-re-roll").dice,
      shadow: this.findAction<WotrCombatReRoll> (stories.shadow, "combat-re-roll").dice,
    };
  }

  async chooseCasualties (front: WotrFrontId): Promise<WotrStory> {
    return this.story (front, p => p.chooseCasualties! ());
  }

  async battleAdvance (front: WotrFrontId): Promise<WotrStory> {
    return this.story (front, p => p.battleAdvance! ());
  }

  async wantContinueBattle (front: WotrFrontId): Promise<boolean> {
    const story = await this.story (front, p => p.wantContinueBattle! ());
    const action = this.findAction<WotrBattleContinue | WotrBattleCease> (story, "battle-continue", "battle-cease");
    switch (action.type) {
      case "battle-continue": return true;
      case "battle-cease": return false;
    }
  }

}
