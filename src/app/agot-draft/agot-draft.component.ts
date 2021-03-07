import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Card } from "./models/card";
import { AgotDraftService } from "./services/agot-draft.service";

@Component ({
  selector: "agot-draft",
  templateUrl: "./agot-draft.component.html",
  styleUrls: ["./agot-draft.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgotDraftComponent implements OnInit {
  
  constructor (
    private breakpointObserver: BreakpointObserver,
    public draft: AgotDraftService
  ) { }

  nCards = 30;
  duplicates = false;
  selectedTypeIds: string[] = [];
  selectedFactionIds: string[] = [];
  selectedPackIds: string[] = [];

  draftCards: Card[] | null = null;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe (Breakpoints.Handset)
  .pipe (map (result => result.matches));

  ngOnInit (): void {
    this.draft.load ();
    this.draft.loaded$.subscribe (() => {
      this.selectedTypeIds = ["character", "location", "event", "attachment"];
      this.selectedFactionIds = ["neutral"];
      this.selectedPackIds = ["Core",
        "WotN", "LoCR", "WotW", "HoT", "SoD",  "KotI", "FotS", "DotE",
        "TtB", "TRtW", "TKP", "NMG", "CoW", "TS",
        "AtSK", "CtA", "FFH", "TIMC", "GoH", "TC",
        "AMAF", "GtR", "TFoA", "TRW", "OR", "TBWB",
        "TAK", "JtO", "Km",  "FotOG", "TFM", "SAT",
        "TSC", "TMoW", "SoKL", "MoD", "IDP", "DitD",
        "AtG", "CoS", "PoS", "BtRK", "TB", "LMHR"
      ];
    });
  }

  generate () {
    console.log (this.nCards);
    console.log (this.selectedTypeIds);
    console.log (this.selectedFactionIds);
    console.log (this.selectedPackIds);
    console.log (this.duplicates);
    this.draftCards = this.draft.generateDraft (
      this.nCards, this.selectedTypeIds, this.selectedFactionIds, this.selectedPackIds, this.duplicates
    );
  } // generate

} // AgotDraftComponent
