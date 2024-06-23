import { Injectable, inject } from "@angular/core";
import { WotrActionApplierMap } from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrNationAction } from "./wotr-nation-actions";
import { WotrNationId } from "./wotr-nation.models";
import { WotrNationStore } from "./wotr-nation.store";

@Injectable ()
export class WotrNationService /* implements WotrBattleEventListener */ {

  constructor () {
    this.actionService.registerActions (this.getActionAppliers () as any);
  }

  private actionService = inject (WotrActionService);
  private nationStore = inject (WotrNationStore);
  private logStore = inject (WotrLogStore);
  // private eventService = inject (WotrEventService);

  getActionAppliers (): WotrActionApplierMap<WotrNationAction> {
    return {
      "political-activation": async (action, front) => { this.nationStore.activate (true, action.nation); },
      "political-advance": async (action, front) => { this.nationStore.advance (action.quantity, action.nation); },
    };
  }

  advance (quantity: number, nation: WotrNationId) {
    this.logStore.logEffect ({ type: "political-advance", nation, quantity });
    this.nationStore.advance (quantity, nation);
  }
  
  activate (nation: WotrNationId) {
    this.logStore.logEffect ({ type: "political-activation", nation });
    this.nationStore.activate (true, nation);
  }

  // getEventConsumers (): WotrEventConsumerMap<WotrBattleEvent> {
  //   return
  // }

  // registerEventListeners () {
  //   this.battleService.registerEventListener ("end-battle", (event) => { });
  //   this.battleService.registerEventListener (this);
  //   this.eventService.register ()
  // }

}
