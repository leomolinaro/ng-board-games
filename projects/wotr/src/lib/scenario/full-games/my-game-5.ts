import { WotrScenarioDefinition } from '../wotr-scenario';
import { WotrStoriesBuilder } from '../wotr-story-builder';

export const scenario: WotrScenarioDefinition = {
  options: {
    tokens: [],
    expansions: [],
    variants: [],
  },
  stories: (b: WotrStoriesBuilder) => [
    {
      actions: [
        {
          type: 'card-draw',
          cards: ['fpcha16', 'fpstr14'],
        },
      ],
      time: 1,
      type: 'base',
      playerId: 'free-peoples',
    },
    {
      type: 'base',
      time: 1,
      actions: [
        {
          cards: ['scha08', 'sstr09'],
          type: 'card-draw',
        },
      ],
      playerId: 'shadow',
    },
    {
      actions: [],
      type: 'base',
      time: 2,
      playerId: 'free-peoples',
    },
    {
      playerId: 'shadow',
      actions: [
        {
          type: 'hunt-allocation',
          quantity: 1,
        },
      ],
      time: 3,
      type: 'base',
    },
    {
      playerId: 'free-peoples',
      time: 4,
      type: 'base',
      actions: [
        {
          dice: ['event', 'event', 'muster', 'character'],
          type: 'action-roll',
        },
      ],
    },
    {
      playerId: 'shadow',
      type: 'base',
      time: 4,
      actions: [
        {
          type: 'action-roll',
          dice: [
            'character',
            'eye',
            'muster-army',
            'character',
            'muster',
            'eye',
          ],
        },
      ],
    },
    {
      actions: [
        {
          type: 'card-draw',
          cards: ['fpcha23'],
        },
      ],
      time: 5,
      type: 'token',
      token: 'draw-card',
      playerId: 'free-peoples',
    },
    {
      die: 'character',
      playerId: 'shadow',
      type: 'die',
      time: 6,
      actions: [
        {
          toRegion: 'south-anduin-vale',
          type: 'army-movement',
          fromRegion: 'dol-guldur',
        },
      ],
    },
    {
      time: 7,
      type: 'die',
      die: 'event',
      actions: [
        {
          cards: ['fpcha21'],
          type: 'card-draw',
        },
      ],
      playerId: 'free-peoples',
    },
    {
      die: 'character',
      actions: [
        {
          toRegion: 'south-anduin-vale',
          nNazgul: 1,
          type: 'nazgul-movement',
          fromRegion: 'barad-dur',
        },
        {
          toRegion: 'south-anduin-vale',
          nNazgul: 1,
          type: 'nazgul-movement',
          fromRegion: 'minas-morgul',
        },
        {
          fromRegion: 'morannon',
          type: 'nazgul-movement',
          nNazgul: 1,
          toRegion: 'south-anduin-vale',
        },
      ],
      playerId: 'shadow',
      time: 8,
      type: 'die',
    },
    {
      die: 'character',
      playerId: 'free-peoples',
      time: 9,
      type: 'die',
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
    },
    {
      playerId: 'shadow',
      actions: [
        {
          dice: [4, 3, 3],
          type: 'hunt-roll',
        },
      ],
      type: 'base',
      time: 10,
    },
    {
      die: 'muster',
      actions: [
        {
          nation: 'isengard',
          type: 'political-advance',
          quantity: 1,
        },
      ],
      playerId: 'shadow',
      type: 'die',
      time: 11,
    },
    {
      time: 12,
      type: 'die',
      actions: [
        {
          type: 'card-draw',
          cards: ['fpcha15'],
        },
      ],
      playerId: 'free-peoples',
      die: 'event',
    },
    {
      actions: [
        {
          region: 'orthanc',
          characters: ['saruman'],
          type: 'character-play',
        },
      ],
      die: 'muster-army',
      playerId: 'shadow',
      type: 'die',
      time: 13,
    },
    {
      card: 'fpstr14',
      actions: [
        {
          type: 'elite-unit-recruitment',
          quantity: 1,
          nation: 'gondor',
          region: 'minas-tirith',
        },
        {
          type: 'leader-recruitment',
          nation: 'gondor',
          region: 'minas-tirith',
          quantity: 1,
        },
      ],
      die: 'muster',
      time: 14,
      type: 'die-card',
      playerId: 'free-peoples',
    },
    {
      type: 'token-skip',
      time: 15,
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          cards: ['fpcha03', 'fpstr16'],
          type: 'card-draw',
        },
      ],
      playerId: 'free-peoples',
      time: 16,
      type: 'base',
    },
    {
      time: 16,
      type: 'base',
      actions: [
        {
          cards: ['scha03', 'sstr12'],
          type: 'card-draw',
        },
      ],
      playerId: 'shadow',
    },
    {
      actions: [],
      playerId: 'free-peoples',
      type: 'base',
      time: 17,
    },
    {
      playerId: 'shadow',
      actions: [
        {
          type: 'hunt-allocation',
          quantity: 1,
        },
      ],
      time: 18,
      type: 'base',
    },
    {
      type: 'base',
      time: 19,
      playerId: 'free-peoples',
      actions: [
        {
          dice: ['will-of-the-west', 'event', 'will-of-the-west', 'event'],
          type: 'action-roll',
        },
      ],
    },
    {
      time: 19,
      type: 'base',
      actions: [
        {
          dice: [
            'muster',
            'character',
            'event',
            'muster-army',
            'character',
            'event',
            'muster-army',
          ],
          type: 'action-roll',
        },
      ],
      playerId: 'shadow',
    },
    {
      playerId: 'free-peoples',
      type: 'die-pass',
      time: 20,
    },
    {
      character: 'saruman',
      type: 'die',
      playerId: 'shadow',
      time: 21,
      actions: [
        {
          nation: 'isengard',
          region: 'north-dunland',
          type: 'regular-unit-recruitment',
          quantity: 1,
        },
        {
          type: 'regular-unit-recruitment',
          nation: 'isengard',
          region: 'south-dunland',
          quantity: 1,
        },
        {
          type: 'regular-unit-recruitment',
          nation: 'isengard',
          quantity: 1,
          region: 'orthanc',
        },
      ],
      die: 'muster',
    },
    {
      type: 'die-pass',
      time: 22,
      playerId: 'free-peoples',
    },
    {
      type: 'die',
      time: 23,
      die: 'muster-army',
      playerId: 'shadow',
      actions: [
        {
          fromRegion: 'north-dunland',
          toRegion: 'moria',
          type: 'army-movement',
        },
        {
          toRegion: 'dimrill-dale',
          type: 'army-movement',
          fromRegion: 'south-anduin-vale',
        },
      ],
    },
    {
      playerId: 'free-peoples',
      time: 24,
      type: 'die-pass',
    },
    {
      actions: [
        {
          type: 'political-advance',
          quantity: 1,
          nation: 'sauron',
        },
      ],
      playerId: 'shadow',
      type: 'die',
      time: 25,
      die: 'muster-army',
    },
    {
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
      type: 'die',
      time: 26,
      playerId: 'free-peoples',
      die: 'will-of-the-west',
    },
    {
      actions: [
        {
          type: 'hunt-roll',
          dice: [2],
        },
      ],
      playerId: 'shadow',
      time: 27,
      type: 'base',
    },
    {
      type: 'die',
      time: 28,
      die: 'event',
      playerId: 'shadow',
      actions: [
        {
          type: 'card-draw',
          cards: ['sstr02'],
        },
      ],
    },
    {
      card: 'fpstr16',
      die: 'event',
      type: 'die-card',
      time: 29,
      playerId: 'free-peoples',
      actions: [
        {
          nation: 'rohan',
          type: 'elite-unit-recruitment',
          region: 'edoras',
          quantity: 1,
        },
        {
          region: 'edoras',
          type: 'leader-recruitment',
          quantity: 1,
          nation: 'rohan',
        },
      ],
    },
    {
      time: 30,
      type: 'character-effect',
      playerId: 'free-peoples',
      actions: [
        {
          type: 'card-draw',
          cards: ['fpstr17'],
        },
      ],
      character: 'gandalf-the-grey',
    },
    {
      playerId: 'shadow',
      die: 'character',
      card: 'scha03',
      time: 31,
      type: 'die-card',
      actions: [
        {
          type: 'hunt-tile-add',
          tile: 'r3s',
        },
      ],
    },
    {
      card: 'fpcha03',
      actions: [
        {
          tile: 'b-2',
          type: 'hunt-tile-add',
        },
      ],
      playerId: 'free-peoples',
      time: 32,
      type: 'die-card',
      die: 'event',
    },
    {
      character: 'gandalf-the-grey',
      type: 'character-effect',
      time: 33,
      playerId: 'free-peoples',
      actions: [
        {
          type: 'card-draw',
          cards: ['fpcha17'],
        },
      ],
    },
    {
      actions: [
        {
          cards: ['scha07'],
          type: 'card-draw',
        },
      ],
      die: 'event',
      playerId: 'shadow',
      time: 34,
      type: 'die',
    },
    {
      type: 'die',
      time: 35,
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
      die: 'will-of-the-west',
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          dice: [5],
          type: 'hunt-roll',
        },
      ],
      type: 'base',
      time: 36,
      playerId: 'shadow',
    },
    {
      actions: [
        {
          tiles: ['1r'],
          type: 'hunt-tile-draw',
        },
      ],
      type: 'base',
      time: 37,
      playerId: 'shadow',
    },
    {
      actions: [
        {
          quantity: 1,
          type: 'fellowship-corruption',
        },
      ],
      time: 38,
      type: 'base',
      playerId: 'free-peoples',
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          type: 'fellowship-reveal',
          region: 'goblins-gate',
        },
      ],
      type: 'base',
      time: 39,
    },
    {
      die: 'character',
      type: 'die-card',
      time: 40,
      playerId: 'shadow',
      actions: [
        {
          tiles: ['1'],
          type: 'hunt-tile-draw',
        },
      ],
      card: 'scha07',
    },
    {
      type: 'base',
      time: 41,
      actions: [
        {
          type: 'companion-random',
          companions: ['strider'],
        },
      ],
      playerId: 'free-peoples',
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          type: 'character-elimination',
          characters: ['strider'],
        },
      ],
      type: 'base',
      time: 42,
    },
    {
      playerId: 'free-peoples',
      type: 'token-skip',
      time: 43,
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          cards: ['fpcha10', 'fpstr05'],
          type: 'card-draw',
        },
      ],
      type: 'base',
      time: 44,
    },
    {
      actions: [
        {
          cards: ['scha14', 'sstr19'],
          type: 'card-draw',
        },
      ],
      time: 44,
      type: 'base',
      playerId: 'shadow',
    },
    {
      type: 'base',
      time: 45,
      playerId: 'free-peoples',
      actions: [
        {
          cards: ['fpstr05', 'fpcha16'],
          type: 'card-discard',
        },
      ],
    },
    {
      actions: [],
      time: 46,
      type: 'base',
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          quantity: 1,
          type: 'hunt-allocation',
        },
      ],
      playerId: 'shadow',
      type: 'base',
      time: 47,
    },
    {
      type: 'base',
      time: 48,
      actions: [
        {
          dice: ['event', 'muster-army', 'character', 'will-of-the-west'],
          type: 'action-roll',
        },
      ],
      playerId: 'free-peoples',
    },
    {
      playerId: 'shadow',
      type: 'base',
      time: 48,
      actions: [
        {
          dice: [
            'army',
            'event',
            'event',
            'event',
            'character',
            'muster-army',
            'eye',
          ],
          type: 'action-roll',
        },
      ],
    },
    {
      die: 'character',
      time: 49,
      type: 'die',
      playerId: 'free-peoples',
      actions: [
        {
          type: 'fellowship-hide',
        },
      ],
    },
    {
      actions: [
        {
          type: 'army-movement',
          toRegion: 'dimrill-dale',
          fromRegion: 'moria',
        },
        {
          type: 'army-movement',
          fromRegion: 'barad-dur',
          toRegion: 'gorgoroth',
        },
      ],
      playerId: 'shadow',
      time: 50,
      type: 'die',
      die: 'army',
    },
    {
      time: 51,
      type: 'die-pass',
      playerId: 'free-peoples',
    },
    {
      playerId: 'shadow',
      card: 'scha08',
      type: 'die-card',
      time: 52,
      die: 'event',
      actions: [
        {
          dice: [2, 3, 2],
          type: 'combat-roll',
        },
      ],
    },
    {
      playerId: 'free-peoples',
      type: 'die-pass',
      time: 53,
    },
    {
      playerId: 'shadow',
      time: 54,
      type: 'die',
      die: 'character',
      actions: [
        {
          type: 'army-attack',
          fromRegion: 'dimrill-dale',
          toRegion: 'lorien',
        },
      ],
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          region: 'lorien',
          type: 'army-retreat-into-siege',
        },
      ],
      type: 'base',
      time: 55,
    },
    {
      type: 'base',
      time: 56,
      actions: [
        {
          type: 'army-advance',
        },
      ],
      playerId: 'shadow',
    },
    {
      die: 'event',
      card: 'fpcha15',
      playerId: 'free-peoples',
      type: 'die-card',
      time: 57,
      actions: [
        {
          type: 'companion-separation',
          companions: ['peregrin'],
          toRegion: 'dale',
        },
      ],
    },
    {
      time: 58,
      type: 'character-effect',
      character: 'gandalf-the-grey',
      playerId: 'free-peoples',
      actions: [
        {
          cards: ['fpcha07'],
          type: 'card-draw',
        },
      ],
    },
    {
      type: 'die',
      time: 59,
      die: 'muster-army',
      playerId: 'shadow',
      actions: [
        {
          toRegion: 'lorien',
          fromRegion: 'lorien',
          type: 'army-attack',
        },
      ],
    },
    {
      time: 60,
      type: 'base',
      playerId: 'shadow',
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
    },
    {
      playerId: 'free-peoples',
      type: 'base',
      time: 61,
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
    },
    {
      playerId: 'free-peoples',
      type: 'base',
      time: 62,
      actions: [
        {
          dice: [1, 1, 1],
          type: 'combat-roll',
        },
      ],
    },
    {
      actions: [
        {
          dice: [4, 1, 1, 4, 6],
          type: 'combat-roll',
        },
      ],
      playerId: 'shadow',
      time: 62,
      type: 'base',
    },
    {
      playerId: 'free-peoples',
      type: 'base',
      time: 63,
      actions: [
        {
          type: 'combat-re-roll',
          dice: [5],
        },
      ],
    },
    {
      playerId: 'shadow',
      actions: [
        {
          dice: [3, 1, 2, 6],
          type: 'combat-re-roll',
        },
      ],
      time: 63,
      type: 'base',
    },
    {
      actions: [
        {
          region: 'lorien',
          quantity: 1,
          nation: 'sauron',
          type: 'regular-unit-elimination',
        },
      ],
      playerId: 'shadow',
      type: 'base',
      time: 64,
    },
    {
      time: 65,
      type: 'base',
      actions: [
        {
          quantity: 2,
          region: 'lorien',
          nation: 'elves',
          type: 'elite-unit-downgrade',
        },
      ],
      playerId: 'free-peoples',
    },
    {
      playerId: 'shadow',
      type: 'base',
      time: 66,
      actions: [
        {
          region: 'lorien',
          type: 'battle-cease',
        },
      ],
    },
    {
      time: 67,
      type: 'die-card',
      actions: [
        {
          type: 'elite-unit-recruitment',
          region: 'carrock',
          quantity: 1,
          nation: 'north',
        },
        {
          nation: 'north',
          quantity: 1,
          region: 'carrock',
          type: 'leader-recruitment',
        },
      ],
      card: 'fpstr17',
      playerId: 'free-peoples',
      die: 'muster-army',
    },
    {
      card: 'sstr02',
      actions: [
        {
          fromRegion: 'lorien',
          type: 'army-attack',
          toRegion: 'lorien',
        },
      ],
      playerId: 'shadow',
      type: 'die-card',
      time: 68,
      die: 'event',
    },
    {
      playerId: 'shadow',
      type: 'base',
      time: 69,
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
    },
    {
      type: 'base',
      time: 70,
      playerId: 'free-peoples',
      actions: [
        {
          dice: [2, 3, 6],
          type: 'combat-roll',
        },
      ],
    },
    {
      actions: [
        {
          dice: [2, 4, 3, 6, 2],
          type: 'combat-roll',
        },
      ],
      type: 'base',
      time: 70,
      playerId: 'shadow',
    },
    {
      actions: [
        {
          dice: [1],
          type: 'combat-re-roll',
        },
      ],
      type: 'base',
      time: 71,
      playerId: 'free-peoples',
    },
    {
      type: 'base',
      time: 71,
      playerId: 'shadow',
      actions: [
        {
          type: 'combat-re-roll',
          dice: [4, 1, 4, 2],
        },
      ],
    },
    {
      actions: [
        {
          region: 'lorien',
          quantity: 1,
          type: 'regular-unit-elimination',
          nation: 'sauron',
        },
      ],
      playerId: 'shadow',
      time: 72,
      type: 'base',
    },
    {
      actions: [
        {
          region: 'lorien',
          type: 'regular-unit-elimination',
          nation: 'elves',
          quantity: 1,
        },
      ],
      type: 'base',
      time: 73,
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
      type: 'base',
      time: 74,
      playerId: 'shadow',
    },
    {
      type: 'base',
      time: 75,
      playerId: 'free-peoples',
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
    },
    {
      time: 76,
      type: 'base',
      playerId: 'free-peoples',
      actions: [
        {
          type: 'combat-roll',
          dice: [3, 4],
        },
      ],
    },
    {
      time: 76,
      type: 'base',
      playerId: 'shadow',
      actions: [
        {
          type: 'combat-roll',
          dice: [1, 3, 5, 2, 3],
        },
      ],
    },
    {
      playerId: 'free-peoples',
      type: 'base',
      time: 77,
      actions: [
        {
          dice: [5],
          type: 'combat-re-roll',
        },
      ],
    },
    {
      actions: [
        {
          type: 'combat-re-roll',
          dice: [2, 5, 3, 6],
        },
      ],
      playerId: 'shadow',
      time: 77,
      type: 'base',
    },
    {
      type: 'base',
      time: 78,
      actions: [
        {
          type: 'regular-unit-elimination',
          nation: 'sauron',
          quantity: 1,
          region: 'lorien',
        },
      ],
      playerId: 'shadow',
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          quantity: 1,
          region: 'lorien',
          nation: 'elves',
          type: 'regular-unit-elimination',
        },
      ],
      time: 79,
      type: 'base',
    },
    {
      playerId: 'shadow',
      type: 'base',
      time: 80,
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
    },
    {
      type: 'base',
      time: 81,
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          type: 'combat-roll',
          dice: [6],
        },
      ],
      playerId: 'free-peoples',
      type: 'base',
      time: 82,
    },
    {
      actions: [
        {
          type: 'combat-roll',
          dice: [4, 4, 4, 2, 1],
        },
      ],
      time: 82,
      type: 'base',
      playerId: 'shadow',
    },
    {
      actions: [
        {
          type: 'combat-re-roll',
          dice: [2, 2, 4, 5],
        },
      ],
      playerId: 'shadow',
      type: 'base',
      time: 83,
    },
    {
      time: 84,
      type: 'base',
      actions: [
        {
          type: 'regular-unit-elimination',
          nation: 'sauron',
          quantity: 1,
          region: 'lorien',
        },
      ],
      playerId: 'shadow',
    },
    {
      time: 85,
      type: 'base',
      actions: [
        {
          type: 'elite-unit-downgrade',
          nation: 'sauron',
          region: 'lorien',
          quantity: 1,
        },
        {
          type: 'battle-continue',
          region: 'lorien',
        },
      ],
      playerId: 'shadow',
    },
    {
      type: 'base',
      time: 86,
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
      playerId: 'shadow',
    },
    {
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
      type: 'base',
      time: 87,
      playerId: 'free-peoples',
    },
    {
      time: 88,
      type: 'base',
      actions: [
        {
          dice: [2],
          type: 'combat-roll',
        },
      ],
      playerId: 'free-peoples',
    },
    {
      playerId: 'shadow',
      actions: [
        {
          type: 'combat-roll',
          dice: [4, 4, 1, 1, 1],
        },
      ],
      type: 'base',
      time: 88,
    },
    {
      time: 89,
      type: 'base',
      actions: [
        {
          type: 'combat-re-roll',
          dice: [2],
        },
      ],
      playerId: 'free-peoples',
    },
    {
      playerId: 'shadow',
      type: 'base',
      time: 89,
      actions: [
        {
          dice: [1, 5, 4, 5],
          type: 'combat-re-roll',
        },
      ],
    },
    {
      time: 90,
      type: 'die',
      die: 'will-of-the-west',
      playerId: 'free-peoples',
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
    },
    {
      playerId: 'shadow',
      type: 'base',
      time: 91,
      actions: [
        {
          type: 'hunt-roll',
          dice: [2, 6],
        },
      ],
    },
    {
      type: 'base',
      time: 92,
      playerId: 'shadow',
      actions: [
        {
          tiles: ['0r'],
          type: 'hunt-tile-draw',
        },
      ],
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          type: 'fellowship-reveal',
          region: 'old-ford',
        },
      ],
      time: 93,
      type: 'base',
    },
    {
      type: 'die-card',
      time: 94,
      die: 'event',
      actions: [
        {
          tiles: ['1'],
          type: 'hunt-tile-draw',
        },
      ],
      playerId: 'shadow',
      card: 'scha14',
    },
    {
      actions: [
        {
          type: 'companion-separation',
          companions: ['legolas'],
          toRegion: 'northern-mirkwood',
        },
      ],
      playerId: 'free-peoples',
      card: 'scha14',
      type: 'card-effect',
      time: 95,
    },
    {
      type: 'token-skip',
      time: 96,
      playerId: 'free-peoples',
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          type: 'card-draw',
          cards: ['fpcha04', 'fpstr07'],
        },
      ],
      time: 97,
      type: 'base',
    },
    {
      playerId: 'shadow',
      time: 97,
      type: 'base',
      actions: [
        {
          type: 'card-draw',
          cards: ['scha22', 'sstr08'],
        },
      ],
    },
    {
      type: 'base',
      time: 98,
      playerId: 'free-peoples',
      actions: [
        {
          cards: ['fpstr07'],
          type: 'card-discard',
        },
      ],
    },
    {
      actions: [],
      type: 'base',
      time: 99,
      playerId: 'free-peoples',
    },
    {
      playerId: 'shadow',
      type: 'base',
      time: 100,
      actions: [
        {
          type: 'hunt-allocation',
          quantity: 1,
        },
      ],
    },
    {
      actions: [
        {
          dice: ['muster', 'muster-army', 'muster', 'muster-army'],
          type: 'action-roll',
        },
      ],
      type: 'base',
      time: 101,
      playerId: 'free-peoples',
    },
    {
      type: 'base',
      time: 101,
      actions: [
        {
          type: 'action-roll',
          dice: [
            'event',
            'character',
            'event',
            'muster',
            'muster-army',
            'event',
            'eye',
          ],
        },
      ],
      playerId: 'shadow',
    },
    {
      die: 'character',
      elvenRing: {
        toDie: 'character',
        ring: 'vilya',
        fromDie: 'muster',
      },
      actions: [
        {
          type: 'fellowship-hide',
        },
      ],
      type: 'die',
      time: 102,
      playerId: 'free-peoples',
    },
    {
      die: 'character',
      time: 103,
      type: 'die',
      actions: [
        {
          type: 'army-attack',
          toRegion: 'lorien',
          fromRegion: 'lorien',
        },
      ],
      playerId: 'shadow',
    },
    {
      playerId: 'shadow',
      type: 'base',
      time: 104,
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
    },
    {
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
      time: 105,
      type: 'base',
      playerId: 'free-peoples',
    },
    {
      time: 106,
      type: 'base',
      actions: [
        {
          dice: [3],
          type: 'combat-roll',
        },
      ],
      playerId: 'free-peoples',
    },
    {
      time: 106,
      type: 'base',
      actions: [
        {
          type: 'combat-roll',
          dice: [4, 2, 4, 1, 2],
        },
      ],
      playerId: 'shadow',
    },
    {
      actions: [
        {
          dice: [5],
          type: 'combat-re-roll',
        },
      ],
      playerId: 'free-peoples',
      time: 107,
      type: 'base',
    },
    {
      actions: [
        {
          type: 'combat-re-roll',
          dice: [1, 3, 6, 3],
        },
      ],
      playerId: 'shadow',
      type: 'base',
      time: 107,
    },
    {
      time: 108,
      type: 'base',
      actions: [
        {
          region: 'lorien',
          type: 'regular-unit-elimination',
          quantity: 1,
          nation: 'isengard',
        },
      ],
      playerId: 'shadow',
    },
    {
      playerId: 'free-peoples',
      type: 'base',
      time: 109,
      actions: [
        {
          quantity: 1,
          nation: 'elves',
          type: 'regular-unit-elimination',
          region: 'lorien',
        },
        {
          type: 'leader-elimination',
          region: 'lorien',
          nation: 'elves',
          quantity: 1,
        },
      ],
    },
    {
      die: 'muster-army',
      type: 'die',
      time: 110,
      playerId: 'free-peoples',
      actions: [
        {
          type: 'army-movement',
          fromRegion: 'carrock',
          toRegion: 'old-forest-road',
        },
        {
          type: 'army-movement',
          toRegion: 'westemnet',
          fromRegion: 'edoras',
        },
      ],
    },
    {
      die: 'muster',
      playerId: 'shadow',
      character: 'saruman',
      type: 'die',
      time: 111,
      actions: [
        {
          nation: 'isengard',
          quantity: 2,
          type: 'regular-unit-upgrade',
          region: 'orthanc',
        },
      ],
    },
    {
      playerId: 'free-peoples',
      time: 112,
      type: 'die-pass',
    },
    {
      actions: [
        {
          region: 'orthanc',
          type: 'regular-unit-upgrade',
          nation: 'isengard',
          quantity: 2,
        },
      ],
      time: 113,
      type: 'die',
      character: 'saruman',
      playerId: 'shadow',
      die: 'muster-army',
    },
    {
      playerId: 'free-peoples',
      time: 114,
      type: 'die',
      die: 'muster',
      actions: [
        {
          nation: 'rohan',
          quantity: 1,
          type: 'political-advance',
        },
      ],
    },
    {
      type: 'die-card',
      time: 115,
      die: 'event',
      playerId: 'shadow',
      card: 'sstr19',
      actions: [
        {
          quantity: 2,
          nation: 'sauron',
          type: 'elite-unit-recruitment',
          region: 'mount-gram',
        },
        {
          type: 'nazgul-recruitment',
          quantity: 1,
          region: 'mount-gram',
        },
      ],
    },
    {
      playerId: 'free-peoples',
      die: 'muster-army',
      actions: [
        {
          quantity: 1,
          nation: 'elves',
          region: 'rivendell',
          type: 'elite-unit-recruitment',
        },
      ],
      type: 'die',
      time: 116,
    },
    {
      die: 'event',
      actions: [
        {
          type: 'card-play-on-table',
          card: 'scha22',
        },
      ],
      playerId: 'shadow',
      type: 'die-card',
      time: 117,
      card: 'scha22',
    },
    {
      time: 118,
      type: 'token',
      token: 'political-advance',
      playerId: 'free-peoples',
      actions: [
        {
          nation: 'rohan',
          type: 'political-advance',
          quantity: 1,
        },
      ],
    },
    {
      playerId: 'shadow',
      actions: [
        {
          type: 'card-draw',
          cards: ['sstr04'],
        },
      ],
      time: 119,
      type: 'die',
      die: 'event',
    },
    {
      playerId: 'free-peoples',
      type: 'base',
      time: 120,
      actions: [
        {
          cards: ['fpcha19', 'fpstr01'],
          type: 'card-draw',
        },
      ],
    },
    {
      type: 'base',
      time: 120,
      actions: [
        {
          cards: ['scha21', 'sstr14'],
          type: 'card-draw',
        },
      ],
      playerId: 'shadow',
    },
    {
      actions: [
        {
          cards: ['fpstr01', 'fpcha23'],
          type: 'card-discard',
        },
      ],
      time: 121,
      type: 'base',
      playerId: 'free-peoples',
    },
    {
      actions: [],
      playerId: 'free-peoples',
      type: 'base',
      time: 122,
    },
    {
      actions: [
        {
          quantity: 1,
          type: 'hunt-allocation',
        },
      ],
      time: 123,
      type: 'base',
      playerId: 'shadow',
    },
    {
      playerId: 'free-peoples',
      type: 'base',
      time: 124,
      actions: [
        {
          dice: ['event', 'muster-army', 'character', 'will-of-the-west'],
          type: 'action-roll',
        },
      ],
    },
    {
      actions: [
        {
          dice: ['character', 'eye', 'character', 'army', 'eye', 'eye', 'army'],
          type: 'action-roll',
        },
      ],
      time: 124,
      type: 'base',
      playerId: 'shadow',
    },
    {
      die: 'character',
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
      time: 125,
      type: 'die',
      playerId: 'free-peoples',
    },
    {
      time: 126,
      type: 'base',
      playerId: 'shadow',
      actions: [
        {
          dice: [2, 2, 2, 5],
          type: 'hunt-roll',
        },
      ],
    },
    {
      playerId: 'shadow',
      die: 'army',
      type: 'die-card',
      time: 127,
      actions: [
        {
          type: 'elite-unit-recruitment',
          region: 'lorien',
          nation: 'sauron',
          quantity: 1,
        },
      ],
      card: 'sstr14',
    },
    {
      card: 'fpcha17',
      actions: [
        {
          type: 'companion-separation',
          toRegion: 'woodland-realm',
          companions: ['gimli'],
        },
      ],
      playerId: 'free-peoples',
      type: 'die-card',
      time: 128,
      die: 'event',
    },
    {
      actions: [
        {
          type: 'card-draw',
          cards: ['fpcha05'],
        },
      ],
      character: 'gandalf-the-grey',
      playerId: 'free-peoples',
      time: 129,
      type: 'character-effect',
    },
    {
      time: 130,
      type: 'die',
      playerId: 'shadow',
      actions: [
        {
          leftUnits: {
            regulars: [
              {
                nation: 'sauron',
                quantity: 3,
              },
            ],
            elites: [],
            front: 'shadow',
          },
          toRegion: 'minas-morgul',
          type: 'army-movement',
          fromRegion: 'gorgoroth',
        },
        {
          fromRegion: 'lorien',
          type: 'army-movement',
          toRegion: 'parth-celebrant',
          leftUnits: {
            regulars: [
              {
                quantity: 1,
                nation: 'sauron',
              },
            ],
            front: 'shadow',
            nNazgul: 0,
            elites: [],
          },
        },
      ],
      die: 'army',
    },
    {
      actions: [
        {
          fromRegion: 'westemnet',
          type: 'army-movement',
          toRegion: 'eastemnet',
          leftUnits: {
            elites: [
              {
                nation: 'rohan',
                quantity: 2,
              },
            ],
            front: 'free-peoples',
            regulars: [],
            leaders: [
              {
                quantity: 1,
                nation: 'rohan',
              },
            ],
          },
        },
        {
          fromRegion: 'old-forest-road',
          toRegion: 'narrows-of-the-forest',
          type: 'army-movement',
        },
      ],
      playerId: 'free-peoples',
      die: 'muster-army',
      time: 131,
      type: 'die',
    },
    {
      actions: [
        {
          type: 'army-attack',
          fromRegion: 'parth-celebrant',
          toRegion: 'eastemnet',
        },
      ],
      playerId: 'shadow',
      time: 132,
      type: 'die',
      die: 'character',
    },
    {
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
      type: 'base',
      playerId: 'shadow',
      time: 133,
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
      type: 'base',
      time: 134,
    },
    {
      playerId: 'free-peoples',
      time: 135,
      type: 'base',
      actions: [
        {
          dice: [6],
          type: 'combat-roll',
        },
      ],
    },
    {
      actions: [
        {
          type: 'combat-roll',
          dice: [4, 4, 2, 5, 4],
        },
      ],
      playerId: 'shadow',
      type: 'base',
      time: 135,
    },
    {
      type: 'base',
      time: 136,
      actions: [
        {
          region: 'parth-celebrant',
          quantity: 1,
          type: 'elite-unit-downgrade',
          nation: 'sauron',
        },
      ],
      playerId: 'shadow',
    },
    {
      playerId: 'free-peoples',
      time: 137,
      type: 'base',
      actions: [
        {
          region: 'eastemnet',
          type: 'regular-unit-elimination',
          quantity: 1,
          nation: 'rohan',
        },
      ],
    },
    {
      actions: [
        {
          type: 'army-advance',
        },
      ],
      playerId: 'shadow',
      type: 'base',
      time: 138,
    },
    {
      actions: [
        {
          type: 'card-play-on-table',
          card: 'fpcha07',
        },
      ],
      time: 139,
      type: 'die-card',
      playerId: 'free-peoples',
      card: 'fpcha07',
      die: 'will-of-the-west',
    },
    {
      character: 'gandalf-the-grey',
      playerId: 'free-peoples',
      type: 'character-effect',
      time: 140,
      actions: [
        {
          type: 'card-draw',
          cards: ['fpcha06'],
        },
      ],
    },
    {
      actions: [
        {
          fromRegion: 'eastemnet',
          type: 'army-attack',
          toRegion: 'westemnet',
        },
      ],
      die: 'character',
      type: 'die',
      time: 141,
      playerId: 'shadow',
    },
    {
      playerId: 'shadow',
      actions: [
        {
          card: 'scha21',
          type: 'combat-card-choose',
        },
      ],
      type: 'base',
      time: 142,
    },
    {
      playerId: 'free-peoples',
      time: 143,
      type: 'base',
      actions: [
        {
          card: 'fpcha21',
          type: 'combat-card-choose',
        },
      ],
    },
    {
      type: 'card-effect',
      time: 144,
      card: 'scha21',
      playerId: 'shadow',
      actions: [
        {
          leaders: {
            nNazgul: 2,
          },
          type: 'leader-forfeit',
        },
      ],
    },
    {
      playerId: 'free-peoples',
      type: 'base',
      time: 145,
      actions: [
        {
          dice: [2, 3],
          type: 'combat-roll',
        },
      ],
    },
    {
      type: 'base',
      actions: [
        {
          dice: [3, 6, 2, 6, 3],
          type: 'combat-roll',
        },
      ],
      time: 145,
      playerId: 'shadow',
    },
    {
      type: 'base',
      time: 146,
      actions: [
        {
          dice: [4],
          type: 'combat-re-roll',
        },
      ],
      playerId: 'free-peoples',
    },
    {
      playerId: 'shadow',
      actions: [
        {
          dice: [4, 3, 1],
          type: 'combat-re-roll',
        },
      ],
      time: 146,
      type: 'base',
    },
    {
      actions: [
        {
          nation: 'rohan',
          region: 'westemnet',
          quantity: 2,
          type: 'elite-unit-downgrade',
        },
      ],
      playerId: 'free-peoples',
      type: 'base',
      time: 147,
    },
    {
      actions: [
        {
          region: 'westemnet',
          type: 'battle-continue',
        },
      ],
      playerId: 'shadow',
      time: 148,
      type: 'base',
    },
    {
      actions: [
        {
          type: 'army-retreat',
          toRegion: 'edoras',
        },
      ],
      type: 'base',
      time: 149,
      playerId: 'free-peoples',
    },
    {
      type: 'base',
      time: 150,
      playerId: 'shadow',
      actions: [
        {
          type: 'army-advance',
        },
      ],
    },
    {
      time: 151,
      type: 'base',
      actions: [
        {
          cards: ['fpcha13', 'fpstr12'],
          type: 'card-draw',
        },
      ],
      playerId: 'free-peoples',
    },
    {
      type: 'base',
      time: 151,
      playerId: 'shadow',
      actions: [
        {
          type: 'card-draw',
          cards: ['scha11', 'sstr01'],
        },
      ],
    },
    {
      type: 'base',
      time: 152,
      actions: [
        {
          type: 'card-discard',
          cards: ['fpcha13'],
        },
      ],
      playerId: 'free-peoples',
    },
    {
      actions: [],
      type: 'base',
      time: 153,
      playerId: 'free-peoples',
    },
    {
      time: 154,
      type: 'base',
      playerId: 'shadow',
      actions: [
        {
          quantity: 1,
          type: 'hunt-allocation',
        },
      ],
    },
    {
      actions: [
        {
          dice: ['muster', 'will-of-the-west', 'character', 'muster'],
          type: 'action-roll',
        },
      ],
      playerId: 'free-peoples',
      type: 'base',
      time: 155,
    },
    {
      type: 'base',
      time: 155,
      actions: [
        {
          type: 'action-roll',
          dice: [
            'event',
            'eye',
            'army',
            'eye',
            'muster',
            'army',
            'muster-army',
          ],
        },
      ],
      playerId: 'shadow',
    },
    {
      die: 'muster',
      type: 'die',
      time: 156,
      actions: [
        {
          nation: 'north',
          type: 'political-advance',
          quantity: 1,
        },
      ],
      playerId: 'free-peoples',
    },
    {
      character: 'saruman',
      actions: [
        {
          region: 'orthanc',
          nation: 'isengard',
          type: 'regular-unit-recruitment',
          quantity: 1,
        },
        {
          type: 'regular-unit-recruitment',
          nation: 'isengard',
          quantity: 1,
          region: 'south-dunland',
        },
        {
          quantity: 1,
          type: 'regular-unit-recruitment',
          nation: 'isengard',
          region: 'north-dunland',
        },
      ],
      time: 157,
      type: 'die',
      die: 'muster',
      playerId: 'shadow',
    },
    {
      die: 'muster',
      playerId: 'free-peoples',
      actions: [
        {
          type: 'political-advance',
          quantity: 1,
          nation: 'north',
        },
      ],
      type: 'die',
      time: 158,
    },
    {
      die: 'muster-army',
      type: 'die',
      time: 159,
      actions: [
        {
          quantity: 1,
          nation: 'sauron',
          region: 'dol-guldur',
          type: 'elite-unit-recruitment',
        },
      ],
      playerId: 'shadow',
    },
    {
      type: 'die-pass',
      time: 160,
      playerId: 'free-peoples',
    },
    {
      die: 'army',
      actions: [
        {
          type: 'army-movement',
          leftUnits: {
            nNazgul: 4,
            front: 'shadow',
            elites: [],
            regulars: [
              {
                quantity: 3,
                nation: 'sauron',
              },
              {
                quantity: 1,
                nation: 'isengard',
              },
            ],
          },
          toRegion: 'folde',
          fromRegion: 'westemnet',
        },
        {
          toRegion: 'gap-of-rohan',
          type: 'army-movement',
          fromRegion: 'south-dunland',
        },
      ],
      time: 161,
      type: 'die',
      playerId: 'shadow',
    },
    {
      time: 162,
      type: 'die',
      playerId: 'free-peoples',
      die: 'character',
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
    },
    {
      type: 'base',
      time: 163,
      actions: [
        {
          dice: [3, 3, 3],
          type: 'hunt-roll',
        },
      ],
      playerId: 'shadow',
    },
    {
      time: 164,
      type: 'die',
      actions: [
        {
          fromRegion: 'minas-morgul',
          toRegion: 'north-ithilien',
          type: 'army-movement',
        },
        {
          fromRegion: 'gap-of-rohan',
          toRegion: 'orthanc',
          type: 'army-movement',
        },
      ],
      die: 'army',
      playerId: 'shadow',
    },
    {
      playerId: 'free-peoples',
      time: 165,
      type: 'die-card',
      actions: [
        {
          card: 'fpcha05',
          type: 'card-play-on-table',
        },
      ],
      card: 'fpcha05',
      die: 'will-of-the-west',
    },
    {
      actions: [
        {
          type: 'card-draw',
          cards: ['fpcha12'],
        },
      ],
      character: 'gandalf-the-grey',
      time: 166,
      type: 'character-effect',
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          type: 'nazgul-movement',
          toRegion: 'old-ford',
          fromRegion: 'mount-gram',
          nNazgul: 1,
        },
        {
          type: 'card-discard-from-table',
          card: 'fpcha05',
        },
      ],
      die: 'event',
      card: 'scha11',
      playerId: 'shadow',
      type: 'die-card',
      time: 167,
    },
    {
      actions: [
        {
          cards: ['fpcha02', 'fpstr13'],
          type: 'card-draw',
        },
      ],
      playerId: 'free-peoples',
      time: 168,
      type: 'base',
    },
    {
      type: 'base',
      time: 168,
      playerId: 'shadow',
      actions: [
        {
          type: 'card-draw',
          cards: ['scha24', 'sstr23'],
        },
      ],
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          type: 'card-discard',
          cards: ['fpstr13', 'fpcha06'],
        },
      ],
      type: 'base',
      time: 169,
    },
    {
      type: 'base',
      time: 169,
      playerId: 'shadow',
      actions: [
        {
          cards: ['sstr23'],
          type: 'card-discard',
        },
      ],
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          type: 'fellowship-declare',
          region: 'old-forest-road',
        },
      ],
      time: 170,
      type: 'base',
    },
    {
      actions: [
        {
          quantity: 1,
          type: 'hunt-allocation',
        },
      ],
      playerId: 'shadow',
      type: 'base',
      time: 171,
    },
    {
      type: 'base',
      time: 172,
      actions: [
        {
          type: 'action-roll',
          dice: ['character', 'character', 'muster-army', 'character'],
        },
      ],
      playerId: 'free-peoples',
    },
    {
      playerId: 'shadow',
      type: 'base',
      time: 172,
      actions: [
        {
          dice: ['event', 'character', 'army', 'muster', 'army', 'eye', 'eye'],
          type: 'action-roll',
        },
      ],
    },
    {
      playerId: 'free-peoples',
      time: 173,
      type: 'die-pass',
    },
    {
      die: 'character',
      playerId: 'shadow',
      actions: [
        {
          toRegion: 'fords-of-isen',
          fromRegion: 'orthanc',
          type: 'army-attack',
        },
      ],
      time: 174,
      type: 'die',
    },
    {
      playerId: 'shadow',
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
      time: 175,
      type: 'base',
    },
    {
      type: 'base',
      time: 176,
      playerId: 'free-peoples',
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
    },
    {
      playerId: 'free-peoples',
      time: 177,
      type: 'base',
      actions: [
        {
          dice: [1, 3],
          type: 'combat-roll',
        },
      ],
    },
    {
      actions: [
        {
          type: 'combat-roll',
          dice: [2, 2, 5, 2, 5],
        },
      ],
      playerId: 'shadow',
      type: 'base',
      time: 177,
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          dice: [1],
          type: 'combat-re-roll',
        },
      ],
      type: 'base',
      time: 178,
    },
    {
      actions: [
        {
          dice: [3, 5, 2, 5, 1],
          type: 'combat-re-roll',
        },
      ],
      type: 'base',
      time: 178,
      playerId: 'shadow',
    },
    {
      time: 179,
      type: 'base',
      playerId: 'shadow',
      actions: [
        {
          type: 'battle-continue',
          region: 'fords-of-isen',
        },
      ],
    },
    {
      type: 'base',
      time: 180,
      playerId: 'free-peoples',
      actions: [
        {
          type: 'army-retreat',
          toRegion: 'helms-deep',
        },
      ],
    },
    {
      actions: [
        {
          leftUnits: {
            characters: ['saruman'],
            regulars: [
              {
                quantity: 2,
                nation: 'isengard',
              },
            ],
            front: 'shadow',
            elites: [],
          },
          type: 'army-advance',
        },
      ],
      type: 'base',
      time: 181,
      playerId: 'shadow',
    },
    {
      die: 'character',
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
      time: 182,
      type: 'die',
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          type: 'hunt-roll',
          dice: [2, 3, 1],
        },
      ],
      playerId: 'shadow',
      time: 183,
      type: 'base',
    },
    {
      playerId: 'shadow',
      actions: [
        {
          characters: ['the-witch-king'],
          type: 'character-play',
          region: 'north-ithilien',
        },
      ],
      die: 'muster',
      time: 184,
      type: 'die',
    },
    {
      die: 'character',
      playerId: 'free-peoples',
      card: 'fpcha04',
      actions: [
        {
          type: 'hunt-tile-add',
          tile: 'b-1',
        },
      ],
      time: 185,
      type: 'die-card',
    },
    {
      time: 186,
      type: 'die-card',
      playerId: 'shadow',
      card: 'sstr12',
      die: 'event',
      actions: [
        {
          type: 'character-movement',
          fromRegion: 'north-ithilien',
          toRegion: 'angmar',
          characters: ['the-witch-king'],
        },
        {
          nation: 'sauron',
          type: 'regular-unit-recruitment',
          quantity: 2,
          region: 'angmar',
        },
        {
          region: 'angmar',
          type: 'elite-unit-recruitment',
          nation: 'sauron',
          quantity: 1,
        },
      ],
    },
    {
      die: 'character',
      playerId: 'free-peoples',
      type: 'die',
      time: 187,
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
    },
    {
      actions: [
        {
          type: 'hunt-roll',
          dice: [3, 4, 3],
        },
      ],
      playerId: 'shadow',
      type: 'base',
      time: 188,
    },
    {
      die: 'army',
      actions: [
        {
          region: 'grey-havens',
          type: 'region-choose',
        },
      ],
      playerId: 'shadow',
      time: 189,
      type: 'die-card',
      card: 'sstr01',
    },
    {
      time: 190,
      type: 'base',
      playerId: 'shadow',
      actions: [
        {
          dice: [2, 3],
          type: 'combat-roll',
        },
      ],
    },
    {
      card: 'sstr01',
      actions: [],
      type: 'card-effect',
      time: 191,
      playerId: 'free-peoples',
    },
    {
      card: 'sstr01',
      actions: [
        {
          type: 'region-choose',
          region: 'rivendell',
        },
      ],
      type: 'card-effect',
      time: 192,
      playerId: 'shadow',
    },
    {
      time: 193,
      type: 'base',
      actions: [
        {
          dice: [6, 5, 6],
          type: 'combat-roll',
        },
      ],
      playerId: 'shadow',
    },
    {
      actions: [
        {
          region: 'rivendell',
          type: 'elite-unit-downgrade',
          nation: 'elves',
          quantity: 2,
        },
      ],
      playerId: 'free-peoples',
      card: 'sstr01',
      type: 'card-effect',
      time: 194,
    },
    {
      playerId: 'shadow',
      time: 195,
      type: 'card-effect',
      card: 'sstr01',
      actions: [
        {
          region: 'woodland-realm',
          type: 'region-choose',
        },
      ],
    },
    {
      type: 'base',
      time: 196,
      actions: [
        {
          dice: [1, 5],
          type: 'combat-roll',
        },
      ],
      playerId: 'shadow',
    },
    {
      playerId: 'free-peoples',
      card: 'sstr01',
      actions: [],
      type: 'card-effect',
      time: 197,
    },
    {
      die: 'muster-army',
      actions: [
        {
          nation: 'elves',
          region: 'rivendell',
          type: 'elite-unit-recruitment',
          quantity: 1,
        },
      ],
      time: 198,
      type: 'die',
      playerId: 'free-peoples',
    },
    {
      time: 199,
      type: 'die',
      actions: [
        {
          fromRegion: 'fords-of-isen',
          type: 'army-attack',
          toRegion: 'helms-deep',
        },
      ],
      playerId: 'shadow',
      die: 'army',
    },
    {
      time: 200,
      type: 'base',
      actions: [
        {
          type: 'army-retreat-into-siege',
          region: 'helms-deep',
        },
      ],
      playerId: 'free-peoples',
    },
    {
      playerId: 'shadow',
      type: 'base',
      time: 201,
      actions: [
        {
          type: 'army-advance',
        },
      ],
    },
    {
      type: 'base',
      time: 202,
      playerId: 'free-peoples',
      actions: [
        {
          cards: ['fpcha14', 'fpstr19'],
          type: 'card-draw',
        },
      ],
    },
    {
      type: 'base',
      time: 202,
      actions: [
        {
          cards: ['scha06', 'sstr21'],
          type: 'card-draw',
        },
      ],
      playerId: 'shadow',
    },
    {
      actions: [
        {
          cards: ['fpcha14'],
          type: 'card-discard',
        },
      ],
      type: 'base',
      time: 203,
      playerId: 'free-peoples',
    },
    {
      type: 'base',
      time: 204,
      playerId: 'free-peoples',
      actions: [],
    },
    {
      type: 'base',
      time: 205,
      actions: [
        {
          type: 'hunt-allocation',
          quantity: 1,
        },
      ],
      playerId: 'shadow',
    },
    {
      playerId: 'free-peoples',
      type: 'base',
      time: 206,
      actions: [
        {
          type: 'action-roll',
          dice: ['character', 'muster', 'event', 'will-of-the-west'],
        },
      ],
    },
    {
      time: 206,
      type: 'base',
      actions: [
        {
          type: 'action-roll',
          dice: [
            'muster',
            'eye',
            'muster-army',
            'character',
            'army',
            'muster-army',
            'muster',
            'character',
          ],
        },
      ],
      playerId: 'shadow',
    },
    {
      actions: [
        {
          quantity: 1,
          nation: 'rohan',
          region: 'edoras',
          type: 'regular-unit-recruitment',
        },
        {
          type: 'regular-unit-recruitment',
          region: 'dale',
          nation: 'north',
          quantity: 1,
        },
      ],
      type: 'die',
      time: 207,
      die: 'muster',
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          fromRegion: 'westemnet',
          type: 'army-attack',
          toRegion: 'edoras',
        },
      ],
      die: 'character',
      playerId: 'shadow',
      time: 208,
      type: 'die',
    },
    {
      playerId: 'shadow',
      time: 209,
      type: 'base',
      actions: [
        {
          card: 'sstr09',
          type: 'combat-card-choose',
        },
      ],
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          card: 'fpcha19',
          type: 'combat-card-choose',
        },
      ],
      time: 210,
      type: 'base',
    },
    {
      time: 211,
      type: 'base',
      actions: [
        {
          type: 'combat-roll',
          dice: [3, 2, 3],
        },
      ],
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          type: 'combat-roll',
          dice: [1, 6, 1, 4],
        },
      ],
      type: 'base',
      time: 211,
      playerId: 'shadow',
    },
    {
      time: 212,
      type: 'base',
      playerId: 'free-peoples',
      actions: [
        {
          dice: [4],
          type: 'combat-re-roll',
        },
      ],
    },
    {
      type: 'base',
      actions: [
        {
          type: 'combat-re-roll',
          dice: [1, 6, 3],
        },
      ],
      time: 212,
      playerId: 'shadow',
    },
    {
      type: 'base',
      time: 213,
      actions: [
        {
          nation: 'rohan',
          region: 'edoras',
          type: 'regular-unit-elimination',
          quantity: 2,
        },
      ],
      playerId: 'free-peoples',
    },
    {
      playerId: 'shadow',
      time: 214,
      type: 'base',
      actions: [
        {
          region: 'edoras',
          type: 'battle-continue',
        },
      ],
    },
    {
      time: 215,
      type: 'base',
      playerId: 'shadow',
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
    },
    {
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
      type: 'base',
      time: 216,
      playerId: 'free-peoples',
    },
    {
      type: 'base',
      time: 217,
      playerId: 'free-peoples',
      actions: [
        {
          dice: [4],
          type: 'combat-roll',
        },
      ],
    },
    {
      playerId: 'shadow',
      actions: [
        {
          dice: [2, 2, 1, 1],
          type: 'combat-roll',
        },
      ],
      type: 'base',
      time: 217,
    },
    {
      actions: [
        {
          dice: [2],
          type: 'combat-re-roll',
        },
      ],
      playerId: 'free-peoples',
      time: 218,
      type: 'base',
    },
    {
      type: 'base',
      time: 218,
      playerId: 'shadow',
      actions: [
        {
          dice: [1, 4, 2, 4],
          type: 'combat-re-roll',
        },
      ],
    },
    {
      playerId: 'shadow',
      time: 219,
      type: 'base',
      actions: [
        {
          region: 'edoras',
          type: 'battle-continue',
        },
      ],
    },
    {
      type: 'base',
      time: 220,
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
      playerId: 'shadow',
    },
    {
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
      time: 221,
      type: 'base',
      playerId: 'free-peoples',
    },
    {
      time: 222,
      type: 'base',
      actions: [
        {
          dice: [5],
          type: 'combat-roll',
        },
      ],
      playerId: 'free-peoples',
    },
    {
      type: 'base',
      time: 222,
      actions: [
        {
          type: 'combat-roll',
          dice: [3, 1, 5, 2],
        },
      ],
      playerId: 'shadow',
    },
    {
      type: 'base',
      time: 223,
      playerId: 'shadow',
      actions: [
        {
          nation: 'sauron',
          type: 'regular-unit-elimination',
          region: 'westemnet',
          quantity: 1,
        },
      ],
    },
    {
      type: 'base',
      time: 224,
      playerId: 'free-peoples',
      actions: [
        {
          region: 'edoras',
          nation: 'rohan',
          type: 'regular-unit-elimination',
          quantity: 1,
        },
        {
          region: 'edoras',
          nation: 'rohan',
          type: 'leader-elimination',
          quantity: 1,
        },
      ],
    },
    {
      playerId: 'shadow',
      type: 'base',
      time: 225,
      actions: [
        {
          type: 'army-advance',
          leftUnits: {
            regulars: [
              {
                nation: 'sauron',
                quantity: 1,
              },
              {
                nation: 'isengard',
                quantity: 1,
              },
            ],
            front: 'shadow',
            nNazgul: 4,
            elites: [],
          },
        },
      ],
    },
    {
      playerId: 'free-peoples',
      type: 'die-pass',
      time: 226,
    },
    {
      time: 227,
      type: 'die',
      actions: [
        {
          quantity: 1,
          nation: 'southrons',
          type: 'political-advance',
        },
      ],
      playerId: 'shadow',
      die: 'muster',
    },
    {
      type: 'die-pass',
      time: 228,
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          nation: 'sauron',
          quantity: 1,
          type: 'regular-unit-recruitment',
          region: 'dol-guldur',
        },
        {
          type: 'regular-unit-recruitment',
          region: 'angmar',
          quantity: 1,
          nation: 'sauron',
        },
      ],
      time: 229,
      type: 'die',
      playerId: 'shadow',
      die: 'muster',
    },
    {
      playerId: 'free-peoples',
      type: 'die-pass',
      time: 230,
    },
    {
      type: 'die',
      time: 231,
      playerId: 'shadow',
      die: 'character',
      actions: [
        {
          type: 'army-attack',
          fromRegion: 'helms-deep',
          toRegion: 'helms-deep',
        },
      ],
    },
    {
      actions: [
        {
          card: 'sstr21',
          type: 'combat-card-choose',
        },
      ],
      playerId: 'shadow',
      type: 'base',
      time: 232,
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          card: 'fpstr19',
          type: 'combat-card-choose',
        },
      ],
      type: 'base',
      time: 233,
    },
    {
      playerId: 'free-peoples',
      time: 234,
      type: 'base',
      actions: [
        {
          dice: [1, 4, 1],
          type: 'combat-roll',
        },
      ],
    },
    {
      type: 'base',
      time: 234,
      actions: [
        {
          type: 'combat-roll',
          dice: [1, 4, 5, 5, 3],
        },
      ],
      playerId: 'shadow',
    },
    {
      playerId: 'free-peoples',
      type: 'base',
      actions: [
        {
          type: 'combat-re-roll',
          dice: [4],
        },
      ],
      time: 235,
    },
    {
      type: 'base',
      time: 236,
      actions: [
        {
          quantity: 2,
          nation: 'isengard',
          type: 'regular-unit-elimination',
          region: 'helms-deep',
        },
      ],
      playerId: 'shadow',
    },
    {
      playerId: 'free-peoples',
      type: 'base',
      time: 237,
      actions: [
        {
          type: 'regular-unit-elimination',
          nation: 'rohan',
          region: 'helms-deep',
          quantity: 2,
        },
      ],
    },
    {
      playerId: 'shadow',
      type: 'base',
      time: 238,
      actions: [
        {
          quantity: 1,
          region: 'helms-deep',
          nation: 'isengard',
          type: 'elite-unit-downgrade',
        },
        {
          type: 'battle-continue',
          region: 'helms-deep',
        },
      ],
    },
    {
      playerId: 'shadow',
      type: 'base',
      time: 239,
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
    },
    {
      actions: [
        {
          type: 'combat-card-choose-not',
        },
      ],
      playerId: 'free-peoples',
      type: 'base',
      time: 240,
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          dice: [3],
          type: 'combat-roll',
        },
      ],
      type: 'base',
      time: 241,
    },
    {
      type: 'base',
      time: 241,
      actions: [
        {
          dice: [2, 6, 3, 5, 3],
          type: 'combat-roll',
        },
      ],
      playerId: 'shadow',
    },
    {
      actions: [
        {
          dice: [4],
          type: 'combat-re-roll',
        },
      ],
      playerId: 'free-peoples',
      type: 'base',
      time: 242,
    },
    {
      time: 243,
      type: 'base',
      playerId: 'free-peoples',
      actions: [
        {
          nation: 'rohan',
          type: 'regular-unit-elimination',
          quantity: 1,
          region: 'helms-deep',
        },
        {
          type: 'leader-elimination',
          nation: 'rohan',
          region: 'helms-deep',
          quantity: 1,
        },
      ],
    },
    {
      die: 'character',
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
      type: 'die',
      playerId: 'free-peoples',
      time: 244,
    },
    {
      actions: [
        {
          type: 'hunt-roll',
          dice: [1, 2],
        },
      ],
      playerId: 'shadow',
      time: 245,
      type: 'base',
    },
    {
      die: 'army',
      type: 'die',
      time: 246,
      actions: [
        {
          toRegion: 'fords-of-isen',
          type: 'army-movement',
          fromRegion: 'helms-deep',
        },
        {
          toRegion: 'mount-gram',
          type: 'army-movement',
          fromRegion: 'mount-gundabad',
        },
      ],
      playerId: 'shadow',
    },
    {
      card: 'fpcha02',
      time: 247,
      type: 'die-card',
      die: 'event',
      actions: [
        {
          type: 'hunt-tile-add',
          tile: 'b0',
        },
      ],
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          cards: ['fpcha08'],
          type: 'card-draw',
        },
      ],
      time: 248,
      type: 'character-effect',
      playerId: 'free-peoples',
      character: 'gandalf-the-grey',
    },
    {
      actions: [
        {
          region: 'north-dunland',
          type: 'regular-unit-recruitment',
          nation: 'isengard',
          quantity: 1,
        },
        {
          nation: 'isengard',
          quantity: 1,
          type: 'regular-unit-recruitment',
          region: 'south-dunland',
        },
        {
          nation: 'isengard',
          quantity: 1,
          type: 'regular-unit-recruitment',
          region: 'orthanc',
        },
      ],
      playerId: 'shadow',
      die: 'muster-army',
      type: 'die',
      time: 249,
      character: 'saruman',
    },
    {
      die: 'will-of-the-west',
      playerId: 'free-peoples',
      type: 'die',
      time: 250,
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
    },
    {
      type: 'base',
      playerId: 'shadow',
      time: 251,
      actions: [
        {
          dice: [6, 4],
          type: 'hunt-roll',
        },
      ],
    },
    {
      playerId: 'shadow',
      actions: [
        {
          tiles: ['er'],
          type: 'hunt-tile-draw',
        },
      ],
      time: 252,
      type: 'base',
    },
    {
      time: 253,
      type: 'base',
      playerId: 'free-peoples',
      actions: [
        {
          characters: ['gandalf-the-grey'],
          type: 'character-elimination',
        },
        {
          companion: 'boromir',
          type: 'fellowship-guide',
        },
      ],
    },
    {
      time: 254,
      type: 'base',
      playerId: 'free-peoples',
      actions: [
        {
          type: 'fellowship-reveal',
          region: 'dagorlad',
        },
      ],
    },
    {
      playerId: 'shadow',
      actions: [
        {
          region: 'north-dunland',
          type: 'regular-unit-recruitment',
          quantity: 1,
          nation: 'isengard',
        },
        {
          nation: 'isengard',
          quantity: 1,
          type: 'regular-unit-recruitment',
          region: 'south-dunland',
        },
        {
          quantity: 1,
          region: 'orthanc',
          type: 'regular-unit-recruitment',
          nation: 'isengard',
        },
      ],
      time: 255,
      type: 'die',
      die: 'muster-army',
      character: 'saruman',
    },
    {
      type: 'base',
      time: 256,
      actions: [
        {
          cards: ['fpcha09', 'fpstr24'],
          type: 'card-draw',
        },
      ],
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          cards: ['scha13', 'sstr15'],
          type: 'card-draw',
        },
      ],
      playerId: 'shadow',
      time: 256,
      type: 'base',
    },
    {
      time: 257,
      type: 'base',
      actions: [],
      playerId: 'free-peoples',
    },
    {
      playerId: 'shadow',
      actions: [
        {
          quantity: 1,
          type: 'hunt-allocation',
        },
      ],
      time: 258,
      type: 'base',
    },
    {
      actions: [
        {
          dice: [
            'will-of-the-west',
            'will-of-the-west',
            'character',
            'character',
          ],
          type: 'action-roll',
        },
      ],
      playerId: 'free-peoples',
      type: 'base',
      time: 259,
    },
    {
      playerId: 'shadow',
      actions: [
        {
          dice: [
            'eye',
            'eye',
            'event',
            'event',
            'muster-army',
            'muster',
            'eye',
            'eye',
          ],
          type: 'action-roll',
        },
      ],
      type: 'base',
      time: 259,
    },
    {
      type: 'die',
      time: 260,
      playerId: 'free-peoples',
      die: 'will-of-the-west',
      actions: [
        {
          type: 'character-play',
          characters: ['gandalf-the-white'],
          region: 'grey-havens',
        },
      ],
    },
    {
      playerId: 'shadow',
      die: 'event',
      time: 261,
      type: 'die-card',
      actions: [
        {
          companions: ['boromir'],
          type: 'companion-random',
        },
      ],
      card: 'scha13',
    },
    {
      type: 'card-effect',
      time: 262,
      actions: [
        {
          quantity: 2,
          type: 'fellowship-corruption',
        },
      ],
      card: 'scha13',
      playerId: 'free-peoples',
    },
    {
      playerId: 'free-peoples',
      type: 'die',
      time: 263,
      die: 'character',
      actions: [
        {
          type: 'fellowship-hide',
        },
      ],
    },
    {
      die: 'event',
      type: 'die-card',
      time: 264,
      actions: [
        {
          type: 'hunt-tile-draw',
          tiles: ['2r'],
        },
      ],
      card: 'scha06',
      playerId: 'shadow',
    },
    {
      actions: [
        {
          quantity: 2,
          type: 'fellowship-corruption',
        },
      ],
      playerId: 'free-peoples',
      time: 265,
      type: 'base',
    },
    {
      time: 266,
      type: 'base',
      actions: [
        {
          type: 'fellowship-reveal',
          region: 'dagorlad',
        },
      ],
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          type: 'fellowship-hide',
        },
      ],
      time: 267,
      type: 'die',
      die: 'will-of-the-west',
      playerId: 'free-peoples',
    },
    {
      die: 'muster',
      playerId: 'shadow',
      type: 'die',
      time: 268,
      actions: [
        {
          nation: 'isengard',
          quantity: 1,
          type: 'elite-unit-recruitment',
          region: 'orthanc',
        },
      ],
    },
    {
      die: 'character',
      playerId: 'free-peoples',
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
      time: 269,
      type: 'die',
    },
    {
      playerId: 'shadow',
      actions: [
        {
          type: 'hunt-roll',
          dice: [3, 1, 2, 3, 3],
        },
      ],
      type: 'base',
      time: 270,
    },
    {
      die: 'muster-army',
      type: 'die',
      time: 271,
      actions: [
        {
          leftUnits: {
            regulars: [
              {
                quantity: 1,
                nation: 'isengard',
              },
            ],
            front: 'shadow',
            characters: ['saruman'],
            elites: [],
          },
          fromRegion: 'orthanc',
          type: 'army-movement',
          toRegion: 'fords-of-isen',
        },
        {
          toRegion: 'angmar',
          fromRegion: 'mount-gram',
          type: 'army-movement',
        },
      ],
      playerId: 'shadow',
    },
    {
      time: 272,
      type: 'base',
      playerId: 'free-peoples',
      actions: [
        {
          cards: ['fpcha18', 'fpstr18'],
          type: 'card-draw',
        },
      ],
    },
    {
      playerId: 'shadow',
      type: 'base',
      time: 272,
      actions: [
        {
          type: 'card-draw',
          cards: ['scha23', 'sstr03'],
        },
      ],
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          cards: ['fpstr24', 'fpstr12'],
          type: 'card-discard',
        },
      ],
      type: 'base',
      time: 273,
    },
    {
      type: 'base',
      time: 274,
      actions: [
        {
          region: 'morannon',
          type: 'fellowship-declare',
        },
      ],
      playerId: 'free-peoples',
    },
    {
      type: 'base',
      time: 275,
      playerId: 'shadow',
      actions: [
        {
          quantity: 2,
          type: 'hunt-allocation',
        },
      ],
    },
    {
      time: 276,
      type: 'base',
      actions: [
        {
          type: 'action-roll',
          dice: [
            'character',
            'will-of-the-west',
            'will-of-the-west',
            'character',
            'character',
          ],
        },
      ],
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          type: 'action-roll',
          dice: [
            'event',
            'eye',
            'muster',
            'muster',
            'character',
            'muster',
            'muster',
          ],
        },
      ],
      playerId: 'shadow',
      type: 'base',
      time: 276,
    },
    {
      time: 277,
      type: 'die',
      playerId: 'free-peoples',
      die: 'will-of-the-west',
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
    },
    {
      actions: [
        {
          type: 'hunt-tile-draw',
          tiles: ['2'],
        },
      ],
      playerId: 'shadow',
      type: 'base',
      time: 278,
    },
    {
      actions: [
        {
          type: 'card-discard-from-table',
          card: 'fpcha07',
        },
        {
          companions: ['meriadoc'],
          type: 'companion-random',
        },
      ],
      type: 'base',
      time: 279,
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          characters: ['meriadoc'],
          type: 'character-elimination',
        },
      ],
      playerId: 'free-peoples',
      character: 'meriadoc',
      time: 280,
      type: 'character-effect',
    },
    {
      die: 'muster',
      actions: [
        {
          region: 'mount-gundabad',
          type: 'character-play',
          characters: ['the-mouth-of-sauron'],
        },
      ],
      type: 'die',
      time: 281,
      playerId: 'shadow',
    },
    {
      time: 282,
      type: 'die',
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
      playerId: 'free-peoples',
      die: 'character',
    },
    {
      playerId: 'shadow',
      actions: [
        {
          tiles: ['b0'],
          type: 'hunt-tile-draw',
        },
      ],
      type: 'base',
      time: 283,
    },
    {
      actions: [
        {
          toRegion: 'fords-of-isen',
          type: 'nazgul-movement',
          nNazgul: 1,
          fromRegion: 'old-ford',
        },
        {
          toRegion: 'angmar',
          fromRegion: 'westemnet',
          nNazgul: 2,
          type: 'nazgul-movement',
        },
        {
          toRegion: 'fords-of-isen',
          nNazgul: 2,
          fromRegion: 'westemnet',
          type: 'nazgul-movement',
        },
        {
          toRegion: 'arnor',
          fromRegion: 'angmar',
          type: 'army-movement',
        },
        {
          toRegion: 'druwaith-iaur',
          type: 'army-movement',
          fromRegion: 'fords-of-isen',
        },
      ],
      die: 'event',
      time: 284,
      type: 'die-card',
      card: 'scha23',
      playerId: 'shadow',
    },
    {
      playerId: 'free-peoples',
      die: 'character',
      time: 285,
      type: 'die',
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
    },
    {
      playerId: 'shadow',
      type: 'base',
      time: 286,
      actions: [
        {
          type: 'hunt-tile-draw',
          tiles: ['r3s'],
        },
      ],
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          characters: ['boromir'],
          type: 'character-elimination',
        },
        {
          quantity: 1,
          type: 'fellowship-corruption',
        },
      ],
      type: 'base',
      time: 287,
    },
    {
      time: 288,
      type: 'die',
      character: 'the-mouth-of-sauron',
      actions: [
        {
          type: 'army-movement',
          toRegion: 'andrast',
          fromRegion: 'druwaith-iaur',
        },
        {
          fromRegion: 'arnor',
          type: 'army-movement',
          toRegion: 'evendim',
        },
      ],
      die: 'muster',
      playerId: 'shadow',
    },
    {
      playerId: 'free-peoples',
      die: 'will-of-the-west',
      time: 289,
      type: 'die',
      actions: [
        {
          type: 'elite-unit-recruitment',
          quantity: 1,
          nation: 'elves',
          region: 'grey-havens',
        },
      ],
    },
    {
      actions: [
        {
          type: 'nazgul-recruitment',
          quantity: 2,
          region: 'evendim',
        },
        {
          type: 'army-movement',
          toRegion: 'tower-hills',
          fromRegion: 'evendim',
        },
      ],
      die: 'character',
      playerId: 'shadow',
      card: 'scha24',
      type: 'die-card',
      time: 290,
    },
    {
      card: 'fpcha12',
      time: 291,
      type: 'die-card',
      die: 'character',
      playerId: 'free-peoples',
      actions: [
        {
          quantity: 2,
          type: 'fellowship-heal',
        },
      ],
    },
    {
      time: 292,
      type: 'die',
      playerId: 'shadow',
      actions: [
        {
          quantity: 1,
          nation: 'southrons',
          type: 'political-advance',
        },
      ],
      die: 'muster',
    },
    {
      die: 'character',
      playerId: 'shadow',
      type: 'die',
      time: 293,
      actions: [
        {
          toRegion: 'grey-havens',
          fromRegion: 'tower-hills',
          type: 'army-attack',
        },
      ],
      elvenRing: {
        fromDie: 'muster',
        ring: 'vilya',
        toDie: 'character',
      },
    },
    {
      type: 'base',
      time: 294,
      actions: [
        {
          type: 'army-retreat-into-siege',
          region: 'grey-havens',
        },
      ],
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          type: 'army-advance',
        },
      ],
      playerId: 'shadow',
      type: 'base',
      time: 295,
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          cards: ['fpcha01', 'fpstr02'],
          type: 'card-draw',
        },
      ],
      type: 'base',
      time: 296,
    },
    {
      type: 'base',
      time: 296,
      playerId: 'shadow',
      actions: [
        {
          cards: ['scha02', 'sstr17'],
          type: 'card-draw',
        },
      ],
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          type: 'card-discard',
          cards: ['fpcha09'],
        },
      ],
      time: 297,
      type: 'base',
    },
    {
      playerId: 'free-peoples',
      actions: [],
      time: 298,
      type: 'base',
    },
    {
      actions: [
        {
          quantity: 1,
          type: 'hunt-allocation',
        },
      ],
      type: 'base',
      time: 299,
      playerId: 'shadow',
    },
    {
      type: 'base',
      time: 300,
      actions: [
        {
          type: 'action-roll',
          dice: ['character', 'muster', 'muster', 'muster', 'character'],
        },
      ],
      playerId: 'free-peoples',
    },
    {
      actions: [
        {
          dice: [
            'character',
            'muster',
            'muster-army',
            'army',
            'event',
            'character',
            'army',
            'army',
            'army',
          ],
          type: 'action-roll',
        },
      ],
      type: 'base',
      time: 300,
      playerId: 'shadow',
    },
    {
      time: 301,
      type: 'die',
      die: 'character',
      playerId: 'free-peoples',
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
    },
    {
      type: 'base',
      time: 302,
      actions: [
        {
          type: 'hunt-tile-draw',
          tiles: ['3'],
        },
      ],
      playerId: 'shadow',
    },
    {
      playerId: 'free-peoples',
      actions: [
        {
          type: 'fellowship-corruption',
          quantity: 3,
        },
      ],
      type: 'base',
      time: 303,
    },
    {
      actions: [
        {
          type: 'hunt-tile-add',
          tile: 'rers',
        },
      ],
      die: 'event',
      playerId: 'shadow',
      type: 'die-card',
      time: 304,
      card: 'scha02',
    },
    {
      playerId: 'free-peoples',
      type: 'die',
      time: 305,
      die: 'character',
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
    },
    {
      time: 306,
      type: 'base',
      actions: [
        {
          type: 'hunt-tile-draw',
          tiles: ['er'],
        },
      ],
      playerId: 'shadow',
    },
    {
      actions: [
        {
          type: 'fellowship-corruption',
          quantity: 2,
        },
      ],
      playerId: 'free-peoples',
      type: 'base',
      time: 307,
    },
    {
      time: 308,
      type: 'die',
      playerId: 'shadow',
      die: 'character',
      actions: [
        {
          characters: ['the-mouth-of-sauron'],
          type: 'character-movement',
          toRegion: 'north-downs',
          fromRegion: 'mount-gundabad',
        },
        {
          toRegion: 'andrast',
          type: 'nazgul-movement',
          fromRegion: 'grey-havens',
          nNazgul: 2,
        },
        {
          characters: ['the-witch-king'],
          toRegion: 'andrast',
          fromRegion: 'grey-havens',
          type: 'character-movement',
        },
      ],
    },
    {
      playerId: 'free-peoples',
      card: 'fpcha10',
      die: 'character',
      type: 'die-card',
      time: 309,
      actions: [
        {
          quantity: 1,
          type: 'fellowship-heal',
        },
        {
          type: 'fellowship-hide',
        },
      ],
      elvenRing: {
        fromDie: 'muster',
        ring: 'nenya',
        toDie: 'character',
      },
    },
    {
      playerId: 'shadow',
      die: 'character',
      time: 310,
      type: 'die',
      actions: [
        {
          characters: ['the-mouth-of-sauron'],
          type: 'character-movement',
          toRegion: 'grey-havens',
          fromRegion: 'north-downs',
        },
      ],
    },
    {
      elvenRing: {
        fromDie: 'muster',
        ring: 'narya',
        toDie: 'character',
      },
      die: 'character',
      actions: [
        {
          type: 'fellowship-progress',
        },
      ],
      time: 311,
      type: 'die',
      playerId: 'free-peoples',
    },
    {
      type: 'base',
      time: 312,
      actions: [
        {
          type: 'hunt-tile-draw',
          tiles: ['0r'],
        },
      ],
      playerId: 'shadow',
    },
  ],
};
