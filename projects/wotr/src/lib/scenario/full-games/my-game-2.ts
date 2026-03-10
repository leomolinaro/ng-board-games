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
      actions: [
        {
          cards: ["fpcha06", "fpstr13"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          cards: ["scha01", "sstr20"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      time: 1,
      type: "base"
    },
    {
      type: "base",
      time: 2,
      actions: [],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "hunt-allocation",
          quantity: 1
        }
      ],
      type: "base",
      time: 3
    },
    {
      time: 4,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "action-roll",
          dice: ["will-of-the-west", "muster-army", "event", "character"]
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "action-roll",
          dice: ["character", "eye", "eye", "event", "muster-army", "army"]
        }
      ],
      type: "base",
      time: 4
    },
    {
      playerId: "free-peoples",
      token: "draw-card",
      actions: [
        {
          cards: ["fpstr03"],
          type: "card-draw"
        }
      ],
      time: 5,
      type: "token"
    },
    {
      type: "die-card",
      time: 6,
      die: "event",
      actions: [
        {
          quantity: 3,
          type: "regular-unit-recruitment",
          nation: "sauron",
          region: "dol-guldur"
        },
        {
          type: "regular-unit-recruitment",
          quantity: 3,
          region: "mount-gundabad",
          nation: "sauron"
        }
      ],
      card: "sstr20",
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      card: "fpcha06",
      actions: [
        {
          type: "card-play-on-table",
          card: "fpcha06"
        }
      ],
      die: "event",
      type: "die-card",
      time: 7
    },
    {
      actions: [
        {
          cards: ["fpcha20"],
          type: "card-draw"
        }
      ],
      character: "gandalf-the-grey",
      time: 8,
      type: "character-effect",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      type: "die",
      time: 9,
      die: "muster-army",
      actions: [
        {
          nation: "sauron",
          quantity: 1,
          type: "political-advance"
        }
      ]
    },
    {
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      die: "character",
      type: "die",
      time: 10,
      playerId: "free-peoples"
    },
    {
      time: 11,
      type: "base",
      actions: [
        {
          type: "hunt-roll",
          dice: [3, 1, 2]
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "shadow",
      card: "scha01",
      actions: [
        {
          tile: "rds",
          type: "hunt-tile-add"
        }
      ],
      die: "character",
      type: "die-card",
      time: 12
    },
    {
      die: "will-of-the-west",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die",
      time: 13,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "hunt-roll",
          dice: [5, 6, 6]
        }
      ],
      time: 14,
      type: "base"
    },
    {
      playerId: "shadow",
      actions: [
        {
          tiles: ["3"],
          type: "hunt-tile-draw"
        }
      ],
      time: 15,
      type: "base"
    },
    {
      type: "base",
      time: 16,
      playerId: "free-peoples",
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
      time: 17,
      type: "die",
      die: "army",
      actions: [
        {
          toRegion: "north-anduin-vale",
          type: "army-movement",
          fromRegion: "dol-guldur"
        },
        {
          type: "army-movement",
          toRegion: "gorgoroth",
          fromRegion: "barad-dur"
        }
      ],
      playerId: "shadow"
    },
    {
      token: "political-advance",
      playerId: "free-peoples",
      type: "token",
      time: 18,
      actions: [
        {
          nation: "elves",
          type: "political-advance",
          quantity: 1
        }
      ]
    },
    {
      type: "die",
      time: 19,
      actions: [
        {
          nation: "elves",
          type: "political-advance",
          quantity: 1
        }
      ],
      die: "muster-army",
      playerId: "free-peoples"
    },
    {
      time: 20,
      type: "base",
      actions: [
        {
          cards: ["fpcha09", "fpstr22"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          cards: ["scha04", "sstr07"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 20
    },
    {
      type: "base",
      time: 21,
      playerId: "free-peoples",
      actions: []
    },
    {
      type: "base",
      time: 22,
      playerId: "shadow",
      actions: [
        {
          type: "hunt-allocation",
          quantity: 2
        }
      ]
    },
    {
      time: 23,
      type: "base",
      actions: [
        {
          type: "action-roll",
          dice: ["muster", "character", "muster", "will-of-the-west"]
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          dice: ["muster", "army", "event", "muster", "muster"],
          type: "action-roll"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 23
    },
    {
      type: "die",
      time: 24,
      die: "muster",
      actions: [
        {
          type: "political-advance",
          quantity: 1,
          nation: "elves"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          quantity: 1,
          type: "political-advance",
          nation: "isengard"
        }
      ],
      die: "muster",
      type: "die",
      time: 25,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 26
    },
    {
      time: 27,
      type: "die",
      die: "army",
      actions: [
        {
          fromRegion: "nurn",
          type: "army-movement",
          toRegion: "gorgoroth"
        },
        {
          type: "army-movement",
          leftUnits: {
            regulars: [
              {
                quantity: 5,
                nation: "sauron"
              }
            ],
            elites: [],
            nNazgul: 0,
            front: "shadow"
          },
          toRegion: "morannon",
          fromRegion: "gorgoroth"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      die: "character",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      type: "die",
      time: 28
    },
    {
      type: "base",
      time: 29,
      actions: [
        {
          type: "hunt-roll",
          dice: [6, 1]
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "shadow",
      actions: [
        {
          tiles: ["2r"],
          type: "hunt-tile-draw"
        }
      ],
      time: 30,
      type: "base"
    },
    {
      actions: [
        {
          card: "fpcha06",
          type: "card-discard-from-table"
        },
        {
          quantity: 1,
          type: "fellowship-corruption"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 31
    },
    {
      time: 32,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          region: "goblins-gate",
          type: "fellowship-reveal"
        }
      ]
    },
    {
      card: "scha04",
      playerId: "shadow",
      type: "die-card",
      time: 33,
      actions: [
        {
          tile: "r1rs",
          type: "hunt-tile-add"
        }
      ],
      die: "event"
    },
    {
      type: "die",
      time: 34,
      character: "strider",
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      die: "muster",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      type: "die",
      time: 35,
      actions: [
        {
          type: "nazgul-recruitment",
          quantity: 1,
          region: "morannon"
        },
        {
          region: "dol-guldur",
          nation: "sauron",
          type: "regular-unit-recruitment",
          quantity: 1
        }
      ],
      die: "muster"
    },
    {
      actions: [
        {
          region: "erebor",
          nation: "dwarves",
          type: "elite-unit-recruitment",
          quantity: 1
        },
        {
          type: "leader-recruitment",
          quantity: 1,
          region: "erebor",
          nation: "dwarves"
        }
      ],
      die: "will-of-the-west",
      type: "die-card",
      time: 36,
      playerId: "free-peoples",
      card: "fpstr22"
    },
    {
      playerId: "shadow",
      die: "muster",
      actions: [
        {
          region: "orthanc",
          characters: ["saruman"],
          type: "character-play"
        }
      ],
      type: "die",
      time: 37
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          cards: ["fpcha04", "fpstr17"],
          type: "card-draw"
        }
      ],
      type: "base",
      time: 38
    },
    {
      playerId: "shadow",
      actions: [
        {
          cards: ["scha17", "sstr16"],
          type: "card-draw"
        }
      ],
      type: "base",
      time: 38
    },
    {
      time: 39,
      type: "base",
      playerId: "free-peoples",
      actions: []
    },
    {
      type: "base",
      time: 40,
      playerId: "shadow",
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          dice: ["will-of-the-west", "character", "muster", "muster"],
          type: "action-roll"
        }
      ],
      type: "base",
      time: 41
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "action-roll",
          dice: ["muster", "character", "eye", "event", "muster-army", "muster-army", "event"]
        }
      ],
      type: "base",
      time: 41
    },
    {
      type: "die",
      time: 42,
      actions: [
        {
          characters: ["gandalf-the-white"],
          region: "fangorn",
          type: "character-play"
        }
      ],
      die: "will-of-the-west",
      playerId: "free-peoples"
    },
    {
      type: "die-card",
      time: 43,
      actions: [
        {
          region: "north-dunland",
          nation: "isengard",
          type: "regular-unit-recruitment",
          quantity: 2
        },
        {
          region: "south-dunland",
          nation: "isengard",
          type: "regular-unit-recruitment",
          quantity: 2
        },
        {
          nation: "isengard",
          region: "orthanc",
          quantity: 2,
          type: "elite-unit-recruitment"
        }
      ],
      die: "event",
      card: "sstr16",
      playerId: "shadow"
    },
    {
      type: "die",
      time: 44,
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      die: "character",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "hunt-roll",
          dice: [3, 6]
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 45
    },
    {
      actions: [
        {
          tiles: ["1r"],
          type: "hunt-tile-draw"
        }
      ],
      playerId: "shadow",
      time: 46,
      type: "base"
    },
    {
      time: 47,
      type: "base",
      actions: [
        {
          type: "fellowship-corruption",
          quantity: 1
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          region: "old-ford",
          type: "fellowship-reveal"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 48
    },
    {
      playerId: "shadow",
      die: "muster-army",
      actions: [
        {
          toRegion: "dimrill-dale",
          type: "army-movement",
          fromRegion: "north-anduin-vale"
        },
        {
          fromRegion: "morannon",
          toRegion: "dagorlad",
          type: "army-movement"
        }
      ],
      time: 49,
      type: "die"
    },
    {
      playerId: "free-peoples",
      time: 50,
      type: "die",
      actions: [
        {
          type: "elite-unit-recruitment",
          quantity: 1,
          region: "lorien",
          nation: "elves"
        }
      ],
      die: "muster"
    },
    {
      playerId: "shadow",
      actions: [
        {
          toRegion: "lorien",
          type: "army-attack",
          fromRegion: "dimrill-dale"
        }
      ],
      die: "muster-army",
      type: "die",
      time: 51
    },
    {
      time: 52,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          region: "lorien",
          type: "army-retreat-into-siege"
        }
      ]
    },
    {
      type: "base",
      time: 53,
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 54,
      type: "die-pass",
      playerId: "free-peoples"
    },
    {
      time: 55,
      type: "die",
      die: "event",
      actions: [
        {
          cards: ["scha12"],
          type: "card-draw"
        }
      ],
      playerId: "shadow"
    },
    {
      character: "strider",
      time: 56,
      type: "die",
      die: "muster",
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      playerId: "free-peoples"
    },
    {
      type: "die",
      time: 57,
      die: "muster",
      actions: [
        {
          type: "nazgul-recruitment",
          quantity: 1,
          region: "dol-guldur"
        },
        {
          nation: "isengard",
          region: "orthanc",
          quantity: 1,
          type: "regular-unit-recruitment"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "die",
      time: 58,
      actions: [
        {
          toRegion: "lorien",
          type: "nazgul-movement",
          nNazgul: 1,
          fromRegion: "minas-morgul"
        },
        {
          type: "nazgul-movement",
          toRegion: "lorien",
          fromRegion: "dol-guldur",
          nNazgul: 1
        },
        {
          nNazgul: 2,
          fromRegion: "dagorlad",
          toRegion: "lorien",
          type: "nazgul-movement"
        }
      ],
      die: "character",
      playerId: "shadow"
    },
    {
      time: 59,
      type: "base",
      actions: [
        {
          cards: ["fpcha05", "fpstr16"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          cards: ["scha16", "sstr04"],
          type: "card-draw"
        }
      ],
      type: "base",
      time: 59
    },
    {
      time: 60,
      type: "base",
      actions: [
        {
          cards: ["fpstr17", "fpstr13"],
          type: "card-discard"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [],
      playerId: "free-peoples",
      time: 61,
      type: "base"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "hunt-allocation",
          quantity: 1
        }
      ],
      type: "base",
      time: 62
    },
    {
      time: 63,
      type: "base",
      actions: [
        {
          dice: ["muster-army", "event", "muster", "event", "muster-army"],
          type: "action-roll"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "action-roll",
          dice: ["muster", "army", "muster", "army", "character", "muster-army", "event"]
        }
      ],
      time: 63,
      type: "base"
    },
    {
      die: "event",
      actions: [
        {
          type: "combat-roll",
          dice: [5, 2, 3]
        }
      ],
      type: "die-card",
      time: 64,
      playerId: "free-peoples",
      card: "fpcha09"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "army-movement",
          toRegion: "noman-lands",
          fromRegion: "dagorlad"
        },
        {
          fromRegion: "south-dunland",
          type: "army-movement",
          toRegion: "gap-of-rohan"
        }
      ],
      die: "army",
      type: "die",
      time: 65
    },
    {
      type: "die-pass",
      time: 66,
      playerId: "free-peoples"
    },
    {
      character: "saruman",
      time: 67,
      type: "die",
      die: "muster",
      actions: [
        {
          quantity: 2,
          type: "regular-unit-upgrade",
          nation: "isengard",
          region: "orthanc"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          fromRegion: "edoras",
          toRegion: "westemnet",
          type: "army-movement"
        },
        {
          type: "army-movement",
          toRegion: "old-forest-road",
          fromRegion: "carrock"
        }
      ],
      die: "muster-army",
      type: "die",
      time: 68,
      playerId: "free-peoples"
    },
    {
      die: "muster",
      actions: [
        {
          type: "regular-unit-recruitment",
          quantity: 1,
          region: "north-dunland",
          nation: "isengard"
        },
        {
          type: "regular-unit-recruitment",
          quantity: 1,
          region: "south-dunland",
          nation: "isengard"
        },
        {
          quantity: 1,
          type: "regular-unit-recruitment",
          nation: "isengard",
          region: "orthanc"
        }
      ],
      type: "die",
      character: "saruman",
      time: 69,
      playerId: "shadow"
    },
    {
      type: "die-pass",
      time: 70,
      playerId: "free-peoples"
    },
    {
      die: "army",
      actions: [
        {
          type: "army-movement",
          toRegion: "southern-rhovanion",
          fromRegion: "noman-lands"
        },
        {
          leftUnits: {
            front: "shadow",
            elites: [],
            characters: ["saruman"],
            regulars: [
              {
                quantity: 3,
                nation: "isengard"
              }
            ]
          },
          type: "army-movement",
          toRegion: "gap-of-rohan",
          fromRegion: "orthanc"
        }
      ],
      type: "die",
      time: 71,
      playerId: "shadow"
    },
    {
      type: "die",
      time: 72,
      actions: [
        {
          quantity: 1,
          type: "political-advance",
          nation: "rohan"
        }
      ],
      die: "muster",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          toRegion: "lorien",
          type: "army-attack",
          fromRegion: "lorien"
        }
      ],
      die: "character",
      time: 73,
      type: "die",
      playerId: "shadow"
    },
    {
      playerId: "shadow",
      actions: [
        {
          card: "scha17",
          type: "combat-card-choose"
        }
      ],
      time: 74,
      type: "base"
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 75
    },
    {
      actions: [
        {
          dice: [3, 4, 5],
          type: "combat-roll"
        }
      ],
      type: "combat-card-effect",
      time: 76,
      playerId: "shadow",
      card: "scha17"
    },
    {
      playerId: "free-peoples",
      card: "scha17",
      actions: [
        {
          quantity: 2,
          type: "elite-unit-downgrade",
          nation: "elves",
          region: "lorien"
        }
      ],
      time: 77,
      type: "combat-card-effect"
    },
    {
      time: 78,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: [3, 1, 2, 3],
          type: "combat-roll"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [5, 1, 4, 4, 4],
          type: "combat-roll"
        }
      ],
      type: "base",
      time: 78
    },
    {
      actions: [
        {
          dice: [1],
          type: "combat-re-roll"
        }
      ],
      playerId: "free-peoples",
      time: 79,
      type: "base"
    },
    {
      type: "base",
      time: 79,
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [3, 6, 4, 2, 2]
        }
      ]
    },
    {
      actions: [
        {
          region: "lorien",
          nation: "elves",
          type: "regular-unit-elimination",
          quantity: 1
        }
      ],
      playerId: "free-peoples",
      time: 80,
      type: "base"
    },
    {
      actions: [
        {
          type: "elite-unit-downgrade",
          quantity: 1,
          region: "lorien",
          nation: "sauron"
        },
        {
          region: "lorien",
          type: "battle-continue"
        }
      ],
      playerId: "shadow",
      time: 81,
      type: "base"
    },
    {
      actions: [
        {
          type: "combat-card-choose",
          card: "sstr04"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 82
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples",
      time: 83,
      type: "base"
    },
    {
      playerId: "shadow",
      card: "sstr04",
      actions: [
        {
          region: "lorien",
          nation: "sauron",
          type: "regular-unit-elimination",
          quantity: 2
        }
      ],
      type: "combat-card-effect",
      time: 84
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          dice: [3, 5, 1],
          type: "combat-roll"
        }
      ],
      time: 85,
      type: "base"
    },
    {
      type: "base",
      time: 85,
      playerId: "shadow",
      actions: [
        {
          dice: [5, 2, 4, 1, 1],
          type: "combat-roll"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          dice: [2],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      time: 86
    },
    {
      type: "base",
      time: 86,
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [2, 1, 5]
        }
      ]
    },
    {
      actions: [
        {
          region: "lorien",
          nation: "sauron",
          type: "regular-unit-elimination",
          quantity: 1
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 87
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-elimination",
          nation: "elves",
          region: "lorien"
        }
      ],
      type: "base",
      time: 88
    },
    {
      card: "fpcha05",
      playerId: "free-peoples",
      time: 89,
      type: "die-card",
      die: "event",
      actions: [
        {
          type: "card-play-on-table",
          card: "fpcha05"
        }
      ]
    },
    {
      type: "die",
      time: 90,
      die: "muster-army",
      actions: [
        {
          fromRegion: "lorien",
          toRegion: "lorien",
          type: "army-attack"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          card: "scha16",
          type: "combat-card-choose"
        }
      ],
      playerId: "shadow",
      time: 91,
      type: "base"
    },
    {
      time: 92,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      actions: [
        {
          dice: [5, 3],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 93
    },
    {
      time: 93,
      type: "base",
      actions: [
        {
          dice: [6, 5, 3, 2, 4],
          type: "combat-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "shadow",
      card: "scha16",
      actions: [
        {
          leaders: {
            nNazgul: 1
          },
          type: "leader-forfeit"
        }
      ],
      type: "card-effect",
      time: 94
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-re-roll",
          dice: [2]
        }
      ],
      type: "base",
      time: 95
    },
    {
      actions: [
        {
          dice: [6, 5, 2, 1],
          type: "combat-re-roll"
        }
      ],
      playerId: "shadow",
      time: 95,
      type: "base"
    },
    {
      time: 96,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          nation: "sauron",
          region: "lorien",
          quantity: 1,
          type: "regular-unit-elimination"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          region: "lorien",
          nation: "elves",
          type: "regular-unit-elimination",
          quantity: 2
        },
        {
          quantity: 1,
          type: "leader-elimination",
          nation: "elves",
          region: "lorien"
        }
      ],
      type: "base",
      time: 97
    },
    {
      playerId: "free-peoples",
      time: 98,
      type: "die",
      die: "muster-army",
      actions: [
        {
          type: "political-advance",
          quantity: 1,
          nation: "rohan"
        }
      ]
    },
    {
      time: 99,
      type: "die",
      die: "event",
      actions: [
        {
          cards: ["sstr15"],
          type: "card-draw"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 100,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          cards: ["fpcha12", "fpstr15"],
          type: "card-draw"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          cards: ["scha09", "sstr01"],
          type: "card-draw"
        }
      ],
      time: 100,
      type: "base"
    },
    {
      actions: [],
      playerId: "free-peoples",
      time: 101,
      type: "base"
    },
    {
      actions: [
        {
          type: "hunt-allocation",
          quantity: 0
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 102
    },
    {
      type: "base",
      time: 103,
      actions: [
        {
          dice: ["will-of-the-west", "muster-army", "will-of-the-west", "event", "muster-army"],
          type: "action-roll"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          dice: ["muster", "army", "event", "character", "muster-army", "event", "army", "eye"],
          type: "action-roll"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 103
    },
    {
      time: 104,
      type: "die-card",
      die: "event",
      actions: [
        {
          type: "elite-unit-recruitment",
          quantity: 1,
          region: "edoras",
          nation: "rohan"
        },
        {
          region: "edoras",
          nation: "rohan",
          type: "leader-recruitment",
          quantity: 1
        }
      ],
      card: "fpstr16",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 105,
      type: "die",
      die: "character",
      actions: [
        {
          type: "army-attack",
          toRegion: "fords-of-isen",
          fromRegion: "gap-of-rohan"
        }
      ]
    },
    {
      time: 106,
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
      time: 107,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      type: "base",
      time: 108,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [6, 2]
        }
      ]
    },
    {
      time: 108,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: [6, 3, 2, 4, 4],
          type: "combat-roll"
        }
      ]
    },
    {
      type: "base",
      time: 109,
      playerId: "free-peoples",
      actions: [
        {
          dice: [6],
          type: "combat-re-roll"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [4, 3, 1, 1]
        }
      ],
      time: 109,
      type: "base"
    },
    {
      playerId: "shadow",
      actions: [
        {
          region: "gap-of-rohan",
          nation: "isengard",
          type: "regular-unit-elimination",
          quantity: 2
        }
      ],
      type: "base",
      time: 110
    },
    {
      actions: [
        {
          nation: "rohan",
          region: "fords-of-isen",
          quantity: 1,
          type: "regular-unit-elimination"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 111
    },
    {
      playerId: "shadow",
      actions: [
        {
          region: "fords-of-isen",
          type: "battle-continue"
        }
      ],
      type: "base",
      time: 112
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "army-retreat",
          toRegion: "helms-deep"
        }
      ],
      type: "base",
      time: 113
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "army-advance"
        }
      ],
      type: "base",
      time: 114
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          fromRegion: "westemnet",
          toRegion: "helms-deep",
          type: "army-movement"
        },
        {
          toRegion: "ettenmoors",
          type: "army-movement",
          fromRegion: "north-downs"
        }
      ],
      die: "muster-army",
      type: "die",
      time: 115
    },
    {
      playerId: "shadow",
      die: "army",
      actions: [
        {
          fromRegion: "fords-of-isen",
          type: "army-attack",
          toRegion: "helms-deep"
        }
      ],
      time: 116,
      type: "die"
    },
    {
      type: "base",
      time: 117,
      playerId: "free-peoples",
      actions: [
        {
          region: "helms-deep",
          type: "army-retreat-into-siege"
        }
      ]
    },
    {
      type: "base",
      time: 118,
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "die",
      time: 119,
      die: "muster-army",
      actions: [
        {
          nation: "rohan",
          region: "westemnet",
          quantity: 1,
          type: "regular-unit-recruitment"
        },
        {
          quantity: 1,
          type: "regular-unit-recruitment",
          nation: "rohan",
          region: "edoras"
        }
      ]
    },
    {
      playerId: "shadow",
      die: "army",
      actions: [
        {
          toRegion: "westemnet",
          type: "army-attack",
          fromRegion: "helms-deep"
        }
      ],
      time: 120,
      type: "die"
    },
    {
      type: "base",
      time: 121,
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 122,
      type: "base"
    },
    {
      type: "base",
      time: 123,
      actions: [
        {
          dice: [1],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [3, 4, 4, 4, 3],
          type: "combat-roll"
        }
      ],
      type: "base",
      time: 123
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [3, 2, 4, 6, 5]
        }
      ],
      type: "base",
      time: 124
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 1,
          region: "westemnet",
          nation: "rohan"
        }
      ],
      type: "base",
      time: 125
    },
    {
      actions: [
        {
          leftUnits: {
            regulars: [],
            front: "shadow",
            elites: [
              {
                quantity: 5,
                nation: "isengard"
              }
            ]
          },
          type: "army-advance"
        }
      ],
      playerId: "shadow",
      time: 126,
      type: "base"
    },
    {
      type: "die-pass",
      time: 127,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          toRegion: "folde",
          leftUnits: {
            regulars: [
              {
                quantity: 1,
                nation: "isengard"
              }
            ],
            elites: [],
            front: "shadow"
          },
          type: "army-movement",
          fromRegion: "westemnet"
        },
        {
          toRegion: "south-dunland",
          type: "army-movement",
          fromRegion: "north-dunland"
        }
      ],
      die: "muster-army",
      type: "die",
      time: 128,
      playerId: "shadow"
    },
    {
      type: "die-pass",
      time: 129,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          fromRegion: "south-dunland",
          type: "army-movement",
          toRegion: "helms-deep"
        }
      ],
      die: "event",
      type: "die-card",
      time: 130,
      playerId: "shadow",
      card: "sstr07"
    },
    {
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      die: "will-of-the-west",
      time: 131,
      type: "die",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [6],
          type: "hunt-roll"
        }
      ],
      type: "base",
      time: 132
    },
    {
      actions: [
        {
          tiles: ["2"],
          type: "hunt-tile-draw"
        }
      ],
      playerId: "shadow",
      time: 133,
      type: "base"
    },
    {
      card: "fpcha05",
      type: "card-effect-skip",
      time: 134,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          quantity: 2,
          type: "fellowship-corruption"
        }
      ],
      playerId: "free-peoples",
      time: 135,
      type: "base"
    },
    {
      actions: [
        {
          region: "southern-rhovanion",
          characters: ["the-witch-king"],
          type: "character-play"
        }
      ],
      die: "muster",
      type: "die",
      time: 136,
      playerId: "shadow"
    },
    {
      type: "die",
      time: 137,
      die: "will-of-the-west",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      playerId: "free-peoples"
    },
    {
      time: 138,
      type: "base",
      actions: [
        {
          type: "hunt-roll",
          dice: [2]
        }
      ],
      playerId: "shadow"
    },
    {
      type: "die-card",
      time: 139,
      actions: [
        {
          region: "southern-rhovanion",
          nation: "sauron",
          type: "regular-unit-upgrade",
          quantity: 1
        },
        {
          region: "southern-rhovanion",
          nation: "sauron",
          type: "regular-unit-upgrade",
          quantity: 1
        }
      ],
      die: "event",
      card: "sstr15",
      playerId: "shadow"
    },
    {
      actions: [
        {
          cards: ["fpcha18", "fpstr09"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 140
    },
    {
      playerId: "shadow",
      actions: [
        {
          cards: ["scha08", "sstr24"],
          type: "card-draw"
        }
      ],
      time: 140,
      type: "base"
    },
    {
      type: "base",
      time: 141,
      playerId: "free-peoples",
      actions: [
        {
          cards: ["fpstr15"],
          type: "card-discard"
        }
      ]
    },
    {
      time: 142,
      type: "base",
      actions: [],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      time: 143,
      type: "base"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "action-roll",
          dice: ["event", "character", "will-of-the-west", "will-of-the-west", "character"]
        }
      ],
      time: 144,
      type: "base"
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: [
            "character",
            "event",
            "muster",
            "eye",
            "muster-army",
            "muster",
            "muster-army",
            "muster"
          ]
        }
      ],
      playerId: "shadow",
      time: 144,
      type: "base"
    },
    {
      time: 145,
      type: "die",
      die: "character",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [2, 6],
          type: "hunt-roll"
        }
      ],
      time: 146,
      type: "base"
    },
    {
      time: 147,
      type: "base",
      actions: [
        {
          tiles: ["er"],
          type: "hunt-tile-draw"
        }
      ],
      playerId: "shadow"
    },
    {
      card: "fpcha05",
      type: "card-effect-skip",
      time: 148,
      playerId: "free-peoples"
    },
    {
      time: 149,
      type: "base",
      actions: [
        {
          type: "fellowship-corruption",
          quantity: 1
        }
      ],
      playerId: "free-peoples"
    },
    {
      time: 150,
      type: "base",
      actions: [
        {
          region: "northern-rhovanion",
          type: "fellowship-reveal"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "fellowship-corruption",
          quantity: 2
        }
      ],
      die: "event",
      time: 151,
      type: "die-card",
      playerId: "shadow",
      card: "scha12"
    },
    {
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      die: "will-of-the-west",
      type: "die",
      character: "strider",
      time: 152,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      type: "die",
      time: 153,
      die: "character",
      actions: [
        {
          fromRegion: "helms-deep",
          type: "army-attack",
          toRegion: "helms-deep"
        }
      ]
    },
    {
      actions: [
        {
          card: "sstr01",
          type: "combat-card-choose"
        }
      ],
      playerId: "shadow",
      time: 154,
      type: "base"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          card: "fpcha20",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      time: 155
    },
    {
      time: 156,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: [1, 3, 6, 6],
          type: "combat-roll"
        }
      ]
    },
    {
      type: "base",
      time: 156,
      actions: [
        {
          dice: [4, 2],
          type: "combat-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 157,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: [6],
          type: "combat-re-roll"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [2],
          type: "combat-re-roll"
        }
      ],
      time: 157,
      type: "base"
    },
    {
      playerId: "shadow",
      actions: [
        {
          quantity: 4,
          type: "regular-unit-elimination",
          nation: "isengard",
          region: "helms-deep"
        }
      ],
      type: "base",
      time: 158
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "elite-unit-downgrade",
          quantity: 1,
          region: "helms-deep",
          nation: "rohan"
        }
      ],
      type: "base",
      time: 159
    },
    {
      type: "base",
      time: 160,
      playerId: "shadow",
      actions: [
        {
          region: "helms-deep",
          type: "battle-cease"
        }
      ]
    },
    {
      time: 161,
      type: "die",
      actions: [
        {
          nation: "rohan",
          region: "edoras",
          quantity: 1,
          type: "elite-unit-recruitment"
        }
      ],
      die: "will-of-the-west",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      die: "muster-army",
      actions: [
        {
          fromRegion: "helms-deep",
          type: "army-attack",
          toRegion: "helms-deep"
        }
      ],
      type: "die",
      time: 162
    },
    {
      playerId: "shadow",
      actions: [
        {
          card: "sstr24",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      time: 163
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 164
    },
    {
      actions: [
        {
          dice: [5, 1, 2, 6],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples",
      time: 165,
      type: "base"
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [2, 5, 1, 2, 6],
          type: "combat-roll"
        }
      ],
      type: "base",
      time: 165
    },
    {
      time: 166,
      type: "base",
      actions: [
        {
          dice: [3],
          type: "combat-re-roll"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [6, 6, 2]
        }
      ],
      time: 166,
      type: "base"
    },
    {
      actions: [
        {
          quantity: 1,
          type: "elite-unit-elimination",
          nation: "isengard",
          region: "helms-deep"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 167
    },
    {
      actions: [
        {
          quantity: 4,
          type: "regular-unit-elimination",
          nation: "rohan",
          region: "helms-deep"
        },
        {
          quantity: 1,
          type: "leader-elimination",
          nation: "rohan",
          region: "helms-deep"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 168
    },
    {
      type: "die-pass",
      time: 169,
      playerId: "free-peoples"
    },
    {
      die: "muster-army",
      actions: [
        {
          type: "army-movement",
          toRegion: "westemnet",
          fromRegion: "helms-deep"
        },
        {
          fromRegion: "southern-rhovanion",
          type: "army-movement",
          toRegion: "northern-rhovanion"
        }
      ],
      type: "die",
      time: 170,
      playerId: "shadow"
    },
    {
      die: "event",
      actions: [
        {
          quantity: 1,
          type: "fellowship-heal"
        }
      ],
      time: 171,
      type: "die-card",
      playerId: "free-peoples",
      card: "fpcha12"
    },
    {
      playerId: "shadow",
      type: "die",
      time: 172,
      actions: [
        {
          nation: "southrons",
          type: "political-advance",
          quantity: 1
        }
      ],
      die: "muster"
    },
    {
      type: "die-pass",
      time: 173,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          quantity: 1,
          type: "political-advance",
          nation: "southrons"
        }
      ],
      die: "muster",
      type: "die",
      time: 174
    },
    {
      playerId: "free-peoples",
      card: "fpcha04",
      actions: [
        {
          tile: "b-1",
          type: "hunt-tile-add"
        }
      ],
      die: "character",
      time: 175,
      type: "die-card"
    },
    {
      playerId: "shadow",
      actions: [
        {
          nation: "sauron",
          region: "mount-gundabad",
          quantity: 1,
          type: "elite-unit-recruitment"
        }
      ],
      die: "muster",
      type: "die",
      time: 176
    },
    {
      type: "base",
      time: 177,
      playerId: "free-peoples",
      actions: [
        {
          cards: ["fpcha19", "fpstr24"],
          type: "card-draw"
        }
      ]
    },
    {
      time: 177,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          cards: ["scha05", "sstr18"],
          type: "card-draw"
        }
      ]
    },
    {
      actions: [],
      playerId: "free-peoples",
      type: "base",
      time: 178
    },
    {
      time: 179,
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          dice: ["muster-army", "will-of-the-west", "muster-army", "muster-army", "muster-army"],
          type: "action-roll"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 180
    },
    {
      time: 180,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: ["eye", "muster", "character", "army", "eye", "character", "event", "muster"],
          type: "action-roll"
        }
      ]
    },
    {
      actions: [
        {
          type: "elite-unit-recruitment",
          quantity: 1,
          region: "woodland-realm",
          nation: "elves"
        },
        {
          cards: ["fpstr07"],
          type: "card-draw"
        }
      ],
      die: "muster-army",
      type: "die-card",
      time: 181,
      playerId: "free-peoples",
      card: "fpstr24"
    },
    {
      card: "scha08",
      playerId: "shadow",
      type: "die-card",
      time: 182,
      actions: [
        {
          type: "combat-roll",
          dice: [3, 6, 5]
        }
      ],
      die: "event"
    },
    {
      type: "die",
      time: 183,
      actions: [
        {
          quantity: 1,
          type: "elite-unit-recruitment",
          nation: "elves",
          region: "woodland-realm"
        }
      ],
      die: "muster-army",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          tiles: ["2"],
          type: "hunt-tile-draw"
        }
      ],
      die: "character",
      type: "die-card",
      time: 184,
      playerId: "shadow",
      card: "scha05"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          companions: ["legolas"],
          type: "companion-random"
        }
      ],
      type: "base",
      time: 185
    },
    {
      type: "base",
      time: 186,
      playerId: "free-peoples",
      actions: [
        {
          characters: ["legolas"],
          type: "character-elimination"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 187,
      type: "die-pass"
    },
    {
      time: 188,
      type: "die",
      die: "character",
      actions: [
        {
          type: "army-attack",
          toRegion: "edoras",
          fromRegion: "westemnet"
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
      playerId: "shadow",
      type: "base",
      time: 189
    },
    {
      time: 190,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      actions: [
        {
          dice: [3, 6, 2],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 191
    },
    {
      type: "base",
      time: 191,
      actions: [
        {
          type: "combat-roll",
          dice: [5, 6, 1, 6, 1]
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          dice: [6],
          type: "combat-re-roll"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 192
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [4, 6, 1],
          type: "combat-re-roll"
        }
      ],
      time: 192,
      type: "base"
    },
    {
      actions: [
        {
          region: "westemnet",
          nation: "isengard",
          type: "elite-unit-elimination",
          quantity: 1
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 193
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-downgrade",
          nation: "rohan",
          region: "edoras"
        },
        {
          region: "edoras",
          nation: "rohan",
          type: "elite-unit-elimination",
          quantity: 1
        }
      ],
      time: 194,
      type: "base"
    },
    {
      time: 195,
      type: "base",
      actions: [
        {
          region: "edoras",
          type: "battle-continue"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 196,
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 197,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          card: "fpstr07",
          type: "combat-card-choose"
        }
      ]
    },
    {
      time: 198,
      type: "base",
      actions: [
        {
          dice: [2, 6],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [6, 2, 2, 1, 4]
        }
      ],
      playerId: "shadow",
      time: 198,
      type: "base"
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
      time: 199
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [5, 1, 6]
        }
      ],
      type: "base",
      time: 199
    },
    {
      time: 200,
      type: "base",
      actions: [
        {
          nation: "isengard",
          region: "westemnet",
          quantity: 1,
          type: "elite-unit-elimination"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      time: 201,
      playerId: "free-peoples",
      actions: [
        {
          nation: "rohan",
          region: "edoras",
          quantity: 2,
          type: "regular-unit-elimination"
        },
        {
          quantity: 1,
          type: "leader-elimination",
          nation: "rohan",
          region: "edoras"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          leftUnits: {
            regulars: [
              {
                nation: "isengard",
                quantity: 1
              }
            ],
            elites: [
              {
                quantity: 2,
                nation: "isengard"
              }
            ],
            front: "shadow"
          },
          type: "army-advance"
        }
      ],
      type: "base",
      time: 202
    },
    {
      time: 203,
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      die: "will-of-the-west",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          dice: [2, 6, 1],
          type: "hunt-roll"
        }
      ],
      playerId: "shadow",
      time: 204,
      type: "base"
    },
    {
      time: 205,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "hunt-re-roll",
          dice: [1, 1]
        }
      ]
    },
    {
      type: "base",
      time: 206,
      playerId: "shadow",
      actions: [
        {
          tiles: ["1"],
          type: "hunt-tile-draw"
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "card-effect-skip",
      time: 207,
      card: "fpcha05"
    },
    {
      actions: [
        {
          type: "companion-random",
          companions: ["strider"]
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 208
    },
    {
      type: "base",
      time: 209,
      playerId: "free-peoples",
      actions: [
        {
          characters: ["strider"],
          type: "character-elimination"
        },
        {
          companion: "boromir",
          type: "fellowship-guide"
        }
      ]
    },
    {
      time: 210,
      type: "die",
      die: "muster",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-recruitment",
          nation: "southrons",
          region: "south-rhun"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 211,
      type: "die",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-recruitment",
          nation: "elves",
          region: "woodland-realm"
        }
      ],
      die: "muster-army",
      playerId: "free-peoples"
    },
    {
      die: "muster",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-recruitment",
          nation: "southrons",
          region: "south-rhun"
        }
      ],
      time: 212,
      type: "die",
      playerId: "shadow"
    },
    {
      die: "muster-army",
      actions: [
        {
          type: "card-play-on-table",
          card: "fpstr03"
        },
        {
          quantity: 1,
          type: "political-advance",
          nation: "north"
        }
      ],
      time: 213,
      type: "die-card",
      playerId: "free-peoples",
      card: "fpstr03"
    },
    {
      playerId: "shadow",
      time: 214,
      type: "die",
      actions: [
        {
          type: "army-movement",
          toRegion: "east-rhun",
          fromRegion: "south-rhun"
        },
        {
          toRegion: "eagles-eyre",
          type: "army-movement",
          fromRegion: "mount-gundabad"
        }
      ],
      die: "army"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          cards: ["fpcha08", "fpstr11"],
          type: "card-draw"
        }
      ],
      time: 215,
      type: "base"
    },
    {
      time: 215,
      type: "base",
      actions: [
        {
          cards: ["scha06", "sstr12"],
          type: "card-draw"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          region: "southern-rhovanion",
          type: "fellowship-declare"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 216
    },
    {
      time: 217,
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          dice: ["character", "will-of-the-west", "character", "muster", "muster-army"],
          type: "action-roll"
        }
      ],
      time: 218,
      type: "base"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "action-roll",
          dice: [
            "character",
            "event",
            "character",
            "muster-army",
            "muster-army",
            "army",
            "muster",
            "eye"
          ]
        }
      ],
      time: 218,
      type: "base"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          nation: "north",
          type: "political-advance",
          quantity: 1
        }
      ],
      die: "muster",
      type: "die",
      time: 219
    },
    {
      die: "army",
      actions: [
        {
          toRegion: "carrock",
          type: "army-movement",
          fromRegion: "eagles-eyre"
        },
        {
          toRegion: "vale-of-the-carnen",
          type: "army-movement",
          fromRegion: "east-rhun"
        }
      ],
      type: "die",
      time: 220,
      playerId: "shadow"
    },
    {
      die: "muster-army",
      actions: [
        {
          type: "elite-unit-recruitment",
          quantity: 1,
          region: "dale",
          nation: "north"
        }
      ],
      time: 221,
      type: "die",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      type: "die",
      time: 222,
      actions: [
        {
          toRegion: "dale",
          type: "army-attack",
          fromRegion: "northern-rhovanion"
        }
      ],
      die: "character"
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow",
      time: 223,
      type: "base"
    },
    {
      time: 224,
      type: "base",
      actions: [
        {
          card: "fpstr09",
          type: "combat-card-choose"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "free-peoples",
      card: "fpstr09",
      actions: [
        {
          toRegion: "erebor",
          type: "army-retreat"
        }
      ],
      type: "combat-card-effect",
      time: 225
    },
    {
      time: 226,
      type: "base",
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "die-pass",
      time: 227,
      playerId: "free-peoples"
    },
    {
      time: 228,
      type: "die",
      die: "character",
      actions: [
        {
          fromRegion: "lorien",
          nNazgul: 3,
          type: "nazgul-movement",
          toRegion: "dale"
        },
        {
          fromRegion: "lorien",
          nNazgul: 1,
          type: "nazgul-movement",
          toRegion: "southern-rhovanion"
        },
        {
          nNazgul: 1,
          fromRegion: "lorien",
          toRegion: "noman-lands",
          type: "nazgul-movement"
        },
        {
          fromRegion: "dale",
          nNazgul: 1,
          type: "nazgul-movement",
          toRegion: "dagorlad"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 229,
      type: "die-pass"
    },
    {
      time: 230,
      type: "die-card",
      actions: [
        {
          tiles: ["er"],
          type: "hunt-tile-draw"
        }
      ],
      die: "event",
      card: "scha06",
      playerId: "shadow"
    },
    {
      time: 231,
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      die: "character",
      playerId: "free-peoples"
    },
    {
      type: "base",
      time: 232,
      playerId: "shadow",
      actions: [
        {
          dice: [2, 3],
          type: "hunt-roll"
        }
      ]
    },
    {
      actions: [
        {
          dice: [2],
          type: "hunt-re-roll"
        }
      ],
      playerId: "shadow",
      time: 233,
      type: "base"
    },
    {
      playerId: "shadow",
      die: "muster-army",
      actions: [
        {
          fromRegion: "dale",
          type: "army-attack",
          toRegion: "woodland-realm"
        }
      ],
      type: "die",
      time: 234
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          region: "woodland-realm",
          type: "army-retreat-into-siege"
        }
      ],
      type: "base",
      time: 235
    },
    {
      type: "base",
      time: 236,
      actions: [
        {
          leftUnits: {
            elites: [],
            regulars: [
              {
                quantity: 3,
                nation: "sauron"
              }
            ],
            front: "shadow",
            nNazgul: 0,
            characters: []
          },
          type: "army-advance"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "die",
      time: 237,
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      die: "character"
    },
    {
      time: 238,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: [2, 3],
          type: "hunt-roll"
        }
      ]
    },
    {
      time: 239,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: [3],
          type: "hunt-re-roll"
        }
      ]
    },
    {
      playerId: "shadow",
      type: "die",
      time: 240,
      actions: [
        {
          fromRegion: "carrock",
          type: "army-attack",
          toRegion: "old-forest-road"
        }
      ],
      die: "muster-army"
    },
    {
      type: "base",
      time: 241,
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      type: "base",
      time: 242,
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
          dice: [6],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples",
      time: 243,
      type: "base"
    },
    {
      type: "base",
      time: 243,
      actions: [
        {
          dice: [2, 3, 5, 1, 3],
          type: "combat-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          region: "carrock",
          nation: "sauron",
          type: "regular-unit-elimination",
          quantity: 1
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 244
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          quantity: 1,
          type: "regular-unit-elimination",
          nation: "north",
          region: "old-forest-road"
        }
      ],
      type: "base",
      time: 245
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "army-advance"
        }
      ],
      time: 246,
      type: "base"
    },
    {
      type: "die",
      time: 247,
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      die: "will-of-the-west",
      playerId: "free-peoples"
    },
    {
      type: "base",
      time: 248,
      actions: [
        {
          type: "hunt-roll",
          dice: [6, 3]
        }
      ],
      playerId: "shadow"
    },
    {
      time: 249,
      type: "base",
      actions: [
        {
          type: "hunt-re-roll",
          dice: [6]
        }
      ],
      playerId: "shadow"
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
      time: 250
    },
    {
      card: "fpcha05",
      type: "card-effect-skip",
      time: 251,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          characters: ["boromir"],
          type: "character-elimination"
        },
        {
          type: "fellowship-guide",
          companion: "gimli"
        }
      ],
      playerId: "free-peoples",
      time: 252,
      type: "base"
    },
    {
      time: 253,
      type: "base",
      actions: [
        {
          region: "morannon",
          type: "fellowship-reveal"
        }
      ],
      playerId: "free-peoples"
    },
    {
      time: 254,
      type: "base",
      actions: [
        {
          tiles: ["0r"],
          type: "hunt-tile-draw"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "die",
      time: 255,
      die: "muster",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-recruitment",
          nation: "southrons",
          region: "north-rhun"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      time: 256,
      actions: [
        {
          cards: ["fpcha11", "fpstr21"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          cards: ["scha23", "sstr09"],
          type: "card-draw"
        }
      ],
      type: "base",
      time: 256
    },
    {
      type: "base",
      time: 257,
      actions: [],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "hunt-allocation",
          quantity: 3
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 258
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          dice: ["character", "event", "character", "muster-army", "muster"],
          type: "action-roll"
        }
      ],
      time: 259,
      type: "base"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "action-roll",
          dice: ["event", "muster", "muster-army", "event", "eye", "event"]
        }
      ],
      time: 259,
      type: "base"
    },
    {
      playerId: "free-peoples",
      type: "die",
      time: 260,
      die: "character",
      actions: [
        {
          type: "fellowship-hide"
        }
      ]
    },
    {
      playerId: "shadow",
      type: "die",
      time: 261,
      actions: [
        {
          type: "character-play",
          region: "dol-guldur",
          characters: ["the-mouth-of-sauron"]
        }
      ],
      die: "muster"
    },
    {
      time: 262,
      type: "die",
      actions: [
        {
          nation: "dwarves",
          type: "political-advance",
          quantity: 1
        }
      ],
      die: "muster",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      card: "sstr09",
      actions: [
        {
          toRegion: "eastern-mirkwood",
          type: "army-movement",
          fromRegion: "dol-guldur"
        },
        {
          toRegion: "vale-of-the-carnen",
          type: "army-movement",
          fromRegion: "north-rhun"
        },
        {
          type: "army-movement",
          leftUnits: {
            elites: [],
            front: "shadow",
            regulars: [
              {
                quantity: 2,
                nation: "sauron"
              }
            ]
          },
          toRegion: "woodland-realm",
          fromRegion: "old-forest-road"
        },
        {
          type: "army-movement",
          toRegion: "minas-morgul",
          fromRegion: "gorgoroth"
        }
      ],
      die: "event",
      type: "die-card",
      time: 263
    },
    {
      playerId: "free-peoples",
      type: "die",
      time: 264,
      die: "muster-army",
      actions: [
        {
          type: "political-advance",
          quantity: 1,
          nation: "dwarves"
        }
      ]
    },
    {
      actions: [
        {
          nNazgul: 1,
          fromRegion: "dagorlad",
          toRegion: "woodland-realm",
          type: "nazgul-movement"
        },
        {
          nNazgul: 1,
          fromRegion: "noman-lands",
          toRegion: "vale-of-the-carnen",
          type: "nazgul-movement"
        },
        {
          fromRegion: "southern-rhovanion",
          nNazgul: 1,
          type: "nazgul-movement",
          toRegion: "vale-of-the-carnen"
        },
        {
          fromRegion: "woodland-realm",
          toRegion: "woodland-realm",
          type: "army-attack"
        }
      ],
      die: "event",
      time: 265,
      type: "die-card",
      playerId: "shadow",
      card: "scha23"
    },
    {
      type: "base",
      time: 266,
      actions: [
        {
          card: "sstr12",
          type: "combat-card-choose"
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
      playerId: "free-peoples",
      time: 267,
      type: "base"
    },
    {
      time: 268,
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [5, 4, 3, 3, 1]
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          dice: [3, 3, 3, 4, 3],
          type: "combat-roll"
        }
      ],
      playerId: "shadow",
      time: 268,
      type: "base"
    },
    {
      type: "base",
      time: 269,
      actions: [
        {
          type: "combat-re-roll",
          dice: [1]
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [5, 5, 2, 5, 3]
        }
      ],
      type: "base",
      time: 269
    },
    {
      type: "base",
      time: 270,
      actions: [
        {
          nation: "sauron",
          region: "woodland-realm",
          quantity: 1,
          type: "regular-unit-elimination"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          nation: "elves",
          region: "woodland-realm",
          quantity: 3,
          type: "elite-unit-downgrade"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 271
    },
    {
      actions: [
        {
          region: "woodland-realm",
          type: "battle-cease"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 272
    },
    {
      time: 273,
      character: "the-witch-king",
      type: "character-effect",
      actions: [
        {
          cards: ["sstr08"],
          type: "card-draw"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "die",
      time: 274,
      die: "character",
      actions: [
        {
          type: "fellowship-progress"
        }
      ]
    },
    {
      type: "base",
      time: 275,
      playerId: "shadow",
      actions: [
        {
          tiles: ["rds"],
          type: "hunt-tile-draw"
        }
      ]
    },
    {
      actions: [
        {
          tiles: ["1"],
          type: "hunt-tile-draw"
        },
        {
          tile: "rds",
          type: "hunt-tile-return"
        },
        {
          card: "fpcha05",
          type: "card-discard-from-table"
        }
      ],
      type: "card-effect",
      time: 276,
      playerId: "free-peoples",
      card: "fpcha05"
    },
    {
      time: 277,
      type: "base",
      actions: [
        {
          type: "companion-random",
          companions: ["peregrin"]
        }
      ],
      playerId: "free-peoples"
    },
    {
      type: "character-effect-skip",
      time: 278,
      character: "peregrin",
      playerId: "free-peoples"
    },
    {
      type: "base",
      time: 279,
      actions: [
        {
          characters: ["peregrin"],
          type: "character-elimination"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      card: "sstr08",
      die: "event",
      actions: [
        {
          type: "army-movement",
          toRegion: "dale",
          fromRegion: "eastern-mirkwood"
        },
        {
          toRegion: "dale",
          type: "army-movement",
          leftUnits: {
            elites: [],
            front: "shadow",
            nNazgul: 0,
            regulars: [
              {
                quantity: 3,
                nation: "southrons"
              }
            ]
          },
          fromRegion: "vale-of-the-carnen"
        }
      ],
      type: "die-card",
      time: 280
    },
    {
      card: "fpcha11",
      playerId: "free-peoples",
      time: 281,
      type: "die-card",
      actions: [
        {
          characters: ["meriadoc"],
          type: "character-elimination"
        },
        {
          quantity: 1,
          type: "fellowship-heal"
        }
      ],
      die: "event"
    },
    {
      die: "muster-army",
      actions: [
        {
          toRegion: "erebor",
          type: "army-attack",
          fromRegion: "dale"
        }
      ],
      type: "die",
      time: 282,
      playerId: "shadow"
    },
    {
      time: 283,
      type: "base",
      actions: [
        {
          region: "erebor",
          type: "army-retreat-into-siege"
        },
        {
          type: "regular-unit-disband",
          quantity: 1,
          region: "erebor",
          nation: "dwarves"
        }
      ],
      playerId: "free-peoples"
    },
    {
      type: "base",
      time: 284,
      playerId: "shadow",
      actions: [
        {
          type: "army-advance"
        }
      ]
    },
    {
      type: "base",
      time: 285,
      playerId: "free-peoples",
      actions: [
        {
          cards: ["fpcha24", "fpstr04"],
          type: "card-draw"
        }
      ]
    },
    {
      type: "base",
      time: 285,
      actions: [
        {
          cards: ["scha24", "sstr11"],
          type: "card-draw"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 286,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          cards: ["fpstr04"],
          type: "card-discard"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [],
      type: "base",
      time: 287
    },
    {
      time: 288,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          dice: ["event", "character", "character", "will-of-the-west", "character"],
          type: "action-roll"
        }
      ],
      type: "base",
      time: 289
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "action-roll",
          dice: [
            "eye",
            "army",
            "event",
            "muster",
            "muster-army",
            "army",
            "muster-army",
            "eye",
            "character"
          ]
        }
      ],
      type: "base",
      time: 289
    },
    {
      time: 290,
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      die: "character",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          tiles: ["3"],
          type: "hunt-tile-draw"
        }
      ],
      time: 291,
      type: "base"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          characters: ["gimli"],
          type: "character-elimination"
        },
        {
          quantity: 1,
          type: "fellowship-corruption"
        }
      ],
      time: 292,
      type: "base"
    },
    {
      playerId: "shadow",
      type: "die",
      time: 293,
      die: "army",
      actions: [
        {
          fromRegion: "vale-of-the-carnen",
          toRegion: "iron-hills",
          type: "army-attack"
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
      time: 294,
      type: "base"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 295,
      type: "base"
    },
    {
      time: 296,
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
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [5, 5, 1]
        }
      ],
      type: "base",
      time: 296
    },
    {
      type: "base",
      time: 297,
      playerId: "shadow",
      actions: [
        {
          quantity: 1,
          type: "regular-unit-elimination",
          nation: "southrons",
          region: "vale-of-the-carnen"
        }
      ]
    },
    {
      actions: [
        {
          quantity: 1,
          type: "regular-unit-elimination",
          nation: "dwarves",
          region: "iron-hills"
        }
      ],
      playerId: "free-peoples",
      time: 298,
      type: "base"
    },
    {
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 299
    },
    {
      time: 300,
      type: "die",
      die: "character",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          tiles: ["r1rs"],
          type: "hunt-tile-draw"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 301
    },
    {
      time: 302,
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "fellowship-corruption"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      type: "die",
      time: 303,
      actions: [
        {
          fromRegion: "woodland-realm",
          type: "army-attack",
          toRegion: "woodland-realm"
        }
      ],
      die: "army"
    },
    {
      actions: [
        {
          card: "scha09",
          type: "combat-card-choose"
        }
      ],
      playerId: "shadow",
      time: 304,
      type: "base"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      time: 305,
      type: "base"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [1, 4, 4, 3, 6]
        }
      ],
      playerId: "free-peoples",
      time: 306,
      type: "base"
    },
    {
      type: "base",
      time: 306,
      actions: [
        {
          dice: [4, 4, 1, 5, 5],
          type: "combat-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      time: 307,
      actions: [
        {
          type: "combat-re-roll",
          dice: [1, 6, 6, 5, 4]
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          quantity: 1,
          type: "regular-unit-elimination",
          nation: "sauron",
          region: "woodland-realm"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 308
    },
    {
      actions: [
        {
          region: "woodland-realm",
          nation: "elves",
          type: "elite-unit-elimination",
          quantity: 1
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 309
    },
    {
      type: "base",
      time: 310,
      playerId: "shadow",
      actions: [
        {
          region: "woodland-realm",
          type: "battle-cease"
        }
      ]
    },
    {
      actions: [
        {
          cards: ["scha18"],
          type: "card-draw"
        }
      ],
      time: 311,
      character: "the-witch-king",
      type: "character-effect",
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "die",
      time: 312,
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      die: "character"
    },
    {
      type: "die",
      time: 313,
      die: "muster-army",
      actions: [
        {
          type: "army-attack",
          toRegion: "woodland-realm",
          fromRegion: "woodland-realm"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 314,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          card: "sstr11",
          type: "combat-card-choose"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          card: "fpcha18",
          type: "combat-card-choose"
        }
      ],
      time: 315,
      type: "base"
    },
    {
      type: "combat-card-effect",
      time: 316,
      actions: [
        {
          nation: "sauron",
          region: "woodland-realm",
          quantity: 2,
          type: "regular-unit-elimination"
        }
      ],
      card: "sstr11",
      playerId: "shadow"
    },
    {
      time: 317,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: [4, 4, 3, 5],
          type: "combat-roll"
        }
      ]
    },
    {
      type: "base",
      time: 317,
      actions: [
        {
          dice: [5, 1, 2, 6, 3],
          type: "combat-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-re-roll",
          dice: [5]
        }
      ],
      time: 318,
      type: "base"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [5, 5, 4]
        }
      ],
      type: "base",
      time: 318
    },
    {
      card: "fpcha18",
      playerId: "free-peoples",
      type: "combat-card-effect",
      time: 319,
      actions: [
        {
          nation: "elves",
          region: "woodland-realm",
          quantity: 1,
          type: "leader-elimination"
        }
      ]
    },
    {
      actions: [
        {
          region: "woodland-realm",
          nation: "sauron",
          type: "elite-unit-elimination",
          quantity: 1
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 320
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          quantity: 1,
          type: "regular-unit-elimination",
          nation: "elves",
          region: "woodland-realm"
        }
      ],
      type: "base",
      time: 321
    },
    {
      type: "base",
      time: 322,
      playerId: "shadow",
      actions: [
        {
          nation: "sauron",
          region: "woodland-realm",
          quantity: 1,
          type: "elite-unit-downgrade"
        },
        {
          region: "woodland-realm",
          type: "battle-continue"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          cards: ["sstr02"],
          type: "card-draw"
        }
      ],
      time: 323,
      character: "the-witch-king",
      type: "character-effect"
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 324
    },
    {
      type: "base",
      time: 325,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      type: "base",
      time: 326,
      actions: [
        {
          dice: [4, 1, 3],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [3, 6, 2, 6, 1],
          type: "combat-roll"
        }
      ],
      type: "base",
      time: 326
    },
    {
      actions: [
        {
          dice: [6, 3, 4],
          type: "combat-re-roll"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 327
    },
    {
      type: "base",
      time: 328,
      actions: [
        {
          nation: "elves",
          region: "woodland-realm",
          quantity: 3,
          type: "regular-unit-elimination"
        }
      ],
      playerId: "free-peoples"
    },
    {
      die: "event",
      actions: [
        {
          cards: ["fpcha15"],
          type: "card-draw"
        }
      ],
      time: 329,
      type: "die",
      playerId: "free-peoples"
    },
    {
      card: "scha24",
      playerId: "shadow",
      type: "die-card",
      time: 330,
      die: "event",
      actions: [
        {
          type: "nazgul-movement",
          toRegion: "erebor",
          fromRegion: "woodland-realm",
          nNazgul: 4
        },
        {
          type: "character-movement",
          toRegion: "erebor",
          fromRegion: "woodland-realm",
          characters: ["the-witch-king"]
        },
        {
          fromRegion: "erebor",
          toRegion: "erebor",
          type: "army-attack"
        }
      ]
    },
    {
      type: "base",
      time: 331,
      actions: [
        {
          type: "combat-card-choose",
          card: "sstr18"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      time: 332,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      type: "combat-card-effect",
      time: 333,
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 2,
          region: "erebor",
          nation: "sauron"
        }
      ],
      card: "sstr18",
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [2, 6, 3, 5, 5]
        }
      ],
      time: 334,
      type: "base"
    },
    {
      time: 334,
      type: "base",
      actions: [
        {
          dice: [5, 2, 6, 5, 4],
          type: "combat-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "combat-re-roll",
          dice: [6, 3]
        }
      ],
      playerId: "free-peoples",
      time: 335,
      type: "base"
    },
    {
      type: "base",
      time: 335,
      actions: [
        {
          dice: [1],
          type: "combat-re-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 336,
      type: "base",
      actions: [
        {
          type: "elite-unit-downgrade",
          quantity: 2,
          region: "erebor",
          nation: "southrons"
        },
        {
          region: "erebor",
          nation: "southrons",
          type: "regular-unit-elimination",
          quantity: 2
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          region: "erebor",
          nation: "dwarves",
          type: "elite-unit-downgrade",
          quantity: 3
        },
        {
          quantity: 1,
          type: "elite-unit-downgrade",
          nation: "north",
          region: "erebor"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 337
    },
    {
      playerId: "shadow",
      actions: [
        {
          region: "erebor",
          type: "battle-cease"
        }
      ],
      time: 338,
      type: "base"
    },
    {
      actions: [
        {
          cards: ["sstr17"],
          type: "card-draw"
        }
      ],
      time: 339,
      character: "the-witch-king",
      type: "character-effect",
      playerId: "shadow"
    },
    {
      type: "die-pass",
      time: 340,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          toRegion: "dale",
          type: "army-movement",
          fromRegion: "woodland-realm"
        },
        {
          fromRegion: "iron-hills",
          toRegion: "dale",
          type: "army-movement"
        }
      ],
      die: "muster",
      time: 341,
      character: "the-mouth-of-sauron",
      type: "die",
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 342
    },
    {
      type: "die",
      time: 343,
      actions: [
        {
          toRegion: "erebor",
          leftUnits: {
            elites: [],
            regulars: [
              {
                quantity: 3,
                nation: "sauron"
              }
            ],
            nNazgul: 0,
            front: "shadow",
            characters: []
          },
          type: "army-movement",
          fromRegion: "dale"
        },
        {
          fromRegion: "old-forest-road",
          type: "army-movement",
          toRegion: "dale"
        }
      ],
      die: "muster-army",
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      die: "will-of-the-west",
      time: 344,
      type: "die"
    },
    {
      time: 345,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          tiles: ["3"],
          type: "hunt-tile-draw"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-reveal-in-mordor"
        },
        {
          quantity: 2,
          type: "fellowship-corruption"
        }
      ],
      time: 346,
      type: "base"
    },
    {
      playerId: "shadow",
      time: 347,
      type: "die",
      actions: [
        {
          toRegion: "erebor",
          type: "army-attack",
          fromRegion: "erebor"
        }
      ],
      die: "character"
    },
    {
      type: "base",
      time: 348,
      actions: [
        {
          type: "combat-card-choose",
          card: "sstr17"
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
      playerId: "free-peoples",
      time: 349,
      type: "base"
    },
    {
      actions: [
        {
          dice: [4, 4, 2, 1, 5],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples",
      time: 350,
      type: "base"
    },
    {
      time: 350,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [4, 5, 5, 2, 3]
        }
      ]
    },
    {
      type: "base",
      time: 351,
      actions: [
        {
          dice: [2, 3, 2],
          type: "combat-re-roll"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [4, 2, 5, 2, 6]
        }
      ],
      time: 351,
      type: "base"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 1,
          region: "erebor",
          nation: "southrons"
        }
      ],
      time: 352,
      type: "base"
    },
    {
      time: 353,
      type: "base",
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 1,
          region: "erebor",
          nation: "dwarves"
        }
      ],
      playerId: "free-peoples"
    },
    {
      card: "sstr17",
      playerId: "free-peoples",
      type: "combat-card-effect",
      time: 354,
      actions: [
        {
          quantity: 1,
          type: "regular-unit-elimination",
          nation: "north",
          region: "erebor"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          region: "erebor",
          nation: "southrons",
          type: "elite-unit-downgrade",
          quantity: 1
        },
        {
          region: "erebor",
          type: "battle-continue"
        }
      ],
      type: "base",
      time: 355
    },
    {
      time: 356,
      character: "the-witch-king",
      type: "character-effect",
      actions: [
        {
          cards: ["sstr03"],
          type: "card-draw"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "combat-card-choose",
          card: "sstr02"
        }
      ],
      playerId: "shadow",
      time: 357,
      type: "base"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      time: 358
    },
    {
      time: 359,
      type: "base",
      actions: [
        {
          dice: [4, 4, 4],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [6, 5, 2, 4, 1],
          type: "combat-roll"
        }
      ],
      type: "base",
      time: 359
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          dice: [6, 4, 2],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      time: 360
    },
    {
      type: "base",
      time: 360,
      actions: [
        {
          type: "combat-re-roll",
          dice: [5, 1, 5, 3]
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      time: 361,
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 1,
          region: "erebor",
          nation: "southrons"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      time: 362,
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 1,
          region: "erebor",
          nation: "dwarves"
        }
      ],
      playerId: "free-peoples"
    },
    {
      card: "sstr02",
      playerId: "shadow",
      time: 363,
      type: "combat-card-effect",
      actions: [
        {
          region: "erebor",
          nation: "southrons",
          type: "regular-unit-elimination",
          quantity: 2
        },
        {
          type: "elite-unit-elimination",
          quantity: 1,
          region: "erebor",
          nation: "sauron"
        }
      ]
    },
    {
      time: 364,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [5, 4, 5]
        }
      ]
    },
    {
      actions: [
        {
          quantity: 1,
          type: "regular-unit-elimination",
          nation: "north",
          region: "erebor"
        },
        {
          nation: "dwarves",
          region: "erebor",
          quantity: 1,
          type: "regular-unit-elimination"
        },
        {
          nation: "dwarves",
          region: "erebor",
          quantity: 2,
          type: "leader-elimination"
        },
        {
          nation: "north",
          region: "erebor",
          quantity: 1,
          type: "leader-elimination"
        }
      ],
      type: "card-effect",
      time: 365,
      playerId: "free-peoples",
      card: "sstr02"
    }
  ]
};
