import { Injectable, inject } from "@angular/core";
import { ABgGameService, BgAuthService, unexpectedStory } from "@leobg/commons";
import { delay, firstValueFrom, from, of } from "rxjs";
import { WotrArmyNotRetreatIntoSiege, WotrArmyRetreatIntoSiege } from "../army/wotr-army-actions";
import { WotrBattleStore } from "../battle/wotr-battle.store";
import { WotrCombatCardChoose, WotrCombatCardChooseNot } from "../battle/wotr-combat-actions";
import { WotrCombatDie } from "../battle/wotr-combat-die.models";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrActionApplier } from "../commons/wotr-action-applier";
import { WotrActionEffect } from "../commons/wotr-effect-getter";
import { WotrCompanionElimination, WotrCompanionRandom } from "../companion/wotr-companion-actions";
import { WotrFellowshipCorruption } from "../fellowship/wotr-fellowship-actions";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrHuntRoll, WotrHuntTileDraw } from "../hunt/wotr-hunt-actions";
import { WotrHuntTileId } from "../hunt/wotr-hunt.models";
import { WotrHuntStore } from "../hunt/wotr-hunt.store";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrPlayerAiService } from "../player/wotr-player-ai.service";
import { WotrPlayerLocalService } from "../player/wotr-player-local.service";
import { WotrPlayer } from "../player/wotr-player.models";
import { WotrPlayerService } from "../player/wotr-player.service";
import { WotrRemoteService } from "./wotr-remote.service";
import { WotrAction, WotrDieCardStory, WotrDieStory, WotrPassStory, WotrSkipTokensStory, WotrStory, WotrStoryDoc, WotrTokenStory } from "./wotr-story.models";
import { WotrGameStore } from "./wotr-game.store";
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
  private battleStore = inject (WotrBattleStore);
  private huntStore = inject (WotrHuntStore);
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

  private actionEffects!: Record<WotrAction["type"], WotrActionEffect<WotrAction>>;
  registerActionEffects (effectGetters: Record<WotrAction["type"], WotrActionEffect<WotrAction>>) {
    this.actionEffects = effectGetters;
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
    return firstValueFrom (super.executeTask$ (playerId, p => from (task (p))).pipe (delay (50)));
  }
  private async executeTasks (tasks: WotrStoryTask[]): Promise<WotrStory[]> {
    return firstValueFrom (super.executeTasks$ (tasks.map (t => ({
      playerId: t.playerId,
      task$: p => from (t.task (p))
    }))).pipe (delay (50)));
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
    for (const frontId of this.frontStore.frontIds ()) {
      await this.applyStory (stories[index++], frontId);
    }
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

  private findAction<A extends WotrAction> (story: WotrStory, ...actionTypes: A["type"][]): A {
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
      story.actions.forEach (action => {
        this.applyAction (action, front);
        this.logStore.logAction (action, story, front);
      });
      await this.actionsEffect (story.actions, story, front);
    },
    battle: async (story, front) => {
      story.actions.forEach (action => {
        this.applyAction (action, front);
        this.logStore.logAction (action, story, front, "battle");
      });
      await this.actionsEffect (story.actions, story, front);
    },
    hunt: async (story, front) => {
      story.actions.forEach (action => {
        this.applyAction (action, front);
        this.logStore.logAction (action, story, front, "hunt");
      });
      await this.actionsEffect (story.actions, story, front);
    },
    die: async (story, front) => {
      story.actions.forEach (action => {
        this.applyAction (action, front);
        this.logStore.logAction (action, story, front);
      });
      await this.actionsEffect (story.actions, story, front);
      this.frontStore.removeActionDie (story.die, front);
    },
    "die-card": async (story, front) => {
      story.actions.forEach (action => {
        this.applyAction (action, front);
        this.logStore.logAction (action, story, front);
      });
      await this.actionsEffect (story.actions, story, front);
      this.frontStore.discardCards ([story.card], front);
      this.frontStore.removeActionDie (story.die, front);
    },
    "reaction-card": async (story, front) => {
      story.actions.forEach (action => {
        this.applyAction (action, front);
        this.logStore.logAction (action, story, front);
      });
      await this.actionsEffect (story.actions, story, front);
    },
    "reaction-combat-card": async (story, front) => {
      story.actions.forEach (action => {
        this.applyAction (action, front);
        this.logStore.logAction (action, story, front);
      });
      await this.actionsEffect (story.actions, story, front);
    },
    "reaction-character": async (story, front) => {
      story.actions.forEach (action => {
        this.applyAction (action, front);
        this.logStore.logAction (action, story, front);
      });
      await this.actionsEffect (story.actions, story, front);
    },
    token: async (story, front) => {
      story.actions.forEach (action => {
        this.applyAction (action, front);
        this.logStore.logAction (action, story, front);
      });
      await this.actionsEffect (story.actions, story, front);
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

  private applyAction (action: WotrAction, frontId: WotrFrontId) {
    this.actionAppliers[action.type] (action, frontId);
  }

  private async actionEffect (action: WotrAction, story: WotrStory, front: WotrFrontId) {
    return this.actionEffects[action.type]?. (action, front) || of (void 0);
  }

  private async actionsEffect (actions: WotrAction[], story: WotrStory, front: WotrFrontId) {
    for (const action of actions) {
      await this.actionEffect (action, story, front);
    }
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

  async drawHuntTile (front: WotrFrontId): Promise<WotrHuntTileId> {
    const story = await this.story (front, p => p.drawHuntTile! ());
    const action = this.findAction<WotrHuntTileDraw> (story, "hunt-tile-draw");
    return action.tile;
  }

  async absorbHuntDamage (front: WotrFrontId): Promise<(WotrFellowshipCorruption | WotrCompanionElimination | WotrCompanionRandom)[]> {
    const story = await this.story (front, p => p.absorbHuntDamage! ());
    const actions = this.filterActions<WotrFellowshipCorruption | WotrCompanionElimination | WotrCompanionRandom> (
      story,
      "fellowship-corruption", "companion-elimination", "companion-random");
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

  async chooseCombatCard (front: WotrFrontId): Promise<WotrCardId | null> {
    const story = await this.story (front, p => p.chooseCombatCard! ());
    const action = this.findAction<WotrCombatCardChoose | WotrCombatCardChooseNot> (story, "combat-card-choose", "combat-card-choose-not");
    switch (action.type) {
      case "combat-card-choose": return action.card;
      case "combat-card-choose-not": return null;
    }
  }

  async rollCombatDice (): Promise<void> {
    await this.parallelStories (f => p => p.rollCombatDice! ());
  }

  async chooseCasualties (front: WotrFrontId): Promise<WotrStory> {
    return this.story (front, p => p.chooseCasualties! ());
  }

  async battleAdvance (front: WotrFrontId): Promise<WotrStory> {
    return this.story (front, p => p.battleAdvance! ());
  }


}
