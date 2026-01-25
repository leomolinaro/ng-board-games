import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild
} from "@angular/core";
import { MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import { MatTooltip } from "@angular/material/tooltip";
import { BgTransformFn, BgTransformPipe, arrayUtil } from "@leobg/commons/utils";
import { WotrAssetsStore } from "../assets/wotr-assets-store";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCharacter, WotrCharacterId } from "../character/wotr-character-models";
import { WotrGameUi } from "../game/wotr-game-ui";
import {
  WotrArmyUnitType,
  WotrGenericUnitType,
  WotrNation,
  WotrNationId
} from "../nation/wotr-nation-models";
import { WotrFront } from "./wotr-front-models";

interface ValidUnits {
  regulars: boolean;
  elites: boolean;
  leaders: boolean;
  nazgul: boolean;
}

function initValidUnits(): ValidUnits {
  return {
    regulars: false,
    elites: false,
    leaders: false,
    nazgul: false
  };
}

@Component({
  selector: "wotr-front-area",
  imports: [MatTabsModule, BgTransformPipe, MatTooltip],
  template: `
    <mat-tab-group [selectedIndex]="selectedTabIndex()">
      <mat-tab label="Cards">
        <div class="cards">
          @for (card of sortedHandCards(); track card) {
            <img
              class="card-preview-image"
              [src]="card | bgTransform: cardPreviewImage"
              (click)="cardClick.emit(card)" />
          }
        </div>
      </mat-tab>
      <mat-tab label="Reinforcements">
        <div class="reinforcements">
          @for (nation of nations(); track nation.id) {
            @let validUnits = reinforcementUnitSelection()?.[nation.id];
            @for (i of nation.reinforcements.regular | bgTransform: range; track i) {
              <img
                class="reinforcement-unit"
                [class]="{
                  disabled: validUnits && !validUnits.regulars,
                  selectable: validUnits && validUnits.regulars
                }"
                [src]="nation.id | bgTransform: armyUnitImage : 'regular'"
                [matTooltip]="nation.regularLabel"
                (click)="onReinforcementUnitSelect('regular', nation.id)" />
            }
            @for (i of nation.reinforcements.elite | bgTransform: range; track i) {
              <img
                class="reinforcement-unit"
                [class]="{
                  disabled: validUnits && !validUnits.elites,
                  selectable: validUnits && validUnits.elites
                }"
                [src]="nation.id | bgTransform: armyUnitImage : 'elite'"
                [matTooltip]="nation.eliteLabel"
                (click)="onReinforcementUnitSelect('elite', nation.id)" />
            }
            @for (i of nation.reinforcements.leader | bgTransform: range; track i) {
              <img
                class="reinforcement-unit"
                [class]="{
                  disabled: validUnits && !validUnits.leaders,
                  selectable: validUnits && validUnits.leaders
                }"
                [src]="nation.id | bgTransform: leaderImage"
                [matTooltip]="nation.leaderLabel"
                (click)="onReinforcementUnitSelect('leader', nation.id)" />
            }
            @for (i of nation.reinforcements.nazgul | bgTransform: range; track i) {
              <img
                class="reinforcement-unit"
                [class]="{
                  disabled: validUnits && !validUnits.nazgul,
                  selectable: validUnits && validUnits.nazgul
                }"
                [src]="nation.id | bgTransform: nazgulImage"
                matTooltip="Nazgul"
                (click)="onReinforcementUnitSelect('nazgul', nation.id)" />
            }
          }
          @for (character of frontCharacters(); track character.id) {
            @if (character.status === "available") {
              <img
                [src]="character.id | bgTransform: characterImage"
                [matTooltip]="character.name" />
            }
          }
        </div>
      </mat-tab>
      <mat-tab label="Casualties">
        <div class="casualties">
          @for (nation of nations(); track nation.id) {
            @for (i of nation.casualties.regular | bgTransform: range; track i) {
              <img
                [src]="nation.id | bgTransform: armyUnitImage : 'regular'"
                [matTooltip]="nation.regularLabel" />
            }
            @for (i of nation.casualties.elite | bgTransform: range; track i) {
              <img
                [src]="nation.id | bgTransform: armyUnitImage : 'elite'"
                [matTooltip]="nation.eliteLabel" />
            }
            @for (i of nation.casualties.leader | bgTransform: range; track i) {
              <img
                [src]="nation.id | bgTransform: leaderImage"
                [matTooltip]="nation.leaderLabel" />
            }
          }
          @for (character of frontCharacters(); track character.id) {
            @if (character.status === "eliminated") {
              <img
                [src]="character.id | bgTransform: characterImage"
                [matTooltip]="character.name" />
            }
          }
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [
    `
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
            display: none;
          }
        }
      }

      .reinforcement-unit {
        &.selectable {
          cursor: pointer;
        }
        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrFrontArea {
  protected assets = inject(WotrAssetsStore);
  protected ui = inject(WotrGameUi);

  front = input.required<WotrFront>();
  nations = input.required<WotrNation[]>();
  characters = input<WotrCharacter[]>();
  frontCharacters = computed(() => {
    const front = this.front();
    return this.characters()?.filter(c => c.front === front.id);
  });

  cardClick = output<WotrCardId>();

  protected tabGroup = viewChild(MatTabGroup);

  private handCards = computed(() => this.front().handCards);
  protected sortedHandCards = computed(() => {
    const cards = this.handCards().slice();
    cards.sort((a, b) => a.localeCompare(b));
    return cards;
  });

  protected cardPreviewImage: BgTransformFn<WotrCardId, string> = cardId =>
    this.assets.cardPreviewImage(cardId);
  protected armyUnitImage: BgTransformFn<WotrNationId, string, WotrArmyUnitType> = (
    nationId,
    type
  ) => this.assets.armyUnitImage(type, nationId).source;
  protected leaderImage: BgTransformFn<WotrNationId, string> = nationId =>
    this.assets.leaderImage(nationId).source;
  protected nazgulImage: BgTransformFn<void, string> = () => this.assets.nazgulImage().source;
  protected characterImage: BgTransformFn<WotrCharacterId, string> = characterId =>
    this.assets.characterImage(characterId).source;
  protected range: BgTransformFn<number, number[]> = n => arrayUtil.range(n);

  protected selectedTabIndex = signal<number>(0);
  private focusReinforcements = effect(() => {
    const reinforcementUnitSelection = this.ui.reinforcementUnitSelection();
    if (!reinforcementUnitSelection) return;
    if (reinforcementUnitSelection.frontId !== this.front().id) return;
    this.selectedTabIndex.set(1);
  });

  private focusCards = effect(() => {
    const cardSelection = this.ui.handCardSelection();
    if (!cardSelection) return;
    if (cardSelection.frontId !== this.front().id) return;
    this.selectedTabIndex.set(0);
  });

  protected reinforcementUnitSelection = computed<Record<WotrNationId, ValidUnits> | null>(() => {
    const reinforcementUnitSelection = this.ui.reinforcementUnitSelection();
    if (!reinforcementUnitSelection) return null;
    const validUnitsByNation: Record<WotrNationId, ValidUnits> = {
      dwarves: initValidUnits(),
      elves: initValidUnits(),
      gondor: initValidUnits(),
      rohan: initValidUnits(),
      isengard: initValidUnits(),
      southrons: initValidUnits(),
      sauron: initValidUnits(),
      north: initValidUnits()
    };
    for (const u of reinforcementUnitSelection.units) {
      const validUnits = validUnitsByNation[u.nation];
      switch (u.type) {
        case "regular":
          validUnits.regulars = true;
          break;
        case "elite":
          validUnits.elites = true;
          break;
        case "leader":
          validUnits.leaders = true;
          break;
        case "nazgul":
          validUnits.nazgul = true;
          break;
      }
    }
    return validUnitsByNation;
  });

  onReinforcementUnitSelect(type: WotrGenericUnitType, nationId: WotrNationId) {
    const reinforcementUnitSelection = this.ui.reinforcementUnitSelection();
    if (!reinforcementUnitSelection) return;
    if (!reinforcementUnitSelection.units.some(u => u.nation === nationId && u.type === type))
      return;
    this.ui.reinforcementUnit.emit({
      nation: nationId,
      type
    });
  }
}
