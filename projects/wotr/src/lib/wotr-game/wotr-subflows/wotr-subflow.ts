import { Observable } from "rxjs";
import { WotrGameStore } from "../../wotr-elements/wotr-game.store";
import { WotrAction, WotrStory } from "../../wotr-story.models";
import { WotrStoryService } from "../wotr-story.service";

export interface WotrSubFlow {
  execute$ (action: WotrAction, story: WotrStory, store: WotrGameStore, storyService: WotrStoryService): Observable<unknown>;
}
