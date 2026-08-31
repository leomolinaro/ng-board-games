import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { BritAssetsService } from '../brit-assets.service';
import { BritNationId } from '../brit-components.models';
import { BritComponentsService } from '../brit-components.service';
import { BritNationState } from '../brit-game-state.models';

interface BritUnitNode {
  imageSource: string;
  available: number;
  total: number;
}

@Component({
  selector: 'brit-nation-card-sheet',
  template: `
    <img
      class="brit-nation-card"
      [src]="nationCardImageSource"
    />
    <div class="brit-nation-units">
      @for (unitNode of unitNodes; track unitNode) {
        <div class="brit-nation-unit">
          <img
            class="brit-nation-unit-image"
            [src]="unitNode.imageSource"
          />
          <span class="brit-nation-unit-quantity"
            >{{ unitNode.available }} / {{ unitNode.total }}</span
          >
        </div>
      }
    </div>
  `,
  styles: [
    `
      @use 'bg-variables' as *;
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        .brit-nation-card {
          max-width: 500px;
          min-width: 30vw;
          height: auto;
        }
        .brit-nation-units {
          @include golden-padding(10px);
          display: flex;
          justify-content: space-evenly;
          height: 75px;
          overflow: hidden;
          .brit-nation-unit {
            position: relative;
            .brit-nation-unit-image {
              height: 100%;
            }
            .brit-nation-unit-quantity {
              position: absolute;
              bottom: 0;
              right: 0;
            }
          }
        }
      }
    `,
  ],
})
export class BritNationCardSheet implements OnInit {
  private readonly context =
    injectContext<TuiDialogContext<void, [BritNationId, BritNationState]>>();
  data = this.context.data;
  private assetsService = inject(BritAssetsService);
  private components = inject(BritComponentsService);
  private cd = inject(ChangeDetectorRef);

  nationCardImageSource!: string;
  unitNodes!: BritUnitNode[];

  ngOnInit() {
    this.refresh(this.data[0], this.data[1]);
  }

  setNation(nationId: BritNationId, nationState: BritNationState) {
    this.refresh(nationId, nationState);
    this.cd.markForCheck();
  }

  private refresh(nationId: BritNationId, nationState: BritNationState) {
    const nation = this.components.NATION[nationId];
    this.nationCardImageSource = this.assetsService.getNationCardImageSource(
      nation.id,
    );
    this.unitNodes = [];
    if (nation.nInfantries) {
      this.unitNodes.push({
        imageSource: this.assetsService.getUnitImageSourceByType(
          'infantry',
          nation.id,
        ),
        total: nation.nInfantries,
        available: nationState.nInfantries,
      });
    }
    if (nation.nCavalries) {
      this.unitNodes.push({
        imageSource: this.assetsService.getUnitImageSourceByType(
          'cavalry',
          nation.id,
        ),
        total: nation.nCavalries,
        available: nationState.nCavalries,
      });
    }
    if (nation.nBuildings) {
      this.unitNodes.push({
        imageSource: this.assetsService.getUnitImageSourceByType(
          nation.id === 'romans' ? 'roman-fort' : 'saxon-buhr',
          nation.id,
        ),
        total: nation.nBuildings,
        available: nationState.nBuildings,
      });
    }
    for (const leader of nation.leaderIds) {
      this.unitNodes.push({
        imageSource: this.assetsService.getUnitImageSourceByType(
          'leader',
          nation.id,
          leader,
        ),
        total: 1,
        available: 1,
      });
    }
  }
}
