import { immutableUtil } from '../../../../../commons/utils/src';
import type { WotrCharacterId } from '../../character/wotr-character-models';
import type { WotrFrontId } from '../../front/wotr-front-models';
import type { WotrGameQuery } from '../../game/wotr-game-query';
import type { WotrNationId } from '../../nation/wotr-nation-models';
import type {
  WotrRegionUnitTypeMatch,
  WotrUnits,
} from '../../unit/wotr-unit-models';
import { unitTypeMatchLabel } from '../../unit/wotr-unit-models';
import type { WotrUnitModifiers } from '../../unit/wotr-unit-modifiers';
import type { WotrMovingUnits } from '../../unit/wotr-unit-ui';
import type { WotrUnitUtils } from '../../unit/wotr-unit-utils';
import type { WotrRegion, WotrRegionId } from '../wotr-region-models';
import type { UnitNode } from './wotr-region-unit-node';

export type WotrRegionUnitSelection =
  | WotrMovingArmyUnitSelection
  | WotrAttackingUnitSelection
  | WotrDisbandingUnitSelection
  | WotrChooseCasualtiesUnitSelection
  | WotrMovingCharactersUnitSelection
  | WotrMovingNazgulUnitSelection
  | WotrDowngradingUnitSelection
  | WotrEliminateUnitSelection
  | WotrForfeitLeadershipSelection
  | WotrRageOfTheDunlendingsUnitSelection
  | WotrHeroicDeathUnitSelection
  | WotrBlackBreathUnitSelection
  | WotrWordsOfPowerUnitSelection
  | WotrTheGreyCompanyUnitSelection;

interface AWotrRegionUnitSelection {
  type: string;
  regionIds: WotrRegionId[];
}

export interface WotrMovingCharactersUnitSelection extends AWotrRegionUnitSelection {
  type: 'moveCharacters';
  characters: WotrCharacterId[];
  requiredCharacters: WotrCharacterId[];
}

export interface WotrMovingNazgulUnitSelection extends AWotrRegionUnitSelection {
  type: 'moveNazgul';
}

export interface WotrMovingArmyUnitSelection extends AWotrRegionUnitSelection {
  type: 'moveArmy';
  requiredUnits: (
    'anyLeader' | 'anyNazgul' | 'anyCharacter' | WotrCharacterId
  )[];
  retroguard: WotrUnits | undefined;
  required: boolean;
  doneMovements: WotrMovingUnits[];
}

export interface WotrAttackingUnitSelection extends AWotrRegionUnitSelection {
  type: 'attack';
  requiredUnits: (
    'anyLeader' | 'anyNazgul' | 'anyCharacter' | WotrCharacterId
  )[];
  frontId: WotrFrontId;
}

export interface WotrDisbandingUnitSelection extends AWotrRegionUnitSelection {
  type: 'disband';
  nArmyUnits: number;
  isUnderSiege: boolean;
}

export interface WotrChooseCasualtiesUnitSelection extends AWotrRegionUnitSelection {
  type: 'chooseCasualties';
  hitPoints: number | 'full';
  isUnderSiege: boolean;
  retroguard: WotrUnits | undefined;
}

export interface WotrDowngradingUnitSelection extends AWotrRegionUnitSelection {
  type: 'downgradeUnit';
  nEliteUnits: 1;
  allowRegularElimination: boolean;
}

export interface WotrEliminateUnitSelection extends AWotrRegionUnitSelection {
  type: 'eliminateUnit';
  unitType: WotrRegionUnitTypeMatch;
  nationId: WotrNationId | undefined;
}

export interface WotrForfeitLeadershipSelection extends AWotrRegionUnitSelection {
  type: 'forfeitLeadership';
  frontId: WotrFrontId;
  points: 'all' | { min: number };
  leaderRestriction: 'nazgul' | 'companions' | WotrCharacterId | undefined;
  message: string;
}

export interface WotrRageOfTheDunlendingsUnitSelection extends AWotrRegionUnitSelection {
  type: 'rageOfTheDunlendings';
  maxNArmyUnits: number;
}

