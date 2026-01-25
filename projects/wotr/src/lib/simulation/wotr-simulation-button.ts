import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { ActivatedRoute, Router } from "@angular/router";
import { BgAuthService } from "@leobg/commons";
import { ExhaustingEvent, UntilDestroy } from "@leobg/commons/utils";
import { from } from "rxjs";
import { WotrSimulationInfo } from "./wotr-simulation";
import { WotrSimulations } from "./wotr-simulations";

@Component({
  selector: "wotr-simulation-button",
  imports: [MatFabButton, MatIcon, MatMenuModule],
  template: `
    @if (isAdmin()) {
      <button
        mat-fab
        color="accent"
        class="load-example"
        [matMenuTriggerFor]="exampleMenu">
        <mat-icon>bookmark</mat-icon>
      </button>
      <mat-menu #exampleMenu="matMenu">
        @for (info of simulationInfos; track info.id) {
          <button
            mat-menu-item
            (click)="onGameClick(info)">
            <div>{{ info.name }}</div>
            @if (info.description) {
              <div style="font-size: smaller;">{{ info.description }}</div>
            }
          </button>
        }
      </mat-menu>
    }
  `,
  styles: [
    `
      .load-example {
        position: absolute;
        bottom: 50px;
        left: 50px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class WotrSimulationButton implements OnDestroy {
  private auth = inject(BgAuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private simulations = inject(WotrSimulations);

  protected user = toSignal(this.auth.getUser$());
  protected isAdmin = computed(() => this.user()?.email === "rhapsody.leo@gmail.com");

  protected simulationInfos = this.simulations.getSimulationInfos();

  ngOnDestroy() {}

  @ExhaustingEvent()
  protected onGameClick(info: WotrSimulationInfo) {
    return from(this.router.navigate(["simulation", info.id], { relativeTo: this.activatedRoute }));
  }
}
