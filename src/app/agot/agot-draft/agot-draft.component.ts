import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { Loading, SingleEvent, UntilDestroy } from "@bg-utils";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AgotDataService } from "../agot-services/agot-data.service";
import { AgotCard, AgotFactionCode, AgotPackCode } from "../agot.models";
import { AgotDraftService } from "./agot-draft.service";

@Component ({
  selector: "agot-draft",
  templateUrl: "./agot-draft.component.html",
  styleUrls: ["./agot-draft.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class AgotDraftComponent implements OnInit, OnDestroy {
  
  constructor (
    private breakpointObserver: BreakpointObserver,
    public data: AgotDataService,
    public draft: AgotDraftService
  ) { }

  nCards = 30;
  duplicates = false;
  selectedTypeIds: string[] = [];
  selectedFactionIds: AgotFactionCode[] = [];
  selectedPackIds: AgotPackCode[] = [];
  types$ = this.data.getTypes$ ();
  factions$ = this.data.getFactions$ ();
  packs$ = this.data.getPacks$ ();

  draftCards: AgotCard[] | null = null;

  @Loading () loading$!: Observable<boolean>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe (Breakpoints.Handset)
  .pipe (map (result => result.matches));

  @SingleEvent ()
  ngOnInit () {
    return this.data.load$ ().pipe (
      tap (() => {
        this.selectedTypeIds = ["character", "location", "event", "attachment"];
        this.selectedFactionIds = ["neutral", "stark", "lannister", "greyjoy", "baratheon", "martell", "tyrell", "thenightswatch", "targaryen"];
        this.selectedPackIds = ["Core",
          "WotN", "LoCR", "WotW", "HoT", "SoD",  "KotI", "FotS", "DotE",
          "TtB", "TRtW", "TKP", "NMG", "CoW", "TS",
          "AtSK", "CtA", "FFH", "TIMC", "GoH", "TC",
          "AMAF", "GtR", "TFoA", "TRW", "OR", "TBWB",
          "TAK", "JtO", "Km",  "FotOG", "TFM", "SAT",
          "TSC", "TMoW", "SoKL", "MoD", "IDP", "DitD",
          "AtG", "CoS", "PoS", "BtRK", "TB", "LMHR"
        ];
      })
    );
  } // ngOnInit

  ngOnDestroy () { }

  generate () {
    this.draftCards = this.draft.generateDraft (
      this.nCards, this.selectedTypeIds, this.selectedFactionIds, this.selectedPackIds, this.duplicates
    );
  } // generate

} // AgotDraftComponent