export interface WotrHeroicDeathUnitSelection extends AWotrRegionUnitSelection {
  type: 'heroicDeath';
}

export interface WotrBlackBreathUnitSelection extends AWotrRegionUnitSelection {
  type: 'blackBreath';
  hits: number;
}

export interface WotrWordsOfPowerUnitSelection extends AWotrRegionUnitSelection {
  type: 'wordsOfPower';
}

export interface WotrTheGreyCompanyUnitSelection extends AWotrRegionUnitSelection {
  type: 'theGreyCompany';
  nationIds: WotrNationId[];
}

interface WotrRegionUnitSelectionMode {
  initialize(unitNodes: UnitNode[], region: WotrRegion): void;
  canConfirm(selectedNodes: UnitNode[], region: WotrRegion): true | string;
}

export function selectionModeFactory(
  unitSelection: WotrRegionUnitSelection,
  q: WotrGameQuery,
  unitModifiers: WotrUnitModifiers,
  unitUtils: WotrUnitUtils,
): WotrRegionUnitSelectionMode {
  switch (unitSelection.type) {
    case 'moveArmy':
      return new MoveArmySelectionMode(
        unitSelection,
        q,
        unitModifiers,
        unitUtils,
      );
    case 'attack':
      return new AttackSelectionMode(unitSelection, q, unitModifiers);
    case 'disband':
      return new DisbandSelectionMode(
        unitSelection.nArmyUnits,
        unitSelection.isUnderSiege,
      );
    case 'moveCharacters':
      return new MoveCharactersSelectionMode(unitSelection, q);
    case 'moveNazgul':
      return new MoveNazgulSelectionMode(unitSelection);
    case 'chooseCasualties':
      return new ChooseCasualtiesSelectionMode(unitSelection);
    case 'downgradeUnit':
      return new DowngradeUnitSelectionMode(
        unitSelection.nEliteUnits,
        unitSelection.allowRegularElimination,
      );
    case 'eliminateUnit':
      return new EliminateUnitSelectionMode(
        unitSelection.unitType,
        unitSelection.nationId,
      );
    case 'forfeitLeadership':
      return new ForfeitLeadershipSelectionMode(unitSelection);
    case 'rageOfTheDunlendings':
      return new RageOfTheDunlendingsSelectionMode(unitSelection);
    case 'heroicDeath':
      return new HeroicDeathSelectionMode(unitSelection);
    case 'blackBreath':
      return new BlackBreathSelectionMode(unitSelection);
    case 'wordsOfPower':
      return new WordsOfPowerSelectionMode(unitSelection);
    case 'theGreyCompany':
      return new TheGreyCompanySelectionMode(unitSelection);
    default:
      throw new Error(`Unknown selection mode type`);
  }
}

class DisbandSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(
    private nArmyUnits: number,
    private underSiege: boolean,
  ) {}

  initialize(unitNodes: UnitNode[]): void {
    const group = this.underSiege ? 'underSiege' : 'army';
    for (const unitNode of unitNodes) {
      if (
        unitNode.group === group &&
        (unitNode.type === 'regular' || unitNode.type === 'elite')
      ) {
        unitNode.selectable = true;
      }
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    const armyUnits = selectedNodes.filter(
      (node) => node.type === 'regular' || node.type === 'elite',
    );
    if (armyUnits.length !== this.nArmyUnits) {
      return `Select at least ${this.nArmyUnits} army units to disband.`;
    }
    return true;
  }
}

export class MoveArmySelectionMode implements WotrRegionUnitSelectionMode {
  constructor(
    private unitSelection: WotrMovingArmyUnitSelection,
    private q: WotrGameQuery,
    private unitModifiers: WotrUnitModifiers,
    private unitUtils: WotrUnitUtils,
  ) {}

