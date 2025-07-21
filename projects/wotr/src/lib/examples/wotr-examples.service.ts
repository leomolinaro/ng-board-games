import { Injectable } from "@angular/core";
import { WotrStoryDoc } from "../game/wotr-story-models";

interface WotrExampleGame {
  id: string;
  name: string;
  loadStories: () => Promise<WotrStoryDoc[]>;
}

@Injectable({
  providedIn: "root"
})
export class WotrExamplesService {
  private exampleGames: WotrExampleGame[] = [
    {
      id: "very-late-minions",
      name: "Very Late Minions",
      loadStories: () => import("./very-late-minions").then(e => e.stories)
    },
    {
      id: "there-is-another-way",
      name: "There is Another Way",
      loadStories: () => import("./there-is-another-way").then(e => e.stories)
    }
  ];

  getGames() {
    return this.exampleGames;
  }
  getGame(id: string) {
    return this.exampleGames.find(g => g.id === id);
  }
}
