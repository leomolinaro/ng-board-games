import { AsyncPipe, NgFor, NgIf, NgStyle } from "@angular/common";
import { ChangeDetectionStrategy, Component, ViewChild, inject } from "@angular/core";
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButton, MatFabButton, MatIconButton, MatMiniFabButton } from "@angular/material/button";
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatLine } from "@angular/material/core";
import { MatFormField, MatSuffix } from "@angular/material/form-field";
import { MatGridList, MatGridTile } from "@angular/material/grid-list";
import { MatIcon } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { MatList, MatListItem } from "@angular/material/list";
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from "@angular/material/sidenav";
import { MatToolbar } from "@angular/material/toolbar";
import { AskTokenResolver, CompleteTokenResolver } from "./services/tlsm-draw.service";
import { TlsmMessageService } from "./services/tlsm-message.service";
import { TlsmDragonCardComponent } from "./tlsm-dragon-card/tlsm-dragon-card.component";
import { TlsmStore } from "./tlsm-store";

@Component({
  selector: "tlsm-dragon-scales",
  templateUrl: "./tlsm-dragon-scales.component.html",
  styleUrls: ["./tlsm-dragon-scales.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TlsmStore],
  imports: [
    MatSidenavContainer,
    MatSidenav,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatMiniFabButton,
    MatIcon,
    NgFor,
    MatFormField,
    MatInput,
    MatButton,
    MatIconButton,
    MatSuffix,
    MatSidenavContent,
    NgStyle,
    MatToolbar,
    TlsmDragonCardComponent,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatList,
    MatListItem,
    MatLine,
    MatCardContent,
    MatGridList,
    MatGridTile,
    MatCardActions,
    MatFabButton,
    AsyncPipe
  ]
})
export class TlsmDragonScalesComponent {
  private store = inject(TlsmStore);

  constructor() {
    const store = this.store;
    const messager = inject(TlsmMessageService);
    this.completeTokenResolver = new CompleteTokenResolver(store, messager);
    this.askTokenResolver = new AskTokenResolver(store, messager);
  } // constructor

  private completeTokenResolver: CompleteTokenResolver;
  private askTokenResolver: AskTokenResolver;

  @ViewChild("sidenav") sidenav!: MatSidenav;
  logs$ = this.store.selectLogs$();
  pool$ = this.store.selectPool$();
  players$ = this.store.selectPlayers$();
  varthraxCrowned$ = this.store.selectCrowned$("varthrax");
  cadorusCrowned$ = this.store.selectCrowned$("cadorus");
  grilipusCrowned$ = this.store.selectCrowned$("grilipus");
  optForm: FormGroup | null = null;

  addPlayer() {
    (<FormArray>this.optForm!.get("players")).push(new FormControl("", Validators.required));
  } // addPlayer

  removePlayer(index: number) {
    (<FormArray>this.optForm!.get("players")).removeAt(index);
  } // removePlayer

  openSettings() {
    const settings = this.store.getSettings();
    const players = this.store.getPlayers();
    this.optForm = new FormGroup({
      players: new FormArray(players.map(player => new FormControl(player, Validators.required))),
      scalesPerCrown: new FormControl(settings.scalesPerCrown, [
        Validators.required,
        Validators.min(1),
        Validators.max(100)
      ])
    }); // FormGroup
    this.sidenav.open();
  } // openSettings

  closeSettings() {
    if (this.optForm!.valid) {
      const optModel = this.optForm!.value;
      this.store.saveOpt([...optModel.players], optModel.scalesPerCrown);
      this.sidenav.close();
      this.optForm = null;
    } // if
  } // closeSettings

  newRound() {
    this.store.clearLog();
    for (const player of this.store.getPlayers()) {
      this.completeTokenResolver.drawToken(player);
    } // for
  } // newRound

  drawToken() {
    this.askTokenResolver.drawToken("Player");
  } // drawToken
} // TlsmDragonScalesComponent
