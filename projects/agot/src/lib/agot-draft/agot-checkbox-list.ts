import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiCheckbox } from '@taiga-ui/core';

export interface AgotCheckboxListItem {
  code: string;
  name: string;
}

@Component({
  selector: 'agot-checkbox-list',
  standalone: true,
  imports: [FormsModule, TuiButton, TuiCheckbox],
  template: `
    <div class="filter-header">
      <div class="filter-actions">
        <button
          tuiButton
          type="button"
          size="s"
          appearance="outline"
          (click)="selectAll()"
        >
          All
        </button>
        <button
          tuiButton
          type="button"
          size="s"
          appearance="outline"
          (click)="deselectAll()"
        >
          None
        </button>
      </div>
    </div>

    <div class="filter-list">
      @for (item of items(); track item.code) {
        <label class="filter-item">
          <input
            tuiCheckbox
            type="checkbox"
            [ngModel]="isSelected(item.code)"
            (ngModelChange)="toggleItem(item.code, $event)"
          />
          <span>{{ item.name }}</span>
        </label>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .filter-header {
      display: flex;
      justify-content: flex-end;
      padding-block-end: 0.5rem;
    }

    .filter-actions {
      display: flex;
      gap: 0.5rem;
    }

    .filter-list {
      display: grid;
      gap: 0.25rem;
    }

    .filter-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `,
})
export class AgotCheckboxList {
  items = input.required<AgotCheckboxListItem[]>();
  selected = model.required<string[]>();

  public isSelected(code: string): boolean {
    return this.selected().includes(code);
  }

  public toggleItem(code: string, checked: boolean): void {
    const next = checked
      ? [...new Set([...this.selected(), code])]
      : this.selected().filter((value) => value !== code);

    this.selected.set(next);
  }

  public selectAll(): void {
    const next = this.items().map((item) => item.code);
    this.selected.set(next);
  }

  public deselectAll(): void {
    this.selected.set([]);
  }
}
