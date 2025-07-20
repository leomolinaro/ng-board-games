import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BgTransformFn, arrayUtil } from "@leobg/commons/utils";
import { WotrAssetsService, WotrUnitImage } from "../assets/wotr-assets.service";
import { WotrCompanionId } from "../character/wotr-character.models";
import { WotrCharacterStore } from "../character/wotr-character.store";
import { WotrFellowshipCompanionSelection } from "../game/wotr-game-ui.store";
import { WotrFellowshipStore } from "./wotr-fellowship.store";

export interface WotrFellowshipDialogData {
  selection: WotrFellowshipCompanionSelection | null;
}

export type WotrFellowshipDialogResult = WotrCompanionId[];

export type WotrFellowshipDialogRef = MatDialogRef<
  WotrFellowshipDialogComponent,
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
  imports: [MatTooltipModule, NgClass],
  template: `
    <h1>Fellowship</h1>
    <div>
      @for (unitNode of unitNodes; track unitNode.id) {
        <img
          class="unit"
          [ngClass]="{
            disabled: unitNode.disabled,
            selectable: unitNode.selectable,
            selected: unitNode.selected
          }"
          [src]="unitNode.source"
          [width]="unitNode.width"
          [height]="unitNode.height"
          [matTooltip]="unitNode.label"
          (click)="onUnitClick(unitNode)" />
      }
    </div>
    @if (data.selection) {
      <!-- @if (canConfirm() !== true) {
        <p>
          {{ canConfirm() }}
        </p>
      } -->
      <button
        class="confirm-button"
        [disabled]="canConfirm() !== true"
        [ngClass]="{ disabled: canConfirm() !== true }"
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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrFellowshipDialogComponent implements OnInit {
  protected data = inject<WotrFellowshipDialogData>(MAT_DIALOG_DATA);
  private assets = inject(WotrAssetsService);
  private dialogRef: WotrFellowshipDialogRef = inject(MatDialogRef);
  private fellowshipStore = inject(WotrFellowshipStore);
  private characterStore = inject(WotrCharacterStore);

  protected unitNodes!: CompanionNode[];
  private selectedNodes = signal<CompanionNode[]>([]);

  protected canConfirm = computed(() => {
    if (!this.data.selection) return false;
    if (!this.selectedNodes().length) return false;
    if (this.data.selection.singleSelection && this.selectedNodes().length > 1) return false;
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
    const d = this.data;
    const unitNodes: CompanionNode[] = [];
    companionIds.forEach(companionId => {
      const image = this.assets.getCharacterImage(companionId);
      unitNodes.push({
        id: companionId,
        label: this.characterStore.character(companionId).name,
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
