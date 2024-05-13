import { NgClass, NgSwitch, NgSwitchCase } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, computed, inject, input, isDevMode } from "@angular/core";
import { WotrFragmentCreator } from "../wotr-actions/wotr-action-log";
import { WotrGameActionLogsService } from "../wotr-actions/wotr-game-action-logs.service";
import { WotrAssetsService } from "../wotr-assets.service";
import { cardToLabel, combatCardToLabel } from "../wotr-elements/card/wotr-card.models";
import { WotrCompanionId } from "../wotr-elements/companion/wotr-companion.models";
import { WotrCompanionStore } from "../wotr-elements/companion/wotr-companion.store";
import { WotrFrontId } from "../wotr-elements/front/wotr-front.models";
import { WotrHuntTileId } from "../wotr-elements/hunt/wotr-hunt.models";
import { WotrLog } from "../wotr-elements/log/wotr-log.models";
import { WotrMinionId } from "../wotr-elements/minion/wotr-minion.models";
import { WotrMinionStore } from "../wotr-elements/minion/wotr-minion.store";
import { WotrNation, WotrNationId } from "../wotr-elements/nation/wotr-nation.models";
import { WotrNationStore } from "../wotr-elements/nation/wotr-nation.store";
import { WotrRegion, WotrRegionId } from "../wotr-elements/region/wotr-region.models";
import { WotrRegionStore } from "../wotr-elements/region/wotr-region.store";
import { WotrActionDie, WotrActionToken } from "../wotr-elements/wotr-dice.models";
import { WotrPhase } from "../wotr-elements/wotr-phase.models";
import { WotrGameStore } from "../wotr-game/wotr-game.store";

interface WotrLogStringFragment { type: "string"; label: string }
interface WotrLogCardFragment { type: "card"; label: string }
interface WotrLogPlayerFragment { type: "player"; label: string; front: WotrFrontId }
interface WotrLogRegionFragment { type: "region"; region: WotrRegion }
interface WotrLogNationFragment { type: "nation"; nation: WotrNation }
interface WotrLogDieFragment { type: "die"; dieImage: string }
interface WotrLogTokenFragment { type: "token"; tokenImage: string }
interface WotrLogHuntTileFragment { type: "hunt-tile"; tileImage: string }

type WotrLogFragment =
  | WotrLogStringFragment
  | WotrLogCardFragment
  | WotrLogPlayerFragment
  | WotrLogRegionFragment
  | WotrLogNationFragment
  | WotrLogDieFragment
  | WotrLogTokenFragment
  | WotrLogHuntTileFragment;

