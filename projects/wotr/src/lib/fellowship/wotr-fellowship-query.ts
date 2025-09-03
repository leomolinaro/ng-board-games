import { WotrFellowshipStore } from "./wotr-fellowship-store";

export class WotrFellowshipQuery {
  constructor(private fellowshipStore: WotrFellowshipStore) {}

  corruption(): number {
    return this.fellowshipStore.corruption();
  }

  hasCompanions(): boolean {
    return this.fellowshipStore.companions().length > 0;
  }
}