  initialize(unitNodes: UnitNode[], region: WotrRegion): void {
    if (this.unitSelection.retroguard)
      unitNodes = removeUnitNodes(unitNodes, this.unitSelection.retroguard);
    for (const doneMovement of this.unitSelection.doneMovements) {
      if (doneMovement.toRegion === region.id) {
        unitNodes = removeUnitNodes(unitNodes, doneMovement.units);
      }
    }
    for (const unitNode of unitNodes) {
      if (unitNode.group !== 'army') continue;
      if (
        unitNode.type === 'character' &&
        this.q.character(unitNode.id as WotrCharacterId).level === 0
      )
        continue;
      unitNode.selectable = true;
      unitNode.selected = true;
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    if (selectedNodes.length === 0 && !this.unitSelection.required) return true;
    const someArmyUnits = selectedNodes.some((node) => {
      if (node.type === 'regular') return true;
      if (node.type === 'elite') return true;
      return false;
    });
    if (!someArmyUnits)
      return 'Select at least one regular or elite unit to move.';
    if (!this.unitSelection.required) return true;
    for (const requiredUnit of this.unitSelection.requiredUnits) {
      switch (requiredUnit) {
        case 'anyLeader': {
          const someLeaders = hasLeaders(selectedNodes, this.unitModifiers);
          if (!someLeaders) return 'Select at least one leader to move.';

          break;
        }
        case 'anyNazgul': {
          const someNazgul = selectedNodes.some(
            (node) =>
              node.type === 'nazgul' ||
              (node.type === 'character' && node.id === 'the-witch-king'),
          );
          if (!someNazgul) return 'Select at least one Nazgul to move.';

          break;
        }
        case 'anyCharacter': {
          const someCharacters = selectedNodes.some(
            (node) => node.type === 'character',
          );
          if (!someCharacters) return 'Select at least one character to move.';

          break;
        }
        default: {
          if (!hasCharacter(selectedNodes, requiredUnit)) {
            const character = this.q.character(requiredUnit);
            return `Select (${character.name}) to move.`;
          }
        }
      }
    }
    return true;
  }
}

function removeUnitNodes(nodes: UnitNode[], removing: WotrUnits): UnitNode[] {
  if (removing.regulars)
    for (const unit of removing.regulars) {
      for (let i = 0; i < unit.quantity; i++) {
        nodes = immutableUtil.listRemoveFirst(
          (node) => node.type === 'regular' && node.nationId === unit.nation,
          nodes,
        );
      }
    }
  if (removing.elites)
    for (const unit of removing.elites) {
      for (let i = 0; i < unit.quantity; i++) {
        nodes = immutableUtil.listRemoveFirst(
          (node) => node.type === 'elite' && node.nationId === unit.nation,
          nodes,
        );
      }
    }
  if (removing.leaders)
    for (const unit of removing.leaders) {
      for (let i = 0; i < unit.quantity; i++) {
        nodes = immutableUtil.listRemoveFirst(
          (node) => node.type === 'leader' && node.nationId === unit.nation,
          nodes,
        );
      }
    }
  if (removing.nNazgul) {
    for (let i = 0; i < removing.nNazgul; i++) {
      nodes = immutableUtil.listRemoveFirst(
        (node) => node.type === 'nazgul',
        nodes,
      );
    }
  }
  if (removing.characters)
    for (const unit of removing.characters) {
      nodes = immutableUtil.listRemoveFirst(
        (node) => node.type === 'character' && node.id === unit,
        nodes,
      );
    }
  return nodes;
}

function hasLeaders(
  selectedNodes: UnitNode[],
  unitModifiers: WotrUnitModifiers,
): boolean {
  return selectedNodes.some((node) => {
    if (node.type === 'character') return true;
    if (node.type === 'nazgul') return true;
    if (node.type === 'leader') return true;
    if (
      (node.type === 'regular' || node.type === 'elite') &&
      node.nationId &&
      unitModifiers.isLeader(node.type, node.nationId)
    )
      return true;
    return false;
  });
}

function hasCharacter(
  selectedNodes: UnitNode[],
  characterId: WotrCharacterId,
): boolean {
  return selectedNodes.some((node) => {
    return node.type === 'character' && node.id === characterId;
  });
}

export class AttackSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(
    private selection: WotrAttackingUnitSelection,
    private q: WotrGameQuery,
    private unitModifiers: WotrUnitModifiers,
  ) {}

