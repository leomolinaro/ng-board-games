import { booleanAttribute, Component, input, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatListModule } from "@angular/material/list";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { VARIANTS, WotrExpansion, WotrExpansionId, WotrVariantId } from "./wotr-expansion-models";

@Component({
  selector: "wotr-variant-options-form",
  imports: [MatListModule, BgTransformPipe, FormsModule],
  template: `
    <mat-selection-list
      multiple
      [disabled]="readOnly()"
      [ngModel]="variants()"
      (ngModelChange)="variantsChange($event)">
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
export class WotrVariantOptionsForm {
  protected options = VARIANTS.filter(variant => !variant.inactive);

  variants = model.required<WotrVariantId[]>();
  expansions = input.required<WotrExpansionId[]>();
  readOnly = input.required({ transform: booleanAttribute });

  protected isDisabled: BgTransformFn<WotrExpansion, boolean, WotrExpansionId[]> = (
    option,
    expansions
  ) => option.requires?.some(requiredId => !expansions.includes(requiredId)) || false;

  variantsChange(variants: WotrVariantId[]) {
    this.variants.set(variants);
  }
}