@Component ({
  selector: "wotr-log",
  standalone: true,
  imports: [NgClass, NgSwitch, NgSwitchCase],
  template: `
    <div class="log"
      [ngClass]="{
        'log-h0': log ().type === 'setup' || log ().type === 'round' || log ().type === 'endGame',
        'log-h1': log ().type === 'phase',
        'battle-h2': log ().type === 'battle-resolution',
        'hunt-h2': log ().type === 'hunt-resolution',
        'battle-log': battleLog (),
        'hunt-log': huntLog (),
        'breakpoint': debugBreakpoint ()
      }"
      (click)="logClick.next ()">
      @for (fragment of fragments (); track $index) {
        @switch (fragment.type) {
          @case ("string") { <span>{{ fragment.label }}</span> }
          @case ("card") { <span><i>{{ fragment.label }}</i></span> }
          @case ("player") { <span [ngClass]="fragment.front === 'shadow' ? 'is-red' : 'is-blue'">{{ fragment.label }}</span> }
          @case ("region") { <span>{{ fragment.region.name }}</span> }
          @case ("nation") { <span>{{ fragment.nation.name }}</span> }
          @case ("die") { <img class="action-die" [src]="fragment.dieImage"/> }
          @case ("token") { <img class="action-token" [src]="fragment.tokenImage"/> }
          @case ("hunt-tile") { <img class="hunt-tile" [src]="fragment.tileImage"/> }
          <!-- @case ("hunt-tile") { <span>{{ fragment.label }}</span> } -->
        }
      }
    </div>
  `,
  styles: [`
    @import 'wotr-variables';

    .log {
      margin-left: 1.5vw;

      &.log-h0 { font-size: 130%; margin-left: 0; }
      &.log-h1 { font-size: 120%; margin-left: 0.5vw; }
      &.log-h2 { font-size: 110%; margin-left: 1vw; }
      &.battle-h2, &.hunt-h2 { font-size: 110%; }
      &.battle-log, &.hunt-log { margin-left: 2vw; }

      .is-red { color: $red; }
      .is-blue { color: $blue; }

      &.breakpoint::before {
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        background-color: red;
        border-radius: 50%;
        margin-right: 3px;
      }
    }
    .action-die, .action-token, .hunt-tile {
      vertical-align: top;
      height: 16px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrLogComponent implements OnInit, WotrFragmentCreator<WotrLogFragment> {
  
  private assets = inject (WotrAssetsService);
  private store = inject (WotrGameStore);
  private actionLogs = inject (WotrGameActionLogsService);
  private nationStore = inject (WotrNationStore);
  private regionStore = inject (WotrRegionStore);
  private companionStore = inject (WotrCompanionStore);
  private minionStore = inject (WotrMinionStore);

  log = input.required<WotrLog> ();
  debugBreakpoint = input.required<boolean> ();
  @Output () logClick = new EventEmitter<void> ();

  protected battleLog = computed (() => {
    const log = this.log ();
    return "during" in log && log.during === "battle";
  });

  protected huntLog = computed (() => {
    const log = this.log ();
    return "during" in log && log.during === "hunt";
  });

  ngOnInit () {
    if (this.debugBreakpoint () && isDevMode ()) {
      // eslint-disable-next-line no-debugger
      debugger;
    }
  }

  protected fragments = computed (() => {
    const l = this.log ();
    switch (l.type) {
      case "setup": return [this.string ("Setup")];
      case "endGame": return [this.string ("End Game")];
      case "round": return [this.string (`Round ${l.roundNumber}`)];
      case "phase": return [this.string (this.getPhaseLabel (l.phase))];
      case "battle-resolution": return [this.string ("Battle Resolution")];
      case "hunt-resolution": return [this.string ("Hunt Resolution")];
      case "action": {
        const fragments = this.actionLogs.getLogFragments<WotrLogFragment> (l.action, l.front, this);
        const parsed: WotrLogFragment[] = [];
        for (const f of fragments) {
          if (typeof f === "string") { parsed.push (this.string (f)); }
          else { parsed.push (f); }
        }
        if ("card" in l.story) { parsed.push (this.string (", using "), this.card (cardToLabel (l.story.card))); }
        if ("die" in l.story) { parsed.push (this.string (" "), this.die (l.story.die, l.front)); }
        if ("token" in l.story) { parsed.push (this.string (" "), this.token (l.story.token, l.front)); }
        return parsed;
      }
      case "story": {
        switch (l.story.type) {
          case "die-pass": return [this.player (l.front), this.string (" passes")];
          case "token-skip": return [this.player (l.front), this.string (" skips remaining tokens")];
          case "reaction-card-skip": return [this.player (l.front), this.string (" skip "), this.card (cardToLabel (l.story.card))];
          case "reaction-character-skip": return [this.player (l.front), this.string (" skip character reaction")/* , this.card (combatCardToLabel (l.story.character)) */];
          case "reaction-combat-card-skip": return [this.player (l.front), this.string (" skip "), this.card (combatCardToLabel (l.story.card))];
        }
        return [];
      }
      case "combat-card": return [this.player (l.front), this.string (" plays "), this.card (combatCardToLabel (l.card))];
      // default: throw new Error (`Log type ${l.type} not managed`);
    }
  });

  private string (label: string): WotrLogStringFragment {
    return { type: "string", label };
  }

  private card (label: string): WotrLogCardFragment {
    return { type: "card", label };
  }

  companion (companionId: WotrCompanionId): WotrLogStringFragment {
    const companion = this.companionStore.companion (companionId);
    return { type: "string", label: companion.name };
  }

  minion (minionId: WotrMinionId): WotrLogStringFragment {
    const minion = this.minionStore.minion (minionId);
    return { type: "string", label: minion.name };
  }

  player (front: WotrFrontId): WotrLogPlayerFragment {
    const player = this.store.getPlayer (front);
    return { type: "player", label: player.name, front };
  }

  region (regionId: WotrRegionId): WotrLogRegionFragment {
    const region = this.regionStore.region (regionId);
    return { type: "region", region };
  }

  nation (nationId: WotrNationId): WotrLogNationFragment {
    const nation = this.nationStore.nation (nationId);
    return { type: "nation", nation };
  }

  die (die: WotrActionDie, frontId: WotrFrontId): WotrLogDieFragment {
    return { type: "die", dieImage: this.assets.getActionDieImage (die, frontId) };
  }

  token (token: WotrActionToken, frontId: WotrFrontId): WotrLogTokenFragment {
    return { type: "token", tokenImage: this.assets.getActionTokenImage (token, frontId) };
  }

  huntTile (tile: WotrHuntTileId): WotrLogHuntTileFragment {
    return { type: "hunt-tile", tileImage: this.assets.getHuntTileImage (tile) };
  }

  private getPhaseLabel (phase: WotrPhase): string {
    switch (phase) {
      case 1: return "Recover Action Dice and Draw Event Cards";
      case 2: return "Fellowship Phase";
      case 3: return "Hunt Allocation";
      case 4: return "Action Roll";
      case 5: return "Action Resolution";
      case 6: return "Victory Check";
    }
  }

}