  initialize(unitNodes: UnitNode[], region: WotrRegion): void {
    const isUnderSiegeArmy =
      region.underSiegeArmy?.front === this.selection.frontId;
    for (const unitNode of unitNodes) {
      if (unitNode.group !== 'army' && unitNode.group !== 'underSiege')
        continue;
      if (isUnderSiegeArmy) {
        if (unitNode.group !== 'underSiege') continue;
      } else {
        if (unitNode.group !== 'army') continue;
      }
      if (
        (unitNode.type === 'regular' ||
          unitNode.type === 'elite' ||
          unitNode.type === 'leader') &&
        !this.q.nation(unitNode.nationId).isAtWar()
      )
        continue;
      unitNode.selectable = true;
      unitNode.selected = true;
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    const someArmyUnits = selectedNodes.some((node) => {
      if (node.type === 'regular') return true;
      if (node.type === 'elite') return true;
      return false;
    });
    if (!someArmyUnits)
      return 'Select at least one regular or elite unit to attack.';
    for (const requiredUnit of this.selection.requiredUnits) {
      switch (requiredUnit) {
        case 'anyLeader': {
          const someLeaders = hasLeaders(selectedNodes, this.unitModifiers);
          if (!someLeaders) return 'Select at least one leader to attack with.';
          break;
        }
        case 'anyNazgul': {
          const someNazgul = selectedNodes.some(
            (node) =>
              node.type === 'nazgul' ||
              (node.type === 'character' && node.id === 'the-witch-king'),
          );
          if (!someNazgul) return 'Select at least one Nazgûl to attack with.';
          break;
        }
        case 'anyCharacter': {
          const someCharacters = selectedNodes.some(
            (node) => node.type === 'character',
          );
          if (!someCharacters)
            return 'Select at least one character to attack with.';
          break;
        }
        default: {
          if (!hasCharacter(selectedNodes, requiredUnit)) {
            const character = this.q.character(requiredUnit);
            return `Select (${character.name}) to move.`;
          }
        }
      }
    }
    return true;
  }
}

export class MoveCharactersSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(
    private unitSelection: WotrMovingCharactersUnitSelection,
    private q: WotrGameQuery,
  ) {}

  initialize(unitNodes: UnitNode[]): void {
    for (const unitNode of unitNodes) {
      if (unitNode.type !== 'character') continue;
      if (
        !this.unitSelection.characters.includes(unitNode.id as WotrCharacterId)
      )
        continue;

      unitNode.selectable = true;
      unitNode.selected = true;
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    if (selectedNodes.length === 0) {
      return 'Select at least one character to move.';
    }
    for (const requiredCharacter of this.unitSelection.requiredCharacters) {
      if (!hasCharacter(selectedNodes, requiredCharacter)) {
        const character = this.q.character(requiredCharacter);
        return `Select (${character.name}) to move.`;
      }
    }
    return true;
  }
}

export class MoveNazgulSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(private unitSelection: WotrMovingNazgulUnitSelection) {}

  initialize(unitNodes: UnitNode[]): void {
    for (const unitNode of unitNodes) {
      if (!(
        unitNode.type === 'nazgul' ||
        (unitNode.type === 'character' && unitNode.id === 'the-witch-king')
      )) {
        continue;
      }

      unitNode.selectable = true;
      unitNode.selected = true;
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    if (selectedNodes.length === 0) {
      return 'Select at least one Nazgul to move.';
    }
    return true;
  }
}

export class ChooseCasualtiesSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(private unitSelection: WotrChooseCasualtiesUnitSelection) {}

