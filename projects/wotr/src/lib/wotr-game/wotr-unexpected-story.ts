import { WotrStory } from "../wotr-story.models";

export class WotrUnexpectedStory extends Error {

  constructor (private actualStory: WotrStory) {
    super (`Unexpected story ${JSON.stringify (actualStory)}`);
  }

}
