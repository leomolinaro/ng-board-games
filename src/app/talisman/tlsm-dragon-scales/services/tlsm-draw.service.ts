import { TlsmDragonId, TlsmStore } from "../tlsm-store";
import { TlsmMessageService } from "./tlsm-message.service";

abstract class TokenResolver {
  
  constructor (
    protected store: TlsmStore,
    protected messager: TlsmMessageService
  ) { }
   
  abstract drawSlumber (player: string): void;
  abstract drawRage (player: string): void;
  abstract drawStrike (player: string): void;
  abstract drawScale (dragonId: string, player: string): void;

  drawToken (player: string) {
    const pool = this.store.getPool ();
    const poolSize = pool.scales.varthrax + pool.scales.cadorus + pool.scales.grilipus + pool.rages + pool.slumbers + pool.strikes;
    const x = Math.floor (Math.random() * poolSize);
    let limit = pool.scales.varthrax;
    if (x < limit) {
      this.drawScale ("varthrax", player);
    } else {
      limit += pool.scales.cadorus;
      if (x < limit) {
        this.drawScale ("cadorus", player);
      } else {
        limit += pool.scales.grilipus;
        if (x < limit) {
          this.drawScale ("grilipus", player);
        } else {
          limit += pool.rages;
          if (x < limit) {
            this.drawRage (player);
          } else {
            limit += pool.slumbers;
            if (x < limit) {
              this.drawSlumber (player);
            } else {
              limit += pool.strikes;
              if (x < limit) {
                this.drawStrike (player);
              } // if
            } // if - else
          } // if - else
        } // if - else
      } // if - else
    } // if - else
  } // drawsToken

} // TokenResolver

export class CompleteTokenResolver extends TokenResolver {

  drawSlumber (player: string): void {
    this.store.drawSlumber ();
    this.store.addLog (player + " draws a slumber token.", "../assets/talisman/slumber-token.png");
    this.messager.alert (player + " draws a slumber token.", "../assets/talisman/slumber-token.png");
  } // drawSlumber

  drawRage (player: string): void {
    this.store.drawRage ();
    this.store.addLog (player + " draws a rage token.", "../assets/talisman/rage-token.png");
    const king = this.store.getKing ();
    if (king) { this.messager.alert (player + " suffers " + king.name + "'s rage.", "../assets/talisman/rage-token.png"); }
  } // drawRage

  drawStrike (player: string): void {
    this.store.drawStrike ();
    this.store.addLog (player + " draws a strike token.", "../assets/talisman/strike-token.png");
    this.drawToken (player);
    this.drawToken (player);
  } // drawStrike

  drawScale (dragonId: TlsmDragonId, player: string): void {
    const dragon = this.store.getDragon (dragonId);
    const settings = this.store.getSettings ();
    this.store.drawScale (dragonId, true);
    this.store.addLog (player + " draws a " + dragon.name + " scale.", dragon.tokenSource);
    if (dragon.nScales >= settings.scalesPerCrown) {
      this.store.resetScale (dragonId);
      let oldKing = this.store.getKing ();
      if (oldKing) { this.store.crown (oldKing.id, false); }
      this.store.crown (dragonId, true);
      this.messager.alert (player + " generates a " + dragon.name + "'s scale.", dragon.tokenSource);
    } // if
  } // drawScale
  
} // CompleteTokenResolver

export class AskTokenResolver extends TokenResolver {

  drawSlumber (player: string): void {
    this.store.drawSlumber ();
    this.messager.alert (player + " draws a slumber token.", "../assets/talisman/slumber-token.png");
  } // drawSlumber

  drawRage (player: string): void {
    this.store.drawRage ();
    const king = this.store.getKing ();
    if (king) {
      this.messager.confirm (player + " draws a rage token.", "../assets/talisman/rage-token.png", "Has the token to be resolved?")
      .subscribe (confirm => {
        if (confirm) {
          this.messager.alert (player + " suffers " + king.name + "'s rage.", "../assets/talisman/rage-token.png");
        } // if
      }); // subscribe
    } else {
      this.messager.alert (player + " draws a rage token.", "../assets/talisman/rage-token.png");
    } // if - else
  } // drawRage

  drawStrike (player: string): void {
    this.store.drawStrike ();
    this.messager.confirm (player + " draws a strike token.", "../assets/talisman/strike-token.png", "Has the token to be resolved?")
    .subscribe (confirm => {
      if (confirm) {
        this.drawToken (player);
        this.drawToken (player);
      } // if
    }); // subscribe
  } // drawStrike

  drawScale (dragonId: TlsmDragonId, player: string): void {
    const dragon = this.store.getDragon (dragonId);
    const settings = this.store.getSettings ();
    this.messager.confirm (player + " draws a " + dragon.name + " token.", dragon.tokenSource, "Has the token to be resolved?")
    .subscribe (confirm => {
      this.store.drawScale (dragonId, confirm);
      if (confirm) {
        if (dragon.nScales >= settings.scalesPerCrown) {
          this.store.resetScale (dragonId);
          const oldKing = this.store.getKing ();
          if (oldKing) { this.store.crown (oldKing.id, false); }
          this.store.crown (dragonId, true);
          this.messager.alert (player + " generates a " + dragon.name + "'s scale.", dragon.tokenSource);
        } // if
      } // if
    }); // subscribe
  } // drawScale

} // AskTokenResolver
