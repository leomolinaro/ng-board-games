import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { BgFieldConfig } from "../../form";
import { BgArcheoGame } from "../bg-proto-game.service";

@Component ({
  selector: "bg-home-archeo-game-form",
  template: `
    <ng-container [bgForm]="game" (bgFormChange)="onGameChange ($event)">
      <mat-form-field class="bg-game-name-field">
        <mat-label>Game name</mat-label>
        <input bgField="name" matInput required autocomplete="off" />
      </mat-form-field>
      <mat-radio-group
        class="bg-archeo-game-type-radio"
        bgField
        [bgFieldConfig]="typeConfig">
        <mat-radio-button value="local">Local</mat-radio-button>
        <mat-radio-button value="online">Online</mat-radio-button>
      </mat-radio-group>
    </ng-container>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      > * {
        margin-bottom: 1rem;
      }
      .bg-archeo-game-type-radio {
        display: flex;
        flex-direction: column;
        > * {
          margin-bottom: 1rem;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BgHomeArcheoGameFormComponent {

  constructor (private cd: ChangeDetectorRef) {}

  @Input () game!: BgArcheoGame;
  @Output () gameChange = new EventEmitter<BgArcheoGame> ();

  typeConfig: BgFieldConfig<"local" | "online", BgArcheoGame> = {
    valueGetter: (g) => (g.online ? "online" : "local"),
    valueSetter: (value, g) => ({ online: value === "online" }),
  };

  onGameChange (newGame: BgArcheoGame) {
    this.game = newGame;
    this.gameChange.emit (newGame);
  } // onGameChange

  clearForm () {
    this.game = {
      name: "",
      online: false,
    };
    setTimeout (() => this.cd.markForCheck ());
  } // clearForm
} // BgHomeArcheoGameFormComponent
