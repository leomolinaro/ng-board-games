import { Injectable } from "@angular/core";
import { WotrFront } from "./wotr-components.models";

@Injectable ({
  providedIn: "root",
})
export class WotrComponentsService {

  constructor () {
    // this.init ();
  } // constructor

  readonly FRONTS: WotrFront[] = ["free-peoples", "shadow"];

} // BritEventBuilder
