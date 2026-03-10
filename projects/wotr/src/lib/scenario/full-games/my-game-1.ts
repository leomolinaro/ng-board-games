import { WotrCardDraw } from "../../card/wotr-card-actions";
import { WotrScenarioDefinition } from "../wotr-scenario";
import { WotrStoriesBuilder } from "../wotr-story-builder";

export const scenario: WotrScenarioDefinition = {
  options: {
    tokens: [
      { token: "draw-card", front: "free-peoples" },
      { token: "political-advance", front: "free-peoples" }
    ],
    expansions: [],
    variants: []
  },
  stories: (b: WotrStoriesBuilder) => [
    {
      playerId: "free-peoples",
      type: "base",
      time: 1,
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha22", "fpstr23"]
        } satisfies WotrCardDraw
      ]
    },
    {
      time: 1,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          cards: ["scha24", "sstr05"],
          type: "card-draw"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [],
      type: "base",
      time: 2
    },
    {
      playerId: "shadow",
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      type: "base",
      time: 3
    },
    {
      time: 4,
      type: "base",
      actions: [
        {
          type: "action-roll",
          dice: ["character", "muster", "character", "will-of-the-west"]
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: ["eye", "army", "muster", "muster-army", "muster", "muster-army"]
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 4
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 5
    },
    {
      time: 6,
      card: "sstr05",
      type: "die-card",
      die: "muster",
      playerId: "shadow",
      actions: [
        {
          type: "card-play-on-table",
          card: "sstr05"
        }
      ]
    },
    {
      die: "character",
      type: "die",
      playerId: "free-peoples",
      actions: [
        {
          toRegion: "north-dunland",
          type: "companion-separation",
          companions: ["strider", "meriadoc", "legolas"]
        }
      ],
      time: 7
    },
    {
      actions: [
        {
          nation: "isengard",
          type: "political-advance",
          quantity: 1
        }
      ],
      playerId: "shadow",
      die: "muster",
      type: "die",
      time: 8
    },
    {
      time: 9,
      actions: [
        {
          characters: ["strider"],
          toRegion: "druwaith-iaur",
          type: "character-movement",
          fromRegion: "north-dunland"
        },
        {
          fromRegion: "north-dunland",
          type: "character-movement",
          toRegion: "gap-of-rohan",
          characters: ["legolas"]
        },
        {
          fromRegion: "north-dunland",
          type: "character-movement",
          characters: ["meriadoc"],
          toRegion: "cardolan"
        }
      ],
      playerId: "free-peoples",
      die: "character",
      type: "die"
    },
    {
      actions: [
        {
          type: "army-movement",
          fromRegion: "nurn",
          toRegion: "gorgoroth"
        },
        {
          toRegion: "gorgoroth",
          fromRegion: "barad-dur",
          type: "army-movement"
        }
      ],
      die: "muster-army",
      playerId: "shadow",
      time: 10,
      type: "die"
    },
    {
      time: 11,
      type: "die",
      elvenRing: {
        fromDie: "muster",
        toDie: "character",
        ring: "vilya"
      },
      actions: [
        {
          characters: ["legolas"],
          toRegion: "fangorn",
          fromRegion: "gap-of-rohan",
          type: "character-movement"
        },
        {
          type: "character-movement",
          fromRegion: "druwaith-iaur",
          characters: ["strider"],
          toRegion: "dol-amroth"
        },
        {
          toRegion: "south-ered-luin",
          fromRegion: "cardolan",
          characters: ["meriadoc"],
          type: "character-movement"
        }
      ],
      die: "character",
      playerId: "free-peoples"
    },
    {
      die: "muster-army",
      time: 12,
      playerId: "shadow",
      actions: [
        {
          type: "character-play",
          region: "orthanc",
          characters: ["saruman"]
        }
      ],
      type: "die"
    },
    {
      time: 13,
      die: "will-of-the-west",
      type: "die",
      playerId: "free-peoples",
      actions: [
        {
          type: "character-play",
          region: "dol-amroth",
          characters: ["aragorn"]
        }
      ]
    },
    {
      playerId: "shadow",
      type: "die",
      actions: [
        {
          type: "army-movement",
          leftUnits: {
            nNazgul: 0,
            elites: [],
            front: "shadow",
            regulars: [
              {
                quantity: 5,
                nation: "sauron"
              }
            ]
          },
          toRegion: "morannon",
          fromRegion: "gorgoroth"
        },
        {
          fromRegion: "gorgoroth",
          toRegion: "minas-morgul",
          type: "army-movement"
        }
      ],
      time: 14,
      die: "army"
    },
    {
      playerId: "free-peoples",
      time: 15,
      type: "token-skip"
    },
    {
      time: 16,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha17", "fpstr02"]
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          cards: ["scha21", "sstr13"],
          type: "card-draw"
        }
      ],
      time: 16,
      type: "base"
    },
    {
      playerId: "free-peoples",
      time: 17,
      actions: [],
      type: "base"
    },
    {
      time: 18,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          quantity: 0,
          type: "hunt-allocation"
        }
      ]
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: [
            "will-of-the-west",
            "character",
            "will-of-the-west",
            "character",
            "will-of-the-west"
          ]
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 19
    },
    {
      type: "base",
      actions: [
        {
          dice: [
            "character",
            "muster",
            "muster",
            "event",
            "event",
            "eye",
            "character",
            "muster-army"
          ],
          type: "action-roll"
        }
      ],
      time: 19,
      playerId: "shadow"
    },
    {
      time: 20,
      playerId: "free-peoples",
      type: "die-pass"
    },
    {
      card: "scha21",
      type: "die-card",
      actions: [
        {
          type: "card-play-on-table",
          card: "scha21"
        }
      ],
      playerId: "shadow",
      time: 21,
      die: "character"
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 22
    },
    {
      character: "saruman",
      time: 23,
      die: "muster",
      type: "die",
      actions: [
        {
          type: "regular-unit-recruitment",
          quantity: 1,
          region: "north-dunland",
          nation: "isengard"
        },
        {
          type: "regular-unit-recruitment",
          nation: "isengard",
          region: "south-dunland",
          quantity: 1
        },
        {
          region: "orthanc",
          quantity: 1,
          nation: "isengard",
          type: "regular-unit-recruitment"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      time: 24,
      type: "die",
      playerId: "free-peoples",
      die: "character"
    },
    {
      playerId: "shadow",
      time: 25,
      type: "base",
      actions: [
        {
          dice: [6],
          type: "hunt-roll"
        }
      ]
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          tiles: ["er"],
          type: "hunt-tile-draw"
        }
      ],
      time: 26
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "character-elimination",
          characters: ["gandalf-the-grey"]
        },
        {
          type: "fellowship-guide",
          companion: "boromir"
        }
      ],
      type: "base",
      time: 27
    },
    {
      playerId: "free-peoples",
      time: 28,
      actions: [
        {
          region: "fords-of-bruinen",
          type: "fellowship-reveal"
        }
      ],
      type: "base"
    },
    {
      playerId: "shadow",
      type: "die",
      actions: [
        {
          cards: ["scha12"],
          type: "card-draw"
        }
      ],
      die: "event",
      time: 29
    },
    {
      playerId: "free-peoples",
      die: "will-of-the-west",
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      time: 30,
      type: "die"
    },
    {
      playerId: "shadow",
      actions: [
        {
          nation: "isengard",
          region: "north-dunland",
          quantity: 1,
          type: "regular-unit-recruitment"
        },
        {
          region: "south-dunland",
          type: "regular-unit-recruitment",
          nation: "isengard",
          quantity: 1
        },
        {
          nation: "isengard",
          region: "orthanc",
          type: "regular-unit-recruitment",
          quantity: 1
        }
      ],
      time: 31,
      character: "saruman",
      die: "muster",
      type: "die"
    },
    {
      die: "will-of-the-west",
      actions: [
        {
          characters: ["gandalf-the-white"],
          type: "character-play",
          region: "woodland-realm"
        }
      ],
      time: 32,
      playerId: "free-peoples",
      type: "die"
    },
    {
      die: "muster-army",
      time: 33,
      actions: [
        {
          quantity: 2,
          type: "regular-unit-upgrade",
          region: "orthanc",
          nation: "isengard"
        }
      ],
      type: "die",
      character: "saruman",
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die",
      die: "character",
      time: 34,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          dice: [4],
          type: "hunt-roll"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 35
    },
    {
      time: 36,
      playerId: "shadow",
      die: "event",
      type: "die-card",
      card: "sstr13",
      actions: [
        {
          nation: "isengard",
          quantity: 1,
          type: "elite-unit-recruitment",
          region: "orthanc"
        }
      ]
    },
    {
      type: "card-effect",
      card: "scha21",
      playerId: "shadow",
      actions: [
        {
          cards: ["sstr15"],
          type: "card-draw"
        }
      ],
      time: 37
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "army-movement",
          fromRegion: "edoras",
          toRegion: "westemnet"
        },
        {
          type: "army-movement",
          fromRegion: "carrock",
          toRegion: "old-forest-road"
        }
      ],
      time: 38,
      die: "will-of-the-west",
      type: "die"
    },
    {
      time: 39,
      die: "character",
      playerId: "shadow",
      actions: [
        {
          type: "army-movement",
          toRegion: "north-anduin-vale",
          fromRegion: "dol-guldur"
        }
      ],
      type: "die"
    },
    {
      time: 40,
      playerId: "free-peoples",
      token: "political-advance",
      actions: [
        {
          nation: "rohan",
          type: "political-advance",
          quantity: 1
        }
      ],
      type: "token"
    },
    {
      playerId: "free-peoples",
      type: "token-skip",
      time: 41
    },
    {
      actions: [
        {
          cards: ["fpcha03", "fpstr17"],
          type: "card-draw"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 42
    },
    {
      actions: [
        {
          cards: ["scha23", "sstr23"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      time: 42,
      type: "base"
    },
    {
      playerId: "free-peoples",
      time: 43,
      type: "base",
      actions: []
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          quantity: 2,
          type: "hunt-allocation"
        }
      ],
      time: 44
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: [
            "event",
            "will-of-the-west",
            "character",
            "will-of-the-west",
            "muster-army",
            "event"
          ]
        }
      ],
      time: 45,
      type: "base",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          dice: ["character", "muster-army", "muster", "character", "army", "character"],
          type: "action-roll"
        }
      ],
      type: "base",
      time: 45,
      playerId: "shadow"
    },
    {
      type: "die",
      time: 46,
      die: "character",
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-progress"
        }
      ]
    },
    {
      actions: [
        {
          type: "hunt-roll",
          dice: [2, 2]
        }
      ],
      playerId: "shadow",
      time: 47,
      type: "base"
    },
    {
      type: "die",
      actions: [
        {
          type: "regular-unit-upgrade",
          quantity: 2,
          nation: "isengard",
          region: "orthanc"
        }
      ],
      character: "saruman",
      die: "muster",
      time: 48,
      playerId: "shadow"
    },
    {
      time: 49,
      die: "will-of-the-west",
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      playerId: "free-peoples"
    },
    {
      type: "base",
      time: 50,
      actions: [
        {
          type: "hunt-roll",
          dice: [5, 2]
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      time: 51,
      playerId: "shadow",
      actions: [
        {
          tiles: ["er"],
          type: "hunt-tile-draw"
        }
      ]
    },
    {
      actions: [
        {
          type: "fellowship-corruption",
          quantity: 1
        }
      ],
      time: 52,
      type: "base",
      playerId: "free-peoples"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          region: "old-ford",
          type: "fellowship-reveal"
        }
      ],
      time: 53,
      type: "base"
    },
    {
      die: "character",
      card: "scha12",
      actions: [
        {
          quantity: 2,
          type: "fellowship-corruption"
        }
      ],
      time: 54,
      playerId: "shadow",
      type: "die-card"
    },
    {
      playerId: "free-peoples",
      die: "will-of-the-west",
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      time: 55,
      type: "die"
    },
    {
      actions: [
        {
          region: "north-dunland",
          nation: "isengard",
          type: "regular-unit-recruitment",
          quantity: 1
        },
        {
          region: "south-dunland",
          type: "regular-unit-recruitment",
          nation: "isengard",
          quantity: 1
        },
        {
          quantity: 1,
          type: "regular-unit-recruitment",
          nation: "isengard",
          region: "orthanc"
        }
      ],
      time: 56,
      character: "saruman",
      die: "muster-army",
      playerId: "shadow",
      type: "die"
    },
    {
      type: "die-card",
      actions: [
        {
          type: "hunt-tile-add",
          tile: "b-2"
        }
      ],
      playerId: "free-peoples",
      time: 57,
      card: "fpcha03",
      die: "event"
    },
    {
      die: "character",
      card: "scha23",
      actions: [
        {
          fromRegion: "minas-morgul",
          toRegion: "northern-rhovanion",
          type: "nazgul-movement",
          nNazgul: 1
        },
        {
          fromRegion: "morannon",
          toRegion: "north-dunland",
          nNazgul: 2,
          type: "nazgul-movement"
        },
        {
          toRegion: "dimrill-dale",
          fromRegion: "north-anduin-vale",
          type: "army-movement"
        },
        {
          fromRegion: "north-dunland",
          type: "army-movement",
          toRegion: "moria"
        }
      ],
      time: 58,
      type: "die-card",
      playerId: "shadow"
    },
    {
      actions: [
        {
          card: "fpstr02",
          type: "card-play-on-table"
        },
        {
          quantity: 1,
          nation: "elves",
          type: "political-advance"
        }
      ],
      time: 59,
      type: "die-card",
      die: "event",
      card: "fpstr02",
      playerId: "free-peoples"
    },
    {
      time: 60,
      type: "die",
      die: "army",
      playerId: "shadow",
      actions: [
        {
          type: "army-movement",
          fromRegion: "moria",
          toRegion: "dimrill-dale",
          leftUnits: {
            regulars: [
              {
                quantity: 2,
                nation: "sauron"
              }
            ],
            nNazgul: 0,
            front: "shadow"
          }
        },
        {
          toRegion: "gap-of-rohan",
          fromRegion: "south-dunland",
          type: "army-movement"
        }
      ]
    },
    {
      die: "muster-army",
      time: 61,
      actions: [
        {
          type: "army-movement",
          fromRegion: "north-downs",
          toRegion: "ettenmoors"
        },
        {
          toRegion: "helms-deep",
          type: "army-movement",
          fromRegion: "westemnet"
        }
      ],
      type: "die",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      type: "die",
      time: 62,
      die: "character",
      actions: [
        {
          type: "card-discard",
          cards: ["sstr15", "scha24"]
        },
        {
          card: "fpstr02",
          type: "card-discard-from-table"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 63,
      type: "token-skip"
    },
    {
      type: "base",
      actions: [
        {
          cards: ["fpcha10", "fpstr06"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples",
      time: 64
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          cards: ["scha22", "sstr10"],
          type: "card-draw"
        }
      ],
      time: 64
    },
    {
      actions: [],
      playerId: "free-peoples",
      time: 65,
      type: "base"
    },
    {
      actions: [
        {
          type: "hunt-allocation",
          quantity: 1
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 66
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          dice: [
            "will-of-the-west",
            "muster-army",
            "event",
            "character",
            "will-of-the-west",
            "muster"
          ],
          type: "action-roll"
        }
      ],
      time: 67,
      type: "base"
    },
    {
      actions: [
        {
          dice: ["muster-army", "eye", "character", "muster", "event", "eye", "army"],
          type: "action-roll"
        }
      ],
      playerId: "shadow",
      time: 67,
      type: "base"
    },
    {
      type: "die",
      actions: [
        {
          nation: "rohan",
          type: "political-advance",
          quantity: 1
        }
      ],
      playerId: "free-peoples",
      die: "muster-army",
      time: 68
    },
    {
      type: "die-card",
      actions: [
        {
          type: "card-play-on-table",
          card: "scha22"
        }
      ],
      playerId: "shadow",
      die: "event",
      card: "scha22",
      time: 69
    },
    {
      card: "scha21",
      playerId: "shadow",
      time: 70,
      type: "card-effect",
      actions: [
        {
          cards: ["scha18"],
          type: "card-draw"
        }
      ]
    },
    {
      actions: [
        {
          nation: "elves",
          type: "political-advance",
          quantity: 1
        }
      ],
      playerId: "free-peoples",
      type: "die",
      time: 71,
      die: "muster"
    },
    {
      actions: [
        {
          fromRegion: "orthanc",
          toRegion: "fords-of-isen",
          type: "army-attack"
        }
      ],
      type: "die",
      time: 72,
      playerId: "shadow",
      die: "character"
    },
    {
      playerId: "shadow",
      time: 73,
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      time: 74,
      actions: [
        {
          card: "fpstr17",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      playerId: "free-peoples",
      time: 75,
      card: "fpstr17",
      actions: [
        {
          toRegion: "westemnet",
          type: "army-retreat"
        }
      ],
      type: "combat-card-effect"
    },
    {
      actions: [
        {
          type: "army-advance",
          leftUnits: {
            regulars: [
              {
                quantity: 2,
                nation: "isengard"
              }
            ],
            front: "shadow",
            characters: ["saruman"],
            elites: [
              {
                quantity: 1,
                nation: "isengard"
              }
            ]
          }
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 76
    },
    {
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die",
      playerId: "free-peoples",
      die: "character",
      time: 77
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [5, 1, 5],
          type: "hunt-roll"
        }
      ],
      type: "base",
      time: 78
    },
    {
      time: 79,
      die: "army",
      type: "die",
      playerId: "shadow",
      actions: [
        {
          type: "army-movement",
          fromRegion: "gap-of-rohan",
          toRegion: "fords-of-isen"
        },
        {
          toRegion: "dagorlad",
          fromRegion: "morannon",
          type: "army-movement"
        }
      ]
    },
    {
      card: "fpstr23",
      type: "die-card",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-recruitment",
          region: "helms-deep",
          nation: "rohan"
        },
        {
          type: "leader-recruitment",
          nation: "rohan",
          region: "helms-deep",
          quantity: 1
        }
      ],
      die: "event",
      playerId: "free-peoples",
      time: 80
    },
    {
      actions: [
        {
          toRegion: "westemnet",
          fromRegion: "fords-of-isen",
          type: "army-attack"
        }
      ],
      type: "die",
      playerId: "shadow",
      die: "muster-army",
      time: 81
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 82,
      playerId: "shadow",
      type: "base"
    },
    {
      actions: [
        {
          card: "fpstr06",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 83
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          dice: [2, 3],
          type: "combat-roll"
        }
      ],
      time: 84,
      type: "base"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [4, 6, 1, 4, 4]
        }
      ],
      time: 84,
      type: "base"
    },
    {
      actions: [
        {
          dice: [2],
          type: "combat-re-roll"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 85
    },
    {
      time: 85,
      playerId: "shadow",
      actions: [
        {
          dice: [2, 3, 4, 1],
          type: "combat-re-roll"
        }
      ],
      type: "base"
    },
    {
      time: 86,
      actions: [
        {
          quantity: 1,
          nation: "rohan",
          region: "westemnet",
          type: "regular-unit-elimination"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      time: 87,
      playerId: "shadow",
      actions: [
        {
          region: "westemnet",
          type: "battle-continue"
        }
      ],
      type: "base"
    },
    {
      time: 88,
      actions: [
        {
          toRegion: "helms-deep",
          type: "army-retreat"
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      playerId: "shadow",
      type: "base",
      time: 89,
      actions: [
        {
          type: "army-advance"
        }
      ]
    },
    {
      type: "die",
      actions: [
        {
          nation: "elves",
          type: "political-advance",
          quantity: 1
        }
      ],
      playerId: "free-peoples",
      time: 90,
      die: "will-of-the-west"
    },
    {
      time: 91,
      die: "muster",
      actions: [
        {
          nation: "sauron",
          type: "political-advance",
          quantity: 1
        }
      ],
      playerId: "shadow",
      type: "die"
    },
    {
      actions: [
        {
          quantity: 1,
          type: "elite-unit-recruitment",
          region: "lorien",
          nation: "elves"
        }
      ],
      die: "will-of-the-west",
      time: 92,
      playerId: "free-peoples",
      type: "die"
    },
    {
      playerId: "free-peoples",
      token: "draw-card",
      type: "token",
      actions: [
        {
          cards: ["fpcha05"],
          type: "card-draw"
        }
      ],
      time: 93
    },
    {
      playerId: "free-peoples",
      time: 94,
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha15", "fpstr24"]
        }
      ],
      type: "base"
    },
    {
      type: "base",
      time: 94,
      playerId: "shadow",
      actions: [
        {
          cards: ["scha07", "sstr03"],
          type: "card-draw"
        }
      ]
    },
    {
      type: "base",
      playerId: "free-peoples",
      time: 95,
      actions: []
    },
    {
      type: "base",
      time: 96,
      playerId: "shadow",
      actions: [
        {
          type: "hunt-allocation",
          quantity: 1
        }
      ]
    },
    {
      time: 97,
      actions: [
        {
          type: "action-roll",
          dice: ["character", "character", "muster", "will-of-the-west", "muster", "character"]
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      time: 97,
      actions: [
        {
          dice: ["event", "event", "character", "muster-army", "eye", "eye", "character"],
          type: "action-roll"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      die: "character",
      playerId: "free-peoples",
      card: "fpcha05",
      actions: [
        {
          card: "fpcha05",
          type: "card-play-on-table"
        }
      ],
      type: "die-card",
      time: 98
    },
    {
      time: 99,
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["2r"]
        }
      ],
      type: "die-card",
      die: "event",
      playerId: "shadow",
      card: "scha07"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "companion-random",
          companions: ["boromir"]
        }
      ],
      time: 100,
      type: "base"
    },
    {
      type: "base",
      playerId: "free-peoples",
      time: 101,
      actions: [
        {
          characters: ["boromir"],
          type: "character-elimination"
        },
        {
          type: "fellowship-guide",
          companion: "gimli"
        }
      ]
    },
    {
      actions: [
        {
          type: "fellowship-reveal",
          region: "carrock"
        }
      ],
      time: 102,
      type: "base",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "card-draw",
          cards: ["scha14"]
        }
      ],
      time: 103,
      type: "card-effect",
      card: "scha21",
      playerId: "shadow"
    },
    {
      type: "die",
      die: "character",
      time: 104,
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-hide"
        }
      ]
    },
    {
      die: "character",
      type: "die",
      actions: [
        {
          type: "army-attack",
          toRegion: "lorien",
          fromRegion: "dimrill-dale"
        }
      ],
      playerId: "shadow",
      time: 105
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "army-retreat-into-siege",
          region: "lorien"
        }
      ],
      time: 106,
      type: "base"
    },
    {
      time: 107,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "army-advance"
        }
      ]
    },
    {
      actions: [
        {
          toRegion: "lorien",
          characters: ["legolas"],
          fromRegion: "fangorn",
          type: "character-movement"
        }
      ],
      playerId: "free-peoples",
      time: 108,
      type: "die-card",
      card: "fpcha15",
      die: "character"
    },
    {
      die: "muster-army",
      actions: [
        {
          type: "character-play",
          characters: ["the-witch-king"],
          region: "lorien"
        }
      ],
      type: "die",
      time: 109,
      playerId: "shadow"
    },
    {
      time: 110,
      die: "muster",
      type: "die",
      playerId: "free-peoples",
      actions: [
        {
          quantity: 1,
          type: "political-advance",
          nation: "north"
        }
      ]
    },
    {
      type: "die",
      die: "character",
      time: 111,
      actions: [
        {
          type: "army-attack",
          fromRegion: "lorien",
          toRegion: "lorien"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "shadow",
      actions: [
        {
          card: "sstr03",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      time: 112
    },
    {
      type: "base",
      time: 113,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          dice: [3, 1, 3, 6, 1],
          type: "combat-roll"
        }
      ],
      time: 114
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [2, 1, 6, 3, 1],
          type: "combat-roll"
        }
      ],
      type: "base",
      time: 114
    },
    {
      actions: [
        {
          dice: [5, 2],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      time: 115,
      playerId: "free-peoples"
    },
    {
      time: 115,
      actions: [
        {
          dice: [5, 5, 6, 5],
          type: "combat-re-roll"
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          region: "lorien",
          quantity: 2,
          nation: "sauron",
          type: "regular-unit-elimination"
        }
      ],
      time: 116,
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "elite-unit-downgrade",
          quantity: 2,
          region: "lorien",
          nation: "elves"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 117
    },
    {
      time: 118,
      type: "base",
      actions: [
        {
          region: "lorien",
          type: "battle-cease"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "shadow",
      time: 119,
      character: "the-witch-king",
      type: "character-effect",
      actions: [
        {
          cards: ["sstr06"],
          type: "card-draw"
        }
      ]
    },
    {
      playerId: "free-peoples",
      die: "muster",
      type: "die",
      actions: [
        {
          type: "political-advance",
          nation: "north",
          quantity: 1
        }
      ],
      time: 120
    },
    {
      time: 121,
      card: "sstr06",
      die: "event",
      playerId: "shadow",
      type: "die-card",
      actions: [
        {
          quantity: 1,
          nation: "north",
          type: "political-recede"
        }
      ]
    },
    {
      card: "sstr06",
      type: "card-effect",
      time: 122,
      actions: [
        {
          type: "leader-elimination",
          quantity: 1,
          region: "the-shire",
          nation: "north"
        },
        {
          nation: "north",
          region: "bree",
          quantity: 1,
          type: "regular-unit-elimination"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 123,
      type: "card-effect",
      card: "scha21",
      actions: [
        {
          type: "card-draw",
          cards: ["sstr21"]
        }
      ]
    },
    {
      time: 124,
      die: "will-of-the-west",
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die"
    },
    {
      time: 125,
      actions: [
        {
          type: "hunt-roll",
          dice: [6, 4, 5]
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      playerId: "shadow",
      time: 126,
      type: "base",
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["1"]
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 127,
      type: "card-effect-skip",
      card: "fpcha05"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "companion-random",
          companions: ["peregrin"]
        }
      ],
      time: 128,
      type: "base"
    },
    {
      time: 129,
      type: "character-effect",
      character: "peregrin",
      actions: [
        {
          type: "companion-separation",
          toRegion: "dale",
          companions: ["peregrin"]
        }
      ],
      playerId: "free-peoples"
    },
    {
      time: 130,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha14", "fpstr09"]
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          type: "card-draw",
          cards: ["scha02", "sstr04"]
        }
      ],
      playerId: "shadow",
      time: 130
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "card-discard",
          cards: ["sstr23"]
        }
      ],
      time: 131,
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          type: "fellowship-declare",
          region: "old-forest-road"
        }
      ],
      playerId: "free-peoples",
      time: 132
    },
    {
      time: 133,
      actions: [
        {
          type: "hunt-allocation",
          quantity: 1
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      type: "base",
      playerId: "free-peoples",
      time: 134,
      actions: [
        {
          type: "action-roll",
          dice: ["character", "event", "muster-army", "will-of-the-west", "muster-army", "event"]
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          dice: ["event", "character", "muster", "army", "army", "eye", "muster-army", "character"],
          type: "action-roll"
        }
      ],
      time: 134,
      playerId: "shadow"
    },
    {
      die: "event",
      actions: [
        {
          quantity: 1,
          region: "edoras",
          nation: "rohan",
          type: "elite-unit-recruitment"
        },
        {
          quantity: 1,
          nation: "rohan",
          region: "edoras",
          type: "leader-recruitment"
        }
      ],
      time: 135,
      type: "die-card",
      card: "fpstr09",
      playerId: "free-peoples"
    },
    {
      die: "event",
      time: 136,
      type: "die-card",
      actions: [
        {
          tile: "rers",
          type: "hunt-tile-add"
        }
      ],
      playerId: "shadow",
      card: "scha02"
    },
    {
      playerId: "shadow",
      time: 137,
      card: "scha21",
      actions: [
        {
          cards: ["scha16"],
          type: "card-draw"
        }
      ],
      type: "card-effect"
    },
    {
      time: 138,
      type: "die-pass",
      playerId: "free-peoples"
    },
    {
      type: "die",
      time: 139,
      actions: [
        {
          type: "army-attack",
          toRegion: "lorien",
          fromRegion: "lorien"
        }
      ],
      playerId: "shadow",
      die: "character"
    },
    {
      playerId: "shadow",
      time: 140,
      actions: [
        {
          card: "scha14",
          type: "combat-card-choose"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      time: 141,
      playerId: "free-peoples",
      actions: [
        {
          card: "fpstr24",
          type: "combat-card-choose"
        }
      ]
    },
    {
      card: "scha14",
      playerId: "shadow",
      type: "card-effect",
      actions: [
        {
          type: "leader-forfeit",
          leaders: {
            nNazgul: 2,
            characters: ["the-witch-king"]
          }
        }
      ],
      time: 142
    },
    {
      time: 143,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [2]
        }
      ]
    },
    {
      type: "base",
      time: 143,
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [3, 3, 1, 6, 6]
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-re-roll",
          dice: [6]
        }
      ],
      type: "base",
      time: 144
    },
    {
      time: 144,
      actions: [
        {
          type: "combat-re-roll",
          dice: [5]
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      playerId: "shadow",
      time: 145,
      actions: [
        {
          type: "regular-unit-elimination",
          region: "lorien",
          quantity: 1,
          nation: "sauron"
        }
      ],
      type: "base"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          nation: "elves",
          quantity: 1,
          type: "elite-unit-elimination",
          region: "lorien"
        }
      ],
      type: "base",
      time: 146
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          region: "lorien",
          type: "battle-cease"
        }
      ],
      time: 147
    },
    {
      type: "character-effect",
      character: "the-witch-king",
      playerId: "shadow",
      actions: [
        {
          cards: ["scha03"],
          type: "card-draw"
        }
      ],
      time: 148
    },
    {
      die: "character",
      playerId: "free-peoples",
      type: "die",
      time: 149,
      actions: [
        {
          type: "fellowship-progress"
        }
      ]
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          dice: [2, 3],
          type: "hunt-roll"
        }
      ],
      time: 150
    },
    {
      type: "die",
      die: "muster",
      time: 151,
      actions: [
        {
          nation: "southrons",
          type: "political-advance",
          quantity: 1
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 152,
      type: "die",
      actions: [
        {
          cards: ["fpstr08"],
          type: "card-draw"
        }
      ],
      die: "event"
    },
    {
      card: "scha03",
      actions: [
        {
          type: "hunt-tile-add",
          tile: "r3s"
        }
      ],
      die: "character",
      type: "die-card",
      playerId: "shadow",
      time: 153
    },
    {
      playerId: "free-peoples",
      type: "die",
      actions: [
        {
          quantity: 1,
          nation: "north",
          type: "political-advance"
        }
      ],
      die: "muster-army",
      time: 154
    },
    {
      die: "muster-army",
      actions: [
        {
          type: "political-advance",
          quantity: 1,
          nation: "southrons"
        }
      ],
      type: "die",
      time: 155,
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      time: 156,
      playerId: "free-peoples",
      die: "will-of-the-west",
      type: "die"
    },
    {
      type: "base",
      playerId: "shadow",
      time: 157,
      actions: [
        {
          type: "hunt-roll",
          dice: [5, 2]
        }
      ]
    },
    {
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["1r"]
        }
      ],
      playerId: "shadow",
      time: 158,
      type: "base"
    },
    {
      time: 159,
      playerId: "free-peoples",
      type: "card-effect-skip",
      card: "fpcha05"
    },
    {
      time: 160,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "fellowship-corruption"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 161,
      actions: [
        {
          type: "fellowship-reveal",
          region: "southern-rhovanion"
        }
      ],
      type: "base"
    },
    {
      actions: [
        {
          type: "army-movement",
          leftUnits: {
            elites: [
              {
                nation: "isengard",
                quantity: 5
              }
            ],
            front: "shadow",
            regulars: [
              {
                nation: "isengard",
                quantity: 4
              }
            ],
            characters: []
          },
          fromRegion: "westemnet",
          toRegion: "folde"
        },
        {
          fromRegion: "dagorlad",
          type: "army-movement",
          toRegion: "north-ithilien"
        }
      ],
      die: "army",
      playerId: "shadow",
      type: "die",
      time: 162
    },
    {
      type: "die",
      die: "muster-army",
      time: 163,
      actions: [
        {
          nation: "gondor",
          quantity: 1,
          type: "political-advance"
        }
      ],
      playerId: "free-peoples"
    },
    {
      type: "die",
      playerId: "shadow",
      actions: [
        {
          type: "army-attack",
          fromRegion: "lorien",
          toRegion: "lorien"
        }
      ],
      die: "army",
      time: 164
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose",
          card: "scha16"
        }
      ],
      time: 165,
      type: "base"
    },
    {
      time: 166,
      type: "base",
      actions: [
        {
          type: "combat-card-choose",
          card: "fpstr08"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [5, 4, 3, 4, 1]
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 167
    },
    {
      type: "base",
      time: 167,
      playerId: "shadow",
      actions: [
        {
          dice: [2, 1, 1, 4, 1],
          type: "combat-roll"
        }
      ]
    },
    {
      type: "card-effect",
      time: 168,
      playerId: "shadow",
      actions: [
        {
          leaders: {
            nNazgul: 1
          },
          type: "leader-forfeit"
        }
      ],
      card: "scha16"
    },
    {
      playerId: "free-peoples",
      time: 169,
      actions: [
        {
          dice: [3, 1],
          type: "combat-re-roll"
        }
      ],
      type: "base"
    },
    {
      actions: [
        {
          type: "combat-re-roll",
          dice: [3, 5]
        }
      ],
      playerId: "shadow",
      time: 169,
      type: "base"
    },
    {
      playerId: "shadow",
      actions: [
        {
          nation: "sauron",
          region: "lorien",
          quantity: 2,
          type: "regular-unit-elimination"
        },
        {
          region: "lorien",
          nation: "sauron",
          quantity: 1,
          type: "elite-unit-elimination"
        }
      ],
      time: 170,
      type: "base"
    },
    {
      actions: [
        {
          region: "lorien",
          quantity: 1,
          type: "regular-unit-elimination",
          nation: "elves"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 171
    },
    {
      actions: [
        {
          cards: ["scha17"],
          type: "card-draw"
        }
      ],
      type: "character-effect",
      time: 172,
      playerId: "shadow",
      character: "the-witch-king"
    },
    {
      actions: [
        {
          cards: ["fpcha16", "fpstr05"],
          type: "card-draw"
        }
      ],
      type: "base",
      time: 173,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      type: "base",
      time: 173,
      actions: [
        {
          type: "card-draw",
          cards: ["scha20", "sstr02"]
        }
      ]
    },
    {
      time: 174,
      actions: [
        {
          type: "card-discard",
          cards: ["scha20"]
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      playerId: "free-peoples",
      time: 175,
      actions: [],
      type: "base"
    },
    {
      type: "base",
      time: 176,
      playerId: "shadow",
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          dice: ["muster", "character", "muster", "muster-army", "muster", "muster"],
          type: "action-roll"
        }
      ],
      playerId: "free-peoples",
      time: 177
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: ["character", "eye", "event", "eye", "eye", "eye", "muster", "eye"]
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 177
    },
    {
      type: "die",
      die: "character",
      playerId: "free-peoples",
      time: 178,
      actions: [
        {
          type: "fellowship-hide"
        }
      ]
    },
    {
      time: 179,
      type: "die-pass",
      playerId: "shadow"
    },
    {
      time: 180,
      die: "muster",
      actions: [
        {
          nation: "gondor",
          type: "political-advance",
          quantity: 1
        }
      ],
      type: "die",
      playerId: "free-peoples"
    },
    {
      time: 181,
      playerId: "shadow",
      type: "die-pass"
    },
    {
      time: 182,
      playerId: "free-peoples",
      type: "die",
      actions: [
        {
          region: "minas-tirith",
          type: "elite-unit-recruitment",
          quantity: 1,
          nation: "gondor"
        }
      ],
      die: "muster"
    },
    {
      die: "event",
      type: "die-card",
      actions: [
        {
          region: "far-harad",
          type: "regular-unit-recruitment",
          nation: "southrons",
          quantity: 5
        }
      ],
      time: 183,
      card: "sstr21",
      playerId: "shadow"
    },
    {
      type: "card-effect",
      actions: [
        {
          type: "card-draw",
          cards: ["sstr17"]
        }
      ],
      card: "scha21",
      time: 184,
      playerId: "shadow"
    },
    {
      type: "die",
      die: "muster",
      actions: [
        {
          nation: "gondor",
          region: "minas-tirith",
          type: "leader-recruitment",
          quantity: 1
        },
        {
          quantity: 1,
          region: "pelargir",
          type: "regular-unit-recruitment",
          nation: "gondor"
        }
      ],
      time: 185,
      playerId: "free-peoples"
    },
    {
      die: "character",
      playerId: "shadow",
      type: "die",
      actions: [
        {
          fromRegion: "lorien",
          toRegion: "lorien",
          type: "army-attack"
        }
      ],
      time: 186
    },
    {
      time: 187,
      type: "base",
      actions: [
        {
          card: "scha17",
          type: "combat-card-choose"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 188,
      type: "base",
      actions: [
        {
          card: "fpcha17",
          type: "combat-card-choose"
        }
      ]
    },
    {
      type: "combat-card-effect",
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [1, 4, 6]
        }
      ],
      time: 189,
      card: "scha17"
    },
    {
      playerId: "free-peoples",
      time: 190,
      actions: [
        {
          nation: "elves",
          quantity: 2,
          region: "lorien",
          type: "regular-unit-elimination"
        },
        {
          nation: "elves",
          quantity: 1,
          region: "lorien",
          type: "leader-elimination"
        },
        {
          characters: ["legolas"],
          type: "character-elimination"
        }
      ],
      card: "scha17",
      type: "card-effect"
    },
    {
      type: "character-effect",
      playerId: "shadow",
      actions: [
        {
          type: "card-draw",
          cards: ["scha11"]
        }
      ],
      time: 191,
      character: "the-witch-king"
    },
    {
      actions: [
        {
          nation: "north",
          type: "political-advance",
          quantity: 1
        }
      ],
      die: "muster",
      playerId: "free-peoples",
      time: 192,
      type: "die"
    },
    {
      type: "die",
      die: "muster",
      time: 193,
      actions: [
        {
          type: "nazgul-recruitment",
          region: "minas-morgul",
          quantity: 1
        },
        {
          type: "nazgul-recruitment",
          region: "moria",
          quantity: 1
        }
      ],
      playerId: "shadow"
    },
    {
      die: "muster-army",
      playerId: "free-peoples",
      actions: [
        {
          type: "elite-unit-recruitment",
          nation: "gondor",
          region: "dol-amroth",
          quantity: 1
        }
      ],
      type: "die",
      time: 194
    },
    {
      time: 195,
      type: "base",
      actions: [
        {
          cards: ["fpcha02", "fpstr18"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples"
    },
    {
      type: "base",
      actions: [
        {
          cards: ["scha09", "sstr14"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      time: 195
    },
    {
      playerId: "free-peoples",
      time: 196,
      type: "base",
      actions: [
        {
          cards: ["fpstr05"],
          type: "card-discard"
        }
      ]
    },
    {
      time: 196,
      actions: [
        {
          type: "card-discard",
          cards: ["sstr17", "scha11"]
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 197,
      actions: [],
      type: "base"
    },
    {
      actions: [
        {
          type: "hunt-allocation",
          quantity: 1
        }
      ],
      playerId: "shadow",
      time: 198,
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          dice: [
            "muster-army",
            "character",
            "muster-army",
            "character",
            "character",
            "will-of-the-west"
          ],
          type: "action-roll"
        }
      ],
      playerId: "free-peoples",
      time: 199
    },
    {
      time: 199,
      type: "base",
      actions: [
        {
          dice: [
            "character",
            "character",
            "muster",
            "army",
            "character",
            "eye",
            "character",
            "eye"
          ],
          type: "action-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          fromRegion: "dol-amroth",
          characters: ["aragorn"],
          type: "character-movement",
          toRegion: "helms-deep"
        }
      ],
      playerId: "free-peoples",
      card: "fpcha16",
      type: "die-card",
      time: 200,
      die: "character"
    },
    {
      type: "die",
      time: 201,
      playerId: "shadow",
      die: "character",
      actions: [
        {
          type: "army-attack",
          toRegion: "edoras",
          fromRegion: "westemnet"
        }
      ]
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 202
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      time: 203,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [2]
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 204
    },
    {
      type: "base",
      time: 204,
      playerId: "shadow",
      actions: [
        {
          dice: [6, 5, 5, 1, 2],
          type: "combat-roll"
        }
      ]
    },
    {
      actions: [
        {
          dice: [5],
          type: "combat-re-roll"
        }
      ],
      playerId: "free-peoples",
      time: 205,
      type: "base"
    },
    {
      actions: [
        {
          dice: [1, 2, 3, 1],
          type: "combat-re-roll"
        }
      ],
      playerId: "shadow",
      time: 205,
      type: "base"
    },
    {
      playerId: "shadow",
      time: 206,
      type: "base",
      actions: [
        {
          region: "westemnet",
          nation: "isengard",
          type: "regular-unit-elimination",
          quantity: 1
        }
      ]
    },
    {
      actions: [
        {
          region: "edoras",
          nation: "rohan",
          type: "elite-unit-downgrade",
          quantity: 1
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 207
    },
    {
      actions: [
        {
          region: "edoras",
          type: "battle-continue"
        }
      ],
      time: 208,
      playerId: "shadow",
      type: "base"
    },
    {
      type: "base",
      time: 209,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 210
    },
    {
      playerId: "free-peoples",
      time: 211,
      actions: [
        {
          type: "combat-roll",
          dice: [2]
        }
      ],
      type: "base"
    },
    {
      time: 211,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          dice: [6, 5, 3, 2, 3],
          type: "combat-roll"
        }
      ]
    },
    {
      time: 212,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [5]
        }
      ]
    },
    {
      actions: [
        {
          quantity: 1,
          nation: "isengard",
          region: "westemnet",
          type: "regular-unit-elimination"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 213
    },
    {
      type: "base",
      actions: [
        {
          type: "regular-unit-elimination",
          region: "edoras",
          nation: "rohan",
          quantity: 1
        },
        {
          quantity: 1,
          nation: "rohan",
          region: "edoras",
          type: "leader-elimination"
        }
      ],
      time: 214,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          leftUnits: {
            characters: [],
            regulars: [
              {
                nation: "isengard",
                quantity: 1
              }
            ],
            elites: [
              {
                quantity: 5,
                nation: "isengard"
              }
            ],
            front: "shadow"
          },
          type: "army-advance"
        }
      ],
      time: 215,
      type: "base",
      playerId: "shadow"
    },
    {
      time: 216,
      die: "muster-army",
      actions: [
        {
          type: "leader-recruitment",
          quantity: 1,
          nation: "rohan",
          region: "helms-deep"
        },
        {
          type: "leader-recruitment",
          nation: "gondor",
          region: "dol-amroth",
          quantity: 1
        }
      ],
      type: "die",
      playerId: "free-peoples"
    },
    {
      die: "character",
      playerId: "shadow",
      type: "die",
      actions: [
        {
          toRegion: "helms-deep",
          type: "army-attack",
          fromRegion: "westemnet"
        }
      ],
      time: 217
    },
    {
      type: "base",
      actions: [
        {
          type: "army-retreat-into-siege",
          region: "helms-deep"
        }
      ],
      time: 218,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 219,
      type: "base",
      actions: [
        {
          type: "army-advance"
        }
      ]
    },
    {
      type: "die-card",
      time: 220,
      actions: [
        {
          fromRegion: "helms-deep",
          toRegion: "pelargir",
          characters: ["aragorn"],
          type: "character-movement"
        },
        {
          quantity: 3,
          type: "regular-unit-recruitment",
          region: "pelargir",
          nation: "gondor"
        }
      ],
      die: "character",
      card: "fpcha22",
      playerId: "free-peoples"
    },
    {
      die: "army",
      playerId: "shadow",
      time: 221,
      actions: [
        {
          toRegion: "parth-celebrant",
          leftUnits: {
            front: "shadow",
            regulars: [
              {
                quantity: 1,
                nation: "isengard"
              }
            ],
            characters: [],
            elites: [],
            nNazgul: 0
          },
          type: "army-movement",
          fromRegion: "lorien"
        },
        {
          fromRegion: "far-harad",
          leftUnits: {
            elites: [],
            front: "shadow",
            regulars: [
              {
                quantity: 3,
                nation: "southrons"
              }
            ]
          },
          toRegion: "near-harad",
          type: "army-movement"
        }
      ],
      type: "die"
    },
    {
      actions: [
        {
          type: "hunt-tile-add",
          tile: "b0"
        }
      ],
      die: "will-of-the-west",
      playerId: "free-peoples",
      type: "die-card",
      card: "fpcha02",
      time: 222
    },
    {
      actions: [
        {
          region: "orthanc",
          quantity: 1,
          nation: "isengard",
          type: "regular-unit-recruitment"
        },
        {
          nation: "sauron",
          type: "regular-unit-recruitment",
          quantity: 1,
          region: "dol-guldur"
        }
      ],
      die: "muster",
      playerId: "shadow",
      type: "die",
      time: 223
    },
    {
      time: 224,
      die: "muster-army",
      playerId: "free-peoples",
      type: "die",
      actions: [
        {
          region: "pelargir",
          type: "regular-unit-recruitment",
          nation: "gondor",
          quantity: 1
        },
        {
          region: "dale",
          type: "regular-unit-recruitment",
          nation: "north",
          quantity: 1
        }
      ]
    },
    {
      die: "character",
      actions: [
        {
          fromRegion: "parth-celebrant",
          type: "army-movement",
          toRegion: "fangorn"
        }
      ],
      type: "die",
      playerId: "shadow",
      time: 225
    },
    {
      playerId: "free-peoples",
      type: "die",
      die: "character",
      time: 226,
      actions: [
        {
          type: "fellowship-progress"
        }
      ]
    },
    {
      playerId: "shadow",
      type: "base",
      time: 227,
      actions: [
        {
          type: "hunt-roll",
          dice: [4, 4, 4]
        }
      ]
    },
    {
      playerId: "shadow",
      time: 228,
      die: "character",
      actions: [
        {
          type: "nazgul-movement",
          nNazgul: 1,
          toRegion: "southern-rhovanion",
          fromRegion: "northern-rhovanion"
        },
        {
          fromRegion: "moria",
          toRegion: "noman-lands",
          nNazgul: 1,
          type: "nazgul-movement"
        },
        {
          type: "nazgul-movement",
          nNazgul: 1,
          toRegion: "dagorlad",
          fromRegion: "minas-morgul"
        },
        {
          fromRegion: "fangorn",
          type: "nazgul-movement",
          toRegion: "near-harad",
          nNazgul: 3
        },
        {
          type: "character-movement",
          fromRegion: "fangorn",
          characters: ["the-witch-king"],
          toRegion: "near-harad"
        }
      ],
      card: "scha09",
      type: "die-card"
    },
    {
      actions: [
        {
          type: "fellowship-reveal",
          region: "noman-lands"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 229
    },
    {
      type: "base",
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha21", "fpstr14"]
        }
      ],
      playerId: "free-peoples",
      time: 230
    },
    {
      playerId: "shadow",
      time: 230,
      actions: [
        {
          cards: ["scha10", "sstr19"],
          type: "card-draw"
        }
      ],
      type: "base"
    },
    {
      time: 231,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          cards: ["sstr19"],
          type: "card-discard"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 232,
      actions: [],
      type: "base"
    },
    {
      type: "base",
      time: 233,
      playerId: "shadow",
      actions: [
        {
          type: "hunt-allocation",
          quantity: 1
        }
      ]
    },
    {
      time: 234,
      playerId: "free-peoples",
      actions: [
        {
          type: "action-roll",
          dice: ["muster-army", "event", "muster", "event", "character", "will-of-the-west"]
        }
      ],
      type: "base"
    },
    {
      playerId: "shadow",
      time: 234,
      actions: [
        {
          type: "action-roll",
          dice: ["eye", "muster", "event", "eye", "muster-army", "muster", "event", "event"]
        }
      ],
      type: "base"
    },
    {
      die: "will-of-the-west",
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      playerId: "free-peoples",
      time: 235,
      type: "die"
    },
    {
      die: "muster-army",
      type: "die",
      actions: [
        {
          fromRegion: "fangorn",
          type: "army-movement",
          toRegion: "fords-of-isen"
        },
        {
          leftUnits: {
            nNazgul: 0,
            regulars: [
              {
                quantity: 3,
                nation: "southrons"
              }
            ],
            front: "shadow",
            elites: [],
            characters: []
          },
          type: "army-movement",
          fromRegion: "near-harad",
          toRegion: "umbar"
        }
      ],
      playerId: "shadow",
      time: 236
    },
    {
      actions: [
        {
          region: "lamedon",
          quantity: 1,
          nation: "gondor",
          type: "regular-unit-recruitment"
        },
        {
          type: "regular-unit-recruitment",
          nation: "north",
          quantity: 1,
          region: "dale"
        }
      ],
      time: 237,
      die: "muster",
      playerId: "free-peoples",
      type: "die"
    },
    {
      die: "army",
      elvenRing: {
        fromDie: "muster",
        ring: "vilya",
        toDie: "army"
      },
      type: "die",
      time: 238,
      playerId: "shadow",
      actions: [
        {
          toRegion: "helms-deep",
          fromRegion: "fords-of-isen",
          type: "army-movement"
        },
        {
          toRegion: "south-ithilien",
          type: "army-movement",
          fromRegion: "minas-morgul"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 239,
      die: "muster-army",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-recruitment",
          region: "dale",
          nation: "north"
        }
      ],
      type: "die"
    },
    {
      die: "event",
      actions: [
        {
          toRegion: "helms-deep",
          type: "army-attack",
          fromRegion: "helms-deep"
        }
      ],
      playerId: "shadow",
      type: "die-card",
      time: 240,
      card: "sstr02"
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow",
      time: 241,
      type: "base"
    },
    {
      actions: [
        {
          dice: [2, 6, 3, 2, 4],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples",
      time: 242,
      type: "base"
    },
    {
      time: 242,
      actions: [
        {
          dice: [1, 6, 6, 3, 5],
          type: "combat-roll"
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      type: "base",
      time: 243,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-re-roll",
          dice: [6, 1, 4]
        }
      ]
    },
    {
      playerId: "shadow",
      time: 243,
      actions: [
        {
          dice: [1, 5, 2],
          type: "combat-re-roll"
        }
      ],
      type: "base"
    },
    {
      playerId: "shadow",
      type: "base",
      time: 244,
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 2,
          region: "helms-deep",
          nation: "isengard"
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 245,
      actions: [
        {
          region: "helms-deep",
          nation: "rohan",
          type: "elite-unit-downgrade",
          quantity: 2
        }
      ]
    },
    {
      type: "base",
      time: 246,
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      time: 247,
      type: "base",
      actions: [
        {
          card: "fpcha21",
          type: "combat-card-choose"
        }
      ],
      playerId: "free-peoples"
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [5, 1, 4, 5, 2]
        }
      ],
      time: 248,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          dice: [6, 3, 3, 3, 6],
          type: "combat-roll"
        }
      ],
      time: 248
    },
    {
      time: 249,
      actions: [
        {
          type: "combat-re-roll",
          dice: [5, 5, 6]
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      type: "base",
      time: 249,
      playerId: "shadow",
      actions: [
        {
          dice: [6, 3, 3],
          type: "combat-re-roll"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "elite-unit-downgrade",
          quantity: 5,
          region: "helms-deep",
          nation: "isengard"
        },
        {
          region: "helms-deep",
          type: "regular-unit-elimination",
          quantity: 2,
          nation: "isengard"
        }
      ],
      time: 250,
      type: "base"
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 251,
      actions: [
        {
          nation: "rohan",
          region: "helms-deep",
          type: "regular-unit-elimination",
          quantity: 3
        }
      ]
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 252
    },
    {
      actions: [
        {
          card: "fpcha10",
          type: "combat-card-choose"
        }
      ],
      playerId: "free-peoples",
      time: 253,
      type: "base"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [3, 5]
        }
      ],
      playerId: "free-peoples",
      time: 254,
      type: "base"
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [4, 5, 1, 4, 1],
          type: "combat-roll"
        }
      ],
      time: 254,
      type: "base"
    },
    {
      time: 255,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [6]
        }
      ]
    },
    {
      card: "fpcha10",
      playerId: "free-peoples",
      type: "combat-card-effect-skip",
      time: 256
    },
    {
      playerId: "shadow",
      time: 257,
      actions: [
        {
          quantity: 2,
          type: "regular-unit-elimination",
          nation: "isengard",
          region: "helms-deep"
        }
      ],
      type: "base"
    },
    {
      time: 258,
      playerId: "shadow",
      type: "card-effect",
      actions: [
        {
          type: "card-draw",
          cards: ["sstr08"]
        }
      ],
      card: "scha21"
    },
    {
      die: "character",
      time: 259,
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die",
      playerId: "free-peoples"
    },
    {
      time: 260,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "hunt-roll",
          dice: [3, 6, 4]
        }
      ]
    },
    {
      type: "base",
      playerId: "shadow",
      time: 261,
      actions: [
        {
          dice: [2],
          type: "hunt-re-roll"
        }
      ]
    },
    {
      time: 262,
      type: "base",
      actions: [
        {
          tiles: ["1r"],
          type: "hunt-tile-draw"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 263,
      playerId: "free-peoples",
      type: "card-effect-skip",
      card: "fpcha05"
    },
    {
      time: 264,
      playerId: "free-peoples",
      actions: [
        {
          characters: ["gimli"],
          type: "character-elimination"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      time: 265,
      playerId: "free-peoples",
      actions: [
        {
          region: "dagorlad",
          type: "fellowship-reveal"
        }
      ]
    },
    {
      die: "muster",
      actions: [
        {
          quantity: 2,
          nation: "isengard",
          region: "orthanc",
          type: "regular-unit-upgrade"
        }
      ],
      time: 266,
      type: "die",
      playerId: "shadow",
      character: "saruman"
    },
    {
      time: 267,
      playerId: "free-peoples",
      actions: [
        {
          cards: ["fpcha12"],
          type: "card-draw"
        }
      ],
      die: "event",
      type: "die"
    },
    {
      playerId: "shadow",
      die: "event",
      actions: [
        {
          toRegion: "pelargir",
          type: "army-attack",
          fromRegion: "umbar"
        }
      ],
      time: 268,
      type: "die-card",
      card: "sstr10"
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-card-choose",
          card: "sstr04"
        }
      ],
      playerId: "shadow",
      time: 269
    },
    {
      type: "base",
      playerId: "free-peoples",
      time: 270,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      actions: [
        {
          region: "pelargir",
          nation: "gondor",
          quantity: 2,
          type: "regular-unit-elimination"
        }
      ],
      card: "sstr04",
      playerId: "shadow",
      type: "combat-card-effect",
      time: 271
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [2, 2, 6, 1, 5]
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 272
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [1, 3, 5, 2, 1]
        }
      ],
      time: 272
    },
    {
      actions: [
        {
          type: "combat-re-roll",
          dice: [1, 4]
        }
      ],
      time: 273,
      playerId: "free-peoples",
      type: "base"
    },
    {
      type: "base",
      time: 273,
      actions: [
        {
          dice: [4, 5, 4, 1],
          type: "combat-re-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 274,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          region: "umbar",
          quantity: 2,
          nation: "southrons",
          type: "regular-unit-elimination"
        }
      ]
    },
    {
      actions: [
        {
          type: "regular-unit-elimination",
          region: "pelargir",
          nation: "gondor",
          quantity: 1
        }
      ],
      type: "base",
      time: 275,
      playerId: "free-peoples"
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          toRegion: "lamedon",
          type: "army-retreat"
        }
      ],
      time: 276
    },
    {
      type: "card-effect",
      playerId: "shadow",
      actions: [
        {
          type: "card-draw",
          cards: ["sstr07"]
        }
      ],
      card: "scha21",
      time: 277
    },
    {
      card: "fpcha12",
      type: "die-card",
      actions: [
        {
          quantity: 2,
          type: "fellowship-heal"
        }
      ],
      die: "event",
      playerId: "free-peoples",
      time: 278
    },
    {
      time: 279,
      playerId: "shadow",
      actions: [
        {
          type: "army-movement",
          fromRegion: "near-harad",
          toRegion: "pelargir",
          leftUnits: {
            nNazgul: 0,
            regulars: [
              {
                quantity: 1,
                nation: "southrons"
              }
            ],
            front: "shadow",
            elites: [],
            characters: []
          }
        },
        {
          toRegion: "helms-deep",
          fromRegion: "orthanc",
          type: "army-movement",
          leftUnits: {
            elites: [],
            characters: ["saruman"],
            regulars: [
              {
                quantity: 1,
                nation: "isengard"
              }
            ],
            front: "shadow"
          }
        }
      ],
      die: "event",
      card: "sstr08",
      type: "die-card"
    },
    {
      time: 280,
      actions: [
        {
          cards: ["sstr24"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      card: "scha21",
      type: "card-effect"
    },
    {
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha23", "fpstr16"]
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 281
    },
    {
      actions: [
        {
          type: "card-draw",
          cards: ["scha05", "sstr11"]
        }
      ],
      time: 281,
      type: "base",
      playerId: "shadow"
    },
    {
      time: 282,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "card-discard",
          cards: ["sstr11"]
        }
      ]
    },
    {
      type: "base",
      time: 283,
      actions: [],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 284,
      actions: [
        {
          type: "hunt-allocation",
          quantity: 1
        }
      ],
      type: "base"
    },
    {
      type: "base",
      time: 285,
      actions: [
        {
          dice: ["character", "will-of-the-west", "event", "muster-army", "character", "muster"],
          type: "action-roll"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          dice: [
            "muster-army",
            "muster",
            "event",
            "muster",
            "character",
            "muster",
            "event",
            "army"
          ],
          type: "action-roll"
        }
      ],
      time: 285
    },
    {
      type: "die",
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      time: 286,
      die: "character"
    },
    {
      time: 287,
      actions: [
        {
          tiles: ["0r"],
          type: "hunt-tile-draw"
        }
      ],
      die: "event",
      playerId: "shadow",
      card: "scha05",
      type: "die-card"
    },
    {
      card: "scha21",
      type: "card-effect",
      actions: [
        {
          type: "card-draw",
          cards: ["scha08"]
        }
      ],
      time: 288,
      playerId: "shadow"
    },
    {
      actions: [
        {
          fromRegion: "old-forest-road",
          type: "army-movement",
          toRegion: "dale"
        },
        {
          fromRegion: "lamedon",
          leftUnits: {
            characters: [],
            front: "free-peoples",
            regulars: [
              {
                nation: "gondor",
                quantity: 3
              }
            ]
          },
          toRegion: "dol-amroth",
          type: "army-movement"
        }
      ],
      playerId: "free-peoples",
      type: "die",
      die: "muster-army",
      time: 289
    },
    {
      time: 290,
      playerId: "shadow",
      type: "die",
      actions: [
        {
          type: "army-attack",
          toRegion: "helms-deep",
          fromRegion: "helms-deep"
        }
      ],
      die: "army"
    },
    {
      time: 291,
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 292,
      actions: [
        {
          card: "fpstr16",
          type: "combat-card-choose"
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      time: 293,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: [3, 1],
          type: "combat-roll"
        }
      ]
    },
    {
      actions: [
        {
          dice: [1, 4, 5],
          type: "combat-roll"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 293
    },
    {
      type: "base",
      playerId: "free-peoples",
      time: 294,
      actions: [
        {
          dice: [6, 5],
          type: "combat-re-roll"
        }
      ]
    },
    {
      type: "base",
      time: 294,
      actions: [
        {
          type: "combat-re-roll",
          dice: [1, 3, 3]
        }
      ],
      playerId: "shadow"
    },
    {
      time: 295,
      actions: [
        {
          nation: "isengard",
          region: "helms-deep",
          quantity: 2,
          type: "regular-unit-elimination"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      playerId: "shadow",
      time: 296,
      type: "base",
      actions: [
        {
          region: "helms-deep",
          type: "battle-cease"
        }
      ]
    },
    {
      time: 297,
      card: "fpstr18",
      playerId: "free-peoples",
      die: "event",
      type: "die-card",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-recruitment",
          region: "dol-amroth",
          nation: "gondor"
        },
        {
          type: "leader-recruitment",
          region: "dol-amroth",
          nation: "gondor",
          quantity: 1
        }
      ]
    },
    {
      actions: [
        {
          toRegion: "helms-deep",
          type: "army-attack",
          fromRegion: "helms-deep"
        }
      ],
      time: 298,
      playerId: "shadow",
      type: "die",
      die: "muster-army"
    },
    {
      playerId: "shadow",
      time: 299,
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      type: "base",
      playerId: "free-peoples",
      time: 300,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 301,
      actions: [
        {
          type: "combat-roll",
          dice: [3, 2]
        }
      ],
      type: "base"
    },
    {
      time: 301,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          dice: [1, 4, 2, 6],
          type: "combat-roll"
        }
      ]
    },
    {
      time: 302,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [1, 5]
        }
      ]
    },
    {
      playerId: "shadow",
      time: 302,
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [2, 6, 5]
        }
      ]
    },
    {
      playerId: "shadow",
      type: "base",
      time: 303,
      actions: [
        {
          nation: "isengard",
          quantity: 1,
          type: "elite-unit-downgrade",
          region: "helms-deep"
        }
      ]
    },
    {
      actions: [
        {
          region: "helms-deep",
          quantity: 2,
          nation: "rohan",
          type: "regular-unit-elimination"
        },
        {
          nation: "rohan",
          quantity: 3,
          type: "leader-elimination",
          region: "helms-deep"
        }
      ],
      playerId: "free-peoples",
      time: 304,
      type: "base"
    },
    {
      time: 305,
      type: "die-pass",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      type: "die-card",
      card: "sstr24",
      time: 306,
      die: "muster",
      actions: [
        {
          nation: "sauron",
          quantity: 2,
          region: "minas-morgul",
          type: "regular-unit-recruitment"
        },
        {
          region: "dol-guldur",
          type: "regular-unit-recruitment",
          nation: "sauron",
          quantity: 2
        },
        {
          quantity: 2,
          nation: "sauron",
          region: "moria",
          type: "regular-unit-recruitment"
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 307
    },
    {
      actions: [
        {
          type: "elite-unit-recruitment",
          quantity: 1,
          nation: "isengard",
          region: "orthanc"
        }
      ],
      time: 308,
      playerId: "shadow",
      type: "die",
      die: "muster"
    },
    {
      die: "character",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die",
      time: 309,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "hunt-roll",
          dice: [6]
        }
      ],
      type: "base",
      time: 310,
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["2"]
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 311
    },
    {
      playerId: "free-peoples",
      type: "card-effect-skip",
      card: "fpcha05",
      time: 312
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 313,
      actions: [
        {
          region: "morannon",
          type: "fellowship-reveal"
        },
        {
          quantity: 1,
          type: "fellowship-corruption"
        }
      ]
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          tiles: ["0r"],
          type: "hunt-tile-draw"
        }
      ],
      time: 314
    },
    {
      die: "event",
      type: "die-card",
      actions: [
        {
          dice: [6, 5, 4],
          type: "combat-roll"
        }
      ],
      time: 315,
      card: "scha08",
      playerId: "shadow"
    },
    {
      type: "card-effect",
      card: "scha21",
      actions: [
        {
          cards: ["scha19"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      time: 316
    },
    {
      time: 317,
      playerId: "free-peoples",
      type: "die",
      die: "will-of-the-west",
      actions: [
        {
          type: "fellowship-hide"
        }
      ]
    },
    {
      die: "character",
      type: "die",
      actions: [
        {
          fromRegion: "pelargir",
          toRegion: "lamedon",
          type: "army-attack"
        }
      ],
      playerId: "shadow",
      time: 318
    },
    {
      type: "base",
      time: 319,
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      type: "base",
      playerId: "free-peoples",
      time: 320,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 321,
      actions: [
        {
          dice: [6, 1, 1],
          type: "combat-roll"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      time: 321,
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [1, 4, 1, 1, 5]
        }
      ]
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [6, 3, 3, 1]
        }
      ],
      time: 322
    },
    {
      playerId: "shadow",
      type: "base",
      time: 323,
      actions: [
        {
          nation: "southrons",
          type: "regular-unit-elimination",
          quantity: 1,
          region: "pelargir"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          nation: "gondor",
          region: "lamedon",
          type: "regular-unit-elimination",
          quantity: 2
        }
      ],
      time: 324,
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          type: "battle-continue",
          region: "lamedon"
        }
      ],
      playerId: "shadow",
      time: 325
    },
    {
      type: "base",
      time: 326,
      actions: [
        {
          type: "army-retreat",
          toRegion: "dol-amroth"
        }
      ],
      playerId: "free-peoples"
    },
    {
      time: 327,
      type: "base",
      actions: [
        {
          leftUnits: {
            elites: [],
            regulars: [
              {
                nation: "southrons",
                quantity: 1
              }
            ],
            nNazgul: 0,
            characters: [],
            front: "shadow"
          },
          type: "army-advance"
        }
      ],
      playerId: "shadow"
    },
    {
      die: "muster",
      actions: [
        {
          quantity: 1,
          nation: "gondor",
          type: "elite-unit-recruitment",
          region: "dol-amroth"
        }
      ],
      time: 328,
      type: "die",
      playerId: "free-peoples"
    },
    {
      character: "saruman",
      type: "die",
      die: "muster",
      time: 329,
      actions: [
        {
          quantity: 1,
          nation: "isengard",
          type: "regular-unit-recruitment",
          region: "north-dunland"
        },
        {
          type: "regular-unit-recruitment",
          quantity: 1,
          nation: "isengard",
          region: "south-dunland"
        },
        {
          quantity: 1,
          type: "regular-unit-recruitment",
          region: "orthanc",
          nation: "isengard"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      actions: [
        {
          cards: ["fpcha18", "fpstr03"],
          type: "card-draw"
        }
      ],
      time: 330,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 330,
      type: "base",
      actions: [
        {
          cards: ["scha15", "sstr16"],
          type: "card-draw"
        }
      ]
    },
    {
      actions: [
        {
          cards: ["sstr16"],
          type: "card-discard"
        }
      ],
      type: "base",
      time: 331,
      playerId: "shadow"
    },
    {
      type: "base",
      time: 332,
      playerId: "free-peoples",
      actions: []
    },
    {
      time: 333,
      playerId: "shadow",
      actions: [
        {
          type: "hunt-allocation",
          quantity: 1
        }
      ],
      type: "base"
    },
    {
      time: 334,
      actions: [
        {
          dice: [
            "will-of-the-west",
            "will-of-the-west",
            "muster-army",
            "character",
            "will-of-the-west",
            "muster"
          ],
          type: "action-roll"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          dice: ["character", "muster-army", "eye", "muster-army", "eye", "army", "event", "eye"],
          type: "action-roll"
        }
      ],
      time: 334
    },
    {
      type: "die",
      actions: [
        {
          cards: ["fpcha01"],
          type: "card-draw"
        }
      ],
      die: "will-of-the-west",
      playerId: "free-peoples",
      time: 335
    },
    {
      die: "muster-army",
      playerId: "shadow",
      actions: [
        {
          characters: ["the-mouth-of-sauron"],
          region: "minas-morgul",
          type: "character-play"
        }
      ],
      type: "die",
      time: 336
    },
    {
      type: "die-card",
      playerId: "free-peoples",
      card: "fpcha01",
      time: 337,
      actions: [
        {
          type: "hunt-tile-add",
          tile: "b0"
        }
      ],
      die: "will-of-the-west"
    },
    {
      type: "die",
      actions: [
        {
          type: "character-movement",
          characters: ["the-mouth-of-sauron"],
          toRegion: "north-ithilien",
          fromRegion: "minas-morgul"
        },
        {
          type: "nazgul-movement",
          nNazgul: 1,
          fromRegion: "southern-rhovanion",
          toRegion: "lamedon"
        },
        {
          toRegion: "north-ithilien",
          fromRegion: "noman-lands",
          nNazgul: 1,
          type: "nazgul-movement"
        },
        {
          type: "nazgul-movement",
          nNazgul: 1,
          toRegion: "north-ithilien",
          fromRegion: "dagorlad"
        }
      ],
      die: "character",
      playerId: "shadow",
      time: 338
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      die: "character",
      time: 339,
      type: "die"
    },
    {
      time: 340,
      type: "base",
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["2"]
        }
      ],
      playerId: "shadow"
    },
    {
      card: "fpcha05",
      type: "card-effect-skip",
      time: 341,
      playerId: "free-peoples"
    },
    {
      playerId: "free-peoples",
      time: 342,
      actions: [
        {
          type: "fellowship-reveal-in-mordor"
        },
        {
          type: "fellowship-corruption",
          quantity: 1
        }
      ],
      type: "base"
    },
    {
      playerId: "shadow",
      actions: [
        {
          region: "dol-amroth",
          type: "region-choose"
        },
        {
          dice: [3, 1, 2, 3, 1],
          type: "combat-roll"
        }
      ],
      die: "event",
      time: 343,
      card: "scha19",
      type: "die-card"
    },
    {
      actions: [
        {
          cards: ["scha01"],
          type: "card-draw"
        }
      ],
      card: "scha21",
      playerId: "shadow",
      type: "card-effect",
      time: 344
    },
    {
      time: 345,
      die: "muster",
      type: "die",
      playerId: "free-peoples",
      actions: [
        {
          region: "carrock",
          type: "regular-unit-recruitment",
          quantity: 1,
          nation: "north"
        },
        {
          nation: "north",
          region: "dale",
          type: "leader-recruitment",
          quantity: 1
        }
      ]
    },
    {
      actions: [
        {
          quantity: 1,
          type: "elite-unit-recruitment",
          region: "lamedon",
          nation: "sauron"
        }
      ],
      type: "die-card",
      die: "army",
      playerId: "shadow",
      time: 346,
      card: "sstr14"
    },
    {
      type: "die",
      playerId: "free-peoples",
      time: 347,
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      die: "will-of-the-west"
    },
    {
      type: "die",
      time: 348,
      playerId: "shadow",
      actions: [
        {
          type: "army-attack",
          toRegion: "dol-amroth",
          fromRegion: "lamedon"
        }
      ],
      die: "muster-army"
    },
    {
      actions: [
        {
          type: "army-not-retreat-into-siege",
          region: "dol-amroth"
        }
      ],
      playerId: "free-peoples",
      time: 349,
      type: "base"
    },
    {
      time: 350,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "combat-card-choose",
          card: "scha10"
        }
      ]
    },
    {
      type: "base",
      playerId: "free-peoples",
      time: 351,
      actions: [
        {
          type: "combat-card-choose",
          card: "fpcha23"
        }
      ]
    },
    {
      time: 352,
      actions: [
        {
          type: "leader-forfeit",
          leaders: {
            nNazgul: 2
          }
        }
      ],
      type: "card-effect",
      playerId: "shadow",
      card: "scha10"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [6, 6, 4, 4, 2]
        }
      ],
      time: 353,
      type: "base",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [1, 6, 2, 3],
          type: "combat-roll"
        }
      ],
      time: 353,
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [2, 2, 5]
        }
      ],
      playerId: "free-peoples",
      time: 354
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [1, 6, 6]
        }
      ],
      time: 354,
      type: "base"
    },
    {
      time: 355,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          nation: "southrons",
          region: "lamedon",
          quantity: 3,
          type: "regular-unit-elimination"
        }
      ]
    },
    {
      actions: [
        {
          region: "dol-amroth",
          nation: "gondor",
          quantity: 3,
          type: "regular-unit-elimination"
        }
      ],
      time: 356,
      type: "base",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          region: "dol-amroth",
          type: "battle-continue"
        }
      ],
      playerId: "shadow",
      time: 357,
      type: "base"
    },
    {
      actions: [
        {
          type: "army-retreat-into-siege",
          region: "dol-amroth"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 358
    },
    {
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 359
    },
    {
      actions: [
        {
          nation: "north",
          quantity: 1,
          region: "carrock",
          type: "regular-unit-recruitment"
        },
        {
          nation: "north",
          quantity: 1,
          type: "leader-recruitment",
          region: "dale"
        }
      ],
      time: 360,
      playerId: "free-peoples",
      die: "muster-army",
      type: "die"
    },
    {
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha09", "fpstr07"]
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 361
    },
    {
      playerId: "shadow",
      time: 361,
      type: "base",
      actions: [
        {
          type: "card-draw",
          cards: ["scha06", "sstr20"]
        }
      ]
    },
    {
      type: "base",
      playerId: "free-peoples",
      time: 362,
      actions: []
    },
    {
      time: 363,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ]
    },
    {
      type: "base",
      time: 364,
      playerId: "free-peoples",
      actions: [
        {
          dice: [
            "muster-army",
            "will-of-the-west",
            "will-of-the-west",
            "muster",
            "character",
            "muster"
          ],
          type: "action-roll"
        }
      ]
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: [
            "army",
            "character",
            "event",
            "character",
            "muster",
            "character",
            "eye",
            "muster",
            "muster-army"
          ]
        }
      ],
      playerId: "shadow",
      time: 364,
      type: "base"
    },
    {
      time: 365,
      type: "die-pass",
      playerId: "free-peoples"
    },
    {
      card: "scha01",
      type: "die-card",
      playerId: "shadow",
      die: "event",
      actions: [
        {
          tile: "rds",
          type: "hunt-tile-add"
        }
      ],
      time: 366
    },
    {
      actions: [
        {
          type: "card-draw",
          cards: ["scha13"]
        }
      ],
      type: "card-effect",
      playerId: "shadow",
      card: "scha21",
      time: 367
    },
    {
      playerId: "free-peoples",
      time: 368,
      type: "die-pass"
    },
    {
      time: 369,
      playerId: "shadow",
      die: "character",
      actions: [
        {
          type: "army-attack",
          toRegion: "osgiliath",
          fromRegion: "north-ithilien"
        }
      ],
      type: "die"
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          card: "scha06",
          type: "combat-card-choose"
        }
      ],
      time: 370
    },
    {
      time: 371,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      actions: [
        {
          type: "leader-forfeit",
          leaders: {
            nNazgul: 2
          }
        }
      ],
      card: "scha06",
      time: 372,
      playerId: "shadow",
      type: "card-effect"
    },
    {
      actions: [
        {
          dice: [3, 6],
          type: "combat-roll"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 373
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [3, 5, 1, 2, 2]
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 373
    },
    {
      actions: [
        {
          type: "combat-re-roll",
          dice: [1, 1, 1, 4]
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 374
    },
    {
      time: 375,
      playerId: "shadow",
      actions: [
        {
          nation: "sauron",
          region: "north-ithilien",
          type: "regular-unit-elimination",
          quantity: 1
        }
      ],
      type: "base"
    },
    {
      actions: [
        {
          nation: "gondor",
          type: "regular-unit-elimination",
          quantity: 1,
          region: "osgiliath"
        }
      ],
      time: 376,
      type: "base",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 377,
      type: "base",
      actions: [
        {
          region: "osgiliath",
          type: "battle-continue"
        }
      ]
    },
    {
      actions: [
        {
          toRegion: "druadan-forest",
          type: "army-retreat"
        }
      ],
      time: 378,
      playerId: "free-peoples",
      type: "base"
    },
    {
      type: "base",
      time: 379,
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "shadow"
    },
    {
      card: "fpcha14",
      time: 380,
      actions: [
        {
          tiles: ["er", "rers", "3"],
          type: "hunt-tile-draw"
        }
      ],
      type: "die-card",
      playerId: "free-peoples",
      die: "character"
    },
    {
      type: "die",
      playerId: "shadow",
      actions: [
        {
          type: "army-attack",
          fromRegion: "osgiliath",
          toRegion: "druadan-forest"
        }
      ],
      time: 381,
      die: "character"
    },
    {
      time: 382,
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 383
    },
    {
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          dice: [6],
          type: "combat-roll"
        }
      ],
      time: 384
    },
    {
      playerId: "shadow",
      type: "base",
      time: 384,
      actions: [
        {
          type: "combat-roll",
          dice: [5, 4, 5, 6, 4]
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "regular-unit-elimination",
          region: "osgiliath",
          nation: "sauron"
        }
      ],
      playerId: "shadow",
      time: 385
    },
    {
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 1,
          region: "druadan-forest",
          nation: "gondor"
        }
      ],
      time: 386,
      type: "base",
      playerId: "free-peoples"
    },
    {
      type: "base",
      actions: [
        {
          region: "osgiliath",
          type: "army-not-advance"
        }
      ],
      time: 387,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      die: "will-of-the-west",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      time: 388,
      type: "die"
    },
    {
      time: 389,
      type: "base",
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["3"]
        }
      ],
      playerId: "shadow"
    },
    {
      time: 390,
      card: "fpcha05",
      playerId: "free-peoples",
      type: "card-effect-skip"
    },
    {
      actions: [
        {
          type: "fellowship-reveal-in-mordor"
        },
        {
          type: "fellowship-corruption",
          quantity: 2
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 391
    },
    {
      time: 392,
      actions: [
        {
          toRegion: "minas-tirith",
          type: "army-attack",
          fromRegion: "osgiliath"
        }
      ],
      playerId: "shadow",
      type: "die",
      die: "army"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "army-retreat-into-siege",
          region: "minas-tirith"
        }
      ],
      type: "base",
      time: 393
    },
    {
      type: "base",
      time: 394,
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "die",
      actions: [
        {
          region: "dale",
          type: "elite-unit-recruitment",
          quantity: 1,
          nation: "north"
        }
      ],
      playerId: "free-peoples",
      die: "muster",
      time: 395
    },
    {
      playerId: "shadow",
      actions: [
        {
          quantity: 1,
          type: "fellowship-corruption"
        }
      ],
      type: "die-card",
      card: "scha13",
      die: "character",
      time: 396
    },
    {
      time: 397,
      type: "die",
      die: "muster-army",
      playerId: "free-peoples",
      actions: [
        {
          fromRegion: "dale",
          toRegion: "old-forest-road",
          type: "army-movement"
        },
        {
          toRegion: "mount-gram",
          fromRegion: "ettenmoors",
          type: "army-movement"
        }
      ]
    },
    {
      time: 398,
      playerId: "shadow",
      type: "die",
      die: "muster",
      actions: [
        {
          nation: "sauron",
          region: "mount-gundabad",
          type: "regular-unit-recruitment",
          quantity: 1
        },
        {
          nation: "sauron",
          type: "regular-unit-recruitment",
          region: "dol-guldur",
          quantity: 1
        }
      ]
    },
    {
      die: "will-of-the-west",
      type: "die",
      playerId: "free-peoples",
      time: 399,
      actions: [
        {
          type: "army-movement",
          fromRegion: "old-forest-road",
          toRegion: "rhosgobel"
        },
        {
          fromRegion: "carrock",
          type: "army-movement",
          toRegion: "rhosgobel"
        }
      ]
    },
    {
      playerId: "shadow",
      die: "muster-army",
      time: 400,
      actions: [
        {
          fromRegion: "moria",
          type: "army-movement",
          toRegion: "dimrill-dale"
        },
        {
          type: "army-movement",
          toRegion: "osgiliath",
          fromRegion: "south-ithilien"
        }
      ],
      type: "die"
    },
    {
      playerId: "free-peoples",
      type: "die-card",
      time: 401,
      die: "muster",
      card: "fpstr07",
      actions: [
        {
          fromRegion: "south-ered-luin",
          type: "character-movement",
          characters: ["meriadoc"],
          toRegion: "the-shire"
        },
        {
          toRegion: "rhosgobel",
          characters: ["gandalf-the-white"],
          type: "character-movement",
          fromRegion: "woodland-realm"
        }
      ]
    },
    {
      character: "the-mouth-of-sauron",
      type: "die",
      die: "muster",
      time: 402,
      actions: [
        {
          toRegion: "minas-tirith",
          type: "army-attack",
          fromRegion: "minas-tirith"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 403,
      playerId: "shadow"
    },
    {
      type: "base",
      playerId: "free-peoples",
      time: 404,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          dice: [6, 2, 2, 3, 3],
          type: "combat-roll"
        }
      ],
      time: 405
    },
    {
      type: "base",
      playerId: "shadow",
      time: 405,
      actions: [
        {
          type: "combat-roll",
          dice: [4, 5, 4, 4, 2]
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          dice: [6, 2],
          type: "combat-re-roll"
        }
      ],
      time: 406,
      type: "base"
    },
    {
      playerId: "shadow",
      time: 406,
      type: "base",
      actions: [
        {
          dice: [6, 3, 3, 5],
          type: "combat-re-roll"
        }
      ]
    },
    {
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 2,
          nation: "sauron",
          region: "minas-tirith"
        }
      ],
      time: 407,
      playerId: "shadow",
      type: "base"
    },
    {
      time: 408,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          nation: "gondor",
          region: "minas-tirith",
          type: "regular-unit-elimination",
          quantity: 1
        }
      ]
    },
    {
      playerId: "shadow",
      time: 409,
      actions: [
        {
          region: "minas-tirith",
          type: "battle-cease"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      time: 410,
      playerId: "free-peoples",
      actions: [
        {
          cards: ["fpcha04", "fpstr04"],
          type: "card-draw"
        }
      ]
    },
    {
      time: 410,
      actions: [
        {
          type: "card-draw",
          cards: ["scha04", "sstr22"]
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      time: 411,
      actions: [],
      playerId: "free-peoples",
      type: "base"
    },
    {
      time: 412,
      actions: [
        {
          type: "hunt-allocation",
          quantity: 1
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      type: "base",
      playerId: "free-peoples",
      time: 413,
      actions: [
        {
          dice: [
            "character",
            "will-of-the-west",
            "character",
            "will-of-the-west",
            "character",
            "character"
          ],
          type: "action-roll"
        }
      ]
    },
    {
      time: 413,
      playerId: "shadow",
      actions: [
        {
          type: "action-roll",
          dice: ["eye", "eye", "army", "muster", "event", "character", "eye", "army", "muster-army"]
        }
      ],
      type: "base"
    },
    {
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      die: "character",
      time: 414,
      type: "die",
      playerId: "free-peoples"
    },
    {
      type: "die-card",
      playerId: "shadow",
      actions: [
        {
          type: "hunt-tile-add",
          tile: "r1rs"
        }
      ],
      die: "event",
      card: "scha04",
      time: 415
    },
    {
      actions: [
        {
          cards: [],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      type: "card-effect",
      time: 416,
      card: "scha21"
    },
    {
      playerId: "free-peoples",
      card: "fpcha09",
      actions: [
        {
          dice: [2, 4, 3],
          type: "combat-roll"
        }
      ],
      type: "die-card",
      time: 417,
      die: "character"
    },
    {
      actions: [
        {
          type: "army-attack",
          toRegion: "minas-tirith",
          fromRegion: "minas-tirith"
        }
      ],
      die: "army",
      playerId: "shadow",
      time: 418,
      type: "die"
    },
    {
      type: "base",
      playerId: "shadow",
      time: 419,
      actions: [
        {
          type: "combat-card-choose",
          card: "sstr22"
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 420
    },
    {
      actions: [
        {
          dice: [1, 4, 3, 5],
          type: "combat-roll"
        }
      ],
      type: "base",
      time: 421,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [2, 3, 2, 1, 4],
          type: "combat-roll"
        }
      ],
      type: "base",
      time: 421
    },
    {
      actions: [
        {
          dice: [6, 1],
          type: "combat-re-roll"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 422
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [2, 1, 1, 6]
        }
      ],
      time: 422
    },
    {
      playerId: "shadow",
      actions: [
        {
          nation: "sauron",
          region: "minas-tirith",
          type: "regular-unit-elimination",
          quantity: 1
        },
        {
          nation: "sauron",
          type: "elite-unit-elimination",
          quantity: 1,
          region: "minas-tirith"
        }
      ],
      type: "base",
      time: 423
    },
    {
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          quantity: 1,
          region: "minas-tirith",
          type: "elite-unit-downgrade",
          nation: "gondor"
        }
      ],
      time: 424
    },
    {
      card: "fpcha04",
      time: 425,
      type: "die-card",
      die: "character",
      actions: [
        {
          tile: "b-1",
          type: "hunt-tile-add"
        }
      ],
      playerId: "free-peoples"
    },
    {
      time: 426,
      actions: [
        {
          type: "army-movement",
          fromRegion: "osgiliath",
          leftUnits: {
            nNazgul: 0,
            regulars: [
              {
                quantity: 4,
                nation: "sauron"
              }
            ],
            front: "shadow"
          },
          toRegion: "minas-tirith"
        },
        {
          toRegion: "pelargir",
          fromRegion: "osgiliath",
          type: "army-movement"
        }
      ],
      type: "die",
      playerId: "shadow",
      die: "army"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die",
      time: 427,
      die: "character"
    },
    {
      time: 428,
      actions: [
        {
          tiles: ["r1rs"],
          type: "hunt-tile-draw"
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      time: 429,
      card: "fpcha05",
      type: "card-effect-skip",
      playerId: "free-peoples"
    },
    {
      time: 430,
      actions: [
        {
          quantity: 1,
          type: "fellowship-corruption"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      type: "die",
      time: 431,
      die: "muster-army",
      actions: [
        {
          type: "army-attack",
          toRegion: "minas-tirith",
          fromRegion: "minas-tirith"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 432,
      actions: [
        {
          card: "sstr20",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 433
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [6, 3, 2, 4]
        }
      ],
      playerId: "free-peoples",
      time: 434,
      type: "base"
    },
    {
      time: 434,
      type: "base",
      actions: [
        {
          dice: [5, 6, 4, 3, 5],
          type: "combat-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 435,
      actions: [
        {
          dice: [4, 3],
          type: "combat-re-roll"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      time: 435,
      playerId: "shadow",
      actions: [
        {
          dice: [1, 5, 4, 4],
          type: "combat-re-roll"
        }
      ]
    },
    {
      time: 436,
      type: "base",
      actions: [
        {
          type: "regular-unit-elimination",
          nation: "sauron",
          region: "minas-tirith",
          quantity: 1
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      time: 437,
      playerId: "free-peoples",
      actions: [
        {
          type: "elite-unit-downgrade",
          nation: "gondor",
          region: "minas-tirith",
          quantity: 1
        }
      ]
    },
    {
      type: "combat-card-effect",
      playerId: "shadow",
      time: 438,
      card: "sstr20",
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 4,
          nation: "sauron",
          region: "minas-tirith"
        }
      ]
    },
    {
      type: "base",
      time: 439,
      actions: [
        {
          dice: [6, 5, 1, 5],
          type: "combat-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "regular-unit-elimination",
          nation: "gondor",
          region: "minas-tirith",
          quantity: 3
        }
      ],
      type: "combat-card-effect",
      time: 440,
      card: "sstr20",
      playerId: "free-peoples"
    },
    {
      die: "will-of-the-west",
      actions: [
        {
          toRegion: "north-anduin-vale",
          type: "army-movement",
          fromRegion: "rhosgobel"
        },
        {
          fromRegion: "ered-luin",
          type: "army-movement",
          toRegion: "tower-hills"
        }
      ],
      type: "die",
      time: 441,
      playerId: "free-peoples"
    },
    {
      time: 442,
      actions: [
        {
          type: "army-attack",
          toRegion: "minas-tirith",
          fromRegion: "minas-tirith"
        }
      ],
      type: "die",
      die: "character",
      playerId: "shadow"
    },
    {
      time: 443,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      time: 444,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [2]
        }
      ],
      type: "base",
      time: 445,
      playerId: "free-peoples"
    },
    {
      time: 445,
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [6, 2, 6, 3, 1]
        }
      ],
      type: "base"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-re-roll",
          dice: [4]
        }
      ],
      time: 446,
      type: "base"
    },
    {
      time: 447,
      type: "base",
      actions: [
        {
          region: "minas-tirith",
          type: "regular-unit-elimination",
          quantity: 1,
          nation: "gondor"
        },
        {
          region: "minas-tirith",
          type: "leader-elimination",
          nation: "gondor",
          quantity: 2
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "free-peoples",
      die: "will-of-the-west",
      time: 448,
      type: "die",
      actions: [
        {
          type: "army-attack",
          fromRegion: "north-anduin-vale",
          toRegion: "dimrill-dale"
        }
      ]
    },
    {
      time: 449,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 450,
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          dice: [1, 3, 4, 6, 5],
          type: "combat-roll"
        }
      ],
      time: 451,
      playerId: "free-peoples"
    },
    {
      time: 451,
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [6, 6, 1, 1]
        }
      ],
      playerId: "shadow"
    },
    {
      time: 452,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-re-roll",
          dice: [4, 4, 1]
        }
      ],
      type: "base"
    },
    {
      time: 453,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          region: "north-anduin-vale",
          nation: "north",
          quantity: 2,
          type: "regular-unit-elimination"
        }
      ]
    },
    {
      playerId: "shadow",
      time: 454,
      type: "base",
      actions: [
        {
          nation: "sauron",
          type: "regular-unit-elimination",
          quantity: 2,
          region: "dimrill-dale"
        }
      ]
    },
    {
      type: "base",
      time: 455,
      actions: [
        {
          region: "dimrill-dale",
          type: "battle-continue"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          toRegion: "lorien",
          type: "army-retreat"
        }
      ],
      playerId: "shadow",
      time: 456,
      type: "base"
    },
    {
      type: "base",
      time: 457,
      playerId: "free-peoples",
      actions: [
        {
          type: "army-advance"
        }
      ]
    },
    {
      actions: [
        {
          type: "elite-unit-recruitment",
          region: "moria",
          quantity: 1,
          nation: "sauron"
        }
      ],
      die: "muster",
      playerId: "shadow",
      type: "die",
      time: 458
    },
    {
      time: 459,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha13", "fpstr21"]
        }
      ]
    },
    {
      actions: [
        {
          cards: ["sstr09"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 459
    },
    {
      actions: [],
      type: "base",
      time: 460,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      type: "base",
      time: 461,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 462,
      actions: [
        {
          dice: ["muster-army", "muster-army", "muster", "muster", "event", "character"],
          type: "action-roll"
        }
      ]
    },
    {
      type: "base",
      time: 462,
      actions: [
        {
          dice: ["eye", "muster", "character", "eye", "eye", "eye", "muster", "eye", "muster"],
          type: "action-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "die",
      actions: [
        {
          type: "army-attack",
          toRegion: "moria",
          fromRegion: "dimrill-dale"
        }
      ],
      time: 463,
      die: "character"
    },
    {
      type: "base",
      playerId: "shadow",
      time: 464,
      actions: [
        {
          type: "army-retreat-into-siege",
          region: "moria"
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "free-peoples",
      time: 465
    },
    {
      time: 466,
      playerId: "shadow",
      type: "die",
      actions: [
        {
          fromRegion: "pelargir",
          type: "army-movement",
          leftUnits: {
            front: "shadow",
            characters: [],
            elites: [],
            nNazgul: 0,
            regulars: [
              {
                nation: "southrons",
                quantity: 1
              }
            ]
          },
          toRegion: "dol-amroth"
        }
      ],
      character: "the-mouth-of-sauron",
      die: "muster"
    },
    {
      actions: [
        {
          toRegion: "mount-gundabad",
          fromRegion: "mount-gram",
          type: "army-attack"
        }
      ],
      die: "muster-army",
      time: 467,
      type: "die",
      playerId: "free-peoples"
    },
    {
      time: 468,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "army-not-retreat-into-siege",
          region: "mount-gundabad"
        }
      ]
    },
    {
      actions: [
        {
          type: "combat-card-choose",
          card: "fpstr14"
        }
      ],
      playerId: "free-peoples",
      time: 469,
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 470,
      playerId: "shadow"
    },
    {
      type: "base",
      actions: [
        {
          dice: [6],
          type: "combat-roll"
        }
      ],
      time: 471,
      playerId: "free-peoples"
    },
    {
      card: "fpstr14",
      playerId: "shadow",
      actions: [
        {
          type: "regular-unit-elimination",
          nation: "sauron",
          quantity: 1,
          region: "mount-gundabad"
        }
      ],
      type: "combat-card-effect",
      time: 472
    },
    {
      time: 473,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: [5],
          type: "combat-roll"
        }
      ]
    },
    {
      time: 473,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [3, 6]
        }
      ]
    },
    {
      time: 474,
      type: "base",
      actions: [
        {
          quantity: 1,
          region: "mount-gram",
          nation: "north",
          type: "elite-unit-downgrade"
        }
      ],
      playerId: "free-peoples"
    },
    {
      type: "base",
      time: 475,
      actions: [
        {
          region: "mount-gundabad",
          type: "regular-unit-elimination",
          nation: "sauron",
          quantity: 1
        }
      ],
      playerId: "shadow"
    },
    {
      time: 476,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "battle-continue",
          region: "mount-gundabad"
        }
      ]
    },
    {
      actions: [
        {
          type: "army-retreat-into-siege",
          region: "mount-gundabad"
        }
      ],
      time: 477,
      type: "base",
      playerId: "shadow"
    },
    {
      time: 478,
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      actions: [
        {
          fromRegion: "dol-amroth",
          type: "army-attack",
          toRegion: "dol-amroth"
        }
      ],
      die: "character",
      time: 479,
      playerId: "shadow",
      type: "die"
    },
    {
      playerId: "shadow",
      time: 480,
      type: "base",
      actions: [
        {
          card: "sstr09",
          type: "combat-card-choose"
        }
      ]
    },
    {
      type: "base",
      time: 481,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples"
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [2, 5, 2, 3, 4]
        }
      ],
      time: 482,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          dice: [4, 4, 4, 2, 4],
          type: "combat-roll"
        }
      ],
      time: 482,
      type: "base",
      playerId: "shadow"
    },
    {
      type: "base",
      time: 483,
      actions: [
        {
          type: "combat-re-roll",
          dice: [5, 3, 5, 3]
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      type: "base",
      time: 483,
      actions: [
        {
          dice: [1, 5, 2, 1, 3],
          type: "combat-re-roll"
        }
      ]
    },
    {
      actions: [
        {
          quantity: 3,
          type: "regular-unit-elimination",
          nation: "southrons",
          region: "dol-amroth"
        }
      ],
      time: 484,
      type: "base",
      playerId: "shadow"
    },
    {
      type: "base",
      actions: [
        {
          type: "elite-unit-downgrade",
          quantity: 1,
          region: "dol-amroth",
          nation: "gondor"
        }
      ],
      time: 485,
      playerId: "free-peoples"
    },
    {
      type: "base",
      actions: [
        {
          type: "battle-cease",
          region: "dol-amroth"
        }
      ],
      playerId: "shadow",
      time: 486
    },
    {
      playerId: "shadow",
      type: "character-effect",
      character: "the-witch-king",
      actions: [
        {
          cards: ["sstr12"],
          type: "card-draw"
        }
      ],
      time: 487
    },
    {
      type: "die",
      playerId: "free-peoples",
      time: 488,
      actions: [
        {
          type: "army-attack",
          toRegion: "moria",
          fromRegion: "moria"
        }
      ],
      die: "muster-army"
    },
    {
      playerId: "free-peoples",
      time: 489,
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      type: "base",
      time: 490,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [2, 6, 6, 6, 2]
        }
      ],
      type: "base",
      time: 491
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [5]
        }
      ],
      playerId: "shadow",
      time: 491
    },
    {
      time: 492,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          region: "moria",
          quantity: 1,
          nation: "north",
          type: "regular-unit-elimination"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "elite-unit-elimination",
          region: "moria",
          quantity: 1,
          nation: "sauron"
        }
      ],
      time: 493,
      type: "base"
    },
    {
      type: "die-pass",
      time: 494,
      playerId: "shadow"
    },
    {
      card: "fpcha18",
      playerId: "free-peoples",
      type: "die-card",
      time: 495,
      die: "event",
      actions: [
        {
          region: "dol-amroth",
          type: "region-choose"
        },
        {
          dice: [4, 5, 5, 4, 6],
          type: "combat-roll"
        }
      ]
    },
    {
      time: 496,
      card: "fpcha18",
      playerId: "shadow",
      type: "card-effect",
      actions: [
        {
          quantity: 1,
          type: "nazgul-elimination",
          region: "dol-amroth"
        },
        {
          type: "nazgul-elimination",
          region: "dol-amroth",
          quantity: 1
        },
        {
          region: "dol-amroth",
          quantity: 1,
          type: "nazgul-elimination"
        },
        {
          nNazgul: 2,
          fromRegion: "dol-amroth",
          toRegion: "dol-guldur",
          type: "nazgul-movement"
        }
      ]
    },
    {
      card: "sstr12",
      time: 497,
      actions: [
        {
          toRegion: "angmar",
          fromRegion: "dol-amroth",
          type: "character-movement",
          characters: ["the-witch-king"]
        },
        {
          type: "regular-unit-recruitment",
          nation: "sauron",
          quantity: 2,
          region: "angmar"
        },
        {
          region: "angmar",
          quantity: 1,
          nation: "sauron",
          type: "elite-unit-recruitment"
        }
      ],
      die: "muster",
      type: "die-card",
      playerId: "shadow"
    },
    {
      time: 498,
      die: "muster",
      actions: [
        {
          quantity: 1,
          nation: "elves",
          type: "elite-unit-recruitment",
          region: "rivendell"
        },
        {
          cards: ["fpstr01"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples",
      card: "fpstr21",
      type: "die-card"
    },
    {
      time: 499,
      actions: [
        {
          region: "angmar",
          quantity: 1,
          nation: "sauron",
          type: "regular-unit-recruitment"
        },
        {
          nation: "southrons",
          quantity: 1,
          region: "north-rhun",
          type: "regular-unit-recruitment"
        }
      ],
      playerId: "shadow",
      type: "die",
      die: "muster"
    },
    {
      time: 500,
      playerId: "free-peoples",
      die: "muster",
      actions: [
        {
          type: "elite-unit-recruitment",
          quantity: 1,
          nation: "north",
          region: "the-shire"
        }
      ],
      type: "die"
    },
    {
      actions: [
        {
          cards: ["fpcha24", "fpstr20"],
          type: "card-draw"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 501
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "card-draw",
          cards: ["sstr01"]
        }
      ],
      type: "base",
      time: 501
    },
    {
      time: 502,
      actions: [],
      playerId: "free-peoples",
      type: "base"
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      time: 503
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: [
            "muster",
            "character",
            "event",
            "character",
            "will-of-the-west",
            "will-of-the-west"
          ]
        }
      ],
      time: 504,
      type: "base",
      playerId: "free-peoples"
    },
    {
      type: "base",
      time: 504,
      playerId: "shadow",
      actions: [
        {
          dice: [
            "army",
            "muster-army",
            "muster",
            "event",
            "eye",
            "character",
            "muster",
            "army",
            "muster-army"
          ],
          type: "action-roll"
        }
      ]
    },
    {
      time: 505,
      die: "will-of-the-west",
      type: "die",
      actions: [
        {
          fromRegion: "rivendell",
          type: "army-movement",
          toRegion: "troll-shaws",
          leftUnits: {
            front: "free-peoples",
            leaders: [],
            elites: [
              {
                quantity: 1,
                nation: "elves"
              }
            ]
          }
        },
        {
          type: "army-movement",
          toRegion: "evendim",
          fromRegion: "the-shire"
        }
      ],
      playerId: "free-peoples"
    },
    {
      card: "sstr07",
      die: "event",
      type: "die-card",
      actions: [
        {
          fromRegion: "south-rhun",
          type: "army-movement",
          toRegion: "north-rhun"
        }
      ],
      time: 506,
      playerId: "shadow"
    },
    {
      playerId: "shadow",
      card: "scha21",
      time: 507,
      actions: [
        {
          cards: ["sstr18"],
          type: "card-draw"
        }
      ],
      type: "card-effect"
    },
    {
      card: "fpstr04",
      type: "die-card",
      die: "muster",
      actions: [
        {
          characters: ["meriadoc"],
          toRegion: "ered-luin",
          fromRegion: "evendim",
          type: "character-movement"
        },
        {
          characters: ["gandalf-the-white"],
          toRegion: "troll-shaws",
          type: "character-movement",
          fromRegion: "moria"
        }
      ],
      playerId: "free-peoples",
      time: 508
    },
    {
      die: "army",
      actions: [
        {
          toRegion: "vale-of-the-carnen",
          type: "army-movement",
          fromRegion: "north-rhun"
        },
        {
          toRegion: "arnor",
          fromRegion: "angmar",
          type: "army-movement"
        }
      ],
      type: "die",
      time: 509,
      playerId: "shadow"
    },
    {
      type: "die-card",
      card: "fpstr20",
      playerId: "free-peoples",
      time: 510,
      die: "event",
      actions: [
        {
          region: "the-shire",
          type: "elite-unit-recruitment",
          nation: "north",
          quantity: 1
        },
        {
          quantity: 1,
          nation: "dwarves",
          type: "elite-unit-recruitment",
          region: "ered-luin"
        },
        {
          type: "card-draw",
          cards: ["fpstr12"]
        }
      ]
    },
    {
      actions: [
        {
          fromRegion: "vale-of-the-carnen",
          toRegion: "dale",
          type: "army-movement"
        },
        {
          type: "army-movement",
          toRegion: "south-anduin-vale",
          fromRegion: "dol-guldur"
        }
      ],
      die: "army",
      time: 511,
      type: "die",
      playerId: "shadow"
    },
    {
      time: 512,
      playerId: "free-peoples",
      type: "die",
      actions: [
        {
          fromRegion: "moria",
          type: "army-movement",
          leftUnits: {
            elites: [],
            front: "free-peoples",
            regulars: [
              {
                nation: "north",
                quantity: 1
              }
            ],
            characters: [],
            leaders: []
          },
          toRegion: "dimrill-dale"
        },
        {
          type: "army-movement",
          toRegion: "evendim",
          fromRegion: "ered-luin"
        }
      ],
      die: "will-of-the-west"
    },
    {
      playerId: "shadow",
      die: "character",
      actions: [
        {
          fromRegion: "arnor",
          type: "army-attack",
          toRegion: "evendim"
        }
      ],
      time: 513,
      type: "die"
    },
    {
      time: 514,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      time: 515,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose",
          card: "fpstr01"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      time: 516,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [6, 4, 2]
        }
      ]
    },
    {
      time: 516,
      type: "base",
      actions: [
        {
          dice: [5, 1, 6],
          type: "combat-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 517,
      actions: [
        {
          dice: [1],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      type: "base",
      time: 517,
      actions: [
        {
          type: "combat-re-roll",
          dice: [3]
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          nation: "sauron",
          region: "arnor",
          quantity: 1,
          type: "elite-unit-downgrade"
        }
      ],
      type: "base",
      time: 518
    },
    {
      playerId: "free-peoples",
      time: 519,
      type: "base",
      actions: [
        {
          nation: "north",
          type: "elite-unit-downgrade",
          quantity: 1,
          region: "evendim"
        },
        {
          type: "elite-unit-downgrade",
          nation: "dwarves",
          quantity: 1,
          region: "evendim"
        }
      ]
    },
    {
      time: 520,
      type: "base",
      actions: [
        {
          type: "battle-continue",
          region: "evendim"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "army-retreat",
          toRegion: "the-shire"
        }
      ],
      time: 521,
      type: "base",
      playerId: "free-peoples"
    },
    {
      time: 522,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "army-advance"
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 523
    },
    {
      actions: [
        {
          toRegion: "the-shire",
          type: "army-attack",
          fromRegion: "evendim"
        }
      ],
      time: 524,
      die: "muster-army",
      playerId: "shadow",
      type: "die"
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 525,
      playerId: "shadow",
      type: "base"
    },
    {
      playerId: "free-peoples",
      time: 526,
      type: "base",
      actions: [
        {
          type: "combat-card-choose",
          card: "fpcha24"
        }
      ]
    },
    {
      type: "base",
      time: 527,
      actions: [
        {
          dice: [6, 2, 1, 4],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [5, 4, 3]
        }
      ],
      time: 527,
      playerId: "shadow",
      type: "base"
    },
    {
      time: 528,
      actions: [
        {
          dice: [4],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [1, 4]
        }
      ],
      time: 528
    },
    {
      actions: [
        {
          type: "regular-unit-elimination",
          region: "evendim",
          nation: "sauron",
          quantity: 1
        }
      ],
      time: 529,
      type: "base",
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "battle-continue",
          region: "the-shire"
        }
      ],
      type: "base",
      time: 530,
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "army-not-retreat"
        }
      ],
      time: 531,
      playerId: "free-peoples",
      type: "base"
    },
    {
      type: "base",
      playerId: "shadow",
      time: 532,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 533,
      type: "base",
      playerId: "free-peoples"
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 534,
      actions: [
        {
          dice: [2, 5, 5, 4],
          type: "combat-roll"
        }
      ]
    },
    {
      playerId: "shadow",
      type: "base",
      time: 534,
      actions: [
        {
          dice: [3, 2, 3],
          type: "combat-roll"
        }
      ]
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-re-roll",
          dice: [5]
        }
      ],
      time: 535
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [1, 3]
        }
      ],
      time: 535
    },
    {
      playerId: "shadow",
      time: 536,
      actions: [
        {
          region: "evendim",
          nation: "sauron",
          type: "regular-unit-elimination",
          quantity: 3
        },
        {
          characters: ["the-witch-king"],
          type: "character-elimination"
        }
      ],
      type: "base"
    },
    {
      actions: [
        {
          toRegion: "dol-guldur",
          fromRegion: "dimrill-dale",
          leftUnits: {
            elites: [
              {
                nation: "north",
                quantity: 1
              }
            ],
            front: "free-peoples",
            regulars: [],
            characters: [],
            leaders: []
          },
          type: "army-movement"
        }
      ],
      playerId: "free-peoples",
      die: "event",
      elvenRing: {
        ring: "nenya",
        fromDie: "character",
        toDie: "event"
      },
      type: "die-card",
      card: "fpstr12",
      time: 537
    },
    {
      playerId: "shadow",
      die: "muster-army",
      type: "die",
      actions: [
        {
          type: "army-attack",
          fromRegion: "south-anduin-vale",
          toRegion: "dimrill-dale"
        }
      ],
      time: 538
    },
    {
      playerId: "shadow",
      type: "base",
      time: 539,
      actions: [
        {
          type: "combat-card-choose",
          card: "sstr18"
        }
      ]
    },
    {
      type: "base",
      time: 540,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples"
    },
    {
      time: 541,
      type: "combat-card-effect",
      playerId: "shadow",
      card: "sstr18",
      actions: [
        {
          nation: "sauron",
          type: "regular-unit-elimination",
          region: "south-anduin-vale",
          quantity: 1
        }
      ]
    },
    {
      type: "base",
      playerId: "free-peoples",
      time: 542,
      actions: [
        {
          type: "combat-roll",
          dice: [3]
        }
      ]
    },
    {
      time: 542,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [3, 6, 5]
        }
      ]
    },
    {
      time: 543,
      actions: [
        {
          region: "dimrill-dale",
          nation: "north",
          quantity: 1,
          type: "elite-unit-elimination"
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      type: "base",
      time: 544,
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 545,
      type: "die-pass"
    },
    {
      playerId: "shadow",
      time: 546,
      character: "the-mouth-of-sauron",
      die: "muster",
      type: "die",
      actions: [
        {
          toRegion: "moria",
          type: "army-attack",
          fromRegion: "dimrill-dale"
        }
      ]
    },
    {
      time: 547,
      actions: [
        {
          type: "army-retreat-into-siege",
          region: "moria"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      type: "base",
      time: 548,
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "die",
      time: 549,
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      die: "character"
    },
    {
      elvenRing: {
        ring: "nenya",
        toDie: "army",
        fromDie: "muster"
      },
      type: "die",
      die: "army",
      actions: [
        {
          fromRegion: "moria",
          type: "army-attack",
          toRegion: "moria"
        }
      ],
      time: 550,
      playerId: "shadow"
    },
    {
      playerId: "shadow",
      actions: [
        {
          card: "sstr01",
          type: "combat-card-choose"
        }
      ],
      time: 551,
      type: "base"
    },
    {
      time: 552,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      type: "base",
      time: 553,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [1]
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          dice: [6, 5, 2],
          type: "combat-roll"
        }
      ],
      playerId: "shadow",
      time: 553
    },
    {
      time: 554,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          region: "moria",
          quantity: 1,
          nation: "north",
          type: "regular-unit-elimination"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha08", "fpstr22"]
        }
      ],
      time: 555,
      type: "base"
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "card-draw",
          cards: []
        }
      ],
      time: 555
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [],
      time: 556
    },
    {
      type: "base",
      time: 557,
      playerId: "shadow",
      actions: [
        {
          type: "hunt-allocation",
          quantity: 1
        }
      ]
    },
    {
      actions: [
        {
          dice: [
            "character",
            "muster-army",
            "character",
            "character",
            "muster-army",
            "will-of-the-west"
          ],
          type: "action-roll"
        }
      ],
      time: 558,
      playerId: "free-peoples",
      type: "base"
    },
    {
      time: 558,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "action-roll",
          dice: ["character", "muster", "army", "character", "army", "event", "muster", "army"]
        }
      ]
    },
    {
      time: 559,
      playerId: "free-peoples",
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      die: "character"
    },
    {
      playerId: "shadow",
      type: "base",
      time: 560,
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["er"]
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 561,
      card: "fpcha05",
      type: "card-effect-skip"
    },
    {
      time: 562,
      actions: [
        {
          type: "fellowship-corruption",
          quantity: 1
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      actions: [
        {
          fromRegion: "moria",
          type: "nazgul-movement",
          nNazgul: 2,
          toRegion: "dale"
        },
        {
          nNazgul: 2,
          fromRegion: "minas-tirith",
          type: "nazgul-movement",
          toRegion: "dale"
        },
        {
          type: "nazgul-movement",
          toRegion: "vale-of-the-carnen",
          fromRegion: "dale",
          nNazgul: 4
        },
        {
          toRegion: "dale",
          nNazgul: 4,
          type: "nazgul-movement",
          fromRegion: "vale-of-the-carnen"
        },
        {
          fromRegion: "minas-tirith",
          characters: ["the-mouth-of-sauron"],
          toRegion: "parth-celebrant",
          type: "character-movement"
        }
      ],
      die: "character",
      type: "die",
      time: 563,
      playerId: "shadow"
    },
    {
      type: "die",
      die: "muster-army",
      playerId: "free-peoples",
      time: 564,
      actions: [
        {
          quantity: 1,
          region: "woodland-realm",
          nation: "elves",
          type: "elite-unit-recruitment"
        }
      ]
    },
    {
      die: "character",
      type: "die",
      playerId: "shadow",
      time: 565,
      actions: [
        {
          fromRegion: "dale",
          toRegion: "woodland-realm",
          type: "army-attack"
        }
      ]
    },
    {
      time: 566,
      playerId: "free-peoples",
      actions: [
        {
          region: "woodland-realm",
          type: "army-retreat-into-siege"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      playerId: "shadow",
      time: 567,
      actions: [
        {
          type: "army-advance"
        }
      ]
    },
    {
      time: 568,
      type: "die-pass",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          toRegion: "woodland-realm",
          type: "army-attack",
          fromRegion: "woodland-realm"
        }
      ],
      type: "die",
      time: 569,
      die: "army",
      playerId: "shadow"
    },
    {
      time: 570,
      type: "base",
      actions: [
        {
          type: "combat-card-choose",
          card: "scha15"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 571,
      actions: [
        {
          card: "fpstr22",
          type: "combat-card-choose"
        }
      ],
      type: "base"
    },
    {
      time: 572,
      card: "scha15",
      type: "combat-card-effect-skip",
      playerId: "shadow"
    },
    {
      type: "base",
      playerId: "free-peoples",
      time: 573,
      actions: [
        {
          type: "combat-roll",
          dice: [1, 5, 1]
        }
      ]
    },
    {
      type: "base",
      playerId: "shadow",
      time: 573,
      actions: [
        {
          dice: [5, 2, 5, 1, 5],
          type: "combat-roll"
        }
      ]
    },
    {
      actions: [
        {
          type: "combat-re-roll",
          dice: [5]
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 574
    },
    {
      actions: [
        {
          type: "combat-re-roll",
          dice: [2, 2, 5, 3]
        }
      ],
      time: 574,
      type: "base",
      playerId: "shadow"
    },
    {
      type: "base",
      actions: [
        {
          region: "woodland-realm",
          nation: "southrons",
          type: "regular-unit-elimination",
          quantity: 2
        }
      ],
      time: 575,
      playerId: "shadow"
    },
    {
      type: "base",
      time: 576,
      playerId: "shadow",
      actions: [
        {
          type: "battle-cease",
          region: "woodland-realm"
        }
      ]
    },
    {
      die: "muster-army",
      type: "die",
      playerId: "free-peoples",
      time: 577,
      actions: [
        {
          toRegion: "dale",
          type: "army-movement",
          fromRegion: "erebor"
        },
        {
          fromRegion: "troll-shaws",
          type: "army-movement",
          toRegion: "ettenmoors"
        }
      ]
    },
    {
      time: 578,
      playerId: "shadow",
      actions: [
        {
          fromRegion: "woodland-realm",
          type: "army-attack",
          toRegion: "woodland-realm"
        }
      ],
      die: "army",
      type: "die"
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 579
    },
    {
      type: "base",
      time: 580,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples"
    },
    {
      time: 581,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [4, 4, 2]
        }
      ]
    },
    {
      time: 581,
      actions: [
        {
          dice: [4, 4, 1, 3, 3],
          type: "combat-roll"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 582,
      actions: [
        {
          dice: [3],
          type: "combat-re-roll"
        }
      ],
      type: "base"
    },
    {
      actions: [
        {
          dice: [5, 6, 5, 5],
          type: "combat-re-roll"
        }
      ],
      time: 582,
      type: "base",
      playerId: "shadow"
    },
    {
      time: 583,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          nation: "elves",
          region: "woodland-realm",
          type: "regular-unit-elimination",
          quantity: 1
        }
      ]
    },
    {
      time: 584,
      playerId: "shadow",
      actions: [
        {
          region: "woodland-realm",
          nation: "southrons",
          type: "elite-unit-downgrade",
          quantity: 1
        },
        {
          type: "battle-continue",
          region: "woodland-realm"
        }
      ],
      type: "base"
    },
    {
      playerId: "shadow",
      type: "base",
      time: 585,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      type: "base",
      time: 586,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          dice: [2, 2],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples",
      time: 587,
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          dice: [5, 3, 3, 2, 5],
          type: "combat-roll"
        }
      ],
      time: 587,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          dice: [4],
          type: "combat-re-roll"
        }
      ],
      time: 588
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [2, 4, 2, 4]
        }
      ],
      type: "base",
      time: 588
    },
    {
      time: 589,
      type: "die-pass",
      playerId: "free-peoples"
    },
    {
      die: "army",
      actions: [
        {
          type: "army-attack",
          fromRegion: "woodland-realm",
          toRegion: "woodland-realm"
        }
      ],
      type: "die",
      playerId: "shadow",
      time: 590
    },
    {
      time: 591,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 592,
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      time: 593,
      actions: [
        {
          type: "combat-roll",
          dice: [5, 2]
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [5, 2, 4, 5, 4],
          type: "combat-roll"
        }
      ],
      type: "base",
      time: 593
    },
    {
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [3]
        }
      ],
      time: 594
    },
    {
      actions: [
        {
          dice: [5, 6, 3, 5],
          type: "combat-re-roll"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 594
    },
    {
      time: 595,
      actions: [
        {
          nation: "southrons",
          region: "woodland-realm",
          quantity: 1,
          type: "regular-unit-elimination"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      time: 596,
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-downgrade",
          region: "woodland-realm",
          nation: "elves"
        }
      ],
      playerId: "free-peoples"
    },
    {
      time: 597,
      type: "die",
      playerId: "free-peoples",
      die: "will-of-the-west",
      actions: [
        {
          toRegion: "mount-gram",
          fromRegion: "ettenmoors",
          type: "army-movement"
        },
        {
          fromRegion: "iron-hills",
          type: "army-movement",
          toRegion: "dale"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          fromRegion: "woodland-realm",
          toRegion: "woodland-realm",
          type: "army-attack"
        }
      ],
      type: "die",
      time: 598,
      character: "the-mouth-of-sauron",
      die: "muster"
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      time: 599,
      playerId: "shadow"
    },
    {
      type: "base",
      time: 600,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      type: "base",
      playerId: "free-peoples",
      time: 601,
      actions: [
        {
          type: "combat-roll",
          dice: [3, 2]
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [4, 4, 1, 4],
          type: "combat-roll"
        }
      ],
      time: 601,
      type: "base"
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: [3],
          type: "combat-re-roll"
        }
      ],
      time: 602
    },
    {
      type: "base",
      time: 602,
      actions: [
        {
          dice: [5, 6, 5, 1],
          type: "combat-re-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 603,
      actions: [
        {
          nation: "elves",
          type: "elite-unit-downgrade",
          quantity: 1,
          region: "woodland-realm"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 604,
      type: "die",
      die: "character",
      actions: [
        {
          type: "army-movement",
          fromRegion: "mount-gram",
          toRegion: "mount-gundabad"
        }
      ]
    },
    {
      playerId: "shadow",
      time: 605,
      die: "muster",
      type: "die",
      actions: [
        {
          type: "regular-unit-recruitment",
          region: "angmar",
          nation: "sauron",
          quantity: 1
        },
        {
          nation: "sauron",
          type: "regular-unit-recruitment",
          region: "moria",
          quantity: 1
        }
      ]
    },
    {
      type: "die",
      die: "character",
      actions: [
        {
          toRegion: "mount-gundabad",
          fromRegion: "mount-gundabad",
          type: "army-attack"
        }
      ],
      playerId: "free-peoples",
      time: 606
    },
    {
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 607
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 608,
      type: "base"
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 609,
      actions: [
        {
          type: "combat-roll",
          dice: [2, 5, 4]
        }
      ]
    },
    {
      actions: [
        {
          dice: [2],
          type: "combat-roll"
        }
      ],
      playerId: "shadow",
      time: 609,
      type: "base"
    },
    {
      actions: [
        {
          type: "combat-re-roll",
          dice: [3, 3]
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 610
    },
    {
      time: 611,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-downgrade",
          region: "mount-gundabad",
          nation: "elves"
        },
        {
          region: "mount-gundabad",
          type: "battle-continue"
        }
      ]
    },
    {
      time: 612,
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples"
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow",
      time: 613
    },
    {
      playerId: "free-peoples",
      time: 614,
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [6, 2, 6]
        }
      ]
    },
    {
      time: 614,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [1]
        }
      ]
    },
    {
      type: "base",
      time: 615,
      playerId: "shadow",
      actions: [
        {
          region: "mount-gundabad",
          nation: "sauron",
          quantity: 1,
          type: "regular-unit-elimination"
        }
      ]
    },
    {
      actions: [
        {
          type: "action-die-skip",
          die: "event"
        }
      ],
      type: "die",
      playerId: "shadow",
      time: 616,
      die: "event"
    }
  ]
};
