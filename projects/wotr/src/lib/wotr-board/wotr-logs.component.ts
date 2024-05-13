import { ChangeDetectionStrategy, Component, ElementRef, OnChanges, OnInit, inject, input, isDevMode } from "@angular/core";
import { SimpleChanges } from "@leobg/commons/utils";
import { WotrLog } from "../wotr-elements/log/wotr-log.models";
import { WotrLogComponent } from "./wotr-log.component";

const DEBUG_LOG_INDEXES = "wotr.debugLogIndex";

@Component ({
  selector: "wotr-logs",
  standalone: true,
  imports: [WotrLogComponent],
  template: `
    @for (log of logs (); let i = $index; track i) {
      <wotr-log [log]="log" [debugBreakpoint]="debugIndexes[i]" (click)="onLogClick (log, i)"></wotr-log>
    }
  `,
  styles: [`
    :host {
      display: block;
      max-height: 100%;
      overflow: auto;
      color: white;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrLogsComponent implements OnChanges, OnInit {
  
  private elementRef = inject (ElementRef);

  logs = input.required<WotrLog[]> ();
  protected debugIndexes: Record<string, boolean> = { };

  ngOnInit () {
    const indexes = localStorage.getItem (DEBUG_LOG_INDEXES);
    if (indexes) {
      indexes.split (",").forEach (i => this.debugIndexes[i] = true);
    }
  }

  ngOnChanges (changes: SimpleChanges<this>) {
    if (changes.logs) {
      setTimeout (() => { this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight; });
    }
  }

  onLogClick (log: WotrLog, index: number) {
    if (isDevMode ()) {
      if (this.debugIndexes[index]) {
        delete this.debugIndexes[index];
      } else {
        this.debugIndexes[index] = true;
      }
      localStorage.setItem (DEBUG_LOG_INDEXES, Object.keys (this.debugIndexes).join (","));
    }
  }

}
