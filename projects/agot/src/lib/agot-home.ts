import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatToolbar } from "@angular/material/toolbar";
import { RouterLink } from "@angular/router";
import { AGOT_FEATURES } from "./agot-features";

@Component({
  selector: "agot-home",
  template: `
    <mat-toolbar>
      <span>A Game of Thrones LCG 2.0</span>
    </mat-toolbar>
    <div class="agot-utilities">
      @for (feature of features; track feature.routerLink) {
        <div class="agot-utility-wrapper">
          <a
            class="agot-utility"
            [routerLink]="feature.routerLink">
            {{ feature.name }}
          </a>
        </div>
      }
    </div>
  `,
  styles: `
    .agot-utilities {
      display: flex;
      justify-content: center;
      margin-top: 40px;
      flex-wrap: wrap;
      .agot-utility-wrapper {
        padding: 10px;
        .agot-utility {
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          // cursor: pointer;
          width: 200px;
          height: 50px;
          &:hover {
            box-shadow: 0 4px 17px rgb(255 255 255 / 35%);
          }
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbar, RouterLink]
})
export class AgotHome {
  protected features = AGOT_FEATURES;
}
