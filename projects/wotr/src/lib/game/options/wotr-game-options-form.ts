import { booleanAttribute, Component, computed, input, model } from "@angular/core";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import { BgGameOptionsComponent } from "@leobg/commons";
import { getActionTokenName, WotrActionTokenOption } from "../../action-die/wotr-action-die-models";
import { WotrActionTokenOptionsForm } from "../../action-die/wotr-action-token-options-form";
import {
  getExpansion,
  getVariant,
  WotrExpansionId,
  WotrVariantId
} from "../../expansion/wotr-expansion-models";
import { WotrExpansionOptionsForm } from "../../expansion/wotr-expansion-options-form";
import { WotrVariantOptionsForm } from "../../expansion/wotr-variant-options-form";
import { DEFAULT_OPTIONS, WotrGameOptions } from "./wotr-game-options";

@Component({
  selector: "wotr-game-options-form",
  imports: [
    WotrActionTokenOptionsForm,
    WotrExpansionOptionsForm,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription,
    WotrVariantOptionsForm
  ],
  template: `
    <ng-container>
      <mat-accordion multi>
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title> Expansions </mat-panel-title>
            <mat-panel-description> {{ expansionsSummary() }} </mat-panel-description>
          </mat-expansion-panel-header>
          <wotr-expansion-options-form
            [expansions]="options().expansions"
            [readOnly]="!isOwner()"
            (expansionsChange)="expansionsChange($event)" />
        </mat-expansion-panel>
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title> Variants </mat-panel-title>
            <mat-panel-description> {{ variantsSummary() }} </mat-panel-description>
          </mat-expansion-panel-header>
          <wotr-variant-options-form
            [variants]="options().variants"
            [expansions]="options().expansions"
            [readOnly]="!isOwner()"
            (variantsChange)="variantsChange($event)" />
        </mat-expansion-panel>
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title> Action Tokens </mat-panel-title>
            <mat-panel-description> {{ tokensSummary() }} </mat-panel-description>
          </mat-expansion-panel-header>
          <wotr-action-token-options-form
            [tokens]="options().tokens"
            [readOnly]="!isOwner()"
            (tokensChange)="tokensChange($event)" />
        </mat-expansion-panel>
      </mat-accordion>
    </ng-container>
  `
})
export class WotrGameOptionsFormComponent implements BgGameOptionsComponent<WotrGameOptions> {
  options = model<WotrGameOptions>(DEFAULT_OPTIONS);
  isOwner = input.required({
    transform: booleanAttribute
  });

  protected expansionsSummary = computed(() => {
    const expansionLabels = this.options().expansions.map(
      expansion => getExpansion(expansion).name
    );
    return expansionLabels.join(", ");
  });

  expansionsChange(expansions: WotrExpansionId[]) {
    for (const expansion of expansions) {
      const requiredExpansions = getExpansion(expansion).requires || [];
      // eslint-disable-next-line no-loop-func
      if (requiredExpansions.some(required => !expansions.includes(required))) {
        expansions = expansions.filter(e => e !== expansion);
      }
    }
    let variants = this.options().variants;
    for (const variant of variants) {
      const requiredExpansions = getVariant(variant).requires || [];
      if (requiredExpansions.some(required => !expansions.includes(required))) {
        variants = variants.filter(v => v !== variant);
      }
    }
    this.options.update(o => ({ ...o, expansions, variants }));
  }

  protected variantsSummary = computed(() => {
    const variantLabels = this.options().variants.map(variant => getVariant(variant).name);
    return variantLabels.join(", ");
  });

  variantsChange(variants: WotrVariantId[]) {
    this.options.update(o => ({ ...o, variants }));
  }

  protected tokensSummary = computed(() => {
    return this.options()
      .tokens.map(token => getActionTokenName(token.token, token.front))
      .join(", ");
  });

  tokensChange(tokens: WotrActionTokenOption[]) {
    this.options.update(o => ({ ...o, tokens }));
  }
}
