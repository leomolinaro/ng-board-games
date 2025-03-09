import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatAccordion, MatExpansionPanel, MatExpansionPanelActionRow, MatExpansionPanelHeader, MatExpansionPanelTitle } from "@angular/material/expansion";
import { MatIcon } from "@angular/material/icon";
import { MatListOption, MatSelectionList } from "@angular/material/list";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from "@angular/material/sidenav";
import { MatSlider, MatSliderThumb } from "@angular/material/slider";
import { MatToolbar } from "@angular/material/toolbar";
import { Loading, SingleEvent, UntilDestroy } from "@leobg/commons/utils";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { NgLetDirective } from "../../../../commons/utils/src/lib/ng.util";
import { AgotDataService } from "../agot-services/agot-data.service";
import { AgotCard, AgotFactionCode, AgotPackCode } from "../agot.models";
import { AgotCardGridComponent } from "./agot-card-grid/agot-card-grid.component";
import { AgotDraftService } from "./agot-draft.service";

@Component ({
  selector: "agot-draft",
  templateUrl: "./agot-draft.component.html",
  styleUrls: ["./agot-draft.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgLetDirective, MatSidenavContainer, MatSidenav, MatToolbar, NgIf, MatProgressBar, MatAccordion, MatExpansionPanel, MatSlider, MatSliderThumb, MatCheckbox, FormsModule, MatExpansionPanelActionRow, MatButton, MatExpansionPanelHeader, MatExpansionPanelTitle, MatIcon, MatSelectionList, NgFor, MatListOption, MatSidenavContent, MatIconButton, AgotCardGridComponent, AsyncPipe]
})
@UntilDestroy
export class AgotDraftComponent implements OnInit, OnDestroy {
  private breakpointObserver = inject (BreakpointObserver);
  data = inject (AgotDataService);
  draft = inject (AgotDraftService);

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
