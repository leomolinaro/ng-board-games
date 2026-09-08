import { Component, effect, ElementRef, inject, input } from '@angular/core';
import type { BritLog } from '../brit-game-state.models';
import { BritLogRow } from './brit-log-row';

@Component({
  selector: 'brit-logs',
  imports: [BritLogRow],
  template: `
    @for (log of logs(); track log) {
      <brit-log-row [log]="log"></brit-log-row>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        max-height: 100%;
        overflow: auto;
        background: black;
        color: white;
      }
    `,
  ],
})
export class BritLogs {
  constructor() {
    effect(() => this.scrollToBottom());
  }

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly logs = input.required<BritLog[]>();

  private scrollToBottom() {
    this.logs();
    setTimeout(() => {
      this.elementRef.nativeElement.scrollTop =
        this.elementRef.nativeElement.scrollHeight;
    });
  }
}
