import { ChangeDetectionStrategy, Component, Input, OnChanges } from "@angular/core";
import { SimpleChanges } from "@bg-utils";
import { BritArea, BritAreaId, BritPhase } from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import { BritLog, BritPlayer } from "../brit-game-state.models";

interface BritLogStringFragment {
  type: "string";
  label: string;
} // BritLogStringFragment

interface BritLogPlayerFragment {
  type: "player";
  label: string;
  player: BritPlayer;
} // BritLogStringFragment

interface BritLogAreaFragment {
  type: "area";
  label: string;
  area: BritArea;
} // BritLogAreaFragment

// interface BritLogPawnFragment {
//   type: "pawn";
//   label: string;
//   pawn: BritPawnType;
// } // BritLogPawnFragment

type BritLogFragment = BritLogStringFragment | BritLogPlayerFragment | BritLogAreaFragment/*  | BritLogLandFragment | BritLogPawnFragment */;

@Component ({
  selector: "brit-log",
  template: `
    <div
      class="brit-log"
      [ngClass]="{
        'brit-log-h0': log.type === 'setup' || log.type === 'round',
        'brit-log-h1': log.type === 'nation-turn',
        'brit-log-h2': log.type === 'phase'
      }">
      <ng-container *ngFor="let fragment of fragments" [ngSwitch]="fragment.type">
        <span *ngSwitchCase="'string'">{{ fragment.label }}</span>
        <span *ngSwitchCase="'area'">{{ fragment.label }}</span>
        <!-- <a *ngSwitchCase="'player'" [ngClass]="'is-' + $any (fragment).player.color">{{ fragment.label }}</a>
        <a *ngSwitchCase="'land'" [ngClass]="'is-' + $any (fragment).land.type">{{ fragment.label }}</a>
        <a *ngSwitchCase="'pawn'">{{ fragment.label }}</a> -->
      </ng-container>
    </div>
  `,
  styles: [`
    @import "brit-variables";

    .brit-log {
      margin-left: 1.5vw;

      &.brit-log-h0 {
        font-size: 130%;
        margin-left: 0;
      }
      &.brit-log-h1 {
        font-size: 120%;
        margin-left: 0.5vw;
      }
      &.brit-log-h2 {
        font-size: 110%;
        margin-left: 1vw;
      }

      .is-red { color: $red; }
      .is-blue { color: $blue; }
      .is-yellow { color: $yellow; }
      .is-green { color: $green; }

    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritLogComponent implements OnChanges {

  constructor (
    private components: BritComponentsService
  ) { }

  @Input () log!: BritLog;

  fragments!: BritLogFragment[];

  ngOnChanges (changes: SimpleChanges<BritLogComponent>) {
    if (changes.log) {
      const l = this.log;
      switch (l.type) {
        case "setup": this.fragments = [this.string ("Setup")]; break;
        case "round": this.fragments = [this.string (`Round ${l.roundId}`)]; break;
        case "nation-turn": this.fragments = [this.string (this.components.NATION[l.nationId].label)]; break;
        case "phase": this.fragments = [this.string (this.getPhaseLabel (l.phase))]; break;
        case "population-marker-set": this.fragments = [this.string (`Population marker ${l.populationMarker == null ? "unset" : `set to ${l.populationMarker}`}`)]; break;
        case "infantry-placement": this.fragments = [this.string (`${l.quantity} infantr${l.quantity === 1 ? "y" : "ies"} placed in `), this.area (l.landId)]; break;
        case "infantry-reinforcement": this.fragments = [this.string (`${l.quantity} infantry reinforcement${l.quantity === 1 ? "" : "s"} in `), this.area (l.areaId)]; break;
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

  private string (label: string): BritLogStringFragment {
    return {
      type: "string",
      label: label
    };
  } // string

  private area (areaId: BritAreaId): BritLogAreaFragment {
    const area = this.components.AREA[areaId];
    return {
      type: "area",
      label: area.name,
      area
    };
  } // area

  // private player (playerId: string): BritLogPlayerFragment {
  //   const player = this.game.getPlayer (playerId);
  //   return {
  //     type: "player",
  //     label: player.name,
  //     player: player
  //   };
  // } // player

  // private land (landId: BritLandCoordinates): BritLogLandFragment {
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

  // private pawn (pawnType: BritPawnType): BritLogPawnFragment {
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

  private getPhaseLabel (phase: BritPhase): string {
    switch (phase) {
      case "populationIncrease": return "Population Increase";
      case "movement": return "Movement";
      case "battlesRetreats": return "Battles / Retreats";
      case "raiderWithdrawal": return "Raider Withdrawal";
      case "overpopulation": return "Overpopulation";
    } // switch
  } // getPhaseLabel

} // BritLogComponent
