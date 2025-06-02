import { NgIf, NgSwitch, NgSwitchCase } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { MatFabButton } from "@angular/material/button";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { BooleanInput } from "@leobg/commons/utils";
import { BgTransformPipe } from "../../../../utils/src/lib/bg-transform.pipe";
import { BgAuthService, BgUser } from "../../authentication";
import { BgCheckboxFieldDirective, BgFormDirective, BgInputFieldDirective } from "../../form/bg-form.directive";
import { BgProtoPlayer, BgProtoPlayerType } from "../bg-proto-game.service";

@Component({
  selector: "bg-home-player-form",
  template: `
    <ng-container
      [bgForm]="player"
      (bgFormChange)="onPlayerChange($event)">
      <div class="bg-player-type">
        <div class="bg-player-type-button-container">
          <button
            class="bg-player-type-button"
            [disabled]="!(player.type === 'open' || isOwner || isPlayer)"
            mat-fab
            (click)="onNextPlayerType()">
            <ng-container [ngSwitch]="player.type">
              <mat-icon *ngSwitchCase="'closed'">no_accounts</mat-icon>
              <mat-icon *ngSwitchCase="'user'">person_pin</mat-icon>
              <mat-icon *ngSwitchCase="'ai'">monitor</mat-icon>
              <mat-icon *ngSwitchCase="'open'">cloud</mat-icon>
            </ng-container>
          </button>
        </div>
        <div
          [ngSwitch]="player.type"
          class="bg-player-type-caption-container">
          <span
            *ngSwitchCase="'closed'"
            class="mat-caption bg-player-type-caption"
            >closed</span
          >
          <span
            *ngSwitchCase="'user'"
            class="mat-caption bg-player-type-caption"
            >{{ isPlayer ? "me" : "other" }}</span
          >
          <span
            *ngSwitchCase="'ai'"
            class="mat-caption bg-player-type-caption"
            >AI</span
          >
          <span
            *ngSwitchCase="'open'"
            class="mat-caption bg-player-type-caption"
            >open</span
          >
        </div>
      </div>
      <ng-container *ngIf="player.type === 'user' || player.type === 'ai'; else notPlayer">
        <mat-form-field class="bg-player-name">
          <mat-label>Player name</mat-label>
          <input
            bgField="name"
            matInput
            [required]="player | bgTransform: playerNameActive"
            [disabled]="!(player | bgTransform: playerNameActive)"
            autocomplete="off" />
        </mat-form-field>
        <div
          *ngIf="onlineGame"
          class="bg-player-ready">
          <mat-checkbox
            *ngIf="player.type === 'user'"
            [disabled]="!isPlayer"
            bgField="ready"
            >Ready</mat-checkbox
          >
        </div>
      </ng-container>
      <ng-template #notPlayer>
        <div class="bg-player-name"></div>
        <div
          *ngIf="onlineGame"
          class="bg-player-ready"></div>
      </ng-template>
    </ng-container>
  `,
  styles: [
    `
      :host {
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        .bg-player-type {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          .bg-player-type-button-container {
            flex: 1;
            text-align: end;
            .bg-player-type-button {
              /* justify-self: end; */
              .s-new-players-color-icon {
                visibility: hidden;
              }
              &.mat-button-disabled {
                color: grey;
              }
            }
          }
          .bg-player-type-caption-container {
            flex: 1;
            text-align: start;
            .bg-player-type-caption {
              margin-left: 5px;
              font-style: italic;
              /* justify-self: start; */
            }
          }
        }
        .bg-player-name {
          flex: 2;
        }
        .bg-player-ready {
          flex: 1;
          text-align: center;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BgFormDirective,
    MatFabButton,
    NgSwitch,
    NgSwitchCase,
    MatIcon,
    NgIf,
    MatFormField,
    MatLabel,
    BgInputFieldDirective,
    MatInput,
    MatCheckbox,
    BgCheckboxFieldDirective,
    BgTransformPipe
  ]
})
export class BgHomePlayerFormComponent {
  private authService = inject(BgAuthService);

  @Input() onlineGame!: boolean;
  @Input() player!: BgProtoPlayer;
  @Input() @BooleanInput() isOwner!: boolean;
  @Input() @BooleanInput() isPlayer!: boolean;

  @Output() playerChange = new EventEmitter<BgProtoPlayer>();

  playerNameActive = (player: BgProtoPlayer) => {
    return (player.type === "ai" && this.isOwner) || this.isPlayer;
  }; // playerNameActive

  onPlayerChange(player: BgProtoPlayer) {
    this.playerChange.next(player);
  } // onPlayerChange

  onNextPlayerType() {
    const controllerPatch: { controller?: BgUser | null } = {};
    const namePatch: { name?: string | "" } = {};
    const readyPatch: { ready?: boolean } = {};
    const nextPlayerType = this.getNextPlayerType(this.player.type);
    switch (nextPlayerType) {
      case "user": {
        controllerPatch.controller = this.authService.getUser();
        namePatch.name = this.authService.getUser().displayName;
        if (!this.onlineGame) {
          readyPatch.ready = true;
        }
        break;
      } // case
      case "closed": {
        controllerPatch.controller = null;
        namePatch.name = "";
        readyPatch.ready = false;
        break;
      } // case
      case "open": {
        controllerPatch.controller = null;
        namePatch.name = "";
        readyPatch.ready = false;
        break;
      } // case
      case "ai": {
        controllerPatch.controller = null;
        namePatch.name = "AI";
        readyPatch.ready = true;
        break;
      } // case
    } // switch
    this.playerChange.next({
      ...this.player,
      type: nextPlayerType,
      ...controllerPatch,
      ...namePatch,
      ...readyPatch
    });
  } // onNextPlayerType

  private getNextPlayerType(currentType: BgProtoPlayerType): BgProtoPlayerType {
    if (this.isOwner) {
      switch (currentType) {
        case "closed":
          return "user";
        case "user":
          return this.onlineGame ? "open" : "ai";
        case "open":
          return "ai";
        case "ai":
          return "closed";
      } // switch
    } else {
      switch (currentType) {
        case "closed":
          return "closed";
        case "user":
          return "open";
        case "open":
          return "user";
        case "ai":
          return "ai";
      } // switch
    } // if - else
  } // getNextPlayerType
} // BgHomePlayerFormComponent
