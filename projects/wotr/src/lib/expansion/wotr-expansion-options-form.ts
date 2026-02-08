import { booleanAttribute, Component, input, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatListModule } from "@angular/material/list";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { EXPANSIONS, WotrExpansion, WotrExpansionId } from "./wotr-expansion-models";

@Component({
  selector: "wotr-expansion-options-form",
  imports: [MatListModule, BgTransformPipe, FormsModule],
  template: `
    <mat-selection-list
      multiple
      [disabled]="readOnly()"
      [(ngModel)]="expansions">
      @for (option of options; track option.id) {
        <mat-list-option
          [value]="option.id"
          [disabled]="option | bgTransform: isDisabled : expansions()"
          togglePosition="after">
          <span matListItemTitle>{{ option.name }}</span>
        </mat-list-option>
      }
    </mat-selection-list>
  `
})
export class WotrExpansionOptionsForm {
  protected options = EXPANSIONS.filter(expansion => !expansion.inactive);

  expansions = model.required<WotrExpansionId[]>();
  readOnly = input.required({ transform: booleanAttribute });

  protected isDisabled: BgTransformFn<WotrExpansion, boolean, WotrExpansionId[]> = (
    option,
    expansions
  ) => option.requires?.some(requiredId => !expansions.includes(requiredId)) || false;
}
