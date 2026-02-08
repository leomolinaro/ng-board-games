import { InputSignalWithTransform, ModelSignal } from "@angular/core";

export interface BgGameOptionsComponent<Opt> {
  options: ModelSignal<Opt>;
  isOwner: InputSignalWithTransform<boolean, unknown>;
}
