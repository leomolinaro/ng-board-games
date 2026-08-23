import { booleanAttribute, Component, computed, input, model } from "@angular/core";
import { BgGameOptionsComponent } from "@leobg/commons";
import { TuiButton, TuiExpand, TuiTitle } from "@taiga-ui/core";
import { TuiAccordion } from "@taiga-ui/kit";
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
    TuiAccordion,
    TuiButton,
    TuiExpand,
    TuiTitle,
    WotrActionTokenOptionsForm,
    WotrExpansionOptionsForm,
    WotrVariantOptionsForm
  ],
  template: `
    <tui-accordion [closeOthers]="false">
      <button
        tuiAccordion
        tuiButton
        type="button">
        <strong tuiTitle
          >Expansions
          <span tuiSubtitle>{{ expansionsSummary() }}</span>
        </strong>
      </button>
      <tui-expand>
        <wotr-expansion-options-form
          [expansions]="options().expansions"
          [readOnly]="!isOwner()"
          (expansionsChange)="expansionsChange($event)" />
      </tui-expand>
      <button
        tuiAccordion
        tuiButton
        type="button">
        <strong tuiTitle
          >Variants
          <span tuiSubtitle>{{ variantsSummary() }}</span>
        </strong>
      </button>
      <tui-expand>
        <wotr-variant-options-form
          [variants]="options().variants"
          [expansions]="options().expansions"
          [readOnly]="!isOwner()"
          (variantsChange)="variantsChange($event)" />
      </tui-expand>
      <button
        tuiAccordion
        tuiButton
        type="button">
        <strong tuiTitle
          >Action Tokens
          <span tuiSubtitle>{{ tokensSummary() }}</span>
        </strong>
      </button>
      <tui-expand>
        <wotr-action-token-options-form
          [tokens]="options().tokens"
          [readOnly]="!isOwner()"
          (tokensChange)="tokensChange($event)" />
      </tui-expand>
    </tui-accordion>
  `,
  styles: `
    [tuiSubtitle] {
      overflow: hidden;
      text-overflow: ellipsis;
    }
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
