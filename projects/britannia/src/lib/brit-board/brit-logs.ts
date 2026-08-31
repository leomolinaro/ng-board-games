import type { OnChanges } from '@angular/core';
import { Component, ElementRef, inject, input } from '@angular/core';
import type { SimpleChanges } from '@leobg/commons/utils';
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
export class BritLogs implements OnChanges {
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly logs = input.required<BritLog[]>();

  ngOnChanges(changes: SimpleChanges<this>) {
    if (changes.logs) {
      setTimeout(
        () =>
          (this.elementRef.nativeElement.scrollTop =
            this.elementRef.nativeElement.scrollHeight),
      );
    }
  }
}
