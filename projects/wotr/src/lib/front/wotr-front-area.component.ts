import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Output, computed, inject, input } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltip } from "@angular/material/tooltip";
import { BgTransformFn, BgTransformPipe, arrayUtil } from "@leobg/commons/utils";
import { WotrAssetsService } from "../assets/wotr-assets.service";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrCharacter, WotrCharacterId } from "../companion/wotr-character.models";
import { WotrMapComponent } from "../game/board/map/wotr-map.component";
import { WotrLogsComponent } from "../log/wotr-logs.component";
import { WotrArmyUnitType, WotrNation, WotrNationId } from "../nation/wotr-nation.models";
import { WotrFront } from "./wotr-front.models";

@Component ({
  selector: "wotr-front-area",
  standalone: true,
  imports: [NgIf, WotrMapComponent, MatTabsModule, WotrLogsComponent, BgTransformPipe, MatTooltip],
  template: `
    <mat-tab-group>
      <mat-tab label="Cards">
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
          @for (character of frontCharacters (); track character.id) {
            @if (character.status === "available") {
              <img [src]="character.id | bgTransform:characterImage" [matTooltip]="character.name"/>
            }
          }
        </div>
      </mat-tab>
      <mat-tab label="Casualties">
      <div class="casualties">
          @for (nation of nations (); track nation.id) {
            @for (i of (nation.casualties.regular | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:armyUnitImage:'regular'" [matTooltip]="nation.regularLabel"/>
            }
            @for (i of (nation.casualties.elite | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:armyUnitImage:'elite'" [matTooltip]="nation.eliteLabel"/>
            }
            @for (i of (nation.casualties.leader | bgTransform:range); track i) {
              <img [src]="nation.id | bgTransform:leaderImage" [matTooltip]="nation.leaderLabel"/>
            }
          }
          @for (character of frontCharacters (); track character.id) {
            @if (character.status === "eliminated") {
              <img [src]="character.id | bgTransform:characterImage" [matTooltip]="character.name"/>
            }
          }
        </div>
      </mat-tab>
    </mat-tab-group>
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
          display: none
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrFrontAreaComponent {

  protected assets = inject (WotrAssetsService);

  front = input.required<WotrFront> ();
  nations = input.required<WotrNation[]> ();
  characters = input<WotrCharacter[]> ();
  frontCharacters = computed (() => {
    const front = this.front ();
    return this.characters ()?.filter (c => c.front === front.id);
  });

  @Output () cardClick = new EventEmitter<WotrCardId> ();

  protected handCards = computed (() => this.front ().handCards);

  protected cardPreviewImage: BgTransformFn<WotrCardId, string> = cardId => this.assets.getCardPreviewImage (cardId);
  protected armyUnitImage: BgTransformFn<WotrNationId, string, WotrArmyUnitType> = (nationId, type) => this.assets.getArmyUnitImage (type, nationId).source;
  protected leaderImage: BgTransformFn<WotrNationId, string> = nationId => this.assets.getLeaderImage (nationId).source;
  protected nazgulImage: BgTransformFn<void, string> = () => this.assets.getNazgulImage ().source;
  protected characterImage: BgTransformFn<WotrCharacterId, string> = characterId => this.assets.getCharacterImage (characterId).source;
  protected range: BgTransformFn<number, number[]> = n => arrayUtil.range (n);

}
