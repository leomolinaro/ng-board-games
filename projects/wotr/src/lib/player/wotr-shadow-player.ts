import { inject, Injectable } from "@angular/core";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrPlayer } from "./wotr-player";

@Injectable()
export class WotrShadowPlayer extends WotrPlayer {
  protected override storyService = inject(WotrStoryService);
  override frontId: WotrFrontId = "shadow";
}
