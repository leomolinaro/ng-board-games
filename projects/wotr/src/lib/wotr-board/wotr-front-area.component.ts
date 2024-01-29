import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, inject, input } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltip } from "@angular/material/tooltip";
import { BgTransformFn, BgTransformPipe, arrayUtil } from "@leobg/commons/utils";
import { WotrAssetsService } from "../wotr-assets.service";
import { WotrCardId, isCharacterCard, isStrategyCard } from "../wotr-elements/wotr-card.models";
import { WotrCompanion, WotrCompanionId } from "../wotr-elements/wotr-companion.models";
import { WotrActionDie } from "../wotr-elements/wotr-dice.models";
import { WotrFront } from "../wotr-elements/wotr-front.models";
import { WotrMinion, WotrMinionId } from "../wotr-elements/wotr-minion.models";
import { WotrArmyUnitType, WotrNation, WotrNationId } from "../wotr-elements/wotr-nation.models";
import { WotrLogsComponent } from "./wotr-logs.component";
import { WotrMapComponent } from "./wotr-map/wotr-map.component";

@Component ({
  selector: "wotr-front-area",
  standalone: true,
  imports: [NgIf, WotrMapComponent, MatTabsModule, WotrLogsComponent, BgTransformPipe, MatTooltip],
  template: `
    <mat-tab-group>
      <mat-tab [label]="'Cards ' + nChaCards () + ' / ' + nStrCards ()">
        <div class="cards">
          @for (card of handCards (); track card) {
            <img class="card-preview-image"
              [src]="card | bgTransform:cardPreviewImage"
              (click)="cardClick.next (card)"/>
          }
        </div>
      </mat-tab>
      <mat-tab label="Reinforcements">
        <div class="reinforcements">
          @for (nation of nations (); track nation.id) {
            @for (i of (nation.reinforcements.regular | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:armyUnitImage:'regular'" [matTooltip]="nation.regularLabel"/>
            }
            @for (i of (nation.reinforcements.elite | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:armyUnitImage:'elite'" [matTooltip]="nation.eliteLabel"/>
            }
            @for (i of (nation.reinforcements.leader | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:leaderImage" [matTooltip]="nation.leaderLabel"/>
            }
            @for (i of (nation.reinforcements.nazgul | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:nazgulImage" matTooltip="Nazgul"/>
            }
          }
          @for (companion of companions (); track companion.id) {
            @if (companion.status === "available") {
              <img [src]="companion.id | bgTransform:companionImage" [matTooltip]="companion.name"/>
            }
          }
          @for (minion of minions (); track minion.id) {
            @if (minion.status === "available") {
              <img [src]="minion.id | bgTransform:minionImage" [matTooltip]="minion.name"/>
            }
          }
        </div>
      </mat-tab>
      <mat-tab label="Casualties">
      <div class="casualties">
          @for (nation of nations (); track nation.id) {
            @for (i of (nation.reinforcements.regular | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:armyUnitImage:'regular'" [matTooltip]="nation.regularLabel"/>
            }
            @for (i of (nation.reinforcements.elite | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:armyUnitImage:'elite'" [matTooltip]="nation.eliteLabel"/>
            }
            @for (i of (nation.reinforcements.leader | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:leaderImage" [matTooltip]="nation.leaderLabel"/>
            }
          }
          @for (companion of companions (); track companion.id) {
            @if (companion.status === "eliminated") {
              <img [src]="companion.id | bgTransform:companionImage" [matTooltip]="companion.name"/>
            }
          }
          @for (minion of minions (); track minion.id) {
            @if (minion.status === "eliminated") {
              <img [src]="minion.id | bgTransform:minionImage" [matTooltip]="minion.name"/>
            }
          }
        </div>
      </mat-tab>
    </mat-tab-group>
    
    <div class="action-dice">
      @for (actionDie of front ().actionDice; track actionDie) {
        <img [src]="actionDie | bgTransform:actionDieImage"/>
      }
    </div>
  `,
  styles: [`
    $color: var(--wotr-front-color);

    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }
    .cards {
      margin-top: 5px;
      .card-preview-image {
        cursor: pointer;
        &:not(:last-child) {
          margin-right: 5px;
        }
      }
    }

    mat-tab-group {
      overflow: auto;
      ::ng-deep {
        .mat-mdc-tab-header {
          --mdc-secondary-navigation-tab-container-height: 25px;
        }
        .mat-mdc-tab.mdc-tab--active .mdc-tab__text-label {
          color: var(--wotr-front-color);
        }
        .mat-mdc-tab .mdc-tab-indicator__content--underline {
          border-color: var(--wotr-front-color) !important;
        }
        // .mat-mdc-tab.mdc-tab--active:hover .mdc-tab-indicator__content--underline {
        //   border-color: var(--wotr-front-color)!;
        // }
      }
    }
    .action-dice {
      padding-top: 10px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrFrontAreaComponent {

  protected assets = inject (WotrAssetsService);

  front = input.required<WotrFront> ();
  nations = input.required<WotrNation[]> ();
  companions = input<WotrCompanion[]> ();
  minions = input<WotrMinion[]> ();

  @Output () cardClick = new EventEmitter<WotrCardId> ();

  protected handCards = computed (() => this.front ().handCards);
  protected nChaCards = computed (() => this.handCards ().reduce ((count, card) => isCharacterCard (card) ? (count + 1) : count, 0));
  protected nStrCards = computed (() => this.handCards ().reduce ((count, card) => isStrategyCard (card) ? (count + 1) : count, 0));

  protected cardPreviewImage: BgTransformFn<WotrCardId, string> = cardId => this.assets.getCardPreviewImage (cardId);
  protected armyUnitImage: BgTransformFn<WotrNationId, string, WotrArmyUnitType> = (nationId, type) => this.assets.getArmyUnitImage (type, nationId).source;
  protected leaderImage: BgTransformFn<WotrNationId, string> = nationId => this.assets.getLeaderImage (nationId).source;
  protected nazgulImage: BgTransformFn<void, string> = () => this.assets.getNazgulImage ().source;
  protected nazgulTooltip: BgTransformFn<void, string> = () => "Nazgul";
  protected companionImage: BgTransformFn<WotrCompanionId, string> = companionId => this.assets.getCompanionImage (companionId).source;
  protected minionImage: BgTransformFn<WotrMinionId, string> = minionId => this.assets.getMinionImage (minionId).source;
  protected actionDieImage: BgTransformFn<WotrActionDie, string> = actionDie => this.assets.getActionDieImage (actionDie, this.front ().id);
  protected range: BgTransformFn<number, number[]> = n => arrayUtil.range (n);

}
