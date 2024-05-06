import { NgClass, NgSwitch, NgSwitchCase } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, inject, input, isDevMode } from "@angular/core";
import { WotrFragmentCreator } from "../wotr-actions/wotr-action-log";
import { WotrGameActionLogsService } from "../wotr-actions/wotr-game-action-logs.service";
import { WotrAssetsService } from "../wotr-assets.service";
import { cardToLabel } from "../wotr-elements/card/wotr-card.models";
import { WotrCompanionId } from "../wotr-elements/companion/wotr-companion.models";
import { WotrCompanionStore } from "../wotr-elements/companion/wotr-companion.store";
import { WotrFrontId } from "../wotr-elements/front/wotr-front.models";
import { WotrHuntTileId } from "../wotr-elements/hunt/wotr-hunt.models";
import { WotrLog } from "../wotr-elements/log/wotr-log.models";
import { WotrNation, WotrNationId } from "../wotr-elements/nation/wotr-nation.models";
import { WotrNationStore } from "../wotr-elements/nation/wotr-nation.store";
import { WotrRegion, WotrRegionId } from "../wotr-elements/region/wotr-region.models";
import { WotrRegionStore } from "../wotr-elements/region/wotr-region.store";
import { WotrActionDie, WotrActionToken } from "../wotr-elements/wotr-dice.models";
import { WotrGameStore } from "../wotr-elements/wotr-game.store";
import { WotrPhase } from "../wotr-elements/wotr-phase.models";

interface WotrLogStringFragment { type: "string"; label: string }
interface WotrLogPlayerFragment { type: "player"; label: string; front: WotrFrontId }
interface WotrLogRegionFragment { type: "region"; region: WotrRegion }
interface WotrLogNationFragment { type: "nation"; nation: WotrNation }
interface WotrLogDieFragment { type: "die"; dieImage: string }
interface WotrLogTokenFragment { type: "token"; tokenImage: string }
interface WotrLogHuntTileFragment { type: "hunt-tile"; tileImage: string }

type WotrLogFragment =
  | WotrLogStringFragment
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
    <div class="wotr-log"
      [ngClass]="{
        'wotr-log-h0': log ().type === 'setup' || log ().type === 'round' || log ().type === 'endGame',
        'wotr-log-h1': log ().type === 'phase',
        'breakpoint': debugBreakpoint ()
      }"
      (click)="logClick.next ()">
      @for (fragment of fragments (); track $index) {
        @switch (fragment.type) {
          @case ("string") { <span>{{ fragment.label }}</span> }
          @case ("player") {  <span [ngClass]="fragment.front === 'shadow' ? 'is-red' : 'is-blue'">{{ fragment.label }}</span> }
          @case ("region") {  <span>{{ fragment.region.name }}</span> }
          @case ("nation") {  <span>{{ fragment.nation.name }}</span> }
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

    .wotr-log {
      margin-left: 1.5vw;

      &.wotr-log-h0 { font-size: 130%; margin-left: 0; }
      &.wotr-log-h1 { font-size: 120%; margin-left: 0.5vw; }
      &.wotr-log-h2 { font-size: 110%; margin-left: 1vw; }

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
export class WotrLogComponent implements WotrFragmentCreator<WotrLogFragment> {
  
  private assets = inject (WotrAssetsService);
  private store = inject (WotrGameStore);
  private actionLogs = inject (WotrGameActionLogsService);
  private nationStore = inject (WotrNationStore);
  private regionStore = inject (WotrRegionStore);
  private companionStore = inject (WotrCompanionStore);

  log = input.required<WotrLog> ();
  debugBreakpoint = input.required<boolean> ();
  @Output () logClick = new EventEmitter<void> ();

  protected fragments = computed (() => {
    const l = this.log ();
    if (this.debugBreakpoint () && isDevMode ()) {
      // eslint-disable-next-line no-debugger
      debugger;
    }
    switch (l.type) {
      case "setup": return [this.string ("Setup")];
      case "endGame": return [this.string ("End Game")];
      case "round": return [this.string (`Round ${l.roundNumber}`)];
      case "phase": return [this.string (this.getPhaseLabel (l.phase))];
      case "action": {
        const fragments = this.actionLogs.getLogFragments<WotrLogFragment> (l.action, l.front, this);
        const parsed: WotrLogFragment[] = [];
        for (const f of fragments) {
          if (typeof f === "string") { parsed.push (this.string (f)); }
          else { parsed.push (f); }
        }
        if (l.die) { parsed.push (this.string (" "), this.die (l.die, l.front)); }
        if (l.token) { parsed.push (this.string (" "), this.token (l.token, l.front)); }
        if (l.card) { parsed.push (this.string (" "), this.string (`(${cardToLabel (l.card)})`)); }
        return parsed;
      }
      case "action-pass": return [this.player (l.front), this.string (" passes")];
      case "tokens-skip": return [this.player (l.front), this.string (" skips remaining tokens")];
      // default: throw new Error (`Log type ${l.type} not managed`);
    }
  });

  private string (label: string): WotrLogStringFragment {
    return { type: "string", label };
  }

  companion (companionId: WotrCompanionId): WotrLogStringFragment {
    const companion = this.companionStore.companion (companionId);
    return { type: "string", label: companion.name };
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
