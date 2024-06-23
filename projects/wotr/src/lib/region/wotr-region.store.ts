import { Injectable, Signal, computed, inject } from "@angular/core";
import { immutableUtil } from "@leobg/commons/utils";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrCharacterStore } from "../character/wotr-character.store";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrNationId, frontOfNation } from "../nation/wotr-nation.models";
import { WotrArmyUtils } from "../unit/wotr-army.utils";
import { WotrArmy, WotrFreeUnits, WotrUnits } from "../unit/wotr-unit.models";
import { WotrNeighbor, WotrRegion, WotrRegionId, WotrSettlentType } from "./wotr-region.models";

export interface WotrRegionState {
  map: Record<WotrRegionId, WotrRegion>;
  ids: WotrRegionId[];
}

@Injectable ({
  providedIn: "root"
})
export class WotrRegionStore {

  private armyUtil = inject (WotrArmyUtils);
  private characterStore = inject (WotrCharacterStore);

  update!: (actionName: string, updater: (a: WotrRegionState) => WotrRegionState) => void;
  state!: Signal<WotrRegionState>;

  regions = computed (() => { const s = this.state (); return s.ids.map (id => s.map[id]); });
  region (regionId: WotrRegionId): WotrRegion { return this.state ().map[regionId]; }
  isCharacterInRegion (character: WotrCharacterId, regionId: WotrRegionId) {
    const region = this.region (regionId);
    return region.army?.characters?.includes (character) || region.freeUnits?.characters?.includes (character);
  }
  isNazgulInRegion (regionId: WotrRegionId) {
    const region = this.region (regionId);
    return !!region.army?.nNazgul || !!region.freeUnits?.nNazgul || this.isCharacterInRegion ("the-witch-king", regionId);
  }
  isArmyInRegion (frontId: WotrFrontId, regionId: WotrRegionId) {
    const region = this.region (regionId);
    return region.army?.front === frontId;
  }

