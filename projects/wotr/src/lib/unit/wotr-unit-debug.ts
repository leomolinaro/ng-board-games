import { computed, effect, inject } from "@angular/core";
import { frontOfNation, WotrNationId } from "../nation/wotr-nation-models";
import { WotrNationStore } from "../nation/wotr-nation-store";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrArmy } from "./wotr-unit-models";
import { WotrUnitUtils } from "./wotr-unit-utils";

export class WotrUnitDebug {
  constructor(private nationId: WotrNationId) {}

  private frontId = frontOfNation(this.nationId);
  private nationStore = inject(WotrNationStore);
  private regionStore = inject(WotrRegionStore);
  private unitUtils = inject(WotrUnitUtils);

  private nation = computed(() => this.nationStore.nation(this.nationId));

  private armies = computed<WotrArmy[]>(() =>
    this.regionStore
      .regions()
      .map(r => {
        let army =
          r.army?.front === this.frontId
            ? r.army
            : r.underSiegeArmy?.front === this.frontId
              ? r.underSiegeArmy
              : null;
        if (army && !this.unitUtils.hasArmyUnitsOfNation(this.nationId, army)) army = null;
        return army;
      })
      .filter<WotrArmy>(a => !!a)
  );

  private nRegularReinforcements = computed(() => this.nation().reinforcements.regular);

  private nRegularCasualties = computed(() => this.nation().casualties.regular);

  private nRegularForces = computed(() =>
    this.armies().reduce(
      (sum, army) =>
        sum + (army ? this.unitUtils.getNRegularUnitsOfNation(this.nationId, army) : 0),
      0
    )
  );

  private nEliteReinforcements = computed(() => this.nation().reinforcements.elite);

  private nEliteCasualties = computed(() => this.nation().casualties.elite);

  private nEliteForces = computed(() =>
    this.armies().reduce(
      (sum, army) => sum + (army ? this.unitUtils.getNEliteUnitsOfNation(this.nationId, army) : 0),
      0
    )
  );

  private writeLog = effect(() => {
    const totalRegular =
      this.nRegularReinforcements() + this.nRegularForces() + this.nRegularCasualties();
    const totalElite = this.nEliteReinforcements() + this.nEliteForces() + this.nEliteCasualties();
    const total = totalRegular + totalElite;
    console.log(
      `${this.nRegularReinforcements()} + ${this.nRegularForces()} + ${this.nRegularCasualties()} = ${totalRegular}, ${this.nEliteReinforcements()} + ${this.nEliteForces()} + ${this.nEliteCasualties()} = ${totalElite}, Total = ${total}`
    );
  });
}
