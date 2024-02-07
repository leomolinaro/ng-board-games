import { NgClass, NgSwitch, NgSwitchCase } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnChanges } from "@angular/core";
import { SimpleChanges } from "@leobg/commons/utils";
import { WotrFrontId } from "../wotr-elements/wotr-front.models";
import { WotrLog } from "../wotr-elements/wotr-log.models";
import { WotrPhase } from "../wotr-elements/wotr-phase.models";
import { WotrPlayer } from "../wotr-elements/wotr-player.models";
import { WotrAction } from "../wotr-story.models";

interface WotrLogStringFragment { type: "string"; label: string }
interface WotrLogPlayerFragment { type: "player"; label: string; front: WotrFrontId }

type WotrLogFragment =
  | WotrLogStringFragment
  | WotrLogPlayerFragment;

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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrLogComponent implements OnChanges {
  
  // private components: WotrComponentsService) {}

  @Input () log!: WotrLog;
  @Input () players!: WotrPlayer[];

  fragments!: WotrLogFragment[];

  ngOnChanges (changes: SimpleChanges<this>) {
    if (changes.log) {
      const l = this.log;
      switch (l.type) {
        case "setup": this.fragments = [this.string ("Setup")]; break;
        case "endGame": this.fragments = [this.string ("End Game")]; break;
        case "round": this.fragments = [this.string (`Round ${l.roundNumber}`)]; break;
        case "phase": this.fragments = [this.string (this.getPhaseLabel (l.phase))]; break;
        case "action": this.fragments = this.actionToFragment (l.front, l.action); break;
        // case "nation-turn":
        //   this.fragments = [
        //     this.string (this.components.NATION[l.nationId].label),
        //   ];
        //   break;
        // case "population-marker-set":
        //   this.fragments = [
        //     this.string (
        //       `Population marker ${
        //         l.populationMarker == null
        //           ? "unset"
        //           : `set to ${l.populationMarker}`
        //       }`
        //     ),
        //   ];
        //   break;
        // case "infantry-placement":
        //   this.fragments = [
        //     this.string (
        //       `${l.quantity} infantr${
        //         l.quantity === 1 ? "y" : "ies"
        //       } placed in `
        //     ),
        //     this.region (l.landId),
        //   ];
        //   break;
        // case "infantry-reinforcement":
        //   this.fragments = [
        //     this.string (
        //       `${l.quantity} infantry reinforcement${
        //         l.quantity === 1 ? "" : "s"
        //       } in `
        //     ),
        //     this.region (l.regionId),
        //   ];
        //   break;
        // case "army-movement": {
        //   this.fragments = [];
        //   let quantity = 0;
        //   let isFirst = true;
        //   for (const unit of l.units) {
        //     if (isFirst) {
        //       isFirst = false;
        //     } else {
        //       this.fragments.push (this.string (", "));
        //     }
        //     if (unit.type === "leader") {
        //       quantity++;
        //       this.fragments.push (this.leader (unit.leaderId));
        //     } else {
        //       quantity += unit.quantity;
        //       this.fragments.push (this.unit (unit));
        //     }
        //   }
        //   this.fragments.push (
        //     this.string (` ${quantity === 1 ? "moves" : "move"} from `)
        //   );
        //   this.fragments.push (this.region (l.units[0].regionId));
        //   this.fragments.push (this.string (" to "));
        //   this.fragments.push (this.region (l.toRegionId));
        //   break;
        // }
        // case "turn": this.fragments = [this.player (l.player), this.string ("'s turn")]; break;
        // case "recruitment": this.fragments = [this.player (l.player), this.string (" recruits a knight in "), this.land (l.land), this.string (".")]; break;
        // case "movement": this.fragments = [this.player (l.player), this.string (" moves a knight from "), this.land (l.movement.fromLand), this.string (" to "), this.land (l.movement.toLand), this.string (".")]; break;
        // case "construction": this.fragments = [this.player (l.player), this.string (" builds a "), this.pawn (l.construction.building), this.string (" in "), this.land (l.construction.land), this.string (".")]; break;
        // case "expedition": this.fragments = [this.player (l.player), this.string (" makes an expedition to "), this.land (l.land), this.string (".")]; break;
        // case "newCity": this.fragments = [this.player (l.player), this.string (" builds a new city in "), this.land (l.land), this.string (".")]; break;
        // case "nobleTitle": this.fragments = [this.player (l.player), this.string (" earns a new noble title.")]; break;
        // case "setupPlacement": this.fragments = [this.player (l.player), this.string (" places a knight in "), this.land (l.land), this.string (".")]; break;
        // default: console.error (`Log type ${l.type} not managed`);
      }
    }
  }

  private string (label: string): WotrLogStringFragment {
    return {
      type: "string",
      label: label,
    };
  }

  private player (front: WotrFrontId): WotrLogPlayerFragment {
    const player = this.players.find (p => p.id === front)!;
    return {
      type: "player",
      label: player?.name,
      front: front
    };
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