  init (): WotrRegionState {
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
        forlindon: this.initRegion ("forlindon", "Forlindon", null, false, null, ["grey-havens"], ["north-ered-luin", "ered-luin"], true),
        "north-ered-luin": this.initRegion ("north-ered-luin", "North Ered Luin", "dwarves", false, null, ["ered-luin", "evendim"], ["forlindon"], true),
        "ered-luin": this.initRegion ("ered-luin", "Ered Luin", "dwarves", false, "town", ["north-ered-luin", "evendim", "tower-hills", "grey-havens"], ["forlindon"], false),
        "grey-havens": this.initRegion ("grey-havens", "Grey Havens", "elves", false, "stronghold", ["forlindon", "ered-luin", "tower-hills", "harlindon"], [], true),
        harlindon: this.initRegion ("harlindon", "Harlindon", null, false, null, ["grey-havens", "south-ered-luin"], ["tower-hills"], true),
        "tower-hills": this.initRegion ("tower-hills", "Tower Hills", null, false, null, ["grey-havens", "ered-luin", "evendim", "the-shire", "south-ered-luin"], ["harlindon"], false),
        evendim: this.initRegion ("evendim", "Evendim", null, false, null, ["arnor", "north-downs", "buckland", "the-shire", "tower-hills", "ered-luin", "north-ered-luin"], [], true),
        arnor: this.initRegion ("arnor", "Arnor", null, false, null, ["angmar", "ettenmoors", "north-downs", "evendim"], [], false),
        "north-downs": this.initRegion ("north-downs", "North Downs", "north", false, null, ["arnor", "ettenmoors", "weather-hills", "bree", "buckland", "evendim"], [], false),
        bree: this.initRegion ("bree", "Bree", "north", false, "town", ["north-downs", "weather-hills", "south-downs", "buckland"], [], false),
        buckland: this.initRegion ("buckland", "Buckland", "north", false, null, ["north-downs", "bree", "south-downs", "cardolan", "old-forest", "the-shire", "evendim"], [], false),
        "the-shire": this.initRegion ("the-shire", "The Shire", "north", false, "city", ["evendim", "buckland", "old-forest", "south-ered-luin", "tower-hills"], [], false),
        "south-ered-luin": this.initRegion ("south-ered-luin", "South Ered Luin", null, false, null, ["the-shire", "old-forest", "cardolan", "minhiriath", "harlindon", "tower-hills"], [], true),
        minhiriath: this.initRegion ("minhiriath", "Minhiriath", null, false, null, ["south-ered-luin", "cardolan", "tharbad", "enedwaith"], [], true),
        cardolan: this.initRegion ("cardolan", "Cardolan", null, false, null, ["old-forest", "buckland", "south-downs", "north-dunland", "tharbad", "minhiriath", "south-ered-luin"], [], false),
        "old-forest": this.initRegion ("old-forest", "Old Forest", null, false, null, ["buckland", "cardolan", "south-ered-luin", "the-shire"], [], false),
        "south-downs": this.initRegion ("south-downs", "South Downs", null, false, null, ["bree", "weather-hills", "troll-shaws", "hollin", "north-dunland", "cardolan", "buckland"], [], false),
        "weather-hills": this.initRegion ("weather-hills", "Weather Hills", null, false, null, ["ettenmoors", "troll-shaws", "south-downs", "bree", "north-downs"], [], false),
        ettenmoors: this.initRegion ("ettenmoors", "Ettenmoors", null, false, null, ["angmar", "mount-gram", "troll-shaws", "weather-hills", "north-downs", "arnor"], ["mount-gundabad"], false),
        angmar: this.initRegion ("angmar", "Angmar", "sauron", false, "city", ["mount-gram", "ettenmoors", "arnor"], [], false),
        "mount-gram": this.initRegion ("mount-gram", "Mount Gram", "sauron", false, null, ["angmar", "mount-gundabad", "ettenmoors"], [], false),
        "mount-gundabad": this.initRegion ("mount-gundabad", "Mount Gundabad", "sauron", false, "stronghold", ["mount-gram", "eagles-eyre"], ["ettenmoors", "troll-shaws", "rivendell", "carrock"], false),
        "troll-shaws": this.initRegion ("troll-shaws", "Troll Shaws", null, false, null, ["rivendell", "fords-of-bruinen", "hollin", "south-downs", "weather-hills", "ettenmoors"], ["mount-gundabad"], false),
        rivendell: this.initRegion ("rivendell", "Rivendell", "elves", false, "stronghold", ["fords-of-bruinen", "troll-shaws"], ["mount-gundabad", "eagles-eyre", "old-ford", "goblins-gate", "high-pass"], false),
        "fords-of-bruinen": this.initRegion ("fords-of-bruinen", "Fords of Bruinen", null, false, null, ["rivendell", "high-pass", "hollin", "troll-shaws"], ["moria"], false),
        hollin: this.initRegion ("hollin", "Hollin", null, false, null, ["fords-of-bruinen", "moria", "north-dunland", "south-downs", "troll-shaws"], [], false),
        moria: this.initRegion ("moria", "Moria", "sauron", false, "stronghold", ["hollin", "dimrill-dale", "north-dunland"], ["fords-of-bruinen", "high-pass", "goblins-gate", "old-ford", "gladden-fields"], false),
        "north-dunland": this.initRegion ("north-dunland", "North Dunland", null, false, "town", ["hollin", "moria", "south-dunland", "tharbad", "cardolan", "south-downs"], ["lorien", "parth-celebrant", "fangorn"], false),
        tharbad: this.initRegion ("tharbad", "Tharbad", null, false, null, ["cardolan", "north-dunland", "south-dunland", "enedwaith", "minhiriath"], [], false),
        "south-dunland": this.initRegion ("south-dunland", "South Dunland", null, false, "town", ["north-dunland", "gap-of-rohan", "enedwaith", "tharbad"], ["fangorn", "orthanc"], false),
        enedwaith: this.initRegion ("enedwaith", "Enedwaith", null, false, null, ["tharbad", "south-dunland", "gap-of-rohan", "druwaith-iaur", "minhiriath"], [], true),
        "gap-of-rohan": this.initRegion ("gap-of-rohan", "Gap of Rohan", null, false, null, ["south-dunland", "orthanc", "fords-of-isen", "druwaith-iaur", "enedwaith"], [], false),
        orthanc: this.initRegion ("orthanc", "Orthanc", null, false, "stronghold", ["fords-of-isen", "gap-of-rohan"], ["south-dunland", "fangorn"], false),
        "druwaith-iaur": this.initRegion ("druwaith-iaur", "Druwaith Iaur", null, false, null, ["enedwaith", "gap-of-rohan", "fords-of-isen", "andrast"], ["anfalas"], true),
        andrast: this.initRegion ("andrast", "Andrast", null, false, null, ["druwaith-iaur", "anfalas"], [], true),
        "high-pass": this.initRegion ("high-pass", "High-pass", null, false, null, ["goblins-gate", "fords-of-bruinen"], ["rivendell", "moria"], false),
        "goblins-gate": this.initRegion ("goblins-gate", "Goblins Gate", null, false, null, ["high-pass", "old-ford"], ["rivendell", "moria"], false),
        "eagles-eyre": this.initRegion ("eagles-eyre", "Eagle's Eyre", null, false, null, ["mount-gundabad", "carrock", "old-ford"], ["rivendell"], false),
        "old-ford": this.initRegion ("old-ford", "Old Ford", null, false, null, ["eagles-eyre", "carrock", "rhosgobel", "gladden-fields", "goblins-gate"], ["moria", "rivendell"], false),
        "gladden-fields": this.initRegion ("gladden-fields", "Gladden Fields", null, false, null, ["old-ford", "rhosgobel", "north-anduin-vale", "dimrill-dale"], ["moria"], false),
        "dimrill-dale": this.initRegion ("dimrill-dale", "Dimrill Dale", null, false, null, ["gladden-fields", "north-anduin-vale", "south-anduin-vale", "parth-celebrant", "lorien"], [], false),
        lorien: this.initRegion ("lorien", "Lorien", "elves", false, "stronghold", ["dimrill-dale", "parth-celebrant"], ["moria", "north-dunland"], false),
        "parth-celebrant": this.initRegion ("parth-celebrant", "Parth Celebrant", null, false, null, ["lorien", "south-anduin-vale", "western-brown-lands", "eastemnet", "fangorn"], ["north-dunland"], false),
        fangorn: this.initRegion ("fangorn", "Fangorn", null, false, null, ["parth-celebrant", "eastemnet", "westemnet", "fords-of-isen"], ["north-dunland", "south-dunland", "orthanc"], false),
        "fords-of-isen": this.initRegion ("fords-of-isen", "Fords of Isen", "rohan", true, null, ["gap-of-rohan", "orthanc", "fangorn", "westemnet", "helms-deep", "druwaith-iaur"], ["anfalas"], false),
        "helms-deep": this.initRegion ("helms-deep", "Helms Deep", "rohan", false, "stronghold", ["fords-of-isen", "westemnet"], ["anfalas", "erech"], false),
        westemnet: this.initRegion ("westemnet", "Westemnet", "rohan", false, "town", ["fangorn", "eastemnet", "folde", "edoras", "helms-deep", "fords-of-isen"], ["erech"], false),
        edoras: this.initRegion ("edoras", "Edoras", "rohan", false, "city", ["westemnet", "folde"], ["erech", "lamedon"], false),
        folde: this.initRegion ("folde", "Folde", "rohan", false, "town", ["edoras", "westemnet", "eastemnet", "druadan-forest"], ["lamedon"], false),
        eastemnet: this.initRegion ("eastemnet", "Eastemnet", "rohan", false, null, ["fangorn", "parth-celebrant", "western-brown-lands", "western-emyn-muil", "druadan-forest", "folde", "westemnet"], [], false),
        anfalas: this.initRegion ("anfalas", "Anfalas", "gondor", false, null, ["andrast", "erech", "dol-amroth"], ["fords-of-isen", "helms-deep"], true),
        erech: this.initRegion ("erech", "Erech", "gondor", false, null, ["anfalas", "dol-amroth", "lamedon"], ["helms-deep", "westemnet", "edoras"], false),
        "dol-amroth": this.initRegion ("dol-amroth", "Dol Amroth", "gondor", false, "stronghold", ["anfalas", "erech", "lamedon"], [], true),
        lamedon: this.initRegion ("lamedon", "Lamedon", "gondor", false, "town", ["erech", "dol-amroth", "pelargir"], ["edoras", "folde", "lossarnach", "minas-tirith", "druadan-forest"], false),
        pelargir: this.initRegion ("pelargir", "Pelargir", "gondor", false, "city", ["lamedon", "lossarnach", "osgiliath", "west-harondor"], [], true),
        lossarnach: this.initRegion ("lossarnach", "Lossarnach", "gondor", false, "town", ["minas-tirith", "osgiliath", "pelargir"], ["lamedon"], false),
        "minas-tirith": this.initRegion ("minas-tirith", "Minas Tirith", "gondor", false, "stronghold", ["druadan-forest", "osgiliath", "lossarnach"], ["lamedon"], false),
        "druadan-forest": this.initRegion ("druadan-forest", "Druadan Forest", "gondor", false, null, ["folde", "eastemnet", "western-emyn-muil", "dead-marshes", "osgiliath", "minas-tirith"], ["lamedon"], false),
        carrock: this.initRegion ("carrock", "Carrock", "north", false, "town", ["eagles-eyre", "old-ford", "rhosgobel", "old-forest-road", "western-mirkwood", "northern-mirkwood"], ["mount-gundabad"], false),
        rhosgobel: this.initRegion ("rhosgobel", "Rhosgobel", "north", false, null, ["carrock", "old-forest-road", "narrows-of-the-forest", "north-anduin-vale", "gladden-fields", "old-ford"], [], false),
        "north-anduin-vale": this.initRegion ("north-anduin-vale", "North Anduin Vale", null, false, null, ["rhosgobel", "narrows-of-the-forest", "dol-guldur", "south-anduin-vale", "dimrill-dale", "gladden-fields"], [], false),
        "south-anduin-vale": this.initRegion ("south-anduin-vale", "South Anduin Vale", null, false, null, ["north-anduin-vale", "dol-guldur", "western-brown-lands", "parth-celebrant", "dimrill-dale"], [], false),
        "western-brown-lands": this.initRegion ("western-brown-lands", "Western Brown Lands", null, false, null, ["south-anduin-vale", "dol-guldur", "eastern-brown-lands", "western-emyn-muil", "eastemnet", "parth-celebrant"], [], false),
        "western-emyn-muil": this.initRegion ("western-emyn-muil", "Western Emyn Muil", null, false, null, ["western-brown-lands", "eastern-brown-lands", "eastern-emyn-muil", "dead-marshes", "druadan-forest", "eastemnet"], [], false),
        "dead-marshes": this.initRegion ("dead-marshes", "Dead Marshes", null, false, null, ["western-emyn-muil", "eastern-emyn-muil", "north-ithilien", "osgiliath", "druadan-forest"], [], false),
        osgiliath: this.initRegion ("osgiliath", "Osgiliath", null, true, null, ["dead-marshes", "north-ithilien", "south-ithilien", "west-harondor", "pelargir", "lossarnach", "minas-tirith", "druadan-forest"], [], false),
        "south-ithilien": this.initRegion ("south-ithilien", "South Ithilien", null, false, null, ["north-ithilien", "minas-morgul", "east-harondor", "west-harondor", "osgiliath"], ["gorgoroth", "nurn"], false),
        "north-ithilien": this.initRegion ("north-ithilien", "North Ithilien", null, false, null, ["eastern-emyn-muil", "dagorlad", "minas-morgul", "south-ithilien", "osgiliath", "dead-marshes"], ["morannon"], false),
        "eastern-emyn-muil": this.initRegion ("eastern-emyn-muil", "Eastern Emyn Muil", null, false, null, ["eastern-brown-lands", "noman-lands", "dagorlad", "north-ithilien", "dead-marshes", "western-emyn-muil"], [], false),
        "eastern-brown-lands": this.initRegion ("eastern-brown-lands", "Eastern Brown Lands", null, false, null, ["southern-mirkwood", "southern-rhovanion", "noman-lands", "eastern-emyn-muil", "western-emyn-muil", "western-brown-lands", "dol-guldur"], [], false),
        dagorlad: this.initRegion ("dagorlad", "Dagorlad", null, false, null, ["noman-lands", "ash-mountains", "morannon", "north-ithilien", "eastern-emyn-muil"], [], false),
        "ash-mountains": this.initRegion ("ash-mountains", "Ash Mountains", null, false, null, ["dagorlad", "noman-lands", "southern-dorwinion", "south-rhun"], ["morannon", "barad-dur"], false),
        "noman-lands": this.initRegion ("noman-lands", "Noman-Lands", null, false, null, ["southern-rhovanion", "southern-dorwinion", "ash-mountains", "dagorlad", "eastern-emyn-muil", "eastern-brown-lands"], [], false),
        "southern-dorwinion": this.initRegion ("southern-dorwinion", "Southern Dorwinion", null, false, null, ["northern-dorwinion", "south-rhun", "ash-mountains", "noman-lands", "southern-rhovanion"], [], false),
        "northern-dorwinion": this.initRegion ("northern-dorwinion", "Northern Dorwinion", null, false, null, ["vale-of-the-celduin", "north-rhun", "southern-dorwinion", "southern-rhovanion"], [], false),
        "southern-rhovanion": this.initRegion ("southern-rhovanion", "Southern Rhovanion", null, false, null, ["northern-rhovanion", "vale-of-the-celduin", "northern-dorwinion", "southern-dorwinion", "noman-lands", "eastern-brown-lands", "southern-mirkwood"], [], false),
        "northern-rhovanion": this.initRegion ("northern-rhovanion", "Northern Rhovanion", null, false, null, ["dale", "vale-of-the-carnen", "vale-of-the-celduin", "southern-rhovanion", "southern-mirkwood", "eastern-mirkwood"], [], false),
        "vale-of-the-celduin": this.initRegion ("vale-of-the-celduin", "Vale of the Celduin", null, false, null, ["vale-of-the-carnen", "north-rhun", "northern-dorwinion", "southern-rhovanion", "northern-rhovanion"], [], false),
        "vale-of-the-carnen": this.initRegion ("vale-of-the-carnen", "Vale of the Carnen", null, false, null, ["iron-hills", "east-rhun", "north-rhun", "vale-of-the-celduin", "northern-rhovanion", "dale"], [], false),
        "eastern-mirkwood": this.initRegion ("eastern-mirkwood", "Eastern Mirkwood", null, false, null, ["old-forest-road", "northern-rhovanion", "southern-mirkwood", "dol-guldur", "narrows-of-the-forest"], [], false),
        "narrows-of-the-forest": this.initRegion ("narrows-of-the-forest", "Narrows of the Forest", null, false, null, ["old-forest-road", "eastern-mirkwood", "dol-guldur", "north-anduin-vale", "rhosgobel"], [], false),
        "dol-guldur": this.initRegion ("dol-guldur", "Dol Guldur", "sauron", false, "stronghold", ["north-anduin-vale", "narrows-of-the-forest", "eastern-mirkwood", "southern-mirkwood", "eastern-brown-lands", "western-brown-lands", "south-anduin-vale"], [], false),
        "southern-mirkwood": this.initRegion ("southern-mirkwood", "Southern Mirkwood", null, false, null, ["eastern-mirkwood", "northern-rhovanion", "southern-rhovanion", "eastern-brown-lands", "dol-guldur"], [], false),
        "old-forest-road": this.initRegion ("old-forest-road", "Old Forest Road", "north", false, null, ["woodland-realm", "dale", "northern-rhovanion", "eastern-mirkwood", "narrows-of-the-forest", "rhosgobel", "carrock", "western-mirkwood"], [], false),
        "western-mirkwood": this.initRegion ("western-mirkwood", "Western Mirkwood", null, false, null, ["northern-mirkwood", "woodland-realm", "old-forest-road", "carrock"], [], false),
        "northern-mirkwood": this.initRegion ("northern-mirkwood", "Northern Mirkwood", null, false, null, ["carrock", "western-mirkwood", "woodland-realm", "withered-heath"], [], false),
        "withered-heath": this.initRegion ("withered-heath", "Withered Heath", null, false, null, ["northern-mirkwood", "woodland-realm", "dale", "erebor"], [], false),
        "woodland-realm": this.initRegion ("woodland-realm", "Woodland Realm", "elves", false, "stronghold", ["northern-mirkwood", "withered-heath", "dale", "old-forest-road", "western-mirkwood"], [], false),
        dale: this.initRegion ("dale", "Dale", "north", false, "city", [], [], false),
        erebor: this.initRegion ("erebor", "Erebor", "dwarves", false, "stronghold", [], [], false),
        "iron-hills": this.initRegion ("iron-hills", "Iron Hills", "dwarves", false, "town", [], [], false),
        "north-rhun": this.initRegion ("north-rhun", "North Rhun", "southrons", false, "town", [], [], false),
        "east-rhun": this.initRegion ("east-rhun", "East Rhun", "southrons", false, null, [], [], false),
        "south-rhun": this.initRegion ("south-rhun", "South Rhun", "southrons", false, "town", [], [], false),
        morannon: this.initRegion ("morannon", "Morannon", "sauron", false, "stronghold", [], [], false),
        "minas-morgul": this.initRegion ("minas-morgul", "Minas Morgul", "sauron", false, "stronghold", [], [], false),
        gorgoroth: this.initRegion ("gorgoroth", "Gorgoroth", "sauron", false, null, [], [], false),
        nurn: this.initRegion ("nurn", "Nurn", "sauron", false, "town", [], [], false),
        "barad-dur": this.initRegion ("barad-dur", "Barad-dur", "sauron", false, "stronghold", [], [], false),
        "west-harondor": this.initRegion ("west-harondor", "West Harondor", null, false, null, [], [], true),
        "east-harondor": this.initRegion ("east-harondor", "East Harondor", null, false, null, [], [], false),
        umbar: this.initRegion ("umbar", "Umbar", "southrons", false, "stronghold", [], [], true),
        "near-harad": this.initRegion ("near-harad", "Near Harad", "southrons", false, "town", [], [], false),
        "far-harad": this.initRegion ("far-harad", "Far Harad", "southrons", false, "city", [], [], false),
        khand: this.initRegion ("khand", "Khand", "southrons", false, null, [], [], false),
      }
    };
  }

  initRegion (
    id: WotrRegionId, name: string, nationId: WotrNationId | null,
    fortification: boolean, settlement: WotrSettlentType | null,
    passableNeighbors: WotrRegionId[],
    impassableNeighbors: WotrRegionId[],
    seaside: boolean
  ): WotrRegion {
    const neighbors: WotrNeighbor[] = [];
    passableNeighbors.forEach (neighborId => neighbors.push ({ id: neighborId, impassable: false }));
    impassableNeighbors.forEach (neighborId => neighbors.push ({ id: neighborId, impassable: true }));
    const region: WotrRegion = {
      id: id,
      name: name,
      ...(nationId ? { nationId } : { }),
      ...(fortification ? { fortification } : { }),
      ...(settlement ? { settlement } : { }),
      neighbors: neighbors,
      seaside: seaside,
      fellowship: false,
    };
    if (settlement && nationId) { region.controlledBy = frontOfNation (nationId); }
    return region;
  }

  private updateRegion (actionName: string, regionId: WotrRegionId, updater: (a: WotrRegion) => WotrRegion) {
    this.update (actionName, s => ({ ...s, map: { ...s.map, [regionId]: updater (s.map[regionId]) } }));
  }

  private updateArmy (actionName: string, regionId: WotrRegionId, updater: (a: WotrArmy | undefined) => (WotrArmy | undefined)) {
    this.updateRegion (actionName, regionId, region => {
      const { army, ...restRegion } = region;
      const newArmy = updater (army);
      return newArmy ? { ...restRegion, army: newArmy } : restRegion;
    });
    this.joinNazgulToArmy (regionId);
    this.joinCharactersToArmy (regionId);
  }

  private updateArmyUnderSiege (actionName: string, regionId: WotrRegionId, updater: (a: WotrArmy | undefined) => (WotrArmy | undefined)) {
    this.updateRegion (actionName, regionId, region => {
      const { underSiegeArmy, ...restRegion } = region;
      const newArmy = updater (underSiegeArmy);
      return newArmy ? { ...restRegion, underSiegeArmy: newArmy } : restRegion;
    });
    this.joinNazgulToArmy (regionId);
    this.joinCharactersToArmy (regionId);
  }

  private updateFreeUnits (actionName: string, regionId: WotrRegionId, updater: (a: WotrFreeUnits | undefined) => WotrFreeUnits) {
    this.updateRegion (actionName, regionId, region => {
      const { freeUnits, ...restRegion } = region;
      const newFreeUnits = updater (freeUnits);
      if (!newFreeUnits.characters?.length &&
        !newFreeUnits.nNazgul
      ) { return restRegion; }
      return { ...restRegion, freeUnits: newFreeUnits };
    });
  }

  private joinNazgulToArmy (regionId: WotrRegionId) {
    const region = this.region (regionId);
    if (region.army?.front === "shadow") {
      const nNazgul = region.freeUnits?.nNazgul;
      if (nNazgul) {
        this.removeNazgulFromFreeUnits (nNazgul, regionId);
        this.addNazgulToArmy (nNazgul, regionId);
      }
    }
  }

  private joinCharactersToArmy (regionId: WotrRegionId) {
    const region = this.region (regionId);
    if (!region.army?.front) { return; }
    const characters = region.freeUnits?.characters;
    characters?.forEach (characterId => {
      const character = this.characterStore.character (characterId);
      if (character.front === region.army?.front) {
        this.removeCharacterFromFreeUnits (characterId, regionId);
        this.addCharacterToArmy (characterId, regionId);
      }
    });
  }
  addRegularsToArmy (quantity: number, nation: WotrNationId, regionId: WotrRegionId) { this.updateArmy ("addRegularsToArmy", regionId, army => this.armyUtil.addRegulars (quantity, nation, army)); }
  removeRegularsFromArmy (quantity: number, nation: WotrNationId, regionId: WotrRegionId) { this.updateArmy ("removeRegularsFromArmy", regionId, army => this.armyUtil.removeRegulars (quantity, nation, army)); }
  addElitesToArmy (quantity: number, nation: WotrNationId, regionId: WotrRegionId) { this.updateArmy ("addElitesToArmy", regionId, army => this.armyUtil.addElites (quantity, nation, army)); }
  removeElitesFromArmy (quantity: number, nation: WotrNationId, regionId: WotrRegionId) { this.updateArmy ("removeElitesFromArmy", regionId, army => this.armyUtil.removeElites (quantity, nation, army)); }
  addLeadersToArmy (quantity: number, nation: WotrNationId, regionId: WotrRegionId) { this.updateArmy ("addLeadersToArmy", regionId, army => this.armyUtil.addLeaders (quantity, nation, army)); }
  removeLeadersFromArmy (quantity: number, nation: WotrNationId, regionId: WotrRegionId) { this.updateArmy ("removeLeadersFromArmy", regionId, army => this.armyUtil.removeLeaders (quantity, nation, army)); }
  addNazgulToArmy (quantity: number, regionId: WotrRegionId) { this.updateArmy ("addNazgulToArmy", regionId, army => this.armyUtil.addNazgul (quantity, army)); }
  removeNazgulFromArmy (quantity: number, regionId: WotrRegionId) { this.updateArmy ("removeNazgulFromArmy", regionId, army => this.armyUtil.removeNazgul (quantity, army)); }
  
  addRegularsToArmyUnderSiege (quantity: number, nation: WotrNationId, regionId: WotrRegionId) { this.updateArmyUnderSiege ("addRegularsToArmyUnderSiege", regionId, army => this.armyUtil.addRegulars (quantity, nation, army)); }
  removeRegularsFromArmyUnderSiege (quantity: number, nation: WotrNationId, regionId: WotrRegionId) { this.updateArmyUnderSiege ("removeRegularsFromArmyUnderSiege", regionId, army => this.armyUtil.removeRegulars (quantity, nation, army)); }
  addElitesToArmyUnderSiege (quantity: number, nation: WotrNationId, regionId: WotrRegionId) { this.updateArmyUnderSiege ("addElitesToArmyUnderSiege", regionId, army => this.armyUtil.addElites (quantity, nation, army)); }
  removeElitesFromArmyUnderSiege (quantity: number, nation: WotrNationId, regionId: WotrRegionId) { this.updateArmyUnderSiege ("removeElitesFromArmyUnderSiege", regionId, army => this.armyUtil.removeElites (quantity, nation, army)); }
  addLeadersToArmyUnderSiege (quantity: number, nation: WotrNationId, regionId: WotrRegionId) { this.updateArmyUnderSiege ("addLeadersToArmyUnderSiege", regionId, army => this.armyUtil.addLeaders (quantity, nation, army)); }
  removeLeadersFromArmyUnderSiege (quantity: number, nation: WotrNationId, regionId: WotrRegionId) { this.updateArmyUnderSiege ("removeLeadersFromArmyUnderSiege", regionId, army => this.armyUtil.removeLeaders (quantity, nation, army)); }
  addNazgulToArmyUnderSiege (quantity: number, regionId: WotrRegionId) { this.updateArmyUnderSiege ("addNazgulToArmyUnderSiege", regionId, army => this.armyUtil.addNazgul (quantity, army)); }
  removeNazgulFromArmyUnderSiege (quantity: number, regionId: WotrRegionId) { this.updateArmyUnderSiege ("removeNazgulFromArmyUnderSiege", regionId, army => this.armyUtil.removeNazgul (quantity, army)); }

  addNazgulToFreeUnits (quantity: number, regionId: WotrRegionId) {
    this.updateFreeUnits ("addNazgulToFreeUnits", regionId, freeUnits => {
      if (!freeUnits) { freeUnits = { }; }
      return { ...freeUnits, nNazgul: (freeUnits.nNazgul || 0) + quantity };
    });
  }

  removeNazgulFromFreeUnits (quantity: number, regionId: WotrRegionId) {
    this.updateFreeUnits ("removeNazgulFromFreeUnits", regionId, freeUnits => {
      if (!freeUnits) { throw new Error ("removeNazgulFromFreeUnits"); }
      return { ...freeUnits, nNazgul: (freeUnits.nNazgul || 0) - quantity };
    });
  }

  addCharacterToArmy (characterId: WotrCharacterId, regionId: WotrRegionId) {
    this.updateArmy ("addCharacterToArmy", regionId, army => this.armyUtil.addCharacter (characterId, army));
  }

  removeCharacterFromArmy (characterId: WotrCharacterId, regionId: WotrRegionId) {
    this.updateArmy ("removeCharacterFromArmy", regionId, army => this.armyUtil.removeCharacter (characterId, army));
  }

  moveArmy (fromRegionId: WotrRegionId, toRegionId: WotrRegionId, leftUnits?: WotrUnits) {
    const fromRegion = this.region (fromRegionId);
    const toRegion = this.region (toRegionId);
    const fromArmy = fromRegion.army;
    const movingArmy = this.armyUtil.splitUnits (fromArmy, leftUnits);
    if (leftUnits && this.armyUtil.hasArmyUnits (leftUnits)) {
      this.updateArmy ("moveArmy", fromRegionId, () => this.armyUtil.unitsToArmy (leftUnits));
    } else {
      this.updateArmy ("moveArmy", fromRegionId, () => leftUnits as any);
      this.freeNazgulFromArmy (fromRegionId);
      this.freeCharactersFromArmy (fromRegionId);
    }

    const toArmy = toRegion.army;
    const mergedArmy = this.armyUtil.mergeArmies (toArmy, movingArmy);
    this.updateArmy ("moveArmy", toRegionId, () => mergedArmy);
  }

  private freeNazgulFromArmy (regionId: WotrRegionId) {
    const region = this.region (regionId);
    const army = region.army;
    if (army?.nNazgul && !this.armyUtil.hasArmyUnits (army)) {
      this.removeNazgulFromArmy (army.nNazgul, regionId);
      this.addNazgulToFreeUnits (army.nNazgul, regionId);
    }
  }

  private freeCharactersFromArmy (regionId: WotrRegionId) {
    const region = this.region (regionId);
    const army = region.army;
    if (army?.characters && !this.armyUtil.hasArmyUnits (army)) {
      for (const character of army.characters) {
        this.removeCharacterFromArmy (character, regionId);
        this.addCharacterToFreeUnits (character, regionId);
      }
    }
  }

  addCharacterToFreeUnits (characterId: WotrCharacterId, regionId: WotrRegionId) {
    this.updateFreeUnits ("addCharacterToFreeUnits", regionId, freeunits => {
      if (!freeunits) { freeunits = { }; }
      return { ...freeunits, characters: immutableUtil.listPush ([characterId], freeunits.characters || []) }
    });
  }

  removeCharacterFromFreeUnits (characterId: WotrCharacterId, regionId: WotrRegionId) {
    this.updateFreeUnits ("removeCharacterFromFreeUnits", regionId, freeunits => {
      if (!freeunits?.characters) { throw new Error ("removeCharacterFromFreeUnits"); }
      return { ...freeunits, characters: immutableUtil.listRemoveFirst (c => c === characterId, freeunits.characters || []) };
    });
  }

  moveArmyIntoSiege (regionId: WotrRegionId) {
    this.updateRegion ("moveArmyIntoSiege", regionId, region => {
      const { army, ...newRegion } = region;
      if (!army) { throw new Error ("moveArmyIntoSiege"); }
      return {
        ...newRegion,
        underSiegeArmy: army
      };
    });
  }

  moveArmyOutOfSiege (regionId: WotrRegionId) {
    this.updateRegion ("moveArmyOutOfSiege", regionId, region => {
      const { underSiegeArmy, ...newRegion } = region;
      if (!underSiegeArmy) { throw new Error ("moveArmyOutOfSiege"); }
      return {
        ...newRegion,
        army: underSiegeArmy
      };
    });
  }

  addFellowshipToRegion (regionId: WotrRegionId) {
    this.updateRegion ("addFellowshipToRegion", regionId, units => ({
      ...units, fellowship: true
    }));
  }

  removeFellowshipFromRegion () {
    this.updateRegion ("removeFellowshipFromRegion", this.getFellowshipRegion (), units => ({
      ...units, fellowship: false
    }));
  }

  getFellowshipRegion () {
    const state = this.state ();
    return this.state ().ids.find (r => state.map[r].fellowship)!;
  }

  moveFellowshipToRegion (regionId: WotrRegionId) {
    this.update ("moveFellowshipToRegion", state => {
      const fromRegionId = state.ids.find (r => state.map[r].fellowship)!;
      const toRegionId = state.ids.find (r => r === regionId)!;
      return {
        ...state,
        map: {
          ...state.map,
          [fromRegionId]: { ...state.map[fromRegionId], fellowship: false },
          [toRegionId]: { ...state.map[toRegionId], fellowship: true }
        }
      };
    });
  }

  setControlledBy (front: WotrFrontId, regionId: WotrRegionId) {
    this.updateRegion ("setControlledBy", regionId, region => ({
      ...region,
      controlledBy: front
    }));
  }

}
