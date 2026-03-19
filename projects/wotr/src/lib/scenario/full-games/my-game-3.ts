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
      time: 1,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha06", "fpstr06"]
        }
      ]
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          cards: ["scha08", "sstr13"],
          type: "card-draw"
        }
      ],
      time: 1
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [],
      time: 2
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
      time: 3
    },
    {
      time: 4,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "action-roll",
          dice: ["muster-army", "event", "muster", "muster"]
        }
      ]
    },
    {
      time: 4,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: ["event", "event", "character", "eye", "army", "character"],
          type: "action-roll"
        }
      ]
    },
    {
      die: "event",
      time: 5,
      playerId: "free-peoples",
      card: "fpcha06",
      type: "die-card",
      actions: [
        {
          card: "fpcha06",
          type: "card-play-on-table"
        }
      ]
    },
    {
      type: "character-effect",
      actions: [
        {
          cards: ["fpcha12"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples",
      character: "gandalf-the-grey",
      time: 6
    },
    {
      actions: [
        {
          cards: ["sstr22"],
          type: "card-draw"
        }
      ],
      type: "die",
      playerId: "shadow",
      die: "event",
      time: 7
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 8
    },
    {
      actions: [
        {
          cards: ["scha09"],
          type: "card-draw"
        }
      ],
      type: "die",
      playerId: "shadow",
      die: "event",
      time: 9
    },
    {
      time: 10,
      die: "muster",
      playerId: "free-peoples",
      actions: [
        {
          nation: "elves",
          quantity: 1,
          type: "political-advance"
        }
      ],
      type: "die"
    },
    {
      actions: [
        {
          toRegion: "gorgoroth",
          fromRegion: "barad-dur",
          type: "army-movement"
        },
        {
          toRegion: "gorgoroth",
          fromRegion: "nurn",
          type: "army-movement"
        }
      ],
      type: "die",
      time: 11,
      die: "army",
      playerId: "shadow"
    },
    {
      actions: [
        {
          quantity: 1,
          nation: "elves",
          type: "political-advance"
        }
      ],
      type: "die",
      time: 12,
      die: "muster",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      die: "character",
      time: 13,
      actions: [
        {
          fromRegion: "gorgoroth",
          toRegion: "minas-morgul",
          leftUnits: {
            elites: [],
            nNazgul: 0,
            regulars: [
              {
                quantity: 5,
                nation: "sauron"
              }
            ],
            front: "shadow"
          },
          type: "army-movement"
        }
      ],
      type: "die"
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
      playerId: "free-peoples",
      time: 14,
      die: "muster-army"
    },
    {
      time: 15,
      die: "character",
      playerId: "shadow",
      actions: [
        {
          type: "army-movement",
          fromRegion: "minas-morgul",
          toRegion: "south-ithilien"
        }
      ],
      type: "die"
    },
    {
      playerId: "free-peoples",
      type: "token-skip",
      time: 16
    },
    {
      time: 17,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha19", "fpstr24"]
        }
      ]
    },
    {
      time: 17,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "card-draw",
          cards: ["scha15", "sstr14"]
        }
      ]
    },
    {
      actions: [],
      playerId: "free-peoples",
      type: "base",
      time: 18
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          quantity: 0,
          type: "hunt-allocation"
        }
      ],
      time: 19
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: ["muster-army", "event", "character", "muster-army"]
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 20
    },
    {
      time: 20,
      actions: [
        {
          type: "action-roll",
          dice: ["eye", "eye", "event", "muster-army", "muster-army", "muster-army", "army"]
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      type: "die-card",
      actions: [
        {
          type: "region-choose",
          region: "south-ithilien"
        },
        {
          type: "combat-roll",
          dice: [6, 2, 4]
        }
      ],
      playerId: "free-peoples",
      card: "fpstr06",
      die: "event",
      time: 21
    },
    {
      playerId: "shadow",
      card: "fpstr06",
      time: 22,
      type: "card-effect",
      actions: [
        {
          type: "regular-unit-elimination",
          region: "south-ithilien",
          quantity: 1,
          nation: "sauron"
        }
      ]
    },
    {
      actions: [
        {
          nation: "gondor",
          quantity: 1,
          region: "osgiliath",
          type: "elite-unit-recruitment"
        },
        {
          nation: "gondor",
          quantity: 1,
          region: "osgiliath",
          type: "leader-recruitment"
        }
      ],
      type: "card-effect",
      playerId: "free-peoples",
      card: "fpstr06",
      time: 23
    },
    {
      actions: [
        {
          type: "card-draw",
          cards: ["fpstr20"]
        }
      ],
      type: "character-effect",
      character: "gandalf-the-grey",
      playerId: "free-peoples",
      time: 24
    },
    {
      time: 25,
      die: "event",
      card: "scha15",
      playerId: "shadow",
      type: "die-card",
      actions: [
        {
          card: "scha15",
          type: "card-play-on-table"
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 26
    },
    {
      type: "die",
      actions: [
        {
          type: "political-advance",
          nation: "isengard",
          quantity: 1
        }
      ],
      time: 27,
      die: "muster-army",
      playerId: "shadow"
    },
    {
      actions: [
        {
          region: "woodland-realm",
          type: "elite-unit-recruitment",
          nation: "elves",
          quantity: 1
        },
        {
          cards: ["fpstr04"],
          type: "card-draw"
        }
      ],
      type: "die-card",
      die: "muster-army",
      time: 28,
      playerId: "free-peoples",
      card: "fpstr24"
    },
    {
      playerId: "shadow",
      card: "sstr22",
      die: "muster-army",
      time: 29,
      type: "die-card",
      actions: [
        {
          region: "weather-hills",
          type: "regular-unit-recruitment",
          nation: "sauron",
          quantity: 1
        },
        {
          type: "regular-unit-recruitment",
          region: "ettenmoors",
          quantity: 1,
          nation: "sauron"
        },
        {
          quantity: 1,
          nation: "sauron",
          type: "regular-unit-recruitment",
          region: "angmar"
        },
        {
          nation: "sauron",
          quantity: 1,
          region: "troll-shaws",
          type: "elite-unit-recruitment"
        }
      ]
    },
    {
      type: "die",
      actions: [
        {
          companions: ["strider", "gimli", "meriadoc"],
          toRegion: "buckland",
          type: "companion-separation"
        }
      ],
      die: "character",
      time: 30,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 31,
      die: "army",
      type: "die",
      actions: [
        {
          fromRegion: "dol-guldur",
          toRegion: "north-anduin-vale",
          type: "army-movement"
        },
        {
          type: "army-movement",
          toRegion: "morannon",
          fromRegion: "gorgoroth"
        }
      ]
    },
    {
      playerId: "free-peoples",
      card: "fpstr04",
      die: "muster-army",
      time: 32,
      actions: [
        {
          type: "character-movement",
          characters: ["strider"],
          toRegion: "enedwaith",
          fromRegion: "buckland"
        },
        {
          type: "character-movement",
          fromRegion: "buckland",
          toRegion: "the-shire",
          characters: ["meriadoc"]
        },
        {
          type: "character-movement",
          fromRegion: "buckland",
          characters: ["gimli"],
          toRegion: "ered-luin"
        }
      ],
      type: "die-card"
    },
    {
      actions: [
        {
          type: "character-play",
          region: "orthanc",
          characters: ["saruman"]
        }
      ],
      type: "die",
      playerId: "shadow",
      die: "muster-army",
      time: 33
    },
    {
      playerId: "free-peoples",
      type: "token-skip",
      time: 34
    },
    {
      time: 35,
      actions: [
        {
          cards: ["fpcha05", "fpstr15"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      time: 35,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "card-draw",
          cards: ["scha05", "sstr12"]
        }
      ]
    },
    {
      time: 36,
      actions: [
        {
          region: "rivendell",
          type: "fellowship-declare"
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
          quantity: 0,
          type: "hunt-allocation"
        }
      ],
      time: 37
    },
    {
      time: 38,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "action-roll",
          dice: ["muster-army", "character", "event", "character"]
        }
      ]
    },
    {
      time: 38,
      actions: [
        {
          type: "action-roll",
          dice: ["muster-army", "muster", "muster", "character", "eye", "event", "eye", "eye"]
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      time: 39,
      type: "die-pass",
      playerId: "free-peoples"
    },
    {
      time: 40,
      die: "muster",
      character: "saruman",
      playerId: "shadow",
      actions: [
        {
          type: "regular-unit-recruitment",
          region: "north-dunland",
          quantity: 1,
          nation: "isengard"
        },
        {
          nation: "isengard",
          quantity: 1,
          region: "south-dunland",
          type: "regular-unit-recruitment"
        },
        {
          type: "regular-unit-recruitment",
          region: "orthanc",
          quantity: 1,
          nation: "isengard"
        }
      ],
      type: "die"
    },
    {
      type: "die-card",
      actions: [
        {
          card: "fpcha05",
          type: "card-play-on-table"
        }
      ],
      card: "fpcha05",
      playerId: "free-peoples",
      time: 41,
      die: "event"
    },
    {
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha21"]
        }
      ],
      type: "character-effect",
      time: 42,
      character: "gandalf-the-grey",
      playerId: "free-peoples"
    },
    {
      type: "die",
      actions: [
        {
          nation: "isengard",
          quantity: 1,
          region: "north-dunland",
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
          quantity: 1,
          region: "orthanc",
          type: "regular-unit-recruitment"
        }
      ],
      playerId: "shadow",
      character: "saruman",
      time: 43,
      die: "muster"
    },
    {
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      time: 44,
      die: "character",
      playerId: "free-peoples"
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "hunt-roll",
          dice: [3, 3, 4]
        }
      ],
      time: 45
    },
    {
      time: 46,
      die: "muster-army",
      character: "saruman",
      playerId: "shadow",
      actions: [
        {
          quantity: 2,
          nation: "isengard",
          type: "regular-unit-upgrade",
          region: "orthanc"
        }
      ],
      type: "die"
    },
    {
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die",
      playerId: "free-peoples",
      time: 47,
      die: "character"
    },
    {
      time: 48,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "hunt-roll",
          dice: [5, 5, 4]
        }
      ]
    },
    {
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["3"]
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 49
    },
    {
      type: "card-effect-skip",
      playerId: "free-peoples",
      card: "fpcha05",
      time: 50
    },
    {
      time: 51,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          characters: ["gandalf-the-grey"],
          type: "character-elimination"
        },
        {
          type: "fellowship-guide",
          companion: "boromir"
        }
      ]
    },
    {
      actions: [
        {
          region: "orthanc",
          type: "elite-unit-recruitment",
          nation: "isengard",
          quantity: 1
        }
      ],
      type: "die-card",
      playerId: "shadow",
      card: "sstr13",
      die: "event",
      time: 52
    },
    {
      type: "die-card",
      actions: [
        {
          nation: "north",
          quantity: 1,
          region: "the-shire",
          type: "elite-unit-recruitment"
        },
        {
          region: "ered-luin",
          type: "elite-unit-recruitment",
          nation: "dwarves",
          quantity: 1
        },
        {
          cards: ["fpstr23"],
          type: "card-draw"
        }
      ],
      card: "fpstr20",
      playerId: "free-peoples",
      time: 53,
      die: "muster-army"
    },
    {
      playerId: "shadow",
      time: 54,
      die: "character",
      type: "die",
      actions: [
        {
          type: "army-attack",
          toRegion: "fords-of-isen",
          fromRegion: "orthanc"
        }
      ]
    },
    {
      time: 55,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          card: "sstr12",
          type: "combat-card-choose"
        }
      ]
    },
    {
      time: 56,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          card: "fpcha21",
          type: "combat-card-choose"
        }
      ]
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [3, 4]
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 57
    },
    {
      time: 57,
      actions: [
        {
          type: "combat-roll",
          dice: [6, 1, 4, 3, 4]
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      actions: [
        {
          dice: [3],
          type: "combat-re-roll"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 58
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [4, 6, 5, 3]
        }
      ],
      time: 58
    },
    {
      time: 59,
      actions: [
        {
          type: "regular-unit-elimination",
          region: "fords-of-isen",
          quantity: 2,
          nation: "rohan"
        },
        {
          nation: "rohan",
          quantity: 1,
          region: "fords-of-isen",
          type: "leader-elimination"
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      time: 60,
      actions: [
        {
          leftUnits: {
            characters: ["saruman"],
            regulars: [],
            front: "shadow",
            elites: []
          },
          type: "army-advance"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      type: "token-skip",
      playerId: "free-peoples",
      time: 61
    },
    {
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha09", "fpstr09"]
        }
      ],
      time: 62
    },
    {
      time: 62,
      actions: [
        {
          cards: ["scha21", "sstr10"],
          type: "card-draw"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      actions: [],
      playerId: "free-peoples",
      type: "base",
      time: 63
    },
    {
      time: 64,
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "action-roll",
          dice: ["muster", "event", "will-of-the-west", "character"]
        }
      ],
      time: 65
    },
    {
      actions: [
        {
          dice: ["eye", "character", "eye", "muster", "army", "eye", "army"],
          type: "action-roll"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 65
    },
    {
      playerId: "free-peoples",
      time: 66,
      die: "will-of-the-west",
      type: "die",
      actions: [
        {
          region: "fangorn",
          type: "character-play",
          characters: ["gandalf-the-white"]
        }
      ]
    },
    {
      actions: [
        {
          type: "army-movement",
          leftUnits: {
            elites: [
              {
                nation: "isengard",
                quantity: 4
              }
            ],
            front: "shadow",
            regulars: [
              {
                quantity: 1,
                nation: "isengard"
              }
            ],
            characters: []
          },
          fromRegion: "fords-of-isen",
          toRegion: "orthanc"
        },
        {
          toRegion: "westemnet",
          fromRegion: "fords-of-isen",
          type: "army-movement",
          leftUnits: {
            elites: [
              {
                nation: "isengard",
                quantity: 4
              }
            ],
            front: "shadow",
            regulars: [],
            characters: []
          }
        }
      ],
      type: "die",
      die: "army",
      time: 67,
      playerId: "shadow"
    },
    {
      die: "event",
      time: 68,
      playerId: "free-peoples",
      card: "fpstr23",
      actions: [
        {
          quantity: 1,
          nation: "rohan",
          type: "elite-unit-recruitment",
          region: "helms-deep"
        },
        {
          type: "leader-recruitment",
          region: "helms-deep",
          quantity: 1,
          nation: "rohan"
        }
      ],
      type: "die-card"
    },
    {
      die: "muster",
      time: 69,
      playerId: "shadow",
      type: "die",
      actions: [
        {
          nation: "sauron",
          quantity: 1,
          type: "political-advance"
        }
      ]
    },
    {
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      die: "character",
      time: 70,
      playerId: "free-peoples"
    },
    {
      time: 71,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          dice: [1, 6, 4, 3],
          type: "hunt-roll"
        }
      ]
    },
    {
      time: 72,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          tiles: ["0r"],
          type: "hunt-tile-draw"
        }
      ]
    },
    {
      time: 73,
      type: "card-effect-skip",
      playerId: "free-peoples",
      card: "fpcha05"
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          region: "goblins-gate",
          type: "fellowship-reveal"
        }
      ],
      time: 74
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
      playerId: "shadow",
      time: 75,
      die: "army"
    },
    {
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          region: "helms-deep",
          type: "army-retreat-into-siege"
        }
      ],
      time: 76
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "army-advance"
        }
      ],
      time: 77
    },
    {
      actions: [
        {
          quantity: 1,
          nation: "elves",
          type: "elite-unit-recruitment",
          region: "lorien"
        },
        {
          type: "card-draw",
          cards: ["fpstr19"]
        }
      ],
      type: "die-card",
      die: "muster",
      time: 78,
      playerId: "free-peoples",
      card: "fpstr15"
    },
    {
      type: "die-card",
      actions: [
        {
          type: "combat-roll",
          dice: [4, 1, 4]
        }
      ],
      time: 79,
      die: "character",
      card: "scha08",
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "token-skip",
      time: 80
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          cards: ["fpcha07", "fpstr12"],
          type: "card-draw"
        }
      ],
      time: 81
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "card-draw",
          cards: ["scha06", "sstr18"]
        }
      ],
      time: 81
    },
    {
      time: 82,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          cards: ["fpstr19"],
          type: "card-discard"
        }
      ]
    },
    {
      actions: [
        {
          cards: ["sstr18"],
          type: "card-discard"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 82
    },
    {
      actions: [],
      type: "base",
      playerId: "free-peoples",
      time: 83
    },
    {
      time: 84,
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      time: 85,
      actions: [
        {
          dice: ["character", "will-of-the-west", "character", "muster-army", "will-of-the-west"],
          type: "action-roll"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      time: 85,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: ["event", "army", "event", "event", "army", "character", "character"],
          type: "action-roll"
        }
      ]
    },
    {
      playerId: "free-peoples",
      die: "character",
      time: 86,
      type: "die",
      actions: [
        {
          type: "fellowship-hide"
        }
      ]
    },
    {
      actions: [
        {
          card: "scha21",
          type: "card-play-on-table"
        }
      ],
      type: "die-card",
      time: 87,
      die: "character",
      card: "scha21",
      playerId: "shadow"
    },
    {
      type: "die",
      actions: [
        {
          region: "edoras",
          type: "elite-unit-recruitment",
          nation: "rohan",
          quantity: 1
        }
      ],
      playerId: "free-peoples",
      time: 88,
      die: "muster-army"
    },
    {
      type: "die-card",
      actions: [
        {
          tiles: ["er"],
          type: "hunt-tile-draw"
        }
      ],
      time: 89,
      die: "event",
      card: "scha06",
      playerId: "shadow"
    },
    {
      time: 90,
      card: "scha21",
      playerId: "shadow",
      actions: [
        {
          cards: ["scha10"],
          type: "card-draw"
        }
      ],
      type: "card-effect"
    },
    {
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      time: 91,
      die: "character",
      playerId: "free-peoples"
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "hunt-roll",
          dice: [2]
        }
      ],
      time: 92
    },
    {
      type: "die-card",
      actions: [
        {
          toRegion: "goblins-gate",
          nNazgul: 1,
          fromRegion: "morannon",
          type: "nazgul-movement"
        },
        {
          type: "nazgul-movement",
          fromRegion: "south-ithilien",
          toRegion: "old-ford",
          nNazgul: 1
        },
        {
          fromRegion: "north-anduin-vale",
          toRegion: "south-ithilien",
          nNazgul: 1,
          type: "nazgul-movement"
        }
      ],
      playerId: "shadow",
      card: "scha09",
      die: "event",
      time: 93
    },
    {
      time: 94,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-reveal",
          region: "old-ford"
        }
      ]
    },
    {
      type: "card-effect",
      actions: [
        {
          cards: ["scha13"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      card: "scha21",
      time: 95
    },
    {
      time: 96,
      die: "will-of-the-west",
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      type: "die"
    },
    {
      time: 97,
      die: "event",
      card: "scha05",
      playerId: "shadow",
      type: "die-card",
      actions: [
        {
          tiles: ["1"],
          type: "hunt-tile-draw"
        }
      ]
    },
    {
      time: 98,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          card: "fpcha06",
          type: "card-discard-from-table"
        }
      ]
    },
    {
      type: "card-effect",
      actions: [
        {
          type: "card-draw",
          cards: ["scha24"]
        }
      ],
      time: 99,
      card: "scha21",
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 100
    },
    {
      die: "army",
      time: 101,
      playerId: "shadow",
      card: "sstr14",
      actions: [
        {
          region: "helms-deep",
          type: "elite-unit-recruitment",
          nation: "sauron",
          quantity: 1
        }
      ],
      type: "die-card"
    },
    {
      time: 102,
      playerId: "free-peoples",
      type: "die-pass"
    },
    {
      playerId: "shadow",
      die: "character",
      time: 103,
      type: "die",
      actions: [
        {
          type: "army-attack",
          toRegion: "helms-deep",
          fromRegion: "helms-deep"
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
      time: 104
    },
    {
      time: 105,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          card: "fpcha19",
          type: "combat-card-choose"
        }
      ]
    },
    {
      actions: [
        {
          dice: [5, 2],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 106
    },
    {
      actions: [
        {
          dice: [3, 1, 4, 2, 4],
          type: "combat-roll"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 106
    },
    {
      actions: [
        {
          dice: [6],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 107
    },
    {
      actions: [
        {
          dice: [6, 5, 4, 1],
          type: "combat-re-roll"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 107
    },
    {
      time: 108,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          nation: "sauron",
          quantity: 1,
          region: "helms-deep",
          type: "elite-unit-elimination"
        }
      ]
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          quantity: 1,
          nation: "rohan",
          type: "elite-unit-downgrade",
          region: "helms-deep"
        }
      ],
      time: 109
    },
    {
      actions: [
        {
          quantity: 1,
          nation: "isengard",
          type: "elite-unit-downgrade",
          region: "helms-deep"
        },
        {
          type: "battle-continue",
          region: "helms-deep"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 110
    },
    {
      time: 111,
      type: "base",
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
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 112
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: [3, 4],
          type: "combat-roll"
        }
      ],
      time: 113
    },
    {
      time: 113,
      actions: [
        {
          type: "combat-roll",
          dice: [1, 6, 3, 5]
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      time: 114,
      actions: [
        {
          dice: [2],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      time: 114,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [5, 4, 1]
        }
      ]
    },
    {
      time: 115,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          nation: "rohan",
          quantity: 1,
          region: "helms-deep",
          type: "regular-unit-elimination"
        }
      ]
    },
    {
      time: 116,
      actions: [
        {
          type: "elite-unit-downgrade",
          region: "helms-deep",
          quantity: 1,
          nation: "isengard"
        },
        {
          region: "helms-deep",
          type: "battle-continue"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      time: 117,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      time: 118,
      type: "base",
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
      actions: [
        {
          dice: [6],
          type: "combat-roll"
        }
      ],
      time: 119
    },
    {
      time: 119,
      actions: [
        {
          dice: [5, 2, 3, 6],
          type: "combat-roll"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      time: 120,
      actions: [
        {
          region: "helms-deep",
          type: "regular-unit-elimination",
          nation: "isengard",
          quantity: 1
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      actions: [
        {
          type: "regular-unit-elimination",
          region: "helms-deep",
          quantity: 1,
          nation: "rohan"
        },
        {
          nation: "rohan",
          quantity: 1,
          region: "helms-deep",
          type: "leader-elimination"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 121
    },
    {
      type: "die",
      actions: [
        {
          region: "folde",
          type: "regular-unit-recruitment",
          nation: "rohan",
          quantity: 1
        },
        {
          region: "edoras",
          type: "regular-unit-recruitment",
          nation: "rohan",
          quantity: 1
        }
      ],
      time: 122,
      die: "will-of-the-west",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 123,
      die: "army",
      actions: [
        {
          toRegion: "westemnet",
          fromRegion: "helms-deep",
          type: "army-movement"
        },
        {
          type: "army-movement",
          fromRegion: "morannon",
          toRegion: "dagorlad"
        }
      ],
      type: "die"
    },
    {
      type: "token-skip",
      playerId: "free-peoples",
      time: 124
    },
    {
      actions: [
        {
          cards: ["fpcha23", "fpstr11"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 125
    },
    {
      time: 125,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          cards: ["scha07", "sstr02"],
          type: "card-draw"
        }
      ]
    },
    {
      time: 126,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "card-discard",
          cards: ["fpstr11"]
        }
      ]
    },
    {
      time: 127,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          companion: "legolas",
          type: "fellowship-guide"
        }
      ]
    },
    {
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 128
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: ["muster-army", "will-of-the-west", "character", "character", "muster-army"]
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 129
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          dice: ["muster", "army", "muster", "army", "muster", "army", "army"],
          type: "action-roll"
        }
      ],
      time: 129
    },
    {
      type: "die",
      actions: [
        {
          region: "edoras",
          type: "regular-unit-recruitment",
          nation: "rohan",
          quantity: 1
        },
        {
          quantity: 1,
          nation: "rohan",
          type: "regular-unit-recruitment",
          region: "folde"
        }
      ],
      playerId: "free-peoples",
      time: 130,
      die: "muster-army"
    },
    {
      character: "saruman",
      playerId: "shadow",
      die: "muster",
      time: 131,
      actions: [
        {
          region: "orthanc",
          type: "regular-unit-upgrade",
          nation: "isengard",
          quantity: 2
        }
      ],
      type: "die"
    },
    {
      type: "die",
      actions: [
        {
          nation: "rohan",
          quantity: 1,
          region: "edoras",
          type: "leader-recruitment"
        },
        {
          nation: "rohan",
          quantity: 1,
          region: "folde",
          type: "regular-unit-recruitment"
        }
      ],
      playerId: "free-peoples",
      time: 132,
      die: "muster-army"
    },
    {
      type: "die",
      actions: [
        {
          quantity: 1,
          nation: "southrons",
          type: "political-advance"
        }
      ],
      die: "muster",
      time: 133,
      playerId: "shadow"
    },
    {
      time: 134,
      type: "die-pass",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          quantity: 1,
          nation: "southrons",
          type: "political-advance"
        }
      ],
      type: "die",
      playerId: "shadow",
      time: 135,
      die: "muster"
    },
    {
      time: 136,
      type: "die-pass",
      playerId: "free-peoples"
    },
    {
      type: "die",
      actions: [
        {
          type: "army-movement",
          fromRegion: "far-harad",
          toRegion: "near-harad"
        },
        {
          type: "army-movement",
          fromRegion: "south-dunland",
          toRegion: "gap-of-rohan"
        }
      ],
      die: "army",
      time: 137,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      card: "fpcha07",
      die: "character",
      time: 138,
      actions: [
        {
          card: "fpcha07",
          type: "card-play-on-table"
        }
      ],
      type: "die-card"
    },
    {
      time: 139,
      die: "army",
      playerId: "shadow",
      actions: [
        {
          leftUnits: {
            regulars: [
              {
                quantity: 1,
                nation: "southrons"
              }
            ],
            front: "shadow",
            elites: []
          },
          type: "army-movement",
          fromRegion: "near-harad",
          toRegion: "umbar"
        },
        {
          fromRegion: "gap-of-rohan",
          toRegion: "fords-of-isen",
          type: "army-movement"
        }
      ],
      type: "die"
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
      time: 140
    },
    {
      time: 141,
      actions: [
        {
          dice: [6],
          type: "hunt-roll"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          tiles: ["2r"],
          type: "hunt-tile-draw"
        }
      ],
      time: 142
    },
    {
      time: 143,
      type: "card-effect-skip",
      playerId: "free-peoples",
      card: "fpcha05"
    },
    {
      time: 144,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          card: "fpcha07",
          type: "card-discard-from-table"
        },
        {
          quantity: 1,
          type: "fellowship-corruption"
        }
      ]
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-reveal",
          region: "carrock"
        }
      ],
      time: 145
    },
    {
      actions: [
        {
          type: "army-attack",
          toRegion: "dol-amroth",
          fromRegion: "umbar"
        }
      ],
      type: "die-card",
      playerId: "shadow",
      card: "sstr10",
      die: "army",
      time: 146
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "army-retreat-into-siege",
          region: "dol-amroth"
        }
      ],
      time: 147
    },
    {
      actions: [
        {
          quantity: 1,
          nation: "rohan",
          type: "elite-unit-recruitment",
          region: "edoras"
        },
        {
          quantity: 1,
          nation: "rohan",
          type: "leader-recruitment",
          region: "edoras"
        }
      ],
      type: "die-card",
      playerId: "free-peoples",
      card: "fpstr09",
      die: "will-of-the-west",
      time: 148
    },
    {
      die: "army",
      time: 149,
      playerId: "shadow",
      actions: [
        {
          type: "army-movement",
          fromRegion: "north-anduin-vale",
          toRegion: "dimrill-dale"
        },
        {
          type: "army-movement",
          toRegion: "westemnet",
          fromRegion: "fords-of-isen"
        }
      ],
      type: "die"
    },
    {
      time: 150,
      playerId: "free-peoples",
      token: "political-advance",
      actions: [
        {
          type: "political-advance",
          quantity: 1,
          nation: "elves"
        }
      ],
      type: "token"
    },
    {
      time: 151,
      playerId: "free-peoples",
      type: "token-skip"
    },
    {
      time: 152,
      actions: [
        {
          cards: ["fpcha18", "fpstr17"],
          type: "card-draw"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      time: 152,
      actions: [
        {
          type: "card-draw",
          cards: ["scha14", "sstr11"]
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      time: 153,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          cards: ["scha10"],
          type: "card-discard"
        }
      ]
    },
    {
      actions: [],
      playerId: "free-peoples",
      type: "base",
      time: 154
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
      time: 155
    },
    {
      time: 156,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "action-roll",
          dice: ["event", "character", "muster-army", "character", "character"]
        }
      ]
    },
    {
      time: 156,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          dice: ["eye", "event", "event", "character", "eye", "army", "event"],
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
      playerId: "free-peoples",
      die: "character",
      time: 157
    },
    {
      card: "sstr11",
      playerId: "shadow",
      time: 158,
      die: "event",
      type: "die-card",
      actions: [
        {
          quantity: 2,
          nation: "isengard",
          type: "regular-unit-recruitment",
          region: "hollin"
        },
        {
          type: "army-movement",
          fromRegion: "north-dunland",
          toRegion: "hollin"
        }
      ]
    },
    {
      actions: [
        {
          type: "card-draw",
          cards: ["sstr05"]
        }
      ],
      type: "card-effect",
      time: 159,
      card: "scha21",
      playerId: "shadow"
    },
    {
      type: "die",
      actions: [
        {
          quantity: 1,
          nation: "rohan",
          type: "elite-unit-recruitment",
          region: "edoras"
        }
      ],
      die: "muster-army",
      time: 160,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "card-draw",
          cards: ["sstr17"]
        }
      ],
      type: "die",
      time: 161,
      die: "event",
      playerId: "shadow"
    },
    {
      time: 162,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "card-discard",
          cards: ["sstr05"]
        }
      ]
    },
    {
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      time: 163,
      die: "character",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          dice: [2, 2, 2],
          type: "hunt-roll"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 164
    },
    {
      type: "die-card",
      actions: [
        {
          quantity: 2,
          nation: "southrons",
          type: "regular-unit-recruitment",
          region: "umbar"
        },
        {
          quantity: 2,
          nation: "southrons",
          type: "regular-unit-recruitment",
          region: "near-harad"
        },
        {
          nation: "southrons",
          quantity: 2,
          region: "far-harad",
          type: "regular-unit-recruitment"
        }
      ],
      playerId: "shadow",
      card: "sstr17",
      die: "event",
      time: 165
    },
    {
      type: "card-effect",
      actions: [
        {
          cards: ["sstr15"],
          type: "card-draw"
        }
      ],
      time: 166,
      card: "scha21",
      playerId: "shadow"
    },
    {
      type: "die-card",
      actions: [
        {
          type: "combat-roll",
          dice: [3, 4, 1]
        }
      ],
      playerId: "free-peoples",
      card: "fpcha09",
      die: "event",
      time: 167
    },
    {
      card: "sstr15",
      playerId: "shadow",
      time: 168,
      die: "army",
      actions: [
        {
          quantity: 1,
          nation: "sauron",
          type: "regular-unit-upgrade",
          region: "weather-hills"
        },
        {
          type: "regular-unit-upgrade",
          region: "ettenmoors",
          quantity: 1,
          nation: "sauron"
        }
      ],
      type: "die-card"
    },
    {
      type: "die",
      actions: [
        {
          fromRegion: "enedwaith",
          characters: ["strider"],
          toRegion: "westemnet",
          type: "character-movement"
        },
        {
          toRegion: "edoras",
          characters: ["gandalf-the-white"],
          fromRegion: "fangorn",
          type: "character-movement"
        }
      ],
      die: "character",
      time: 169,
      playerId: "free-peoples"
    },
    {
      time: 170,
      die: "character",
      playerId: "shadow",
      type: "die",
      actions: [
        {
          toRegion: "old-forest-road",
          nNazgul: 1,
          fromRegion: "old-ford",
          type: "nazgul-movement"
        },
        {
          fromRegion: "goblins-gate",
          toRegion: "carrock",
          nNazgul: 1,
          type: "nazgul-movement"
        },
        {
          toRegion: "dol-amroth",
          nNazgul: 2,
          fromRegion: "south-ithilien",
          type: "nazgul-movement"
        }
      ]
    },
    {
      time: 171,
      playerId: "free-peoples",
      type: "token-skip"
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha11", "fpstr13"]
        }
      ],
      time: 172
    },
    {
      time: 172,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "card-draw",
          cards: ["scha16", "sstr01"]
        }
      ]
    },
    {
      time: 173,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "card-discard",
          cards: ["fpstr17"]
        }
      ]
    },
    {
      time: 173,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          cards: ["scha16"],
          type: "card-discard"
        }
      ]
    },
    {
      time: 174,
      type: "base",
      playerId: "free-peoples",
      actions: []
    },
    {
      time: 175,
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
      time: 176,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "action-roll",
          dice: ["muster", "will-of-the-west", "muster-army", "muster-army", "muster"]
        }
      ]
    },
    {
      time: 176,
      actions: [
        {
          dice: ["eye", "character", "army", "event", "army", "muster-army", "army"],
          type: "action-roll"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      die: "muster",
      time: 177,
      playerId: "free-peoples",
      type: "die",
      actions: [
        {
          region: "minas-tirith",
          type: "elite-unit-recruitment",
          nation: "gondor",
          quantity: 1
        }
      ]
    },
    {
      actions: [
        {
          characters: ["the-witch-king"],
          type: "character-play",
          region: "south-ithilien"
        }
      ],
      type: "die",
      playerId: "shadow",
      die: "muster-army",
      time: 178
    },
    {
      time: 179,
      type: "die-pass",
      playerId: "free-peoples"
    },
    {
      time: 180,
      die: "event",
      card: "scha24",
      playerId: "shadow",
      type: "die-card",
      actions: [
        {
          type: "character-movement",
          fromRegion: "south-ithilien",
          toRegion: "dol-amroth",
          characters: ["the-witch-king"]
        },
        {
          type: "nazgul-movement",
          nNazgul: 1,
          toRegion: "dol-amroth",
          fromRegion: "old-forest-road"
        },
        {
          fromRegion: "dol-amroth",
          toRegion: "dol-amroth",
          type: "army-attack"
        }
      ]
    },
    {
      time: 181,
      actions: [
        {
          card: "sstr01",
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
      time: 182
    },
    {
      actions: [
        {
          dice: [2, 1, 4],
          type: "combat-roll"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 183
    },
    {
      time: 183,
      actions: [
        {
          dice: [6, 2, 1, 1, 2],
          type: "combat-roll"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      actions: [
        {
          dice: [2, 2, 2, 2],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 184
    },
    {
      time: 185,
      actions: [
        {
          nation: "southrons",
          quantity: 1,
          region: "dol-amroth",
          type: "regular-unit-elimination"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      time: 186,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          region: "dol-amroth",
          type: "regular-unit-elimination",
          nation: "gondor",
          quantity: 1
        }
      ]
    },
    {
      time: 187,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          region: "dol-amroth",
          type: "elite-unit-downgrade",
          nation: "southrons",
          quantity: 1
        },
        {
          type: "battle-continue",
          region: "dol-amroth"
        }
      ]
    },
    {
      actions: [
        {
          cards: ["sstr07"],
          type: "card-draw"
        }
      ],
      type: "character-effect",
      character: "the-witch-king",
      playerId: "shadow",
      time: 188
    },
    {
      time: 189,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      time: 190,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      time: 191,
      actions: [
        {
          dice: [4, 1],
          type: "combat-roll"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [1, 6, 1, 2, 6]
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 191
    },
    {
      actions: [
        {
          region: "dol-amroth",
          type: "regular-unit-elimination",
          nation: "gondor",
          quantity: 2
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 192
    },
    {
      playerId: "shadow",
      card: "scha21",
      time: 193,
      actions: [
        {
          cards: ["scha18"],
          type: "card-draw"
        }
      ],
      type: "card-effect"
    },
    {
      actions: [
        {
          region: "rivendell",
          type: "elite-unit-recruitment",
          nation: "elves",
          quantity: 1
        }
      ],
      type: "die",
      die: "muster",
      time: 194,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 195,
      die: "army",
      actions: [
        {
          toRegion: "lamedon",
          fromRegion: "dol-amroth",
          type: "army-movement"
        },
        {
          toRegion: "north-ithilien",
          fromRegion: "dagorlad",
          type: "army-movement"
        }
      ],
      type: "die"
    },
    {
      playerId: "free-peoples",
      time: 196,
      die: "muster-army",
      actions: [
        {
          type: "regular-unit-recruitment",
          region: "pelargir",
          quantity: 1,
          nation: "gondor"
        },
        {
          nation: "gondor",
          quantity: 1,
          region: "minas-tirith",
          type: "leader-recruitment"
        }
      ],
      type: "die"
    },
    {
      actions: [
        {
          type: "army-attack",
          fromRegion: "lamedon",
          toRegion: "pelargir"
        }
      ],
      type: "die",
      playerId: "shadow",
      time: 197,
      die: "army"
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 198
    },
    {
      time: 199,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      time: 200,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          dice: [3, 5],
          type: "combat-roll"
        }
      ]
    },
    {
      time: 200,
      actions: [
        {
          type: "combat-roll",
          dice: [5, 6, 5, 2, 4]
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      time: 201,
      actions: [
        {
          type: "combat-re-roll",
          dice: [5, 5, 3, 2]
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      actions: [
        {
          region: "lamedon",
          type: "regular-unit-elimination",
          nation: "southrons",
          quantity: 1
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 202
    },
    {
      time: 203,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          region: "pelargir",
          type: "regular-unit-elimination",
          nation: "gondor",
          quantity: 1
        }
      ]
    },
    {
      time: 204,
      actions: [
        {
          region: "pelargir",
          type: "battle-continue"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          toRegion: "lossarnach",
          type: "army-retreat"
        }
      ],
      time: 205
    },
    {
      time: 206,
      actions: [
        {
          type: "army-advance"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "leader-recruitment",
          region: "minas-tirith",
          quantity: 1,
          nation: "gondor"
        },
        {
          type: "regular-unit-recruitment",
          region: "lossarnach",
          quantity: 1,
          nation: "gondor"
        }
      ],
      type: "die",
      die: "muster-army",
      time: 207,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "army-attack",
          fromRegion: "south-ithilien",
          toRegion: "osgiliath"
        }
      ],
      type: "die",
      time: 208,
      die: "army",
      playerId: "shadow"
    },
    {
      time: 209,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      actions: [
        {
          card: "fpstr13",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 210
    },
    {
      time: 211,
      actions: [
        {
          type: "combat-roll",
          dice: [1]
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      time: 212,
      actions: [
        {
          dice: [1, 3, 1],
          type: "combat-roll"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [3, 3, 3, 6, 2]
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 212
    },
    {
      time: 213,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-re-roll",
          dice: [2]
        }
      ]
    },
    {
      time: 214,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "regular-unit-elimination",
          region: "osgiliath",
          quantity: 1,
          nation: "gondor"
        }
      ]
    },
    {
      actions: [
        {
          region: "osgiliath",
          type: "battle-continue"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 215
    },
    {
      time: 216,
      actions: [
        {
          toRegion: "minas-tirith",
          type: "army-retreat"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      time: 217,
      type: "base",
      playerId: "shadow",
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
          type: "fellowship-progress"
        }
      ],
      die: "will-of-the-west",
      time: 218,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          dice: [5, 1],
          type: "hunt-roll"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 219
    },
    {
      time: 220,
      actions: [
        {
          dice: [1],
          type: "hunt-re-roll"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      type: "die",
      actions: [
        {
          type: "army-attack",
          fromRegion: "pelargir",
          toRegion: "lossarnach"
        }
      ],
      playerId: "shadow",
      die: "character",
      time: 221
    },
    {
      time: 222,
      type: "base",
      playerId: "shadow",
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
      playerId: "free-peoples",
      type: "base",
      time: 223
    },
    {
      time: 224,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [2, 5]
        }
      ]
    },
    {
      actions: [
        {
          dice: [4, 4, 4, 1, 6],
          type: "combat-roll"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 224
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [2, 4, 4, 2]
        }
      ],
      time: 225
    },
    {
      time: 226,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          quantity: 1,
          nation: "southrons",
          type: "regular-unit-elimination",
          region: "pelargir"
        }
      ]
    },
    {
      actions: [
        {
          nation: "gondor",
          quantity: 1,
          region: "lossarnach",
          type: "regular-unit-elimination"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 227
    },
    {
      actions: [
        {
          type: "battle-continue",
          region: "lossarnach"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 228
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          toRegion: "minas-tirith",
          type: "army-retreat"
        }
      ],
      time: 229
    },
    {
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 230
    },
    {
      playerId: "free-peoples",
      type: "token-skip",
      time: 231
    },
    {
      actions: [
        {
          cards: ["fpcha01", "fpstr22"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 232
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "card-draw",
          cards: ["scha01", "sstr21"]
        }
      ],
      time: 232
    },
    {
      time: 233,
      actions: [
        {
          type: "card-discard",
          cards: ["fpcha23"]
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
          type: "card-discard",
          cards: ["sstr21", "scha18"]
        }
      ],
      time: 233
    },
    {
      time: 234,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          region: "dale",
          type: "fellowship-declare"
        }
      ]
    },
    {
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 235
    },
    {
      time: 236,
      actions: [
        {
          dice: ["will-of-the-west", "character", "will-of-the-west", "character", "character"],
          type: "action-roll"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      time: 236,
      actions: [
        {
          dice: ["army", "event", "muster-army", "muster", "character", "eye", "muster", "event"],
          type: "action-roll"
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      type: "die",
      actions: [
        {
          nation: "gondor",
          quantity: 1,
          region: "minas-tirith",
          type: "elite-unit-recruitment"
        }
      ],
      die: "will-of-the-west",
      time: 237,
      playerId: "free-peoples"
    },
    {
      card: "scha01",
      playerId: "shadow",
      time: 238,
      die: "event",
      type: "die-card",
      actions: [
        {
          tile: "rds",
          type: "hunt-tile-add"
        }
      ]
    },
    {
      time: 239,
      playerId: "shadow",
      card: "scha21",
      type: "card-effect",
      actions: [
        {
          type: "card-draw",
          cards: ["scha04"]
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 240
    },
    {
      actions: [
        {
          tile: "r1rs",
          type: "hunt-tile-add"
        }
      ],
      type: "die-card",
      die: "event",
      time: 241,
      playerId: "shadow",
      card: "scha04"
    },
    {
      card: "scha21",
      playerId: "shadow",
      time: 242,
      type: "card-effect",
      actions: [
        {
          cards: ["scha19"],
          type: "card-draw"
        }
      ]
    },
    {
      type: "die-pass",
      playerId: "free-peoples",
      time: 243
    },
    {
      actions: [
        {
          type: "army-movement",
          toRegion: "troll-shaws",
          fromRegion: "hollin"
        },
        {
          toRegion: "ettenmoors",
          fromRegion: "angmar",
          type: "army-movement"
        }
      ],
      type: "die",
      playerId: "shadow",
      die: "army",
      time: 244
    },
    {
      type: "die",
      actions: [
        {
          type: "character-movement",
          characters: ["strider"],
          toRegion: "minas-tirith",
          fromRegion: "westemnet"
        },
        {
          type: "character-movement",
          fromRegion: "ered-luin",
          characters: ["gimli"],
          toRegion: "north-downs"
        }
      ],
      playerId: "free-peoples",
      die: "character",
      time: 245
    },
    {
      type: "die",
      actions: [
        {
          toRegion: "troll-shaws",
          fromRegion: "ettenmoors",
          type: "army-movement"
        },
        {
          toRegion: "troll-shaws",
          fromRegion: "weather-hills",
          type: "army-movement"
        }
      ],
      die: "muster-army",
      time: 246,
      playerId: "shadow"
    },
    {
      time: 247,
      die: "will-of-the-west",
      playerId: "free-peoples",
      actions: [
        {
          characters: ["aragorn"],
          type: "character-play",
          region: "minas-tirith"
        }
      ],
      type: "die"
    },
    {
      type: "die",
      actions: [
        {
          region: "moria",
          type: "nazgul-recruitment",
          quantity: 1
        },
        {
          quantity: 1,
          type: "nazgul-recruitment",
          region: "minas-morgul"
        }
      ],
      time: 248,
      die: "muster",
      playerId: "shadow"
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
      time: 249
    },
    {
      actions: [
        {
          dice: [1, 6],
          type: "hunt-roll"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 250
    },
    {
      time: 251,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          tiles: ["3"],
          type: "hunt-tile-draw"
        }
      ]
    },
    {
      time: 252,
      type: "card-effect-skip",
      playerId: "free-peoples",
      card: "fpcha05"
    },
    {
      time: 253,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          characters: ["legolas"],
          type: "character-elimination"
        },
        {
          type: "fellowship-guide",
          companion: "boromir"
        },
        {
          quantity: 1,
          type: "fellowship-corruption"
        }
      ]
    },
    {
      playerId: "shadow",
      time: 254,
      die: "muster",
      actions: [
        {
          type: "elite-unit-recruitment",
          region: "orthanc",
          quantity: 1,
          nation: "isengard"
        }
      ],
      type: "die"
    },
    {
      type: "die-card",
      actions: [
        {
          type: "companion-separation",
          toRegion: "western-emyn-muil",
          companions: ["boromir"]
        },
        {
          companion: "peregrin",
          type: "fellowship-guide"
        },
        {
          quantity: -1,
          type: "fellowship-corruption"
        }
      ],
      card: "fpcha11",
      playerId: "free-peoples",
      time: 255,
      die: "character"
    },
    {
      playerId: "shadow",
      time: 256,
      die: "character",
      actions: [
        {
          toRegion: "troll-shaws",
          nNazgul: 3,
          fromRegion: "lossarnach",
          type: "nazgul-movement"
        },
        {
          type: "character-movement",
          fromRegion: "lossarnach",
          toRegion: "troll-shaws",
          characters: ["the-witch-king"]
        },
        {
          type: "nazgul-movement",
          fromRegion: "carrock",
          toRegion: "dale",
          nNazgul: 1
        },
        {
          type: "nazgul-movement",
          nNazgul: 1,
          toRegion: "northern-rhovanion",
          fromRegion: "minas-morgul"
        },
        {
          type: "nazgul-movement",
          fromRegion: "moria",
          nNazgul: 1,
          toRegion: "southern-rhovanion"
        }
      ],
      type: "die"
    },
    {
      time: 257,
      playerId: "free-peoples",
      type: "token-skip"
    },
    {
      time: 258,
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha08", "fpstr01"]
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      time: 258,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          cards: ["scha23", "sstr19"],
          type: "card-draw"
        }
      ]
    },
    {
      time: 259,
      actions: [
        {
          type: "card-discard",
          cards: ["fpstr22"]
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          cards: ["sstr19", "scha14"],
          type: "card-discard"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 259
    },
    {
      actions: [],
      type: "base",
      playerId: "free-peoples",
      time: 260
    },
    {
      time: 261,
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
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
          dice: ["character", "muster-army", "character", "character", "character", "character"],
          type: "action-roll"
        }
      ],
      time: 262
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: ["muster", "event", "event", "eye", "muster", "character", "character", "army"]
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 262
    },
    {
      playerId: "free-peoples",
      time: 263,
      die: "muster-army",
      actions: [
        {
          nation: "elves",
          quantity: 1,
          region: "rivendell",
          type: "elite-unit-recruitment"
        }
      ],
      type: "die"
    },
    {
      playerId: "shadow",
      die: "character",
      time: 264,
      type: "die",
      actions: [
        {
          type: "army-attack",
          fromRegion: "troll-shaws",
          toRegion: "rivendell"
        }
      ]
    },
    {
      actions: [
        {
          type: "army-retreat-into-siege",
          region: "rivendell"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 265
    },
    {
      time: 266,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "army-advance"
        }
      ]
    },
    {
      type: "die-pass",
      playerId: "free-peoples",
      time: 267
    },
    {
      card: "sstr02",
      playerId: "shadow",
      time: 268,
      die: "event",
      type: "die-card",
      actions: [
        {
          toRegion: "rivendell",
          fromRegion: "rivendell",
          type: "army-attack"
        }
      ]
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          card: "scha19",
          type: "combat-card-choose"
        }
      ],
      time: 269
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [2, 2, 3, 4]
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 270
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: [4, 5, 5, 5, 6],
          type: "combat-roll"
        }
      ],
      time: 270
    },
    {
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [1]
        }
      ],
      time: 271
    },
    {
      time: 271,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: [2],
          type: "combat-re-roll"
        }
      ]
    },
    {
      time: 272,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          region: "rivendell",
          type: "elite-unit-downgrade",
          nation: "elves",
          quantity: 2
        },
        {
          nation: "elves",
          quantity: 1,
          region: "rivendell",
          type: "elite-unit-elimination"
        }
      ]
    },
    {
      playerId: "shadow",
      character: "the-witch-king",
      time: 273,
      type: "character-effect",
      actions: [
        {
          type: "card-draw",
          cards: ["scha12"]
        }
      ]
    },
    {
      time: 274,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      time: 275,
      actions: [
        {
          card: "fpstr01",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      time: 276,
      actions: [
        {
          type: "combat-roll",
          dice: [3, 6, 2]
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [4, 3, 5]
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 276
    },
    {
      time: 277,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: [2],
          type: "combat-re-roll"
        }
      ]
    },
    {
      actions: [
        {
          dice: [5, 1, 6],
          type: "combat-re-roll"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 277
    },
    {
      time: 278,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "regular-unit-elimination",
          region: "rivendell",
          quantity: 1,
          nation: "sauron"
        }
      ]
    },
    {
      actions: [
        {
          nation: "elves",
          quantity: 1,
          region: "rivendell",
          type: "regular-unit-elimination"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 279
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 280
    },
    {
      time: 281,
      type: "base",
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
      actions: [
        {
          dice: [1, 3],
          type: "combat-roll"
        }
      ],
      time: 282
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: [6, 5, 4, 3, 2],
          type: "combat-roll"
        }
      ],
      time: 282
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
      time: 283
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [4, 4, 2, 5]
        }
      ],
      time: 283
    },
    {
      actions: [
        {
          nation: "elves",
          quantity: 1,
          region: "rivendell",
          type: "elite-unit-downgrade"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 284
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          quantity: 1,
          nation: "sauron",
          type: "elite-unit-downgrade",
          region: "rivendell"
        },
        {
          type: "battle-continue",
          region: "rivendell"
        }
      ],
      time: 285
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 286
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 287
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [3, 5]
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 288
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: [5, 1, 3, 5, 1],
          type: "combat-roll"
        }
      ],
      time: 288
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: [6],
          type: "combat-re-roll"
        }
      ],
      time: 289
    },
    {
      time: 289,
      actions: [
        {
          type: "combat-re-roll",
          dice: [2, 2, 4, 3, 6]
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      time: 290,
      actions: [
        {
          type: "regular-unit-elimination",
          region: "rivendell",
          quantity: 1,
          nation: "isengard"
        },
        {
          nation: "sauron",
          quantity: 1,
          region: "rivendell",
          type: "regular-unit-elimination"
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      actions: [
        {
          quantity: 1,
          nation: "elves",
          type: "regular-unit-elimination",
          region: "rivendell"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 291
    },
    {
      actions: [
        {
          type: "elite-unit-downgrade",
          region: "rivendell",
          quantity: 1,
          nation: "sauron"
        },
        {
          region: "rivendell",
          type: "battle-continue"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 292
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 293
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 294
    },
    {
      time: 295,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [3]
        }
      ]
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [6, 5, 5, 2, 4]
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 295
    },
    {
      time: 296,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-re-roll",
          dice: [1]
        }
      ]
    },
    {
      time: 297,
      actions: [
        {
          nation: "elves",
          quantity: 1,
          region: "rivendell",
          type: "regular-unit-elimination"
        },
        {
          region: "rivendell",
          type: "leader-elimination",
          nation: "elves",
          quantity: 1
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      time: 298,
      card: "scha21",
      playerId: "shadow",
      type: "card-effect",
      actions: [
        {
          cards: ["sstr08"],
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
      die: "character",
      time: 299,
      playerId: "free-peoples"
    },
    {
      time: 300,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "hunt-roll",
          dice: [4, 5]
        }
      ]
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: [2],
          type: "hunt-re-roll"
        }
      ],
      time: 301
    },
    {
      card: "scha23",
      playerId: "shadow",
      time: 302,
      die: "event",
      actions: [
        {
          type: "nazgul-movement",
          nNazgul: 3,
          toRegion: "westemnet",
          fromRegion: "rivendell"
        },
        {
          characters: ["the-witch-king"],
          toRegion: "westemnet",
          fromRegion: "rivendell",
          type: "character-movement"
        },
        {
          type: "army-attack",
          fromRegion: "westemnet",
          toRegion: "folde"
        }
      ],
      type: "die-card"
    },
    {
      time: 303,
      actions: [
        {
          card: "scha07",
          type: "combat-card-choose"
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 304
    },
    {
      time: 305,
      actions: [
        {
          dice: [3, 3, 4],
          type: "combat-roll"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [4, 6, 4, 3, 2]
        }
      ],
      time: 305
    },
    {
      type: "card-effect",
      actions: [
        {
          leaders: {
            nNazgul: 1
          },
          type: "leader-forfeit"
        }
      ],
      playerId: "shadow",
      card: "scha07",
      time: 306
    },
    {
      time: 307,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: [5, 3, 2, 6],
          type: "combat-re-roll"
        }
      ]
    },
    {
      actions: [
        {
          region: "folde",
          type: "regular-unit-elimination",
          nation: "rohan",
          quantity: 3
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 308
    },
    {
      actions: [
        {
          leftUnits: {
            nNazgul: 3,
            characters: ["the-witch-king"],
            elites: [
              {
                nation: "isengard",
                quantity: 2
              }
            ],
            regulars: [
              {
                quantity: 4,
                nation: "isengard"
              }
            ],
            front: "shadow"
          },
          type: "army-advance"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 309
    },
    {
      time: 310,
      playerId: "shadow",
      character: "the-witch-king",
      type: "character-effect",
      actions: [
        {
          cards: ["scha02"],
          type: "card-draw"
        }
      ]
    },
    {
      type: "card-effect",
      actions: [
        {
          type: "card-draw",
          cards: ["scha03"]
        }
      ],
      card: "scha21",
      playerId: "shadow",
      time: 311
    },
    {
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      playerId: "free-peoples",
      time: 312,
      die: "character"
    },
    {
      time: 313,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "hunt-roll",
          dice: [3, 2]
        }
      ]
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "hunt-re-roll",
          dice: [4]
        }
      ],
      time: 314
    },
    {
      actions: [
        {
          tile: "rers",
          type: "hunt-tile-add"
        }
      ],
      type: "die-card",
      card: "scha02",
      playerId: "shadow",
      time: 315,
      die: "character"
    },
    {
      playerId: "free-peoples",
      die: "character",
      time: 316,
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ]
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "hunt-roll",
          dice: [2, 4]
        }
      ],
      time: 317
    },
    {
      time: 318,
      actions: [
        {
          dice: [1],
          type: "hunt-re-roll"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["2"]
        }
      ],
      time: 319
    },
    {
      type: "card-effect-skip",
      card: "fpcha05",
      playerId: "free-peoples",
      time: 320
    },
    {
      time: 321,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          companions: ["peregrin"],
          toRegion: "druadan-forest",
          type: "companion-separation"
        },
        {
          quantity: 1,
          type: "fellowship-corruption"
        }
      ]
    },
    {
      die: "muster",
      time: 322,
      playerId: "shadow",
      actions: [
        {
          quantity: 1,
          nation: "isengard",
          type: "elite-unit-recruitment",
          region: "orthanc"
        }
      ],
      type: "die"
    },
    {
      type: "die-card",
      actions: [
        {
          tile: "b0",
          type: "hunt-tile-add"
        }
      ],
      time: 323,
      die: "character",
      card: "fpcha01",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "elite-unit-recruitment",
          region: "minas-morgul",
          quantity: 1,
          nation: "sauron"
        }
      ],
      type: "die",
      die: "muster",
      time: 324,
      playerId: "shadow"
    },
    {
      type: "die-card",
      actions: [
        {
          quantity: -2,
          type: "fellowship-corruption"
        }
      ],
      time: 325,
      die: "character",
      card: "fpcha12",
      playerId: "free-peoples"
    },
    {
      type: "die-card",
      actions: [
        {
          fromRegion: "north-ithilien",
          toRegion: "folde",
          leftUnits: {
            nNazgul: 0,
            regulars: [
              {
                quantity: 1,
                nation: "sauron"
              }
            ],
            front: "shadow"
          },
          type: "army-movement"
        }
      ],
      playerId: "shadow",
      card: "sstr07",
      die: "army",
      time: 326
    },
    {
      time: 327,
      type: "token-skip",
      playerId: "free-peoples"
    },
    {
      time: 328,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha15", "fpstr21"]
        }
      ]
    },
    {
      time: 328,
      actions: [
        {
          type: "card-draw",
          cards: ["scha20", "sstr09"]
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      time: 329,
      actions: [
        {
          region: "dagorlad",
          type: "fellowship-declare"
        }
      ],
      type: "base",
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
      playerId: "shadow",
      time: 330
    },
    {
      time: 331,
      actions: [
        {
          dice: ["character", "event", "will-of-the-west", "muster", "muster-army", "character"],
          type: "action-roll"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: ["eye", "muster", "army", "character", "character", "character", "event", "muster"]
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 331
    },
    {
      type: "die",
      actions: [
        {
          nation: "gondor",
          quantity: 1,
          region: "minas-tirith",
          type: "elite-unit-recruitment"
        }
      ],
      playerId: "free-peoples",
      time: 332,
      die: "muster"
    },
    {
      die: "character",
      time: 333,
      playerId: "shadow",
      type: "die",
      actions: [
        {
          fromRegion: "southern-rhovanion",
          nNazgul: 1,
          toRegion: "osgiliath",
          type: "nazgul-movement"
        },
        {
          type: "nazgul-movement",
          toRegion: "osgiliath",
          nNazgul: 1,
          fromRegion: "northern-rhovanion"
        },
        {
          fromRegion: "dale",
          nNazgul: 1,
          toRegion: "osgiliath",
          type: "nazgul-movement"
        },
        {
          type: "nazgul-movement",
          toRegion: "osgiliath",
          nNazgul: 3,
          fromRegion: "westemnet"
        },
        {
          toRegion: "osgiliath",
          characters: ["the-witch-king"],
          fromRegion: "westemnet",
          type: "character-movement"
        },
        {
          type: "nazgul-movement",
          fromRegion: "osgiliath",
          nNazgul: 1,
          toRegion: "dagorlad"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 334,
      die: "muster-army",
      actions: [
        {
          region: "erebor",
          type: "elite-unit-recruitment",
          nation: "dwarves",
          quantity: 1
        }
      ],
      type: "die"
    },
    {
      die: "army",
      time: 335,
      playerId: "shadow",
      card: "sstr08",
      type: "die-card",
      actions: [
        {
          fromRegion: "minas-morgul",
          toRegion: "osgiliath",
          type: "army-movement"
        },
        {
          fromRegion: "orthanc",
          toRegion: "westemnet",
          leftUnits: {
            front: "shadow",
            characters: ["saruman"],
            regulars: [
              {
                quantity: 1,
                nation: "isengard"
              }
            ],
            elites: [
              {
                quantity: 1,
                nation: "isengard"
              }
            ]
          },
          type: "army-movement"
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 336
    },
    {
      actions: [
        {
          type: "army-attack",
          fromRegion: "westemnet",
          toRegion: "edoras"
        }
      ],
      type: "die",
      die: "character",
      time: 337,
      playerId: "shadow"
    },
    {
      time: 338,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          card: "sstr09",
          type: "combat-card-choose"
        }
      ]
    },
    {
      actions: [
        {
          card: "fpcha08",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 339
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [4, 5, 4, 1, 1]
        }
      ],
      time: 340
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: [1, 1, 3, 2, 3],
          type: "combat-roll"
        }
      ],
      time: 340
    },
    {
      time: 341,
      actions: [
        {
          type: "combat-re-roll",
          dice: [1, 6, 5]
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: [2, 5, 5, 6, 6],
          type: "combat-re-roll"
        }
      ],
      time: 341
    },
    {
      time: 342,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          region: "westemnet",
          type: "regular-unit-elimination",
          nation: "isengard",
          quantity: 3
        }
      ]
    },
    {
      time: 343,
      actions: [
        {
          region: "edoras",
          type: "regular-unit-elimination",
          nation: "rohan",
          quantity: 2
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      time: 344,
      actions: [
        {
          region: "edoras",
          type: "battle-continue"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      time: 345,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      time: 346,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      time: 347,
      actions: [
        {
          type: "combat-roll",
          dice: [2, 4, 4, 4, 1]
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: [6, 6, 4, 5, 2],
          type: "combat-roll"
        }
      ],
      time: 347
    },
    {
      time: 348,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-re-roll",
          dice: [6, 2, 6]
        }
      ]
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          dice: [1, 2],
          type: "combat-re-roll"
        }
      ],
      time: 348
    },
    {
      time: 349,
      actions: [
        {
          region: "westemnet",
          type: "elite-unit-elimination",
          nation: "isengard",
          quantity: 1
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          nation: "rohan",
          quantity: 3,
          region: "edoras",
          type: "elite-unit-downgrade"
        }
      ],
      time: 350
    },
    {
      time: 351,
      actions: [
        {
          type: "battle-continue",
          region: "edoras"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 352
    },
    {
      time: 353,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      time: 354,
      actions: [
        {
          type: "combat-roll",
          dice: [1, 4, 1, 3, 1]
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [4, 6, 5, 5, 2]
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 354
    },
    {
      actions: [
        {
          dice: [5, 1, 6],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 355
    },
    {
      actions: [
        {
          dice: [6, 6],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 355
    },
    {
      time: 356,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          nation: "isengard",
          quantity: 1,
          region: "westemnet",
          type: "elite-unit-elimination"
        }
      ]
    },
    {
      time: 357,
      actions: [
        {
          quantity: 3,
          nation: "rohan",
          type: "regular-unit-elimination",
          region: "edoras"
        },
        {
          region: "edoras",
          type: "elite-unit-elimination",
          nation: "rohan",
          quantity: 1
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      actions: [
        {
          type: "battle-continue",
          region: "edoras"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 358
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 359
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 360
    },
    {
      time: 361,
      actions: [
        {
          type: "combat-roll",
          dice: [1]
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [4, 6, 1, 5]
        }
      ],
      time: 361
    },
    {
      time: 362,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-re-roll",
          dice: [6]
        }
      ]
    },
    {
      time: 363,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          nation: "isengard",
          quantity: 1,
          region: "westemnet",
          type: "elite-unit-downgrade"
        }
      ]
    },
    {
      actions: [
        {
          quantity: 1,
          nation: "rohan",
          type: "regular-unit-elimination",
          region: "edoras"
        },
        {
          region: "edoras",
          type: "leader-elimination",
          nation: "rohan",
          quantity: 2
        },
        {
          characters: ["gandalf-the-white"],
          type: "character-elimination"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 364
    },
    {
      time: 365,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          leftUnits: {
            characters: [],
            nNazgul: 0,
            regulars: [
              {
                quantity: 1,
                nation: "isengard"
              }
            ],
            front: "shadow",
            elites: [
              {
                quantity: 2,
                nation: "isengard"
              }
            ]
          },
          type: "army-advance"
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
      playerId: "free-peoples",
      time: 366,
      die: "character"
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "hunt-roll",
          dice: [6, 1]
        }
      ],
      time: 367
    },
    {
      actions: [
        {
          type: "hunt-re-roll",
          dice: [2]
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 368
    },
    {
      actions: [
        {
          tiles: ["er"],
          type: "hunt-tile-draw"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 369
    },
    {
      type: "card-effect-skip",
      playerId: "free-peoples",
      card: "fpcha05",
      time: 370
    },
    {
      actions: [
        {
          quantity: 1,
          type: "fellowship-corruption"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 371
    },
    {
      actions: [
        {
          region: "dagorlad",
          type: "fellowship-reveal"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 372
    },
    {
      actions: [
        {
          quantity: 2,
          type: "fellowship-corruption"
        }
      ],
      type: "die-card",
      die: "event",
      time: 373,
      playerId: "shadow",
      card: "scha12"
    },
    {
      actions: [
        {
          cards: ["scha17"],
          type: "card-draw"
        }
      ],
      type: "card-effect",
      card: "scha21",
      playerId: "shadow",
      time: 374
    },
    {
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      type: "die",
      playerId: "free-peoples",
      time: 375,
      die: "will-of-the-west"
    },
    {
      type: "die",
      actions: [
        {
          type: "regular-unit-recruitment",
          region: "minas-morgul",
          quantity: 1,
          nation: "sauron"
        },
        {
          nation: "isengard",
          quantity: 1,
          region: "orthanc",
          type: "regular-unit-recruitment"
        }
      ],
      die: "muster",
      time: 376,
      playerId: "shadow"
    },
    {
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      playerId: "free-peoples",
      die: "character",
      time: 377
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "hunt-roll",
          dice: [6, 5]
        }
      ],
      time: 378
    },
    {
      time: 379,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          tiles: ["1r"],
          type: "hunt-tile-draw"
        }
      ]
    },
    {
      time: 380,
      type: "card-effect-skip",
      playerId: "free-peoples",
      card: "fpcha05"
    },
    {
      actions: [
        {
          quantity: 1,
          type: "fellowship-corruption"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 381
    },
    {
      playerId: "shadow",
      card: "scha03",
      die: "character",
      time: 382,
      actions: [
        {
          tile: "r3s",
          type: "hunt-tile-add"
        }
      ],
      type: "die-card"
    },
    {
      actions: [
        {
          region: "osgiliath",
          type: "region-choose"
        },
        {
          type: "combat-roll",
          dice: [4, 6, 3, 1, 6]
        }
      ],
      type: "die-card",
      time: 383,
      die: "event",
      card: "fpcha18",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          quantity: 1,
          type: "nazgul-elimination",
          region: "osgiliath"
        },
        {
          type: "nazgul-elimination",
          region: "osgiliath",
          quantity: 1
        },
        {
          fromRegion: "osgiliath",
          toRegion: "mount-gundabad",
          nNazgul: 4,
          type: "nazgul-movement"
        }
      ],
      type: "card-effect",
      card: "fpcha18",
      playerId: "shadow",
      time: 384
    },
    {
      playerId: "shadow",
      die: "muster",
      time: 385,
      actions: [
        {
          nation: "sauron",
          quantity: 1,
          region: "minas-morgul",
          type: "regular-unit-recruitment"
        },
        {
          type: "regular-unit-recruitment",
          region: "morannon",
          quantity: 1,
          nation: "sauron"
        }
      ],
      type: "die"
    },
    {
      playerId: "free-peoples",
      type: "token-skip",
      time: 386
    },
    {
      time: 387,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha10", "fpstr18"]
        }
      ]
    },
    {
      time: 387,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          cards: ["scha11", "sstr16"],
          type: "card-draw"
        }
      ]
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-declare",
          region: "morannon"
        }
      ],
      time: 388
    },
    {
      time: 389,
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      time: 390,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          type: "action-roll",
          dice: ["muster-army", "character", "event", "muster", "will-of-the-west"]
        }
      ]
    },
    {
      time: 390,
      actions: [
        {
          type: "action-roll",
          dice: [
            "eye",
            "eye",
            "character",
            "character",
            "muster-army",
            "army",
            "muster-army",
            "army"
          ]
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      time: 391,
      playerId: "free-peoples",
      type: "die-pass"
    },
    {
      type: "die",
      actions: [
        {
          toRegion: "minas-tirith",
          retroguard: {
            characters: [],
            nNazgul: -1,
            elites: [],
            front: "shadow",
            regulars: []
          },
          fromRegion: "osgiliath",
          type: "army-attack"
        }
      ],
      playerId: "shadow",
      die: "character",
      time: 392
    },
    {
      time: 393,
      actions: [
        {
          region: "minas-tirith",
          type: "army-not-retreat-into-siege"
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 394
    },
    {
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          card: "fpstr18",
          type: "combat-card-choose"
        }
      ],
      time: 395
    },
    {
      time: 396,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: [5, 1, 2, 3, 2],
          type: "combat-roll"
        }
      ]
    },
    {
      time: 396,
      actions: [
        {
          type: "combat-roll",
          dice: [1, 2, 5, 1, 1]
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-re-roll",
          dice: [6, 3, 2, 4]
        }
      ],
      time: 397
    },
    {
      time: 397,
      actions: [
        {
          type: "combat-re-roll",
          dice: [2, 2]
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "regular-unit-elimination",
          region: "osgiliath",
          quantity: 2,
          nation: "sauron"
        }
      ],
      time: 398
    },
    {
      time: 399,
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          nation: "gondor",
          quantity: 1,
          region: "minas-tirith",
          type: "regular-unit-elimination"
        }
      ]
    },
    {
      time: 400,
      actions: [
        {
          type: "battle-cease",
          region: "minas-tirith"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      die: "event",
      time: 401,
      playerId: "free-peoples",
      card: "fpcha10",
      type: "die-card",
      actions: [
        {
          quantity: 1,
          type: "fellowship-heal"
        },
        {
          type: "fellowship-progress"
        }
      ]
    },
    {
      time: 402,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          tiles: ["0r"],
          type: "hunt-tile-draw"
        }
      ]
    },
    {
      time: 403,
      type: "card-effect-skip",
      card: "fpcha05",
      playerId: "free-peoples"
    },
    {
      die: "army",
      time: 404,
      playerId: "shadow",
      type: "die",
      actions: [
        {
          type: "army-movement",
          fromRegion: "folde",
          toRegion: "druadan-forest"
        },
        {
          type: "army-movement",
          toRegion: "parth-celebrant",
          fromRegion: "dimrill-dale"
        }
      ]
    },
    {
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha17"]
        }
      ],
      type: "token",
      token: "draw-card",
      playerId: "free-peoples",
      time: 405
    },
    {
      actions: [
        {
          region: "minas-morgul",
          type: "character-play",
          characters: ["the-mouth-of-sauron"]
        }
      ],
      type: "die",
      time: 406,
      die: "muster-army",
      playerId: "shadow"
    },
    {
      type: "die",
      actions: [
        {
          quantity: 1,
          nation: "gondor",
          type: "regular-unit-recruitment",
          region: "minas-tirith"
        },
        {
          quantity: 1,
          nation: "dwarves",
          type: "leader-recruitment",
          region: "erebor"
        }
      ],
      time: 407,
      die: "muster",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 408,
      die: "character",
      type: "die",
      actions: [
        {
          type: "character-movement",
          characters: ["the-mouth-of-sauron"],
          toRegion: "druadan-forest",
          fromRegion: "minas-morgul"
        },
        {
          type: "nazgul-movement",
          fromRegion: "mount-gundabad",
          toRegion: "osgiliath",
          nNazgul: 4
        },
        {
          type: "nazgul-movement",
          fromRegion: "dagorlad",
          toRegion: "druadan-forest",
          nNazgul: 1
        }
      ]
    },
    {
      actions: [
        {
          cards: ["fpcha14"],
          type: "card-draw"
        }
      ],
      type: "die",
      time: 409,
      die: "will-of-the-west",
      playerId: "free-peoples"
    },
    {
      die: "army",
      time: 410,
      playerId: "shadow",
      type: "die",
      actions: [
        {
          fromRegion: "osgiliath",
          toRegion: "minas-tirith",
          type: "army-attack"
        }
      ]
    },
    {
      time: 411,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "army-not-retreat-into-siege",
          region: "minas-tirith"
        }
      ]
    },
    {
      time: 412,
      actions: [
        {
          card: "scha11",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      time: 413,
      actions: [
        {
          card: "fpstr12",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [5, 2, 2, 5, 6]
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 414
    },
    {
      time: 414,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [2, 2, 5, 2, 2]
        }
      ]
    },
    {
      time: 415,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: [5, 6],
          type: "combat-re-roll"
        }
      ]
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: [1, 1, 6, 2],
          type: "combat-re-roll"
        }
      ],
      time: 415
    },
    {
      type: "combat-card-effect",
      actions: [
        {
          quantity: 1,
          nation: "gondor",
          type: "leader-elimination",
          region: "minas-tirith"
        }
      ],
      time: 416,
      card: "scha11",
      playerId: "shadow"
    },
    {
      time: 417,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "elite-unit-downgrade",
          region: "osgiliath",
          quantity: 2,
          nation: "sauron"
        },
        {
          region: "osgiliath",
          type: "regular-unit-elimination",
          nation: "sauron",
          quantity: 3
        }
      ]
    },
    {
      actions: [
        {
          quantity: 2,
          nation: "gondor",
          type: "regular-unit-elimination",
          region: "minas-tirith"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 418
    },
    {
      time: 419,
      actions: [
        {
          type: "battle-cease",
          region: "minas-tirith"
        }
      ],
      playerId: "shadow",
      type: "base"
    },
    {
      actions: [
        {
          type: "card-draw",
          cards: ["scha22"]
        }
      ],
      type: "character-effect",
      character: "the-witch-king",
      playerId: "shadow",
      time: 420
    },
    {
      type: "die-card",
      actions: [
        {
          tiles: ["1", "r3s", "er"],
          type: "hunt-tile-draw"
        }
      ],
      playerId: "free-peoples",
      card: "fpcha14",
      die: "character",
      time: 421
    },
    {
      type: "die",
      actions: [
        {
          type: "army-attack",
          toRegion: "minas-tirith",
          fromRegion: "druadan-forest"
        }
      ],
      time: 422,
      die: "muster-army",
      playerId: "shadow"
    },
    {
      time: 423,
      actions: [
        {
          type: "army-not-retreat-into-siege",
          region: "minas-tirith"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      time: 424,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      time: 425,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      time: 426,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [3, 4, 6, 2, 5]
        }
      ]
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [3, 4, 6, 4, 1]
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 426
    },
    {
      time: 427,
      actions: [
        {
          type: "combat-re-roll",
          dice: [2, 2, 1]
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          dice: [1, 5, 2],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 427
    },
    {
      time: 428,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          region: "druadan-forest",
          type: "regular-unit-elimination",
          nation: "sauron",
          quantity: 2
        }
      ]
    },
    {
      actions: [
        {
          nation: "gondor",
          quantity: 2,
          region: "minas-tirith",
          type: "regular-unit-elimination"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 429
    },
    {
      actions: [
        {
          region: "minas-tirith",
          type: "battle-continue"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 430
    },
    {
      time: 431,
      actions: [
        {
          type: "army-retreat-into-siege",
          region: "minas-tirith"
        },
        {
          quantity: 1,
          nation: "gondor",
          type: "regular-unit-disband",
          region: "minas-tirith"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      time: 432,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "army-advance"
        }
      ]
    },
    {
      time: 433,
      die: "character",
      elvenRing: {
        ring: "vilya",
        toDie: "character",
        fromDie: "muster-army"
      },
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die"
    },
    {
      time: 434,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          tiles: ["er"],
          type: "hunt-tile-draw"
        }
      ]
    },
    {
      time: 435,
      type: "card-effect-skip",
      card: "fpcha05",
      playerId: "free-peoples"
    },
    {
      time: 436,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          quantity: 4,
          type: "fellowship-corruption"
        }
      ]
    },
    {
      actions: [
        {
          cards: ["fpcha20", "fpstr02"],
          type: "card-draw"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 437
    },
    {
      actions: [
        {
          cards: ["sstr23"],
          type: "card-draw"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 437
    },
    {
      time: 438,
      type: "base",
      playerId: "free-peoples",
      actions: []
    },
    {
      time: 439,
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
      playerId: "free-peoples",
      actions: [
        {
          dice: ["character", "muster-army", "character", "will-of-the-west", "character"],
          type: "action-roll"
        }
      ],
      time: 440
    },
    {
      time: 440,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "action-roll",
          dice: [
            "muster",
            "muster-army",
            "army",
            "event",
            "eye",
            "character",
            "event",
            "army",
            "muster-army"
          ]
        }
      ]
    },
    {
      die: "character",
      time: 441,
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      type: "die"
    },
    {
      playerId: "shadow",
      die: "army",
      time: 442,
      type: "die",
      actions: [
        {
          leftUnits: {
            regulars: [
              {
                quantity: 4,
                nation: "sauron"
              }
            ],
            front: "shadow",
            elites: [],
            characters: [],
            nNazgul: 2
          },
          type: "army-movement",
          toRegion: "minas-tirith",
          fromRegion: "osgiliath"
        },
        {
          type: "army-movement",
          leftUnits: {
            characters: [],
            nNazgul: 0,
            front: "shadow",
            regulars: [
              {
                quantity: 6,
                nation: "southrons"
              }
            ],
            elites: []
          },
          toRegion: "minas-tirith",
          fromRegion: "lossarnach"
        }
      ]
    },
    {
      time: 443,
      type: "die-pass",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          toRegion: "minas-tirith",
          fromRegion: "minas-tirith",
          type: "army-attack"
        }
      ],
      type: "die",
      die: "army",
      time: 444,
      playerId: "shadow"
    },
    {
      time: 445,
      actions: [
        {
          card: "sstr16",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      actions: [
        {
          card: "fpstr02",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 446
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [4, 4, 5, 5, 1]
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 447
    },
    {
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [2, 1, 3, 5, 2]
        }
      ],
      time: 447
    },
    {
      actions: [
        {
          type: "combat-re-roll",
          dice: [1, 4, 3]
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 448
    },
    {
      actions: [
        {
          dice: [6, 6, 6, 3, 6],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 448
    },
    {
      time: 449,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          region: "minas-tirith",
          type: "regular-unit-elimination",
          nation: "sauron",
          quantity: 3
        }
      ]
    },
    {
      actions: [
        {
          quantity: 4,
          nation: "gondor",
          type: "elite-unit-downgrade",
          region: "minas-tirith"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 450
    },
    {
      time: 451,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          type: "battle-cease",
          region: "minas-tirith"
        }
      ]
    },
    {
      time: 452,
      character: "the-witch-king",
      playerId: "shadow",
      actions: [
        {
          cards: ["sstr06"],
          type: "card-draw"
        }
      ],
      type: "character-effect"
    },
    {
      type: "die-card",
      actions: [
        {
          type: "character-movement",
          fromRegion: "western-emyn-muil",
          toRegion: "minas-tirith",
          characters: ["boromir"]
        }
      ],
      card: "fpcha15",
      playerId: "free-peoples",
      time: 453,
      die: "character"
    },
    {
      time: 454,
      die: "character",
      playerId: "shadow",
      actions: [
        {
          toRegion: "minas-tirith",
          fromRegion: "minas-tirith",
          type: "army-attack"
        }
      ],
      type: "die"
    },
    {
      time: 455,
      actions: [
        {
          card: "sstr23",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      time: 456,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          card: "fpcha17",
          type: "combat-card-choose"
        }
      ]
    },
    {
      time: 457,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [4, 6, 3, 1, 2]
        }
      ]
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [3, 6, 1]
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 457
    },
    {
      time: 458,
      actions: [
        {
          dice: [3, 2, 6],
          type: "combat-re-roll"
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [6, 1]
        }
      ],
      time: 458
    },
    {
      time: 459,
      playerId: "shadow",
      type: "base",
      actions: [
        {
          region: "minas-tirith",
          type: "regular-unit-elimination",
          nation: "sauron",
          quantity: 3
        }
      ]
    },
    {
      time: 460,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "elite-unit-elimination",
          region: "minas-tirith",
          quantity: 1,
          nation: "gondor"
        }
      ]
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "battle-cease",
          region: "minas-tirith"
        }
      ],
      time: 461
    },
    {
      character: "the-witch-king",
      playerId: "shadow",
      time: 462,
      actions: [
        {
          type: "card-draw",
          cards: ["sstr04"]
        }
      ],
      type: "character-effect"
    },
    {
      type: "die-pass",
      playerId: "free-peoples",
      time: 463
    },
    {
      playerId: "shadow",
      die: "muster-army",
      time: 464,
      actions: [
        {
          type: "army-movement",
          toRegion: "minas-tirith",
          fromRegion: "lossarnach"
        },
        {
          type: "army-movement",
          fromRegion: "westemnet",
          toRegion: "folde"
        }
      ],
      type: "die"
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 465
    },
    {
      type: "die",
      actions: [
        {
          fromRegion: "minas-tirith",
          toRegion: "minas-tirith",
          type: "army-attack"
        }
      ],
      playerId: "shadow",
      time: 466,
      die: "muster-army"
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          card: "sstr06",
          type: "combat-card-choose"
        }
      ],
      time: 467
    },
    {
      time: 468,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      time: 469,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: [6, 1, 4, 6, 4],
          type: "combat-roll"
        }
      ]
    },
    {
      time: 469,
      actions: [
        {
          dice: [2, 2, 2, 3, 2],
          type: "combat-roll"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: [1, 2, 1],
          type: "combat-re-roll"
        }
      ],
      time: 470
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [1, 6, 3, 1, 5]
        }
      ],
      time: 470
    },
    {
      actions: [
        {
          quantity: 2,
          nation: "southrons",
          type: "regular-unit-elimination",
          region: "minas-tirith"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 471
    },
    {
      time: 472,
      actions: [
        {
          region: "minas-tirith",
          type: "regular-unit-elimination",
          nation: "gondor",
          quantity: 1
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      actions: [
        {
          quantity: 1,
          nation: "gondor",
          type: "regular-unit-elimination",
          region: "minas-tirith"
        }
      ],
      type: "combat-card-effect",
      playerId: "free-peoples",
      card: "sstr06",
      time: 473
    },
    {
      time: 474,
      actions: [
        {
          quantity: 1,
          nation: "southrons",
          type: "elite-unit-downgrade",
          region: "minas-tirith"
        },
        {
          region: "minas-tirith",
          type: "battle-continue"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      type: "character-effect",
      actions: [
        {
          cards: ["sstr03"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      character: "the-witch-king",
      time: 475
    },
    {
      time: 476,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      time: 477,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      time: 478,
      actions: [
        {
          type: "combat-roll",
          dice: [5, 5, 5, 4, 1]
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
          dice: [4, 4, 5, 3, 4],
          type: "combat-roll"
        }
      ],
      time: 478
    },
    {
      playerId: "free-peoples",
      type: "base",
      actions: [
        {
          dice: [6, 2],
          type: "combat-re-roll"
        }
      ],
      time: 479
    },
    {
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [4, 1, 3, 6, 2]
        }
      ],
      time: 479
    },
    {
      time: 480,
      actions: [
        {
          type: "regular-unit-elimination",
          region: "minas-tirith",
          quantity: 1,
          nation: "sauron"
        },
        {
          type: "regular-unit-elimination",
          region: "minas-tirith",
          quantity: 3,
          nation: "southrons"
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      actions: [
        {
          quantity: 1,
          nation: "gondor",
          type: "regular-unit-elimination",
          region: "minas-tirith"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 481
    },
    {
      time: 482,
      die: "will-of-the-west",
      playerId: "free-peoples",
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ]
    },
    {
      time: 483,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          tiles: ["r3s"],
          type: "hunt-tile-draw"
        }
      ]
    },
    {
      actions: [
        {
          tiles: ["r1rs"],
          type: "hunt-tile-draw"
        },
        {
          tile: "r3s",
          type: "hunt-tile-return"
        },
        {
          card: "fpcha05",
          type: "card-discard-from-table"
        }
      ],
      type: "card-effect",
      time: 484,
      card: "fpcha05",
      playerId: "free-peoples"
    },
    {
      time: 485,
      actions: [
        {
          quantity: 1,
          type: "fellowship-corruption"
        }
      ],
      playerId: "free-peoples",
      type: "base"
    },
    {
      actions: [
        {
          leftUnits: {
            regulars: [],
            front: "shadow",
            elites: [],
            nNazgul: 2,
            characters: []
          },
          type: "army-movement",
          toRegion: "minas-tirith",
          fromRegion: "osgiliath"
        },
        {
          type: "army-movement",
          toRegion: "druadan-forest",
          fromRegion: "folde"
        }
      ],
      type: "die",
      character: "the-mouth-of-sauron",
      playerId: "shadow",
      time: 486,
      die: "muster"
    },
    {
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      type: "die",
      playerId: "free-peoples",
      time: 487,
      die: "character"
    },
    {
      type: "die",
      actions: [
        {
          toRegion: "minas-tirith",
          fromRegion: "minas-tirith",
          type: "army-attack"
        }
      ],
      playerId: "shadow",
      elvenRing: {
        ring: "vilya",
        toDie: "character",
        fromDie: "event"
      },
      die: "character",
      time: 488
    },
    {
      time: 489,
      actions: [
        {
          card: "sstr03",
          type: "combat-card-choose"
        }
      ],
      type: "base",
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
      time: 490
    },
    {
      time: 491,
      actions: [
        {
          type: "combat-roll",
          dice: [6, 5, 2, 5]
        }
      ],
      type: "base",
      playerId: "free-peoples"
    },
    {
      time: 491,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [1, 3, 6, 5, 1]
        }
      ]
    },
    {
      time: 492,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-re-roll",
          dice: [6]
        }
      ]
    },
    {
      time: 493,
      actions: [
        {
          quantity: 3,
          nation: "sauron",
          type: "regular-unit-elimination",
          region: "minas-tirith"
        },
        {
          region: "minas-tirith",
          type: "regular-unit-elimination",
          nation: "southrons",
          quantity: 1
        }
      ],
      type: "base",
      playerId: "shadow"
    },
    {
      actions: [
        {
          quantity: 1,
          nation: "gondor",
          type: "regular-unit-elimination",
          region: "minas-tirith"
        },
        {
          nation: "gondor",
          quantity: 3,
          region: "minas-tirith",
          type: "leader-elimination"
        },
        {
          characters: ["aragorn"],
          type: "character-elimination"
        },
        {
          characters: ["boromir"],
          type: "character-elimination"
        }
      ],
      type: "base",
      playerId: "free-peoples",
      time: 494
    },
    {
      type: "character-effect",
      actions: [
        {
          cards: ["sstr20"],
          type: "card-draw"
        }
      ],
      time: 495,
      playerId: "shadow",
      character: "the-witch-king"
    },
    {
      actions: [
        {
          die: "muster-army",
          type: "action-die-skip"
        }
      ],
      type: "die",
      playerId: "free-peoples",
      time: 496,
      die: "muster-army"
    },
    {
      actions: [
        {
          die: "event",
          type: "action-die-skip"
        }
      ],
      type: "die",
      die: "event",
      time: 497,
      playerId: "shadow"
    }
  ]
};
