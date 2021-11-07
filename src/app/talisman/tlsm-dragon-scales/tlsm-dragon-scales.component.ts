import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSidenav } from "@angular/material/sidenav";
import { AskTokenResolver, CompleteTokenResolver } from "./services/tlsm-draw.service";
import { TlsmMessageService } from "./services/tlsm-message.service";
import { TlsmStore } from "./tlsm-store";

@Component({
  selector: 'tlsm-dragon-scales',
  templateUrl: './tlsm-dragon-scales.component.html',
  styleUrls: ['./tlsm-dragon-scales.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TlsmStore]
})
export class TlsmDragonScalesComponent {

  constructor (
    private store: TlsmStore,
    messager: TlsmMessageService
  ) {
    this.completeTokenResolver = new CompleteTokenResolver (store, messager);
    this.askTokenResolver = new AskTokenResolver (store, messager);
  } // constructor
  
  private completeTokenResolver: CompleteTokenResolver;
  private askTokenResolver: AskTokenResolver;

  @ViewChild ("sidenav") sidenav!: MatSidenav;
  logs$ = this.store.selectLogs$ ();
  pool$ = this.store.selectPool$ ();
  players$ = this.store.selectPlayers$ ();
  varthraxCrowned$ = this.store.selectCrowned$ ("varthrax");
  cadorusCrowned$ = this.store.selectCrowned$ ("cadorus");
  grilipusCrowned$ = this.store.selectCrowned$ ("grilipus");
  optForm: FormGroup | null = null;

  addPlayer () {
    (<FormArray>this.optForm!.get ("players")).push (new FormControl ("", Validators.required));
  } // addPlayer

  removePlayer (index: number) {
    (<FormArray>this.optForm!.get ("players")).removeAt (index);
  } // removePlayer

  openSettings () {
    let settings = this.store.getSettings ();
    let players = this.store.getPlayers ();
    this.optForm = new FormGroup ({
      players: new FormArray (players.map (player => new FormControl (player, Validators.required))),
      scalesPerCrown: new FormControl (settings.scalesPerCrown, [Validators.required, Validators.min (1), Validators.max(100)])
    }); // FormGroup
    this.sidenav.open ();
  } // openSettings

  closeSettings () {
    if (this.optForm!.valid) {
      let optModel = this.optForm!.value;
      this.store.saveOpt ([...optModel.players], optModel.scalesPerCrown);
      this.sidenav.close ();
      this.optForm = null;
    } // if
  } // closeSettings

  newRound () {
    this.store.clearLog ();
    for (const player of this.store.getPlayers ()) {
      this.completeTokenResolver.drawToken (player);
    } // for
  } // newRound

  drawToken () {
    this.askTokenResolver.drawToken ("Player");
  } // drawToken

} // TlsmDragonScalesComponent
