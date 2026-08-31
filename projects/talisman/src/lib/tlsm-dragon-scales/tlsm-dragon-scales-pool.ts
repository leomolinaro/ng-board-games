import { Component, computed, input } from '@angular/core';
import type { Pool } from './tlsm-store';

interface Scale {
  height: number;
  src: string;
  alt: string;
  value: number;
}

@Component({
  selector: 'tlsm-dragon-scales-pool',
  template: `
    @for (scale of scales(); track $index) {
      <div class="scale">
        <img
          [height]="scale.height"
          [src]="scale.src"
          [alt]="scale.alt"
        />
        <span>&nbsp;{{ scale.value }}</span>
      </div>
    }
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: row;
      align-content: center;
      justify-content: space-evenly;
      flex-wrap: wrap;
    }
    .scale {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1vmin;
    }
    img {
      width: 10vmin;
      height: 10vmin;
    }
  `,
})
export class TlsmDragonScalesPool {
  pool = input.required<Pool>();

  protected scales = computed<Scale[]>(() => [
    {
      height: 65,
      src: '../assets/talisman/varthrax-token.png',
      alt: 'varthrax',
      value: this.pool().scales.varthrax,
    },
    {
      height: 60,
      src: '../assets/talisman/strike-token.png',
      alt: 'strike',
      value: this.pool().strikes,
    },
    {
      height: 65,
      src: '../assets/talisman/cadorus-token.png',
      alt: 'cadorus',
      value: this.pool().scales.cadorus,
    },
    {
      height: 60,
      src: '../assets/talisman/rage-token.png',
      alt: 'rage',
      value: this.pool().rages,
    },
    {
      height: 65,
      src: '../assets/talisman/grilipus-token.png',
      alt: 'grilipus',
      value: this.pool().scales.grilipus,
    },
    {
      height: 60,
      src: '../assets/talisman/slumber-token.png',
      alt: 'slumber',
      value: this.pool().slumbers,
    },
  ]);
}
