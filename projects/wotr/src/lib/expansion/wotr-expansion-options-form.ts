import { booleanAttribute, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BgTransformFn, BgTransformPipe } from '@leobg/commons/utils';
import { TuiCheckbox, TuiLabel } from '@taiga-ui/core';
import {
  EXPANSIONS,
  WotrExpansion,
  WotrExpansionId,
} from './wotr-expansion-models';

@Component({
  selector: 'wotr-expansion-options-form',
  imports: [BgTransformPipe, FormsModule, TuiCheckbox, TuiLabel],
  template: `
    @for (option of options; track option.id) {
      <label tuiLabel>
        <input
          tuiCheckbox
          type="checkbox"
          [disabled]="
            readOnly() || (option | bgTransform: isDisabled : expansions())
          "
          [ngModel]="expansions().includes(option.id)"
          (ngModelChange)="toggleExpansion(option.id, $event)"
        />
        <span>{{ option.name }}</span>
      </label>
    }
  `,
})
export class WotrExpansionOptionsForm {
  protected options = EXPANSIONS.filter((expansion) => !expansion.inactive);

  expansions = model.required<WotrExpansionId[]>();
  readOnly = input.required({ transform: booleanAttribute });

  protected isDisabled: BgTransformFn<
    WotrExpansion,
    boolean,
    WotrExpansionId[]
  > = (option, expansions) =>
    option.requires?.some((requiredId) => !expansions.includes(requiredId)) ||
    false;

  protected toggleExpansion(optionId: WotrExpansionId, checked: boolean): void {
    const next = checked
      ? this.expansions().includes(optionId)
        ? this.expansions()
        : [...this.expansions(), optionId]
      : this.expansions().filter((expansionId) => expansionId !== optionId);

    this.expansions.set(next);
  }
}
