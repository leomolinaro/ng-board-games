import { immutableUtil } from "@leobg/commons/utils";
import { WotrFrontId } from "./wotr-front.models";
import { WotrArmyUnitType, WotrNationId } from "./wotr-nation.models";
import { WotrNeighbor, WotrRegion, WotrRegionId, WotrSettlentType } from "./wotr-region.models";

export interface WotrRegionState {
  map: Record<WotrRegionId, WotrRegion>;
  ids: WotrRegionId[];
}

export function initRegionState (): WotrRegionState {
  return {
    ids: [
      "forlindon", "north-ered-luin", "ered-luin", "grey-havens", "harlindon", "tower-hills",
      "evendim", "arnor", "north-downs", "bree", "buckland", "the-shire", "south-ered-luin", "minhiriath",
      "cardolan", "old-forest", "south-downs", "weather-hills", "ettenmoors", "angmar", "mount-gram",
      "mount-gundabad", "troll-shaws", "rivendell", "fords-of-bruinen", "hollin", "moria", "north-dunland", "tharbad",
      "south-dunland", "enedwaith", "gap-of-rohan", "orthanc", "druwaith-iaur", "andrast", "high-pass", "goblins-gate",
      "eagles-eyre", "old-ford", "gladden-fields", "dimrill-dale", "lorien", "parth-celebrant", "fangorn", "fords-of-isen",
      "helms-deep", "westemnet", "edoras", "folde", "eastemnet", "anfalas", "erech", "dol-amroth", "lamedon", "pelargir",
      "lossarnach", "minas-tirith", "druadan-forest", "carrock", "rhosgobel", "north-anduin-vale", "south-anduin-vale",
      "western-brown-lands", "western-emyn-muil", "dead-marshes", "osgiliath", "south-ithilien", "north-ithilien", "eastern-emyn-muil",
      "eastern-brown-lands", "dagorlad", "ash-mountains", "noman-lands", "southern-dorwinion", "northern-dorwinion", "southern-rhovanion",
      "northern-rhovanion", "vale-of-the-celduin", "vale-of-the-carnen", "eastern-mirkwood", "narrows-of-the-forest", "dol-guldur",
      "southern-mirkwood", "old-forest-road", "western-mirkwood", "northern-mirkwood", "withered-heath", "woodland-realm", "dale",
      "erebor", "iron-hills", "north-rhun", "east-rhun", "south-rhun", "morannon", "minas-morgul", "gorgoroth", "nurn", "barad-dur",
      "west-harondor", "east-harondor", "umbar", "near-harad", "far-harad", "khand"
    ],
    map: {
      forlindon: initRegion ("forlindon", "Forlindon", null, false, null, ["grey-havens"], ["north-ered-luin", "ered-luin"], true),
      "north-ered-luin": initRegion ("north-ered-luin", "North Ered Luin", "dwarves", false, null, ["ered-luin", "evendim"], ["forlindon"], true),
      "ered-luin": initRegion ("ered-luin", "Ered Luin", "dwarves", false, "town", ["north-ered-luin", "evendim", "tower-hills", "grey-havens"], ["forlindon"], false),
      "grey-havens": initRegion ("grey-havens", "Grey Havens", "elves", false, "stronghold", ["forlindon", "ered-luin", "tower-hills", "harlindon"], [], true),
      harlindon: initRegion ("harlindon", "Harlindon", null, false, null, ["grey-havens", "south-ered-luin"], ["tower-hills"], true),
      "tower-hills": initRegion ("tower-hills", "Tower Hills", null, false, null, ["grey-havens", "ered-luin", "evendim", "the-shire", "south-ered-luin"], ["harlindon"], false),
      evendim: initRegion ("evendim", "Evendim", null, false, null, ["arnor", "north-downs", "buckland", "the-shire", "tower-hills", "ered-luin", "north-ered-luin"], [], true),
      arnor: initRegion ("arnor", "Arnor", null, false, null, ["angmar", "ettenmoors", "north-downs", "evendim"], [], false),
      "north-downs": initRegion ("north-downs", "North Downs", "north", false, null, ["arnor", "ettenmoors", "weather-hills", "bree", "buckland", "evendim"], [], false),
      bree: initRegion ("bree", "Bree", "north", false, "town", ["north-downs", "weather-hills", "south-downs", "buckland"], [], false),
      buckland: initRegion ("buckland", "Buckland", "north", false, null, ["north-downs", "bree", "south-downs", "cardolan", "old-forest", "the-shire", "evendim"], [], false),
      "the-shire": initRegion ("the-shire", "The Shire", "north", false, "city", ["evendim", "buckland", "old-forest", "south-ered-luin", "tower-hills"], [], false),
      "south-ered-luin": initRegion ("south-ered-luin", "South Ered Luin", null, false, null, ["the-shire", "old-forest", "cardolan", "minhiriath", "harlindon", "tower-hills"], [], true),
      minhiriath: initRegion ("minhiriath", "Minhiriath", null, false, null, ["south-ered-luin", "cardolan", "tharbad", "enedwaith"], [], true),
      cardolan: initRegion ("cardolan", "Cardolan", null, false, null, ["old-forest", "buckland", "south-downs", "north-dunland", "tharbad", "minhiriath", "south-ered-luin"], [], false),
      "old-forest": initRegion ("old-forest", "Old Forest", null, false, null, ["buckland", "cardolan", "south-ered-luin", "the-shire"], [], false),
      "south-downs": initRegion ("south-downs", "South Downs", null, false, null, ["bree", "weather-hills", "troll-shaws", "hollin", "north-dunland", "cardolan", "buckland"], [], false),
      "weather-hills": initRegion ("weather-hills", "Weather Hills", null, false, null, ["ettenmoors", "troll-shaws", "south-downs", "bree", "north-downs"], [], false),
      ettenmoors: initRegion ("ettenmoors", "Ettenmoors", null, false, null, ["angmar", "mount-gram", "troll-shaws", "weather-hills", "north-downs", "arnor"], ["mount-gundabad"], false),
      angmar: initRegion ("angmar", "Angmar", "sauron", false, "city", ["mount-gram", "ettenmoors", "arnor"], [], false),
      "mount-gram": initRegion ("mount-gram", "Mount Gram", "sauron", false, null, ["angmar", "mount-gundabad", "ettenmoors"], [], false),
      "mount-gundabad": initRegion ("mount-gundabad", "Mount Gundabad", "sauron", false, "stronghold", ["mount-gram", "eagles-eyre"], ["ettenmoors", "troll-shaws", "rivendell", "carrock"], false),
      "troll-shaws": initRegion ("troll-shaws", "Troll Shaws", null, false, null, ["rivendell", "fords-of-bruinen", "hollin", "south-downs", "weather-hills", "ettenmoors"], ["mount-gundabad"], false),
      rivendell: initRegion ("rivendell", "Rivendell", "elves", false, "stronghold", ["fords-of-bruinen", "troll-shaws"], ["mount-gundabad", "eagles-eyre", "old-ford", "goblins-gate", "high-pass"], false),
      "fords-of-bruinen": initRegion ("fords-of-bruinen", "Fords of Bruinen", null, false, null, ["rivendell", "high-pass", "hollin", "troll-shaws"], ["moria"], false),
      hollin: initRegion ("hollin", "Hollin", null, false, null, ["fords-of-bruinen", "moria", "north-dunland", "south-downs", "troll-shaws"], [], false),
      moria: initRegion ("moria", "Moria", "sauron", false, "stronghold", ["hollin", "dimrill-dale", "north-dunland"], ["fords-of-bruinen", "high-pass", "goblins-gate", "old-ford", "gladden-fields"], false),
      "north-dunland": initRegion ("north-dunland", "North Dunland", null, false, "town", ["hollin", "moria", "south-dunland", "tharbad", "cardolan", "south-downs"], ["lorien", "parth-celebrant", "fangorn"], false),
      tharbad: initRegion ("tharbad", "Tharbad", null, false, null, ["cardolan", "north-dunland", "south-dunland", "enedwaith", "minhiriath"], [], false),
      "south-dunland": initRegion ("south-dunland", "South Dunland", null, false, "town", ["north-dunland", "gap-of-rohan", "enedwaith", "tharbad"], ["fangorn", "orthanc"], false),
      enedwaith: initRegion ("enedwaith", "Enedwaith", null, false, null, ["tharbad", "south-dunland", "gap-of-rohan", "druwaith-iaur", "minhiriath"], [], true),
      "gap-of-rohan": initRegion ("gap-of-rohan", "Gap of Rohan", null, false, null, ["south-dunland", "orthanc", "fords-of-isen", "druwaith-iaur", "enedwaith"], [], false),
      orthanc: initRegion ("orthanc", "Orthanc", null, false, "stronghold", ["fords-of-isen", "gap-of-rohan"], ["south-dunland", "fangorn"], false),
      "druwaith-iaur": initRegion ("druwaith-iaur", "Druwaith Iaur", null, false, null, ["enedwaith", "gap-of-rohan", "fords-of-isen", "andrast"], ["anfalas"], true),
      andrast: initRegion ("andrast", "Andrast", null, false, null, ["druwaith-iaur", "anfalas"], [], true),
      "high-pass": initRegion ("high-pass", "High-pass", null, false, null, ["goblins-gate", "fords-of-bruinen"], ["rivendell", "moria"], false),
      "goblins-gate": initRegion ("goblins-gate", "Goblins Gate", null, false, null, ["high-pass", "old-ford"], ["rivendell", "moria"], false),
      "eagles-eyre": initRegion ("eagles-eyre", "Eagle's Eyre", null, false, null, ["mount-gundabad", "carrock", "old-ford"], ["rivendell"], false),
      "old-ford": initRegion ("old-ford", "Old Ford", null, false, null, ["eagles-eyre", "carrock", "rhosgobel", "gladden-fields", "goblins-gate"], ["moria", "rivendell"], false),
      "gladden-fields": initRegion ("gladden-fields", "Gladden Fields", null, false, null, ["old-ford", "rhosgobel", "north-anduin-vale", "dimrill-dale"], ["moria"], false),
      "dimrill-dale": initRegion ("dimrill-dale", "Dimrill Dale", null, false, null, ["gladden-fields", "north-anduin-vale", "south-anduin-vale", "parth-celebrant", "lorien"], [], false),
      lorien: initRegion ("lorien", "Lorien", "elves", false, "stronghold", ["dimrill-dale", "parth-celebrant"], ["moria", "north-dunland"], false),
      "parth-celebrant": initRegion ("parth-celebrant", "Parth Celebrant", null, false, null, ["lorien", "south-anduin-vale", "western-brown-lands", "eastemnet", "fangorn"], ["north-dunland"], false),
      fangorn: initRegion ("fangorn", "Fangorn", null, false, null, ["parth-celebrant", "eastemnet", "westemnet", "fords-of-isen"], ["north-dunland", "south-dunland", "orthanc"], false),
      "fords-of-isen": initRegion ("fords-of-isen", "Fords of Isen", "rohan", true, null, ["gap-of-rohan", "orthanc", "fangorn", "westemnet", "helms-deep", "druwaith-iaur"], ["anfalas"], false),
      "helms-deep": initRegion ("helms-deep", "Helms Deep", "rohan", false, "stronghold", ["fords-of-isen", "westemnet"], ["anfalas", "erech"], false),
      westemnet: initRegion ("westemnet", "Westemnet", "rohan", false, "town", ["fangorn", "eastemnet", "folde", "edoras", "helms-deep", "fords-of-isen"], ["erech"], false),
      edoras: initRegion ("edoras", "Edoras", "rohan", false, "city", ["westemnet", "folde"], ["erech", "lamedon"], false),
      folde: initRegion ("folde", "Folde", "rohan", false, "town", ["edoras", "westemnet", "eastemnet", "druadan-forest"], ["lamedon"], false),
      eastemnet: initRegion ("eastemnet", "Eastemnet", "rohan", false, null, ["fangorn", "parth-celebrant", "western-brown-lands", "western-emyn-muil", "druadan-forest", "folde", "westemnet"], [], false),
      anfalas: initRegion ("anfalas", "Anfalas", "gondor", false, null, ["andrast", "erech", "dol-amroth"], ["fords-of-isen", "helms-deep"], true),
      erech: initRegion ("erech", "Erech", "gondor", false, null, ["anfalas", "dol-amroth", "lamedon"], ["helms-deep", "westemnet", "edoras"], false),
      "dol-amroth": initRegion ("dol-amroth", "Dol Amroth", "gondor", false, "stronghold", ["anfalas", "erech", "lamedon"], [], true),
      lamedon: initRegion ("lamedon", "Lamedon", "gondor", false, "town", ["erech", "dol-amroth", "pelargir"], ["edoras", "folde", "lossarnach", "minas-tirith", "druadan-forest"], false),
      pelargir: initRegion ("pelargir", "Pelargir", "gondor", false, "city", ["lamedon", "lossarnach", "osgiliath", "west-harondor"], [], true),
      lossarnach: initRegion ("lossarnach", "Lossarnach", "gondor", false, "town", ["minas-tirith", "osgiliath", "pelargir"], ["lamedon"], false),
      "minas-tirith": initRegion ("minas-tirith", "Minas Tirith", "gondor", false, "stronghold", ["druadan-forest", "osgiliath", "lossarnach"], ["lamedon"], false),
      "druadan-forest": initRegion ("druadan-forest", "Druadan Forest", "gondor", false, null, ["folde", "eastemnet", "western-emyn-muil", "dead-marshes", "osgiliath", "minas-tirith"], ["lamedon"], false),
      carrock: initRegion ("carrock", "Carrock", "north", false, "town", ["eagles-eyre", "old-ford", "rhosgobel", "old-forest-road", "western-mirkwood", "northern-mirkwood"], ["mount-gundabad"], false),
      rhosgobel: initRegion ("rhosgobel", "Rhosgobel", "north", false, null, ["carrock", "old-forest-road", "narrows-of-the-forest", "north-anduin-vale", "gladden-fields", "old-ford"], [], false),
      "north-anduin-vale": initRegion ("north-anduin-vale", "North Anduin Vale", null, false, null, ["rhosgobel", "narrows-of-the-forest", "dol-guldur", "south-anduin-vale", "dimrill-dale", "gladden-fields"], [], false),
      "south-anduin-vale": initRegion ("south-anduin-vale", "South Anduin Vale", null, false, null, ["north-anduin-vale", "dol-guldur", "western-brown-lands", "parth-celebrant", "dimrill-dale"], [], false),
      "western-brown-lands": initRegion ("western-brown-lands", "Western Brown Lands", null, false, null, ["south-anduin-vale", "dol-guldur", "eastern-brown-lands", "western-emyn-muil", "eastemnet", "parth-celebrant"], [], false),
      "western-emyn-muil": initRegion ("western-emyn-muil", "Western Emyn Muil", null, false, null, ["western-brown-lands", "eastern-brown-lands", "eastern-emyn-muil", "dead-marshes", "druadan-forest", "eastemnet"], [], false),
      "dead-marshes": initRegion ("dead-marshes", "Dead Marshes", null, false, null, ["western-emyn-muil", "eastern-emyn-muil", "north-ithilien", "osgiliath", "druadan-forest"], [], false),
      osgiliath: initRegion ("osgiliath", "Osgiliath", null, true, null, ["dead-marshes", "north-ithilien", "south-ithilien", "west-harondor", "pelargir", "lossarnach", "minas-tirith", "druadan-forest"], [], false),
      "south-ithilien": initRegion ("south-ithilien", "South Ithilien", null, false, null, ["north-ithilien", "minas-morgul", "east-harondor", "west-harondor", "osgiliath"], ["gorgoroth", "nurn"], false),
      "north-ithilien": initRegion ("north-ithilien", "North Ithilien", null, false, null, ["eastern-emyn-muil", "dagorlad", "minas-morgul", "south-ithilien", "osgiliath", "dead-marshes"], ["morannon"], false),
      "eastern-emyn-muil": initRegion ("eastern-emyn-muil", "Eastern Emyn Muil", null, false, null, ["eastern-brown-lands", "noman-lands", "dagorlad", "north-ithilien", "dead-marshes", "western-emyn-muil"], [], false),
      "eastern-brown-lands": initRegion ("eastern-brown-lands", "Eastern Brown Lands", null, false, null, ["southern-mirkwood", "southern-rhovanion", "noman-lands", "eastern-emyn-muil", "western-emyn-muil", "western-brown-lands", "dol-guldur"], [], false),
      dagorlad: initRegion ("dagorlad", "Dagorlad", null, false, null, ["noman-lands", "ash-mountains", "morannon", "north-ithilien", "eastern-emyn-muil"], [], false),
      "ash-mountains": initRegion ("ash-mountains", "Ash Mountains", null, false, null, ["dagorlad", "noman-lands", "southern-dorwinion", "south-rhun"], ["morannon", "barad-dur"], false),
      "noman-lands": initRegion ("noman-lands", "Noman-Lands", null, false, null, ["southern-rhovanion", "southern-dorwinion", "ash-mountains", "dagorlad", "eastern-emyn-muil", "eastern-brown-lands"], [], false),
      "southern-dorwinion": initRegion ("southern-dorwinion", "Southern Dorwinion", null, false, null, ["northern-dorwinion", "south-rhun", "ash-mountains", "noman-lands", "southern-rhovanion"], [], false),
      "northern-dorwinion": initRegion ("northern-dorwinion", "Northern Dorwinion", null, false, null, ["vale-of-the-celduin", "north-rhun", "southern-dorwinion", "southern-rhovanion"], [], false),
      "southern-rhovanion": initRegion ("southern-rhovanion", "Southern Rhovanion", null, false, null, ["northern-rhovanion", "vale-of-the-celduin", "northern-dorwinion", "southern-dorwinion", "noman-lands", "eastern-brown-lands", "southern-mirkwood"], [], false),
      "northern-rhovanion": initRegion ("northern-rhovanion", "Northern Rhovanion", null, false, null, ["dale", "vale-of-the-carnen", "vale-of-the-celduin", "southern-rhovanion", "southern-mirkwood", "eastern-mirkwood"], [], false),
      "vale-of-the-celduin": initRegion ("vale-of-the-celduin", "Vale of the Celduin", null, false, null, ["vale-of-the-carnen", "north-rhun", "northern-dorwinion", "southern-rhovanion", "northern-rhovanion"], [], false),
      "vale-of-the-carnen": initRegion ("vale-of-the-carnen", "Vale of the Carnen", null, false, null, ["iron-hills", "east-rhun", "north-rhun", "vale-of-the-celduin", "northern-rhovanion", "dale"], [], false),
      "eastern-mirkwood": initRegion ("eastern-mirkwood", "Eastern Mirkwood", null, false, null, ["old-forest-road", "northern-rhovanion", "southern-mirkwood", "dol-guldur", "narrows-of-the-forest"], [], false),
      "narrows-of-the-forest": initRegion ("narrows-of-the-forest", "Narrows of the Forest", null, false, null, ["old-forest-road", "eastern-mirkwood", "dol-guldur", "north-anduin-vale", "rhosgobel"], [], false),
      "dol-guldur": initRegion ("dol-guldur", "Dol Guldur", "sauron", false, "stronghold", ["north-anduin-vale", "narrows-of-the-forest", "eastern-mirkwood", "southern-mirkwood", "eastern-brown-lands", "western-brown-lands", "south-anduin-vale"], [], false),
      "southern-mirkwood": initRegion ("southern-mirkwood", "Southern Mirkwood", null, false, null, ["eastern-mirkwood", "northern-rhovanion", "southern-rhovanion", "eastern-brown-lands", "dol-guldur"], [], false),
      "old-forest-road": initRegion ("old-forest-road", "Old Forest Road", "north", false, null, ["woodland-realm", "dale", "northern-rhovanion", "eastern-mirkwood", "narrows-of-the-forest", "rhosgobel", "carrock", "western-mirkwood"], [], false),
      "western-mirkwood": initRegion ("western-mirkwood", "Western Mirkwood", null, false, null, ["northern-mirkwood", "woodland-realm", "old-forest-road", "carrock"], [], false),
      "northern-mirkwood": initRegion ("northern-mirkwood", "Northern Mirkwood", null, false, null, ["carrock", "western-mirkwood", "woodland-realm", "withered-heath"], [], false),
      "withered-heath": initRegion ("withered-heath", "Withered Heath", null, false, null, ["northern-mirkwood", "woodland-realm", "dale", "erebor"], [], false),
      "woodland-realm": initRegion ("woodland-realm", "Woodland Realm", "elves", false, null, ["northern-mirkwood", "withered-heath", "dale", "old-forest-road", "western-mirkwood"], [], false),
      dale: initRegion ("dale", "Dale", "north", false, "city", [], [], false),
      erebor: initRegion ("erebor", "Erebor", "dwarves", false, "stronghold", [], [], false),
      "iron-hills": initRegion ("iron-hills", "Iron Hills", "dwarves", false, "town", [], [], false),
      "north-rhun": initRegion ("north-rhun", "North Rhun", "southrons", false, "town", [], [], false),
      "east-rhun": initRegion ("east-rhun", "East Rhun", "southrons", false, null, [], [], false),
      "south-rhun": initRegion ("south-rhun", "South Rhun", "southrons", false, "town", [], [], false),
      morannon: initRegion ("morannon", "Morannon", "sauron", false, "stronghold", [], [], false),
      "minas-morgul": initRegion ("minas-morgul", "Minas Morgul", "sauron", false, "stronghold", [], [], false),
      gorgoroth: initRegion ("gorgoroth", "Gorgoroth", "sauron", false, null, [], [], false),
      nurn: initRegion ("nurn", "Nurn", "sauron", false, "town", [], [], false),
      "barad-dur": initRegion ("barad-dur", "Barad-dur", "sauron", false, "stronghold", [], [], false),
      "west-harondor": initRegion ("west-harondor", "West Harondor", null, false, null, [], [], true),
      "east-harondor": initRegion ("east-harondor", "East Harondor", null, false, null, [], [], false),
      umbar: initRegion ("umbar", "Umbar", "southrons", false, "stronghold", [], [], true),
      "near-harad": initRegion ("near-harad", "Near Harad", "southrons", false, "town", [], [], false),
      "far-harad": initRegion ("far-harad", "Far Harad", "southrons", false, "city", [], [], false),
      khand: initRegion ("khand", "Khand", "southrons", false, null, [], [], false),
    }
  };
}

