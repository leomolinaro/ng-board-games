import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { IDragon, TlsmDragonId, TlsmStore } from "../tlsm-store";
import { NgIf, NgStyle, NgFor, AsyncPipe } from "@angular/common";
import { MatCard, MatCardHeader, MatCardAvatar, MatCardTitle } from "@angular/material/card";
import { BgTimesPipe } from "../../../../../commons/utils/src/lib/bg-times.pipe";

@Component ({
  selector: "tlsm-dragon-card",
  templateUrl: "./tlsm-dragon-card.component.html",
  styleUrls: ["./tlsm-dragon-card.component.scss"],
  imports: [NgIf, MatCard, MatCardHeader, MatCardAvatar, NgStyle, MatCardTitle, NgFor, AsyncPipe, BgTimesPipe]
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
