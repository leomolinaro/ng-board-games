import { Component, computed, input, output } from '@angular/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { Dragon } from './tlsm-store';

@Component({
  selector: 'tlsm-dragon-card',
  imports: [TuiCardLarge, TuiHeader, TuiAvatar],
  template: `
    @let d = dragon();
    <div
      tuiCardLarge
      [class.is-crowned]="d.crowned"
      [style.background]="
        'url(' + d.imageSource + ') no-repeat top right / 100%'
      "
    >
      <header tuiHeader>
        <section>
          @for (x of scales(); track $index) {
            <img
              [src]="d.tokenSource"
              [alt]="d.id"
              (click)="scaleDiscard.emit()"
            />
          }
        </section>
        <img
          tuiAvatar
          class="crown"
          [style.visibility]="d.crowned ? 'visible' : 'hidden'"
          src="../assets/talisman/crown-token.png"
          alt="crown"
        />
      </header>
    </div>
  `,
  styles: `
    [tuiCardLarge] {
      height: 100%;
      &.is-crowned {
        border: 4px solid white;
      }
    }

    [tuiHeader] {
      margin-top: 0 !important;
    }

    [tuiAvatar] {
      width: 100px;
      height: 100px;
      margin-left: auto;
    }

    img {
      width: 10vmin;
    }
  `,
})
export class TlsmDragonCard {
  dragon = input.required<Dragon>();
  scaleDiscard = output<void>();

  private nScales = computed(() => this.dragon().nScales);
  protected scales = computed(() => Array.from({ length: this.nScales() }));
}
