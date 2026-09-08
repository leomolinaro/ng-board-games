import { Component, effect, ElementRef, inject, input } from '@angular/core';
import type { BaronyLog } from '../barony-models';
import { BaronyLogRow } from './barony-log-row';

@Component({
  selector: 'barony-logs',
  imports: [BaronyLogRow],
  template: `
    @for (log of logs(); track log) {
      <barony-log-row [log]="log"></barony-log-row>
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
export class BaronyLogs {
  constructor() {
    effect(() => this.scrollToBottom());
  }

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly logs = input.required<BaronyLog[]>();

  private scrollToBottom() {
    this.logs();
    setTimeout(() => {
      this.elementRef.nativeElement.scrollTop =
        this.elementRef.nativeElement.scrollHeight;
    });
  }
}
