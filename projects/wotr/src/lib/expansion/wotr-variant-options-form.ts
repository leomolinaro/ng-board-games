import { booleanAttribute, Component, input, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { TuiCheckbox, TuiLabel } from "@taiga-ui/core";
import { VARIANTS, WotrExpansion, WotrExpansionId, WotrVariantId } from "./wotr-expansion-models";

@Component({
  selector: "wotr-variant-options-form",
  imports: [BgTransformPipe, FormsModule, TuiCheckbox, TuiLabel],
  template: `
    @for (option of options; track option.id) {
      <label tuiLabel>
        <input
          tuiCheckbox
          type="checkbox"
          [disabled]="readOnly() || (option | bgTransform: isDisabled : expansions())"
          [ngModel]="variants().includes(option.id)"
          (ngModelChange)="toggleVariant(option.id, $event)" />
        <span>{{ option.name }}</span>
      </label>
    }
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

  protected toggleVariant(optionId: WotrVariantId, checked: boolean): void {
    const next = checked
      ? this.variants().includes(optionId)
        ? this.variants()
        : [...this.variants(), optionId]
      : this.variants().filter(variantId => variantId !== optionId);

    this.variants.set(next);
  }
}
