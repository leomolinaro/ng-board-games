import { BritNation, BritNationId } from "../brit-models";

export function createNations (): BritNation[] {
  return [
    createNation ("romans", "Romans", 16),
    createNation ("romano-british", "Romano-British", 8),
    createNation ("normans", "Normans", 8),
    createNation ("saxons", "Saxons", 20),
    createNation ("danes", "Danes", 18),
    createNation ("norwegians", "Norwegians", 12),
    createNation ("jutes", "Jutes", 6),
    createNation ("angles", "Angles", 17),
    createNation ("belgae", "Belgae", 10),
    createNation ("welsh", "Welsh", 13),
    createNation ("brigantes", "Brigantes", 11),
    createNation ("caledonians", "Caledonians", 7),
    createNation ("picts", "Picts", 10),
    createNation ("irish", "Irish", 8),
    createNation ("scots", "Scots", 11),
    createNation ("norsemen", "Norsemen", 10),
    createNation ("dubliners", "Dubliners", 9)
  ];
} // getNations

function createNation (id: BritNationId, name: string, nInfantries: number): BritNation {
  return {
    id: id,
    name: name,
    reinforcements: []
  };
} // getNation
