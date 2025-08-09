import { ChangeDetectionStrategy, Component, inject, linkedSignal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { WotrGameUi } from "../game/wotr-game-ui";

@Component({
  selector: "wotr-options-panel",
  imports: [FormsModule],
  template: `
    @if (ui.inputQuantitySelection(); as inputQuantity) {
      <form (ngSubmit)="onInputSumbit(quantity())">
        <input
          type="number"
          [(ngModel)]="quantity"
          name="inputField"
          placeholder="Enter the quantity"
          [min]="inputQuantity.min"
          [max]="inputQuantity.max" />
        <button type="submit">Confirm</button>
      </form>
    }
    @for (option of ui.options(); track option.value) {
      <button
        [class]="{ disabled: !!option.disabled }"
        [disabled]="!!option.disabled"
        (click)="!option.disabled && ui.option.emit(option)">
        {{ option.label }}
      </button>
    }
  `,
  styles: [
    `
      @use "wotr-variables" as wotr;

      :host {
        display: flex;
        flex-direction: column;
        @include wotr.golden-padding(2vmin);
        background: #151515b0;
        border-radius: 3px;
        button {
          @include wotr.button;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrOptionsPanel {
  protected ui = inject(WotrGameUi);

  protected quantitySelection = this.ui.inputQuantitySelection();
  // protected quantity = this.quantitySelection ? this.quantitySelection.default : 0;
  protected quantity = linkedSignal(() => {
    const inputQuantity = this.ui.inputQuantitySelection();
    return inputQuantity ? inputQuantity.default : 0;
  });

  onInputSumbit(quantity: number) {
    const inputQuantity = this.ui.inputQuantitySelection();
    if (!inputQuantity || quantity < inputQuantity.min || quantity > inputQuantity.max) return;
    this.ui.inputQuantity.emit(quantity);
    this.quantity.set(0);
  }
}
