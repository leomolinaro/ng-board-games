import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input, OnChanges, inject } from "@angular/core";
import { SimpleChanges } from "@leobg/commons/utils";
import { BaronyGameStore } from "../barony-game/barony-game.store";
import {
  BaronyColor,
  BaronyLand,
  BaronyLandCoordinates,
  BaronyLog,
  BaronyPawnType,
  BaronyPlayer
} from "../barony-models";

interface BaronyLogStringFragment {
  type: "string";
  label: string;
} // BaronyLogStringFragment

interface BaronyLogPlayerFragment {
  type: "player";
  label: string;
  player: BaronyPlayer;
} // BaronyLogStringFragment

interface BaronyLogLandFragment {
  type: "land";
  label: string;
  land: BaronyLand;
} // BaronyLogLandFragment

interface BaronyLogPawnFragment {
  type: "pawn";
  label: string;
  pawn: BaronyPawnType;
} // BaronyLogPawnFragment

type BaronyLogFragment =
  | BaronyLogStringFragment
  | BaronyLogPlayerFragment
  | BaronyLogLandFragment
  | BaronyLogPawnFragment;

@Component({
  selector: "barony-log",
  template: `
    <div
      class="b-log"
      [ngClass]="{
        'b-log-title': log.type === 'setup' || log.type === 'turn'
      }">
      @for (fragment of fragments; track fragment) { @switch (fragment.type) { @case ('string') {
      <span>{{ fragment.label }}</span>
      } @case ('player') {
      <a [ngClass]="'is-' + $any(fragment).player.color">{{ fragment.label }}</a>
      } @case ('land') {
      <a [ngClass]="'is-' + $any(fragment).land.type">{{ fragment.label }}</a>
      } @case ('pawn') {
      <a>{{ fragment.label }}</a>
      } } }
    </div>
  `,
  styles: [
    `
      @import "barony-variables";

      .b-log {
        &.b-log-title {
          font-size: 120%;
        }
        &:not(.b-log-title) {
          margin-left: 1vw;
        }

        .is-red {
          color: $red;
        }
        .is-blue {
          color: $blue;
        }
        .is-yellow {
          color: $yellow;
        }
        .is-green {
          color: $green;
        }

        .is-mountain {
          color: $color-mountain;
        }
        .is-lake {
          color: $color-lake;
        }
        .is-forest {
          color: $color-forest;
        }
        .is-plain {
          color: $color-plain;
        }
        .is-fields {
          color: $color-fields;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass]
})
export class BaronyLogComponent implements OnChanges {
  private game = inject(BaronyGameStore);

  @Input() log!: BaronyLog;

  fragments!: BaronyLogFragment[];

  ngOnChanges(changes: SimpleChanges<BaronyLogComponent>) {
    if (changes.log) {
      const l = this.log;
      switch (l.type) {
        case "setup":
          this.fragments = [this.string("Setup")];
          break;
        case "turn":
          this.fragments = [this.player(l.player), this.string("'s turn")];
          break;
        case "recruitment":
          this.fragments = [
            this.player(l.player),
            this.string(" recruits a knight in "),
            this.land(l.land),
            this.string(".")
          ];
          break;
        case "movement":
          this.fragments = [
            this.player(l.player),
            this.string(" moves a knight from "),
            this.land(l.movement.fromLand),
            this.string(" to "),
            this.land(l.movement.toLand),
            this.string(".")
          ];
          break;
        case "construction":
          this.fragments = [
            this.player(l.player),
            this.string(" builds a "),
            this.pawn(l.construction.building),
            this.string(" in "),
            this.land(l.construction.land),
            this.string(".")
          ];
          break;
        case "expedition":
          this.fragments = [
            this.player(l.player),
            this.string(" makes an expedition to "),
            this.land(l.land),
            this.string(".")
          ];
          break;
        case "newCity":
          this.fragments = [
            this.player(l.player),
            this.string(" builds a new city in "),
            this.land(l.land),
            this.string(".")
          ];
          break;
        case "nobleTitle":
          this.fragments = [this.player(l.player), this.string(" earns a new noble title.")];
          break;
        case "setupPlacement":
          this.fragments = [
            this.player(l.player),
            this.string(" places a knight in "),
            this.land(l.land),
            this.string(".")
          ];
          break;
      } // switch
    } // if
  } // ngOnChanges

  private string(label: string): BaronyLogStringFragment {
    return { type: "string", label: label };
  } // string

  private player(playerId: BaronyColor): BaronyLogPlayerFragment {
    const player = this.game.getPlayer(playerId);
    return { type: "player", label: player.name, player: player };
  } // player

  private land(landId: BaronyLandCoordinates): BaronyLogLandFragment {
    const land = this.game.getLand(landId);
    let label: string = "";
    switch (land.type) {
      case "fields":
        label = "fields";
        break;
      case "plain":
        label = "plain";
        break;
      case "mountain":
        label = "mountain";
        break;
      case "forest":
        label = "forest";
        break;
      case "lake":
        label = "lake";
        break;
    } // switch
    return {
      type: "land",
      label: label,
      land: land
    };
  } // land

  private pawn(pawnType: BaronyPawnType): BaronyLogPawnFragment {
    let label: string;
    switch (pawnType) {
      case "city":
        label = "city";
        break;
      case "knight":
        label = "knight";
        break;
      case "stronghold":
        label = "stronghold";
        break;
      case "village":
        label = "village";
        break;
    } // switch
    return {
      type: "pawn",
      label: label,
      pawn: pawnType
    };
  } // pawn
} // BaronyLogComponent
