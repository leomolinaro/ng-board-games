import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { type TuiHandler } from "@taiga-ui/cdk";
import { TuiTree, TuiTreeItem } from "@taiga-ui/kit";
import { WotrScenarioGroupInfo, WotrScenarioInfo } from "./wotr-scenario";
import { WotrScenarios } from "./wotr-scenarios";

@Component({
  selector: "wotr-scenario-selector-dialog",
  imports: [TuiTree],
  template: `
    <div class="scenario-tree-container">
      @for (scenarioGroup of scenarioInfos; track scenarioGroup.id) {
        <tui-tree
          [value]="scenarioGroup"
          [childrenHandler]="handler"
          [content]="content"
          [tuiTreeController]="true" />
      }
    </div>
    <ng-template
      #content
      let-node="node"
      let-value>
      <div
        class="scenario-node"
        [class.scenario-group]="value.type === 'group'"
        [class.scenario]="value.type === 'scenario'"
        [style.--node-level]="node.level"
        (click)="onNodeClick(node, value)">
        <div class="scenario-content">
          <div class="scenario-name">{{ value.name }}</div>
          @if (value.description && value.type === "scenario") {
            <div class="scenario-description">{{ value.description }}</div>
          }
        </div>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .scenario-tree-container {
        height: 70vh;
        overflow: auto;
      }
      .scenario-node {
        padding: 2px 6px;
        border-radius: 3px;
        cursor: pointer;
        &:hover {
          background: var(--tui-background-base-alt);
        }
      }
      .scenario-description {
        font-size: 80%;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrScenarioSelectorDialog {
  private router = inject(Router);
  private scenarios = inject(WotrScenarios);
  protected readonly handler: TuiHandler<
    WotrScenarioGroupInfo,
    readonly (WotrScenarioGroupInfo | WotrScenarioInfo)[]
  > = item => item.scenarios || [];

  private activatedRoute = inject(ActivatedRoute);

  protected scenarioInfos = this.scenarios.getScenarioInfos();

  protected onNodeClick(node: TuiTreeItem, value: WotrScenarioGroupInfo | WotrScenarioInfo) {
    if ("scenarios" in value) {
      (node as any).controller.toggle(node);
    } else {
      this.onGameClick(value);
    }
  }

  protected onGameClick(info: WotrScenarioInfo) {
    this.router.navigate(["scenario", info.id], { relativeTo: this.activatedRoute });
  }
}
