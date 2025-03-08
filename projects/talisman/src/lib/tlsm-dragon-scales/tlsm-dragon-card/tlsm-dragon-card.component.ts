import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { IDragon, TlsmDragonId, TlsmStore } from "../tlsm-store";

@Component ({
  selector: "tlsm-dragon-card",
  templateUrl: "./tlsm-dragon-card.component.html",
  styleUrls: ["./tlsm-dragon-card.component.scss"],
  standalone: false
})
export class TlsmDragonCardComponent implements OnInit {
  constructor (private store: TlsmStore) {}

  @Input () dragonId!: TlsmDragonId;
  dragon$!: Observable<IDragon>;

  ngOnInit () {
    this.dragon$ = this.store.selectDragon$ (this.dragonId);
  } // ngOnInit

  discardScale () {
    this.store.discardScale (this.dragonId);
  } // discardScale
} // TlsmDragonCardComponent
