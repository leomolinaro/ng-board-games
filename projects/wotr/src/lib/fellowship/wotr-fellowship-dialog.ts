import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BgTransformFn, arrayUtil } from "@leobg/commons/utils";
import { TuiHint } from "@taiga-ui/core";
import { WotrAssetsStore, WotrUnitImage } from "../assets/wotr-assets-store";
import { WotrCompanionId } from "../character/wotr-character-models";
import { WotrGameQuery } from "../game/wotr-game-query";
import { WotrFellowshipCompanionSelection } from "../game/wotr-game-ui";
import { WotrFellowshipStore } from "./wotr-fellowship-store";

export interface WotrFellowshipDialogData {
  selection: WotrFellowshipCompanionSelection | null;
}

export type WotrFellowshipDialogResult = WotrCompanionId[];

export type WotrFellowshipDialogRef = MatDialogRef<
  WotrFellowshipDialog,
  WotrFellowshipDialogResult
>;

export interface CompanionNode {
  id: WotrCompanionId;
  source: string;
  label: string;
  width: number;
  height: number;
  selected?: boolean;
  selectable?: boolean;
  disabled?: boolean;
}

@Component({
  selector: "wotr-fellowship-dialog",
  imports: [TuiHint],
  template: `
    <h1>Fellowship</h1>
    <div>
      @for (unitNode of unitNodes; track unitNode.id) {
        <img
          class="unit"
          [class.disabled]="unitNode.disabled"
          [class.selectable]="unitNode.selectable"
          [class.selected]="unitNode.selected"
          [src]="unitNode.source"
          [width]="unitNode.width"
          [height]="unitNode.height"
          [tuiHint]="unitNode.label"
          (click)="onUnitClick(unitNode)" />
      }
    </div>
    @if (data.selection) {
      @if (canConfirm() !== true) {
        <p>
          {{ canConfirm() }}
        </p>
      }
      <button
        class="confirm-button"
        [disabled]="canConfirm() !== true"
        [class.disabled]="canConfirm() !== true"
        (click)="onConfirm()">
        Confirm companions
      </button>
    }
  `,
  styles: [
    `
      @use "wotr-variables" as wotr;

      :host {
        background-color: #151515;
        color: white;
        display: flex;
        flex-direction: column;
        @include wotr.golden-padding(1vmin);
      }

      .confirm-button {
        @include wotr.button;
      }

      .unit {
        &.selected {
          border: 2px solid white;
        }
        &.selectable {
          cursor: pointer;
        }
        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    `
  ]
})
export class WotrFellowshipDialog implements OnInit {
  protected data = inject<WotrFellowshipDialogData>(MAT_DIALOG_DATA);
  private assets = inject(WotrAssetsStore);
  private dialogRef: WotrFellowshipDialogRef = inject(MatDialogRef);
  private fellowshipStore = inject(WotrFellowshipStore);
  private q = inject(WotrGameQuery);

  protected unitNodes!: CompanionNode[];
  private selectedNodes = signal<CompanionNode[]>([]);

  protected canConfirm = computed<true | string>(() => {
    const selection = this.data.selection;
    if (!selection) throw new Error("No selection data provided");
    const selectedCount = this.selectedNodes().length;
    if (selection.singleSelection && selectedCount > 1) return "Select only one companion";
    if (selection.nCompanions && selectedCount !== selection.nCompanions)
      return `Select exactly ${selection.nCompanions} companion${selectedCount === 1 ? "" : "s"}`;
    if (!selectedCount) return "Select at least one companion";
    return true;
  });

  ngOnInit() {
    this.unitNodes = this.unitsToUnitNodes(this.fellowshipStore.companions());
    const companionSelection = this.data.selection;
    if (companionSelection) {
      this.unitNodes.forEach(unitNode => {
        if (companionSelection.companions.includes(unitNode.id)) {
          unitNode.selectable = true;
          unitNode.disabled = false;
        } else {
          unitNode.selectable = false;
          unitNode.disabled = true;
        }
      });
    }
  }

  private unitsToUnitNodes(companionIds: WotrCompanionId[]): CompanionNode[] {
    const unitNodes: CompanionNode[] = [];
    companionIds.forEach(companionId => {
      const image = this.assets.frontCharacterImage(companionId);
      unitNodes.push({
        id: companionId,
        label: this.q.character(companionId).name,
        ...this.scale(image)
      });
    });
    return unitNodes;
  }

  private scale(image: WotrUnitImage): WotrUnitImage {
    return { source: image.source, width: image.width * 1.5, height: image.height * 1.5 };
  }

  protected range: BgTransformFn<number, number[]> = n => arrayUtil.range(n);

  onConfirm() {
    if (!this.canConfirm()) return;

    const output: WotrCompanionId[] = [];
    for (const unitNode of this.selectedNodes()) {
      if (unitNode.selected) {
        output.push(unitNode.id);
      }
    }

    this.dialogRef.close(output);
  }

  onUnitClick(unitNode: CompanionNode) {
    if (unitNode.disabled || !unitNode.selectable) return;
    if (unitNode.selected) {
      unitNode.selected = false;
      this.selectedNodes.update(nodes => nodes.filter(n => n.id !== unitNode.id));
    } else {
      unitNode.selected = true;
      this.selectedNodes.update(nodes => [...nodes, unitNode]);
    }
  }
}