function initRegion (
  id: WotrRegionId, name: string, nationId: WotrNationId | null,
  fortification: boolean, settlement: WotrSettlentType | null,
  passableNeighbors: WotrRegionId[],
  impassableNeighbors: WotrRegionId[],
  seaside: boolean
): WotrRegion {
  const neighbors: WotrNeighbor[] = [];
  passableNeighbors.forEach (neighborId => neighbors.push ({ id: neighborId, impassable: false }));
  impassableNeighbors.forEach (neighborId => neighbors.push ({ id: neighborId, impassable: true }));
  return {
    id: id,
    name: name,
    nationId: nationId,
    fortification: fortification,
    settlement: settlement,
    neighbors: neighbors,
    seaside: seaside,
    fellowship: false,
    armyUnits: [],
    leaders: [],
    nNazgul: 0,
    companions: [],
    minions: []
  };
}

export function getRegion (id: WotrRegionId, state: WotrRegionState) { return state.map[id]; }
export function getRegions (state: WotrRegionState) { return state.ids.map (id => state.map[id]); }

// export function removeRegularsFromReinforcements (quantity: number, region: WotrRegion) {
//   return { ...region, reinforcements: { ...region.reinforcements, regular: region.reinforcements.regular - quantity } };
// }

export function addRegularsToRegion (nationId: WotrNationId, frontId: WotrFrontId, quantity: number, region: WotrRegion): WotrRegion {
  return addArmyUnitsToRegion ("regular", nationId, frontId, quantity, region);
}