  initialize(unitNodes: UnitNode[]): void {
    if (this.unitSelection.retroguard) {
      unitNodes = removeUnitNodes(unitNodes, this.unitSelection.retroguard);
    }
    const group = this.unitSelection.isUnderSiege ? 'underSiege' : 'army';
    if (this.unitSelection.hitPoints === 'full') {
      for (const node of unitNodes) {
        if (node.group === group) {
          node.removing = true;
        }
      }
    } else {
      for (const node of unitNodes) {
        if (
          node.group === group &&
          (node.type === 'regular' || node.type === 'elite')
        ) {
          node.selectable = true;
        }
      }
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    const group = this.unitSelection.isUnderSiege ? 'underSiege' : 'army';
    const nodes = selectedNodes.filter((node) => node.group === group);
    if (this.unitSelection.hitPoints === 'full') {
      return nodes.every((node) => node.removing)
        ? true
        : 'Remove all the units.';
    }
    let selectedHitPoints = 0;
    for (const node of nodes) {
      switch (node.type) {
        case 'regular':
          if (node.removing) {
            selectedHitPoints += 1;
          }
          break;
        case 'elite':
          if (node.downgrading) {
            selectedHitPoints += 1;
          } else if (node.removing) {
            selectedHitPoints += 2;
          }
          break;
      }
    }
    if (selectedHitPoints !== this.unitSelection.hitPoints)
      return `Select casualties with ${this.unitSelection.hitPoints} hit points.`;
    return true;
  }
}

export class DowngradeUnitSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(
    private nEliteUnits: 1,
    private allowRegularElimination: boolean,
  ) {}

  initialize(unitNodes: UnitNode[]): void {
    for (const node of unitNodes) {
      if (node.group !== 'army') continue;
      if (
        node.type === 'elite' ||
        (node.type === 'regular' && this.allowRegularElimination)
      ) {
        node.selectable = true;
      }
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    const eliteUnits = selectedNodes.filter((node) => node.type === 'elite');
    if (eliteUnits.length !== this.nEliteUnits) {
      if (this.allowRegularElimination) {
        const regularUnits = selectedNodes.filter(
          (node) => node.type === 'regular',
        );
        if (regularUnits.length !== this.nEliteUnits) {
          return `Select ${this.nEliteUnits} elite unit${this.nEliteUnits > 1 ? 's' : ''} to downgrade or a regular unit${this.nEliteUnits > 1 ? 's' : ''} to eliminate.`;
        }
      }
      return `Select ${this.nEliteUnits} elite unit${this.nEliteUnits > 1 ? 's' : ''} to downgrade.`;
    }
    return true;
  }
}

export class EliminateUnitSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(
    private unitType: WotrRegionUnitTypeMatch,
    private nationId: WotrNationId | undefined,
  ) {}

  initialize(unitNodes: UnitNode[]): void {
    for (const node of unitNodes) {
      node.selectable = this.isSelectable(this.unitType, node);
    }
  }

  private isSelectable(type: WotrRegionUnitTypeMatch, node: UnitNode): boolean {
    if (this.nationId && node.nationId !== this.nationId) return false;
    switch (type) {
      case 'regular':
        return node.type === 'regular';
      case 'elite':
        return node.type === 'elite';
      case 'leader':
        return node.type === 'leader';
      case 'army':
        return node.type === 'regular' || node.type === 'elite';
      case 'nazgul':
        return node.type === 'nazgul';
      case 'companion':
        return node.type === 'character' && node.frontId === 'free-peoples';
      case 'minion':
        return node.type === 'character' && node.frontId === 'shadow';
      case 'nazgulOrMinion':
        return (
          (node.type === 'character' && node.frontId === 'shadow') ||
          node.type === 'nazgul'
        );
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    if (selectedNodes.length !== 1) {
      return `Select one ${unitTypeMatchLabel(this.unitType)} to eliminate.`;
    }
    return true;
  }
}

export class ForfeitLeadershipSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(private params: WotrForfeitLeadershipSelection) {}

