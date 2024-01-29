import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, inject } from "@angular/core";
import { SimpleChanges } from "@leobg/commons/utils";
import { WotrLog } from "../wotr-elements/wotr-log.models";
import { WotrLogComponent } from "./wotr-log.component";

@Component ({
  selector: "wotr-logs",
  standalone: true,
  imports: [WotrLogComponent],
  template: `
    @for (log of logs; track $index) {
      <wotr-log [log]="log"></wotr-log>
    }
  `,
  styles: [`
    :host {
      display: block;
      max-height: 100%;
      overflow: auto;
      // background: black;
      color: white;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrLogsComponent implements OnChanges {
  
  private elementRef = inject (ElementRef);

  @Input () logs!: WotrLog[];

  ngOnChanges (changes: SimpleChanges<this>) {
    if (changes.logs) {
      setTimeout (() => { this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight; });
    }
  }

}