export function addElitesToRegion (nationId: WotrNationId, frontId: WotrFrontId, quantity: number, region: WotrRegion): WotrRegion {
  return addArmyUnitsToRegion ("elite", nationId, frontId, quantity, region);
}

export function addArmyUnitsToRegion (unitType: WotrArmyUnitType, nationId: WotrNationId, frontId: WotrFrontId, quantity: number, region: WotrRegion): WotrRegion {
  const index = region.armyUnits.findIndex ((u) => u.type === unitType && u.nationId === nationId);
  if (index >= 0) {
    const unit = region.armyUnits[index];
    return {
      ...region,
      armyUnits: immutableUtil.listReplaceByIndex (index, { ...unit, quantity: unit.quantity + quantity }, region.armyUnits),
    };
  } else {
    return {
      ...region,
      armyUnits: immutableUtil.listPush ([{ type: unitType, nationId, frontId, quantity }], region.armyUnits),
    };
  }
}

export function addLeadersToRegion (nationId: WotrNationId, quantity: number, region: WotrRegion): WotrRegion {
  const index = region.leaders.findIndex ((u) => u.nationId === nationId);
  if (index >= 0) {
    const unit = region.leaders[index];
    return {
      ...region,
      leaders: immutableUtil.listReplaceByIndex (index, { ...unit, quantity: unit.quantity + quantity }, region.leaders),
    };
  } else {
    return {
      ...region,
      leaders: immutableUtil.listPush ([{ nationId, quantity, type: "leader" }], region.leaders),
    };
  }
}

export function addNazgulToRegion (quantity: number, region: WotrRegion): WotrRegion {
  return { ...region, nNazgul: region.nNazgul + quantity };
}

export function addFellowshipToRegion (region: WotrRegion): WotrRegion {
  return { ...region, fellowship: true };
}


