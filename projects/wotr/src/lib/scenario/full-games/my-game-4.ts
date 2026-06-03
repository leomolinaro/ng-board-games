import { WotrScenarioDefinition } from "../wotr-scenario";
import { WotrStoriesBuilder } from "../wotr-story-builder";

export const scenario: WotrScenarioDefinition = {
  options: {
    tokens: [],
    expansions: [],
    variants: []
  },
  stories: (b: WotrStoriesBuilder) => [
    {
      type: "base",
      actions: [
        {
          cards: ["fpcha10", "fpstr05"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples",
      time: 1
    },
    {
      time: 1,
      playerId: "shadow",
      actions: [
        {
          cards: ["scha21", "sstr20"],
          type: "card-draw"
        }
      ],
      type: "base"
    },
    {
      playerId: "free-peoples",
      time: 2,
      type: "base",
      actions: []
    },
    {
      type: "base",
      actions: [
        {
          quantity: 0,
          type: "hunt-allocation"
        }
      ],
      playerId: "shadow",
      time: 3
    },
    {
      playerId: "free-peoples",
      time: 4,
      type: "base",
      actions: [
        {
          type: "action-roll",
          dice: ["character", "character", "muster-army", "character"]
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          type: "action-roll",
          dice: ["muster", "eye", "muster-army", "army", "army", "eye", "event"]
        }
      ],
      playerId: "shadow",
      time: 4
    },
    {
      playerId: "free-peoples",
      time: 5,
      type: "die-pass"
    },
    {
      time: 6,
      playerId: "shadow",
      actions: [
        {
          quantity: 1,
          type: "political-advance",
          nation: "isengard"
        }
      ],
      type: "die",
      die: "muster"
    },
    {
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      playerId: "free-peoples",
      time: 7,
      die: "character"
    },
    {
      time: 8,
      playerId: "shadow",
      actions: [
        {
          dice: [6, 3],
          type: "hunt-roll"
        }
      ],
      type: "base"
    },
    {
      time: 9,
      playerId: "shadow",
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["3"]
        }
      ],
      type: "base"
    },
    {
      playerId: "free-peoples",
      time: 10,
      type: "base",
      actions: [
        {
          characters: ["gandalf-the-grey"],
          type: "character-elimination"
        },
        {
          companion: "strider",
          type: "fellowship-guide"
        }
      ]
    },
    {
      time: 11,
      playerId: "shadow",
      actions: [
        {
          fromRegion: "north-dunland",
          type: "army-movement",
          toRegion: "moria"
        },
        {
          fromRegion: "dol-guldur",
          type: "army-movement",
          toRegion: "south-anduin-vale"
        }
      ],
      type: "die",
      die: "army"
    },
    {
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die",
      time: 12,
      playerId: "free-peoples",
      die: "character"
    },
    {
      playerId: "shadow",
      time: 13,
      type: "base",
      actions: [
        {
          type: "hunt-roll",
          dice: [1, 4]
        }
      ]
    },
    {
      die: "muster-army",
      playerId: "shadow",
      time: 14,
      type: "die",
      actions: [
        {
          region: "orthanc",
          characters: ["saruman"],
          type: "character-play"
        }
      ]
    },
    {
      die: "muster-army",
      actions: [
        {
          toRegion: "old-forest-road",
          type: "army-movement",
          fromRegion: "carrock"
        },
        {
          fromRegion: "edoras",
          toRegion: "westemnet",
          type: "army-movement"
        }
      ],
      type: "die",
      time: 15,
      playerId: "free-peoples"
    },
    {
      die: "event",
      card: "scha21",
      playerId: "shadow",
      time: 16,
      type: "die-card",
      actions: [
        {
          card: "scha21",
          type: "card-play-on-table"
        }
      ]
    },
    {
      die: "character",
      type: "die",
      actions: [
        {
          card: "scha21",
          type: "card-discard-from-table"
        },
        {
          elvenRing: "vilya",
          type: "elven-ring-use"
        }
      ],
      playerId: "free-peoples",
      time: 17
    },
    {
      type: "die",
      actions: [
        {
          fromRegion: "south-anduin-vale",
          type: "army-movement",
          toRegion: "dimrill-dale"
        },
        {
          fromRegion: "moria",
          toRegion: "dimrill-dale",
          type: "army-movement"
        }
      ],
      playerId: "shadow",
      time: 18,
      die: "army"
    },
    {
      actions: [
        {
          cards: ["fpcha01", "fpstr22"],
          type: "card-draw"
        }
      ],
      type: "base",
      time: 19,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 19,
      type: "base",
      actions: [
        {
          cards: ["scha03", "sstr07"],
          type: "card-draw"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 20,
      type: "base",
      actions: []
    },
    {
      playerId: "shadow",
      time: 21,
      type: "base",
      actions: [
        {
          quantity: 2,
          type: "hunt-allocation"
        }
      ]
    },
    {
      time: 22,
      playerId: "free-peoples",
      actions: [
        {
          dice: ["event", "muster", "will-of-the-west", "character"],
          type: "action-roll"
        }
      ],
      type: "base"
    },
    {
      playerId: "shadow",
      time: 22,
      type: "base",
      actions: [
        {
          dice: ["muster", "army", "event", "event", "army", "eye"],
          type: "action-roll"
        }
      ]
    },
    {
      die: "will-of-the-west",
      time: 23,
      playerId: "free-peoples",
      actions: [
        {
          type: "character-play",
          region: "fangorn",
          characters: ["gandalf-the-white"]
        }
      ],
      type: "die"
    },
    {
      die: "muster",
      time: 24,
      playerId: "shadow",
      actions: [
        {
          nation: "sauron",
          type: "political-advance",
          quantity: 1
        }
      ],
      type: "die"
    },
    {
      playerId: "free-peoples",
      time: 25,
      type: "die-pass"
    },
    {
      actions: [
        {
          toRegion: "gorgoroth",
          type: "army-movement",
          fromRegion: "barad-dur"
        },
        {
          type: "army-movement",
          toRegion: "gorgoroth",
          fromRegion: "nurn"
        }
      ],
      type: "die",
      time: 26,
      playerId: "shadow",
      die: "army"
    },
    {
      die: "character",
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      playerId: "free-peoples",
      time: 27
    },
    {
      playerId: "shadow",
      time: 28,
      type: "base",
      actions: [
        {
          type: "hunt-roll",
          dice: [5, 1, 1]
        }
      ]
    },
    {
      time: 29,
      playerId: "shadow",
      actions: [
        {
          nation: "sauron",
          type: "regular-unit-recruitment",
          quantity: 3,
          region: "dol-guldur"
        },
        {
          region: "mount-gundabad",
          nation: "sauron",
          type: "regular-unit-recruitment",
          quantity: 3
        }
      ],
      type: "die-card",
      die: "event",
      card: "sstr20"
    },
    {
      die: "event",
      card: "fpcha01",
      actions: [
        {
          tile: "b0",
          type: "hunt-tile-add"
        }
      ],
      type: "die-card",
      time: 30,
      playerId: "free-peoples"
    },
    {
      time: 31,
      playerId: "shadow",
      actions: [
        {
          tile: "r3s",
          type: "hunt-tile-add"
        }
      ],
      type: "die-card",
      card: "scha03",
      die: "event"
    },
    {
      actions: [
        {
          quantity: 1,
          type: "elite-unit-recruitment",
          nation: "dwarves",
          region: "erebor"
        },
        {
          region: "erebor",
          type: "leader-recruitment",
          quantity: 1,
          nation: "dwarves"
        }
      ],
      type: "die-card",
      time: 32,
      playerId: "free-peoples",
      die: "muster",
      card: "fpstr22"
    },
    {
      actions: [
        {
          fromRegion: "gorgoroth",
          leftUnits: {
            regulars: [
              {
                nation: "sauron",
                quantity: 5
              }
            ],
            front: "shadow",
            nNazgul: 0,
            elites: []
          },
          type: "army-movement",
          toRegion: "morannon"
        },
        {
          fromRegion: "gorgoroth",
          toRegion: "minas-morgul",
          type: "army-movement"
        }
      ],
      type: "die",
      time: 33,
      playerId: "shadow",
      die: "army"
    },
    {
      playerId: "free-peoples",
      time: 34,
      type: "base",
      actions: [
        {
          cards: ["fpcha23", "fpstr11"],
          type: "card-draw"
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          cards: ["scha24", "sstr01"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      time: 34
    },
    {
      playerId: "free-peoples",
      time: 35,
      type: "base",
      actions: []
    },
    {
      playerId: "shadow",
      time: 36,
      type: "base",
      actions: [
        {
          quantity: 2,
          type: "hunt-allocation"
        }
      ]
    },
    {
      time: 37,
      playerId: "free-peoples",
      actions: [
        {
          dice: ["character", "character", "event", "event", "will-of-the-west"],
          type: "action-roll"
        }
      ],
      type: "base"
    },
    {
      playerId: "shadow",
      time: 37,
      type: "base",
      actions: [
        {
          dice: ["eye", "eye", "army", "eye", "muster", "army"],
          type: "action-roll"
        }
      ]
    },
    {
      die: "character",
      type: "die",
      actions: [
        {
          type: "companion-separation",
          toRegion: "druwaith-iaur",
          companions: ["strider", "boromir"]
        },
        {
          type: "fellowship-guide",
          companion: "legolas"
        }
      ],
      playerId: "free-peoples",
      time: 38
    },
    {
      type: "die",
      actions: [
        {
          fromRegion: "morannon",
          toRegion: "dagorlad",
          type: "army-movement"
        },
        {
          fromRegion: "minas-morgul",
          type: "army-movement",
          toRegion: "north-ithilien"
        }
      ],
      playerId: "shadow",
      time: 39,
      die: "army"
    },
    {
      die: "character",
      playerId: "free-peoples",
      time: 40,
      type: "die",
      actions: [
        {
          toRegion: "dol-amroth",
          type: "character-movement",
          fromRegion: "druwaith-iaur",
          characters: ["strider", "boromir"]
        },
        {
          toRegion: "edoras",
          type: "character-movement",
          fromRegion: "fangorn",
          characters: ["gandalf-the-white"]
        }
      ]
    },
    {
      type: "die-pass",
      time: 41,
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "character-play",
          characters: ["aragorn"],
          region: "dol-amroth"
        }
      ],
      type: "die",
      time: 42,
      playerId: "free-peoples",
      die: "will-of-the-west"
    },
    {
      die: "muster",
      time: 43,
      playerId: "shadow",
      actions: [
        {
          type: "political-advance",
          quantity: 1,
          nation: "southrons"
        }
      ],
      type: "die"
    },
    {
      playerId: "free-peoples",
      time: 44,
      type: "die-card",
      actions: [
        {
          region: "dol-amroth",
          type: "elite-unit-recruitment",
          quantity: 1,
          nation: "gondor"
        },
        {
          cards: ["fpstr06", "fpstr20"],
          type: "card-draw"
        }
      ],
      card: "fpcha23",
      die: "event"
    },
    {
      die: "army",
      card: "sstr07",
      actions: [
        {
          fromRegion: "dagorlad",
          toRegion: "dol-guldur",
          type: "army-movement",
          leftUnits: {
            elites: [],
            nNazgul: 0,
            front: "shadow",
            regulars: [
              {
                quantity: 3,
                nation: "sauron"
              }
            ]
          }
        }
      ],
      type: "die-card",
      time: 45,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 46,
      type: "die-card",
      actions: [
        {
          type: "region-choose",
          region: "dimrill-dale"
        },
        {
          type: "combat-roll",
          dice: [2, 6, 6, 3, 2]
        }
      ],
      die: "event",
      card: "fpstr05"
    },
    {
      time: 47,
      playerId: "shadow",
      actions: [
        {
          region: "dimrill-dale",
          nation: "sauron",
          quantity: 2,
          type: "regular-unit-elimination"
        }
      ],
      type: "card-effect",
      card: "fpstr05"
    },
    {
      playerId: "free-peoples",
      time: 48,
      type: "base",
      actions: [
        {
          cards: ["fpcha05", "fpstr03"],
          type: "card-draw"
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          cards: ["scha01", "sstr17"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      time: 48
    },
    {
      time: 49,
      playerId: "free-peoples",
      actions: [],
      type: "base"
    },
    {
      playerId: "shadow",
      time: 50,
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
      actions: [
        {
          type: "action-roll",
          dice: ["event", "will-of-the-west", "muster", "character", "will-of-the-west", "event"]
        }
      ],
      playerId: "free-peoples",
      time: 51
    },
    {
      time: 51,
      playerId: "shadow",
      actions: [
        {
          dice: ["muster-army", "muster-army", "muster", "muster-army", "event", "event", "muster"],
          type: "action-roll"
        }
      ],
      type: "base"
    },
    {
      die: "will-of-the-west",
      playerId: "free-peoples",
      time: 52,
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ]
    },
    {
      playerId: "shadow",
      time: 53,
      type: "base",
      actions: [
        {
          type: "hunt-roll",
          dice: [3]
        }
      ]
    },
    {
      die: "muster",
      playerId: "shadow",
      time: 54,
      type: "die",
      actions: [
        {
          type: "political-advance",
          quantity: 1,
          nation: "southrons"
        }
      ]
    },
    {
      time: 55,
      playerId: "free-peoples",
      type: "die-pass"
    },
    {
      die: "event",
      card: "sstr17",
      actions: [
        {
          region: "north-rhun",
          type: "regular-unit-recruitment",
          quantity: 2,
          nation: "southrons"
        },
        {
          region: "south-rhun",
          nation: "southrons",
          quantity: 2,
          type: "regular-unit-recruitment"
        },
        {
          quantity: 2,
          type: "regular-unit-recruitment",
          nation: "southrons",
          region: "umbar"
        }
      ],
      type: "die-card",
      time: 56,
      playerId: "shadow"
    },
    {
      card: "fpcha05",
      die: "event",
      actions: [
        {
          card: "fpcha05",
          type: "card-play-on-table"
        }
      ],
      type: "die-card",
      time: 57,
      playerId: "free-peoples"
    },
    {
      time: 58,
      playerId: "shadow",
      actions: [
        {
          toRegion: "east-rhun",
          type: "army-movement",
          fromRegion: "south-rhun"
        },
        {
          fromRegion: "dol-guldur",
          type: "army-movement",
          toRegion: "narrows-of-the-forest"
        }
      ],
      type: "die",
      die: "muster-army"
    },
    {
      playerId: "free-peoples",
      time: 59,
      type: "die-card",
      actions: [
        {
          card: "fpstr03",
          type: "card-play-on-table"
        },
        {
          nation: "north",
          type: "political-advance",
          quantity: 1
        }
      ],
      die: "event",
      card: "fpstr03"
    },
    {
      die: "muster-army",
      playerId: "shadow",
      time: 60,
      type: "die",
      actions: [
        {
          type: "army-movement",
          toRegion: "vale-of-the-carnen",
          fromRegion: "east-rhun"
        },
        {
          toRegion: "vale-of-the-carnen",
          type: "army-movement",
          fromRegion: "north-rhun"
        }
      ]
    },
    {
      die: "muster",
      time: 61,
      playerId: "free-peoples",
      actions: [
        {
          quantity: 1,
          type: "political-advance",
          nation: "north"
        }
      ],
      type: "die"
    },
    {
      actions: [
        {
          toRegion: "dale",
          type: "army-attack",
          fromRegion: "vale-of-the-carnen"
        }
      ],
      type: "die",
      time: 62,
      playerId: "shadow",
      die: "muster-army"
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      time: 63,
      playerId: "shadow"
    },
    {
      time: 64,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base"
    },
    {
      playerId: "free-peoples",
      time: 65,
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [3]
        }
      ]
    },
    {
      time: 65,
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [4, 5, 4, 2, 5]
        }
      ],
      type: "base"
    },
    {
      time: 66,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-re-roll",
          dice: [1]
        }
      ],
      type: "base"
    },
    {
      time: 67,
      playerId: "shadow",
      actions: [
        {
          type: "battle-continue",
          region: "dale"
        }
      ],
      type: "base"
    },
    {
      playerId: "free-peoples",
      time: 68,
      type: "base",
      actions: [
        {
          type: "army-retreat",
          toRegion: "woodland-realm"
        }
      ]
    },
    {
      time: 69,
      playerId: "shadow",
      actions: [
        {
          type: "army-advance"
        }
      ],
      type: "base"
    },
    {
      die: "will-of-the-west",
      playerId: "free-peoples",
      time: 70,
      type: "die",
      actions: [
        {
          region: "carrock",
          nation: "north",
          type: "elite-unit-recruitment",
          quantity: 1
        }
      ]
    },
    {
      actions: [
        {
          type: "character-play",
          characters: ["the-witch-king"],
          region: "narrows-of-the-forest"
        }
      ],
      type: "die",
      time: 71,
      playerId: "shadow",
      die: "muster"
    },
    {
      actions: [
        {
          nation: "gondor",
          quantity: 1,
          type: "political-advance"
        }
      ],
      type: "die",
      time: 72,
      playerId: "free-peoples",
      character: "boromir",
      die: "character"
    },
    {
      actions: [
        {
          quantity: 2,
          type: "nazgul-recruitment",
          region: "narrows-of-the-forest"
        },
        {
          type: "army-attack",
          toRegion: "old-forest-road",
          fromRegion: "narrows-of-the-forest"
        }
      ],
      type: "die-card",
      time: 73,
      playerId: "shadow",
      card: "scha24",
      die: "event"
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      time: 74,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 75,
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [2]
        }
      ],
      playerId: "free-peoples",
      time: 76
    },
    {
      playerId: "shadow",
      time: 76,
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [5, 5, 3, 3, 5]
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 77,
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "regular-unit-elimination",
          nation: "north",
          region: "old-forest-road"
        }
      ]
    },
    {
      actions: [
        {
          type: "army-advance"
        }
      ],
      type: "base",
      time: 78,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 79,
      type: "base",
      actions: [
        {
          cards: ["fpcha07", "fpstr21"],
          type: "card-draw"
        }
      ]
    },
    {
      actions: [
        {
          cards: ["scha17", "sstr13"],
          type: "card-draw"
        }
      ],
      type: "base",
      time: 79,
      playerId: "shadow"
    },
    {
      time: 80,
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-declare",
          region: "dimrill-dale"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      playerId: "shadow",
      time: 81
    },
    {
      playerId: "free-peoples",
      time: 82,
      type: "base",
      actions: [
        {
          type: "action-roll",
          dice: [
            "muster",
            "will-of-the-west",
            "character",
            "muster",
            "character",
            "will-of-the-west"
          ]
        }
      ]
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: ["army", "eye", "event", "event", "muster", "army", "eye", "event"]
        }
      ],
      type: "base",
      time: 82,
      playerId: "shadow"
    },
    {
      die: "muster",
      playerId: "free-peoples",
      time: 83,
      type: "die",
      actions: [
        {
          region: "carrock",
          quantity: 1,
          type: "elite-unit-recruitment",
          nation: "north"
        }
      ]
    },
    {
      die: "army",
      actions: [
        {
          type: "army-attack",
          toRegion: "carrock",
          fromRegion: "old-forest-road"
        }
      ],
      type: "die",
      time: 84,
      playerId: "shadow"
    },
    {
      time: 85,
      playerId: "shadow",
      actions: [
        {
          card: "sstr01",
          type: "combat-card-choose"
        }
      ],
      type: "base"
    },
    {
      actions: [
        {
          card: "fpstr20",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      time: 86,
      playerId: "free-peoples"
    },
    {
      time: 87,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [4, 3]
        }
      ],
      type: "base"
    },
    {
      actions: [
        {
          dice: [2, 1, 2, 2, 3],
          type: "combat-roll"
        }
      ],
      type: "base",
      time: 87,
      playerId: "shadow"
    },
    {
      playerId: "shadow",
      time: 88,
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [4, 2, 6, 6, 4]
        }
      ]
    },
    {
      actions: [
        {
          region: "old-forest-road",
          quantity: 2,
          type: "regular-unit-elimination",
          nation: "sauron"
        }
      ],
      type: "base",
      time: 89,
      playerId: "shadow"
    },
    {
      actions: [
        {
          region: "carrock",
          nation: "north",
          quantity: 2,
          type: "elite-unit-elimination"
        }
      ],
      type: "base",
      time: 90,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 91,
      type: "base",
      actions: [
        {
          leftUnits: {
            regulars: [
              {
                nation: "sauron",
                quantity: 6
              }
            ],
            nNazgul: 4,
            characters: ["the-witch-king"],
            elites: [
              {
                nation: "sauron",
                quantity: 1
              }
            ],
            front: "shadow"
          },
          type: "army-advance"
        }
      ]
    },
    {
      type: "character-effect",
      actions: [
        {
          cards: ["sstr22"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      time: 92,
      character: "the-witch-king"
    },
    {
      time: 93,
      playerId: "free-peoples",
      actions: [
        {
          quantity: 1,
          type: "political-advance",
          nation: "elves"
        }
      ],
      type: "die",
      die: "muster"
    },
    {
      playerId: "shadow",
      time: 94,
      type: "die",
      actions: [
        {
          fromRegion: "dimrill-dale",
          type: "army-attack",
          retroguard: {
            elites: [],
            front: "shadow",
            nNazgul: 1,
            regulars: [
              {
                quantity: 1,
                nation: "sauron"
              }
            ]
          },
          toRegion: "lorien"
        }
      ],
      die: "army"
    },
    {
      time: 95,
      playerId: "free-peoples",
      actions: [
        {
          region: "lorien",
          type: "army-retreat-into-siege"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          leftUnits: {
            nNazgul: 1,
            front: "shadow",
            elites: [],
            regulars: [
              {
                nation: "sauron",
                quantity: 1
              }
            ]
          },
          type: "army-advance"
        }
      ],
      playerId: "shadow",
      time: 96
    },
    {
      type: "die",
      actions: [
        {
          quantity: 1,
          type: "political-advance",
          nation: "elves"
        }
      ],
      playerId: "free-peoples",
      time: 97,
      die: "will-of-the-west"
    },
    {
      die: "character",
      elvenRing: {
        toDie: "character",
        fromDie: "event",
        ring: "vilya"
      },
      playerId: "shadow",
      time: 98,
      type: "die",
      actions: [
        {
          fromRegion: "old-forest-road",
          type: "army-attack",
          toRegion: "woodland-realm"
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          type: "army-retreat-into-siege",
          region: "woodland-realm"
        }
      ],
      playerId: "free-peoples",
      time: 99
    },
    {
      playerId: "shadow",
      time: 100,
      type: "base",
      actions: [
        {
          type: "army-advance"
        }
      ]
    },
    {
      die: "character",
      time: 101,
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die"
    },
    {
      time: 102,
      playerId: "shadow",
      actions: [
        {
          type: "hunt-roll",
          dice: [5, 2, 4]
        }
      ],
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          dice: [4, 6],
          type: "hunt-re-roll"
        }
      ],
      playerId: "shadow",
      time: 103
    },
    {
      playerId: "shadow",
      time: 104,
      type: "base",
      actions: [
        {
          tiles: ["0r"],
          type: "hunt-tile-draw"
        }
      ]
    },
    {
      time: 105,
      playerId: "free-peoples",
      type: "card-effect-skip",
      card: "fpcha05"
    },
    {
      type: "base",
      actions: [
        {
          region: "south-anduin-vale",
          type: "fellowship-reveal"
        }
      ],
      playerId: "free-peoples",
      time: 106
    },
    {
      card: "sstr13",
      die: "event",
      playerId: "shadow",
      time: 107,
      type: "die-card",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-recruitment",
          nation: "isengard",
          region: "lorien"
        }
      ]
    },
    {
      die: "character",
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      type: "die",
      time: 108,
      playerId: "free-peoples"
    },
    {
      type: "die-card",
      actions: [
        {
          tile: "rds",
          type: "hunt-tile-add"
        }
      ],
      playerId: "shadow",
      time: 109,
      die: "event",
      card: "scha01"
    },
    {
      time: 110,
      playerId: "free-peoples",
      actions: [
        {
          type: "region-choose",
          region: "north-ithilien"
        },
        {
          type: "combat-roll",
          dice: [1, 2, 5]
        }
      ],
      type: "die-card",
      die: "will-of-the-west",
      card: "fpstr06"
    },
    {
      card: "fpstr06",
      type: "card-effect",
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 1,
          nation: "sauron",
          region: "north-ithilien"
        }
      ],
      playerId: "shadow",
      time: 111
    },
    {
      card: "fpstr06",
      actions: [
        {
          region: "osgiliath",
          nation: "gondor",
          type: "elite-unit-recruitment",
          quantity: 1
        },
        {
          nation: "gondor",
          type: "leader-recruitment",
          quantity: 1,
          region: "osgiliath"
        }
      ],
      type: "card-effect",
      time: 112,
      playerId: "free-peoples"
    },
    {
      card: "sstr22",
      die: "muster",
      actions: [
        {
          region: "angmar",
          nation: "sauron",
          type: "regular-unit-recruitment",
          quantity: 1
        },
        {
          region: "ettenmoors",
          type: "regular-unit-recruitment",
          quantity: 1,
          nation: "sauron"
        },
        {
          quantity: 1,
          type: "regular-unit-recruitment",
          nation: "sauron",
          region: "weather-hills"
        },
        {
          region: "troll-shaws",
          nation: "sauron",
          type: "elite-unit-recruitment",
          quantity: 1
        }
      ],
      type: "die-card",
      time: 113,
      playerId: "shadow"
    },
    {
      actions: [
        {
          cards: ["fpcha04", "fpstr15"],
          type: "card-draw"
        }
      ],
      type: "base",
      time: 114,
      playerId: "free-peoples"
    },
    {
      type: "base",
      actions: [
        {
          cards: ["scha07", "sstr02"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      time: 114
    },
    {
      type: "base",
      actions: [],
      playerId: "free-peoples",
      time: 115
    },
    {
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      playerId: "shadow",
      time: 116
    },
    {
      actions: [
        {
          dice: [
            "muster",
            "muster",
            "character",
            "will-of-the-west",
            "character",
            "will-of-the-west"
          ],
          type: "action-roll"
        }
      ],
      type: "base",
      time: 117,
      playerId: "free-peoples"
    },
    {
      type: "base",
      actions: [
        {
          type: "action-roll",
          dice: ["character", "eye", "army", "eye", "event", "event", "muster", "army"]
        }
      ],
      playerId: "shadow",
      time: 117
    },
    {
      card: "fpstr15",
      die: "will-of-the-west",
      type: "die-card",
      actions: [
        {
          region: "lorien",
          quantity: 1,
          type: "elite-unit-recruitment",
          nation: "elves"
        },
        {
          cards: ["fpstr13"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples",
      time: 118
    },
    {
      time: 119,
      playerId: "shadow",
      actions: [
        {
          tiles: ["0r"],
          type: "hunt-tile-draw"
        }
      ],
      type: "die-card",
      die: "event",
      card: "scha07"
    },
    {
      actions: [
        {
          region: "south-anduin-vale",
          type: "fellowship-reveal"
        }
      ],
      type: "base",
      time: 120,
      playerId: "free-peoples"
    },
    {
      die: "character",
      playerId: "free-peoples",
      time: 121,
      type: "die",
      actions: [
        {
          type: "fellowship-hide"
        }
      ]
    },
    {
      die: "army",
      type: "die",
      actions: [
        {
          toRegion: "woodland-realm",
          type: "army-attack",
          fromRegion: "woodland-realm"
        }
      ],
      playerId: "shadow",
      time: 122
    },
    {
      playerId: "shadow",
      time: 123,
      type: "base",
      actions: [
        {
          card: "sstr02",
          type: "combat-card-choose"
        }
      ]
    },
    {
      actions: [
        {
          card: "fpstr11",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      time: 124,
      playerId: "free-peoples"
    },
    {
      time: 125,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [2, 3]
        }
      ],
      type: "combat-card-effect",
      card: "fpstr11"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [6, 2, 1]
        }
      ],
      type: "base",
      time: 126,
      playerId: "free-peoples"
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [6, 4, 6, 5, 4]
        }
      ],
      playerId: "shadow",
      time: 126
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [6, 5]
        }
      ],
      playerId: "free-peoples",
      time: 127
    },
    {
      time: 127,
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [4, 2, 6]
        }
      ],
      type: "base"
    },
    {
      time: 128,
      playerId: "shadow",
      actions: [
        {
          type: "elite-unit-downgrade",
          quantity: 1,
          nation: "sauron",
          region: "woodland-realm"
        },
        {
          region: "woodland-realm",
          type: "regular-unit-elimination",
          quantity: 2,
          nation: "sauron"
        }
      ],
      type: "base"
    },
    {
      playerId: "free-peoples",
      time: 129,
      type: "base",
      actions: [
        {
          region: "woodland-realm",
          nation: "elves",
          type: "regular-unit-elimination",
          quantity: 1
        },
        {
          nation: "elves",
          type: "elite-unit-elimination",
          quantity: 1,
          region: "woodland-realm"
        }
      ]
    },
    {
      card: "sstr02",
      type: "combat-card-effect",
      actions: [
        {
          nation: "sauron",
          type: "regular-unit-elimination",
          quantity: 2,
          region: "woodland-realm"
        }
      ],
      playerId: "shadow",
      time: 130
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [2, 2]
        }
      ],
      playerId: "shadow",
      time: 131
    },
    {
      playerId: "shadow",
      time: 132,
      type: "character-effect",
      actions: [
        {
          cards: ["sstr21"],
          type: "card-draw"
        }
      ],
      character: "the-witch-king"
    },
    {
      die: "muster",
      time: 133,
      playerId: "free-peoples",
      actions: [
        {
          nation: "dwarves",
          quantity: 1,
          type: "political-advance"
        }
      ],
      type: "die"
    },
    {
      die: "army",
      playerId: "shadow",
      time: 134,
      type: "die",
      actions: [
        {
          fromRegion: "woodland-realm",
          type: "army-attack",
          toRegion: "woodland-realm"
        }
      ]
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      time: 135,
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      time: 136,
      playerId: "free-peoples"
    },
    {
      playerId: "free-peoples",
      time: 137,
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [6]
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [4, 1, 5]
        }
      ],
      playerId: "shadow",
      time: 137
    },
    {
      playerId: "shadow",
      time: 138,
      type: "base",
      actions: [
        {
          dice: [5, 2, 2],
          type: "combat-re-roll"
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          region: "woodland-realm",
          nation: "sauron",
          quantity: 1,
          type: "regular-unit-elimination"
        }
      ],
      playerId: "shadow",
      time: 139
    },
    {
      time: 140,
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die",
      die: "character"
    },
    {
      playerId: "shadow",
      time: 141,
      type: "base",
      actions: [
        {
          type: "hunt-roll",
          dice: [1, 2, 4]
        }
      ]
    },
    {
      type: "die",
      actions: [
        {
          cards: ["sstr06"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      time: 142,
      die: "event"
    },
    {
      die: "muster",
      card: "fpstr21",
      playerId: "free-peoples",
      time: 143,
      type: "die-card",
      actions: [
        {
          nation: "elves",
          type: "elite-unit-recruitment",
          quantity: 1,
          region: "rivendell"
        },
        {
          cards: ["fpstr14"],
          type: "card-draw"
        }
      ]
    },
    {
      character: "saruman",
      die: "muster",
      time: 144,
      playerId: "shadow",
      actions: [
        {
          region: "orthanc",
          nation: "isengard",
          type: "regular-unit-upgrade",
          quantity: 2
        }
      ],
      type: "die"
    },
    {
      actions: [
        {
          tile: "b-1",
          type: "hunt-tile-add"
        }
      ],
      type: "die-card",
      time: 145,
      playerId: "free-peoples",
      die: "will-of-the-west",
      card: "fpcha04"
    },
    {
      die: "character",
      actions: [
        {
          toRegion: "western-brown-lands",
          nNazgul: 1,
          type: "nazgul-movement",
          fromRegion: "dimrill-dale"
        },
        {
          fromRegion: "north-ithilien",
          type: "nazgul-movement",
          nNazgul: 1,
          toRegion: "western-emyn-muil"
        },
        {
          fromRegion: "woodland-realm",
          type: "nazgul-movement",
          toRegion: "eastern-brown-lands",
          nNazgul: 1
        },
        {
          fromRegion: "woodland-realm",
          type: "nazgul-movement",
          toRegion: "dale",
          nNazgul: 3
        },
        {
          fromRegion: "woodland-realm",
          characters: ["the-witch-king"],
          type: "character-movement",
          toRegion: "dale"
        }
      ],
      type: "die",
      time: 146,
      playerId: "shadow"
    },
    {
      time: 147,
      playerId: "free-peoples",
      actions: [
        {
          cards: ["fpcha06", "fpstr19"],
          type: "card-draw"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          cards: ["scha10", "sstr09"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      time: 147
    },
    {
      actions: [],
      type: "base",
      time: 148,
      playerId: "free-peoples"
    },
    {
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      playerId: "shadow",
      time: 149
    },
    {
      actions: [
        {
          dice: [
            "character",
            "will-of-the-west",
            "muster",
            "muster-army",
            "will-of-the-west",
            "muster-army"
          ],
          type: "action-roll"
        }
      ],
      type: "base",
      time: 150,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 150,
      type: "base",
      actions: [
        {
          type: "action-roll",
          dice: [
            "muster-army",
            "muster-army",
            "muster-army",
            "event",
            "character",
            "event",
            "muster-army",
            "army"
          ]
        }
      ]
    },
    {
      card: "fpcha06",
      die: "will-of-the-west",
      playerId: "free-peoples",
      time: 151,
      type: "die-card",
      actions: [
        {
          card: "fpcha06",
          type: "card-play-on-table"
        }
      ]
    },
    {
      character: "saruman",
      die: "muster-army",
      playerId: "shadow",
      time: 152,
      type: "die",
      actions: [
        {
          quantity: 1,
          type: "regular-unit-recruitment",
          nation: "isengard",
          region: "north-dunland"
        },
        {
          nation: "isengard",
          type: "regular-unit-recruitment",
          quantity: 1,
          region: "south-dunland"
        },
        {
          nation: "isengard",
          quantity: 1,
          type: "regular-unit-recruitment",
          region: "orthanc"
        }
      ]
    },
    {
      die: "muster",
      type: "die",
      actions: [
        {
          nation: "dwarves",
          quantity: 1,
          type: "political-advance"
        }
      ],
      playerId: "free-peoples",
      time: 153
    },
    {
      actions: [
        {
          quantity: 1,
          type: "regular-unit-recruitment",
          nation: "isengard",
          region: "north-dunland"
        },
        {
          nation: "isengard",
          type: "regular-unit-recruitment",
          quantity: 1,
          region: "south-dunland"
        },
        {
          nation: "isengard",
          quantity: 1,
          type: "regular-unit-recruitment",
          region: "orthanc"
        }
      ],
      type: "die",
      time: 154,
      playerId: "shadow",
      character: "saruman",
      die: "muster-army"
    },
    {
      playerId: "free-peoples",
      time: 155,
      type: "die-pass"
    },
    {
      time: 156,
      playerId: "shadow",
      actions: [
        {
          quantity: 2,
          type: "regular-unit-upgrade",
          nation: "isengard",
          region: "orthanc"
        }
      ],
      type: "die",
      character: "saruman",
      die: "muster-army"
    },
    {
      type: "die-pass",
      playerId: "free-peoples",
      time: 157
    },
    {
      character: "saruman",
      die: "muster-army",
      actions: [
        {
          region: "north-dunland",
          nation: "isengard",
          quantity: 1,
          type: "regular-unit-recruitment"
        },
        {
          nation: "isengard",
          quantity: 1,
          type: "regular-unit-recruitment",
          region: "south-dunland"
        },
        {
          region: "orthanc",
          quantity: 1,
          type: "regular-unit-recruitment",
          nation: "isengard"
        }
      ],
      type: "die",
      time: 158,
      playerId: "shadow"
    },
    {
      die: "character",
      time: 159,
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die"
    },
    {
      actions: [
        {
          type: "hunt-roll",
          dice: [4]
        }
      ],
      type: "base",
      time: 160,
      playerId: "shadow"
    },
    {
      playerId: "shadow",
      time: 161,
      type: "die-card",
      actions: [
        {
          fromRegion: "dale",
          toRegion: "woodland-realm",
          leftUnits: {
            nNazgul: 3,
            regulars: [
              {
                quantity: 7,
                nation: "southrons"
              }
            ],
            front: "shadow",
            elites: [],
            characters: []
          },
          type: "army-movement"
        },
        {
          fromRegion: "mount-gundabad",
          type: "army-movement",
          toRegion: "mount-gram"
        },
        {
          toRegion: "moria",
          type: "army-movement",
          fromRegion: "north-dunland"
        },
        {
          fromRegion: "angmar",
          toRegion: "ettenmoors",
          type: "army-movement"
        }
      ],
      card: "sstr09",
      die: "event"
    },
    {
      die: "muster-army",
      playerId: "free-peoples",
      time: 162,
      type: "die",
      actions: [
        {
          nation: "dwarves",
          type: "political-advance",
          quantity: 1
        }
      ]
    },
    {
      die: "character",
      playerId: "shadow",
      time: 163,
      type: "die",
      actions: [
        {
          type: "army-attack",
          toRegion: "woodland-realm",
          fromRegion: "woodland-realm"
        }
      ]
    },
    {
      playerId: "shadow",
      time: 164,
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 165,
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
          type: "combat-roll",
          dice: [5]
        }
      ],
      type: "base",
      time: 166,
      playerId: "free-peoples"
    },
    {
      time: 166,
      playerId: "shadow",
      actions: [
        {
          dice: [3, 1, 2, 6, 3],
          type: "combat-roll"
        }
      ],
      type: "base"
    },
    {
      time: 167,
      playerId: "shadow",
      actions: [
        {
          region: "woodland-realm",
          quantity: 1,
          type: "regular-unit-elimination",
          nation: "southrons"
        }
      ],
      type: "base"
    },
    {
      playerId: "free-peoples",
      time: 168,
      type: "base",
      actions: [
        {
          region: "woodland-realm",
          type: "regular-unit-elimination",
          quantity: 1,
          nation: "north"
        },
        {
          quantity: 1,
          type: "leader-elimination",
          nation: "elves",
          region: "woodland-realm"
        },
        {
          region: "woodland-realm",
          quantity: 1,
          type: "leader-elimination",
          nation: "north"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 169,
      type: "die",
      actions: [
        {
          nation: "rohan",
          quantity: 1,
          type: "political-advance"
        }
      ],
      die: "muster-army"
    },
    {
      time: 170,
      playerId: "shadow",
      actions: [
        {
          nation: "rohan",
          quantity: 1,
          type: "political-recede"
        }
      ],
      type: "die-card",
      die: "event",
      card: "sstr06"
    },
    {
      type: "card-effect",
      actions: [
        {
          quantity: 1,
          type: "leader-elimination",
          nation: "rohan",
          region: "fords-of-isen"
        },
        {
          region: "westemnet",
          quantity: 1,
          type: "elite-unit-elimination",
          nation: "rohan"
        }
      ],
      playerId: "free-peoples",
      time: 171,
      card: "sstr06"
    },
    {
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die",
      time: 172,
      playerId: "free-peoples",
      die: "will-of-the-west"
    },
    {
      actions: [
        {
          dice: [6],
          type: "hunt-roll"
        }
      ],
      type: "base",
      time: 173,
      playerId: "shadow"
    },
    {
      time: 174,
      playerId: "shadow",
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["er"]
        }
      ],
      type: "base"
    },
    {
      card: "fpcha05",
      playerId: "free-peoples",
      time: 175,
      type: "card-effect-skip"
    },
    {
      playerId: "free-peoples",
      time: 176,
      type: "base",
      actions: [
        {
          card: "fpcha06",
          type: "card-discard-from-table"
        }
      ]
    },
    {
      time: 177,
      playerId: "free-peoples",
      actions: [
        {
          region: "noman-lands",
          type: "fellowship-reveal"
        }
      ],
      type: "base"
    },
    {
      die: "army",
      type: "die",
      actions: [
        {
          type: "army-movement",
          toRegion: "ettenmoors",
          fromRegion: "mount-gram"
        },
        {
          fromRegion: "moria",
          toRegion: "dimrill-dale",
          type: "army-movement"
        }
      ],
      playerId: "shadow",
      time: 178
    },
    {
      actions: [
        {
          cards: ["fpcha22", "fpstr09"],
          type: "card-draw"
        }
      ],
      type: "base",
      time: 179,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          cards: ["scha05", "sstr16"],
          type: "card-draw"
        }
      ],
      type: "base",
      time: 179,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 180,
      type: "base",
      actions: [
        {
          cards: ["fpcha07"],
          type: "card-discard"
        }
      ]
    },
    {
      time: 181,
      playerId: "free-peoples",
      actions: [],
      type: "base"
    },
    {
      playerId: "shadow",
      time: 182,
      type: "base",
      actions: [
        {
          quantity: 2,
          type: "hunt-allocation"
        }
      ]
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: ["will-of-the-west", "character", "event", "character", "event", "event"]
        }
      ],
      type: "base",
      time: 183,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 183,
      type: "base",
      actions: [
        {
          dice: ["eye", "army", "character", "eye", "eye", "character", "army"],
          type: "action-roll"
        }
      ]
    },
    {
      type: "die",
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      playerId: "free-peoples",
      time: 184,
      die: "character"
    },
    {
      type: "die-card",
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["2"]
        }
      ],
      playerId: "shadow",
      time: 185,
      card: "scha05",
      die: "character"
    },
    {
      type: "base",
      actions: [
        {
          companions: ["peregrin"],
          type: "companion-random"
        }
      ],
      playerId: "free-peoples",
      time: 186
    },
    {
      character: "peregrin",
      playerId: "free-peoples",
      time: 187,
      type: "character-effect",
      actions: [
        {
          companions: ["peregrin"],
          type: "companion-separation",
          toRegion: "eastern-emyn-muil"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 188,
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "fellowship-corruption"
        }
      ]
    },
    {
      die: "event",
      card: "fpstr09",
      time: 189,
      playerId: "free-peoples",
      actions: [
        {
          quantity: 1,
          type: "political-advance",
          nation: "rohan"
        },
        {
          region: "edoras",
          nation: "rohan",
          quantity: 1,
          type: "elite-unit-recruitment"
        },
        {
          quantity: 1,
          type: "leader-recruitment",
          nation: "rohan",
          region: "edoras"
        }
      ],
      type: "die-card"
    },
    {
      type: "die-pass",
      playerId: "shadow",
      time: 190
    },
    {
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      playerId: "free-peoples",
      time: 191,
      die: "character"
    },
    {
      playerId: "shadow",
      time: 192,
      type: "base",
      actions: [
        {
          type: "hunt-roll",
          dice: [2, 3, 4, 4, 6]
        }
      ]
    },
    {
      actions: [
        {
          tiles: ["er"],
          type: "hunt-tile-draw"
        }
      ],
      type: "base",
      time: 193,
      playerId: "shadow"
    },
    {
      card: "fpcha05",
      type: "card-effect-skip",
      time: 194,
      playerId: "free-peoples"
    },
    {
      time: 195,
      playerId: "free-peoples",
      actions: [
        {
          companions: ["gimli"],
          type: "companion-random"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          characters: ["gimli"],
          type: "character-elimination"
        }
      ],
      playerId: "free-peoples",
      time: 196
    },
    {
      actions: [
        {
          region: "dagorlad",
          type: "fellowship-reveal"
        }
      ],
      type: "base",
      time: 197,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 198,
      type: "die",
      actions: [
        {
          toRegion: "lorien",
          leftUnits: {
            elites: [],
            nNazgul: 0,
            front: "shadow",
            regulars: [
              {
                quantity: 1,
                nation: "sauron"
              }
            ]
          },
          type: "army-movement",
          fromRegion: "dimrill-dale"
        },
        {
          fromRegion: "ettenmoors",
          toRegion: "troll-shaws",
          type: "army-movement"
        }
      ],
      die: "army"
    },
    {
      die: "will-of-the-west",
      actions: [
        {
          type: "elite-unit-recruitment",
          quantity: 1,
          nation: "elves",
          region: "rivendell"
        }
      ],
      type: "die",
      time: 199,
      playerId: "free-peoples"
    },
    {
      die: "character",
      type: "die",
      actions: [
        {
          fromRegion: "woodland-realm",
          characters: ["the-witch-king"],
          type: "character-movement",
          toRegion: "lorien"
        },
        {
          type: "nazgul-movement",
          nNazgul: 3,
          toRegion: "lorien",
          fromRegion: "dale"
        },
        {
          nNazgul: 1,
          toRegion: "lorien",
          type: "nazgul-movement",
          fromRegion: "eastern-brown-lands"
        },
        {
          fromRegion: "western-brown-lands",
          type: "nazgul-movement",
          toRegion: "troll-shaws",
          nNazgul: 1
        },
        {
          fromRegion: "western-emyn-muil",
          toRegion: "dagorlad",
          nNazgul: 1,
          type: "nazgul-movement"
        }
      ],
      playerId: "shadow",
      time: 200
    },
    {
      actions: [
        {
          region: "rivendell",
          quantity: 1,
          type: "elite-unit-recruitment",
          nation: "elves"
        }
      ],
      type: "die",
      time: 201,
      playerId: "free-peoples",
      elvenRing: {
        ring: "nenya",
        fromDie: "event",
        toDie: "muster-army"
      },
      die: "muster-army"
    },
    {
      die: "army",
      type: "die",
      actions: [
        {
          type: "army-attack",
          toRegion: "lorien",
          fromRegion: "lorien"
        }
      ],
      playerId: "shadow",
      time: 202
    },
    {
      time: 203,
      playerId: "shadow",
      actions: [
        {
          card: "scha17",
          type: "combat-card-choose"
        }
      ],
      type: "base"
    },
    {
      playerId: "free-peoples",
      time: 204,
      type: "base",
      actions: [
        {
          card: "fpstr19",
          type: "combat-card-choose"
        }
      ]
    },
    {
      time: 205,
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [3, 6, 1]
        }
      ],
      type: "combat-card-effect",
      card: "scha17"
    },
    {
      type: "combat-card-effect",
      actions: [
        {
          nation: "elves",
          quantity: 1,
          type: "elite-unit-downgrade",
          region: "lorien"
        }
      ],
      playerId: "free-peoples",
      time: 206,
      card: "scha17"
    },
    {
      playerId: "free-peoples",
      time: 207,
      type: "base",
      actions: [
        {
          dice: [6, 2, 1, 1],
          type: "combat-roll"
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [6, 3, 6, 5, 1]
        }
      ],
      playerId: "shadow",
      time: 207
    },
    {
      playerId: "free-peoples",
      time: 208,
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [5]
        }
      ]
    },
    {
      playerId: "shadow",
      time: 208,
      type: "base",
      actions: [
        {
          dice: [2, 4, 5],
          type: "combat-re-roll"
        }
      ]
    },
    {
      time: 209,
      playerId: "shadow",
      actions: [
        {
          nation: "sauron",
          quantity: 1,
          type: "regular-unit-elimination",
          region: "lorien"
        },
        {
          region: "lorien",
          type: "regular-unit-elimination",
          quantity: 1,
          nation: "isengard"
        }
      ],
      type: "base"
    },
    {
      time: 210,
      playerId: "free-peoples",
      actions: [
        {
          type: "elite-unit-downgrade",
          quantity: 1,
          nation: "elves",
          region: "lorien"
        }
      ],
      type: "base"
    },
    {
      time: 211,
      playerId: "shadow",
      actions: [
        {
          type: "battle-cease",
          region: "lorien"
        }
      ],
      type: "base"
    },
    {
      time: 212,
      playerId: "shadow",
      actions: [
        {
          cards: ["scha15"],
          type: "card-draw"
        }
      ],
      type: "character-effect",
      character: "the-witch-king"
    },
    {
      die: "event",
      card: "fpstr14",
      playerId: "free-peoples",
      time: 213,
      type: "die-card",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-recruitment",
          nation: "gondor",
          region: "minas-tirith"
        },
        {
          region: "minas-tirith",
          type: "leader-recruitment",
          quantity: 1,
          nation: "gondor"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 214,
      type: "base",
      actions: [
        {
          cards: ["fpcha02", "fpstr16"],
          type: "card-draw"
        }
      ]
    },
    {
      time: 214,
      playerId: "shadow",
      actions: [
        {
          cards: ["scha14", "sstr08"],
          type: "card-draw"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      actions: [],
      playerId: "free-peoples",
      time: 215
    },
    {
      playerId: "shadow",
      time: 216,
      type: "base",
      actions: [
        {
          quantity: 2,
          type: "hunt-allocation"
        }
      ]
    },
    {
      time: 217,
      playerId: "free-peoples",
      actions: [
        {
          dice: [
            "muster-army",
            "muster-army",
            "muster-army",
            "muster-army",
            "will-of-the-west",
            "event"
          ],
          type: "action-roll"
        }
      ],
      type: "base"
    },
    {
      playerId: "shadow",
      time: 217,
      type: "base",
      actions: [
        {
          dice: ["army", "army", "event", "event", "eye", "event", "muster-army"],
          type: "action-roll"
        }
      ]
    },
    {
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      type: "die",
      time: 218,
      playerId: "free-peoples",
      die: "will-of-the-west"
    },
    {
      die: "army",
      time: 219,
      playerId: "shadow",
      actions: [
        {
          fromRegion: "lorien",
          type: "army-attack",
          toRegion: "lorien"
        }
      ],
      type: "die"
    },
    {
      actions: [
        {
          card: "sstr21",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      time: 220,
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      time: 221,
      playerId: "free-peoples"
    },
    {
      time: 222,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [6, 3, 1, 5]
        }
      ],
      type: "base"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [6, 3, 4, 6, 5]
        }
      ],
      type: "base",
      time: 222,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 223,
      type: "base",
      actions: [
        {
          dice: [3],
          type: "combat-re-roll"
        }
      ]
    },
    {
      actions: [
        {
          dice: [6],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      time: 223,
      playerId: "shadow"
    },
    {
      actions: [
        {
          region: "lorien",
          nation: "isengard",
          quantity: 1,
          type: "elite-unit-downgrade"
        },
        {
          type: "regular-unit-elimination",
          quantity: 3,
          nation: "isengard",
          region: "lorien"
        }
      ],
      type: "base",
      time: 224,
      playerId: "shadow"
    },
    {
      type: "base",
      actions: [
        {
          nation: "elves",
          type: "regular-unit-elimination",
          quantity: 3,
          region: "lorien"
        },
        {
          type: "elite-unit-elimination",
          quantity: 1,
          nation: "elves",
          region: "lorien"
        },
        {
          region: "lorien",
          type: "leader-elimination",
          quantity: 1,
          nation: "elves"
        }
      ],
      playerId: "free-peoples",
      time: 225
    },
    {
      character: "the-witch-king",
      type: "character-effect",
      actions: [
        {
          cards: ["sstr04"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      time: 226
    },
    {
      actions: [
        {
          region: "edoras",
          nation: "rohan",
          quantity: 1,
          type: "elite-unit-recruitment"
        },
        {
          quantity: 1,
          type: "leader-recruitment",
          nation: "rohan",
          region: "edoras"
        }
      ],
      type: "die-card",
      time: 227,
      playerId: "free-peoples",
      card: "fpstr16",
      die: "muster-army"
    },
    {
      card: "sstr16",
      die: "event",
      time: 228,
      playerId: "shadow",
      actions: [
        {
          nation: "isengard",
          quantity: 2,
          type: "regular-unit-recruitment",
          region: "orthanc"
        },
        {
          region: "south-dunland",
          nation: "isengard",
          quantity: 2,
          type: "regular-unit-recruitment"
        }
      ],
      type: "die-card"
    },
    {
      die: "muster-army",
      type: "die",
      actions: [
        {
          toRegion: "westemnet",
          type: "army-movement",
          fromRegion: "edoras"
        },
        {
          toRegion: "erebor",
          type: "army-movement",
          fromRegion: "iron-hills"
        }
      ],
      playerId: "free-peoples",
      time: 229
    },
    {
      type: "die",
      actions: [
        {
          fromRegion: "weather-hills",
          toRegion: "troll-shaws",
          type: "army-movement"
        },
        {
          type: "army-movement",
          toRegion: "gap-of-rohan",
          fromRegion: "south-dunland"
        }
      ],
      playerId: "shadow",
      time: 230,
      die: "army"
    },
    {
      type: "die",
      actions: [
        {
          quantity: 1,
          type: "political-advance",
          nation: "rohan"
        }
      ],
      playerId: "free-peoples",
      time: 231,
      die: "muster-army"
    },
    {
      actions: [
        {
          cards: ["sstr04", "scha15"],
          type: "card-discard"
        },
        {
          card: "fpstr03",
          type: "card-discard-from-table"
        }
      ],
      type: "die",
      time: 232,
      playerId: "shadow",
      die: "event"
    },
    {
      die: "character",
      elvenRing: {
        ring: "narya",
        toDie: "character",
        fromDie: "event"
      },
      playerId: "free-peoples",
      time: 233,
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ]
    },
    {
      time: 234,
      playerId: "shadow",
      actions: [
        {
          dice: [4, 3, 2],
          type: "hunt-roll"
        }
      ],
      type: "base"
    },
    {
      playerId: "shadow",
      time: 235,
      type: "base",
      actions: [
        {
          dice: [2, 5],
          type: "hunt-re-roll"
        }
      ]
    },
    {
      die: "event",
      card: "scha10",
      time: 236,
      playerId: "shadow",
      actions: [
        {
          region: "eastern-emyn-muil",
          type: "fellowship-push"
        }
      ],
      type: "die-card"
    },
    {
      actions: [
        {
          fromRegion: "westemnet",
          type: "army-movement",
          toRegion: "fords-of-isen"
        },
        {
          toRegion: "bree",
          type: "army-movement",
          fromRegion: "north-downs"
        }
      ],
      type: "die",
      time: 237,
      playerId: "free-peoples",
      die: "muster-army"
    },
    {
      die: "muster-army",
      time: 238,
      playerId: "shadow",
      actions: [
        {
          type: "army-attack",
          toRegion: "fords-of-isen",
          fromRegion: "orthanc"
        }
      ],
      type: "die"
    },
    {
      time: 239,
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base"
    },
    {
      time: 240,
      playerId: "free-peoples",
      actions: [
        {
          card: "fpcha22",
          type: "combat-card-choose"
        }
      ],
      type: "base"
    },
    {
      actions: [
        {
          dice: [3, 3, 4],
          type: "combat-roll"
        }
      ],
      type: "combat-card-effect",
      time: 241,
      playerId: "free-peoples",
      card: "fpcha22"
    },
    {
      actions: [
        {
          dice: [6, 1, 4, 2, 1],
          type: "combat-roll"
        }
      ],
      type: "base",
      time: 242,
      playerId: "free-peoples"
    },
    {
      time: 242,
      playerId: "shadow",
      actions: [
        {
          dice: [4, 2, 2, 3, 4],
          type: "combat-roll"
        }
      ],
      type: "base"
    },
    {
      actions: [
        {
          type: "combat-re-roll",
          dice: [5, 5, 2]
        }
      ],
      type: "base",
      time: 243,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "combat-re-roll",
          dice: [3, 5, 2, 5, 6]
        }
      ],
      type: "base",
      time: 243,
      playerId: "shadow"
    },
    {
      actions: [
        {
          region: "orthanc",
          nation: "isengard",
          type: "regular-unit-elimination",
          quantity: 3
        }
      ],
      type: "base",
      time: 244,
      playerId: "shadow"
    },
    {
      type: "base",
      actions: [
        {
          region: "fords-of-isen",
          quantity: 1,
          type: "regular-unit-elimination",
          nation: "rohan"
        }
      ],
      playerId: "free-peoples",
      time: 245
    },
    {
      time: 246,
      playerId: "shadow",
      actions: [
        {
          type: "battle-continue",
          region: "fords-of-isen"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          toRegion: "helms-deep",
          type: "army-retreat"
        }
      ],
      playerId: "free-peoples",
      time: 247
    },
    {
      type: "base",
      actions: [
        {
          leftUnits: {
            characters: ["saruman"],
            regulars: [
              {
                quantity: 2,
                nation: "isengard"
              }
            ],
            elites: [],
            front: "shadow"
          },
          type: "army-advance"
        }
      ],
      playerId: "shadow",
      time: 248
    },
    {
      actions: [
        {
          cards: ["fpcha12", "fpstr18"],
          type: "card-draw"
        }
      ],
      type: "base",
      time: 249,
      playerId: "free-peoples"
    },
    {
      time: 249,
      playerId: "shadow",
      actions: [
        {
          cards: ["scha22", "sstr14"],
          type: "card-draw"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      actions: [],
      playerId: "free-peoples",
      time: 250
    },
    {
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      playerId: "shadow",
      time: 251
    },
    {
      time: 252,
      playerId: "free-peoples",
      actions: [
        {
          dice: ["event", "muster", "muster", "character", "will-of-the-west", "character"],
          type: "action-roll"
        }
      ],
      type: "base"
    },
    {
      actions: [
        {
          dice: ["event", "eye", "event", "character", "army", "muster-army", "army", "eye"],
          type: "action-roll"
        }
      ],
      type: "base",
      time: 252,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 253,
      type: "die",
      actions: [
        {
          quantity: 1,
          type: "leader-recruitment",
          nation: "rohan",
          region: "helms-deep"
        },
        {
          nation: "rohan",
          type: "regular-unit-recruitment",
          quantity: 1,
          region: "westemnet"
        }
      ],
      die: "muster"
    },
    {
      actions: [
        {
          fromRegion: "fords-of-isen",
          toRegion: "helms-deep",
          type: "army-attack"
        }
      ],
      type: "die",
      time: 254,
      playerId: "shadow",
      die: "character"
    },
    {
      type: "base",
      actions: [
        {
          type: "army-retreat-into-siege",
          region: "helms-deep"
        }
      ],
      playerId: "free-peoples",
      time: 255
    },
    {
      time: 256,
      playerId: "shadow",
      actions: [
        {
          type: "army-advance"
        }
      ],
      type: "base"
    },
    {
      type: "die",
      actions: [
        {
          region: "westemnet",
          quantity: 1,
          type: "regular-unit-recruitment",
          nation: "rohan"
        },
        {
          type: "regular-unit-recruitment",
          quantity: 1,
          nation: "north",
          region: "the-shire"
        }
      ],
      playerId: "free-peoples",
      time: 257,
      die: "muster"
    },
    {
      die: "event",
      card: "sstr08",
      time: 258,
      playerId: "shadow",
      actions: [
        {
          fromRegion: "gap-of-rohan",
          toRegion: "helms-deep",
          type: "army-movement",
          leftUnits: {
            regulars: [
              {
                quantity: 1,
                nation: "isengard"
              }
            ],
            front: "shadow"
          }
        },
        {
          fromRegion: "carrock",
          toRegion: "dale",
          type: "army-movement"
        }
      ],
      type: "die-card"
    },
    {
      die: "will-of-the-west",
      time: 259,
      playerId: "free-peoples",
      actions: [
        {
          nation: "rohan",
          type: "regular-unit-recruitment",
          quantity: 1,
          region: "westemnet"
        },
        {
          region: "the-shire",
          nation: "north",
          type: "regular-unit-recruitment",
          quantity: 1
        }
      ],
      type: "die"
    },
    {
      die: "army",
      playerId: "shadow",
      time: 260,
      type: "die",
      actions: [
        {
          fromRegion: "helms-deep",
          toRegion: "helms-deep",
          type: "army-attack"
        }
      ]
    },
    {
      playerId: "shadow",
      time: 261,
      type: "base",
      actions: [
        {
          card: "sstr14",
          type: "combat-card-choose"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 262,
      type: "base",
      actions: [
        {
          card: "fpstr18",
          type: "combat-card-choose"
        }
      ]
    },
    {
      time: 263,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [1, 1, 3, 3, 5]
        }
      ],
      type: "base"
    },
    {
      playerId: "shadow",
      time: 263,
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [2, 1, 3, 6, 5]
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 264,
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [4, 5, 2, 1]
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [5, 5, 1, 6]
        }
      ],
      playerId: "shadow",
      time: 264
    },
    {
      type: "base",
      actions: [
        {
          nation: "isengard",
          type: "regular-unit-elimination",
          quantity: 2,
          region: "helms-deep"
        }
      ],
      playerId: "shadow",
      time: 265
    },
    {
      time: 266,
      playerId: "free-peoples",
      actions: [
        {
          region: "helms-deep",
          type: "elite-unit-downgrade",
          quantity: 1,
          nation: "rohan"
        }
      ],
      type: "base"
    },
    {
      card: "sstr14",
      time: 267,
      playerId: "shadow",
      actions: [
        {
          dice: [4, 5, 2, 5, 2],
          type: "combat-roll"
        }
      ],
      type: "combat-card-effect"
    },
    {
      time: 268,
      playerId: "free-peoples",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-elimination",
          nation: "rohan",
          region: "helms-deep"
        }
      ],
      type: "combat-card-effect",
      card: "sstr14"
    },
    {
      actions: [
        {
          region: "helms-deep",
          type: "battle-cease"
        }
      ],
      type: "base",
      time: 269,
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die",
      time: 270,
      playerId: "free-peoples",
      die: "character"
    },
    {
      time: 271,
      playerId: "shadow",
      actions: [
        {
          type: "hunt-roll",
          dice: [3, 3, 4]
        }
      ],
      type: "base"
    },
    {
      die: "army",
      time: 272,
      playerId: "shadow",
      actions: [
        {
          fromRegion: "helms-deep",
          type: "army-attack",
          toRegion: "helms-deep"
        }
      ],
      type: "die"
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      time: 273,
      playerId: "shadow"
    },
    {
      time: 274,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base"
    },
    {
      actions: [
        {
          dice: [4, 2, 5, 5],
          type: "combat-roll"
        }
      ],
      type: "base",
      time: 275,
      playerId: "free-peoples"
    },
    {
      time: 275,
      playerId: "shadow",
      actions: [
        {
          dice: [1, 6, 5, 1, 3],
          type: "combat-roll"
        }
      ],
      type: "base"
    },
    {
      playerId: "free-peoples",
      time: 276,
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [6, 1]
        }
      ]
    },
    {
      playerId: "shadow",
      time: 276,
      type: "base",
      actions: [
        {
          dice: [5, 3, 5, 3],
          type: "combat-re-roll"
        }
      ]
    },
    {
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 3,
          nation: "isengard",
          region: "helms-deep"
        }
      ],
      type: "base",
      time: 277,
      playerId: "shadow"
    },
    {
      type: "base",
      actions: [
        {
          nation: "rohan",
          type: "regular-unit-elimination",
          quantity: 1,
          region: "helms-deep"
        }
      ],
      playerId: "free-peoples",
      time: 278
    },
    {
      playerId: "shadow",
      time: 279,
      type: "base",
      actions: [
        {
          region: "helms-deep",
          type: "battle-cease"
        }
      ]
    },
    {
      type: "die-card",
      actions: [
        {
          tile: "b0",
          type: "hunt-tile-add"
        }
      ],
      playerId: "free-peoples",
      time: 280,
      die: "character",
      card: "fpcha02"
    },
    {
      type: "die",
      actions: [
        {
          fromRegion: "helms-deep",
          type: "army-attack",
          toRegion: "helms-deep"
        }
      ],
      playerId: "shadow",
      time: 281,
      die: "muster-army"
    },
    {
      playerId: "shadow",
      time: 282,
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
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      time: 283,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [4, 4, 6]
        }
      ],
      type: "base",
      time: 284,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 284,
      type: "base",
      actions: [
        {
          dice: [2, 4, 1, 4, 5],
          type: "combat-roll"
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [2, 5]
        }
      ],
      playerId: "free-peoples",
      time: 285
    },
    {
      time: 285,
      playerId: "shadow",
      actions: [
        {
          dice: [2, 1, 6, 1, 4],
          type: "combat-re-roll"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          region: "helms-deep",
          quantity: 1,
          type: "elite-unit-elimination",
          nation: "isengard"
        }
      ],
      playerId: "shadow",
      time: 286
    },
    {
      type: "base",
      actions: [
        {
          region: "helms-deep",
          nation: "rohan",
          type: "regular-unit-elimination",
          quantity: 1
        }
      ],
      playerId: "free-peoples",
      time: 287
    },
    {
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-downgrade",
          nation: "isengard",
          region: "helms-deep"
        },
        {
          region: "helms-deep",
          type: "battle-continue"
        }
      ],
      playerId: "shadow",
      time: 288
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      time: 289,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 290,
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      time: 291,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [5, 1]
        }
      ],
      type: "base"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [5, 1, 1, 4]
        }
      ],
      type: "base",
      time: 291,
      playerId: "shadow"
    },
    {
      actions: [
        {
          dice: [2],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      time: 292,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 292,
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [1, 5, 6]
        }
      ]
    },
    {
      actions: [
        {
          region: "helms-deep",
          type: "regular-unit-elimination",
          quantity: 1,
          nation: "isengard"
        }
      ],
      type: "base",
      time: 293,
      playerId: "shadow"
    },
    {
      actions: [
        {
          region: "helms-deep",
          type: "regular-unit-elimination",
          quantity: 1,
          nation: "rohan"
        }
      ],
      type: "base",
      time: 294,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          region: "helms-deep",
          nation: "isengard",
          type: "elite-unit-downgrade",
          quantity: 1
        },
        {
          region: "helms-deep",
          type: "battle-continue"
        }
      ],
      type: "base",
      time: 295,
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      time: 296,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 297,
      type: "base",
      actions: [
        {
          card: "fpcha10",
          type: "combat-card-choose"
        }
      ]
    },
    {
      actions: [
        {
          dice: [1],
          type: "combat-roll"
        }
      ],
      type: "base",
      time: 298,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 298,
      type: "base",
      actions: [
        {
          dice: [2, 5, 5],
          type: "combat-roll"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 299,
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [6]
        }
      ]
    },
    {
      actions: [
        {
          dice: [6, 5],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      time: 299,
      playerId: "shadow"
    },
    {
      time: 300,
      playerId: "free-peoples",
      actions: [
        {
          region: "helms-deep",
          nation: "rohan",
          type: "leader-elimination",
          quantity: 1
        }
      ],
      type: "combat-card-effect",
      card: "fpcha10"
    },
    {
      actions: [
        {
          nation: "isengard",
          type: "elite-unit-downgrade",
          quantity: 1,
          region: "helms-deep"
        }
      ],
      type: "base",
      time: 301,
      playerId: "shadow"
    },
    {
      actions: [
        {
          nation: "isengard",
          type: "elite-unit-downgrade",
          quantity: 1,
          region: "helms-deep"
        },
        {
          type: "battle-continue",
          region: "helms-deep"
        }
      ],
      type: "base",
      time: 302,
      playerId: "shadow"
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow",
      time: 303
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples",
      time: 304
    },
    {
      type: "base",
      actions: [
        {
          dice: [1],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples",
      time: 305
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [4, 6, 3]
        }
      ],
      type: "base",
      time: 305,
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "combat-re-roll",
          dice: [1]
        }
      ],
      type: "base",
      time: 306,
      playerId: "free-peoples"
    },
    {
      playerId: "free-peoples",
      time: 307,
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "regular-unit-elimination",
          nation: "rohan",
          region: "helms-deep"
        },
        {
          region: "helms-deep",
          nation: "rohan",
          type: "leader-elimination",
          quantity: 2
        },
        {
          characters: ["gandalf-the-white"],
          type: "character-elimination"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 308,
      type: "die",
      actions: [
        {
          cards: ["fpcha08"],
          type: "card-draw"
        }
      ],
      die: "event"
    },
    {
      die: "event",
      type: "die",
      actions: [
        {
          cards: ["sstr10"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      time: 309
    },
    {
      type: "base",
      actions: [
        {
          cards: ["fpcha03", "fpstr10"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples",
      time: 310
    },
    {
      actions: [
        {
          cards: ["scha18", "sstr19"],
          type: "card-draw"
        }
      ],
      type: "base",
      time: 310,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 311,
      type: "base",
      actions: [
        {
          type: "fellowship-declare",
          region: "morannon"
        }
      ]
    },
    {
      playerId: "shadow",
      time: 312,
      type: "base",
      actions: [
        {
          quantity: 2,
          type: "hunt-allocation"
        }
      ]
    },
    {
      time: 313,
      playerId: "free-peoples",
      actions: [
        {
          type: "action-roll",
          dice: ["character", "muster", "muster", "character", "character"]
        }
      ],
      type: "base"
    },
    {
      time: 313,
      playerId: "shadow",
      actions: [
        {
          type: "action-roll",
          dice: ["eye", "event", "army", "muster", "muster", "muster", "event"]
        }
      ],
      type: "base"
    },
    {
      die: "muster",
      type: "die",
      actions: [
        {
          type: "regular-unit-recruitment",
          quantity: 1,
          nation: "rohan",
          region: "westemnet"
        },
        {
          region: "erebor",
          quantity: 1,
          type: "leader-recruitment",
          nation: "dwarves"
        }
      ],
      playerId: "free-peoples",
      time: 314
    },
    {
      die: "muster",
      type: "die",
      actions: [
        {
          characters: ["the-mouth-of-sauron"],
          region: "moria",
          type: "character-play"
        }
      ],
      playerId: "shadow",
      time: 315
    },
    {
      die: "character",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die",
      time: 316,
      playerId: "free-peoples"
    },
    {
      type: "base",
      actions: [
        {
          tiles: ["er"],
          type: "hunt-tile-draw"
        }
      ],
      playerId: "shadow",
      time: 317
    },
    {
      playerId: "free-peoples",
      time: 318,
      type: "card-effect-skip",
      card: "fpcha05"
    },
    {
      type: "base",
      actions: [
        {
          characters: ["legolas"],
          type: "character-elimination"
        },
        {
          companion: "meriadoc",
          type: "fellowship-guide"
        },
        {
          type: "character-elimination",
          characters: ["meriadoc"]
        }
      ],
      playerId: "free-peoples",
      time: 319
    },
    {
      playerId: "shadow",
      time: 320,
      type: "die-card",
      actions: [
        {
          type: "elite-unit-recruitment",
          quantity: 2,
          nation: "sauron",
          region: "moria"
        },
        {
          region: "moria",
          quantity: 1,
          type: "nazgul-recruitment"
        }
      ],
      card: "sstr19",
      die: "event"
    },
    {
      playerId: "free-peoples",
      time: 321,
      type: "die",
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      die: "character"
    },
    {
      playerId: "shadow",
      time: 322,
      type: "die",
      actions: [
        {
          fromRegion: "moria",
          type: "army-movement",
          toRegion: "hollin"
        },
        {
          type: "army-movement",
          toRegion: "parth-celebrant",
          fromRegion: "lorien"
        }
      ],
      die: "army"
    },
    {
      playerId: "free-peoples",
      time: 323,
      type: "die-pass"
    },
    {
      character: "the-mouth-of-sauron",
      die: "muster",
      actions: [
        {
          fromRegion: "hollin",
          type: "army-movement",
          toRegion: "troll-shaws"
        },
        {
          nation: "sauron",
          type: "regular-unit-disband",
          quantity: 1,
          region: "troll-shaws"
        },
        {
          toRegion: "eastemnet",
          type: "army-movement",
          fromRegion: "parth-celebrant"
        }
      ],
      type: "die",
      time: 324,
      playerId: "shadow"
    },
    {
      time: 325,
      playerId: "free-peoples",
      actions: [
        {
          region: "folde",
          nation: "rohan",
          type: "regular-unit-recruitment",
          quantity: 1
        },
        {
          region: "edoras",
          nation: "rohan",
          quantity: 1,
          type: "regular-unit-recruitment"
        }
      ],
      type: "die",
      die: "muster"
    },
    {
      die: "event",
      playerId: "shadow",
      time: 326,
      type: "die",
      actions: [
        {
          cards: ["sstr24"],
          type: "card-draw"
        }
      ]
    },
    {
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die",
      time: 327,
      playerId: "free-peoples",
      die: "character"
    },
    {
      type: "base",
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["1"]
        }
      ],
      playerId: "shadow",
      time: 328
    },
    {
      card: "fpcha05",
      type: "card-effect-skip",
      time: 329,
      playerId: "free-peoples"
    },
    {
      time: 330,
      playerId: "free-peoples",
      actions: [
        {
          quantity: 1,
          type: "fellowship-corruption"
        }
      ],
      type: "base"
    },
    {
      playerId: "shadow",
      time: 331,
      type: "die",
      actions: [
        {
          toRegion: "folde",
          type: "army-attack",
          fromRegion: "eastemnet"
        }
      ],
      die: "army",
      elvenRing: {
        ring: "nenya",
        toDie: "army",
        fromDie: "muster"
      }
    },
    {
      time: 332,
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples",
      time: 333
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [6]
        }
      ],
      type: "base",
      time: 334,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [4, 3, 4, 5, 4]
        }
      ],
      type: "base",
      time: 334,
      playerId: "shadow"
    },
    {
      type: "base",
      actions: [
        {
          region: "eastemnet",
          type: "regular-unit-elimination",
          quantity: 1,
          nation: "sauron"
        }
      ],
      playerId: "shadow",
      time: 335
    },
    {
      type: "base",
      actions: [
        {
          region: "folde",
          quantity: 1,
          type: "regular-unit-elimination",
          nation: "rohan"
        }
      ],
      playerId: "free-peoples",
      time: 336
    },
    {
      playerId: "shadow",
      time: 337,
      type: "base",
      actions: [
        {
          type: "army-advance"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 338,
      type: "base",
      actions: [
        {
          cards: ["fpcha19", "fpstr04"],
          type: "card-draw"
        }
      ]
    },
    {
      time: 338,
      playerId: "shadow",
      actions: [
        {
          cards: ["scha11", "sstr18"],
          type: "card-draw"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          cards: ["fpcha08"],
          type: "card-discard"
        }
      ],
      playerId: "free-peoples",
      time: 339
    },
    {
      time: 339,
      playerId: "shadow",
      actions: [
        {
          cards: ["scha22"],
          type: "card-discard"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      actions: [],
      playerId: "free-peoples",
      time: 340
    },
    {
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      type: "base",
      time: 341,
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: ["character", "character", "muster", "event", "muster-army"]
        }
      ],
      type: "base",
      time: 342,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: [
            "character",
            "army",
            "character",
            "character",
            "eye",
            "event",
            "muster",
            "event",
            "muster-army"
          ]
        }
      ],
      type: "base",
      time: 342,
      playerId: "shadow"
    },
    {
      die: "muster-army",
      playerId: "free-peoples",
      time: 343,
      type: "die",
      actions: [
        {
          fromRegion: "westemnet",
          type: "army-movement",
          toRegion: "edoras"
        },
        {
          fromRegion: "osgiliath",
          toRegion: "druadan-forest",
          type: "army-movement"
        }
      ]
    },
    {
      type: "die",
      actions: [
        {
          fromRegion: "troll-shaws",
          toRegion: "rivendell",
          type: "army-attack"
        }
      ],
      playerId: "shadow",
      time: 344,
      die: "character"
    },
    {
      type: "base",
      actions: [
        {
          region: "rivendell",
          type: "army-retreat-into-siege"
        }
      ],
      playerId: "free-peoples",
      time: 345
    },
    {
      time: 346,
      playerId: "shadow",
      actions: [
        {
          type: "army-advance"
        }
      ],
      type: "base"
    },
    {
      type: "die",
      actions: [
        {
          region: "edoras",
          quantity: 1,
          type: "elite-unit-recruitment",
          nation: "rohan"
        }
      ],
      playerId: "free-peoples",
      time: 347,
      die: "muster"
    },
    {
      playerId: "shadow",
      time: 348,
      type: "die",
      actions: [
        {
          fromRegion: "folde",
          type: "nazgul-movement",
          toRegion: "rivendell",
          nNazgul: 1
        },
        {
          type: "character-movement",
          toRegion: "rivendell",
          characters: ["the-witch-king"],
          fromRegion: "folde"
        },
        {
          fromRegion: "dagorlad",
          nNazgul: 1,
          toRegion: "folde",
          type: "nazgul-movement"
        }
      ],
      die: "character"
    },
    {
      time: 349,
      playerId: "free-peoples",
      type: "die-pass"
    },
    {
      die: "character",
      actions: [
        {
          fromRegion: "rivendell",
          toRegion: "rivendell",
          type: "army-attack"
        }
      ],
      type: "die",
      time: 350,
      playerId: "shadow"
    },
    {
      time: 351,
      playerId: "shadow",
      actions: [
        {
          card: "scha11",
          type: "combat-card-choose"
        }
      ],
      type: "base"
    },
    {
      type: "base",
      actions: [
        {
          card: "fpstr13",
          type: "combat-card-choose"
        }
      ],
      playerId: "free-peoples",
      time: 352
    },
    {
      type: "base",
      actions: [
        {
          dice: [5, 6, 5, 1, 2],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples",
      time: 353
    },
    {
      type: "combat-card-effect",
      actions: [
        {
          nation: "sauron",
          quantity: 3,
          type: "regular-unit-elimination",
          region: "rivendell"
        }
      ],
      playerId: "shadow",
      time: 354,
      card: "fpstr13"
    },
    {
      playerId: "free-peoples",
      time: 355,
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [6, 6, 5, 6, 4]
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          dice: [5, 2, 2, 5, 4],
          type: "combat-roll"
        }
      ],
      playerId: "shadow",
      time: 355
    },
    {
      playerId: "free-peoples",
      time: 356,
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [5]
        }
      ]
    },
    {
      type: "base",
      actions: [
        {
          dice: [5, 4, 6, 5, 1],
          type: "combat-re-roll"
        }
      ],
      playerId: "shadow",
      time: 356
    },
    {
      card: "scha11",
      actions: [
        {
          quantity: 1,
          type: "leader-elimination",
          nation: "elves",
          region: "rivendell"
        }
      ],
      type: "combat-card-effect",
      time: 357,
      playerId: "shadow"
    },
    {
      actions: [
        {
          region: "rivendell",
          type: "elite-unit-downgrade",
          quantity: 1,
          nation: "sauron"
        },
        {
          nation: "sauron",
          quantity: 2,
          type: "elite-unit-elimination",
          region: "rivendell"
        }
      ],
      type: "base",
      time: 358,
      playerId: "shadow"
    },
    {
      time: 359,
      playerId: "free-peoples",
      actions: [
        {
          nation: "elves",
          type: "elite-unit-downgrade",
          quantity: 1,
          region: "rivendell"
        }
      ],
      type: "base"
    },
    {
      character: "the-witch-king",
      actions: [
        {
          cards: ["scha04"],
          type: "card-draw"
        }
      ],
      type: "character-effect",
      time: 360,
      playerId: "shadow"
    },
    {
      type: "die-pass",
      playerId: "free-peoples",
      time: 361
    },
    {
      card: "scha04",
      die: "event",
      time: 362,
      playerId: "shadow",
      actions: [
        {
          tile: "r1rs",
          type: "hunt-tile-add"
        }
      ],
      type: "die-card"
    },
    {
      type: "die-pass",
      playerId: "free-peoples",
      time: 363
    },
    {
      type: "die-card",
      actions: [
        {
          type: "regular-unit-recruitment",
          quantity: 2,
          nation: "sauron",
          region: "moria"
        },
        {
          quantity: 2,
          type: "regular-unit-recruitment",
          nation: "sauron",
          region: "mount-gundabad"
        },
        {
          type: "regular-unit-recruitment",
          quantity: 2,
          nation: "sauron",
          region: "minas-morgul"
        }
      ],
      playerId: "shadow",
      time: 364,
      die: "event",
      card: "sstr24"
    },
    {
      die: "event",
      card: "fpcha03",
      actions: [
        {
          tile: "b-2",
          type: "hunt-tile-add"
        }
      ],
      type: "die-card",
      time: 365,
      playerId: "free-peoples"
    },
    {
      character: "saruman",
      die: "muster",
      playerId: "shadow",
      time: 366,
      type: "die",
      actions: [
        {
          region: "north-dunland",
          type: "regular-unit-recruitment",
          quantity: 1,
          nation: "isengard"
        },
        {
          quantity: 1,
          type: "regular-unit-recruitment",
          nation: "isengard",
          region: "south-dunland"
        },
        {
          region: "orthanc",
          nation: "isengard",
          quantity: 1,
          type: "regular-unit-recruitment"
        }
      ]
    },
    {
      die: "character",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die",
      time: 367,
      playerId: "free-peoples"
    },
    {
      time: 368,
      playerId: "shadow",
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["b-1"]
        }
      ],
      type: "base"
    },
    {
      card: "fpcha05",
      time: 369,
      playerId: "free-peoples",
      type: "card-effect-skip"
    },
    {
      die: "muster-army",
      type: "die",
      actions: [
        {
          nation: "sauron",
          type: "elite-unit-recruitment",
          quantity: 1,
          region: "moria"
        }
      ],
      playerId: "shadow",
      time: 370
    },
    {
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die",
      time: 371,
      playerId: "free-peoples",
      die: "character"
    },
    {
      playerId: "shadow",
      time: 372,
      type: "base",
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["b0"]
        }
      ]
    },
    {
      card: "fpcha05",
      type: "card-effect-skip",
      time: 373,
      playerId: "free-peoples"
    },
    {
      type: "die",
      actions: [
        {
          fromRegion: "moria",
          toRegion: "hollin",
          type: "army-movement"
        },
        {
          fromRegion: "north-dunland",
          toRegion: "hollin",
          type: "army-movement"
        }
      ],
      playerId: "shadow",
      time: 374,
      die: "army"
    },
    {
      type: "base",
      actions: [
        {
          cards: ["fpcha21", "fpstr17"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples",
      time: 375
    },
    {
      actions: [
        {
          cards: ["scha09", "sstr11"],
          type: "card-draw"
        }
      ],
      type: "base",
      time: 375,
      playerId: "shadow"
    },
    {
      type: "base",
      actions: [],
      playerId: "free-peoples",
      time: 376
    },
    {
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      playerId: "shadow",
      time: 377
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: ["muster-army", "muster", "will-of-the-west", "will-of-the-west", "muster-army"]
        }
      ],
      type: "base",
      time: 378,
      playerId: "free-peoples"
    },
    {
      type: "base",
      actions: [
        {
          dice: [
            "eye",
            "eye",
            "event",
            "muster",
            "character",
            "character",
            "character",
            "event",
            "eye"
          ],
          type: "action-roll"
        }
      ],
      playerId: "shadow",
      time: 378
    },
    {
      playerId: "free-peoples",
      time: 379,
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      die: "will-of-the-west"
    },
    {
      playerId: "shadow",
      time: 380,
      type: "base",
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["er"]
        }
      ]
    },
    {
      time: 381,
      playerId: "free-peoples",
      type: "card-effect-skip",
      card: "fpcha05"
    },
    {
      actions: [
        {
          quantity: 4,
          type: "fellowship-corruption"
        }
      ],
      type: "base",
      time: 382,
      playerId: "free-peoples"
    }
  ]
};
