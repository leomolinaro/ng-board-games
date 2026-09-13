import type { OnInit } from '@angular/core';
import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  isDevMode,
} from '@angular/core';
import type { WotrLog } from './wotr-log-models';
import { WotrLogRow } from './wotr-log-row';

const DEBUG_LOG_INDEXES = 'wotr.debugLogIndex';

@Component({
  selector: 'wotr-log-list',
  imports: [WotrLogRow],
  template: `
    @for (log of logs(); let i = $index; track i) {
      <wotr-log-row
        [log]="log"
        [debugBreakpoint]="debugIndexes[i]"
        (click)="onLogClick(i)"
      ></wotr-log-row>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        max-height: 100%;
        overflow: auto;
        color: white;
      }
    `,
  ],
})
export class WotrLogList implements OnInit {
  constructor() {
    effect(() => this.scrollToBottom());
  }

  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  logs = input.required<WotrLog[]>();
  protected debugIndexes: Record<string, boolean> = {};

  ngOnInit(): void {
    const indexes = localStorage.getItem(DEBUG_LOG_INDEXES);
    if (indexes) {
      for (const i of indexes.split(',')) this.debugIndexes[i] = true;
    }
  }

  private scrollToBottom(): void {
    this.logs();
    setTimeout(() => {
      this.elementRef.nativeElement.scrollTop =
        this.elementRef.nativeElement.scrollHeight;
    });
  }

  onLogClick(index: number): void {
    if (!isDevMode()) {
      return;
    }

    if (this.debugIndexes[index]) {
      delete this.debugIndexes[index];
    } else {
      this.debugIndexes[index] = true;
    }
    localStorage.setItem(
      DEBUG_LOG_INDEXES,
      Object.keys(this.debugIndexes).join(','),
    );
  }
}
