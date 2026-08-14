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
      time: 1,
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha09", "fpstr24"]
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          cards: ["scha12", "sstr14"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 1
    },
    {
      playerId: "free-peoples",
      time: 2,
      type: "base",
      actions: []
    },
    {
      type: "base",
      time: 3,
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      time: 4,
      playerId: "free-peoples",
      actions: [
        {
          dice: ["character", "character", "muster", "will-of-the-west"],
          type: "action-roll"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: ["eye", "muster", "character", "character", "muster", "event"],
          type: "action-roll"
        }
      ],
      time: 4,
      type: "base"
    },
    {
      playerId: "free-peoples",
      time: 5,
      type: "die-pass"
    },
    {
      playerId: "shadow",
      type: "die",
      time: 6,
      die: "event",
      actions: [
        {
          type: "card-draw",
          cards: ["scha18"]
        }
      ]
    },
    {
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      playerId: "free-peoples",
      die: "character",
      time: 7,
      type: "die"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "hunt-roll",
          dice: [6, 4]
        }
      ],
      time: 8,
      type: "base"
    },
    {
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["er"]
        }
      ],
      type: "base",
      time: 9,
      playerId: "shadow"
    },
    {
      actions: [
        {
          characters: ["gandalf-the-grey"],
          type: "character-elimination"
        },
        {
          companion: "strider",
          type: "fellowship-guide"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 10
    },
    {
      time: 11,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          region: "fords-of-bruinen",
          type: "fellowship-reveal"
        }
      ]
    },
    {
      card: "scha12",
      die: "character",
      type: "die-card",
      time: 12,
      playerId: "shadow",
      actions: [
        {
          type: "fellowship-corruption",
          quantity: 2
        }
      ]
    },
    {
      die: "character",
      playerId: "free-peoples",
      time: 13,
      type: "die",
      actions: [
        {
          type: "fellowship-hide"
        }
      ]
    },
    {
      type: "die",
      time: 14,
      die: "muster",
      actions: [
        {
          nation: "isengard",
          type: "political-advance",
          quantity: 1
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      die: "muster",
      actions: [
        {
          type: "elite-unit-recruitment",
          region: "woodland-realm",
          quantity: 1,
          nation: "elves"
        },
        {
          type: "card-draw",
          cards: ["fpstr15"]
        }
      ],
      time: 15,
      type: "die-card",
      card: "fpstr24"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "nazgul-movement",
          fromRegion: "barad-dur",
          nNazgul: 1,
          toRegion: "fords-of-bruinen"
        },
        {
          fromRegion: "minas-morgul",
          toRegion: "dol-guldur",
          type: "nazgul-movement",
          nNazgul: 1
        },
        {
          nNazgul: 1,
          toRegion: "dol-guldur",
          fromRegion: "morannon",
          type: "nazgul-movement"
        }
      ],
      die: "character",
      type: "die",
      time: 16
    },
    {
      type: "die",
      time: 17,
      playerId: "free-peoples",
      die: "will-of-the-west",
      actions: [
        {
          quantity: 1,
          nation: "elves",
          type: "political-advance"
        }
      ]
    },
    {
      die: "muster",
      playerId: "shadow",
      type: "die",
      time: 18,
      actions: [
        {
          characters: ["saruman"],
          type: "character-play",
          region: "orthanc"
        }
      ]
    },
    {
      time: 19,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          cards: ["fpcha07", "fpstr12"],
          type: "card-draw"
        }
      ]
    },
    {
      type: "base",
      time: 19,
      playerId: "shadow",
      actions: [
        {
          type: "card-draw",
          cards: ["scha22", "sstr16"]
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [],
      type: "base",
      time: 20
    },
    {
      playerId: "shadow",
      actions: [
        {
          quantity: 2,
          type: "hunt-allocation"
        }
      ],
      time: 21,
      type: "base"
    },
    {
      type: "base",
      time: 22,
      actions: [
        {
          type: "action-roll",
          dice: ["character", "event", "will-of-the-west", "character"]
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: ["muster", "character", "character", "muster", "muster-army", "event"],
          type: "action-roll"
        }
      ],
      time: 22,
      type: "base"
    },
    {
      playerId: "free-peoples",
      type: "die",
      time: 23,
      actions: [
        {
          region: "fangorn",
          type: "character-play",
          characters: ["gandalf-the-white"]
        }
      ],
      die: "will-of-the-west"
    },
    {
      card: "sstr16",
      type: "die-card",
      time: 24,
      die: "event",
      actions: [
        {
          quantity: 2,
          region: "orthanc",
          nation: "isengard",
          type: "elite-unit-recruitment"
        },
        {
          quantity: 2,
          type: "regular-unit-recruitment",
          region: "north-dunland",
          nation: "isengard"
        },
        {
          type: "regular-unit-recruitment",
          quantity: 2,
          nation: "isengard",
          region: "south-dunland"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 25
    },
    {
      time: 26,
      type: "die",
      die: "muster-army",
      playerId: "shadow",
      actions: [
        {
          type: "army-movement",
          fromRegion: "north-dunland",
          toRegion: "moria"
        },
        {
          toRegion: "south-anduin-vale",
          fromRegion: "dol-guldur",
          type: "army-movement",
          leftUnits: {
            regulars: [
              {
                nation: "sauron",
                quantity: 1
              }
            ],
            elites: [],
            nNazgul: 0,
            front: "shadow"
          }
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 27
    },
    {
      card: "scha22",
      actions: [
        {
          card: "scha22",
          type: "card-play-on-table"
        }
      ],
      time: 28,
      type: "die-card",
      die: "character",
      playerId: "shadow"
    },
    {
      die: "character",
      actions: [
        {
          card: "fpcha07",
          type: "card-play-on-table"
        }
      ],
      card: "fpcha07",
      playerId: "free-peoples",
      type: "die-card",
      time: 29
    },
    {
      playerId: "shadow",
      actions: [
        {
          quantity: 1,
          type: "political-advance",
          nation: "sauron"
        }
      ],
      die: "muster",
      time: 30,
      type: "die"
    },
    {
      die: "character",
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      time: 31,
      type: "die"
    },
    {
      playerId: "shadow",
      type: "base",
      time: 32,
      actions: [
        {
          type: "hunt-roll",
          dice: [1, 1]
        }
      ]
    },
    {
      playerId: "shadow",
      type: "base",
      time: 33,
      actions: [
        {
          type: "hunt-re-roll",
          dice: [3]
        }
      ]
    },
    {
      playerId: "shadow",
      type: "die",
      time: 34,
      character: "saruman",
      die: "muster",
      actions: [
        {
          type: "regular-unit-upgrade",
          quantity: 2,
          region: "orthanc",
          nation: "isengard"
        }
      ]
    },
    {
      card: "fpcha09",
      die: "event",
      playerId: "free-peoples",
      type: "die-card",
      time: 35,
      actions: [
        {
          type: "combat-roll",
          dice: [6, 2, 3]
        }
      ]
    },
    {
      die: "character",
      type: "die",
      time: 36,
      actions: [
        {
          fromRegion: "south-anduin-vale",
          type: "army-movement",
          toRegion: "dimrill-dale"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 37,
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha08", "fpstr16"]
        }
      ]
    },
    {
      time: 37,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          cards: ["scha08", "sstr17"],
          type: "card-draw"
        }
      ]
    },
    {
      time: 38,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          region: "hollin",
          type: "fellowship-declare"
        }
      ]
    },
    {
      playerId: "shadow",
      time: 39,
      type: "base",
      actions: [
        {
          type: "hunt-allocation",
          quantity: 3
        }
      ]
    },
    {
      time: 40,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: ["character", "character", "character", "muster-army", "will-of-the-west"],
          type: "action-roll"
        }
      ]
    },
    {
      actions: [
        {
          dice: ["character", "muster", "event", "eye", "muster-army"],
          type: "action-roll"
        }
      ],
      type: "base",
      time: 40,
      playerId: "shadow"
    },
    {
      type: "die",
      time: 41,
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      playerId: "free-peoples",
      die: "character"
    },
    {
      actions: [
        {
          type: "hunt-roll",
          dice: [3, 3, 2, 3]
        }
      ],
      time: 42,
      type: "base",
      playerId: "shadow"
    },
    {
      playerId: "shadow",
      time: 43,
      type: "die",
      die: "muster-army",
      actions: [
        {
          type: "army-movement",
          toRegion: "dimrill-dale",
          fromRegion: "moria"
        },
        {
          type: "army-movement",
          fromRegion: "barad-dur",
          toRegion: "gorgoroth"
        }
      ]
    },
    {
      actions: [
        {
          type: "elite-unit-recruitment",
          region: "edoras",
          quantity: 1,
          nation: "rohan"
        },
        {
          quantity: 1,
          type: "leader-recruitment",
          region: "edoras",
          nation: "rohan"
        }
      ],
      die: "muster-army",
      card: "fpstr16",
      playerId: "free-peoples",
      type: "die-card",
      time: 44
    },
    {
      die: "muster",
      actions: [
        {
          region: "dol-guldur",
          type: "nazgul-recruitment",
          quantity: 1
        },
        {
          type: "nazgul-recruitment",
          quantity: 1,
          region: "moria"
        }
      ],
      time: 45,
      type: "die",
      playerId: "shadow"
    },
    {
      die: "character",
      type: "die",
      time: 46,
      playerId: "free-peoples",
      actions: [
        {
          companions: ["strider", "legolas", "meriadoc"],
          type: "companion-separation",
          toRegion: "druwaith-iaur"
        },
        {
          type: "fellowship-guide",
          companion: "gimli"
        }
      ]
    },
    {
      card: "scha08",
      die: "event",
      actions: [
        {
          type: "combat-roll",
          dice: [5, 6, 2]
        }
      ],
      time: 47,
      type: "die-card",
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "character-movement",
          fromRegion: "druwaith-iaur",
          toRegion: "dol-amroth",
          characters: ["strider"]
        },
        {
          characters: ["gandalf-the-white"],
          type: "character-movement",
          toRegion: "narrows-of-the-forest",
          fromRegion: "fangorn"
        },
        {
          characters: ["legolas", "meriadoc"],
          toRegion: "helms-deep",
          fromRegion: "druwaith-iaur",
          type: "character-movement"
        }
      ],
      playerId: "free-peoples",
      die: "character",
      time: 48,
      type: "die"
    },
    {
      actions: [
        {
          fromRegion: "fords-of-bruinen",
          type: "nazgul-movement",
          nNazgul: 1,
          toRegion: "hollin"
        },
        {
          nNazgul: 1,
          fromRegion: "dol-guldur",
          toRegion: "dimrill-dale",
          type: "nazgul-movement"
        },
        {
          fromRegion: "moria",
          type: "nazgul-movement",
          toRegion: "dimrill-dale",
          nNazgul: 1
        }
      ],
      die: "character",
      time: 49,
      type: "die",
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "character-play",
          region: "dol-amroth",
          characters: ["aragorn"]
        }
      ],
      die: "will-of-the-west",
      playerId: "free-peoples",
      time: 50,
      type: "die"
    },
    {
      type: "base",
      time: 51,
      playerId: "free-peoples",
      actions: [
        {
          cards: ["fpcha22", "fpstr17"],
          type: "card-draw"
        }
      ]
    },
    {
      playerId: "shadow",
      type: "base",
      time: 51,
      actions: [
        {
          type: "card-draw",
          cards: ["scha24", "sstr18"]
        }
      ]
    },
    {
      time: 52,
      type: "base",
      playerId: "free-peoples",
      actions: []
    },
    {
      playerId: "shadow",
      actions: [
        {
          quantity: 2,
          type: "hunt-allocation"
        }
      ],
      type: "base",
      time: 53
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 54,
      actions: [
        {
          dice: ["character", "muster-army", "character", "event", "muster-army", "character"],
          type: "action-roll"
        }
      ]
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: ["army", "character", "event", "army", "muster-army", "character"]
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 54
    },
    {
      actions: [
        {
          nation: "rohan",
          quantity: 1,
          type: "political-advance"
        }
      ],
      playerId: "free-peoples",
      time: 55,
      type: "die",
      die: "muster-army"
    },
    {
      die: "event",
      actions: [
        {
          type: "regular-unit-recruitment",
          quantity: 5,
          nation: "sauron",
          region: "minas-morgul"
        },
        {
          region: "minas-morgul",
          quantity: 1,
          type: "nazgul-recruitment"
        }
      ],
      card: "sstr18",
      type: "die-card",
      time: 56,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          characters: ["legolas"],
          toRegion: "fangorn",
          type: "character-movement",
          fromRegion: "helms-deep"
        },
        {
          characters: ["gandalf-the-white"],
          type: "character-movement",
          toRegion: "dale",
          fromRegion: "narrows-of-the-forest"
        },
        {
          type: "character-movement",
          fromRegion: "dol-amroth",
          toRegion: "osgiliath",
          characters: ["aragorn"]
        }
      ],
      die: "character",
      type: "die",
      time: 57
    },
    {
      actions: [
        {
          type: "army-movement",
          fromRegion: "minas-morgul",
          toRegion: "north-ithilien"
        },
        {
          toRegion: "gorgoroth",
          type: "army-movement",
          fromRegion: "nurn"
        }
      ],
      playerId: "shadow",
      die: "army",
      type: "die",
      time: 58
    },
    {
      time: 59,
      type: "die",
      die: "muster-army",
      actions: [
        {
          type: "political-advance",
          quantity: 1,
          nation: "gondor"
        }
      ],
      playerId: "free-peoples"
    },
    {
      time: 60,
      type: "die",
      actions: [
        {
          fromRegion: "dimrill-dale",
          toRegion: "lorien",
          type: "army-attack"
        }
      ],
      die: "character",
      playerId: "shadow"
    },
    {
      type: "base",
      time: 61,
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
      time: 62,
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "shadow"
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
          cards: ["fpstr22"],
          type: "card-draw"
        }
      ],
      die: "event",
      playerId: "free-peoples",
      card: "fpstr15",
      time: 63,
      type: "die-card"
    },
    {
      type: "die",
      time: 64,
      playerId: "shadow",
      actions: [
        {
          toRegion: "lorien",
          fromRegion: "lorien",
          type: "army-attack"
        }
      ],
      die: "character"
    },
    {
      time: 65,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          card: "sstr17",
          type: "combat-card-choose"
        }
      ]
    },
    {
      actions: [
        {
          type: "combat-card-choose",
          card: "fpstr22"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 66
    },
    {
      type: "base",
      time: 67,
      actions: [
        {
          dice: [1, 5, 1, 4],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [4, 5, 4, 6, 5]
        }
      ],
      type: "base",
      time: 67,
      playerId: "shadow"
    },
    {
      type: "base",
      time: 68,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-re-roll",
          dice: [4]
        }
      ]
    },
    {
      type: "base",
      time: 68,
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [6, 6, 2, 2]
        }
      ]
    },
    {
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 2,
          nation: "sauron",
          region: "lorien"
        }
      ],
      type: "base",
      time: 69,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "elite-unit-downgrade",
          region: "lorien",
          quantity: 1,
          nation: "elves"
        },
        {
          quantity: 1,
          type: "elite-unit-elimination",
          nation: "elves",
          region: "lorien"
        }
      ],
      type: "base",
      time: 70
    },
    {
      playerId: "free-peoples",
      card: "sstr17",
      actions: [
        {
          quantity: 1,
          nation: "elves",
          type: "regular-unit-elimination",
          region: "lorien"
        }
      ],
      type: "combat-card-effect",
      time: 71
    },
    {
      actions: [
        {
          region: "lorien",
          type: "battle-cease"
        }
      ],
      time: 72,
      type: "base",
      playerId: "shadow"
    },
    {
      time: 73,
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
      actions: [
        {
          type: "hunt-roll",
          dice: [5, 2]
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 74
    },
    {
      actions: [
        {
          dice: [2],
          type: "hunt-re-roll"
        }
      ],
      playerId: "shadow",
      time: 75,
      type: "base"
    },
    {
      time: 76,
      type: "die",
      actions: [
        {
          characters: ["the-witch-king"],
          type: "character-play",
          region: "lorien"
        }
      ],
      die: "muster-army",
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      die: "character",
      time: 77,
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [1, 4],
          type: "hunt-roll"
        }
      ],
      type: "base",
      time: 78
    },
    {
      playerId: "shadow",
      time: 79,
      type: "base",
      actions: [
        {
          type: "hunt-re-roll",
          dice: [5]
        }
      ]
    },
    {
      type: "base",
      time: 80,
      actions: [
        {
          tiles: ["1r"],
          type: "hunt-tile-draw"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      time: 81,
      actions: [
        {
          type: "card-discard-from-table",
          card: "fpcha07"
        }
      ],
      playerId: "free-peoples"
    },
    {
      type: "base",
      time: 82,
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-reveal",
          region: "south-anduin-vale"
        }
      ]
    },
    {
      actions: [
        {
          tiles: ["1r"],
          type: "hunt-tile-draw"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 83
    },
    {
      playerId: "free-peoples",
      time: 84,
      type: "base",
      actions: [
        {
          companions: ["gimli"],
          type: "companion-random"
        }
      ]
    },
    {
      actions: [
        {
          type: "character-elimination",
          characters: ["gimli"]
        },
        {
          type: "fellowship-guide",
          companion: "boromir"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 85
    },
    {
      time: 86,
      type: "die",
      playerId: "shadow",
      die: "army",
      actions: [
        {
          toRegion: "minas-morgul",
          fromRegion: "gorgoroth",
          type: "army-movement"
        },
        {
          fromRegion: "dol-guldur",
          type: "army-movement",
          toRegion: "south-anduin-vale"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha12", "fpstr13"]
        }
      ],
      type: "base",
      time: 87
    },
    {
      playerId: "shadow",
      time: 87,
      type: "base",
      actions: [
        {
          type: "card-draw",
          cards: ["scha14", "sstr02"]
        }
      ]
    },
    {
      actions: [],
      time: 88,
      type: "base",
      playerId: "free-peoples"
    },
    {
      type: "base",
      time: 89,
      playerId: "shadow",
      actions: [
        {
          type: "hunt-allocation",
          quantity: 2
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 90,
      actions: [
        {
          dice: ["will-of-the-west", "muster", "event", "event", "muster-army", "muster-army"],
          type: "action-roll"
        }
      ]
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: ["eye", "event", "army", "muster", "character", "muster", "character"]
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 90
    },
    {
      die: "will-of-the-west",
      playerId: "free-peoples",
      type: "die",
      time: 91,
      actions: [
        {
          type: "fellowship-hide"
        }
      ]
    },
    {
      card: "scha24",
      time: 92,
      type: "die-card",
      die: "event",
      actions: [
        {
          nNazgul: 1,
          type: "nazgul-movement",
          toRegion: "south-anduin-vale",
          fromRegion: "hollin"
        },
        {
          fromRegion: "north-ithilien",
          nNazgul: 1,
          type: "nazgul-movement",
          toRegion: "western-brown-lands"
        },
        {
          fromRegion: "lorien",
          toRegion: "lorien",
          type: "army-attack"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 93,
      type: "base",
      actions: [
        {
          type: "combat-card-choose",
          card: "sstr02"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 94,
      type: "base",
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
          type: "combat-roll",
          dice: [4, 6]
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 95
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [6, 1, 5, 4, 1]
        }
      ],
      type: "base",
      time: 95
    },
    {
      actions: [
        {
          dice: [6],
          type: "combat-re-roll"
        }
      ],
      time: 96,
      type: "base",
      playerId: "free-peoples"
    },
    {
      type: "base",
      time: 96,
      playerId: "shadow",
      actions: [
        {
          dice: [4, 2, 4, 5],
          type: "combat-re-roll"
        }
      ]
    },
    {
      time: 97,
      type: "base",
      actions: [
        {
          type: "regular-unit-elimination",
          region: "lorien",
          nation: "sauron",
          quantity: 2
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      time: 98,
      playerId: "free-peoples",
      actions: [
        {
          nation: "elves",
          region: "lorien",
          quantity: 1,
          type: "elite-unit-downgrade"
        }
      ]
    },
    {
      type: "combat-card-effect",
      time: 99,
      playerId: "shadow",
      card: "sstr02",
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 1,
          nation: "isengard",
          region: "lorien"
        },
        {
          nation: "sauron",
          quantity: 1,
          region: "lorien",
          type: "elite-unit-elimination"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [5, 5, 2]
        }
      ],
      type: "base",
      time: 100
    },
    {
      type: "card-effect",
      time: 101,
      actions: [
        {
          quantity: 2,
          type: "regular-unit-elimination",
          nation: "elves",
          region: "lorien"
        },
        {
          region: "lorien",
          nation: "elves",
          quantity: 1,
          type: "leader-elimination"
        }
      ],
      card: "sstr02",
      playerId: "free-peoples"
    },
    {
      type: "character-effect",
      time: 102,
      actions: [
        {
          cards: ["sstr21"],
          type: "card-draw"
        }
      ],
      character: "the-witch-king",
      playerId: "shadow"
    },
    {
      time: 103,
      type: "die",
      die: "muster",
      actions: [
        {
          nation: "rohan",
          type: "political-advance",
          quantity: 1
        }
      ],
      playerId: "free-peoples"
    },
    {
      die: "character",
      playerId: "shadow",
      actions: [
        {
          toRegion: "north-ithilien",
          nNazgul: 5,
          fromRegion: "lorien",
          type: "nazgul-movement"
        },
        {
          characters: ["the-witch-king"],
          type: "character-movement",
          fromRegion: "lorien",
          toRegion: "north-ithilien"
        }
      ],
      type: "die",
      time: 104
    },
    {
      die: "muster-army",
      playerId: "free-peoples",
      type: "die",
      time: 105,
      actions: [
        {
          type: "political-advance",
          quantity: 1,
          nation: "rohan"
        }
      ]
    },
    {
      actions: [
        {
          type: "political-advance",
          quantity: 1,
          nation: "southrons"
        }
      ],
      die: "muster",
      type: "die",
      time: 106,
      playerId: "shadow"
    },
    {
      card: "fpcha12",
      die: "event",
      time: 107,
      type: "die-card",
      playerId: "free-peoples",
      actions: [
        {
          quantity: 1,
          type: "fellowship-heal"
        }
      ]
    },
    {
      die: "muster",
      actions: [
        {
          quantity: 1,
          nation: "southrons",
          type: "political-advance"
        }
      ],
      playerId: "shadow",
      type: "die",
      time: 108
    },
    {
      elvenRing: {
        toDie: "character",
        fromDie: "event",
        ring: "narya"
      },
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      die: "character",
      time: 109,
      type: "die",
      playerId: "free-peoples"
    },
    {
      type: "base",
      time: 110,
      playerId: "shadow",
      actions: [
        {
          dice: [5, 2, 2],
          type: "hunt-roll"
        }
      ]
    },
    {
      playerId: "shadow",
      type: "base",
      time: 111,
      actions: [
        {
          dice: [3, 1],
          type: "hunt-re-roll"
        }
      ]
    },
    {
      playerId: "shadow",
      die: "army",
      actions: [
        {
          type: "army-movement",
          fromRegion: "minas-morgul",
          toRegion: "south-ithilien"
        },
        {
          fromRegion: "morannon",
          type: "army-movement",
          toRegion: "gorgoroth"
        }
      ],
      time: 112,
      type: "die"
    },
    {
      die: "muster-army",
      actions: [
        {
          quantity: 1,
          nation: "rohan",
          region: "westemnet",
          type: "elite-unit-recruitment"
        }
      ],
      playerId: "free-peoples",
      type: "die",
      time: 113
    },
    {
      playerId: "shadow",
      type: "die",
      time: 114,
      die: "character",
      actions: [
        {
          type: "army-attack",
          toRegion: "osgiliath",
          fromRegion: "north-ithilien"
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
      time: 115,
      type: "base"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          card: "fpstr17",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      time: 116
    },
    {
      card: "fpstr17",
      time: 117,
      type: "combat-card-effect",
      playerId: "free-peoples",
      actions: [
        {
          toRegion: "minas-tirith",
          type: "army-retreat"
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
      time: 118,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 119,
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha06", "fpstr20"]
        }
      ]
    },
    {
      playerId: "shadow",
      time: 119,
      type: "base",
      actions: [
        {
          cards: ["scha04", "sstr20"],
          type: "card-draw"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [],
      type: "base",
      time: 120
    },
    {
      type: "base",
      time: 121,
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
      type: "base",
      time: 122,
      actions: [
        {
          type: "action-roll",
          dice: ["event", "muster-army", "character", "muster", "character", "character"]
        }
      ]
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: [
            "army",
            "muster-army",
            "character",
            "event",
            "muster",
            "character",
            "event",
            "event"
          ]
        }
      ],
      type: "base",
      time: 122,
      playerId: "shadow"
    },
    {
      type: "die",
      time: 123,
      actions: [
        {
          nation: "gondor",
          quantity: 1,
          type: "elite-unit-recruitment",
          region: "minas-tirith"
        }
      ],
      playerId: "free-peoples",
      die: "muster"
    },
    {
      actions: [
        {
          toRegion: "minas-tirith",
          type: "army-attack",
          fromRegion: "osgiliath"
        }
      ],
      die: "character",
      type: "die",
      time: 124,
      playerId: "shadow"
    },
    {
      actions: [
        {
          region: "minas-tirith",
          type: "army-retreat-into-siege"
        },
        {
          type: "regular-unit-disband",
          nation: "gondor",
          quantity: 2,
          region: "minas-tirith"
        }
      ],
      type: "base",
      time: 125,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "army-advance"
        }
      ],
      time: 126,
      type: "base"
    },
    {
      die: "muster-army",
      playerId: "free-peoples",
      type: "die",
      time: 127,
      actions: [
        {
          quantity: 1,
          region: "dol-amroth",
          type: "leader-recruitment",
          nation: "gondor"
        },
        {
          quantity: 1,
          region: "edoras",
          type: "regular-unit-recruitment",
          nation: "rohan"
        }
      ]
    },
    {
      die: "muster",
      type: "die",
      time: 128,
      actions: [
        {
          type: "regular-unit-recruitment",
          quantity: 1,
          nation: "isengard",
          region: "north-dunland"
        },
        {
          type: "regular-unit-recruitment",
          nation: "isengard",
          quantity: 1,
          region: "south-dunland"
        },
        {
          type: "regular-unit-recruitment",
          nation: "isengard",
          quantity: 1,
          region: "orthanc"
        }
      ],
      playerId: "shadow",
      character: "saruman"
    },
    {
      playerId: "free-peoples",
      time: 129,
      type: "die",
      actions: [
        {
          fromRegion: "edoras",
          type: "army-movement",
          toRegion: "westemnet"
        }
      ],
      die: "character"
    },
    {
      die: "army",
      playerId: "shadow",
      actions: [
        {
          fromRegion: "south-dunland",
          type: "army-movement",
          toRegion: "gap-of-rohan"
        },
        {
          type: "army-movement",
          toRegion: "osgiliath",
          fromRegion: "south-ithilien"
        }
      ],
      time: 130,
      type: "die"
    },
    {
      actions: [
        {
          quantity: 1,
          region: "the-shire",
          type: "elite-unit-recruitment",
          nation: "north"
        },
        {
          region: "ered-luin",
          quantity: 1,
          type: "elite-unit-recruitment",
          nation: "dwarves"
        },
        {
          cards: ["fpstr09"],
          type: "card-draw"
        }
      ],
      die: "event",
      card: "fpstr20",
      time: 131,
      type: "die-card",
      playerId: "free-peoples"
    },
    {
      type: "die-card",
      time: 132,
      actions: [
        {
          type: "hunt-tile-add",
          tile: "r1rs"
        }
      ],
      playerId: "shadow",
      card: "scha04",
      die: "event"
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 133
    },
    {
      actions: [
        {
          toRegion: "minas-tirith",
          type: "army-attack",
          fromRegion: "minas-tirith"
        }
      ],
      die: "character",
      playerId: "shadow",
      time: 134,
      type: "die"
    },
    {
      type: "base",
      time: 135,
      actions: [
        {
          type: "combat-card-choose",
          card: "sstr20"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 136,
      actions: [
        {
          type: "combat-card-choose",
          card: "fpcha22"
        }
      ]
    },
    {
      type: "combat-card-effect",
      time: 137,
      playerId: "free-peoples",
      card: "fpcha22",
      actions: [
        {
          type: "combat-roll",
          dice: [5, 1, 5]
        }
      ]
    },
    {
      playerId: "shadow",
      type: "combat-card-effect",
      time: 138,
      card: "fpcha22",
      actions: [
        {
          nation: "sauron",
          quantity: 2,
          type: "regular-unit-elimination",
          region: "minas-tirith"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          dice: [1, 5, 5, 4, 4],
          type: "combat-roll"
        }
      ],
      time: 139,
      type: "base"
    },
    {
      time: 139,
      type: "base",
      actions: [
        {
          dice: [1, 4, 4, 4, 1],
          type: "combat-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          dice: [1, 6, 5],
          type: "combat-re-roll"
        }
      ],
      time: 140,
      type: "base",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "combat-re-roll",
          dice: [3, 6, 4, 4, 4]
        }
      ],
      type: "base",
      time: 140,
      playerId: "shadow"
    },
    {
      time: 141,
      type: "base",
      actions: [
        {
          nation: "sauron",
          type: "regular-unit-elimination",
          region: "minas-tirith",
          quantity: 4
        }
      ],
      playerId: "shadow"
    },
    {
      time: 142,
      type: "base",
      actions: [
        {
          region: "minas-tirith",
          quantity: 1,
          type: "elite-unit-downgrade",
          nation: "gondor"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      type: "combat-card-effect-skip",
      time: 143,
      card: "sstr20"
    },
    {
      type: "character-effect",
      time: 144,
      actions: [
        {
          cards: ["sstr12"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      character: "the-witch-king"
    },
    {
      time: 145,
      type: "die-pass",
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "regular-unit-recruitment",
          nation: "southrons",
          region: "east-rhun",
          quantity: 5
        }
      ],
      die: "event",
      playerId: "shadow",
      card: "sstr21",
      type: "die-card",
      time: 146
    },
    {
      die: "character",
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      time: 147,
      type: "die"
    },
    {
      time: 148,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "hunt-roll",
          dice: [6]
        }
      ]
    },
    {
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["2"]
        }
      ],
      type: "base",
      time: 149,
      playerId: "shadow"
    },
    {
      type: "base",
      time: 150,
      playerId: "free-peoples",
      actions: [
        {
          type: "character-elimination",
          characters: ["boromir"]
        },
        {
          companion: "peregrin",
          type: "fellowship-guide"
        }
      ]
    },
    {
      actions: [
        {
          leftUnits: {
            regulars: [
              {
                nation: "sauron",
                quantity: 4
              }
            ],
            elites: [],
            front: "shadow"
          },
          type: "army-movement",
          fromRegion: "osgiliath",
          toRegion: "minas-tirith"
        },
        {
          toRegion: "east-rhun",
          fromRegion: "south-rhun",
          type: "army-movement"
        }
      ],
      die: "muster-army",
      type: "die",
      time: 151,
      playerId: "shadow"
    },
    {
      time: 152,
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      playerId: "free-peoples",
      die: "character"
    },
    {
      time: 153,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          dice: [6],
          type: "hunt-roll"
        }
      ]
    },
    {
      actions: [
        {
          tiles: ["1"],
          type: "hunt-tile-draw"
        }
      ],
      type: "base",
      time: 154,
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "companion-separation",
          companions: ["peregrin"],
          toRegion: "westemnet"
        }
      ],
      type: "base",
      time: 155,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          nation: "sauron",
          type: "elite-unit-recruitment",
          quantity: 1,
          region: "orthanc"
        }
      ],
      die: "event",
      time: 156,
      type: "die-card",
      card: "sstr14",
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 157,
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha21", "fpstr02"]
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "card-draw",
          cards: ["scha05", "sstr05"]
        }
      ],
      time: 157,
      type: "base"
    },
    {
      type: "base",
      time: 158,
      actions: [
        {
          type: "card-discard",
          cards: ["fpcha08"]
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          region: "noman-lands",
          type: "fellowship-declare"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 159
    },
    {
      playerId: "shadow",
      time: 160,
      type: "base",
      actions: [
        {
          quantity: 1,
          type: "hunt-allocation"
        }
      ]
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: ["character", "character", "will-of-the-west", "character", "character", "muster"]
        }
      ],
      type: "base",
      time: 161,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "action-roll",
          dice: ["event", "muster", "event", "army", "army", "muster", "eye", "eye"]
        }
      ],
      type: "base",
      time: 161,
      playerId: "shadow"
    },
    {
      time: 162,
      type: "die",
      die: "muster",
      actions: [
        {
          quantity: 1,
          region: "helms-deep",
          type: "elite-unit-recruitment",
          nation: "rohan"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["2"]
        }
      ],
      type: "die-card",
      time: 163,
      card: "scha05",
      die: "event",
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "fellowship-corruption",
          quantity: 2
        }
      ],
      type: "base",
      time: 164,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          nation: "rohan",
          quantity: 1,
          type: "elite-unit-recruitment",
          region: "helms-deep"
        }
      ],
      type: "die",
      time: 165,
      playerId: "free-peoples",
      die: "will-of-the-west"
    },
    {
      playerId: "shadow",
      actions: [
        {
          fromRegion: "minas-tirith",
          toRegion: "minas-tirith",
          type: "army-attack"
        }
      ],
      type: "die",
      time: 166,
      die: "army"
    },
    {
      actions: [
        {
          card: "sstr12",
          type: "combat-card-choose"
        }
      ],
      type: "base",
      time: 167,
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 168,
      actions: [
        {
          card: "fpstr02",
          type: "combat-card-choose"
        }
      ]
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [3, 6, 5, 2, 1]
        }
      ],
      type: "base",
      time: 169,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          dice: [3, 2, 3, 6, 1],
          type: "combat-roll"
        }
      ],
      type: "base",
      playerId: "shadow",
      time: 169
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          dice: [5, 2, 1],
          type: "combat-re-roll"
        }
      ],
      time: 170,
      type: "base"
    },
    {
      type: "base",
      time: 170,
      actions: [
        {
          type: "combat-re-roll",
          dice: [2, 3, 4, 2]
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "shadow",
      type: "base",
      time: 171,
      actions: [
        {
          region: "minas-tirith",
          quantity: 3,
          nation: "sauron",
          type: "regular-unit-elimination"
        }
      ]
    },
    {
      type: "base",
      time: 172,
      actions: [
        {
          quantity: 1,
          type: "elite-unit-downgrade",
          nation: "gondor",
          region: "minas-tirith"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "battle-cease",
          region: "minas-tirith"
        }
      ],
      type: "base",
      time: 173,
      playerId: "shadow"
    },
    {
      actions: [
        {
          cards: ["sstr01"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      time: 174,
      type: "character-effect",
      character: "the-witch-king"
    },
    {
      time: 175,
      type: "die",
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      playerId: "free-peoples",
      die: "character"
    },
    {
      time: 176,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "hunt-roll",
          dice: [4, 4, 6]
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["3"]
        }
      ],
      time: 177,
      type: "base"
    },
    {
      type: "base",
      time: 178,
      playerId: "free-peoples",
      actions: [
        {
          region: "dagorlad",
          type: "fellowship-reveal"
        },
        {
          quantity: 2,
          type: "fellowship-corruption"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          tiles: ["er"],
          type: "hunt-tile-draw"
        }
      ],
      die: "event",
      card: "scha14",
      type: "die-card",
      time: 179
    },
    {
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      die: "character",
      time: 180,
      type: "die",
      playerId: "free-peoples"
    },
    {
      type: "die",
      time: 181,
      playerId: "shadow",
      die: "army",
      actions: [
        {
          type: "army-movement",
          toRegion: "gap-of-rohan",
          fromRegion: "orthanc",
          leftUnits: {
            front: "shadow",
            elites: [],
            regulars: [
              {
                quantity: 3,
                nation: "isengard"
              }
            ],
            characters: ["saruman"]
          }
        },
        {
          toRegion: "minas-tirith",
          fromRegion: "osgiliath",
          leftUnits: {
            elites: [],
            front: "shadow",
            regulars: [
              {
                nation: "sauron",
                quantity: 1
              }
            ]
          },
          type: "army-movement"
        }
      ]
    },
    {
      actions: [
        {
          dice: [6, 5, 5],
          type: "combat-roll"
        }
      ],
      die: "character",
      card: "fpcha21",
      type: "die-card",
      time: 182,
      playerId: "free-peoples"
    },
    {
      type: "card-effect",
      time: 183,
      actions: [
        {
          region: "orthanc",
          quantity: 3,
          type: "regular-unit-elimination",
          nation: "isengard"
        },
        {
          type: "character-elimination",
          characters: ["saruman"]
        }
      ],
      card: "fpcha21",
      playerId: "shadow"
    },
    {
      elvenRing: {
        ring: "narya",
        fromDie: "muster",
        toDie: "army"
      },
      actions: [
        {
          fromRegion: "gap-of-rohan",
          toRegion: "orthanc",
          type: "army-movement"
        },
        {
          type: "army-movement",
          toRegion: "east-rhun",
          leftUnits: {
            regulars: [
              {
                nation: "southrons",
                quantity: 1
              }
            ],
            front: "shadow"
          },
          fromRegion: "north-rhun"
        }
      ],
      type: "die",
      time: 184,
      die: "army",
      playerId: "shadow"
    },
    {
      elvenRing: {
        toDie: "muster-army",
        fromDie: "character",
        ring: "nenya"
      },
      playerId: "free-peoples",
      actions: [
        {
          type: "regular-unit-recruitment",
          quantity: 1,
          nation: "rohan",
          region: "westemnet"
        },
        {
          quantity: 1,
          region: "lossarnach",
          type: "regular-unit-recruitment",
          nation: "gondor"
        }
      ],
      die: "muster-army",
      time: 185,
      type: "die"
    },
    {
      actions: [
        {
          region: "minas-morgul",
          nation: "sauron",
          type: "elite-unit-recruitment",
          quantity: 1
        }
      ],
      die: "muster",
      playerId: "shadow",
      time: 186,
      type: "die"
    },
    {
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha19", "fpstr03"]
        }
      ],
      time: 187,
      type: "base",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          cards: ["scha15", "sstr24"],
          type: "card-draw"
        }
      ],
      time: 187,
      type: "base"
    },
    {
      playerId: "free-peoples",
      actions: [],
      type: "base",
      time: 188
    },
    {
      type: "base",
      time: 189,
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
          type: "action-roll",
          dice: ["event", "muster", "event", "will-of-the-west", "event", "character"]
        }
      ],
      type: "base",
      time: 190
    },
    {
      playerId: "shadow",
      type: "base",
      time: 190,
      actions: [
        {
          type: "action-roll",
          dice: ["eye", "event", "army", "eye", "eye", "army", "muster"]
        }
      ]
    },
    {
      actions: [
        {
          quantity: 1,
          region: "westemnet",
          nation: "rohan",
          type: "leader-recruitment"
        },
        {
          region: "helms-deep",
          nation: "rohan",
          quantity: 1,
          type: "leader-recruitment"
        }
      ],
      die: "muster",
      time: 191,
      type: "die",
      playerId: "free-peoples"
    },
    {
      die: "army",
      playerId: "shadow",
      type: "die",
      actions: [
        {
          type: "army-attack",
          toRegion: "minas-tirith",
          fromRegion: "minas-tirith"
        }
      ],
      time: 192
    },
    {
      actions: [
        {
          type: "combat-card-choose",
          card: "scha15"
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
          type: "combat-card-choose-not"
        }
      ],
      time: 194,
      type: "base"
    },
    {
      actions: [
        {
          type: "character-choose",
          characters: ["aragorn"]
        }
      ],
      card: "scha15",
      playerId: "shadow",
      time: 195,
      type: "combat-card-effect"
    },
    {
      playerId: "free-peoples",
      time: 196,
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [1, 2, 5, 1, 6]
        }
      ]
    },
    {
      type: "base",
      time: 196,
      actions: [
        {
          type: "combat-roll",
          dice: [2, 5, 5, 4, 5]
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      time: 197,
      actions: [
        {
          dice: [3],
          type: "combat-re-roll"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "combat-re-roll",
          dice: [2, 1, 1, 3, 2]
        }
      ],
      type: "base",
      time: 197,
      playerId: "shadow"
    },
    {
      type: "base",
      time: 198,
      actions: [
        {
          quantity: 2,
          nation: "sauron",
          type: "regular-unit-elimination",
          region: "minas-tirith"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "battle-cease",
          region: "minas-tirith"
        }
      ],
      time: 199,
      type: "base",
      playerId: "shadow"
    },
    {
      time: 200,
      type: "character-effect",
      actions: [
        {
          cards: ["scha11"],
          type: "card-draw"
        }
      ],
      character: "the-witch-king",
      playerId: "shadow"
    },
    {
      card: "fpstr12",
      die: "event",
      type: "die-card",
      time: 201,
      playerId: "free-peoples",
      actions: [
        {
          toRegion: "druadan-forest",
          fromRegion: "westemnet",
          type: "army-movement"
        }
      ]
    },
    {
      actions: [
        {
          fromRegion: "minas-tirith",
          type: "army-attack",
          toRegion: "minas-tirith"
        }
      ],
      playerId: "shadow",
      die: "army",
      type: "die",
      time: 202
    },
    {
      actions: [
        {
          card: "scha18",
          type: "combat-card-choose"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 203
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      time: 204,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      card: "scha18",
      time: 205,
      type: "combat-card-effect",
      actions: [
        {
          characters: ["aragorn"],
          type: "character-choose"
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 206,
      actions: [
        {
          dice: [3, 3, 3, 5, 4],
          type: "combat-roll"
        }
      ]
    },
    {
      playerId: "shadow",
      type: "base",
      time: 206,
      actions: [
        {
          dice: [1, 2, 3, 1, 1],
          type: "combat-roll"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          dice: [1],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      time: 207
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [3, 6, 5, 3, 2],
          type: "combat-re-roll"
        }
      ],
      time: 207,
      type: "base"
    },
    {
      time: 208,
      type: "base",
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 1,
          region: "minas-tirith",
          nation: "sauron"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 1,
          region: "minas-tirith",
          nation: "gondor"
        }
      ],
      type: "base",
      time: 209
    },
    {
      type: "base",
      time: 210,
      actions: [
        {
          type: "battle-cease",
          region: "minas-tirith"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "card-draw",
          cards: ["scha10"]
        }
      ],
      playerId: "shadow",
      type: "character-effect",
      time: 211,
      character: "the-witch-king"
    },
    {
      die: "event",
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha24"]
        }
      ],
      playerId: "free-peoples",
      time: 212,
      type: "die"
    },
    {
      type: "die-pass",
      time: 213,
      playerId: "shadow"
    },
    {
      actions: [
        {
          cards: ["fpcha03"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples",
      die: "event",
      type: "die",
      time: 214
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          cards: ["fpcha06"],
          type: "card-discard"
        }
      ],
      time: 215,
      type: "base"
    },
    {
      card: "sstr24",
      die: "muster",
      playerId: "shadow",
      time: 216,
      type: "die-card",
      actions: [
        {
          type: "regular-unit-recruitment",
          nation: "sauron",
          quantity: 2,
          region: "minas-morgul"
        },
        {
          nation: "sauron",
          type: "regular-unit-recruitment",
          region: "dol-guldur",
          quantity: 2
        },
        {
          type: "regular-unit-recruitment",
          quantity: 2,
          region: "mount-gundabad",
          nation: "sauron"
        }
      ]
    },
    {
      playerId: "free-peoples",
      die: "will-of-the-west",
      type: "die",
      time: 217,
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha20"]
        }
      ]
    },
    {
      type: "base",
      time: 218,
      actions: [
        {
          type: "card-discard",
          cards: ["fpstr09"]
        }
      ],
      playerId: "free-peoples"
    },
    {
      type: "die",
      time: 219,
      playerId: "shadow",
      actions: [
        {
          cards: ["scha01"],
          type: "card-draw"
        }
      ],
      die: "event"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "hunt-tile-add",
          tile: "b-2"
        }
      ],
      die: "character",
      time: 220,
      type: "die-card",
      card: "fpcha03"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          cards: ["fpcha23", "fpstr18"],
          type: "card-draw"
        }
      ],
      type: "base",
      time: 221
    },
    {
      playerId: "shadow",
      type: "base",
      time: 221,
      actions: [
        {
          type: "card-draw",
          cards: ["scha19", "sstr19"]
        }
      ]
    },
    {
      actions: [
        {
          type: "card-discard",
          cards: ["fpcha19"]
        }
      ],
      type: "base",
      time: 222,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          cards: ["sstr05"],
          type: "card-discard"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 222
    },
    {
      playerId: "free-peoples",
      actions: [],
      type: "base",
      time: 223
    },
    {
      actions: [
        {
          type: "hunt-allocation",
          quantity: 1
        }
      ],
      playerId: "shadow",
      time: 224,
      type: "base"
    },
    {
      time: 225,
      type: "base",
      actions: [
        {
          dice: ["muster", "character", "event", "event", "muster", "character"],
          type: "action-roll"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          dice: ["army", "army", "muster-army", "event", "muster-army", "muster", "muster-army"],
          type: "action-roll"
        }
      ],
      time: 225,
      type: "base",
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          nation: "gondor",
          region: "minas-tirith",
          quantity: 1,
          type: "regular-unit-elimination"
        },
        {
          nation: "gondor",
          region: "minas-tirith",
          quantity: 1,
          type: "elite-unit-recruitment"
        },
        {
          cards: ["fpstr10", "fpstr07"],
          type: "card-draw"
        }
      ],
      type: "die-card",
      time: 226,
      die: "event",
      card: "fpcha24"
    },
    {
      type: "base",
      time: 227,
      actions: [
        {
          type: "card-discard",
          cards: ["fpstr03"]
        }
      ],
      playerId: "free-peoples"
    },
    {
      card: "scha19",
      die: "event",
      type: "die-card",
      time: 228,
      playerId: "shadow",
      actions: [
        {
          type: "region-choose",
          region: "minas-tirith"
        },
        {
          dice: [2, 6, 5, 3, 6],
          type: "combat-roll"
        }
      ]
    },
    {
      actions: [
        {
          type: "regular-unit-elimination",
          region: "minas-tirith",
          quantity: 1,
          nation: "gondor"
        },
        {
          region: "minas-tirith",
          nation: "gondor",
          quantity: 1,
          type: "elite-unit-elimination"
        }
      ],
      playerId: "free-peoples",
      time: 229,
      type: "card-effect",
      card: "scha19"
    },
    {
      actions: [
        {
          type: "army-attack",
          toRegion: "minas-tirith",
          fromRegion: "druadan-forest"
        }
      ],
      die: "event",
      playerId: "free-peoples",
      card: "fpstr10",
      type: "die-card",
      time: 230
    },
    {
      time: 231,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          card: "fpcha23",
          type: "combat-card-choose"
        }
      ]
    },
    {
      playerId: "shadow",
      type: "base",
      time: 232,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 233,
      type: "base",
      actions: [
        {
          dice: [4, 1, 6, 2, 1],
          type: "combat-roll"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [5, 2],
          type: "combat-roll"
        }
      ],
      time: 233,
      type: "base"
    },
    {
      type: "base",
      time: 234,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-re-roll",
          dice: [2, 6, 4]
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [1]
        }
      ],
      type: "base",
      time: 234
    },
    {
      playerId: "free-peoples",
      time: 235,
      type: "base",
      actions: [
        {
          region: "druadan-forest",
          type: "regular-unit-elimination",
          nation: "rohan",
          quantity: 1
        }
      ]
    },
    {
      actions: [
        {
          quantity: 2,
          region: "minas-tirith",
          nation: "sauron",
          type: "regular-unit-elimination"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 236
    },
    {
      time: 237,
      type: "base",
      actions: [
        {
          type: "battle-continue",
          region: "minas-tirith"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "army-retreat",
          toRegion: "osgiliath"
        }
      ],
      time: 238,
      type: "base",
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "free-peoples",
      time: 239,
      type: "base"
    },
    {
      time: 240,
      type: "die",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-recruitment",
          nation: "sauron",
          region: "minas-morgul"
        }
      ],
      playerId: "shadow",
      die: "muster"
    },
    {
      type: "die",
      time: 241,
      die: "muster",
      actions: [
        {
          type: "regular-unit-recruitment",
          region: "helms-deep",
          quantity: 1,
          nation: "rohan"
        },
        {
          region: "westemnet",
          nation: "rohan",
          quantity: 1,
          type: "regular-unit-recruitment"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      die: "muster-army",
      card: "sstr19",
      actions: [
        {
          type: "regular-unit-recruitment",
          region: "moria",
          quantity: 1,
          nation: "sauron"
        },
        {
          nation: "sauron",
          quantity: 1,
          region: "moria",
          type: "elite-unit-recruitment"
        },
        {
          region: "moria",
          quantity: 1,
          type: "nazgul-recruitment"
        }
      ],
      time: 242,
      type: "die-card"
    },
    {
      time: 243,
      type: "die-pass",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "elite-unit-recruitment",
          nation: "sauron",
          region: "dol-guldur",
          quantity: 1
        }
      ],
      time: 244,
      type: "die",
      die: "muster-army"
    },
    {
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      die: "character",
      time: 245,
      type: "die",
      playerId: "free-peoples"
    },
    {
      type: "base",
      time: 246,
      actions: [
        {
          type: "hunt-roll",
          dice: [1]
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "shadow",
      type: "die",
      time: 247,
      die: "army",
      actions: [
        {
          toRegion: "dimrill-dale",
          type: "army-movement",
          fromRegion: "moria"
        },
        {
          fromRegion: "lorien",
          leftUnits: {
            characters: [],
            front: "shadow",
            nNazgul: 0,
            elites: [],
            regulars: [
              {
                quantity: 1,
                nation: "isengard"
              }
            ]
          },
          type: "army-movement",
          toRegion: "dimrill-dale"
        }
      ]
    },
    {
      die: "muster",
      actions: [
        {
          quantity: 1,
          nation: "gondor",
          type: "elite-unit-recruitment",
          region: "dol-amroth"
        },
        {
          region: "dol-amroth",
          type: "leader-recruitment",
          nation: "gondor",
          quantity: 1
        }
      ],
      card: "fpstr18",
      time: 248,
      type: "die-card",
      playerId: "free-peoples"
    },
    {
      die: "army",
      time: 249,
      type: "die",
      playerId: "shadow",
      actions: [
        {
          toRegion: "north-anduin-vale",
          fromRegion: "south-anduin-vale",
          type: "army-movement"
        },
        {
          fromRegion: "dol-guldur",
          type: "army-movement",
          toRegion: "north-anduin-vale"
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
      playerId: "free-peoples",
      time: 250,
      type: "die"
    },
    {
      playerId: "shadow",
      type: "base",
      time: 251,
      actions: [
        {
          type: "hunt-roll",
          dice: [1]
        }
      ]
    },
    {
      type: "die-card",
      time: 252,
      card: "scha11",
      actions: [
        {
          nNazgul: 1,
          toRegion: "dagorlad",
          type: "nazgul-movement",
          fromRegion: "western-brown-lands"
        },
        {
          fromRegion: "osgiliath",
          type: "nazgul-movement",
          nNazgul: 2,
          toRegion: "north-anduin-vale"
        },
        {
          fromRegion: "osgiliath",
          type: "character-movement",
          characters: ["the-witch-king"],
          toRegion: "north-anduin-vale"
        },
        {
          nNazgul: 3,
          fromRegion: "osgiliath",
          type: "nazgul-movement",
          toRegion: "orthanc"
        }
      ],
      elvenRing: {
        toDie: "character",
        ring: "nenya",
        fromDie: "muster-army"
      },
      die: "character",
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "hunt-roll",
          dice: [4]
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 253
    },
    {
      actions: [
        {
          tiles: ["er"],
          type: "hunt-tile-draw"
        }
      ],
      playerId: "shadow",
      time: 254,
      type: "base"
    },
    {
      actions: [
        {
          type: "fellowship-corruption",
          quantity: 1
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 255
    },
    {
      type: "base",
      time: 256,
      playerId: "free-peoples",
      actions: [
        {
          type: "fellowship-reveal",
          region: "morannon"
        }
      ]
    },
    {
      type: "base",
      time: 257,
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["er"]
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 258,
      actions: [
        {
          quantity: 1,
          type: "fellowship-corruption"
        }
      ]
    },
    {
      time: 259,
      type: "base",
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha14", "fpstr21"]
        }
      ],
      playerId: "free-peoples"
    },
    {
      type: "base",
      time: 259,
      actions: [
        {
          cards: ["scha21", "sstr11"],
          type: "card-draw"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [],
      playerId: "free-peoples",
      time: 260,
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
      type: "base",
      time: 261
    },
    {
      type: "base",
      time: 262,
      playerId: "free-peoples",
      actions: [
        {
          dice: ["character", "muster", "will-of-the-west", "event", "event", "will-of-the-west"],
          type: "action-roll"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: ["eye", "character", "army", "army", "character", "army", "muster-army"],
          type: "action-roll"
        }
      ],
      type: "base",
      time: 262
    },
    {
      time: 263,
      type: "die",
      actions: [
        {
          type: "fellowship-hide"
        }
      ],
      playerId: "free-peoples",
      die: "will-of-the-west"
    },
    {
      card: "scha01",
      die: "character",
      type: "die-card",
      time: 264,
      playerId: "shadow",
      actions: [
        {
          tile: "rds",
          type: "hunt-tile-add"
        }
      ]
    },
    {
      type: "die",
      time: 265,
      actions: [
        {
          cards: ["fpcha01"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples",
      die: "event"
    },
    {
      die: "muster-army",
      playerId: "shadow",
      actions: [
        {
          type: "character-play",
          region: "minas-morgul",
          characters: ["the-mouth-of-sauron"]
        }
      ],
      type: "die",
      time: 266
    },
    {
      die: "character",
      card: "fpcha01",
      actions: [
        {
          tile: "b0",
          type: "hunt-tile-add"
        }
      ],
      type: "die-card",
      time: 267,
      playerId: "free-peoples"
    },
    {
      type: "die",
      time: 268,
      actions: [
        {
          fromRegion: "dimrill-dale",
          type: "army-movement",
          toRegion: "north-anduin-vale"
        },
        {
          toRegion: "druadan-forest",
          type: "army-movement",
          fromRegion: "osgiliath"
        }
      ],
      die: "army",
      playerId: "shadow"
    },
    {
      time: 269,
      type: "die-card",
      card: "fpcha14",
      playerId: "free-peoples",
      actions: [
        {
          tiles: ["er", "er", "er"],
          type: "hunt-tile-draw"
        }
      ],
      die: "event"
    },
    {
      time: 270,
      type: "die",
      actions: [
        {
          toRegion: "narrows-of-the-forest",
          fromRegion: "north-anduin-vale",
          type: "army-movement"
        },
        {
          toRegion: "folde",
          fromRegion: "druadan-forest",
          type: "army-movement"
        }
      ],
      die: "army",
      playerId: "shadow"
    },
    {
      die: "muster",
      playerId: "free-peoples",
      type: "die",
      time: 271,
      actions: [
        {
          type: "elite-unit-recruitment",
          region: "woodland-realm",
          quantity: 1,
          nation: "elves"
        }
      ]
    },
    {
      actions: [
        {
          leftUnits: {
            nNazgul: 0,
            regulars: [
              {
                nation: "sauron",
                quantity: 1
              }
            ],
            elites: [],
            front: "shadow",
            characters: []
          },
          type: "army-movement",
          fromRegion: "folde",
          toRegion: "edoras"
        },
        {
          fromRegion: "narrows-of-the-forest",
          type: "army-movement",
          toRegion: "old-forest-road"
        }
      ],
      type: "die",
      time: 272,
      die: "army",
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "fellowship-progress"
        }
      ],
      die: "will-of-the-west",
      time: 273,
      type: "die",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      time: 274,
      type: "base",
      actions: [
        {
          type: "hunt-tile-draw",
          tiles: ["er"]
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 275,
      actions: [
        {
          quantity: 2,
          type: "fellowship-corruption"
        }
      ]
    },
    {
      playerId: "shadow",
      die: "character",
      type: "die",
      time: 276,
      actions: [
        {
          type: "army-attack",
          toRegion: "woodland-realm",
          fromRegion: "old-forest-road"
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 277,
      type: "base",
      actions: [
        {
          type: "army-retreat-into-siege",
          region: "woodland-realm"
        }
      ]
    },
    {
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 278
    },
    {
      actions: [
        {
          cards: ["fpcha11", "fpstr14"],
          type: "card-draw"
        }
      ],
      playerId: "free-peoples",
      time: 279,
      type: "base"
    },
    {
      playerId: "shadow",
      type: "base",
      time: 279,
      actions: [
        {
          type: "card-draw",
          cards: ["scha03", "sstr07"]
        }
      ]
    },
    {
      playerId: "free-peoples",
      time: 280,
      type: "base",
      actions: []
    },
    {
      actions: [
        {
          type: "hunt-allocation",
          quantity: 1
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 281
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "action-roll",
          dice: ["muster", "muster", "character", "character", "muster"]
        }
      ],
      type: "base",
      time: 282
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: ["eye", "eye", "character", "muster", "event", "eye", "muster", "character"],
          type: "action-roll"
        }
      ],
      time: 282,
      type: "base"
    },
    {
      playerId: "free-peoples",
      type: "die-card",
      time: 283,
      actions: [
        {
          nation: "gondor",
          type: "elite-unit-recruitment",
          region: "minas-tirith",
          quantity: 1
        },
        {
          type: "leader-recruitment",
          nation: "gondor",
          region: "minas-tirith",
          quantity: 1
        }
      ],
      card: "fpstr14",
      die: "muster"
    },
    {
      playerId: "shadow",
      time: 284,
      type: "die",
      die: "muster",
      actions: [
        {
          type: "regular-unit-recruitment",
          region: "minas-morgul",
          quantity: 1,
          nation: "sauron"
        },
        {
          quantity: 1,
          nation: "sauron",
          region: "morannon",
          type: "regular-unit-recruitment"
        }
      ]
    },
    {
      type: "die-card",
      time: 285,
      card: "fpstr21",
      playerId: "free-peoples",
      actions: [
        {
          quantity: 1,
          type: "elite-unit-recruitment",
          nation: "elves",
          region: "rivendell"
        },
        {
          cards: ["fpstr05"],
          type: "card-draw"
        }
      ],
      die: "muster"
    },
    {
      die: "character",
      playerId: "shadow",
      time: 286,
      type: "die",
      actions: [
        {
          type: "army-attack",
          fromRegion: "woodland-realm",
          toRegion: "woodland-realm"
        }
      ]
    },
    {
      playerId: "shadow",
      type: "base",
      time: 287,
      actions: [
        {
          card: "scha21",
          type: "combat-card-choose"
        }
      ]
    },
    {
      type: "base",
      time: 288,
      actions: [
        {
          card: "fpstr13",
          type: "combat-card-choose"
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          dice: [3, 4, 4],
          type: "combat-roll"
        }
      ],
      time: 289,
      type: "base",
      playerId: "free-peoples"
    },
    {
      card: "scha21",
      actions: [
        {
          leaders: {
            nNazgul: 2
          },
          type: "leader-forfeit"
        }
      ],
      time: 290,
      type: "card-effect",
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [3, 2, 2, 4]
        }
      ],
      time: 291,
      type: "base",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      type: "base",
      time: 291,
      actions: [
        {
          dice: [6],
          type: "combat-roll"
        }
      ]
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
      time: 292
    },
    {
      actions: [
        {
          region: "woodland-realm",
          nation: "elves",
          type: "elite-unit-downgrade",
          quantity: 1
        }
      ],
      time: 293,
      type: "base",
      playerId: "free-peoples"
    },
    {
      time: 294,
      type: "base",
      actions: [
        {
          region: "woodland-realm",
          type: "battle-cease"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          cards: ["scha06"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      character: "the-witch-king",
      time: 295,
      type: "character-effect"
    },
    {
      die: "muster",
      time: 296,
      type: "die",
      playerId: "free-peoples",
      actions: [
        {
          type: "regular-unit-recruitment",
          region: "minas-tirith",
          quantity: 1,
          nation: "gondor"
        },
        {
          type: "regular-unit-recruitment",
          region: "westemnet",
          nation: "rohan",
          quantity: 1
        }
      ]
    },
    {
      die: "character",
      actions: [
        {
          toRegion: "woodland-realm",
          fromRegion: "woodland-realm",
          type: "army-attack"
        }
      ],
      playerId: "shadow",
      time: 297,
      type: "die"
    },
    {
      type: "base",
      time: 298,
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose",
          card: "scha06"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose",
          card: "fpstr07"
        }
      ],
      time: 299,
      type: "base"
    },
    {
      playerId: "shadow",
      card: "scha06",
      actions: [
        {
          type: "leader-forfeit",
          leaders: {
            nNazgul: 2
          }
        }
      ],
      type: "card-effect",
      time: 300
    },
    {
      actions: [
        {
          dice: [2, 5, 4, 6],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 301
    },
    {
      playerId: "shadow",
      type: "base",
      time: 301,
      actions: [
        {
          type: "combat-roll",
          dice: [6]
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 302,
      actions: [
        {
          dice: [2],
          type: "combat-re-roll"
        }
      ]
    },
    {
      type: "base",
      time: 303,
      playerId: "shadow",
      actions: [
        {
          nation: "sauron",
          type: "regular-unit-elimination",
          quantity: 2,
          region: "woodland-realm"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "elite-unit-downgrade",
          nation: "elves",
          region: "woodland-realm",
          quantity: 1
        }
      ],
      type: "base",
      time: 304
    },
    {
      type: "base",
      time: 305,
      actions: [
        {
          region: "woodland-realm",
          type: "battle-cease"
        }
      ],
      playerId: "shadow"
    },
    {
      time: 306,
      type: "character-effect",
      playerId: "shadow",
      character: "the-witch-king",
      actions: [
        {
          type: "card-draw",
          cards: ["scha17"]
        }
      ]
    },
    {
      type: "die",
      time: 307,
      playerId: "free-peoples",
      actions: [
        {
          toRegion: "osgiliath",
          fromRegion: "minas-tirith",
          type: "army-movement"
        }
      ],
      die: "character"
    },
    {
      actions: [
        {
          region: "gap-of-rohan",
          quantity: 2,
          type: "regular-unit-recruitment",
          nation: "isengard"
        },
        {
          fromRegion: "north-dunland",
          toRegion: "gap-of-rohan",
          type: "army-movement"
        }
      ],
      card: "sstr11",
      type: "die-card",
      time: 308,
      die: "event",
      playerId: "shadow"
    },
    {
      die: "character",
      actions: [
        {
          toRegion: "west-harondor",
          type: "army-movement",
          fromRegion: "osgiliath"
        }
      ],
      type: "die",
      time: 309,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          type: "army-movement",
          toRegion: "umbar",
          leftUnits: {
            regulars: [
              {
                quantity: 2,
                nation: "southrons"
              }
            ],
            front: "shadow",
            elites: []
          },
          fromRegion: "near-harad"
        },
        {
          type: "army-movement",
          fromRegion: "gorgoroth",
          toRegion: "minas-morgul"
        }
      ],
      character: "the-mouth-of-sauron",
      time: 310,
      type: "die",
      playerId: "shadow",
      die: "muster"
    },
    {
      actions: [
        {
          cards: ["fpcha15", "fpstr23"],
          type: "card-draw"
        }
      ],
      type: "base",
      time: 311,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "card-draw",
          cards: ["scha20", "sstr22"]
        }
      ],
      type: "base",
      time: 311
    },
    {
      actions: [
        {
          type: "card-discard",
          cards: ["scha17"]
        }
      ],
      type: "base",
      time: 312,
      playerId: "shadow"
    },
    {
      actions: [],
      type: "base",
      time: 313,
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
      type: "base",
      time: 314
    },
    {
      time: 315,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: ["character", "muster", "will-of-the-west", "event", "event"],
          type: "action-roll"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "action-roll",
          dice: [
            "character",
            "character",
            "muster-army",
            "character",
            "character",
            "muster",
            "army",
            "eye"
          ]
        }
      ],
      time: 315,
      type: "base"
    },
    {
      die: "character",
      type: "die",
      time: 316,
      playerId: "free-peoples",
      actions: [
        {
          type: "army-attack",
          fromRegion: "west-harondor",
          toRegion: "umbar"
        }
      ]
    },
    {
      actions: [
        {
          region: "umbar",
          type: "army-retreat-into-siege"
        }
      ],
      type: "base",
      time: 317,
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 318
    },
    {
      card: "scha20",
      die: "character",
      time: 319,
      type: "die-card",
      playerId: "shadow",
      actions: [
        {
          fromRegion: "woodland-realm",
          type: "army-attack",
          toRegion: "woodland-realm"
        }
      ]
    },
    {
      type: "base",
      time: 320,
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose",
          card: "scha10"
        }
      ]
    },
    {
      playerId: "shadow",
      card: "scha10",
      type: "card-effect",
      time: 321,
      actions: [
        {
          leaders: {
            nNazgul: 2
          },
          type: "leader-forfeit"
        }
      ]
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [5, 4, 4, 4]
        }
      ],
      type: "base",
      time: 322,
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [4, 3, 4, 2, 3]
        }
      ],
      type: "base",
      time: 322
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 323,
      actions: [
        {
          dice: [6],
          type: "combat-re-roll"
        }
      ]
    },
    {
      type: "base",
      time: 323,
      actions: [
        {
          dice: [6, 2, 3, 2, 1],
          type: "combat-re-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      time: 324,
      actions: [
        {
          type: "regular-unit-elimination",
          region: "woodland-realm",
          nation: "sauron",
          quantity: 2
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 325,
      actions: [
        {
          type: "elite-unit-downgrade",
          region: "woodland-realm",
          nation: "elves",
          quantity: 1
        }
      ]
    },
    {
      actions: [
        {
          type: "card-draw",
          cards: ["scha16"]
        }
      ],
      character: "the-witch-king",
      playerId: "shadow",
      type: "character-effect",
      time: 326
    },
    {
      type: "base",
      time: 327,
      actions: [
        {
          card: "scha16",
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
      type: "base",
      time: 328,
      playerId: "free-peoples"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          dice: [5, 3, 4, 2],
          type: "combat-roll"
        }
      ],
      time: 329,
      type: "base"
    },
    {
      time: 329,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [5, 1, 2, 4, 4]
        }
      ]
    },
    {
      time: 330,
      type: "card-effect",
      playerId: "shadow",
      card: "scha16",
      actions: [
        {
          leaders: {
            nNazgul: 1
          },
          type: "leader-forfeit"
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
      time: 331
    },
    {
      playerId: "shadow",
      actions: [
        {
          dice: [3, 6, 3, 3, 6],
          type: "combat-re-roll"
        }
      ],
      type: "base",
      time: 331
    },
    {
      type: "base",
      time: 332,
      actions: [
        {
          nation: "sauron",
          quantity: 1,
          region: "woodland-realm",
          type: "elite-unit-downgrade"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      time: 333,
      playerId: "free-peoples",
      actions: [
        {
          region: "woodland-realm",
          type: "regular-unit-elimination",
          quantity: 2,
          nation: "elves"
        }
      ]
    },
    {
      time: 334,
      type: "base",
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
      type: "base",
      time: 335
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          dice: [1, 3],
          type: "combat-roll"
        }
      ],
      type: "base",
      time: 336
    },
    {
      time: 336,
      type: "base",
      actions: [
        {
          dice: [1, 3, 2, 4, 3],
          type: "combat-roll"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 337,
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
          dice: [2, 1, 4, 5, 5],
          type: "combat-re-roll"
        }
      ],
      playerId: "shadow",
      time: 337,
      type: "base"
    },
    {
      actions: [
        {
          type: "elite-unit-downgrade",
          quantity: 1,
          nation: "sauron",
          region: "woodland-realm"
        }
      ],
      time: 338,
      type: "base",
      playerId: "shadow"
    },
    {
      die: "muster",
      time: 339,
      type: "die",
      actions: [
        {
          type: "regular-unit-recruitment",
          quantity: 1,
          region: "westemnet",
          nation: "rohan"
        },
        {
          region: "minas-tirith",
          type: "regular-unit-recruitment",
          quantity: 1,
          nation: "gondor"
        }
      ],
      playerId: "free-peoples"
    },
    {
      die: "army",
      type: "die",
      time: 340,
      actions: [
        {
          type: "army-movement",
          toRegion: "south-ithilien",
          fromRegion: "minas-morgul"
        },
        {
          type: "army-movement",
          fromRegion: "mount-gundabad",
          toRegion: "eagles-eyre"
        }
      ],
      playerId: "shadow"
    },
    {
      die: "event",
      actions: [
        {
          type: "region-choose",
          region: "woodland-realm"
        },
        {
          type: "combat-roll",
          dice: [5, 3, 5, 4, 3]
        }
      ],
      playerId: "free-peoples",
      card: "fpstr05",
      type: "die-card",
      time: 341
    },
    {
      card: "fpstr05",
      type: "card-effect",
      time: 342,
      actions: [
        {
          quantity: 2,
          nation: "sauron",
          type: "regular-unit-elimination",
          region: "woodland-realm"
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "shadow",
      time: 343,
      type: "die-card",
      card: "sstr22",
      die: "muster",
      actions: [
        {
          quantity: 1,
          nation: "sauron",
          region: "angmar",
          type: "regular-unit-recruitment"
        },
        {
          region: "ettenmoors",
          nation: "sauron",
          quantity: 1,
          type: "regular-unit-recruitment"
        },
        {
          region: "weather-hills",
          type: "regular-unit-recruitment",
          nation: "sauron",
          quantity: 1
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 344
    },
    {
      time: 345,
      type: "die",
      die: "muster-army",
      playerId: "shadow",
      actions: [
        {
          toRegion: "vale-of-the-carnen",
          type: "army-movement",
          fromRegion: "east-rhun"
        },
        {
          toRegion: "osgiliath",
          type: "army-movement",
          fromRegion: "south-ithilien"
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          region: "minas-tirith",
          type: "regular-unit-recruitment",
          nation: "gondor",
          quantity: 1
        },
        {
          nation: "gondor",
          region: "pelargir",
          type: "regular-unit-recruitment",
          quantity: 1
        }
      ],
      die: "will-of-the-west",
      time: 346,
      type: "die"
    },
    {
      die: "character",
      playerId: "shadow",
      actions: [
        {
          type: "army-attack",
          fromRegion: "osgiliath",
          toRegion: "minas-tirith"
        }
      ],
      time: 347,
      type: "die"
    },
    {
      time: 348,
      type: "base",
      actions: [
        {
          region: "minas-tirith",
          type: "army-retreat-into-siege"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "army-advance"
        }
      ],
      time: 349,
      type: "base"
    },
    {
      playerId: "free-peoples",
      type: "die-pass",
      time: 350
    },
    {
      actions: [
        {
          fromRegion: "minas-tirith",
          toRegion: "minas-tirith",
          type: "army-attack"
        }
      ],
      die: "character",
      playerId: "shadow",
      time: 351,
      type: "die"
    },
    {
      time: 352,
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
      time: 353,
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      time: 354,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          dice: [5, 1],
          type: "combat-roll"
        }
      ]
    },
    {
      type: "base",
      time: 354,
      playerId: "shadow",
      actions: [
        {
          type: "combat-roll",
          dice: [1, 6, 5, 5, 6]
        }
      ]
    },
    {
      type: "base",
      time: 355,
      actions: [
        {
          nation: "sauron",
          quantity: 1,
          region: "minas-tirith",
          type: "regular-unit-elimination"
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          quantity: 2,
          region: "minas-tirith",
          type: "regular-unit-elimination",
          nation: "gondor"
        }
      ],
      type: "base",
      time: 356,
      playerId: "free-peoples"
    },
    {
      playerId: "free-peoples",
      die: "event",
      time: 357,
      type: "die",
      actions: [
        {
          type: "card-draw",
          cards: ["fpstr01"]
        }
      ]
    },
    {
      type: "die",
      time: 358,
      actions: [
        {
          nNazgul: 1,
          fromRegion: "dagorlad",
          type: "nazgul-movement",
          toRegion: "vale-of-the-carnen"
        },
        {
          type: "nazgul-movement",
          toRegion: "vale-of-the-carnen",
          fromRegion: "woodland-realm",
          nNazgul: 4
        },
        {
          toRegion: "vale-of-the-carnen",
          type: "character-movement",
          characters: ["the-witch-king"],
          fromRegion: "woodland-realm"
        },
        {
          type: "nazgul-movement",
          nNazgul: 2,
          fromRegion: "vale-of-the-carnen",
          toRegion: "minas-tirith"
        }
      ],
      playerId: "shadow",
      die: "character"
    },
    {
      type: "base",
      time: 359,
      playerId: "free-peoples",
      actions: [
        {
          type: "card-draw",
          cards: ["fpcha10", "fpstr19"]
        }
      ]
    },
    {
      type: "base",
      playerId: "shadow",
      time: 359,
      actions: [
        {
          type: "card-draw",
          cards: ["scha09", "sstr08"]
        }
      ]
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "card-discard",
          cards: ["fpstr23"]
        }
      ],
      type: "base",
      time: 360
    },
    {
      actions: [],
      playerId: "free-peoples",
      time: 361,
      type: "base"
    },
    {
      actions: [
        {
          quantity: 0,
          type: "hunt-allocation"
        }
      ],
      time: 362,
      type: "base",
      playerId: "shadow"
    },
    {
      type: "base",
      time: 363,
      playerId: "free-peoples",
      actions: [
        {
          dice: ["will-of-the-west", "character", "muster", "muster", "muster"],
          type: "action-roll"
        }
      ]
    },
    {
      playerId: "shadow",
      type: "base",
      time: 363,
      actions: [
        {
          type: "action-roll",
          dice: [
            "muster",
            "event",
            "muster",
            "muster-army",
            "muster-army",
            "muster-army",
            "muster-army",
            "eye",
            "eye"
          ]
        }
      ]
    },
    {
      playerId: "free-peoples",
      type: "die-card",
      time: 364,
      actions: [
        {
          quantity: 1,
          type: "regular-unit-recruitment",
          nation: "north",
          region: "dale"
        },
        {
          nation: "north",
          quantity: 1,
          type: "regular-unit-recruitment",
          region: "dale"
        },
        {
          cards: ["fpstr11"],
          type: "card-draw"
        }
      ],
      die: "muster",
      card: "fpstr19"
    },
    {
      die: "muster-army",
      playerId: "shadow",
      actions: [
        {
          toRegion: "dale",
          type: "army-attack",
          fromRegion: "vale-of-the-carnen"
        }
      ],
      time: 365,
      type: "die"
    },
    {
      character: "gandalf-the-white",
      type: "character-effect",
      time: 366,
      actions: [
        {
          type: "leader-forfeit",
          leaders: {
            characters: ["gandalf-the-white"]
          }
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "combat-card-choose",
          card: "sstr01"
        }
      ],
      time: 367,
      type: "base"
    },
    {
      time: 368,
      type: "base",
      actions: [
        {
          card: "fpstr01",
          type: "combat-card-choose"
        }
      ],
      playerId: "free-peoples"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [1, 6, 3]
        }
      ],
      type: "base",
      time: 369
    },
    {
      actions: [
        {
          dice: [5, 6, 5],
          type: "combat-roll"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 369
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 370,
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
          type: "regular-unit-elimination",
          region: "vale-of-the-carnen",
          nation: "southrons",
          quantity: 3
        }
      ],
      type: "base",
      time: 371
    },
    {
      time: 372,
      type: "base",
      playerId: "free-peoples",
      actions: [
        {
          nation: "north",
          quantity: 3,
          region: "dale",
          type: "regular-unit-elimination"
        },
        {
          region: "dale",
          type: "leader-elimination",
          nation: "north",
          quantity: 1
        },
        {
          characters: ["gandalf-the-white"],
          type: "character-elimination"
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "army-advance"
        }
      ],
      time: 373,
      type: "base"
    },
    {
      actions: [
        {
          type: "army-movement",
          fromRegion: "helms-deep",
          toRegion: "osgiliath"
        }
      ],
      playerId: "free-peoples",
      die: "will-of-the-west",
      time: 374,
      type: "die-card",
      card: "fpstr11"
    },
    {
      actions: [
        {
          quantity: 1,
          nation: "sauron",
          region: "minas-morgul",
          type: "regular-unit-recruitment"
        },
        {
          region: "north-rhun",
          type: "regular-unit-recruitment",
          nation: "southrons",
          quantity: 1
        }
      ],
      time: 375,
      type: "die",
      die: "muster",
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "army-movement",
          toRegion: "north-ithilien",
          fromRegion: "osgiliath"
        }
      ],
      time: 376,
      type: "die",
      die: "character",
      playerId: "free-peoples"
    },
    {
      playerId: "shadow",
      die: "muster-army",
      actions: [
        {
          fromRegion: "minas-tirith",
          type: "army-movement",
          leftUnits: {
            elites: [],
            characters: [],
            regulars: [
              {
                quantity: 2,
                nation: "sauron"
              }
            ],
            front: "shadow",
            nNazgul: 0
          },
          toRegion: "osgiliath"
        },
        {
          type: "army-movement",
          leftUnits: {
            front: "shadow",
            regulars: [
              {
                quantity: 3,
                nation: "southrons"
              }
            ],
            characters: [],
            nNazgul: 0,
            elites: []
          },
          toRegion: "woodland-realm",
          fromRegion: "dale"
        }
      ],
      time: 377,
      type: "die"
    },
    {
      actions: [
        {
          toRegion: "minas-morgul",
          fromRegion: "north-ithilien",
          type: "army-attack"
        }
      ],
      playerId: "free-peoples",
      time: 378,
      type: "die",
      elvenRing: {
        ring: "vilya",
        toDie: "character",
        fromDie: "muster"
      },
      die: "character"
    },
    {
      actions: [
        {
          region: "minas-morgul",
          type: "army-retreat-into-siege"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 379
    },
    {
      actions: [
        {
          type: "army-advance"
        }
      ],
      playerId: "free-peoples",
      time: 380,
      type: "base"
    },
    {
      actions: [
        {
          toRegion: "woodland-realm",
          fromRegion: "woodland-realm",
          type: "army-attack"
        }
      ],
      die: "muster-army",
      time: 381,
      type: "die",
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "combat-card-choose",
          card: "scha09"
        }
      ],
      time: 382,
      type: "base",
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      time: 383,
      type: "base",
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      time: 384,
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [3, 1]
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          dice: [3, 2, 3, 4, 3],
          type: "combat-roll"
        }
      ],
      time: 384,
      type: "base",
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "combat-re-roll",
          dice: [1, 2, 3, 6, 3]
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 385
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 386,
      actions: [
        {
          region: "woodland-realm",
          quantity: 1,
          type: "regular-unit-elimination",
          nation: "elves"
        }
      ]
    },
    {
      time: 387,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "elite-unit-downgrade",
          nation: "southrons",
          region: "woodland-realm",
          quantity: 1
        },
        {
          type: "battle-continue",
          region: "woodland-realm"
        }
      ]
    },
    {
      actions: [
        {
          cards: ["scha23"],
          type: "card-draw"
        }
      ],
      playerId: "shadow",
      character: "the-witch-king",
      type: "character-effect",
      time: 388
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 389
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      time: 390,
      playerId: "free-peoples"
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          dice: [4],
          type: "combat-roll"
        }
      ],
      type: "base",
      time: 391
    },
    {
      type: "base",
      time: 391,
      actions: [
        {
          type: "combat-roll",
          dice: [2, 4, 5, 6, 5]
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      time: 392,
      actions: [
        {
          type: "combat-re-roll",
          dice: [2]
        }
      ],
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          nation: "elves",
          region: "woodland-realm",
          type: "regular-unit-elimination",
          quantity: 1
        },
        {
          quantity: 1,
          region: "woodland-realm",
          type: "leader-elimination",
          nation: "elves"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 393
    },
    {
      playerId: "free-peoples",
      time: 394,
      type: "die-pass"
    },
    {
      actions: [
        {
          fromRegion: "orthanc",
          toRegion: "fords-of-isen",
          type: "army-attack"
        }
      ],
      die: "muster-army",
      type: "die",
      time: 395,
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      type: "base",
      time: 396,
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "combat-card-choose",
          card: "fpcha10"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 397
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "combat-roll",
          dice: [1, 5]
        }
      ],
      type: "base",
      time: 398
    },
    {
      time: 398,
      type: "base",
      actions: [
        {
          type: "combat-roll",
          dice: [3, 5, 5, 4, 2]
        }
      ],
      playerId: "shadow"
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
      time: 399
    },
    {
      actions: [
        {
          type: "combat-re-roll",
          dice: [5, 6, 4]
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 399
    },
    {
      actions: [
        {
          nation: "rohan",
          region: "fords-of-isen",
          type: "leader-elimination",
          quantity: 1
        }
      ],
      card: "fpcha10",
      playerId: "free-peoples",
      type: "combat-card-effect",
      time: 400
    },
    {
      playerId: "shadow",
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 1,
          nation: "isengard",
          region: "orthanc"
        }
      ],
      time: 401,
      type: "base"
    },
    {
      actions: [
        {
          region: "fords-of-isen",
          type: "battle-continue"
        }
      ],
      playerId: "shadow",
      time: 402,
      type: "base"
    },
    {
      actions: [
        {
          toRegion: "helms-deep",
          type: "army-retreat"
        }
      ],
      type: "base",
      time: 403,
      playerId: "free-peoples"
    },
    {
      time: 404,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          type: "army-advance"
        }
      ]
    },
    {
      die: "muster",
      playerId: "free-peoples",
      type: "die",
      time: 405,
      actions: [
        {
          type: "political-advance",
          quantity: 1,
          nation: "north"
        }
      ]
    },
    {
      die: "muster",
      character: "the-mouth-of-sauron",
      actions: [
        {
          fromRegion: "fords-of-isen",
          type: "army-attack",
          toRegion: "helms-deep"
        }
      ],
      playerId: "shadow",
      type: "die",
      time: 406
    },
    {
      playerId: "free-peoples",
      actions: [
        {
          type: "army-retreat-into-siege",
          region: "helms-deep"
        }
      ],
      type: "base",
      time: 407
    },
    {
      playerId: "shadow",
      time: 408,
      type: "base",
      actions: [
        {
          leftUnits: {
            elites: [],
            regulars: [
              {
                quantity: 1,
                nation: "isengard"
              }
            ],
            nNazgul: 0,
            front: "shadow"
          },
          type: "army-advance"
        }
      ]
    },
    {
      elvenRing: {
        toDie: "army",
        fromDie: "event",
        ring: "vilya"
      },
      die: "army",
      type: "die",
      time: 409,
      playerId: "shadow",
      actions: [
        {
          type: "army-attack",
          fromRegion: "helms-deep",
          toRegion: "helms-deep"
        }
      ]
    },
    {
      playerId: "shadow",
      type: "base",
      time: 410,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ]
    },
    {
      actions: [
        {
          type: "combat-card-choose",
          card: "fpcha20"
        }
      ],
      type: "base",
      time: 411,
      playerId: "free-peoples"
    },
    {
      actions: [
        {
          dice: [4, 6],
          type: "combat-roll"
        }
      ],
      playerId: "free-peoples",
      time: 412,
      type: "base"
    },
    {
      type: "base",
      time: 412,
      playerId: "shadow",
      actions: [
        {
          dice: [2, 5],
          type: "combat-roll"
        }
      ]
    },
    {
      type: "base",
      time: 413,
      playerId: "shadow",
      actions: [
        {
          type: "combat-re-roll",
          dice: [5, 5]
        }
      ]
    },
    {
      playerId: "shadow",
      actions: [
        {
          quantity: 1,
          type: "regular-unit-elimination",
          region: "helms-deep",
          nation: "isengard"
        }
      ],
      time: 414,
      type: "base"
    },
    {
      playerId: "shadow",
      type: "base",
      time: 415,
      actions: [
        {
          type: "elite-unit-downgrade",
          nation: "isengard",
          quantity: 1,
          region: "helms-deep"
        },
        {
          type: "battle-continue",
          region: "helms-deep"
        }
      ]
    },
    {
      type: "base",
      time: 416,
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
          type: "combat-card-choose-not"
        }
      ],
      time: 417,
      type: "base"
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 418,
      actions: [
        {
          dice: [5, 2],
          type: "combat-roll"
        }
      ]
    },
    {
      actions: [
        {
          dice: [4, 5, 4, 1, 5],
          type: "combat-roll"
        }
      ],
      type: "base",
      time: 418,
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "combat-re-roll",
          dice: [1, 2, 1]
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 419
    },
    {
      actions: [
        {
          region: "helms-deep",
          quantity: 1,
          nation: "isengard",
          type: "regular-unit-elimination"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 420
    },
    {
      time: 421,
      type: "base",
      playerId: "shadow",
      actions: [
        {
          region: "helms-deep",
          type: "elite-unit-downgrade",
          nation: "isengard",
          quantity: 1
        },
        {
          type: "battle-continue",
          region: "helms-deep"
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
      type: "base",
      time: 422
    },
    {
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 423
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 424,
      actions: [
        {
          type: "combat-roll",
          dice: [5, 1]
        }
      ]
    },
    {
      actions: [
        {
          type: "combat-roll",
          dice: [4, 1, 5, 1, 5]
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 424
    },
    {
      time: 425,
      type: "base",
      actions: [
        {
          type: "combat-re-roll",
          dice: [4, 1, 5]
        }
      ],
      playerId: "shadow"
    },
    {
      actions: [
        {
          type: "regular-unit-elimination",
          quantity: 1,
          nation: "isengard",
          region: "helms-deep"
        }
      ],
      playerId: "shadow",
      type: "base",
      time: 426
    },
    {
      type: "base",
      time: 427,
      playerId: "shadow",
      actions: [
        {
          type: "elite-unit-downgrade",
          quantity: 1,
          region: "helms-deep",
          nation: "isengard"
        },
        {
          type: "battle-continue",
          region: "helms-deep"
        }
      ]
    },
    {
      type: "base",
      time: 428,
      actions: [
        {
          type: "combat-card-choose-not"
        }
      ],
      playerId: "shadow"
    },
    {
      type: "base",
      time: 429,
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
          type: "combat-roll",
          dice: [1, 4]
        }
      ],
      playerId: "free-peoples",
      type: "base",
      time: 430
    },
    {
      type: "base",
      time: 430,
      actions: [
        {
          type: "combat-roll",
          dice: [6, 1, 1, 5, 6]
        }
      ],
      playerId: "shadow"
    },
    {
      playerId: "free-peoples",
      type: "base",
      time: 431,
      actions: [
        {
          nation: "rohan",
          region: "helms-deep",
          type: "regular-unit-elimination",
          quantity: 2
        }
      ]
    }
  ]
};
