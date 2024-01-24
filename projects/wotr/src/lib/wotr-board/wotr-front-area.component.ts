import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { BgTransformFn, BgTransformPipe, arrayUtil } from "@leobg/commons/utils";
import { WotrAssetsService } from "../wotr-assets.service";
import { WotrCardId, isCharacterCard, isStrategyCard } from "../wotr-components/card.models";
import { WotrActionDie } from "../wotr-components/dice.models";
import { WotrArmyUnitType, WotrCompanionId, WotrMinionId, WotrNationId } from "../wotr-components/nation.models";
import { WotrCompanionState, WotrFrontState, WotrMinionState, WotrNationState } from "../wotr-game-state.models";
import { WotrLogsComponent } from "./wotr-logs.component";
import { WotrMapComponent } from "./wotr-map/wotr-map.component";

@Component ({
  selector: "wotr-front-area",
  standalone: true,
  imports: [NgIf, WotrMapComponent, MatTabsModule, WotrLogsComponent, BgTransformPipe],
  template: `
    <mat-tab-group>
      <mat-tab [label]="'Cards ' + nChaCards () + ' / ' + nStrCards ()">
        <div class="cards">
          @for (card of handCards (); track card) {
            <img [src]="card | bgTransform:cardPreviewImage"/>
          }
        </div>
      </mat-tab>
      <mat-tab label="Reinforcements">
        <div class="reinforcements">
          @for (nation of nations (); track nation.id) {
            @for (i of (nation.reinforcements.regular | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:armyUnitImage:'regular'"/>
            }
            @for (i of (nation.reinforcements.elite | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:armyUnitImage:'elite'"/>
            }
            @for (i of (nation.reinforcements.leader | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:leaderImage"/>
            }
            @for (i of (nation.reinforcements.nazgul | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:nazgulImage"/>
            }
          }
          @for (companion of companions (); track companion.id) {
            @if (companion.status === "available") {
              <img [src]="companion.id | bgTransform:companionImage"/>
            }
          }
          @for (minion of minions (); track minion.id) {
            @if (minion.status === "available") {
              <img [src]="minion.id | bgTransform:minionImage"/>
            }
          }
        </div>
      </mat-tab>
      <mat-tab label="Casualties">
      <div class="casualties">
          @for (nation of nations (); track nation.id) {
            @for (i of (nation.casualties.regular | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:armyUnitImage:'regular'"/>
            }
            @for (i of (nation.casualties.elite | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:armyUnitImage:'elite'"/>
            }
            @for (i of (nation.casualties.leader | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:leaderImage"/>
            }
          }
          @for (companion of companions (); track companion.id) {
            @if (companion.status === "eliminated") {
              <img [src]="companion.id | bgTransform:companionImage"/>
            }
          }
          @for (minion of minions (); track minion.id) {
            @if (minion.status === "eliminated") {
              <img [src]="minion.id | bgTransform:minionImage"/>
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
      img:not(:last-child) {
        margin-right: 5px;
      }
    }

    .mat-mdc-tab-group {
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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrFrontAreaComponent {

  protected assets = inject (WotrAssetsService);

  front = input.required<WotrFrontState> ();
  nations = input.required<WotrNationState[]> ();
  companions = input<WotrCompanionState[]> ();
  minions = input<WotrMinionState[]> ();
  protected handCards = computed (() => this.front ().handCards);
  protected nChaCards = computed (() => this.handCards ().reduce ((count, card) => isCharacterCard (card) ? (count + 1) : count, 0));
  protected nStrCards = computed (() => this.handCards ().reduce ((count, card) => isStrategyCard (card) ? (count + 1) : count, 0));

  protected cardPreviewImage: BgTransformFn<WotrCardId, string> = cardId => this.assets.getCardPreviewImage (cardId);
  protected armyUnitImage: BgTransformFn<WotrNationId, string, WotrArmyUnitType> = (nationId, type) => this.assets.getArmyUnitImage (type, nationId).source;
  protected leaderImage: BgTransformFn<WotrNationId, string> = nationId => this.assets.getLeaderImage (nationId).source;
  protected nazgulImage: BgTransformFn<void, string> = () => this.assets.getNazgulImage ().source;
  protected companionImage: BgTransformFn<WotrCompanionId, string> = companionId => this.assets.getCompanionImage (companionId).source;
  protected minionImage: BgTransformFn<WotrMinionId, string> = minionId => this.assets.getMinionImage (minionId).source;
  protected actionDieImage: BgTransformFn<WotrActionDie, string> = actionDie => this.assets.getActionDieImage (actionDie, this.front ().id);
  protected range: BgTransformFn<number, number[]> = n => arrayUtil.range (n);

} // WotrFrontAreaComponent
