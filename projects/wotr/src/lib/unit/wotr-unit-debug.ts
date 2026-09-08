import { computed, effect, inject } from '@angular/core';
import type { WotrFrontId } from '../front/wotr-front-models';
import type { WotrNationId } from '../nation/wotr-nation-models';
import { frontOfNation } from '../nation/wotr-nation-models';
import { WotrNationStore } from '../nation/wotr-nation-store';
import { WotrRegionStore } from '../region/wotr-region-store';
import type { WotrArmy } from './wotr-unit-models';
import { WotrUnitUtils } from './wotr-unit-utils';

export class WotrUnitDebug {
  constructor(private nationId: WotrNationId) {
    this.frontId = frontOfNation(this.nationId);
  }

  private frontId: WotrFrontId;
  private nationStore = inject(WotrNationStore);
  private regionStore = inject(WotrRegionStore);
  private unitUtils = inject(WotrUnitUtils);

  private nation = computed(() => this.nationStore.nation(this.nationId));

  private armies = computed<WotrArmy[]>(() =>
    this.regionStore
      .regions()
      .map((r) => {
        let army =
          r.army?.front === this.frontId
            ? r.army
            : r.underSiegeArmy?.front === this.frontId
              ? r.underSiegeArmy
              : null;
        if (army && !this.unitUtils.hasArmyUnitsOfNation(this.nationId, army))
          army = null;
        return army;
      })
      .filter<WotrArmy>((a) => !!a),
  );

  private nRegularReinforcements = computed(
    () => this.nation().reinforcements.regular,
  );

  private nRegularCasualties = computed(() => this.nation().casualties.regular);

  private nRegularForces = computed(() => {
    let sum = 0;
    for (const army of this.armies()) {
      sum += army
        ? this.unitUtils.getNRegularUnitsOfNation(this.nationId, army)
        : 0;
    }
    return sum;
  });

  private nEliteReinforcements = computed(
    () => this.nation().reinforcements.elite,
  );

  private nEliteCasualties = computed(() => this.nation().casualties.elite);

  private nEliteForces = computed(() => {
    let sum = 0;
    for (const army of this.armies()) {
      sum += army
        ? this.unitUtils.getNEliteUnitsOfNation(this.nationId, army)
        : 0;
    }
    return sum;
  });

  private writeLog = effect(() => {
    const totalRegular =
      this.nRegularReinforcements() +
      this.nRegularForces() +
      this.nRegularCasualties();
    const totalElite =
      this.nEliteReinforcements() +
      this.nEliteForces() +
      this.nEliteCasualties();
    const total = totalRegular + totalElite;
    console.log(
      `${this.nRegularReinforcements()} + ${this.nRegularForces()} + ${this.nRegularCasualties()} = ${totalRegular}, ${this.nEliteReinforcements()} + ${this.nEliteForces()} + ${this.nEliteCasualties()} = ${totalElite}, Total = ${total}`,
    );
  });
}