  initialize(unitNodes: UnitNode[]): void {
    for (const node of unitNodes) {
      if (this.isSelectable(node)) {
        if (this.params.points === 'all') {
          node.selected = true;
        } else {
          node.selectable = true;
        }
      }
    }
  }

  private isSelectable(node: UnitNode): boolean {
    if (node.frontId !== this.params.frontId) return false;
    if (this.params.leaderRestriction) {
      if (this.params.leaderRestriction === 'nazgul') {
        if (node.type === 'nazgul') return true;
        if (node.type === 'character' && node.id === 'the-witch-king')
          return true;
        return false;
      }
      return this.params.leaderRestriction === 'companions'
        ? node.type === 'character' && node.frontId === 'free-peoples'
        : node.type === 'character' &&
            node.character.id === this.params.leaderRestriction;
    }
    return (
      node.type === 'leader' ||
      node.type === 'nazgul' ||
      node.type === 'character'
    );
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    if (this.params.points === 'all') return true;
    let totalPoints = 0;
    for (const node of selectedNodes) {
      switch (node.type) {
        case 'leader':
          totalPoints += 1;
          break;
        case 'nazgul':
          totalPoints += 1;
          break;
        case 'character':
          totalPoints += node.character.leadership;
          break;
      }
    }
    if (totalPoints >= this.params.points.min) return true;
    return this.params.message;
  }
}

export class RageOfTheDunlendingsSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(private unitSelection: WotrRageOfTheDunlendingsUnitSelection) {}

  initialize(unitNodes: UnitNode[]): void {
    for (const node of unitNodes) {
      if (
        node.group === 'army' &&
        (node.type === 'regular' || node.type === 'elite') &&
        node.nationId === 'isengard'
      ) {
        node.selectable = true;
      }
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    if (
      selectedNodes.length > 0 &&
      selectedNodes.length <= this.unitSelection.maxNArmyUnits
    ) {
      return true;
    }
    return `Select up to ${this.unitSelection.maxNArmyUnits} units to move.`;
  }
}

export class HeroicDeathSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(private unitSelection: WotrHeroicDeathUnitSelection) {}

  initialize(unitNodes: UnitNode[]): void {
    for (const node of unitNodes) {
      if (node.frontId !== 'free-peoples') continue;
      if (node.type === 'character' || node.type === 'leader') {
        node.selectable = true;
      }
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    if (selectedNodes.length === 1) return true;
    return 'Select one character or leader to eliminate.';
  }
}

export class BlackBreathSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(private unitSelection: WotrBlackBreathUnitSelection) {}

  initialize(unitNodes: UnitNode[]): void {
    for (const node of unitNodes) {
      if (node.frontId !== 'free-peoples') continue;
      if (node.type === 'leader') {
        node.selectable = true;
      } else if (node.type === 'character') {
        const level = node.character.level;
        if (level <= this.unitSelection.hits) node.selectable = true;
      }
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    if (selectedNodes.length === 1) return true;
    return 'Select one character or leader to eliminate.';
  }
}

export class WordsOfPowerSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(private unitSelection: WotrWordsOfPowerUnitSelection) {}

  initialize(unitNodes: UnitNode[]): void {
    for (const node of unitNodes) {
      if (node.frontId !== 'free-peoples') continue;
      if (node.type === 'character') {
        node.selectable = true;
      }
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    if (selectedNodes.length === 1) return true;
    return 'Select one Companion to cancel.';
  }
}

export class TheGreyCompanySelectionMode implements WotrRegionUnitSelectionMode {
  constructor(private unitSelection: WotrTheGreyCompanyUnitSelection) {}

  initialize(unitNodes: UnitNode[]): void {
    for (const node of unitNodes) {
      if (
        node.type === 'regular' &&
        node.frontId === 'free-peoples' &&
        this.unitSelection.nationIds.includes(node.nationId)
      ) {
        node.selectable = true;
      }
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    if (selectedNodes.length === 1) return true;
    return 'Select one regular unit to eliminate.';
  }
}
