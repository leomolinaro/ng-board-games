import { NgClass, NgSwitch, NgSwitchCase } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnChanges, inject } from "@angular/core";
import { SimpleChanges } from "@leobg/commons/utils";
import { WotrActionDiceLogsService } from "../wotr-actions/wotr-action-dice-logs.service";
import { WotrActionLogger } from "../wotr-actions/wotr-action-log";
import { WotrArmyLogsService } from "../wotr-actions/wotr-army-logs.service";
import { WotrCardLogsService } from "../wotr-actions/wotr-card-logs.service";
import { WotrCombatLogsService } from "../wotr-actions/wotr-combat-logs.service";
import { WotrCompanionLogsService } from "../wotr-actions/wotr-companion-logs.service";
import { WotrFellowshipLogsService } from "../wotr-actions/wotr-fellowship-logs.service";
import { WotrHuntLogsService } from "../wotr-actions/wotr-hunt-logs.service";
import { WotrMinionLogsService } from "../wotr-actions/wotr-minion-logs.service";
import { WotrPoliticalLogsService } from "../wotr-actions/wotr-political-logs.service";
import { WotrAssetsService } from "../wotr-assets.service";
import { WotrCompanionId } from "../wotr-elements/wotr-companion.models";
import { WotrActionDie, WotrActionToken } from "../wotr-elements/wotr-dice.models";
import { WotrFrontId } from "../wotr-elements/wotr-front.models";
import { WotrGameStore } from "../wotr-elements/wotr-game.store";
import { WotrHuntTile } from "../wotr-elements/wotr-hunt.models";
import { WotrLog } from "../wotr-elements/wotr-log.models";
import { WotrPhase } from "../wotr-elements/wotr-phase.models";
import { WotrRegion, WotrRegionId } from "../wotr-elements/wotr-region.models";
import { WotrAction } from "../wotr-story.models";

interface WotrLogStringFragment { type: "string"; label: string }
interface WotrLogPlayerFragment { type: "player"; label: string; front: WotrFrontId }
interface WotrLogRegionFragment { type: "region"; label: string; region: WotrRegion }
interface WotrLogDieFragment { type: "die"; dieImage: string }
interface WotrLogTokenFragment { type: "token"; tokenImage: string }
interface WotrLogHuntTileFragment { type: "hunt-tile"; tileImage: string }

type WotrLogFragment =
  | WotrLogStringFragment
  | WotrLogPlayerFragment
  | WotrLogRegionFragment
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
          @case ("region") {  <span>{{ fragment.label }}</span> }
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
      margin-left: 3px;
      height: 16px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrLogComponent implements OnChanges {
  
  private actionLoggers: Record<WotrAction["type"], WotrActionLogger<WotrAction>> = {
    ...inject (WotrCardLogsService).getActionLoggers (),
    ...inject (WotrFellowshipLogsService).getActionLoggers (),
    ...inject (WotrHuntLogsService).getActionLoggers (),
    ...inject (WotrActionDiceLogsService).getActionLoggers (),
    ...inject (WotrCompanionLogsService).getActionLoggers (),
    ...inject (WotrMinionLogsService).getActionLoggers (),
    ...inject (WotrArmyLogsService).getActionLoggers (),
    ...inject (WotrPoliticalLogsService).getActionLoggers (),
    ...inject (WotrCombatLogsService).getActionLoggers (),
  } as any;

  private assets = inject (WotrAssetsService);
  private store = inject (WotrGameStore);

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
          this.fragments = this.actionLoggers[l.action.type] (l.action, l.front, this);
          if (l.die) { this.fragments.push (this.die (l.die, l.front)); }
          if (l.token) { this.fragments.push (this.token (l.token, l.front)); }
          break;
        }
        case "action-pass": this.fragments = [this.player (l.front), this.string (" passes")]; break;
        // default: throw new Error (`Log type ${l.type} not managed`);
      }
    }
  }

  string (label: string): WotrLogStringFragment {
    return { type: "string", label };
  }

  companion (companionId: WotrCompanionId): WotrLogStringFragment {
    const companion = this.store.getCompanion (companionId);
    return { type: "string", label: companion.name };
  }

  player (front: WotrFrontId): WotrLogPlayerFragment {
    const player = this.store.getPlayer (front);
    return { type: "player", label: player.name, front };
  }

  region (regionId: WotrRegionId): WotrLogRegionFragment {
    const region = this.store.getRegion (regionId);
    return { type: "region", label: region.name, region };
  }

  die (die: WotrActionDie, frontId: WotrFrontId): WotrLogDieFragment {
    return { type: "die", dieImage: this.assets.getActionDieImage (die, frontId) };
  }

  token (token: WotrActionToken, frontId: WotrFrontId): WotrLogTokenFragment {
    return { type: "token", tokenImage: this.assets.getActionTokenImage (token, frontId) };
  }

  huntTile (tile: WotrHuntTile): WotrLogHuntTileFragment {
    return { type: "hunt-tile", tileImage: this.assets.getHuntTileImage (tile) };
  }

  // private region (regionId: WotrRegionId): WotrLogRegionFragment {
  //   const region = this.components.REGION[regionId];
  //   return {
  //     type: "region",
  //     label: region.name,
  //     region,
  //   };
  // }

  // private leader (leaderId: WotrLeaderId): WotrLogStringFragment {
  //   return {
  //     type: "string",
  //     label: this.components.getLeader (leaderId).name,
  //   };
  // }

  // private unit (
  //   unit: Exclude<WotrRegionUnit, WotrRegionLeader>
  // ): WotrLogStringFragment {
  //   return {
  //     type: "string",
  //     label: `${unit.quantity} ${this.components
  //       .getNation (unit.nationId)
  //       .label.toLowerCase ()} ${this.components.getUnitTypeLabel (
  //       unit.type,
  //       unit.quantity === 1
  //     )}`,
  //   };
  // }

  // private player (playerId: string): WotrLogPlayerFragment {
  //   const player = this.game.getPlayer (playerId);
  //   return {
  //     type: "player",
  //     label: player.name,
  //     player: player
  //   };
  // }

  // private land (landId: WotrLandCoordinates): WotrLogLandFragment {
  //   const land = this.game.getLand (landId);
  //   let label: string;
  //   switch (land.type) {
  //     case "fields": label = "fields"; break;
  //     case "plain": label = "plain"; break;
  //     case "mountain": label = "mountain"; break;
  //     case "forest": label = "forest"; break;
  //     case "lake": label = "lake"; break;
  //   }
  //   return {
  //     type: "land",
  //     label: label,
  //     land: land
  //   };
  // }

  // private pawn (pawnType: WotrPawnType): WotrLogPawnFragment {
  //   let label: string;
  //   switch (pawnType) {
  //     case "city": label = "city"; break;
  //     case "knight": label = "knight"; break;
  //     case "stronghold": label = "stronghold"; break;
  //     case "village": label = "village"; break;
  //   }
  //   return {
  //     type: "pawn",
  //     label: label,
  //     pawn: pawnType
  //   };
  // }

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

  private actionToFragment (front: WotrFrontId, action: WotrAction) {
    switch (action.type) {
      case "card-draw": return [this.player (front), this.string (` draws ${action.cards.length} card${action.cards.length === 1 ? "" : "s"}`)];
      default: return [this.string ("TODO")];
    }
  }

}
