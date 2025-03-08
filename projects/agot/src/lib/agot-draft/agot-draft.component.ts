import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Loading, SingleEvent, UntilDestroy } from "@leobg/commons/utils";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AgotDataService } from "../agot-services/agot-data.service";
import { AgotCard, AgotFactionCode, AgotPackCode } from "../agot.models";
import { AgotDraftService } from "./agot-draft.service";
import { NgLetDirective } from "../../../../commons/utils/src/lib/ng.util";
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from "@angular/material/sidenav";
import { MatToolbar } from "@angular/material/toolbar";
import { NgIf, NgFor, AsyncPipe } from "@angular/common";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatAccordion, MatExpansionPanel, MatExpansionPanelActionRow, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";
import { MatSlider, MatSliderThumb } from "@angular/material/slider";
import { MatCheckbox } from "@angular/material/checkbox";
import { FormsModule } from "@angular/forms";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatSelectionList, MatListOption } from "@angular/material/list";
import { AgotCardGridComponent } from "./agot-card-grid/agot-card-grid.component";

@Component ({
  selector: "agot-draft",
  templateUrl: "./agot-draft.component.html",
  styleUrls: ["./agot-draft.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgLetDirective, MatSidenavContainer, MatSidenav, MatToolbar, NgIf, MatProgressBar, MatAccordion, MatExpansionPanel, MatSlider, MatSliderThumb, MatCheckbox, FormsModule, MatExpansionPanelActionRow, MatButton, MatExpansionPanelHeader, MatExpansionPanelTitle, MatIcon, MatSelectionList, NgFor, MatListOption, MatSidenavContent, MatIconButton, AgotCardGridComponent, AsyncPipe]
})
@UntilDestroy
export class AgotDraftComponent implements OnInit, OnDestroy {
  constructor (
    private breakpointObserver: BreakpointObserver,
    public data: AgotDataService,
    public draft: AgotDraftService
  ) {}

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

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe (Breakpoints.Handset)
    .pipe (map ((result) => result.matches));

  @SingleEvent ()
  ngOnInit () {
    return this.data.load$ ().pipe (
      tap (() => {
        this.selectedTypeIds = ["character", "location", "event", "attachment"];
        this.selectedFactionIds = [
          "neutral",
          "stark",
          "lannister",
          "greyjoy",
          "baratheon",
          "martell",
          "tyrell",
          "thenightswatch",
          "targaryen",
        ];
        this.selectedPackIds = [
          "Core",
          "WotN",
          "LoCR",
          "WotW",
          "HoT",
          "SoD",
          "KotI",
          "FotS",
          "DotE",
          "TtB",
          "TRtW",
          "TKP",
          "NMG",
          "CoW",
          "TS",
          "AtSK",
          "CtA",
          "FFH",
          "TIMC",
          "GoH",
          "TC",
          "AMAF",
          "GtR",
          "TFoA",
          "TRW",
          "OR",
          "TBWB",
          "TAK",
          "JtO",
          "Km",
          "FotOG",
          "TFM",
          "SAT",
          "TSC",
          "TMoW",
          "SoKL",
          "MoD",
          "IDP",
          "DitD",
          "AtG",
          "CoS",
          "PoS",
          "BtRK",
          "TB",
          "LMHR",
        ];
      })
    );
  } // ngOnInit

  ngOnDestroy () {}

  generate () {
    this.draftCards = this.draft.generateDraft (
      this.nCards,
      this.selectedTypeIds,
      this.selectedFactionIds,
      this.selectedPackIds,
      this.duplicates
    );
  } // generate
} // AgotDraftComponent
