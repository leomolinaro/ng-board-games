import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButton, TuiTitle } from '@taiga-ui/core';
import { AGOT_FEATURES } from './agot-features';

@Component({
  selector: 'agot-home',
  template: `
    <header class="agot-header">
      <span tuiTitle>A Game of Thrones LCG 2.0</span>
    </header>

    <div class="agot-features">
      @for (feature of features; track feature.routerLink) {
        <a
          class="agot-feature"
          tuiButton
          appearance="primary"
          size="l"
          [routerLink]="feature.routerLink"
        >
          {{ feature.name }}
        </a>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .agot-header {
      display: flex;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--tui-border-normal);
    }

    .agot-features {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 2.5rem;
      padding: 0 1rem;
    }

    .agot-feature {
      min-width: 220px;
      min-height: 3.5rem;
      border-radius: 0.875rem;
      text-decoration: none;
    }

    .agot-feature:hover {
      filter: brightness(1.04);
    }
  `,
  imports: [RouterLink, TuiButton, TuiTitle],
})
export class AgotHome {
  protected features = AGOT_FEATURES;
}
