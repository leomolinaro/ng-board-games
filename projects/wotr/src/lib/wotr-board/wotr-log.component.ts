import { NgClass, NgSwitch, NgSwitchCase } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnChanges, inject } from "@angular/core";
import { SimpleChanges } from "@leobg/commons/utils";
import { WotrFragmentCreator } from "../wotr-actions/wotr-action-log";
import { WotrGameActionLogsService } from "../wotr-actions/wotr-game-action-logs.service";
import { WotrAssetsService } from "../wotr-assets.service";
import { WotrCompanionId } from "../wotr-elements/wotr-companion.models";
import { WotrCompanionStore } from "../wotr-elements/wotr-companion.store";
import { WotrActionDie, WotrActionToken } from "../wotr-elements/wotr-dice.models";
import { WotrFrontId } from "../wotr-elements/wotr-front.models";
import { WotrGameStore } from "../wotr-elements/wotr-game.store";
import { WotrHuntTileId } from "../wotr-elements/wotr-hunt.models";
import { WotrLog } from "../wotr-elements/wotr-log.models";
import { WotrNation, WotrNationId } from "../wotr-elements/wotr-nation.models";
import { WotrNationStore } from "../wotr-elements/wotr-nation.store";
import { WotrPhase } from "../wotr-elements/wotr-phase.models";
import { WotrRegion, WotrRegionId } from "../wotr-elements/wotr-region.models";
import { WotrRegionStore } from "../wotr-elements/wotr-region.store";

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
        'wotr-log-h0': log.type === 'setup' || log.type === 'round' || log.type === 'endGame',
        'wotr-log-h1': log.type === 'phase'
      }">
      @for (fragment of fragments; track $index) {
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
      // .is-yellow { color: $yellow; }
      // .is-green { color: $green; }
    }
    .action-die, .action-token, .hunt-tile {
      vertical-align: top;
      // margin-left: 3px;
      height: 16px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrLogComponent implements OnChanges, WotrFragmentCreator<WotrLogFragment> {
  
  private assets = inject (WotrAssetsService);
  private store = inject (WotrGameStore);
  private actionLogs = inject (WotrGameActionLogsService);
  private nationStore = inject (WotrNationStore);
  private regionStore = inject (WotrRegionStore);
  private companionStore = inject (WotrCompanionStore);

  @Input () log!: WotrLog;

  fragments!: WotrLogFragment[];

  ngOnChanges (changes: SimpleChanges<this>) {
    if (changes.log) {
      const l = this.log;
      switch (l.type) {
        case "setup": this.fragments = [this.string ("Setup")]; break;
        case "endGame": this.fragments = [this.string ("End Game")]; break;
        case "round": this.fragments = [this.string (`Round ${l.roundNumber}`)]; break;
        case "phase": this.fragments = [this.string (this.getPhaseLabel (l.phase))]; break;
        case "action": {
          const fragments = this.actionLogs.getLogFragments<WotrLogFragment> (l.action, l.front, this);
          this.fragments = [];
          for (const f of fragments) {
            if (typeof f === "string") { this.fragments.push (this.string (f)); }
            else { this.fragments.push (f); }
          }
          if (l.die) { this.fragments.push (this.string (" "), this.die (l.die, l.front)); }
          if (l.token) { this.fragments.push (this.string (" "), this.token (l.token, l.front)); }
          if (l.card) { this.fragments.push (this.string (" "), this.string (l.card)); }
          break;
        }
        case "action-pass": this.fragments = [this.player (l.front), this.string (" passes")]; break;
        // default: throw new Error (`Log type ${l.type} not managed`);
      }
    }
  }

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
