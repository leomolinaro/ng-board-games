import { WotrStoryDoc } from "../../game/wotr-story-models";

export const stories: WotrStoryDoc[] = [
  {
    playerId: "free-peoples",
    type: "base",
    time: 1,
    actions: [
      {
        type: "card-draw",
        cards: ["fpcha22", "fpstr23"]
      }
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
        dice: ["will-of-the-west", "character", "will-of-the-west", "character", "will-of-the-west"]
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
        dice: ["event", "will-of-the-west", "character", "will-of-the-west", "muster-army", "event"]
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
    actions: [
      {
        type: "companion-random",
        companions: ["peregrin"]
      }
    ],
    time: 127,
    type: "base"
  },
  {
    time: 128,
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
    time: 129,
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
    time: 129
  },
  {
    playerId: "shadow",
    actions: [
      {
        type: "card-discard",
        cards: ["sstr23"]
      }
    ],
    time: 130,
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
    time: 131
  },
  {
    time: 132,
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
    time: 133,
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
    time: 133,
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
    time: 134,
    type: "die-card",
    card: "fpstr09",
    playerId: "free-peoples"
  },
  {
    die: "event",
    time: 135,
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
    time: 136,
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
    time: 137,
    type: "die-pass",
    playerId: "free-peoples"
  },
  {
    type: "die",
    time: 138,
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
    time: 139,
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
    time: 140,
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
    time: 141
  },
  {
    time: 142,
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
    time: 142,
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
    time: 143
  },
  {
    time: 143,
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
    time: 144,
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
    time: 145
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
    time: 146
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
    time: 147
  },
  {
    die: "character",
    playerId: "free-peoples",
    type: "die",
    time: 148,
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
    time: 149
  },
  {
    type: "die",
    die: "muster",
    time: 150,
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
    time: 151,
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
    time: 152
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
    time: 153
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
    time: 154,
    playerId: "shadow"
  },
  {
    actions: [
      {
        type: "fellowship-progress"
      }
    ],
    time: 155,
    playerId: "free-peoples",
    die: "will-of-the-west",
    type: "die"
  },
  {
    type: "base",
    playerId: "shadow",
    time: 156,
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
    time: 157,
    type: "base"
  },
  {
    time: 158,
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
    time: 159,
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
    time: 160
  },
  {
    type: "die",
    die: "muster-army",
    time: 161,
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
    time: 162
  },
  {
    playerId: "shadow",
    actions: [
      {
        type: "combat-card-choose",
        card: "scha16"
      }
    ],
    time: 163,
    type: "base"
  },
  {
    time: 164,
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
    time: 165
  },
  {
    type: "base",
    time: 165,
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
    time: 166,
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
    time: 167,
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
    time: 167,
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
    time: 168,
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
    time: 169
  },
  {
    actions: [
      {
        cards: ["scha17"],
        type: "card-draw"
      }
    ],
    type: "character-effect",
    time: 170,
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
    time: 171,
    playerId: "free-peoples"
  },
  {
    playerId: "shadow",
    type: "base",
    time: 171,
    actions: [
      {
        type: "card-draw",
        cards: ["scha20", "sstr02"]
      }
    ]
  },
  {
    time: 172,
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
    time: 173,
    actions: [],
    type: "base"
  },
  {
    type: "base",
    time: 174,
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
    time: 175
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
    time: 175
  },
  {
    type: "die",
    die: "character",
    playerId: "free-peoples",
    time: 176,
    actions: [
      {
        type: "fellowship-hide"
      }
    ]
  },
  {
    time: 177,
    type: "die-pass",
    playerId: "shadow"
  },
  {
    time: 178,
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
    time: 179,
    playerId: "shadow",
    type: "die-pass"
  },
  {
    time: 180,
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
    time: 181,
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
    time: 182,
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
    time: 183,
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
    time: 184
  },
  {
    time: 185,
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
    time: 186,
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
    time: 187,
    card: "scha17"
  },
  {
    playerId: "free-peoples",
    time: 188,
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
    time: 189,
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
    time: 190,
    type: "die"
  },
  {
    type: "die",
    die: "muster",
    time: 191,
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
    time: 192
  },
  {
    time: 193,
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
    time: 193
  },
  {
    playerId: "free-peoples",
    time: 194,
    type: "base",
    actions: [
      {
        cards: ["fpstr05"],
        type: "card-discard"
      }
    ]
  },
  {
    time: 194,
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
    time: 195,
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
    time: 196,
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
    time: 197
  },
  {
    time: 197,
    type: "base",
    actions: [
      {
        dice: ["character", "character", "muster", "army", "character", "eye", "character", "eye"],
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
    time: 198,
    die: "character"
  },
  {
    type: "die",
    time: 199,
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
    time: 200
  },
  {
    actions: [
      {
        type: "combat-card-choose-not"
      }
    ],
    type: "base",
    time: 201,
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
    time: 202
  },
  {
    type: "base",
    time: 202,
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
    time: 203,
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
    time: 203,
    type: "base"
  },
  {
    playerId: "shadow",
    time: 204,
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
    time: 205
  },
  {
    actions: [
      {
        region: "edoras",
        type: "battle-continue"
      }
    ],
    time: 206,
    playerId: "shadow",
    type: "base"
  },
  {
    type: "base",
    time: 207,
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
    time: 208
  },
  {
    playerId: "free-peoples",
    time: 209,
    actions: [
      {
        type: "combat-roll",
        dice: [2]
      }
    ],
    type: "base"
  },
  {
    time: 209,
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
    time: 210,
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
    time: 211
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
    time: 212,
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
    time: 213,
    type: "base",
    playerId: "shadow"
  },
  {
    time: 214,
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
    time: 215
  },
  {
    type: "base",
    actions: [
      {
        type: "army-retreat-into-siege",
        region: "helms-deep"
      }
    ],
    time: 216,
    playerId: "free-peoples"
  },
  {
    playerId: "shadow",
    time: 217,
    type: "base",
    actions: [
      {
        type: "army-advance"
      }
    ]
  },
  {
    type: "die-card",
    time: 218,
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
    time: 219,
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
    time: 220
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
    time: 221
  },
  {
    time: 222,
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
    time: 223
  },
  {
    playerId: "free-peoples",
    type: "die",
    die: "character",
    time: 224,
    actions: [
      {
        type: "fellowship-progress"
      }
    ]
  },
  {
    playerId: "shadow",
    type: "base",
    time: 225,
    actions: [
      {
        type: "hunt-roll",
        dice: [4, 4, 4]
      }
    ]
  },
  {
    playerId: "shadow",
    time: 226,
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
    time: 227
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
    time: 228
  },
  {
    playerId: "shadow",
    time: 228,
    actions: [
      {
        cards: ["scha10", "sstr19"],
        type: "card-draw"
      }
    ],
    type: "base"
  },
  {
    time: 229,
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
    time: 230,
    actions: [],
    type: "base"
  },
  {
    type: "base",
    time: 231,
    playerId: "shadow",
    actions: [
      {
        type: "hunt-allocation",
        quantity: 1
      }
    ]
  },
  {
    time: 232,
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
    time: 232,
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
    time: 233,
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
    time: 234
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
    time: 235,
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
    time: 236,
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
    time: 237,
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
    time: 238,
    card: "sstr02"
  },
  {
    actions: [
      {
        type: "combat-card-choose-not"
      }
    ],
    playerId: "shadow",
    time: 239,
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
    time: 240,
    type: "base"
  },
  {
    time: 240,
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
    time: 241,
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
    time: 241,
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
    time: 242,
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
    time: 243,
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
    time: 244,
    playerId: "shadow",
    actions: [
      {
        type: "combat-card-choose-not"
      }
    ]
  },
  {
    time: 245,
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
    time: 246,
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
    time: 246
  },
  {
    time: 247,
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
    time: 247,
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
    time: 248,
    type: "base"
  },
  {
    playerId: "free-peoples",
    type: "base",
    time: 249,
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
    time: 250
  },
  {
    actions: [
      {
        card: "fpcha10",
        type: "combat-card-choose"
      }
    ],
    playerId: "free-peoples",
    time: 251,
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
    time: 252,
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
    time: 252,
    type: "base"
  },
  {
    time: 253,
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
    time: 254
  },
  {
    playerId: "shadow",
    time: 255,
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
    time: 256,
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
    time: 257,
    actions: [
      {
        type: "fellowship-progress"
      }
    ],
    type: "die",
    playerId: "free-peoples"
  },
  {
    time: 258,
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
    time: 259,
    actions: [
      {
        dice: [2],
        type: "hunt-re-roll"
      }
    ]
  },
  {
    time: 260,
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
    time: 261,
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
    time: 262,
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
    time: 263,
    type: "die",
    playerId: "shadow",
    character: "saruman"
  },
  {
    time: 264,
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
    time: 265,
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
    time: 266
  },
  {
    type: "base",
    playerId: "free-peoples",
    time: 267,
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
    time: 268
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
    time: 269
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
    time: 269
  },
  {
    actions: [
      {
        type: "combat-re-roll",
        dice: [1, 4]
      }
    ],
    time: 270,
    playerId: "free-peoples",
    type: "base"
  },
  {
    type: "base",
    time: 270,
    actions: [
      {
        dice: [4, 5, 4, 1],
        type: "combat-re-roll"
      }
    ],
    playerId: "shadow"
  },
  {
    time: 271,
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
    time: 272,
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
    time: 273
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
    time: 274
  },
  {
    card: "fpcha12",
    type: "die-card",
    actions: [
      {
        quantity: -2,
        type: "fellowship-corruption"
      }
    ],
    die: "event",
    playerId: "free-peoples",
    time: 275
  },
  {
    time: 276,
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
    time: 277,
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
    time: 278
  },
  {
    actions: [
      {
        type: "card-draw",
        cards: ["scha05", "sstr11"]
      }
    ],
    time: 278,
    type: "base",
    playerId: "shadow"
  },
  {
    time: 279,
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
    time: 280,
    actions: [],
    playerId: "free-peoples"
  },
  {
    playerId: "shadow",
    time: 281,
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
    time: 282,
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
        dice: ["muster-army", "muster", "event", "muster", "character", "muster", "event", "army"],
        type: "action-roll"
      }
    ],
    time: 282
  },
  {
    type: "die",
    playerId: "free-peoples",
    actions: [
      {
        type: "fellowship-hide"
      }
    ],
    time: 283,
    die: "character"
  },
  {
    time: 284,
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
    time: 285,
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
    time: 286
  },
  {
    time: 287,
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
    time: 288,
    type: "base",
    actions: [
      {
        type: "combat-card-choose-not"
      }
    ],
    playerId: "shadow"
  },
  {
    time: 289,
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
    time: 290,
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
    time: 290
  },
  {
    type: "base",
    playerId: "free-peoples",
    time: 291,
    actions: [
      {
        dice: [6, 5],
        type: "combat-re-roll"
      }
    ]
  },
  {
    type: "base",
    time: 291,
    actions: [
      {
        type: "combat-re-roll",
        dice: [1, 3, 3]
      }
    ],
    playerId: "shadow"
  },
  {
    time: 292,
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
    time: 293,
    type: "base",
    actions: [
      {
        region: "helms-deep",
        type: "battle-cease"
      }
    ]
  },
  {
    time: 294,
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
    time: 295,
    playerId: "shadow",
    type: "die",
    die: "muster-army"
  },
  {
    playerId: "shadow",
    time: 296,
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
    time: 297,
    actions: [
      {
        type: "combat-card-choose-not"
      }
    ]
  },
  {
    playerId: "free-peoples",
    time: 298,
    actions: [
      {
        type: "combat-roll",
        dice: [3, 2]
      }
    ],
    type: "base"
  },
  {
    time: 298,
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
    time: 299,
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
    time: 299,
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
    time: 300,
    actions: [
      {
        nation: "isengard",
        quantity: 1,
        type: "regular-unit-elimination",
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
    time: 301,
    type: "base"
  },
  {
    time: 302,
    type: "die-pass",
    playerId: "free-peoples"
  },
  {
    playerId: "shadow",
    type: "die-card",
    card: "sstr24",
    time: 303,
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
    time: 304
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
    time: 305,
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
    time: 306,
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
    time: 307,
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
    time: 308
  },
  {
    playerId: "free-peoples",
    type: "base",
    time: 309,
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
    time: 310
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
    time: 311,
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
    time: 312
  },
  {
    time: 313,
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
    time: 314
  },
  {
    type: "base",
    time: 315,
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
    time: 316,
    actions: [
      {
        type: "combat-card-choose-not"
      }
    ]
  },
  {
    playerId: "free-peoples",
    time: 317,
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
    time: 317,
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
    time: 318
  },
  {
    playerId: "shadow",
    type: "base",
    time: 319,
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
    time: 320,
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
    time: 321
  },
  {
    type: "base",
    time: 322,
    actions: [
      {
        type: "army-retreat",
        toRegion: "dol-amroth"
      }
    ],
    playerId: "free-peoples"
  },
  {
    time: 323,
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
    time: 324,
    type: "die",
    playerId: "free-peoples"
  },
  {
    character: "saruman",
    type: "die",
    die: "muster",
    time: 325,
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
    time: 326,
    playerId: "free-peoples"
  },
  {
    playerId: "shadow",
    time: 326,
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
    time: 327,
    playerId: "shadow"
  },
  {
    type: "base",
    time: 328,
    playerId: "free-peoples",
    actions: []
  },
  {
    time: 329,
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
    time: 330,
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
    time: 330
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
    time: 331
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
    time: 332
  },
  {
    type: "die-card",
    playerId: "free-peoples",
    card: "fpcha01",
    time: 333,
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
    time: 334
  },
  {
    playerId: "free-peoples",
    actions: [
      {
        type: "fellowship-progress"
      }
    ],
    die: "character",
    time: 335,
    type: "die"
  },
  {
    time: 336,
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
    time: 337,
    playerId: "free-peoples"
  },
  {
    playerId: "free-peoples",
    time: 338,
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
    time: 339,
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
    time: 340
  },
  {
    time: 341,
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
    time: 342,
    card: "sstr14"
  },
  {
    type: "die",
    playerId: "free-peoples",
    time: 343,
    actions: [
      {
        type: "fellowship-hide"
      }
    ],
    die: "will-of-the-west"
  },
  {
    type: "die",
    time: 344,
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
    time: 345,
    type: "base"
  },
  {
    time: 346,
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
    time: 347,
    actions: [
      {
        type: "combat-card-choose",
        card: "fpcha23"
      }
    ]
  },
  {
    time: 348,
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
    time: 349,
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
    time: 349,
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
    time: 350
  },
  {
    playerId: "shadow",
    actions: [
      {
        type: "combat-re-roll",
        dice: [1, 6, 6]
      }
    ],
    time: 350,
    type: "base"
  },
  {
    time: 351,
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
    time: 352,
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
    time: 353,
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
    time: 354
  },
  {
    actions: [
      {
        type: "army-advance"
      }
    ],
    playerId: "shadow",
    type: "base",
    time: 355
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
    time: 356,
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
    time: 357
  },
  {
    playerId: "shadow",
    time: 357,
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
    time: 358,
    actions: []
  },
  {
    time: 359,
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
    time: 360,
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
    time: 360,
    type: "base"
  },
  {
    time: 361,
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
    time: 362
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
    time: 363
  },
  {
    playerId: "free-peoples",
    time: 364,
    type: "die-pass"
  },
  {
    time: 365,
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
    time: 366
  },
  {
    time: 367,
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
    time: 368,
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
    time: 369
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
    time: 369
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
    time: 370
  },
  {
    time: 371,
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
    time: 372,
    type: "base",
    playerId: "free-peoples"
  },
  {
    playerId: "shadow",
    time: 373,
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
    time: 374,
    playerId: "free-peoples",
    type: "base"
  },
  {
    type: "base",
    time: 375,
    actions: [
      {
        type: "army-advance"
      }
    ],
    playerId: "shadow"
  },
  {
    card: "fpcha14",
    time: 376,
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
    time: 377,
    die: "character"
  },
  {
    time: 378,
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
    time: 379
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
    time: 380
  },
  {
    playerId: "shadow",
    type: "base",
    time: 380,
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
    time: 381
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
    time: 382,
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
    time: 383,
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
    time: 384,
    type: "die"
  },
  {
    time: 385,
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
    time: 386,
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
    time: 387
  },
  {
    time: 388,
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
    time: 389
  },
  {
    type: "base",
    time: 390,
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
    time: 391
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
    time: 392
  },
  {
    time: 393,
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
    time: 394,
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
    time: 395,
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
    time: 396,
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
    time: 397,
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
    time: 398,
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
    time: 399,
    playerId: "shadow"
  },
  {
    type: "base",
    playerId: "free-peoples",
    time: 400,
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
    time: 401
  },
  {
    type: "base",
    playerId: "shadow",
    time: 401,
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
    time: 402,
    type: "base"
  },
  {
    playerId: "shadow",
    time: 402,
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
    time: 403,
    playerId: "shadow",
    type: "base"
  },
  {
    time: 404,
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
    time: 405,
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
    time: 406,
    playerId: "free-peoples",
    actions: [
      {
        cards: ["fpcha04", "fpstr04"],
        type: "card-draw"
      }
    ]
  },
  {
    time: 406,
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
    time: 407,
    actions: [],
    playerId: "free-peoples",
    type: "base"
  },
  {
    time: 408,
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
    time: 409,
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
    time: 409,
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
    time: 410,
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
    time: 411
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
    time: 412,
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
    time: 413,
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
    time: 414,
    type: "die"
  },
  {
    type: "base",
    playerId: "shadow",
    time: 415,
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
    time: 416
  },
  {
    actions: [
      {
        dice: [1, 4, 3, 5],
        type: "combat-roll"
      }
    ],
    type: "base",
    time: 417,
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
    time: 417
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
    time: 418
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
    time: 418
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
    time: 419
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
    time: 420
  },
  {
    card: "fpcha04",
    time: 421,
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
    time: 422,
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
    time: 423,
    die: "character"
  },
  {
    time: 424,
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
    time: 425,
    card: "fpcha05",
    type: "card-effect-skip",
    playerId: "free-peoples"
  },
  {
    time: 426,
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
    time: 427,
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
    time: 428,
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
    time: 429
  },
  {
    actions: [
      {
        type: "combat-roll",
        dice: [6, 3, 2, 4]
      }
    ],
    playerId: "free-peoples",
    time: 430,
    type: "base"
  },
  {
    time: 430,
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
    time: 431,
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
    time: 431,
    playerId: "shadow",
    actions: [
      {
        dice: [1, 5, 4, 4],
        type: "combat-re-roll"
      }
    ]
  },
  {
    time: 432,
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
    time: 433,
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
    time: 434,
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
    time: 435,
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
    time: 436,
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
    time: 437,
    playerId: "free-peoples"
  },
  {
    time: 438,
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
    time: 439,
    actions: [
      {
        type: "combat-card-choose-not"
      }
    ],
    type: "base",
    playerId: "shadow"
  },
  {
    time: 440,
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
    time: 441,
    playerId: "free-peoples"
  },
  {
    time: 441,
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
    time: 442,
    type: "base"
  },
  {
    time: 443,
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
    time: 444,
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
    time: 445,
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
    time: 446,
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
    time: 447,
    playerId: "free-peoples"
  },
  {
    time: 447,
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
    time: 448,
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
    time: 449,
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
    time: 450,
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
    time: 451,
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
    time: 452,
    type: "base"
  },
  {
    type: "base",
    time: 453,
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
    time: 454
  },
  {
    time: 455,
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
    time: 455
  },
  {
    actions: [],
    type: "base",
    time: 456,
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
    time: 457,
    playerId: "shadow"
  },
  {
    playerId: "free-peoples",
    type: "base",
    time: 458,
    actions: [
      {
        dice: ["muster-army", "muster-army", "muster", "muster", "event", "character"],
        type: "action-roll"
      }
    ]
  },
  {
    type: "base",
    time: 458,
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
    time: 459,
    die: "character"
  },
  {
    type: "base",
    playerId: "shadow",
    time: 460,
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
    time: 461
  },
  {
    time: 462,
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
    time: 463,
    type: "die",
    playerId: "free-peoples"
  },
  {
    time: 464,
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
    time: 465,
    type: "base"
  },
  {
    type: "base",
    actions: [
      {
        type: "combat-card-choose-not"
      }
    ],
    time: 466,
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
    time: 467,
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
    time: 468
  },
  {
    time: 469,
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
    time: 469,
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
    time: 470,
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
    time: 471,
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
    time: 472,
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
    time: 473,
    type: "base",
    playerId: "shadow"
  },
  {
    time: 474,
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
    time: 475,
    playerId: "shadow",
    type: "die"
  },
  {
    playerId: "shadow",
    time: 476,
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
    time: 477,
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
    time: 478,
    playerId: "free-peoples"
  },
  {
    actions: [
      {
        dice: [4, 4, 4, 2, 4],
        type: "combat-roll"
      }
    ],
    time: 478,
    type: "base",
    playerId: "shadow"
  },
  {
    type: "base",
    time: 479,
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
    time: 479,
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
    time: 480,
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
    time: 481,
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
    time: 482
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
    time: 483
  },
  {
    type: "die",
    playerId: "free-peoples",
    time: 484,
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
    time: 485,
    type: "base",
    actions: [
      {
        type: "combat-card-choose-not"
      }
    ]
  },
  {
    type: "base",
    time: 486,
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
    time: 487
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
    time: 487
  },
  {
    time: 488,
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
    time: 489,
    type: "base"
  },
  {
    type: "die-pass",
    time: 490,
    playerId: "shadow"
  },
  {
    card: "fpcha18",
    playerId: "free-peoples",
    type: "die-card",
    time: 491,
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
    time: 492,
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
    time: 493,
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
    time: 494,
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
    time: 495,
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
    time: 496,
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
    time: 497
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
    time: 497
  },
  {
    time: 498,
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
    time: 499
  },
  {
    actions: [
      {
        type: "action-roll",
        dice: ["muster", "character", "event", "character", "will-of-the-west", "will-of-the-west"]
      }
    ],
    time: 500,
    type: "base",
    playerId: "free-peoples"
  },
  {
    type: "base",
    time: 500,
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
    time: 501,
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
    time: 502,
    playerId: "shadow"
  },
  {
    playerId: "shadow",
    card: "scha21",
    time: 503,
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
    time: 504
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
    time: 505,
    playerId: "shadow"
  },
  {
    type: "die-card",
    card: "fpstr20",
    playerId: "free-peoples",
    time: 506,
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
    time: 507,
    type: "die",
    playerId: "shadow"
  },
  {
    time: 508,
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
    time: 509,
    type: "die"
  },
  {
    time: 510,
    actions: [
      {
        type: "combat-card-choose-not"
      }
    ],
    playerId: "shadow",
    type: "base"
  },
  {
    time: 511,
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
    time: 512,
    playerId: "free-peoples",
    actions: [
      {
        type: "combat-roll",
        dice: [6, 4, 2]
      }
    ]
  },
  {
    time: 512,
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
    time: 513,
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
    time: 513,
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
    time: 514
  },
  {
    playerId: "free-peoples",
    time: 515,
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
    time: 516,
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
    time: 517,
    type: "base",
    playerId: "free-peoples"
  },
  {
    time: 518,
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
    time: 519
  },
  {
    actions: [
      {
        toRegion: "the-shire",
        type: "army-attack",
        fromRegion: "evendim"
      }
    ],
    time: 520,
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
    time: 521,
    playerId: "shadow",
    type: "base"
  },
  {
    playerId: "free-peoples",
    time: 522,
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
    time: 523,
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
    time: 523,
    playerId: "shadow",
    type: "base"
  },
  {
    time: 524,
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
    time: 524
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
    time: 525,
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
    time: 526,
    playerId: "shadow"
  },
  {
    actions: [
      {
        type: "army-not-retreat"
      }
    ],
    time: 527,
    playerId: "free-peoples",
    type: "base"
  },
  {
    type: "base",
    playerId: "shadow",
    time: 528,
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
    time: 529,
    type: "base",
    playerId: "free-peoples"
  },
  {
    playerId: "free-peoples",
    type: "base",
    time: 530,
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
    time: 530,
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
    time: 531
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
    time: 531
  },
  {
    playerId: "shadow",
    time: 532,
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
    time: 533
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
    time: 534
  },
  {
    playerId: "shadow",
    type: "base",
    time: 535,
    actions: [
      {
        type: "combat-card-choose",
        card: "sstr18"
      }
    ]
  },
  {
    type: "base",
    time: 536,
    actions: [
      {
        type: "combat-card-choose-not"
      }
    ],
    playerId: "free-peoples"
  },
  {
    time: 537,
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
    time: 538,
    actions: [
      {
        type: "combat-roll",
        dice: [3]
      }
    ]
  },
  {
    time: 538,
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
    time: 539,
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
    time: 540,
    actions: [
      {
        type: "army-advance"
      }
    ],
    playerId: "shadow"
  },
  {
    playerId: "free-peoples",
    time: 541,
    type: "die-pass"
  },
  {
    playerId: "shadow",
    time: 542,
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
    time: 543,
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
    time: 544,
    actions: [
      {
        type: "army-advance"
      }
    ],
    playerId: "shadow"
  },
  {
    type: "die",
    time: 545,
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
    time: 546,
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
    time: 547,
    type: "base"
  },
  {
    time: 548,
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
    time: 549,
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
    time: 549
  },
  {
    time: 550,
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
    time: 551,
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
    time: 551
  },
  {
    type: "base",
    playerId: "free-peoples",
    actions: [],
    time: 552
  },
  {
    type: "base",
    time: 553,
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
    time: 554,
    playerId: "free-peoples",
    type: "base"
  },
  {
    time: 554,
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
    time: 555,
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
    time: 556,
    actions: [
      {
        type: "hunt-tile-draw",
        tiles: ["er"]
      }
    ]
  },
  {
    playerId: "free-peoples",
    time: 557,
    card: "fpcha05",
    type: "card-effect-skip"
  },
  {
    time: 558,
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
    time: 559,
    playerId: "shadow"
  },
  {
    type: "die",
    die: "muster-army",
    playerId: "free-peoples",
    time: 560,
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
    time: 561,
    actions: [
      {
        fromRegion: "dale",
        toRegion: "woodland-realm",
        type: "army-attack"
      }
    ]
  },
  {
    time: 562,
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
    time: 563,
    actions: [
      {
        type: "army-advance"
      }
    ]
  },
  {
    time: 564,
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
    time: 565,
    die: "army",
    playerId: "shadow"
  },
  {
    time: 566,
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
    time: 567,
    actions: [
      {
        card: "fpstr22",
        type: "combat-card-choose"
      }
    ],
    type: "base"
  },
  {
    time: 568,
    card: "scha15",
    type: "combat-card-effect-skip",
    playerId: "shadow"
  },
  {
    type: "base",
    playerId: "free-peoples",
    time: 569,
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
    time: 569,
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
    time: 570
  },
  {
    actions: [
      {
        type: "combat-re-roll",
        dice: [2, 2, 5, 3]
      }
    ],
    time: 570,
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
    time: 571,
    playerId: "shadow"
  },
  {
    type: "base",
    time: 572,
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
    time: 573,
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
    time: 574,
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
    time: 575
  },
  {
    type: "base",
    time: 576,
    actions: [
      {
        type: "combat-card-choose-not"
      }
    ],
    playerId: "free-peoples"
  },
  {
    time: 577,
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
    time: 577,
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
    time: 578,
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
    time: 578,
    type: "base",
    playerId: "shadow"
  },
  {
    time: 579,
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
    time: 580,
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
    time: 581,
    actions: [
      {
        type: "combat-card-choose-not"
      }
    ]
  },
  {
    type: "base",
    time: 582,
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
    time: 583,
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
    time: 583,
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
    time: 584
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
    time: 584
  },
  {
    time: 585,
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
    time: 586
  },
  {
    time: 587,
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
    time: 588,
    type: "base",
    actions: [
      {
        type: "combat-card-choose-not"
      }
    ]
  },
  {
    time: 589,
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
    time: 589
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
    time: 590
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
    time: 590
  },
  {
    time: 591,
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
    time: 592,
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
    time: 593,
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
    time: 594,
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
    time: 595,
    playerId: "shadow"
  },
  {
    type: "base",
    time: 596,
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
    time: 597,
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
    time: 597,
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
    time: 598
  },
  {
    type: "base",
    time: 598,
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
    time: 599,
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
    time: 600,
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
    time: 601,
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
    time: 602
  },
  {
    playerId: "free-peoples",
    type: "base",
    actions: [
      {
        type: "combat-card-choose-not"
      }
    ],
    time: 603
  },
  {
    playerId: "shadow",
    actions: [
      {
        type: "combat-card-choose-not"
      }
    ],
    time: 604,
    type: "base"
  },
  {
    playerId: "free-peoples",
    type: "base",
    time: 605,
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
    time: 605,
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
    time: 606
  },
  {
    time: 607,
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
    time: 608,
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
    time: 609
  },
  {
    playerId: "free-peoples",
    time: 610,
    type: "base",
    actions: [
      {
        type: "combat-roll",
        dice: [6, 2, 6]
      }
    ]
  },
  {
    time: 610,
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
    time: 611,
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
    time: 612,
    die: "event"
  }
];
