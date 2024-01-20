import { NgClass, NgSwitch, NgSwitchCase } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnChanges } from "@angular/core";
import { SimpleChanges } from "@leobg/commons/utils";
import { WotrPhase } from "../wotr-components/phase.models";
import { WotrRegion } from "../wotr-components/region.models";
import { WotrLog, WotrPlayer } from "../wotr-game-state.models";

interface WotrLogStringFragment {
  type: "string";
  label: string;
} // WotrLogStringFragment

interface WotrLogPlayerFragment {
  type: "player";
  label: string;
  player: WotrPlayer;
} // WotrLogStringFragment

interface WotrLogRegionFragment {
  type: "region";
  label: string;
  region: WotrRegion;
} // WotrLogRegionFragment

// interface WotrLogPawnFragment {
//   type: "pawn";
//   label: string;
//   pawn: WotrPawnType;
// } // WotrLogPawnFragment

type WotrLogFragment =
  | WotrLogStringFragment
  | WotrLogPlayerFragment
  | WotrLogRegionFragment /*  | WotrLogLandFragment | WotrLogPawnFragment */;

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
        <ng-container [ngSwitch]="fragment.type">
          <span *ngSwitchCase="'string'">{{ fragment.label }}</span>
          <span *ngSwitchCase="'region'">{{ fragment.label }}</span>
          <!-- <a *ngSwitchCase="'player'" [ngClass]="'is-' + $any (fragment).player.color">{{ fragment.label }}</a>
          <a *ngSwitchCase="'land'" [ngClass]="'is-' + $any (fragment).land.type">{{ fragment.label }}</a>
          <a *ngSwitchCase="'pawn'">{{ fragment.label }}</a> -->
        </ng-container>
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

  fragments!: WotrLogFragment[];

  ngOnChanges (changes: SimpleChanges<this>) {
    if (changes.log) {
      const l = this.log;
      switch (l.type) {
        case "setup": this.fragments = [this.string ("Setup")]; break;
        case "endGame": this.fragments = [this.string ("End Game")]; break;
        case "round": this.fragments = [this.string (`Round ${l.roundNumber}`)]; break;
        case "phase": this.fragments = [this.string (this.getPhaseLabel (l.phase))]; break;
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
        //     } // if - else
        //     if (unit.type === "leader") {
        //       quantity++;
        //       this.fragments.push (this.leader (unit.leaderId));
        //     } else {
        //       quantity += unit.quantity;
        //       this.fragments.push (this.unit (unit));
        //     } // if - else
        //   } // for
        //   this.fragments.push (
        //     this.string (` ${quantity === 1 ? "moves" : "move"} from `)
        //   );
        //   this.fragments.push (this.region (l.units[0].regionId));
        //   this.fragments.push (this.string (" to "));
        //   this.fragments.push (this.region (l.toRegionId));
        //   break;
        // } // case
        // case "turn": this.fragments = [this.player (l.player), this.string ("'s turn")]; break;
        // case "recruitment": this.fragments = [this.player (l.player), this.string (" recruits a knight in "), this.land (l.land), this.string (".")]; break;
        // case "movement": this.fragments = [this.player (l.player), this.string (" moves a knight from "), this.land (l.movement.fromLand), this.string (" to "), this.land (l.movement.toLand), this.string (".")]; break;
        // case "construction": this.fragments = [this.player (l.player), this.string (" builds a "), this.pawn (l.construction.building), this.string (" in "), this.land (l.construction.land), this.string (".")]; break;
        // case "expedition": this.fragments = [this.player (l.player), this.string (" makes an expedition to "), this.land (l.land), this.string (".")]; break;
        // case "newCity": this.fragments = [this.player (l.player), this.string (" builds a new city in "), this.land (l.land), this.string (".")]; break;
        // case "nobleTitle": this.fragments = [this.player (l.player), this.string (" earns a new noble title.")]; break;
        // case "setupPlacement": this.fragments = [this.player (l.player), this.string (" places a knight in "), this.land (l.land), this.string (".")]; break;
        // default: console.error (`Log type ${l.type} not managed`);
      } // switch
    } // if
  } // ngOnChanges

  private string (label: string): WotrLogStringFragment {
    return {
      type: "string",
      label: label,
    };
  } // string

  // private region (regionId: WotrRegionId): WotrLogRegionFragment {
  //   const region = this.components.REGION[regionId];
  //   return {
  //     type: "region",
  //     label: region.name,
  //     region,
  //   };
  // } // region

  // private leader (leaderId: WotrLeaderId): WotrLogStringFragment {
  //   return {
  //     type: "string",
  //     label: this.components.getLeader (leaderId).name,
  //   };
  // } // leader

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
  // } // leader

  // private player (playerId: string): WotrLogPlayerFragment {
  //   const player = this.game.getPlayer (playerId);
  //   return {
  //     type: "player",
  //     label: player.name,
  //     player: player
  //   };
  // } // player

  // private land (landId: WotrLandCoordinates): WotrLogLandFragment {
  //   const land = this.game.getLand (landId);
  //   let label: string;
  //   switch (land.type) {
  //     case "fields": label = "fields"; break;
  //     case "plain": label = "plain"; break;
  //     case "mountain": label = "mountain"; break;
  //     case "forest": label = "forest"; break;
  //     case "lake": label = "lake"; break;
  //   } // switch
  //   return {
  //     type: "land",
  //     label: label,
  //     land: land
  //   };
  // } // land

  // private pawn (pawnType: WotrPawnType): WotrLogPawnFragment {
  //   let label: string;
  //   switch (pawnType) {
  //     case "city": label = "city"; break;
  //     case "knight": label = "knight"; break;
  //     case "stronghold": label = "stronghold"; break;
  //     case "village": label = "village"; break;
  //   } // switch
  //   return {
  //     type: "pawn",
  //     label: label,
  //     pawn: pawnType
  //   };
  // } // pawn

  private getPhaseLabel (phase: WotrPhase): string {
    switch (phase) {
      case 1: return "Recover Action Dice and Draw Event Cards";
      case 2: return "Fellowship Phase";
      case 3: return "Hunt Allocation";
      case 4: return "Action Roll";
      case 5: return "Action Resolution";
      case 6: return "Victory Check";
    } // switch
  } // getPhaseLabel

} // WotrLogComponent
