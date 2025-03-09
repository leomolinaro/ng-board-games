import { AsyncPipe, NgFor, NgIf, NgStyle } from "@angular/common";
import { Component, Input, OnInit, inject } from "@angular/core";
import { MatCard, MatCardAvatar, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { Observable } from "rxjs";
import { BgTimesPipe } from "../../../../../commons/utils/src/lib/bg-times.pipe";
import { IDragon, TlsmDragonId, TlsmStore } from "../tlsm-store";

@Component ({
  selector: "tlsm-dragon-card",
  templateUrl: "./tlsm-dragon-card.component.html",
  styleUrls: ["./tlsm-dragon-card.component.scss"],
  imports: [NgIf, MatCard, MatCardHeader, MatCardAvatar, NgStyle, MatCardTitle, NgFor, AsyncPipe, BgTimesPipe]
})
export class TlsmDragonCardComponent implements OnInit {
  
  private store = inject (TlsmStore);

  @Input () dragonId!: TlsmDragonId;
  dragon$!: Observable<IDragon>;

  ngOnInit () {
    this.dragon$ = this.store.selectDragon$ (this.dragonId);
  } // ngOnInit

  discardScale () {
    this.store.discardScale (this.dragonId);
  } // discardScale
} // TlsmDragonCardComponent
